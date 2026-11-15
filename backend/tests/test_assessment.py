import json
import os
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from svarati import assessment
from svarati.assessment_check import check_assessment_data

VALID_TOPICS = {"keamanan_diri", "pelecehan_nonfisik", "pelecehan_fisik", "pemaksaan_hubungan", "hukum_tpks",
         "hak_perempuan", "kesehatan_mental", "medis_visum"}

with open(os.path.join(os.path.dirname(__file__), "fixtures", "self_assessment.json"), encoding="utf-8") as f:
    ROWS = json.load(f)  # salinan data asli dari database
QUESTIONNAIRE = assessment.build_questionnaire(ROWS)

# Jawaban yang dikirim halaman: string (pilihan tunggal), array (pilihan banyak), null (dilewati)
ANSWERS = {"q1": "c", "q2": "a", "q3": "c", "q4": ["c", "d"], "q5": "b", "q6": "a"}


class TestRealData(unittest.TestCase):
    def test_structured(self):
        self.assertEqual(sorted(QUESTIONNAIRE), ["q1", "q2", "q3", "q4", "q5", "q6"])
        self.assertEqual(len(ROWS), 29)
        self.assertTrue(QUESTIONNAIRE["q4"]["_meta"]["allows_multiple"])
        self.assertFalse(QUESTIONNAIRE["q1"]["_meta"]["allows_multiple"])

    def test_checker_finds_no_problems(self):
        self.assertEqual([t for t in check_assessment_data(QUESTIONNAIRE, VALID_TOPICS) if t.startswith("[MASALAH]")], [])

    def test_checker_detects_errors(self):
        import copy
        rows = copy.deepcopy(ROWS)
        for r in rows:
            if (r["q_code"], r["option_code"]) == ("q2", "a"):
                r["topic_hints"] = ["salah_ketik"]
                r["is_emergency"] = True
            if (r["q_code"], r["option_code"]) == ("q4", "d"):
                r["entry_type"] = "tidak_dikenal"
        rows = [r for r in rows if (r["q_code"], r["option_code"]) != ("q6", "c")]
        text = "\n".join(check_assessment_data(assessment.build_questionnaire(rows), VALID_TOPICS))
        for expected in ("q2.a: topic_hints 'salah_ketik'", "q2.a: is_emergency hanya boleh untuk q1",
                      "q4.d: entry_type 'tidak_dikenal'", "q6.c: dipakai aturan kartu Hasil.jsx"):
            self.assertIn(expected, text)

    def test_query_text_used_as_is(self):
        q = assessment.compose_query("Apa yang harus kulakukan?", QUESTIONNAIRE, ANSWERS)
        self.assertEqual(
            q,
            "Pertanyaan: Apa yang harus kulakukan? Lokasi: Online (chat, medsos). "
            "Pihak terlibat: Pacar, mantan, atau keluarga. "
            "Kejadian: dikirimi foto atau video tanpa izin. Kejadian: diancam foto atau datanya disebar. "
            "Bukti: ada bukti digital.")
        self.assertNotIn("Lokasi: Lokasi:", q)
        self.assertNotIn("..", q)

    def test_search_plan(self):
        plan = assessment.build_search_plan(QUESTIONNAIRE, ANSWERS)
        self.assertEqual(plan["topics"], ["hak_perempuan", "keamanan_diri", "kesehatan_mental"])
        self.assertEqual(plan["entry_types"], ["panduan_dukungan", "prosedur"])

    def test_emotions_use_labels(self):
        self.assertEqual(assessment.build_emotion_facts(QUESTIONNAIRE, ANSWERS),
                         ["Kondisi saat ini: Aman, tapi masih trauma", "Reaksi saat kejadian: Membeku atau takut"])

    def test_is_emergency_input(self):
        self.assertTrue(assessment.is_emergency_input(QUESTIONNAIRE, {"q1": "a"}, "halo"))
        self.assertFalse(assessment.is_emergency_input(QUESTIONNAIRE, ANSWERS, "fotoku diancam disebar"))
        self.assertTrue(assessment.is_emergency_input(QUESTIONNAIRE, ANSWERS, "pengen mati aja"))

    def test_page_shape_normalization(self):
        normalized = assessment.normalize_answers(QUESTIONNAIRE, {**ANSWERS, "q6": None, "q4": ["c", "zzz", "d"]})
        self.assertEqual(normalized["q4"], ["c", "d"])
        self.assertNotIn("q6", normalized)
        self.assertEqual(normalized["q1"], ["c"])



class TestFallbackQuery(unittest.TestCase):
    def test_without_query_text(self):
        questionnaire = assessment.build_questionnaire([dict(q_code="q4", question_text="k", allows_multiple=True, option_code="a",
                                        option_label="dikomentari soal tubuh.", query_text=None, topic_hints=[],
                                        entry_type=None, is_emergency=False)])
        self.assertEqual(assessment.build_condition_facts(questionnaire, {"q4": ["a"]}), ["Kejadian: dikomentari soal tubuh."])

    def test_without_assessment(self):
        self.assertEqual(assessment.build_search_plan({}, None), {"topics": [], "entry_types": []})
        self.assertEqual(assessment.compose_query("halo", {}, None), "Pertanyaan: halo")
        self.assertFalse(assessment.is_emergency_input({}, None, "apa itu restitusi"))


if __name__ == "__main__":
    unittest.main()
