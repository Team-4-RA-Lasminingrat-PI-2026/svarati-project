"""Orkestrasi satu giliran tanya-jawab: gerbang keselamatan -> pencarian -> Gemini -> pemeriksaan.

Dibagi dua tahap agar koneksi database tidak ditahan selama menunggu Gemini:
  prepare()         -> butuh database (gerbang, pencarian, layanan, penyusunan prompt)
  finish()          -> tanpa database (panggil Gemini, periksa jawaban)
  answer_question() -> menjalankan keduanya berurutan.
"""
import logging
import re

from . import assessment, config, generation, labels, retrieval, services
from .safety import normalize_text

log = logging.getLogger("svarati")

# Sapaan murni tidak perlu pencarian sumber maupun Gemini.
_GREETING_RE = re.compile(
    r"^(?:ha+i+|ha+lo+|hello|hi+|hey|p|test|tes|assalamu ?alaikum|permisi|"
    r"selamat (?:pagi|siang|sore|malam))(?: (?:kak|min|svarati|admin|semua|ai))?$"
)


def _is_greeting_only(message):
    return bool(_GREETING_RE.match(normalize_text(message)))


def _safe_rollback(conn):
    try:
        conn.rollback()
    except Exception:
        pass


def _load_providers_safely(conn, city):
    """Layanan bersifat tambahan: jika gagal dimuat, jawaban tetap dibuat tanpa daftar layanan."""
    try:
        return services.get_verified_providers(conn, city)
    except Exception as exc:
        log.error("Layanan terverifikasi gagal dimuat: %s", type(exc).__name__)
        _safe_rollback(conn)
        return []


def _expand_query_with_history(message, history):
    """Pesan pendek ("kalau yang itu?") dilengkapi pertanyaan pengguna sebelumnya
    agar pencarian tidak kehilangan konteks."""
    if len(message) >= 80 or not history:
        return message
    previous = [h["text"] for h in history if h.get("role") == "user"]
    if not previous:
        return message
    # Jawaban singkat ("ya") membawa sedikit makna; pakai dua pesan pengguna terakhir agar topiknya tidak hilang.
    short = normalize_text(message) in _SHORT_REPLIES or len(message) < 15
    context = " ".join(t[:200] for t in previous[-2:]) if short else previous[-1][:300]
    return f"{context} {message}"


# Jawaban singkat yang wajar sebagai balasan atas tawaran atau pertanyaan Svarati ("ya", "mau", "ga").
_SHORT_REPLIES = {"ya", "yaa", "y", "iya", "iyaa", "ok", "oke", "okey", "sip", "siap", "yuk", "mau", "boleh",
                  "gak", "ga", "nggak", "ngga", "enggak", "tidak", "lanjut", "tolong"}


def _is_too_short(message, history=None):
    """Pesan tanpa cukup huruf (misal 'd') tidak dicari, supaya tidak ikut konteks pertanyaan sebelumnya.
    Pengecualian: jawaban singkat seperti "ya" boleh lolos jika sudah ada riwayat percakapan."""
    if history and normalize_text(message) in _SHORT_REPLIES:
        return False
    return len(re.findall(r"[^\W\d_]", message or "")) < 3


def _mentions_provider(answer, providers):
    """True jika jawaban menyebut salah satu layanan terverifikasi (nama atau nomor teleponnya)."""
    text = answer.lower()
    digits = re.sub(r"\D", "", answer)
    for provider in providers:
        name = (provider.get("provider_name") or "").lower()
        if name and name in text:
            return True
        phone = re.sub(r"\D", "", provider.get("phone_number") or "")
        if len(phone) >= 5 and phone in digits:
            return True
    return False


