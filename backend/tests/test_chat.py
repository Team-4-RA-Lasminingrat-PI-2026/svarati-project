import os
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from unittest.mock import patch

from svarati import assessment, chat, generation, labels, retrieval, services

QUESTIONNAIRE = assessment.build_questionnaire([dict(q_code="q1", question_text="k", allows_multiple=False, option_code="a",
                                option_label="bahaya", query_text=None, topic_hints=[], entry_type=None,
                                is_emergency=True),
                           dict(q_code="q1", question_text="k", allows_multiple=False, option_code="b",
                                option_label="aman", query_text=None, topic_hints=[], entry_type=None,
                                is_emergency=False)])
CHUNKS = [dict(chunk_id=7, entry_id=1, entry_type="hukum", display_title="UU TPKS - Pasal 14",
               chunk_text="Pasal 14 isi. Hubungi 08111129129.", sim=0.85)]


def must_not_be_called(*a, **k):
    raise AssertionError("tidak boleh dipanggil")


class TestRespond(unittest.TestCase):
    def test_emergency_from_text_skips_search(self):
        with patch.object(services, "get_emergency_message", return_value="DARURAT"),              patch.object(retrieval, "search_chunks", side_effect=must_not_be_called),              patch.object(generation, "call_gemini", side_effect=must_not_be_called):
            out = chat.answer_question(None, None, QUESTIONNAIRE, "pengen mati aja", None)
        self.assertEqual((out["mode"], out["answer"], out["chunks"]), (labels.MODE_EMERGENCY, "DARURAT", []))

    def test_emergency_from_option(self):
        with patch.object(services, "get_emergency_message", return_value="DARURAT"),              patch.object(retrieval, "search_chunks", side_effect=must_not_be_called):
            out = chat.answer_question(None, None, QUESTIONNAIRE, "tolong", {"q1": "a"})
        self.assertEqual(out["mode"], labels.MODE_EMERGENCY)

    def test_without_source(self):
        with patch.object(retrieval, "search_chunks", return_value=[]),              patch.object(generation, "call_gemini", side_effect=must_not_be_called):
            out = chat.answer_question(None, None, QUESTIONNAIRE, "resep nasi goreng", None)
        self.assertEqual((out["mode"], out["chunks"]), ("tanpa_sumber", []))

    def test_clean_rag(self):
        with patch.object(retrieval, "search_chunks", return_value=CHUNKS),              patch.object(services, "get_verified_providers", return_value=[]),              patch.object(generation, "call_gemini", return_value="Sesuai Pasal 14, hubungi 08111129129."):
            out = chat.answer_question(None, None, QUESTIONNAIRE, "fotoku diancam", {"q1": "b"})
        self.assertEqual(out["mode"], labels.MODE_RAG)
        self.assertEqual(out["warnings"], {"pasal_tidak_ada_di_sumber": [], "nomor_tidak_ada_di_sumber": []})
        self.assertNotIn("Catatan:", out["answer"])

    def test_gemini_error_does_not_leak_details(self):
        with patch.object(retrieval, "search_chunks", return_value=CHUNKS),              patch.object(services, "get_verified_providers", return_value=[]),              patch.object(generation, "call_gemini", side_effect=RuntimeError("API KEY rahasia")):
            out = chat.answer_question(None, None, QUESTIONNAIRE, "fotoku diancam", None)
        self.assertEqual((out["mode"], out["chunks"]), ("error_llm", []))
        self.assertNotIn("rahasia", out["answer"])

    def test_gemini_empty(self):
        with patch.object(retrieval, "search_chunks", return_value=CHUNKS),              patch.object(services, "get_verified_providers", return_value=[]),              patch.object(generation, "call_gemini", return_value=""):
            out = chat.answer_question(None, None, QUESTIONNAIRE, "fotoku diancam", None)
        self.assertEqual(out["mode"], "llm_kosong")

    def test_emergency_message_fallback_without_database(self):
        text = services.build_emergency_text([])
        self.assertIn("112", text)
        self.assertIn("129", text)
        text_with_providers = services.build_emergency_text([dict(provider_name="SAPA", phone_number="129")])
        self.assertIn("- SAPA: 129", text_with_providers)


class TestStagesAndResilience(unittest.TestCase):
    def test_gemini_empty_is_not_no_information(self):
        with patch.object(retrieval, "search_chunks", return_value=CHUNKS), \
             patch.object(services, "get_verified_providers", return_value=[]), \
             patch.object(generation, "call_gemini", return_value=""):
            out = chat.answer_question(None, None, QUESTIONNAIRE, "fotoku diancam", None)
        self.assertEqual(out["answer"], labels.ANSWER_FAILED_REPLY)
        self.assertNotEqual(out["answer"], labels.NO_SOURCE_REPLY)

    def test_two_stages(self):
        import inspect
        # tahap 2 tidak menerima koneksi database sama sekali
        self.assertEqual(list(inspect.signature(chat.finish).parameters), ["stage"])
        with patch.object(retrieval, "search_chunks", return_value=CHUNKS), \
             patch.object(services, "get_verified_providers", return_value=[]), \
             patch.object(generation, "call_gemini", side_effect=must_not_be_called):
            stage = chat.prepare(None, None, QUESTIONNAIRE, "fotoku diancam", None)   # Gemini belum dipanggil
        self.assertIsNone(stage["done"])
        self.assertIn("PERTANYAAN PENGGUNA:\nfotoku diancam", stage["prompt"])
        with patch.object(generation, "call_gemini", return_value="Lihat Pasal 14."):
            out = chat.finish(stage)
        self.assertEqual(out["mode"], labels.MODE_RAG)

    def test_emergency_stage_completes_without_gemini(self):
        with patch.object(services, "get_emergency_message", return_value="DARURAT"):
            stage = chat.prepare(None, None, QUESTIONNAIRE, "pengen mati aja", None)
        self.assertEqual(stage["done"]["mode"], labels.MODE_EMERGENCY)
        with patch.object(generation, "call_gemini", side_effect=must_not_be_called):
            self.assertEqual(chat.finish(stage)["answer"], "DARURAT")

    def test_providers_failure_does_not_fail_answer(self):
        with patch.object(retrieval, "search_chunks", return_value=CHUNKS), \
             patch.object(services, "get_verified_providers", side_effect=RuntimeError("tabel hilang")), \
             patch.object(generation, "call_gemini", return_value="Sesuai Pasal 14."):
            out = chat.answer_question(None, None, QUESTIONNAIRE, "fotoku diancam", None)
        self.assertEqual(out["mode"], labels.MODE_RAG)

    def test_list_sources_survives_failure(self):
        class BrokenConn:
            def cursor(self, *a, **k):
                raise RuntimeError("db mati")

            def rollback(self):
                pass
        out = chat.list_sources(BrokenConn(), CHUNKS)
        self.assertEqual(out[0]["title"], "UU TPKS - Pasal 14")
        self.assertIsNone(out[0]["slug"])
        self.assertEqual(chat.list_sources(None, []), [])


if __name__ == "__main__":
    unittest.main()
