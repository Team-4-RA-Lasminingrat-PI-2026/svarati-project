"""Periksa kesesuaian data Cek Kondisi di database (topic_hints, kode opsi, flag darurat, dll).

  python scripts/check_assessment.py
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from svarati import assessment  # noqa: E402
from svarati.assessment_check import ISSUE_TAG, check_assessment_data  # noqa: E402
from svarati.db import close_pool, connection  # noqa: E402


def main():
    try:
        with connection() as conn:
            questionnaire = assessment.load_assessment(conn)
            with conn.cursor() as cur:
                cur.execute("SELECT topic_code FROM public.knowledge_topics")
                topics = {r[0] for r in cur.fetchall()}
    finally:
        close_pool()
    option_count = sum(len(assessment.options_of(questionnaire, q)) for q in questionnaire)
    print(f"{len(questionnaire)} pertanyaan, {option_count} opsi aktif, {len(topics)} topik di knowledge_topics")
    findings = check_assessment_data(questionnaire, topics)
    for t in findings:
        print(t)
    issues = [t for t in findings if t.startswith(ISSUE_TAG)]
    print("\nHasil:", "ada masalah" if issues else "tidak ada masalah", f"({len(findings)} temuan)")
    sys.exit(1 if issues else 0)


if __name__ == "__main__":
    main()
