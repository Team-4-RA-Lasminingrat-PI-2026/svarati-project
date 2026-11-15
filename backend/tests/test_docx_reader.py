import io
import os
import sys
import unittest
import zipfile

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from svarati import chunking, extraction

try:
    import docx  # noqa: F401
    HAS_DOCX = True
except ImportError:
    HAS_DOCX = False

if HAS_DOCX:
    from docx import Document
    from docx.opc.constants import RELATIONSHIP_TYPE as RT
    from docx.oxml import OxmlElement
    from docx.oxml.ns import qn
    from svarati.docx_reader import read_docx


def docx_to_bytes(doc):
    b = io.BytesIO()
    doc.save(b)
    return b.getvalue()


def add_hyperlink(par, text, url):
    r_id = par.part.relate_to(url, RT.HYPERLINK, is_external=True)
    h = OxmlElement("w:hyperlink")
    h.set(qn("r:id"), r_id)
    r = OxmlElement("w:r")
    t = OxmlElement("w:t")
    t.text = text
    r.append(t)
    h.append(r)
    par._p.append(h)


@unittest.skipUnless(HAS_DOCX, "python-docx belum terpasang")
class TestReadDocx(unittest.TestCase):
    def test_title_and_inline_format(self):
        d = Document()
        d.add_heading("Judul Artikel", 0)
        d.add_heading("Bagian Satu", 1)
        d.add_heading("Sub Bagian", 2)
        p = d.add_paragraph("Teks ")
        p.add_run("tebal ").bold = True          # spasi di dalam penanda harus dipindah ke luar
        p.add_run("dan ")
        p.add_run("miring").italic = True
        p.add_run(" serta ")
        r = p.add_run("keduanya")
        r.bold = r.italic = True
        add_hyperlink(p, " tautan", "https://example.org/x")
        out = read_docx(docx_to_bytes(d))
        md = out["markdown"]
        self.assertNotIn("Judul Artikel", md)          # judul artikel dibuang dari Markdown
        self.assertIn("## Bagian Satu", md)            # Heading 1 non-judul menjadi ##
        self.assertIn("## Sub Bagian", md)
        self.assertIn("Teks **tebal** dan *miring* serta ***keduanya*** [tautan](https://example.org/x)", md)
        self.assertNotIn("**tebal **", md)

    def test_chunk_text_without_format_markers(self):
        d = Document()
        d.add_heading("Bagian", 1)
        p = d.add_paragraph("Ini ")
        p.add_run("penting").bold = True
        add_hyperlink(p, " lihat sini", "https://example.org/x")
        t = read_docx(docx_to_bytes(d))["text"]
        self.assertIn("# Bagian", t)
        self.assertIn("Ini penting lihat sini", t)
        for marker in ("**", "](", "https://"):
            self.assertNotIn(marker, t)

    def test_nested_and_ordered_lists(self):
        d = Document()
        d.add_paragraph("Butir satu", style="List Bullet")
        d.add_paragraph("Butir dua", style="List Bullet")
        d.add_paragraph("Sub butir", style="List Bullet 2")
        d.add_paragraph("Langkah satu", style="List Number")
        d.add_paragraph("Langkah dua", style="List Number")
        out = read_docx(docx_to_bytes(d))
        self.assertEqual(out["markdown"],
                         "- Butir satu\n- Butir dua\n    - Sub butir\n\n1. Langkah satu\n1. Langkah dua\n")
        self.assertEqual(out["text"],
                         "- Butir satu\n- Butir dua\n  - Sub butir\n\n1. Langkah satu\n2. Langkah dua\n")

    def test_table_and_merged_cells(self):
        d = Document()
        t = d.add_table(rows=2, cols=2)
        t.cell(0, 0).merge(t.cell(0, 1)).text = "Judul Tabel"
        t.cell(1, 0).text = "a|b"
        t.cell(1, 1).text = "2"
        out = read_docx(docx_to_bytes(d))
        self.assertIn("| Judul Tabel |", out["markdown"])
        self.assertIn("a\\|b", out["markdown"])
        self.assertEqual(out["text"].splitlines()[0], "Judul Tabel")
        self.assertEqual(out["text"].splitlines()[1], "a|b | 2")

    def test_special_chars_not_formatting(self):
        d = Document()
        d.add_paragraph("- bukan daftar")
        d.add_paragraph("# bukan judul")
        d.add_paragraph("1. bukan daftar berurut")
        d.add_paragraph("snake_case dan 5 * 3 [x]")
        md = read_docx(docx_to_bytes(d))["markdown"]
        for expected in ("\\- bukan daftar", "\\# bukan judul", "1\\. bukan daftar berurut", "snake\\_case dan 5 \\* 3 \\[x\\]"):
            self.assertIn(expected, md)

    def test_empty_paragraph_and_empty_document(self):
        d = Document()
        d.add_paragraph("")
        d.add_paragraph("   ")
        d.add_paragraph("Isi")
        self.assertEqual(read_docx(docx_to_bytes(d))["markdown"], "Isi\n")
        self.assertEqual(read_docx(docx_to_bytes(Document()))["markdown"], "")
        self.assertEqual(read_docx(docx_to_bytes(Document()))["word_count"], 0)

    def test_title_dropped_and_heading_three_becomes_three_hashes(self):
        d = Document()
        d.add_heading("Hak Korban", 1)
        d.add_paragraph("Pembuka.")
        d.add_heading("Dasar Hukum", 2)
        d.add_heading("Rincian", 3)
        d.add_paragraph("Isi.")
        out = read_docx(docx_to_bytes(d), title="Hak Korban")
        self.assertNotIn("Hak Korban", out["markdown"].splitlines()[0])
        self.assertIn("## Dasar Hukum", out["markdown"])
        self.assertIn("### Rincian", out["markdown"])
        # chunk (teks) tetap utuh, termasuk judul
        self.assertIn("Hak Korban", out["text"])

    def test_word_count(self):
        d = Document()
        d.add_paragraph("satu dua tiga empat lima")
        self.assertEqual(read_docx(docx_to_bytes(d))["word_count"], 5)

    def test_feeds_into_chunking(self):
        d = Document()
        d.add_heading("Simpan bukti", 1)
        d.add_paragraph("Ambil tangkapan layar pesan.", style="List Bullet")
        d.add_paragraph("Jangan hapus percakapan.", style="List Bullet")
        d.add_heading("Cari bantuan", 1)
        d.add_paragraph("Hubungi layanan terverifikasi.")
        text = read_docx(docx_to_bytes(d))["text"]
        rows = chunking.build_chunks(dict(entry_type="panduan_dukungan", topic="keamanan_diri", title="Panduan"),
                                      [(None, text)])
        joined = "\n".join(r["text"] for r in rows)
        self.assertIn("# Simpan bukti", joined)
        self.assertIn("- Ambil tangkapan layar pesan.", joined)
        self.assertIn("Hubungi layanan terverifikasi.", joined)
        self.assertEqual({r["meta"]["section"] for r in rows}, {"Simpan bukti", "Cari bantuan"})
        self.assertNotIn("**", joined)


