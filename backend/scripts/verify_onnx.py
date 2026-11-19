"""Bandingkan embedding ONNX dengan sentence-transformers. Cosine harus mendekati 1.0."""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))
from svarati.embedding import Embedder  # noqa: E402
from svarati.embedding_onnx import OnnxEmbedder  # noqa: E402

TEXTS = [
    "Apa itu visum et repertum?",
    "Bagaimana prosedur pelaporan kekerasan seksual?",
    "Visum et repertum adalah keterangan tertulis dokter tentang hasil pemeriksaan.",
    "Layanan SAPA 129 beroperasi 24 jam.",
    "Hak korban atas pendampingan hukum.",
]

a = Embedder().queries(TEXTS)
b = OnnxEmbedder(os.environ.get("ONNX_DIR", "onnx_model")).queries(TEXTS)
cos = (a * b).sum(axis=1)
print("dimensi:", a.shape[1], b.shape[1])
print("cosine min:", float(cos.min()), "rata-rata:", float(cos.mean()))
if cos.min() < 0.9999:
    print("GAGAL: vektor berbeda. Jangan deploy ONNX dulu.")
    sys.exit(1)
print("OK: vektor ONNX sama dengan sentence-transformers.")