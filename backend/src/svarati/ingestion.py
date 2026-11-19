"""Ingestion: Drive -> chunk -> embedding -> knowledge_entries / knowledge_chunks.

Satu file untuk dua backend embedding:
- EMBEDDING_BACKEND=sentence-transformers (default, e5): tulis chunk baru ke kolom embedding.
- EMBEDDING_BACKEND=gemini: isi kolom embedding_gemini untuk chunk yang sudah ada (tidak hapus chunk).
"""
import hashlib

from . import config
from .chunking import build_chunks
from .docx_reader import read_docx
from .extraction import drive_id, extract_pages, download_file


def register_sources(conn, sources, active=True):
    """Upsert metadata sumber. Status tinjauan (is_active, verified_by) dan status proses tidak ditimpa."""
    with conn.cursor() as cur:
        for s in sources:
            file_id = s.get("drive_file_id") or drive_id(s["drive_url"])
            cur.execute("""
                INSERT INTO public.knowledge_entries
                  (entry_type, topic, source_name, title, publisher, document_date,
                   drive_file_id, official_source_url, slug, verified_by,
                   is_active, processing_status, updated_at)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,'pending', now())
                ON CONFLICT (drive_file_id) DO UPDATE SET
                   entry_type = EXCLUDED.entry_type, topic = EXCLUDED.topic,
                   source_name = EXCLUDED.source_name, title = EXCLUDED.title,
                   publisher = EXCLUDED.publisher, document_date = EXCLUDED.document_date,
                   official_source_url = EXCLUDED.official_source_url,
                   slug = COALESCE(knowledge_entries.slug, EXCLUDED.slug),
                   updated_at = now()
            """, (s["entry_type"], s["topic"], s["source_name"], s["title"], s["publisher"],
                  s.get("document_date"), file_id, s.get("official_source_url"), s.get("slug"),
                  s.get("verified_by", "belum ditinjau"), active))
    conn.commit()


def read_entries(conn, ids=None):
    from psycopg2.extras import RealDictCursor

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        if ids:
            cur.execute("SELECT * FROM public.knowledge_entries WHERE entry_id = ANY(%s) ORDER BY entry_id",
                        (list(ids),))
        else:
            cur.execute("""SELECT * FROM public.knowledge_entries
                           WHERE processing_status IN ('pending','failed','done','processing') ORDER BY entry_id""")
        return cur.fetchall()


def _set_status(conn, entry_id, status, error=None, checksum=None):
    with conn.cursor() as cur:
        cur.execute("""UPDATE public.knowledge_entries
                       SET processing_status=%s, error_message=%s,
                           checksum_sha256=COALESCE(%s, checksum_sha256), updated_at=now()
                       WHERE entry_id=%s""", (status, error, checksum, entry_id))
    conn.commit()


def _has_content_md_column(conn):
    with conn.cursor() as cur:
        cur.execute("""SELECT 1 FROM information_schema.columns
                       WHERE table_schema='public' AND table_name='knowledge_entries' AND column_name='content_md'""")
        return cur.fetchone() is not None


