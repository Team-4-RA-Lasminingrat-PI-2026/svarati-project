"""Ingestion: Drive -> chunk -> embedding -> knowledge_entries / knowledge_chunks.

Mode embedding:
- EMBEDDING_BACKEND=sentence-transformers: hanya kolom e5 yang diisi.
- EMBEDDING_BACKEND=gemini: e5 dan Gemini diisi bersamaan untuk chunk baru.
  Jika teks chunk di database sama persis dengan hasil pemotongan sekarang dan e5 sudah ada,
  hanya kolom Gemini yang diisi.
"""
import hashlib

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


def _vec(v):
    """Ubah vektor menjadi teks '[x,y,...]' untuk kolom vector."""
    return "[" + ",".join(f"{x:.8f}" for x in v) + "]"


def ingest_entry(conn, embedders, entry, force=False):
    """embedders: {'e5': ...} atau {'e5': ..., 'gemini': ...}.
    Kembalikan jumlah chunk yang ditulis (0 jika dilewati atau gagal)."""
    from psycopg2.extras import Json, execute_values

    entry_id = entry["entry_id"]
    use_gemini = "gemini" in embedders
    try:
        data, file_type = download_file(entry["drive_file_id"])
        if file_type == "txt":
            # Ekspor DOCX gagal dan hanya teks yang tersedia. Dianggap gagal agar content_md lama tetap ada.
            raise RuntimeError("Ekspor DOCX gagal, hanya teks yang tersedia. content_md lama dipertahankan.")
        if file_type == "docx":
            # Satu kali baca menghasilkan Markdown (untuk halaman) dan teks (untuk chunk).
            document = read_docx(data, title=entry["title"])
            content_md = document["markdown"]
            pages = [(None, document["text"])]
            # Checksum dari isi hasil konversi, bukan byte file, agar metadata waktu tidak memicu proses ulang.
            checksum = hashlib.sha256(content_md.encode("utf-8")).hexdigest()
        else:
            content_md = None  # PDF/teks: content_md dikosongkan
            pages = extract_pages(data, file_type)
            checksum = hashlib.sha256(data).hexdigest()

        content_same = (entry["last_successful_checksum"] or "").strip() == checksum
        if not force and entry["processing_status"] == "done" and content_same:
            print(f"[lewati] {entry['title']} (tidak berubah)")
            return 0

        _set_status(conn, entry_id, "processing", checksum=checksum)
        rows = build_chunks(entry, pages)
        if not rows:
            raise RuntimeError("Tidak ada chunk yang dihasilkan (PDF hasil scan? perlu OCR).")
        texts = [f"{r['title']}\n{r['text']}" for r in rows]

        with conn.cursor() as cur:
            cur.execute("""SELECT chunk_id, chunk_index, chunk_text, embedding IS NOT NULL
                           FROM public.knowledge_chunks WHERE entry_id=%s""", (entry_id,))
            existing = cur.fetchall()
            db_by_idx = {idx: (cid, text, has_e5) for cid, idx, text, has_e5 in existing}

            # Jalur "isi Gemini saja" hanya dipakai jika chunk di database identik dengan hasil
            # pemotongan sekarang: jumlah, nomor urut, dan teksnya sama, serta e5 sudah terisi.
            same_chunks = (
                content_same
                and bool(existing)
                and len(db_by_idx) == len(rows)
                and all(
                    r["chunk_index"] in db_by_idx
                    and db_by_idx[r["chunk_index"]][1] == r["text"]
                    and db_by_idx[r["chunk_index"]][2]
                    for r in rows
                )
            )
            can_patch = use_gemini and same_chunks

            if can_patch:
                # Teks dan e5 sudah benar. Hanya isi kolom Gemini.
                gem = embedders["gemini"]
                vecs = gem.docs(texts)
                values = [(db_by_idx[r["chunk_index"]][0], _vec(vecs[i]), gem.name)
                          for i, r in enumerate(rows)]
                execute_values(cur, """UPDATE public.knowledge_chunks AS k
                                       SET embedding_gemini = v.vec::vector,
                                           embedding_gemini_model = v.model
                                       FROM (VALUES %s) AS v(chunk_id, vec, model)
                                       WHERE k.chunk_id = v.chunk_id""", values)
            else:
                # Dokumen baru, berubah, atau belum lengkap: tulis ulang seluruh chunk dengan kedua vektor.
                e5 = embedders["e5"]
                e5_vecs = e5.docs(texts)
                gem_vecs = embedders["gemini"].docs(texts) if use_gemini else None
                chunk_rows = []
                for i, r in enumerate(rows):
                    chunk_rows.append((
                        entry_id, r["chunk_index"], r["page"], r["page_end"], r["article_number"], r["text"],
                        e5_vecs[i], e5.name,
                        _vec(gem_vecs[i]) if use_gemini else None,
                        embedders["gemini"].name if use_gemini else None,
                        Json(r["meta"]),
                    ))
                cur.execute("DELETE FROM public.knowledge_chunks WHERE entry_id=%s", (entry_id,))
                execute_values(cur, """
                    INSERT INTO public.knowledge_chunks
                      (entry_id, chunk_index, page_number, page_end, article_number, chunk_text,
                       embedding, embedding_model, embedding_gemini, embedding_gemini_model,
                       metadata, created_at)
                    VALUES %s""", chunk_rows,
                    template="(%s,%s,%s,%s,%s,%s,%s,%s,%s::vector,%s,%s,now())")

            if _has_content_md_column(conn):
                cur.execute("""UPDATE public.knowledge_entries
                               SET processing_status='done', last_successful_checksum=%s, content_md=%s,
                                   ingested_at=now(), error_message=NULL, updated_at=now()
                               WHERE entry_id=%s""", (checksum, content_md, entry_id))
            else:
                if content_md is not None:
                    print("[peringatan] kolom knowledge_entries.content_md belum ada; content_md tidak disimpan.")
                cur.execute("""UPDATE public.knowledge_entries
                               SET processing_status='done', last_successful_checksum=%s,
                                   ingested_at=now(), error_message=NULL, updated_at=now()
                               WHERE entry_id=%s""", (checksum, entry_id))
        conn.commit()
        mode = "gemini+e5" if use_gemini else "e5"
        print(f"[ok] {entry['title']}: {len(rows)} chunk ({mode})")
        return len(rows)
    except Exception as exc:
        conn.rollback()
        _set_status(conn, entry_id, "failed", error=str(exc)[:1000])
        print(f"[gagal] {entry['title']}: {exc}")
        return 0