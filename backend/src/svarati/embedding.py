"""Model embedding, dimuat sekali per proses.

Bawaan: multilingual-e5-base (768 dimensi, diatur lewat EMBEDDING_MODEL).
Dimensi model harus sama dengan kolom vector di database.
"""
import os
import threading

from . import config

_embedder = None
_lock = threading.Lock()


class Embedder:
    def __init__(self, name=None):
        from sentence_transformers import SentenceTransformer

        self.name = name or config.EMBEDDING_MODEL
        self.model = SentenceTransformer(self.name)
        self.model.max_seq_length = 512
        self._enc_lock = threading.Lock()

    def _encode(self, texts):
        with self._enc_lock:
            return self.model.encode(texts, normalize_embeddings=True, batch_size=16,
                                     show_progress_bar=False).astype("float32")

    def docs(self, texts):
        """Teks dokumen diberi awalan 'passage: ' (judul digabung oleh pemanggil)."""
        return self._encode([f"passage: {t}" for t in texts])

    def queries(self, texts):
        return self._encode([f"query: {t}" for t in texts])


def get_embedder():
    global _embedder
    with _lock:
        if _embedder is None:
            if os.environ.get("EMBEDDING_BACKEND", "sentence-transformers") == "onnx":
                from .embedding_onnx import OnnxEmbedder
                _embedder = OnnxEmbedder(os.environ.get("ONNX_DIR", "onnx_model"))
            else:
                _embedder = Embedder()
        return _embedder