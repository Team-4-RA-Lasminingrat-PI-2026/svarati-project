"""Alasan penilaian "kurang membantu": validasi kode, redaksi teks, dan pemotongan panjang."""
import os
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from svarati import storage  # noqa: E402


class _Cursor:
    def __init__(self):
        self.sql, self.params, self.rowcount = [], [], 1

    def __enter__(self):
        return self

    def __exit__(self, *args):
        return False

    def execute(self, sql, params=None):
        self.sql.append(sql)
        self.params.append(params)


class _Conn:
    def __init__(self):
        self.cur = _Cursor()

    def cursor(self):
        return self.cur


class SaveReasonTests(unittest.TestCase):
    TOKEN = "51714400-cdca-44e2-9e2e-6f1565ea0280"

    def test_redaction_and_truncation(self):
        conn = _Conn()
        ok = storage.save_feedback_reason(conn, self.TOKEN, 7, "lainnya", "hubungi 081234567890 " + "x" * 300)
        reason_code, text, _hash, message_id = conn.cur.params[0]
        self.assertTrue(ok)
        self.assertEqual(reason_code, "lainnya")
        self.assertEqual(message_id, 7)
        self.assertIn("[NOMOR TELEPON]", text)
        self.assertLessEqual(len(text), storage.MAX_REASON_TEXT_LENGTH)

    def test_only_unhelpful_rating(self):
        conn = _Conn()
        storage.save_feedback_reason(conn, self.TOKEN, 7, "terlalu_panjang", None)
        self.assertIn("is_helpful = false", conn.cur.sql[0])
        self.assertIsNone(conn.cur.params[0][1])

    def test_saving_rating_resets_reason(self):
        src = open(os.path.join(os.path.dirname(__file__), "..", "src", "svarati", "storage.py"),
                   encoding="utf-8").read()
        self.assertIn("reason_code = NULL, reason_text = NULL", src)


if __name__ == "__main__":
    unittest.main()
