import os
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from svarati import chunking


def make_page(n, body):
    return (n, f"PRESIDEN REPUBLIK INDONESIA\n{body}\n- {n} -")


PAGES = [
    make_page(1, "UNDANG-UNDANG\nBAB I\nKETENTUAN UMUM\nPasal 1\n(1) Kekerasan Seksual adalah setiap perbuatan.\n(2) Korban adalah orang."),
    make_page(2, "BAB II\nTINDAK PIDANA\nBagian Kesatu\nPelecehan\nPasal 5\nSetiap Orang yang melakukan perbuatan seksual nonfisik dipidana dengan pidana penjara paling lama 9 bulan.\nPasal 14\n(1) Setiap Orang yang merekam tanpa persetujuan dipidana. " + "Lorem ipsum kalimat panjang. " * 60),
    make_page(3, "lanjutan Pasal 14 ayat dua yang memuat ancaman pidana penjara.\nPasal 15\nPemberatan pidana sepertiga."),
    make_page(4, "Disahkan di Jakarta"),
    make_page(5, "PENJELASAN\nATAS\nUNDANG-UNDANG\nPasal 1\nCukup jelas.\nPasal 5\nCukup jelas.\nPasal 14\nHuruf a Yang dimaksud dengan elektronik."),
]
ENTRY = dict(entry_type="hukum", topic="hukum_tpks", title="UU TPKS")


class TestLegal(unittest.TestCase):
    def setUp(self):
        self.rows = chunking.build_chunks(ENTRY, PAGES)

    def test_per_article_and_number(self):
        article_numbers = [r["article_number"] for r in self.rows]
        self.assertEqual(article_numbers[0], "1")
        self.assertIn("5", article_numbers)
        self.assertIn("15", article_numbers)
        self.assertGreaterEqual(article_numbers.count("14"), 2)  # Pasal 14 panjang -> beberapa chunk

    def test_headers_footers_and_markers_removed(self):
        for r in self.rows:
            self.assertNotIn("[[HAL", r["text"])
            self.assertNotIn("PRESIDEN REPUBLIK", r["text"])
            self.assertNotIn("- 3 -", r["text"])

    def test_explanation_and_closing_excluded(self):
        for r in self.rows:
            self.assertNotIn("Cukup jelas", r["text"])
            self.assertNotIn("PENJELASAN", r["text"])
            self.assertNotIn("Disahkan di", r["text"])
            self.assertNotIn("BAB II", r["text"])
            self.assertNotIn("Bagian Kesatu", r["text"])

    def test_pages_and_chapters(self):
        by = {}
        for r in self.rows:
            by.setdefault(r["article_number"], r)
        self.assertEqual((by["1"]["page"], by["1"]["page_end"]), (1, 1))
        self.assertEqual(by["5"]["page"], 2)
        self.assertEqual(by["15"]["page"], 3)
        self.assertEqual(by["1"]["meta"]["bab"], "I")
        self.assertEqual(by["5"]["meta"]["bab"], "II")
        p14 = [r for r in self.rows if r["article_number"] == "14"]
        self.assertEqual(p14[0]["page"], 2)
        self.assertEqual(max(r["page_end"] for r in p14), 3)

    def test_index_and_topics(self):
        self.assertEqual([r["chunk_index"] for r in self.rows], list(range(len(self.rows))))
        for r in self.rows:
            self.assertIn("hukum_tpks", r["meta"]["topics"])
            self.assertIn("judul", r["meta"])  # kunci metadata di DB

    def test_chunk_length(self):
        for r in self.rows:
            self.assertLessEqual(len(r["text"]), 1000 + 50)


class TestStructured(unittest.TestCase):
    def test_parts_and_no_pages(self):
        doc = ("PANDUAN LANGKAH AMAN\n\nLangkah 1 Simpan bukti\n\nSimpan tangkapan layar dan jangan hapus percakapan.\n\n"
               "Langkah 2 Cari pendamping\n\nHubungi layanan terverifikasi.\n\n" + ("Paragraf panjang. " * 80))
        rows = chunking.build_chunks(dict(entry_type="panduan_dukungan", topic="keamanan_diri", title="Panduan"),
                                      [(None, doc)])
        self.assertGreaterEqual(len(rows), 3)
        self.assertTrue(all(r["page"] is None for r in rows))
        self.assertTrue(any("Simpan tangkapan layar" in r["text"] for r in rows))
        self.assertTrue(any("Hubungi layanan" in r["text"] for r in rows))
        self.assertTrue(all("keamanan_diri" in r["meta"]["topics"] for r in rows))


class TestTitleNotLost(unittest.TestCase):
    def test_title_before_long_paragraph(self):
        para = "Kalimat contoh yang cukup panjang untuk menguji pemecahan teks. " * 25
        doc = "## Simpan bukti\n\n" + para + "\n\nParagraf penutup.\n"
        rows = chunking.build_chunks(dict(entry_type="panduan_dukungan", topic="keamanan_diri", title="Panduan"),
                                      [(None, doc)])
        self.assertTrue(rows[0]["text"].startswith("## Simpan bukti"))
        self.assertEqual(sum(r["text"].count("## Simpan bukti") for r in rows), 1)
        self.assertEqual(rows[0]["meta"]["section"], "Simpan bukti")


class TestSplit(unittest.TestCase):
    def test_overlap_does_not_cut_words(self):
        text = " ".join(f"kata{i}" for i in range(600))
        spans = chunking.split_long_text(text, 1000, 180)
        self.assertGreater(len(spans), 1)
        for a, b in spans[1:]:
            self.assertTrue(text[a - 1] in " \n", "chunk lanjutan harus mulai di batas kata")


if __name__ == "__main__":
    unittest.main()
