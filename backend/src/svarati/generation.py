"""Penyusunan prompt, pemanggilan Gemini, dan pemeriksaan jawaban terhadap sumber."""
import logging
import re
import threading
import time

from . import config, labels

log = logging.getLogger("svarati")


def build_prompt(message, results, facts, emotions, providers, history=None):
    """Susun isi prompt: sumber, layanan terverifikasi, kondisi pengguna, riwayat, lalu pertanyaan."""
    history_text = "\n".join(
        f"{labels.PROMPT_ROLE_USER if h['role'] == 'user' else labels.PROMPT_ROLE_BOT}: {h['text']}"
        for h in (history or [])) or labels.PROMPT_NONE
    sources_text = "\n\n".join(f"[{i}] ({r['entry_type']}) {r['display_title']}\n{r['chunk_text']}"
                               for i, r in enumerate(results, 1))
    providers_text = "\n".join(
        f"- {p['provider_name']} ({p['provider_type']}, {p['city']})"
        + (f" | Telp: {p['phone_number']}" if p.get("phone_number") else "")
        + (f" | Jam: {p['operating_hours']}" if p.get("operating_hours") else "")
        for p in providers) or labels.PROMPT_NO_PROVIDERS
    conditions_text = "\n".join(list(facts) + list(emotions)) or labels.PROMPT_NONE
    return labels.PROMPT_TEMPLATE.format(
        sources=sources_text, providers=providers_text, conditions=conditions_text,
        history=history_text, message=message)


def find_unsourced_articles(answer, valid_text):
    """Pasal yang disebut di jawaban tetapi tidak ada di sumber."""
    pattern = r"pasal\s+(\d+[A-Za-z]?)(?![A-Za-z])"
    mentioned = {m.upper() for m in re.findall(pattern, answer, re.IGNORECASE)}
    present = {m.upper() for m in re.findall(pattern, valid_text, re.IGNORECASE)}
    return sorted(mentioned - present)


def find_unsourced_phones(answer, valid_text):
    """Nomor telepon di jawaban yang tidak ditemukan di sumber atau layanan."""
    valid_digits = re.sub(r"\D", "", valid_text)
    unsourced = []
    for match in re.findall(r"\+?\d[\d\s\-().]{4,}\d", answer):
        if re.fullmatch(r"(?:19|20)\d{2}\D+(?:19|20)\d{2}", match.strip()):
            continue  # rentang tahun, bukan nomor telepon
        digits = re.sub(r"\D", "", match)
        if len(digits) >= 5 and digits not in valid_digits:
            unsourced.append(match.strip())
    return unsourced


def build_correction(articles, phones):
    """Instruksi tambahan untuk percobaan ulang, menyebut item yang tidak ada di sumber."""
    details = []
    if articles:
        details.append(labels.CORRECTION_ARTICLES.format(items=", ".join(articles)))
    if phones:
        details.append(labels.CORRECTION_PHONES.format(items=", ".join(phones)))
    return labels.CORRECTION_TEMPLATE.format(details=" ".join(details))


def strip_unsourced(answer, articles, phones):
    """Buang nomor telepon dan pasal yang tidak ada di sumber, supaya jawaban tetap bisa dikirim."""
    for phone in phones:
        answer = answer.replace(phone, "")
    for article in articles:
        answer = re.sub(rf"pasal\s+{re.escape(article)}(?![0-9A-Za-z])",
                        labels.UNSOURCED_ARTICLE_REPLACEMENT, answer, flags=re.IGNORECASE)
    answer = re.sub(r"\(\s*\)", "", answer)
    answer = re.sub(r"[ \t]{2,}", " ", answer)
    answer = re.sub(r"\(\s*[.,;:]*\s*\)", "", answer)   # kurung kosong / hanya tanda baca
    answer = re.sub(r"\s*\(\s*(?=[.,;:])", "", answer)  # kurung buka yang tertinggal
    answer = re.sub(r"\s+([.,;:])", r"\1", answer)
    return re.sub(r"[ \t]{2,}", " ", answer).strip()


_client = None
_client_lock = threading.Lock()


def _get_client():
    """Client dibuat sekali per proses (bukan per panggilan)."""
    global _client
    with _client_lock:
        if _client is None:
            from google import genai
            from google.genai import types

            _client = genai.Client(
                api_key=config.GEMINI_API_KEY,
                http_options=types.HttpOptions(timeout=int(config.GEMINI_TIMEOUT_SECONDS * 1000),
                                               api_version="v1beta"),
            )
        return _client


def build_gemini_config(model, types):
    """Config per model. Gemini 3.x: thinking_level dan temperature bawaan (sesuai dokumentasi Google).
    Gemini 2.5 Flash: thinking_budget=0 dan temperature 0.3. Model lain: tanpa pengaturan thinking."""
    kwargs = dict(system_instruction=labels.SYSTEM_PROMPT, max_output_tokens=config.GEMINI_MAX_OUTPUT_TOKENS)
    thinking = None
    if model.startswith("gemini-3"):
        thinking = {"thinking_level": config.GEMINI_THINKING_LEVEL}
    else:
        kwargs["temperature"] = 0.3
        if model.startswith("gemini-2.5") and "pro" not in model:  # 2.5 Pro tidak bisa mematikan thinking
            thinking = {"thinking_budget": 0}
    if thinking:
        try:
            return types.GenerateContentConfig(thinking_config=types.ThinkingConfig(**thinking), **kwargs)
        except Exception as exc:  # SDK lama belum mengenal thinking_level
            log.warning("thinking_config tidak didukung SDK (%s); jalan tanpa. Jalankan: pip install -U google-genai",
                        type(exc).__name__)
    return types.GenerateContentConfig(**kwargs)


def call_gemini(prompt, attempts=None):
    """Kirim prompt ke Gemini; coba ulang untuk error sementara (429/500/503/504)."""
    if not config.GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY belum diisi di backend/.env")
    from google.genai import errors, types

    attempts = config.GEMINI_ATTEMPTS if attempts is None else attempts
    client = _get_client()
    models = [config.GEMINI_MODEL, config.GEMINI_FALLBACK_MODEL]
    for i in range(attempts):
        model = models[0] if i == 0 else models[-1]  # percobaan pertama model utama, sisanya cadangan
        try:
            response = client.models.generate_content(
                model=model, contents=prompt, config=build_gemini_config(model, types))
            return (response.text or "").strip()
        except (errors.ServerError, errors.ClientError) as exc:
            code = getattr(exc, "code", None)
            if code not in (429, 500, 503, 504) or i == attempts - 1:
                raise
            time.sleep(1.5 * (i + 1))