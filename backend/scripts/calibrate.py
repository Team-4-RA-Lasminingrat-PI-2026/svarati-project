"""Kalibrasi MIN_SIM: bandingkan skor tertinggi pertanyaan relevan vs di luar topik.

  python scripts/calibrate.py                         # memakai contoh bawaan
  python scripts/calibrate.py --file calibration.json # {"relevan": [...], "diluar_topik": [...]}
"""
import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from svarati import config  # noqa: E402
from svarati.db import close_pool, connection  # noqa: E402
from svarati.embedding import get_embedder  # noqa: E402
from svarati.retrieval import top_similarity  # noqa: E402

DEFAULT = {
    "relevan": [
        "Fotoku diancam akan disebar oleh mantan, apa yang bisa kulakukan secara hukum?",
        "Apa saja hak korban kekerasan seksual?",
        "Atasanku sering berkomentar soal tubuhku, apakah itu pelecehan?",
    ],
    "diluar_topik": ["Resep nasi goreng yang enak", "Cara install Python di Windows", "Siapa juara Piala Dunia 2018?"],
}


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--file")
    args = ap.parse_args()
    data = json.loads(Path(args.file).read_text(encoding="utf-8")) if args.file else DEFAULT
    emb = get_embedder()
    try:
        with connection() as conn:
            relevant = [(q, top_similarity(conn, emb, q)) for q in data["relevan"]]
            off_topic = [(q, top_similarity(conn, emb, q)) for q in data["diluar_topik"]]
    finally:
        close_pool()
    for title, scored in (("RELEVAN", relevant), ("DI LUAR TOPIK", off_topic)):
        print(f"\n{title}")
        for q, s in scored:
            print(f"  {s if s is None else round(s, 3)} | {q}")
    relevant_scores = [s for _, s in relevant if s is not None]
    off_topic_scores = [s for _, s in off_topic if s is not None]
    print(f"\nMIN_SIM saat ini: {config.MIN_SIM}")
    if not relevant_scores or not off_topic_scores:
        print("Data belum cukup (pastikan ada entri aktif berstatus done dengan chunk).")
    elif min(relevant_scores) > max(off_topic_scores):
        middle = (min(relevant_scores) + max(off_topic_scores)) / 2
        print(f"Saran MIN_SIM ~ {middle:.3f} (tengah antara terendah relevan dan tertinggi di luar topik)")
    else:
        print("Skor relevan dan di luar topik tumpang tindih: tambah/perbaiki data uji.")


if __name__ == "__main__":
    main()