def ingest_entry(conn, embedder, entry, force=False):
    """Unduh, pecah, embed, lalu simpan satu entri.
    Kembalikan jumlah chunk yang ditulis (0 jika dilewati atau gagal)."""
    from psycopg2.extras import Json, execute_values

    entry_id = entry["entry_id"]
    gemini = config.EMBEDDING_BACKEND == "gemini"
    try:
        data, file_type = download_file(entry["drive_file_id"])
        if file_type == "txt":
            # Ekspor DOCX gagal dan hanya teks yang tersedia. Dianggap gagal agar content_md lama tetap ada.
            raise RuntimeError("Ekspor DOCX gagal, hanya teks yang tersedia. content_md lama dipertahankan.")
        if file_type == "docx":
            # Satu kali baca menghasilkan Markdown (untuk halaman) dan teks (untuk chunk) dari versi file yang sama.
            document = read_docx(data, title=entry["title"])
            content_md = document["markdown"]
            pages = [(None, document["text"])]
            # Checksum dari isi hasil konversi, bukan byte file: byte DOCX/Google Docs bisa berubah
            # walau isinya sama (metadata waktu), sehingga tidak memicu proses ulang yang sia-sia.
            checksum = hashlib.sha256(content_md.encode("utf-8")).hexdigest()
        else:
            content_md = None   # PDF/teks: content_md dikosongkan (sesuai aturan)
            pages = extract_pages(data, file_type)
            checksum = hashlib.sha256(data).hexdigest()
        if (not force and entry["processing_status"] == "done"
                and (entry["last_successful_checksum"] or "").strip() == checksum):
            print(f"[lewati] {entry['title']} (tidak berubah)")
            return 0
        _set_status(conn, entry_id, "processing", checksum=checksum)
        rows = build_chunks(entry, pages)
        if not rows:
            raise RuntimeError("Tidak ada chunk yang dihasilkan (PDF hasil scan? perlu OCR).")
        vectors = embedder.docs([f"{r['title']}\n{r['text']}" for r in rows])
        model_name = embedder.name

        with conn.cursor() as cur:
            if gemini:
                # Gemini: jangan hapus chunk. Hanya isi kolom Gemini untuk chunk yang sudah ada.
                cur.execute("SELECT chunk_id, chunk_index FROM public.knowledge_chunks WHERE entry_id=%s",
                            (entry_id,))
                existing = {idx: cid for cid, idx in cur.fetchall()}
                if len(existing) != len(rows):
                    raise RuntimeError(
                        f"jumlah chunk tidak cocok ({len(existing)} di DB, {len(rows)} baru). "
                        "Jalankan ingest e5 dulu, atau reembed_gemini.py --force.")
                values = [(existing[r["chunk_index"]],
                           "[" + ",".join(f"{x:.8f}" for x in vectors[i]) + "]", model_name)
                          for i, r in enumerate(rows)]
                execute_values(cur, """UPDATE public.knowledge_chunks AS k
                                       SET embedding_gemini = v.vec::vector,
                                           embedding_gemini_model = v.model
                                       FROM (VALUES %s) AS v(chunk_id, vec, model)
                                       WHERE k.chunk_id = v.chunk_id""", values)
            else:
                # e5: tulis ulang seluruh chunk entri ini.
                chunk_rows = [(entry_id, r["chunk_index"], r["page"], r["page_end"], r["article_number"], r["text"],
                               vectors[i], model_name, Json(r["meta"])) for i, r in enumerate(rows)]
                cur.execute("DELETE FROM public.knowledge_chunks WHERE entry_id=%s", (entry_id,))
                execute_values(cur, """
                    INSERT INTO public.knowledge_chunks
                      (entry_id, chunk_index, page_number, page_end, article_number, chunk_text,
                       embedding, embedding_model, metadata, created_at)
                    VALUES %s""", chunk_rows, template="(%s,%s,%s,%s,%s,%s,%s,%s,%s,now())")

            if _has_content_md_column(conn):
                cur.execute("""UPDATE public.knowledge_entries
                               SET processing_status='done', last_successful_checksum=%s, content_md=%s,
                                   ingested_at=now(), error_message=NULL, updated_at=now()
                               WHERE entry_id=%s""", (checksum, content_md, entry_id))
            else:
                if content_md is not None:
                    print("[peringatan] kolom knowledge_entries.content_md belum ada; content_md tidak disimpan "
                          "(jalankan sql/05_kolom_content_md.sql).")
                cur.execute("""UPDATE public.knowledge_entries
                               SET processing_status='done', last_successful_checksum=%s,
                                   ingested_at=now(), error_message=NULL, updated_at=now()
                               WHERE entry_id=%s""", (checksum, entry_id))
        conn.commit()
        print(f"[ok] {entry['title']}: {len(rows)} chunk ({'gemini' if gemini else 'e5'})")
        return len(rows)
    except Exception as exc:
        conn.rollback()
        _set_status(conn, entry_id, "failed", error=str(exc)[:1000])
        print(f"[gagal] {entry['title']}: {exc}")
        return 0