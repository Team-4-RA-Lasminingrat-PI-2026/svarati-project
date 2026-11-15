"""Penyusunan prompt, pemanggilan Gemini, dan pemeriksaan jawaban terhadap sumber."""
import re

from . import config, labels


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
    return re.sub(r"\s+([.,;:])", r"\1", answer).strip()


def call_gemini(prompt):
    """Kirim prompt ke Gemini; kembalikan teks jawaban (string kosong jika tidak ada)."""
    if not config.GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY belum diisi di backend/.env")
    from google import genai
    from google.genai import types

    client = genai.Client(api_key=config.GEMINI_API_KEY)
    response = client.models.generate_content(
        model=config.GEMINI_MODEL, contents=prompt,
        config=types.GenerateContentConfig(system_instruction=labels.SYSTEM_PROMPT, temperature=0.3))
    return (response.text or "").strip()
