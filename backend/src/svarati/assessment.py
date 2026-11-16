"""Cek Kondisi (tabel self_assessment_*): memuat pertanyaan/opsi dan menurunkan rencana pencarian.

Bentuk data "questionnaire": {q_code: {"_meta": {...}, option_code: {...}}}.
Bentuk jawaban "answers": {q_code: [option_code, ...]}.
"""
import time

from . import labels
from .safety import detect_emergency

_cache = {"at": 0.0, "questionnaire": None}

_SQL_ACTIVE_OPTIONS = """
    SELECT q.q_code, q.question_text, q.allows_multiple,
           o.option_code, o.option_label, o.query_text,
           o.topic_hints, o.entry_type, o.is_emergency
    FROM public.self_assessment_questions q
    JOIN public.self_assessment_options o USING (question_id)
    WHERE q.is_active AND o.is_active
    ORDER BY q.q_code, o.option_code"""


def load_assessment(conn):
    """Muat pertanyaan dan opsi aktif dari database. Kosong jika tabel belum diisi."""
    from psycopg2.extras import RealDictCursor

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(_SQL_ACTIVE_OPTIONS)
        rows = cur.fetchall()
    return build_questionnaire(rows)


def build_questionnaire(rows):
    questionnaire = {}
    for row in rows:
        question = questionnaire.setdefault(row["q_code"], {"_meta": {
            "question_text": row["question_text"],
            "allows_multiple": bool(row["allows_multiple"]),
        }})
        question[row["option_code"]] = dict(row)
    return questionnaire


def get_assessment(conn, ttl=300):
    """Questionnaire dengan cache ttl detik, supaya tidak query database di setiap chat."""
    now = time.time()
    if _cache["questionnaire"] is None or now - _cache["at"] > ttl:
        _cache["questionnaire"] = load_assessment(conn)
        _cache["at"] = now
    return _cache["questionnaire"]


def options_of(questionnaire, q_code):
    """Opsi satu pertanyaan (tanpa _meta)."""
    return {k: v for k, v in questionnaire.get(q_code, {}).items() if k != "_meta"}


def normalize_answers(questionnaire, answers):
    """Buang kode yang tidak dikenal; pertanyaan pilihan tunggal hanya mengambil satu pilihan."""
    normalized = {}
    if not isinstance(answers, dict):
        return normalized
    for q_code in questionnaire:
        value = answers.get(q_code)
        if value is None:
            continue
        values = list(value) if isinstance(value, (list, tuple, set)) else [value]
        available = options_of(questionnaire, q_code)
        valid_codes = [code for code in values if isinstance(code, str) and code in available]
        if not questionnaire[q_code]["_meta"]["allows_multiple"]:
            valid_codes = valid_codes[:1]
        if valid_codes:
            normalized[q_code] = valid_codes
    return normalized


def selected_options(answers, q_code):
    """Kode opsi yang dipilih untuk satu pertanyaan (selalu berupa list)."""
    value = (answers or {}).get(q_code)
    if value is None:
        return []
    return list(value) if isinstance(value, (list, tuple, set)) else [value]


def is_emergency_input(questionnaire, answers, message=None, include_answers=True):
    """True jika pesan memuat pola bahaya, atau (hanya jika include_answers) ada opsi is_emergency terpilih.

    Jawaban asesmen cukup memicu jalur darurat pada giliran pertama; jika diperiksa di setiap pesan,
    pengguna yang pernah memilih opsi darurat tidak akan pernah bisa memakai chat biasa.
    """
    if include_answers:
        for q_code in questionnaire:
            for code in selected_options(answers, q_code):
                if options_of(questionnaire, q_code).get(code, {}).get("is_emergency"):
                    return True
    return detect_emergency(message)


def build_search_plan(questionnaire, answers):
    """Topik dan tipe dokumen yang diprioritaskan (boost) saat pencarian."""
    topics, entry_types = set(), set()
    for q_code in questionnaire:
        for code in selected_options(answers, q_code):
            option = options_of(questionnaire, q_code).get(code)
            if not option:
                continue
            topics.update(option["topic_hints"] or [])
            if option["entry_type"]:
                entry_types.add(option["entry_type"])
    return {"topics": sorted(topics), "entry_types": sorted(entry_types)}


def build_query_phrase(option, name):
    """query_text dipakai apa adanya (di database sudah berformat 'Lokasi: ...').
    Jika kosong, bentuk '{name}: {label}.'"""
    query_text = (option.get("query_text") or "").strip()
    if query_text:
        return query_text
    label = (option.get("option_label") or "").strip().rstrip(".")
    return f"{name}: {label}."


def build_condition_facts(questionnaire, answers, query_labels=None):
    """Kalimat fakta kondisi pengguna untuk query pencarian dan prompt."""
    facts = []
    for q_code, name in (query_labels or labels.QUERY_LABELS).items():
        options = options_of(questionnaire, q_code)
        facts.extend(build_query_phrase(options[code], name)
                     for code in selected_options(answers, q_code) if code in options)
    return facts


def build_emotion_facts(questionnaire, answers):
    """Gambaran emosi pengguna: '{nama}: label1; label2'."""
    facts = []
    for q_code, name in labels.EMOTION_LABELS.items():
        options = options_of(questionnaire, q_code)
        option_labels = [options[code]["option_label"]
                         for code in selected_options(answers, q_code) if code in options]
        if option_labels:
            facts.append(f"{name}: " + "; ".join(option_labels))
    return facts


def compose_query(message, questionnaire, answers):
    """Query pencarian: pertanyaan pengguna + fakta kondisi."""
    return " ".join([f"{labels.QUERY_PREFIX}: {message}"] + build_condition_facts(questionnaire, answers))
