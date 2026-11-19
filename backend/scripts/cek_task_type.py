"""Cari kombinasi task type dan format teks yang dipakai saat ingest Gemini.

Mengambil beberapa chunk acak dari database (read-only), membuat ulang embedding
dengan berbagai task type dan format teks, lalu membandingkannya dengan vektor
yang tersimpan di kolom embedding_gemini. Kombinasi yang benar menghasilkan
cosine mendekati 1.0.

Jalankan dari folder backend dengan PYTHONPATH=src.
"""
import argparse
import itertools
import json
import os
import sys

import numpy as np
import psycopg2
from psycopg2.extras import RealDictCursor

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from svarati import config  # noqa: E402,F401  (memuat backend/.env)
from google import genai  # noqa: E402
from google.genai import types  # noqa: E402

MODEL = "gemini-embedding-001"
DIM = 768
TASKS = [
    None,
    "RETRIEVAL_DOCUMENT",
    "RETRIEVAL_QUERY",
    "SEMANTIC_SIMILARITY",
    "CLASSIFICATION",
    "CLUSTERING",
    "QUESTION_ANSWERING",
    "FACT_VERIFICATION",
]


def formats(r):
    # Pakai judul dan template dari metadata (seperti saat ingest e5), bukan judul dokumen
    judul = r.get("judul") or r["title"]
    tpl = r.get("embed_tpl") or "passage: {judul}\n{teks}"
    meta = tpl.replace("{judul}", judul).replace("{teks}", r["chunk_text"])
    return {
        "isi_saja": r["chunk_text"],
        "judul_baris_isi": f"{judul}\n{r['chunk_text']}",
        "embed_metadata": meta,
        "embed_tanpa_passage": meta.replace("passage: ", "", 1),
    }


def embed(client, text, task):
    kw = {"output_dimensionality": DIM}
    if task:
        kw["task_type"] = task
    res = client.models.embed_content(model=MODEL, contents=[text], config=types.EmbedContentConfig(**kw))
    return np.array(res.embeddings[0].values, dtype="float32")


def cosine(a, b):
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-12))


def parse_vec(s):
    return np.array(json.loads(s), dtype="float32") if isinstance(s, str) else np.array(s, dtype="float32")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--n", type=int, default=3, help="jumlah chunk sampel")
    args = ap.parse_args()

    client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    conn.set_session(readonly=True, autocommit=True)

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            """
            SELECT c.chunk_id, c.chunk_text, e.title,
                   c.metadata->>'judul' AS judul,
                   c.metadata->>'embed' AS embed_tpl,
                   c.embedding_gemini::text AS vec
            FROM public.knowledge_chunks c
            JOIN public.knowledge_entries e ON e.entry_id = c.entry_id
            WHERE c.embedding_gemini IS NOT NULL
            ORDER BY random()
            LIMIT %s
            """,
            (args.n,),
        )
        rows = cur.fetchall()
    conn.close()

    if not rows:
        sys.exit("tidak ada chunk dengan embedding_gemini")

    skor = {}
    for r in rows:
        tersimpan = parse_vec(r["vec"])
        if len(tersimpan) != DIM:
            print(f"chunk {r['chunk_id']}: dimensi {len(tersimpan)}, bukan {DIM}")
            continue
        for (fmt, teks), task in itertools.product(formats(r).items(), TASKS):
            vec = embed(client, teks, task)
            skor.setdefault((fmt, task or "(tanpa task_type)"), []).append(cosine(vec, tersimpan))

    hasil = sorted(
        ((k, float(np.mean(v)), float(np.min(v))) for k, v in skor.items()),
        key=lambda x: x[1],
        reverse=True,
    )

    print(f"Sampel: {len(rows)} chunk\n")
    print(f"{'format teks':22} {'task_type':24} {'rata-rata':>10} {'min':>8}")
    for (fmt, task), rata, mn in hasil[:12]:
        print(f"{fmt:22} {task:24} {rata:10.4f} {mn:8.4f}")

    terbaik = hasil[0]
    print()
    if terbaik[1] > 0.99:
        print(f"Kecocokan kuat: format={terbaik[0][0]}, task_type={terbaik[0][1]}")
    elif terbaik[1] > 0.9:
        print("Kecocokan sedang. Coba tambah --n agar lebih yakin.")
    else:
        print("Tidak ada kecocokan jelas. Kemungkinan model atau versi berbeda, kirim outputnya ke sini.")


if __name__ == "__main__":
    main()