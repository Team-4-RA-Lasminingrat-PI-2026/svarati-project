"""Embedding ONNX untuk server: tanpa torch dan sentence-transformers.

Mean pooling + normalisasi dan awalan query:/passage: sama dengan sentence-transformers.
Dipakai saat EMBEDDING_BACKEND=onnx.
"""
import os
import threading

import numpy as np
import onnxruntime as ort
from tokenizers import Tokenizer


class OnnxEmbedder:
    def __init__(self, model_dir):
        self.tokenizer = Tokenizer.from_file(os.path.join(model_dir, "tokenizer.json"))
        self.tokenizer.enable_truncation(max_length=512)
        self.tokenizer.enable_padding(pad_id=self.tokenizer.token_to_id("<pad>"), pad_token="<pad>")

        so = ort.SessionOptions()
        so.graph_optimization_level = ort.GraphOptimizationLevel.ORT_DISABLE_ALL
        so.enable_cpu_mem_arena = False
        so.enable_mem_pattern = False
        so.intra_op_num_threads = 1
        so.inter_op_num_threads = 1
        self.session = ort.InferenceSession(os.path.join(model_dir, "model.onnx"),
                                            sess_options=so,
                                            providers=["CPUExecutionProvider"])
        self.input_names = {i.name for i in self.session.get_inputs()}
        self._lock = threading.Lock()

    def _encode(self, texts):
        enc = self.tokenizer.encode_batch(texts)
        ids = np.array([e.ids for e in enc], dtype=np.int64)
        mask = np.array([e.attention_mask for e in enc], dtype=np.int64)
        feeds = {"input_ids": ids, "attention_mask": mask}
        if "token_type_ids" in self.input_names:
            feeds["token_type_ids"] = np.zeros_like(ids)
        with self._lock:
            hidden = self.session.run(None, feeds)[0]
        m = mask[..., None].astype(np.float32)
        pooled = (hidden * m).sum(axis=1) / np.clip(m.sum(axis=1), 1e-9, None)
        norm = np.linalg.norm(pooled, axis=1, keepdims=True)
        return (pooled / np.clip(norm, 1e-12, None)).astype("float32")

    def docs(self, texts):
        return self._encode([f"passage: {t}" for t in texts])

    def queries(self, texts):
        return self._encode([f"query: {t}" for t in texts])