def prepare(conn, embedder, questionnaire, message, answers=None, city=None, is_first_turn=True, history=None):
    """Tahap 1. Kembalikan {'done': hasil_akhir} bila tidak perlu Gemini (darurat / sapaan / tanpa sumber),
    atau {'done': None, 'prompt', 'results', 'providers'} untuk dilanjutkan ke finish()."""
    normalized_answers = assessment.normalize_answers(questionnaire, answers)

    if assessment.is_emergency_input(questionnaire, normalized_answers, message, include_answers=is_first_turn):
        return {"done": {"mode": labels.MODE_EMERGENCY, "answer": services.get_emergency_message(conn),
                         "chunks": []}}

    if _is_greeting_only(message):
        return {"done": {"mode": labels.MODE_GREETING, "answer": labels.GREETING_REPLY, "chunks": []}}

    if _is_too_short(message, history):
        return {"done": {"mode": labels.MODE_CLARIFY, "answer": labels.CLARIFY_REPLY, "chunks": []}}

    plan = assessment.build_search_plan(questionnaire, normalized_answers)
    query = assessment.compose_query(_expand_query_with_history(message, history), questionnaire,
                                     normalized_answers)
    results = retrieval.search_chunks(conn, embedder, query, plan)
    if not results:
        return {"done": {"mode": labels.MODE_NO_SOURCE, "answer": labels.NO_SOURCE_REPLY, "chunks": []}}

    providers = _load_providers_safely(conn, city)
    prompt = generation.build_prompt(
        message, results,
        assessment.build_condition_facts(questionnaire, normalized_answers),
        assessment.build_emotion_facts(questionnaire, normalized_answers),
        providers, history)
    return {"done": None, "prompt": prompt, "results": results, "providers": providers}


SOURCE_TAG = re.compile(r"\[\[\s*SUMBER\s*:\s*([\d,\s]*)\]\]", re.IGNORECASE)


def split_source_tag(answer, results):
    """Pisahkan baris [[SUMBER: 1,3]] dari jawaban. Kembalikan (jawaban_bersih, chunk_yang_dipakai).
    Tag kosong = tanpa sumber (kecuali pasal yang disebut di jawaban cocok dengan chunk).
    Tag hilang sama sekali = pakai chunk dengan pasal yang disebut, atau chunk teratas."""
    clean = SOURCE_TAG.sub("", answer or "").strip()
    indices = []
    for m in SOURCE_TAG.finditer(answer or ""):
        for part in m.group(1).split(","):
            part = part.strip()
            if part.isdigit() and 1 <= int(part) <= len(results) and int(part) not in indices:
                indices.append(int(part))
    used = [results[i - 1] for i in indices]
    if not used and results:
        cited = cited_articles(clean)
        used = [r for r in results if str(r.get("article_number") or "") in cited]
        if not used and not SOURCE_TAG.search(answer or ""):
            # Tag hilang sama sekali (model lupa): pakai chunk teratas supaya jawaban bersumber artikel tetap
            # punya kartu sumber. Tag kosong ([[SUMBER: ]]) adalah keputusan sengaja: tidak ada sumber.
            used = results[:1]
    return clean, used


# Proses berpikir model yang bocor ke jawaban ("Drafting:", "Periksa aturan", "Aturan 17: ...").
_LEAK_RE = re.compile(r"(?im)^\s*(drafting|periksa aturan|mode (dukungan|informasi|pesan ringan|luar topik)\b|"
                      r"aturan \d+\s*:|pesan ringan\.|luar topik\.|pengguna (?:membuat|menulis|bertanya|menanyakan|"
                      r"bercerita|mengatakan|menyebut|meminta|mengungkapkan)\b)")
_LEAK_CORRECTION = ("\n\nKOREKSI: Tulis HANYA jawaban akhir untuk pengguna, tanpa proses berpikir, "
                    "nama mode, atau nomor aturan.")


