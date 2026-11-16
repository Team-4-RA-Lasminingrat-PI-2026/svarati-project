"""Mengunduh file dari Google Drive dan mengekstrak teks per halaman."""
import io
import re
import zipfile


def drive_id(url_or_id: str) -> str:
    s = (url_or_id or "").strip()
    m = re.search(r"/d/([a-zA-Z0-9_-]+)", s) or re.search(r"[?&]id=([a-zA-Z0-9_-]+)", s)
    if m:
        return m.group(1)
    if re.fullmatch(r"[a-zA-Z0-9_-]{10,}", s):
        return s  # sudah berupa ID file
    raise ValueError(f"Tidak menemukan ID file Drive di: {url_or_id!r}")


def detect_file_type(data: bytes) -> str:
    """'pdf' | 'docx' | 'doc_lama' | 'zip_lain' | 'html' | 'txt' | 'kosong'."""
    if not data:
        return "empty"
    if data[:4] == b"%PDF":
        return "pdf"
    if data[:4] == b"PK\x03\x04":
        try:
            with zipfile.ZipFile(io.BytesIO(data)) as z:
                return "docx" if "word/document.xml" in z.namelist() else "other_zip"
        except zipfile.BadZipFile:
            return "other_zip"
    if data[:8] == b"\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1":
        return "legacy_doc"
    if b"<html" in data[:2000].lower():
        return "html"
    return "txt"


def download_file(file_id: str):
    """Kembalikan (bytes, jenis) dengan jenis 'pdf', 'docx', atau 'txt'.

    File biasa di Drive diunduh apa adanya (PDF atau DOCX). Google Docs asli diekspor sebagai DOCX
    agar struktur (judul, daftar, tebal, miring) tetap ada.
    """
    import requests

    r = requests.get(f"https://drive.google.com/uc?export=download&id={file_id}", timeout=60)
    data = r.content if r.ok else b""
    file_type = detect_file_type(data)
    if file_type in ("pdf", "docx", "txt"):
        return data, file_type
    if file_type == "legacy_doc":
        raise RuntimeError("Format .doc (Word lama) tidak didukung. Simpan sebagai .docx atau buka di Google Docs.")
    if file_type == "other_zip":
        raise RuntimeError("Format file tidak didukung (hanya PDF, DOCX, dan Google Docs).")
    # html/kosong: kemungkinan Google Docs asli
    r = requests.get(f"https://docs.google.com/document/d/{file_id}/export?format=docx", timeout=60)
    if r.ok and detect_file_type(r.content) == "docx":
        return r.content, "docx"
    r = requests.get(f"https://docs.google.com/document/d/{file_id}/export?format=txt", timeout=60)
    if r.ok and detect_file_type(r.content) == "txt":
        return r.content, "txt"
    raise RuntimeError("Gagal mengunduh. Pastikan file dibagikan ke 'siapa saja yang memiliki link'.")


def extract_pages(data: bytes, file_type: str):
    """Kembalikan list (nomor_halaman | None, teks)."""
    if file_type == "docx":
        from .docx_reader import read_docx

        return [(None, read_docx(data)["text"])]
    if file_type == "pdf":
        from pypdf import PdfReader

        reader = PdfReader(io.BytesIO(data))
        return [(i, p.extract_text() or "") for i, p in enumerate(reader.pages, 1)]
    return [(None, data.decode("utf-8", errors="ignore"))]
