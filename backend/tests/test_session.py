import os
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from svarati import storage  # noqa: E402


class _Cursor:
    def __init__(self, rows):
        self.rows = list(rows)
        self.executed = []

    def __enter__(self):
        return self

    def __exit__(self, *args):
        return False

    def execute(self, sql, params=None):
        self.executed.append(sql)

    def fetchone(self):
        return self.rows.pop(0) if self.rows else None


class _Conn:
    def __init__(self, rows):
        self.cur = _Cursor(rows)

    def cursor(self):
        return self.cur


TOKEN = "51714400-cdca-44e2-9e2e-6f1565ea0280"


class EnsureSessionTests(unittest.TestCase):
    def test_sesi_baru_dibuat(self):
        conn = _Conn([None, (42,)])  # SELECT: tidak ada sesi; INSERT ... RETURNING session_id
        self.assertEqual(storage.ensure_session(conn, TOKEN), 42)
        self.assertIn("INSERT", conn.cur.executed[1])

    def test_sesi_aktif_diperpanjang(self):
        conn = _Conn([(7, False)])  # SELECT: (session_id, expired)
        self.assertEqual(storage.ensure_session(conn, TOKEN), 7)
        self.assertIn("UPDATE", conn.cur.executed[1])

    def test_sesi_kedaluwarsa_ditolak(self):
        conn = _Conn([(7, True)])
        with self.assertRaises(storage.SessionExpired):
            storage.ensure_session(conn, TOKEN)
        # SELECT ... FOR UPDATE memuat kata "UPDATE", jadi cek awal perintahnya saja
        self.assertFalse(any(q.lstrip().upper().startswith(("UPDATE", "INSERT")) for q in conn.cur.executed))

    def test_bentrok_saat_insert_minta_ulang(self):
        conn = _Conn([None, None])  # tidak ada sesi, lalu INSERT tidak menghasilkan baris
        with self.assertRaises(storage.SessionExpired):
            storage.ensure_session(conn, TOKEN)


if __name__ == "__main__":
    unittest.main()