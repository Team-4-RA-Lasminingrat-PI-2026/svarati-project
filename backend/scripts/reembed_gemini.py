"""Isi kolom embedding_gemini untuk chunk yang belum punya vektor Gemini.

Teks yang di-embed sama dengan saat ingest: "judul" + newline + teks chunk (tanpa awalan).
Judul diambil dari metadata (seperti yang terbukti cocok di cek_task_type.py).
Aman dijalankan ulang: hanya baris dengan embedding_gemini IS NULL yang diproses.

Jalankan dari folder backend:
    python scripts/reembed_gemini.py                # semua chunk
    python scripts/reembed_gemini.py --limit 20     # uji coba dulu
"""
import argparse
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from psycopg2.extras import execute_values  # noqa: E402
from svarati.db import close_pool, connection, init_pool  # noqa: E402
from svarati.embedding_gemini import GeminiEmbedder  # noqa: E402


def fetch_batch(size):
    """Ambil chunk yang belum punya embedding Gemini, beserta judul untuk teks embedding."""
    with connection() as conn, conn.cursor() as cur:
        cur.execute("""SELECT c.chunk_id,
                              COALESCE(c.metadata->>'judul', e.title) AS judul,
                              c.chunk_text
                       FROM public.knowledge_chunks c
                       JOIN public.knowledge_entries e ON e.entry_id = c.entry_id
                       WHERE c.embedding_gemini IS NULL
                       ORDER BY c.chunk_id
                       LIMIT %s""", (size,))
        return cur.fetchall()


def save_batch(rows, vectors, model_name):
    """Tulis vektor ke kolom embedding_gemini. Kolom embedding (e5) tidak disentuh.

    Mengembalikan jumlah baris yang benar-benar ter-update (dihitung dari RETURNING).
    """
    values = [(cid, "[" + ",".join(f"{x:.8f}" for x in vec) + "]", model_name)
              for (cid, _, _), vec in zip(rows, vectors)]
    with connection() as conn, conn.cursor() as cur:
        updated = execute_values(cur, """UPDATE public.knowledge_chunks AS k
                                         SET embedding_gemini = v.vec::vector,
                                             embedding_gemini_model = v.model
                                         FROM (VALUES %s) AS v(chunk_id, vec, model)
                                         WHERE k.chunk_id = v.chunk_id
                                         RETURNING k.chunk_id""", values, fetch=True)
        return len(updated)


def main():
    parser = argparse.ArgumentParser(description="Isi embedding_gemini dari teks chunk yang sudah ada.")
    parser.add_argument("--limit", type=int, default=0, help="batas jumlah chunk (0 = semua)")
    parser.add_argument("--batch", type=int, default=100, help="jumlah chunk per putaran")
    args = parser.parse_args()

    init_pool()
    embedder = GeminiEmbedder()
    done = 0
    try:
        while True:
            size = args.batch if not args.limit else min(args.batch, args.limit - done)
            if size <= 0:
                break
            rows = fetch_batch(size)
            if not rows:
                break
            vectors = embedder.docs([f"{judul}\n{text}" for _, judul, text in rows])
            written = save_batch(rows, vectors, embedder.name)
            if written != len(rows):
                raise RuntimeError(f"hanya {written} dari {len(rows)} baris ter-update")
            done += len(rows)
            print(f"{done} chunk selesai", flush=True)
    finally:
        close_pool()
    print("Selesai.")


if __name__ == "__main__":
    main()