"""API FastAPI Svarati: /health, /health/db, /chat, /session, /feedback."""
import hmac
import logging
from contextlib import asynccontextmanager
from typing import Any, Literal, Optional

from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

from svarati import assessment, chat, config, labels, reference, storage
from svarati.db import close_pool, connection, init_pool
from svarati.embedding import get_embedder

logging.basicConfig(level=logging.DEBUG if config.DEBUG else logging.INFO)
log = logging.getLogger("svarati")


def _log_error(message: str, exc: Exception):
    """Catat error tanpa isi pesan pengguna. Traceback lengkap hanya saat DEBUG=true."""
    if config.DEBUG:
        log.exception(message)
    else:
        log.error("%s: %s", message, type(exc).__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_pool()
    get_embedder()  # muat model embedding sekali di awal (start pertama bisa lama)
    yield
    close_pool()


app = FastAPI(title="Svarati RAG API", lifespan=lifespan)

# Jika hanya dipanggil lewat proxy Next.js, CORS browser langsung tidak wajib.
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["*"],
)


def verify_api_key(x_api_key: Optional[str] = Header(default=None)):
    """Jika BACKEND_API_KEY diisi, permintaan wajib membawa header x-api-key yang sama."""
    if config.BACKEND_API_KEY and not hmac.compare_digest(x_api_key or "", config.BACKEND_API_KEY):
        raise HTTPException(status_code=401, detail=labels.ERR_UNAUTHORIZED)


class HistoryItem(BaseModel):
    role: Literal["user", "bot"]
    text: str = Field(..., max_length=2000)


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=config.MAX_MESSAGE_CHARS)
    answers: Optional[dict[str, Any]] = None
    consent: bool = False
    session_token: Optional[str] = None
    city: Optional[str] = Field(default=None, max_length=100)
    # True (default) = giliran pertama: jawaban asesmen bertanda darurat ikut memicu jalur darurat.
    # Nama field "pertama" dipertahankan karena dikirim frontend (lib api.js).
    pertama: bool = True
    # Beberapa giliran terakhir (maks 6) agar pertanyaan lanjutan dipahami.
    history: list[HistoryItem] = Field(default_factory=list, max_length=6)

    @field_validator("answers")
    @classmethod
    def limit_answers(cls, v):
        if v is not None and (len(v) > 10 or len(str(v)) > 2000):
            raise ValueError(labels.ERR_ANSWERS_TOO_LARGE)
        return v


class ChunkRef(BaseModel):
    chunk_id: int
    similarity: float = Field(..., ge=-1, le=1)


class Turn(BaseModel):
    user: str = Field(..., min_length=1, max_length=config.MAX_MESSAGE_CHARS)
    answer: str = Field(..., min_length=1, max_length=12000)
    # Harus sama dengan labels.MODE_* (disimpan di ai_messages.response_mode).
    mode: Literal["rag", "darurat", "tanpa_sumber", "gagal_verifikasi", "sapaan", "error_llm", "llm_kosong"]
    chunks: list[ChunkRef] = Field(default_factory=list, max_length=10)


class ImportRequest(BaseModel):
    session_token: str
    turns: list[Turn] = Field(..., min_length=1, max_length=50)


class FeedbackRequest(BaseModel):
    message_id: int
    session_token: str
    is_helpful: bool


class FeedbackReasonRequest(BaseModel):
    message_id: int
    session_token: str
    reason_code: str
    reason_text: Optional[str] = Field(default=None, max_length=storage.MAX_REASON_TEXT_LENGTH)
    consent: bool = False


class FeedbackDeleteRequest(BaseModel):
    message_id: int
    session_token: str


class SessionRequest(BaseModel):
    session_token: str


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/health/db", dependencies=[Depends(verify_api_key)])
def health_db():
    try:
        with connection() as conn, conn.cursor() as cur:
            cur.execute("""SELECT
                (SELECT count(*) FROM public.knowledge_entries
                   WHERE is_active AND processing_status = 'done') AS entri_aktif,
                (SELECT count(*) FROM public.knowledge_chunks) AS chunk""")
            active_entries, chunk_count = cur.fetchone()
        return {"status": "ok", "entri_aktif": active_entries, "chunk": chunk_count}
    except Exception as exc:
        _log_error("health/db gagal", exc)
        raise HTTPException(status_code=503, detail=labels.ERR_DB_UNREACHABLE)


