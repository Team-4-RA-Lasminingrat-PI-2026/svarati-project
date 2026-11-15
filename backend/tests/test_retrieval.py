import os
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from svarati import retrieval


def r(chunk_id, entry_id, sim, topic="hukum_tpks", etype="hukum", topics=None, art=None, page=None):
    return dict(chunk_id=chunk_id, entry_id=entry_id, similarity=sim, topic=topic, entry_type=etype,
                metadata={"topics": topics or []}, title=f"Dok{entry_id}", article_number=art,
                page_number=page, chunk_text=f"isi {chunk_id}")


class TestRerank(unittest.TestCase):
    def test_min_sim(self):
        out = retrieval.rerank([r(1, 1, 0.70), r(2, 1, 0.80)], {}, 4, 0.78, 2, 0.02, 0.01)
        self.assertEqual([x["chunk_id"] for x in out], [2])

    def test_boost_changes_order(self):
        rows = [r(1, 1, 0.80, topic="hukum_tpks"), r(2, 2, 0.79, topic="keamanan_diri", etype="prosedur")]
        plan = {"topics": ["keamanan_diri"], "entry_types": ["prosedur"]}
        out = retrieval.rerank(rows, plan, 4, 0.5, 2, 0.02, 0.01)
        self.assertEqual([x["chunk_id"] for x in out], [2, 1])
        self.assertTrue(out[0]["topic_match"] and out[0]["type_match"])

    def test_topic_from_chunk_metadata(self):
        rows = [r(1, 1, 0.80, topics=["keamanan_diri"])]
        out = retrieval.rerank(rows, {"topics": ["keamanan_diri"], "entry_types": []}, 4, 0.5, 2, 0.02, 0.01)
        self.assertTrue(out[0]["topic_match"])

    def test_per_entry_limit_and_k(self):
        rows = [r(i, 1, 0.90 - i * 0.001) for i in range(5)] + [r(10, 2, 0.85), r(11, 3, 0.84)]
        out = retrieval.rerank(rows, {}, 4, 0.5, 2, 0.02, 0.01)
        self.assertEqual(len(out), 4)
        self.assertEqual(sum(1 for x in out if x["entry_id"] == 1), 2)

    def test_display_title(self):
        out = retrieval.rerank([r(1, 1, 0.9, art="14", page=3)], {}, 4, 0.5, 2, 0.02, 0.01)
        self.assertEqual(out[0]["display_title"], "Dok1 - Pasal 14 (hal. 3)")

    def test_empty(self):
        self.assertEqual(retrieval.rerank([], {}, 4, 0.5), [])


if __name__ == "__main__":
    unittest.main()
