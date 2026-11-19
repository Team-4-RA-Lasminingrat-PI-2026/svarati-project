"""Embedding Gemini (API) untuk pertanyaan dan dokumen.

Dipakai saat EMBEDDING_BACKEND=gemini.
Model dan dimensi harus sama dengan data di kolom embedding_gemini
(gemini-embedding-001, 768 dimensi).
"""
import os
import time

import numpy as np
from google import genai
from google.genai import errors, types

MODEL = os.getenv("GEMINI_EMBED_MODEL", "gemini-embedding-001")
DIM = int(os.getenv("GEMINI_EMBED_DIM", "768"))
BATCH = int(os.getenv("GEMINI_EMBED_BATCH", "50"))
RETRY = 5


class GeminiEmbedder:
    def __init__(self, api_key=None):
        key = api_key or os.getenv("GEMINI_API_KEY")
        if not key:
            raise RuntimeError("GEMINI_API_KEY belum diisi")
        self.client = genai.Client(api_key=key)
        self.name = MODEL

    def _call(self, texts, task_type):
        cfg = types.EmbedContentConfig(task_type=task_type, output_dimensionality=DIM)
        for attempt in range(RETRY):
            try:
                res = self.client.models.embed_content(model=MODEL, contents=texts, config=cfg)
                vals = [e.values for e in res.embeddings]
                if len(vals) != len(texts):
                    raise RuntimeError("jumlah embedding tidak sama dengan jumlah teks")
                return vals
            except errors.APIError as exc:
                code = getattr(exc, "code", 0)
                last = attempt == RETRY - 1
                if code == 429 and not last:
                    # Kuota per menit reset sekitar 60 detik; tunggu lebih lama dari itu
                    time.sleep(65)
                    continue
                if code == 503 and not last:
                    time.sleep(2 ** attempt * 2)
                    continue
                raise
        raise RuntimeError("embedding gagal setelah beberapa kali percobaan")

    def _embed(self, texts, task_type):
        texts = list(texts)
        out = []
        for i in range(0, len(texts), BATCH):
            out.extend(self._call(texts[i:i + BATCH], task_type))
        arr = np.array(out, dtype="float32")
        norm = np.linalg.norm(arr, axis=1, keepdims=True)
        return arr / np.clip(norm, 1e-12, None)

    def queries(self, texts):
        return self._embed(texts, "RETRIEVAL_QUERY")

    def docs(self, texts):
        return self._embed(texts, "RETRIEVAL_DOCUMENT")