@app.post("/chat", dependencies=[Depends(verify_api_key)])
def chat_endpoint(payload: ChatRequest):
    message = payload.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail=labels.ERR_EMPTY_QUESTION)

    should_save = payload.consent and config.STORE_CHAT
    if should_save and not storage.valid_token(payload.session_token):
        raise HTTPException(status_code=400, detail=labels.ERR_INVALID_SESSION)

    try:
        with connection() as conn:
            questionnaire = assessment.get_assessment(conn)
            stage = chat.prepare(conn, get_embedder(), questionnaire, message, payload.answers, payload.city,
                                 is_first_turn=payload.pertama,
                                 history=[r.model_dump() for r in payload.history])
        # Koneksi sudah dikembalikan ke pool; menunggu Gemini tidak menahan koneksi database.
        result = chat.finish(stage)

        # Sumber = chunk yang benar-benar dipakai jawaban (dari baris [[SUMBER: ...]] model).
        # Chunk yang sama disimpan agar riwayat dan rujukan sesuai dengan jawaban.
        sources = []
        shown_chunks = result.get("used_chunks", []) if result["mode"] == "rag" else []
        if shown_chunks:
            try:
                with connection() as conn:
                    sources = chat.list_sources(conn, shown_chunks)
            except Exception as exc:  # sumber tetap opsional; jawaban tetap dikirim
                _log_error("sumber gagal dimuat", exc)
    except Exception as exc:
        _log_error("chat gagal", exc)
        raise HTTPException(status_code=500, detail=labels.ERR_SERVICE_FAILED)

    references = []
    if shown_chunks:  # rujukan dihitung dari sumber yang dipakai jawaban
        try:
            with connection() as conn:
                references = reference.get_references_for_chunks(
                    conn, shown_chunks, result.get("mentions_provider", False))
        except Exception as exc:  # rujukan hanya tambahan; jawaban tetap dikirim
            _log_error("rujukan gagal", exc)

    message_id = None
    expires_at = None
    session_expired = False
    if should_save:
        try:
            with connection() as conn:
                sid = storage.ensure_session(conn, payload.session_token)
                message_id = storage.save_exchange(
                    conn, sid, message, result["answer"], shown_chunks, result["mode"])
                expires_at = storage.get_session_expiry(conn, payload.session_token)
        except storage.SessionExpired:
            session_expired = True  # jawaban tetap dikirim, tapi tidak disimpan
        except Exception as exc:  # jawaban tetap dikembalikan walau penyimpanan gagal
            _log_error("simpan percakapan gagal", exc)

    return {
        "answer": result["answer"],
        "mode": result["mode"],
        "sources": sources,
        # Dipakai klien untuk menyimpan chat belakangan (POST /session/import).
        # Sama dengan chunk yang disimpan di database.
        "chunks": [{"chunk_id": int(c["chunk_id"]), "similarity": round(float(c["sim"]), 4)}
                   for c in shown_chunks],
        "message_id": message_id,
        "warnings": result.get("warnings"),
        "rujukan": references,
        "berlaku_sampai": expires_at,
        "session_expired": session_expired,
    }


@app.post("/session", dependencies=[Depends(verify_api_key)])
def refresh_session(payload: SessionRequest):
    """Perpanjang masa simpan (30 hari sejak aktivitas terakhir) dan kembalikan tanggal kedaluwarsanya."""
    if not storage.valid_token(payload.session_token):
        raise HTTPException(status_code=400, detail=labels.ERR_INVALID_SESSION)
    if not config.STORE_CHAT:
        return {"berlaku_sampai": None}
    try:
        with connection() as conn:
            storage.ensure_session(conn, payload.session_token)
            expires_at = storage.get_session_expiry(conn, payload.session_token)
    except storage.SessionExpired:
        raise HTTPException(status_code=401, detail=labels.ERR_SESSION_EXPIRED)
    except Exception as exc:
        _log_error("perbarui sesi gagal", exc)
        raise HTTPException(status_code=500, detail=labels.ERR_SESSION_REFRESH_FAILED)
    return {"berlaku_sampai": expires_at}


@app.delete("/session", dependencies=[Depends(verify_api_key)])
def delete_session(payload: SessionRequest):
    """Hapus sesi dan seluruh percakapannya (dipanggil saat pengguna memilih tidak menyimpan)."""
    if not storage.valid_token(payload.session_token):
        raise HTTPException(status_code=400, detail=labels.ERR_INVALID_SESSION)
    try:
        with connection() as conn:
            storage.delete_session(conn, payload.session_token)
    except Exception as exc:
        _log_error("hapus sesi gagal", exc)
        raise HTTPException(status_code=500, detail=labels.ERR_SESSION_DELETE_FAILED)
    return {"ok": True}


