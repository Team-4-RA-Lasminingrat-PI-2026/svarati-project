import os
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from svarati import generation, storage


class TestGeneration(unittest.TestCase):
    def test_find_unsourced_articles(self):
        self.assertEqual(generation.find_unsourced_articles("Lihat Pasal 14 dan Pasal 99.", "Pasal 14 isi"), ["99"])
        self.assertEqual(generation.find_unsourced_articles("Tanpa pasal", "Pasal 1"), [])

    def test_find_unsourced_phones(self):
        self.assertEqual(generation.find_unsourced_phones("Hubungi 08111-129-129", "tel 08111-129-129"), [])
        self.assertEqual(generation.find_unsourced_phones("Hubungi 021 5551234 atau 112", "tel 08111-129-129"), ["021 5551234"])
        self.assertEqual(generation.find_unsourced_phones("UU No. 12 Tahun 2022", ""), [])

    def test_build_prompt(self):
        results = [dict(entry_type="hukum", display_title="UU TPKS - Pasal 14", chunk_text="isi pasal")]
        providers = [dict(provider_name="Layanan A", provider_type="lembaga", city="Jakarta", phone_number="123456", operating_hours=None)]
        p = generation.build_prompt("Bagaimana?", results, ["Lokasi: kantor."], ["Kondisi saat ini: bingung"], providers)
        for s in ("SUMBER:", "[1] (hukum) UU TPKS - Pasal 14", "isi pasal", "Layanan A (lembaga, Jakarta) | Telp: 123456",
                  "Lokasi: kantor.", "Kondisi saat ini: bingung", "PERTANYAAN PENGGUNA:\nBagaimana?"):
            self.assertIn(s, p)
        empty_prompt = generation.build_prompt("x", results, [], [], [])
        self.assertIn("(tidak ada data layanan terverifikasi)", empty_prompt)
        self.assertIn("(tidak ada)", empty_prompt)


class FakeCur:
    def __init__(self):
        self.calls = []

    def __enter__(self):
        return self

    def __exit__(self, *a):
        return False

    def execute(self, sql, params=None):
        self.calls.append((sql, params))

    def fetchone(self):
        return (99,)


class FakeConn:
    def __init__(self):
        self.cur = FakeCur()

    def cursor(self, *a, **k):
        return self.cur


class TestSaveConversation(unittest.TestCase):
    def test_response_mode_saved_on_ai_message(self):
        conn = FakeConn()
        mid = storage.save_exchange(conn, 7, "halo 081234567890", "jawaban", [], "darurat")
        self.assertEqual(mid, 99)
        (sql_user, p_user), (sql_ai, p_ai) = conn.cur.calls
        self.assertIn("'user'", sql_user)
        self.assertIn("[NOMOR TELEPON]", p_user[2])          # pesan pengguna diredaksi
        self.assertIn("response_mode", sql_ai)
        self.assertEqual(p_ai[-1], "darurat")
        self.assertEqual(p_ai[0], 7)

    def test_mode_may_be_empty(self):
        conn = FakeConn()
        storage.save_exchange(conn, 7, "a", "b", [])
        self.assertIsNone(conn.cur.calls[1][1][-1])


class TestStorage(unittest.TestCase):
    def test_token(self):
        self.assertTrue(storage.valid_token("3f2a9c1e-5b7d-4e8a-9c21-7d4e5f6a8b90"))
        for bad in (None, "", "abc", "3f2a9c1e-5b7d-4e8a-9c21-7d4e5f6a8b9", 123):
            self.assertFalse(storage.valid_token(bad), bad)

    def test_hash_is_stable(self):
        self.assertEqual(storage.hash_token("a"), storage.hash_token("a"))
        self.assertEqual(len(storage.hash_token("a")), 64)

    def test_redact(self):
        t = storage.redact("hubungi saya budi@example.com atau 081234567890, NIK 3171234567890001, +6281234567890")
        self.assertNotIn("budi@example.com", t)
        self.assertNotIn("081234567890", t)
        self.assertNotIn("3171234567890001", t)
        self.assertNotIn("+6281234567890", t)
        for tag in ("[EMAIL]", "[NOMOR TELEPON]", "[NOMOR IDENTITAS]"):
            self.assertIn(tag, t)
        self.assertEqual(storage.redact(None), "")
        self.assertEqual(len(storage.redact("x" * 20000)), 12000)


if __name__ == "__main__":
    unittest.main()