def finish(stage):
    """Tahap 2 (tanpa koneksi database): panggil Gemini lalu periksa Pasal dan nomor telepon."""
    if stage["done"] is not None:
        return stage["done"]
    results, providers = stage["results"], stage["providers"]
    try:
        answer = generation.call_gemini(stage["prompt"])
    except Exception as exc:  # jangan bocorkan detail ke pengguna
        log.error("Pemanggilan Gemini gagal: %s", type(exc).__name__)
        return {"mode": labels.MODE_LLM_ERROR, "chunks": [], "answer": labels.LLM_ERROR_REPLY}
    answer, used = split_source_tag(answer, results)
    if answer and _LEAK_RE.search(answer):
        log.warning("Jawaban memuat proses berpikir; mencoba ulang sekali")
        try:
            retry = generation.call_gemini(stage["prompt"] + _LEAK_CORRECTION)
        except Exception as exc:
            log.error("Percobaan ulang Gemini gagal: %s", type(exc).__name__)
            retry = ""
        answer, used = split_source_tag(retry, results)
        if answer and _LEAK_RE.search(answer):
            answer = ""  # tetap bocor: jangan tampilkan teks mentah
    if not answer:
        # Bisa karena filter keamanan Gemini; jangan dinyatakan sebagai "tidak ada informasi".
        return {"mode": labels.MODE_LLM_EMPTY, "answer": labels.ANSWER_FAILED_REPLY, "chunks": []}

    # Judul ikut dihitung: pasal yang terpecah jadi beberapa bagian hanya memuat "Pasal N" di judulnya.
    valid_text = "\n".join(f"{r['display_title']}\n{r['chunk_text']}" for r in results) + "\n" + "\n".join(
        f"{p['provider_name']} {p.get('phone_number') or ''} {p.get('address') or ''} "
        f"{p.get('operating_hours') or ''}" for p in providers)

    def verify_answer(text):
        return (generation.find_unsourced_articles(text, valid_text),
                generation.find_unsourced_phones(text, valid_text))

    articles, phones = verify_answer(answer)
    if config.VERIFY_RETRY and (articles or phones):
        # Satu kali percobaan ulang dengan menyebut item yang tidak ada di sumber.
        try:
            retry = generation.call_gemini(stage["prompt"] + generation.build_correction(articles, phones))
        except Exception as exc:
            log.error("Percobaan ulang Gemini gagal: %s", type(exc).__name__)
            retry = ""
        retry, retry_used = split_source_tag(retry, results)
        if retry:
            answer = retry
            used = retry_used
            articles, phones = verify_answer(answer)

    if articles or phones:
        # Item yang tidak ada di sumber dibuang, bukan menggagalkan seluruh jawaban.
        log.info("Item tak bersumber dibuang: %d pasal, %d nomor", len(articles), len(phones))
        answer = generation.strip_unsourced(answer, articles, phones)
        articles, phones = verify_answer(answer)

    if articles or phones:
        # Hanya jumlahnya yang dicatat, bukan isi jawaban.
        log.warning("Jawaban ditolak: %d pasal dan %d nomor tidak ada di sumber", len(articles), len(phones))
        return {"mode": labels.MODE_VERIFICATION_FAILED, "answer": labels.ANSWER_FAILED_REPLY, "chunks": []}

    return {"mode": labels.MODE_RAG, "answer": answer, "chunks": results, "used_chunks": used,
            "mentions_provider": _mentions_provider(answer, providers),
            "warnings": {"pasal_tidak_ada_di_sumber": [], "nomor_tidak_ada_di_sumber": []}}


def answer_question(conn, embedder, questionnaire, message, answers=None, city=None, is_first_turn=True,
                    history=None):
    """Kembalikan dict: mode, answer, chunks (hasil pencarian), dan warnings (mode 'rag')."""
    return finish(prepare(conn, embedder, questionnaire, message, answers, city, is_first_turn, history))

def cited_articles(answer):
    """Nomor pasal yang disebut di jawaban, misalnya {'68', '69'}."""
    return set(re.findall(r"[Pp]asal\s+(\d+[A-Za-z]?)", answer))

def list_sources(conn, chunks):
    """Ubah chunk hasil pencarian menjadi daftar sumber untuk UI (judul unik, plus slug dan link resmi)."""
    if not chunks:
        return []
    entry_ids = sorted({c["entry_id"] for c in chunks})
    extra = {}
    try:
        from psycopg2.extras import RealDictCursor

        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""SELECT entry_id, slug, official_source_url, show_in_education, is_active,
                                  (content_md IS NOT NULL AND content_md <> '') AS has_content
                           FROM public.knowledge_entries WHERE entry_id = ANY(%s)""", (entry_ids,))
            extra = {r["entry_id"]: r for r in cur.fetchall()}
    except Exception as exc:  # sumber tetap tampil (tanpa tautan) walau metadata gagal dimuat
        log.error("Metadata sumber gagal dimuat: %s", type(exc).__name__)
        _safe_rollback(conn)
    sources, seen_titles = [], set()
    for chunk in chunks:
        if chunk["display_title"] in seen_titles:
            continue
        seen_titles.add(chunk["display_title"])
        entry = extra.get(chunk["entry_id"], {})
        sources.append({
            "title": chunk["display_title"],
            "doc_title": chunk.get("title"),
            "entry_type": chunk.get("entry_type"),
            "article_number": chunk.get("article_number"),
            "page": chunk.get("page_number"),
            "slug": entry.get("slug"),
            # Artikel yang tayang di edukasi: baris sumber menuju halaman artikel, bukan dokumen asli
            "article_slug": entry.get("slug") if (entry.get("show_in_education") and entry.get("is_active")
                                                  and entry.get("has_content")) else None,
            "official_source_url": entry.get("official_source_url"),
            "similarity": round(float(chunk["sim"]), 4),
        })
    return sources