class TestDetectKind(unittest.TestCase):
    def test_kind(self):
        self.assertEqual(extraction.detect_file_type(b"%PDF-1.7 ..."), "pdf")
        self.assertEqual(extraction.detect_file_type(b"\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1rest"), "legacy_doc")
        self.assertEqual(extraction.detect_file_type(b"<!DOCTYPE html><html><body>x</body></html>"), "html")
        self.assertEqual(extraction.detect_file_type("teks biasa".encode()), "txt")
        self.assertEqual(extraction.detect_file_type(b""), "empty")

    def test_zip(self):
        b = io.BytesIO()
        with zipfile.ZipFile(b, "w") as z:
            z.writestr("xl/workbook.xml", "<x/>")
        self.assertEqual(extraction.detect_file_type(b.getvalue()), "other_zip")
        self.assertEqual(extraction.detect_file_type(b"PK\x03\x04bukan zip valid"), "other_zip")
        b2 = io.BytesIO()
        with zipfile.ZipFile(b2, "w") as z:
            z.writestr("word/document.xml", "<x/>")
        self.assertEqual(extraction.detect_file_type(b2.getvalue()), "docx")

    @unittest.skipUnless(HAS_DOCX, "python-docx belum terpasang")
    def test_real_docx(self):
        d = Document()
        d.add_paragraph("isi")
        self.assertEqual(extraction.detect_file_type(docx_to_bytes(d)), "docx")


if __name__ == "__main__":
    unittest.main()
