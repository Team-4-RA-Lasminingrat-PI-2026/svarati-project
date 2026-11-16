"""Ingestion dokumen ke database.

Contoh (jalankan dari folder backend, .venv aktif):
  python scripts/run_ingestion.py --status
  python scripts/run_ingestion.py --register sources.json     # daftarkan sumber dari file JSON, lalu ingest
  python scripts/run_ingestion.py                              # ingest semua entri (yang tidak berubah dilewati)
  python scripts/run_ingestion.py --entry 3 --force            # ingest ulang entri 3
"""
import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from svarati.db import close_pool, connection  # noqa: E402
from svarati.ingestion import ingest_entry, read_entries, register_sources  # noqa: E402


def print_status(conn):
    with conn.cursor() as cur:
        cur.execute("""SELECT e.entry_id, e.title, e.entry_type, e.topic, e.is_active,
                              e.processing_status, count(c.chunk_id)
                       FROM public.knowledge_entries e
                       LEFT JOIN public.knowledge_chunks c USING (entry_id)
                       GROUP BY e.entry_id ORDER BY e.entry_id""")
        rows = cur.fetchall()
    if not rows:
        print("Belum ada entri di knowledge_entries.")
    for r in rows:
        print(f"#{r[0]} | {r[1]} | {r[2]} | topik={r[3]} | aktif={r[4]} | status={r[5]} | chunk={r[6]}")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--register", metavar="FILE.json", help="daftarkan sumber dari file JSON sebelum ingest")
    ap.add_argument("--inactive", action="store_true", help="daftarkan sumber dengan is_active=false")
    ap.add_argument("--entry", type=int, action="append", help="hanya ingest entry_id ini (boleh diulang)")
    ap.add_argument("--force", action="store_true", help="ingest ulang walau checksum sama")
    ap.add_argument("--status", action="store_true", help="tampilkan status entri lalu keluar")
    args = ap.parse_args()

    try:
        with connection() as conn:
            if args.status:
                print_status(conn)
                return
            if args.register:
                sources = json.loads(Path(args.register).read_text(encoding="utf-8"))
                register_sources(conn, sources, active=not args.inactive)
                print(f"{len(sources)} sumber didaftarkan" + (" (is_active=false)." if args.inactive else
                      " dengan is_active=true. Pastikan sudah ditinjau sebelum dipakai publik; untuk menonaktifkan, "
                      "jalankan ulang dengan --inactive."))
            entries = read_entries(conn, args.entry)
            if not entries:
                print("Tidak ada entri untuk diproses.")
                return
            from svarati.embedding import get_embedder

            emb = get_embedder()
            total = sum(ingest_entry(conn, emb, e, force=args.force) for e in entries)
            print(f"Selesai. Total chunk ditulis: {total}")
            print_status(conn)
    finally:
        close_pool()


if __name__ == "__main__":
    main()
