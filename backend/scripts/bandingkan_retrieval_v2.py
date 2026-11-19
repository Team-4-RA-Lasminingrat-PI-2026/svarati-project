"""Bandingkan top-K retrieval e5 (kolom embedding) dengan Gemini (kolom embedding_gemini).

Versi 2: label menyertakan chunk_index, ada skor dan cuplikan top-1, dan pertanyaan
yang dilewati menyebutkan sisi yang kosong. Read-only.

Jalankan dari folder backend, dengan PYTHONPATH=src dan DATABASE_URL ke database utama.
"""
import argparse
import csv
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

import psycopg2  # noqa: E402
from psycopg2.extras import RealDictCursor  # noqa: E402

# Impor embedding lebih dulu: modul config memuat backend/.env
from svarati.embedding import Embedder  # noqa: E402
from svarati.embedding_gemini import GeminiEmbedder  # noqa: E402

PERTANYAAN = [
    "Fotoku diancam akan disebar oleh mantan, apa yang bisa kulakukan secara hukum?",
    "Apa saja hak korban kekerasan seksual?",
    "Atasanku sering berkomentar soal tubuhku, apakah itu pelecehan?",
    "Apa itu visum et repertum?",
    "Apakah visum wajib untuk melapor kasus kekerasan seksual?",
    "Berapa lama batas waktu untuk visum setelah kekerasan?",
    "Apa itu catcalling dan apakah bisa dipidana?",
    "Bagaimana cara melindungi diri dari kekerasan berbasis gender online?",
    "Apa tanda-tanda trauma setelah mengalami kekerasan?",
    "Bagaimana cara mendampingi korban yang sedang panik?",
    "Apa yang dimaksud persetujuan dalam hubungan seksual?",
    "Kekerasan dalam rumah tangga itu termasuk apa saja?",
    "Apa saja bentuk kekerasan seksual di kampus?",
    "Apa peran pemerintah dalam pelayanan terpadu untuk korban?",
    "Apa itu pemaksaan hubungan seksual dalam perkawinan?",
    "Bagaimana prosedur pengajuan visum di kepolisian?",
    "Apa itu golden hours setelah kekerasan?",
    "Bagaimana cara menjaga batas diri sebagai pendamping korban?",
    "Apa itu RESPECT dalam pencegahan kekerasan terhadap perempuan?",
    "Apakah pelecehan di tempat kerja bisa dilaporkan?",
]

# Nama kolom hanya dua nilai tetap di bawah, bukan input user
SQL = """
SELECT c.chunk_id, c.chunk_index, e.title, c.article_number, c.page_number,
       left(c.chunk_text, 200) AS cuplikan,
       1 - (c.{kol} <=> %s::vector) AS skor
FROM public.knowledge_chunks c
JOIN public.knowledge_entries e ON e.entry_id = c.entry_id
WHERE e.is_active AND c.{kol} IS NOT NULL
ORDER BY c.{kol} <=> %s::vector
LIMIT %s
"""


def literal(vec):
    return "[" + ",".join(f"{float(x):.8f}" for x in vec) + "]"


def teratas(cur, kol, vec, k):
    cur.execute(SQL.format(kol=kol), (literal(vec), literal(vec), k))
    return cur.fetchall()


def label(r):
    pasal = f" Pasal {r['article_number']}" if r["article_number"] else ""
    hal = f" hal.{r['page_number']}" if r["page_number"] else ""
    return f"{r['title'][:60]} | chunk {r['chunk_index']}{pasal}{hal}"


def cuplikan(r):
    return " ".join(str(r["cuplikan"]).split())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--k", type=int, default=5)
    ap.add_argument("--csv", default="hasil_evaluasi_v2.csv")
    args = ap.parse_args()

    url = os.environ.get("DATABASE_URL")
    if not url:
        sys.exit("DATABASE_URL kosong")

    e5 = Embedder()
    gem = GeminiEmbedder()

    conn = psycopg2.connect(url)
    conn.set_session(readonly=True, autocommit=True)

    hasil = []
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        for q in PERTANYAAN:
            a = teratas(cur, "embedding", e5.queries([q])[0], args.k)
            b = teratas(cur, "embedding_gemini", gem.queries([q])[0], args.k)
            if not a or not b:
                kosong = []
                if not a:
                    kosong.append("e5 (kolom embedding)")
                if not b:
                    kosong.append("Gemini (kolom embedding_gemini)")
                print(f"[lewati] hasil kosong dari {', '.join(kosong)}: {q}")
                continue
            ida = {r["chunk_id"] for r in a}
            idb = {r["chunk_id"] for r in b}
            row = {
                "pertanyaan": q,
                "sama_di_top_k": len(ida & idb),
                "top1_sama": a[0]["chunk_id"] == b[0]["chunk_id"],
                "top1_e5": label(a[0]),
                "skor_e5": round(float(a[0]["skor"]), 4),
                "cuplikan_e5": cuplikan(a[0]),
                "top1_gemini": label(b[0]),
                "skor_gemini": round(float(b[0]["skor"]), 4),
                "cuplikan_gemini": cuplikan(b[0]),
                "penilaian_manual": "",
            }
            hasil.append(row)
            print(f"{row['sama_di_top_k']}/{args.k} | top1 sama: {row['top1_sama']} | {q}")
    conn.close()

    if not hasil:
        sys.exit("tidak ada hasil")

    rata = sum(r["sama_di_top_k"] for r in hasil) / len(hasil)
    top1 = sum(1 for r in hasil if r["top1_sama"])
    print(f"\nRata-rata chunk sama di top-{args.k}: {rata:.2f} dari {args.k}")
    print(f"Top-1 sama: {top1} dari {len(hasil)} pertanyaan")

    with open(args.csv, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(hasil[0].keys()))
        w.writeheader()
        w.writerows(hasil)
    print(f"Hasil disimpan ke {args.csv}")
    print("Isi kolom penilaian_manual dengan: e5 / gemini / seri / keduanya_salah")


if __name__ == "__main__":
    main()