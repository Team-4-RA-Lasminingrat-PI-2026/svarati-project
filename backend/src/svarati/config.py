"""Konfigurasi backend Svarati. Semua nilai dibaca dari backend/.env."""
import os
from pathlib import Path

from dotenv import load_dotenv

BACKEND_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BACKEND_DIR / ".env")


def _env_bool(name: str, default: bool) -> bool:
    return os.getenv(name, str(default)).strip().lower() in ("1", "true", "yes", "y", "on")


def _env_int(name: str, default: int) -> int:
    return int(os.getenv(name, str(default)))


def _env_float(name: str, default: float) -> float:
    return float(os.getenv(name, str(default)))


# --- Layanan eksternal
DATABASE_URL = os.getenv("DATABASE_URL", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")
GEMINI_FALLBACK_MODEL = os.getenv("GEMINI_FALLBACK_MODEL", "gemini-3.8-flash")
# Kecepatan Gemini. Total terburuk ~ GEMINI_ATTEMPTS x GEMINI_TIMEOUT_SECONDS; jaga di bawah timeout proxy Next.js (60 dtk).
GEMINI_TIMEOUT_SECONDS = _env_float("GEMINI_TIMEOUT_SECONDS", 20)
GEMINI_ATTEMPTS = _env_int("GEMINI_ATTEMPTS", 2)
# Hanya untuk model gemini-3.x: minimal | low | medium | high. (Model 2.5 memakai thinking_budget=0.)
GEMINI_THINKING_LEVEL = os.getenv("GEMINI_THINKING_LEVEL", "low")
# Token "berpikir" ikut terhitung; jangan terlalu kecil agar jawaban tidak terpotong.
GEMINI_MAX_OUTPUT_TOKENS = _env_int("GEMINI_MAX_OUTPUT_TOKENS", 2048)
# True = jika ada pasal/nomor tak bersumber, tulis ulang lewat panggilan Gemini kedua (2x lebih lama).
# False = langsung dibuang oleh strip_unsourced.
VERIFY_RETRY = _env_bool("VERIFY_RETRY", False)

# --- Embedding
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "intfloat/multilingual-e5-base")
EMBEDDING_BACKEND = os.getenv("EMBEDDING_BACKEND", "sentence-transformers")

# --- Chunking
CHUNK_SIZE = _env_int("CHUNK_SIZE", 1000)
CHUNK_OVERLAP = _env_int("CHUNK_OVERLAP", 180)
# Nama variabel .env INDEKS_PENJELASAN dan KANDIDAT sengaja tidak diubah agar .env lama tetap berlaku.
INDEX_EXPLANATIONS = _env_bool("INDEKS_PENJELASAN", False)

# --- Retrieval
CANDIDATE_LIMIT = _env_int("KANDIDAT", 20)
TOP_K = _env_int("TOP_K", 4)
MAX_PER_ENTRY = _env_int("MAX_PER_ENTRY", 2)
MIN_SIM = _env_float("MIN_SIM", 0.78)
TOPIC_BOOST = _env_float("TOPIC_BOOST", 0.02)
TYPE_BOOST = _env_float("TYPE_BOOST", 0.01)
REQUIRE_VERIFIED = _env_bool("REQUIRE_VERIFIED", False)

# --- Percakapan
STORE_CHAT = _env_bool("STORE_CHAT", True)
SESSION_TTL_DAYS = _env_int("SESSION_TTL_DAYS", 30)
MAX_MESSAGE_CHARS = _env_int("MAX_MESSAGE_CHARS", 4000)
MESSAGE_TYPE = "text"  # nilai kolom ai_messages.message_type

# --- Server
# Kunci bersama Next.js <-> FastAPI. Jika diisi, semua endpoint selain /health wajib mengirim header x-api-key.
BACKEND_API_KEY = os.getenv("BACKEND_API_KEY", "")
_DEFAULT_CORS = "http://localhost:3000,http://127.0.0.1:3000"
CORS_ORIGINS = [o.strip() for o in os.getenv("CORS_ORIGINS", _DEFAULT_CORS).split(",") if o.strip()]
DEBUG = _env_bool("DEBUG", False)
DB_POOL_MIN = _env_int("DB_POOL_MIN", 1)
DB_POOL_MAX = _env_int("DB_POOL_MAX", 5)