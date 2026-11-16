"""Penyimpanan percakapan anonim: anonymous_sessions, ai_messages, ai_message_sources, ai_feedback.

Hanya dipanggil jika pengguna memberi persetujuan. Redaksi di bawah hanya menyamarkan beberapa pola
(email, nomor telepon Indonesia, 16 digit) dan TIDAK menjamin anonimitas penuh.
"""
import hashlib
import re

from . import config

UUID_RE = re.compile(r"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$", re.I)


# Kode alasan penilaian "kurang membantu". Harus sama dengan KURATIF.ai.feedback.options di content/labels.js.
VALID_REASON_CODES = {"tidak_sesuai", "terlalu_panjang", "kurang_jelas", "layanan_tidak_tepat", "lainnya"}
MAX_REASON_TEXT_LENGTH = 200


def valid_token(token) -> bool:
    return isinstance(token, str) and bool(UUID_RE.match(token))


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def redact(value, limit=12000) -> str:
    t = str(value if value is not None else "")[:limit]
    t = re.sub(r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", "[EMAIL]", t, flags=re.I)
    t = re.sub(r"(?:\+?62|0)8\d{7,12}\b", "[NOMOR TELEPON]", t)
    t = re.sub(r"\b\d{16}\b", "[NOMOR IDENTITAS]", t)
    return t


def ensure_session(conn, token) -> int:
    token_hash = hash_token(token)
    with conn.cursor() as cur:
        cur.execute("""SELECT session_id, expires_at <= now() AS expired
                       FROM public.anonymous_sessions
                       WHERE session_token_hash = %s
                       FOR UPDATE""", (token_hash,))
        row = cur.fetchone()
        if row and row[1]:
            raise SessionExpired()
        if row:
            cur.execute("""UPDATE public.anonymous_sessions
                           SET last_active_at = now(),
                               expires_at = now() + make_interval(days => %s)
                           WHERE session_id = %s""", (config.SESSION_TTL_DAYS, row[0]))
            return row[0]
        cur.execute("""INSERT INTO public.anonymous_sessions (session_token_hash, expires_at)
                       VALUES (%s, now() + make_interval(days => %s))
                       ON CONFLICT (session_token_hash) DO NOTHING
                       RETURNING session_id""", (token_hash, config.SESSION_TTL_DAYS))
        new_row = cur.fetchone()
        if new_row:
            return new_row[0]
        raise SessionExpired()  # token baru dibuat request lain bersamaan; minta ulang


def save_exchange(conn, session_id, user_text, answer, chunks, mode=None) -> int:
    """Simpan pesan pengguna + jawaban AI + sumbernya. Kembalikan message_id jawaban AI.
    mode disimpan di ai_messages.response_mode (kolom ini harus ada)."""
    with conn.cursor() as cur:
        cur.execute("""INSERT INTO public.ai_messages (session_id, sender_type, message_type, content, sent_at)
                       VALUES (%s, 'user', %s, %s, now())""",
                    (session_id, config.MESSAGE_TYPE, redact(user_text)))
        cur.execute("""INSERT INTO public.ai_messages
                       (session_id, sender_type, message_type, content, sent_at, response_mode)
                       VALUES (%s, 'ai', %s, %s, now(), %s) RETURNING message_id""",
                    (session_id, config.MESSAGE_TYPE, redact(answer), mode))
        message_id = cur.fetchone()[0]
        if chunks:
            from psycopg2.extras import execute_values

            execute_values(cur, """INSERT INTO public.ai_message_sources
                                   (message_id, message_sender, chunk_id, rank_order, similarity) VALUES %s""",
                           [(message_id, "ai", int(c["chunk_id"]), i, round(float(c["sim"]), 4))
                            for i, c in enumerate(chunks, 1)])
    return message_id


def save_feedback(conn, token, message_id, is_helpful) -> bool:
    """Simpan/ubah umpan balik satu jawaban AI. False jika sesi atau pesan tidak ditemukan."""
    with conn.cursor() as cur:
        cur.execute("""SELECT session_id FROM public.anonymous_sessions
                       WHERE session_token_hash = %s AND expires_at > now()""", (hash_token(token),))
        row = cur.fetchone()
        if not row:
            return False
        session_id = row[0]
        cur.execute("""SELECT 1 FROM public.ai_messages
                       WHERE message_id = %s AND session_id = %s AND sender_type = 'ai'""",
                    (message_id, session_id))
        if not cur.fetchone():
            return False
        # Satu perintah atomik (unique message_id + session_id), tidak rawan balapan seperti UPDATE lalu INSERT.
        cur.execute("""INSERT INTO public.ai_feedback
                       (message_id, message_sender, session_id, is_helpful, created_at)
                       VALUES (%s, 'ai', %s, %s, now())
                       ON CONFLICT (message_id, session_id)
                       DO UPDATE SET is_helpful = EXCLUDED.is_helpful, created_at = now(),
                                     reason_code = NULL, reason_text = NULL""",
                    (message_id, session_id, is_helpful))
    return True

def delete_feedback(conn, token, message_id) -> bool:
    """Hapus penilaian satu jawaban AI milik sesi ini. False jika sesi atau pesan tidak ditemukan."""
    with conn.cursor() as cur:
        cur.execute("""DELETE FROM public.ai_feedback f
                       USING public.anonymous_sessions s
                       WHERE s.session_id = f.session_id
                         AND s.session_token_hash = %s
                         AND f.message_id = %s
                         AND f.message_sender = 'ai'""", (hash_token(token), message_id))
        return cur.rowcount > 0


def get_session_expiry(conn, token):
    """Tanggal kedaluwarsa sesi, dalam format ISO. None jika sesi tidak ditemukan."""
    with conn.cursor() as cur:
        cur.execute(
            "SELECT expires_at FROM public.anonymous_sessions WHERE session_token_hash = %s",
            (hash_token(token),),
        )
        row = cur.fetchone()
    return row[0].isoformat() if row else None

def delete_session(conn, token) -> bool:
    """Hapus sesi beserta semua pesan, sumber, dan umpan baliknya."""
    with conn.cursor() as cur:
        cur.execute("SELECT session_id FROM public.anonymous_sessions WHERE session_token_hash = %s",
                    (hash_token(token),))
        row = cur.fetchone()
        if not row:
            return False
        sid = row[0]
        cur.execute("""DELETE FROM public.ai_message_sources
                       WHERE message_id IN (SELECT message_id FROM public.ai_messages WHERE session_id = %s)""", (sid,))
        cur.execute("DELETE FROM public.ai_feedback WHERE session_id = %s", (sid,))
        cur.execute("DELETE FROM public.ai_messages WHERE session_id = %s", (sid,))
        cur.execute("DELETE FROM public.anonymous_sessions WHERE session_id = %s", (sid,))
    return True

def get_messages(conn, token, limit=200):
    """Riwayat percakapan sesi yang masih berlaku: limit pesan TERBARU, urut dari yang terlama.
    Menyertakan mode jawaban dan umpan balik (helpful: True/False/None)."""
    with conn.cursor() as cur:
        cur.execute("""SELECT message_id, sender_type, content, response_mode, is_helpful FROM (
                           SELECT m.message_id, m.sender_type, m.content, m.response_mode, f.is_helpful
                           FROM public.ai_messages m
                           JOIN public.anonymous_sessions s ON s.session_id = m.session_id
                           LEFT JOIN public.ai_feedback f
                                  ON f.message_id = m.message_id AND f.session_id = m.session_id
                           WHERE s.session_token_hash = %s AND s.expires_at > now()
                           ORDER BY m.message_id DESC
                           LIMIT %s) t
                       ORDER BY message_id ASC""", (hash_token(token), limit))
        return [{"id": r[0], "from": "bot" if r[1] == "ai" else "user", "text": r[2],
                 "mode": r[3], "helpful": r[4]}
                for r in cur.fetchall()]


def import_turns(conn, session_id, turns) -> list:
    """Simpan beberapa giliran sekaligus (chat yang semula tidak disimpan). Urutan input = urutan simpan.
    turns: [{'user', 'answer', 'mode', 'chunks': [{'chunk_id', 'similarity'}]}].
    Kembalikan message_id jawaban AI untuk tiap giliran, sesuai urutan."""
    all_chunk_ids = {c["chunk_id"] for t in turns for c in t.get("chunks", [])}
    existing = set()
    if all_chunk_ids:
        with conn.cursor() as cur:
            cur.execute("SELECT chunk_id FROM public.knowledge_chunks WHERE chunk_id = ANY(%s)", (list(all_chunk_ids),))
            existing = {r[0] for r in cur.fetchall()}
    ids = []
    for t in turns:
        chunks = [{"chunk_id": c["chunk_id"], "sim": c["similarity"]}
                  for c in t.get("chunks", []) if c["chunk_id"] in existing]  # chunk yang sudah dihapus dilewati
        ids.append(save_exchange(conn, session_id, t["user"], t["answer"], chunks, t["mode"]))
    return ids


def save_feedback_reason(conn, token, message_id, reason_code, reason_text) -> bool:
    """Simpan alasan untuk penilaian "kurang membantu" milik sesi ini. False jika tidak ditemukan."""
    text = redact((reason_text or "").strip())[:MAX_REASON_TEXT_LENGTH] or None
    with conn.cursor() as cur:
        cur.execute("""UPDATE public.ai_feedback f
                       SET reason_code = %s, reason_text = %s
                       FROM public.anonymous_sessions s
                       WHERE s.session_id = f.session_id
                         AND s.session_token_hash = %s
                         AND f.message_id = %s
                         AND f.is_helpful = false""",
                    (reason_code, text, hash_token(token), message_id))
        return cur.rowcount > 0
