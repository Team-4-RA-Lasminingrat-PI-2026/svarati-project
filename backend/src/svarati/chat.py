"""Orkestrasi satu giliran tanya-jawab: gerbang keselamatan -> pencarian -> Gemini -> pemeriksaan.

Dibagi dua tahap agar koneksi database tidak ditahan selama menunggu Gemini:
  prepare()         -> butuh database (gerbang, pencarian, layanan, penyusunan prompt)
  finish()          -> tanpa database (panggil Gemini, periksa jawaban)
  answer_question() -> menjalankan keduanya berurutan.
"""
import logging
import re

from . import assessment, generation, labels, retrieval, services
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
    return f"{previous[-1][:300]} {message}" if previous else message


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
    if not answer:
        # Bisa karena filter keamanan Gemini; jangan dinyatakan sebagai "tidak ada informasi".
        return {"mode": labels.MODE_LLM_EMPTY, "answer": labels.ANSWER_FAILED_REPLY, "chunks": []}

    # Judul ikut dihitung: pasal yang terpecah jadi beberapa bagian hanya memuat "Pasal N" di judulnya.
    valid_text = "\n".join(f"{r['display_title']}\n{r['chunk_text']}" for r in results) + "\n" + "\n".join(
        f"{p['provider_name']} {p.get('phone_number') or ''} {p.get('address') or ''}" for p in providers)

    def verify_answer(text):
        return (generation.find_unsourced_articles(text, valid_text),
                generation.find_unsourced_phones(text, valid_text))

    articles, phones = verify_answer(answer)
    if articles or phones:
        # Satu kali percobaan ulang dengan menyebut item yang tidak ada di sumber.
        try:
            retry = generation.call_gemini(stage["prompt"] + generation.build_correction(articles, phones))
        except Exception as exc:
            log.error("Percobaan ulang Gemini gagal: %s", type(exc).__name__)
            retry = ""
        if retry:
            answer = retry
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

    return {"mode": labels.MODE_RAG, "answer": answer, "chunks": results,
            "mentions_provider": _mentions_provider(answer, providers),
            "warnings": {"pasal_tidak_ada_di_sumber": [], "nomor_tidak_ada_di_sumber": []}}


def answer_question(conn, embedder, questionnaire, message, answers=None, city=None, is_first_turn=True,
                    history=None):
    """Kembalikan dict: mode, answer, chunks (hasil pencarian), dan warnings (mode 'rag')."""
    return finish(prepare(conn, embedder, questionnaire, message, answers, city, is_first_turn, history))


def list_sources(conn, chunks):
    """Ubah chunk hasil pencarian menjadi daftar sumber untuk UI (judul unik, plus slug dan link resmi)."""
    if not chunks:
        return []
    entry_ids = sorted({c["entry_id"] for c in chunks})
    extra = {}
    try:
        from psycopg2.extras import RealDictCursor

        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""SELECT entry_id, slug, official_source_url
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
            "entry_type": chunk.get("entry_type"),
            "article_number": chunk.get("article_number"),
            "page": chunk.get("page_number"),
            "slug": entry.get("slug"),
            "official_source_url": entry.get("official_source_url"),
            "similarity": round(float(chunk["sim"]), 4),
        })
    return sources