@app.post("/session/messages", dependencies=[Depends(verify_api_key)])
def get_session_history(payload: SessionRequest):
    """Kembalikan riwayat percakapan tersimpan (hanya jika penyimpanan aktif)."""
    if not storage.valid_token(payload.session_token):
        raise HTTPException(status_code=400, detail=labels.ERR_INVALID_SESSION)
    if not config.STORE_CHAT:
        return {"messages": []}
    try:
        with connection() as conn:
            messages = storage.get_messages(conn, payload.session_token)
            try:
                bot_ids = [m["id"] for m in messages if m["from"] == "bot"]
                reference_map = reference.get_references_for_messages(conn, bot_ids)
            except Exception as exc:  # riwayat tetap dikembalikan tanpa rujukan
                _log_error("rujukan riwayat gagal", exc)
                conn.rollback()
                reference_map = {}
            try:
                source_map = reference.get_sources_for_messages(conn, bot_ids)
            except Exception as exc:  # riwayat tetap dikembalikan tanpa sumber
                _log_error("sumber riwayat gagal", exc)
                conn.rollback()
                source_map = {}
        for m in messages:
            m["sources"] = []
            if m["from"] == "bot":
                m["rujukan"] = reference_map.get(m["id"], [])
                m["sources"] = source_map.get(m["id"], [])
    except Exception as exc:
        _log_error("ambil riwayat gagal", exc)
        raise HTTPException(status_code=500, detail=labels.ERR_HISTORY_LOAD_FAILED)
    return {"messages": messages}


@app.post("/session/import", dependencies=[Depends(verify_api_key)])
def import_history(payload: ImportRequest):
    """Simpan chat yang semula tidak disimpan (pengguna baru memilih menyimpan). Balikan: message_id per giliran."""
    if not storage.valid_token(payload.session_token):
        raise HTTPException(status_code=400, detail=labels.ERR_INVALID_SESSION)
    if not config.STORE_CHAT:
        raise HTTPException(status_code=409, detail=labels.ERR_STORAGE_DISABLED)
    try:
        with connection() as conn:
            sid = storage.ensure_session(conn, payload.session_token)
            ids = storage.import_turns(conn, sid, [t.model_dump() for t in payload.turns])
            expires_at = storage.get_session_expiry(conn, payload.session_token)
    except storage.SessionExpired:
        raise HTTPException(status_code=401, detail=labels.ERR_SESSION_EXPIRED)
    except Exception as exc:
        _log_error("impor riwayat gagal", exc)
        raise HTTPException(status_code=500, detail=labels.ERR_HISTORY_SAVE_FAILED)
    return {"message_ids": ids, "berlaku_sampai": expires_at}


@app.delete("/feedback", dependencies=[Depends(verify_api_key)])
def delete_feedback(payload: FeedbackDeleteRequest):
    if not storage.valid_token(payload.session_token):
        raise HTTPException(status_code=400, detail=labels.ERR_INVALID_SESSION)
    try:
        with connection() as conn:
            ok = storage.delete_feedback(conn, payload.session_token, payload.message_id)
    except Exception as exc:
        _log_error("hapus feedback gagal", exc)
        raise HTTPException(status_code=500, detail=labels.ERR_FEEDBACK_DELETE_FAILED)
    if not ok:
        raise HTTPException(status_code=404, detail=labels.ERR_MESSAGE_OR_SESSION_NOT_FOUND)
    return {"status": "ok"}


@app.post("/feedback", dependencies=[Depends(verify_api_key)])
def submit_feedback(payload: FeedbackRequest):
    if not storage.valid_token(payload.session_token):
        raise HTTPException(status_code=400, detail=labels.ERR_INVALID_SESSION)
    try:
        with connection() as conn:
            ok = storage.save_feedback(conn, payload.session_token, payload.message_id, payload.is_helpful)
    except Exception as exc:
        _log_error("feedback gagal", exc)
        raise HTTPException(status_code=500, detail=labels.ERR_FEEDBACK_SAVE_FAILED)
    if not ok:
        raise HTTPException(status_code=404, detail=labels.ERR_MESSAGE_OR_SESSION_NOT_FOUND)
    return {"status": "ok"}


@app.post("/feedback/alasan", dependencies=[Depends(verify_api_key)])
def submit_feedback_reason(payload: FeedbackReasonRequest):
    """Simpan alasan penilaian "kurang membantu". Hanya disimpan jika pengguna setuju menyimpan chat."""
    if not storage.valid_token(payload.session_token):
        raise HTTPException(status_code=400, detail=labels.ERR_INVALID_SESSION)
    if payload.reason_code not in storage.VALID_REASON_CODES:
        raise HTTPException(status_code=400, detail=labels.ERR_UNKNOWN_REASON)
    if not payload.consent:
        return {"status": "ok", "disimpan": False}
    try:
        with connection() as conn:
            ok = storage.save_feedback_reason(conn, payload.session_token, payload.message_id,
                                              payload.reason_code, payload.reason_text)
    except Exception as exc:
        _log_error("simpan alasan gagal", exc)
        raise HTTPException(status_code=500, detail=labels.ERR_REASON_SAVE_FAILED)
    if not ok:
        raise HTTPException(status_code=404, detail=labels.ERR_MESSAGE_OR_SESSION_NOT_FOUND)
    return {"status": "ok", "disimpan": True}