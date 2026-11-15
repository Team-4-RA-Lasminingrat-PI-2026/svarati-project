"""Pemeriksaan kesesuaian data Cek Kondisi di database. Fungsi murni (tanpa database)."""
from . import labels
from .assessment import options_of

ISSUE_TAG = "[MASALAH]"
NOTE_TAG = "[CATATAN]"

# Kode opsi yang dirujuk aturan kartu hasil di Hasil.jsx. Perbarui jika aturan di sana berubah.
RESULT_CARD_OPTION_CODES = {
    "q1": {"c"},
    "q2": {"b", "c"},
    "q3": {"a"},
    "q4": {"d", "h"},
    "q5": {"b", "c", "d"},
    "q6": {"a", "c", "d"},
}
REQUIRED_QUESTIONS = ["q1", "q2", "q3", "q4", "q5", "q6"]
ENTRY_TYPES = {"hukum", "panduan_dukungan", "prosedur", "layanan", "checklist", "edukasi"}


def check_assessment_data(questionnaire, valid_topics, required_codes=None):
    """Kembalikan daftar teks '[MASALAH] ...' atau '[CATATAN] ...'. Kosong berarti tidak ada temuan."""
    required_codes = RESULT_CARD_OPTION_CODES if required_codes is None else required_codes
    findings = []
    for q_code in REQUIRED_QUESTIONS:
        if q_code not in questionnaire:
            findings.append(f"{ISSUE_TAG} {q_code}: pertanyaan tidak ada atau tidak aktif")
    for q_code, codes in required_codes.items():
        for code in sorted(codes):
            if q_code in questionnaire and code not in options_of(questionnaire, q_code):
                findings.append(
                    f"{ISSUE_TAG} {q_code}.{code}: dipakai aturan kartu Hasil.jsx tetapi tidak ada di database")
    if "q1" in questionnaire and not any(o.get("is_emergency") for o in options_of(questionnaire, "q1").values()):
        findings.append(f"{ISSUE_TAG} q1: tidak ada opsi darurat (is_emergency)")

    for q_code in sorted(questionnaire):
        options = options_of(questionnaire, q_code)
        codes = sorted(options)
        if codes != [chr(ord("a") + i) for i in range(len(codes))]:
            findings.append(f"{NOTE_TAG} {q_code}: kode opsi {codes} ada celah; urutan tampil mengikuti kode")
        for code, option in sorted(options.items()):
            for topic in option.get("topic_hints") or []:
                if topic not in valid_topics:
                    findings.append(f"{ISSUE_TAG} {q_code}.{code}: topic_hints '{topic}' tidak ada di knowledge_topics")
            if option.get("entry_type") and option["entry_type"] not in ENTRY_TYPES:
                findings.append(f"{ISSUE_TAG} {q_code}.{code}: entry_type '{option['entry_type']}' tidak dikenal")
            if option.get("is_emergency") and q_code != "q1":
                findings.append(f"{ISSUE_TAG} {q_code}.{code}: is_emergency hanya boleh untuk q1")
            prefix = labels.QUERY_LABELS.get(q_code)
            query_text = (option.get("query_text") or "").strip()
            if prefix and query_text and not query_text.startswith(prefix + ":"):
                findings.append(
                    f"{NOTE_TAG} {q_code}.{code}: query_text tidak diawali '{prefix}:' (dipakai apa adanya)")
    return findings
