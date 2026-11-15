"""Koneksi PostgreSQL (Supabase) dengan connection pool."""
import time
from contextlib import contextmanager

from . import config

_pool = None


def init_pool():
    global _pool
    if _pool is None:
        if not config.DATABASE_URL:
            raise RuntimeError("DATABASE_URL belum diisi di backend/.env")
        from psycopg2 import pool

        _pool = pool.ThreadedConnectionPool(
            config.DB_POOL_MIN,
            config.DB_POOL_MAX,
            dsn=config.DATABASE_URL,
            keepalives=1,
            keepalives_idle=30,
            keepalives_interval=10,
            keepalives_count=5,
        )
    return _pool


def close_pool():
    global _pool
    if _pool is not None:
        _pool.closeall()
        _pool = None


def _acquire_connection(conn_pool, wait_seconds=5.0):
    """getconn() milik psycopg2 langsung error saat pool penuh; di sini menunggu sebentar dulu."""
    from psycopg2 import pool as _pg

    deadline = time.monotonic() + wait_seconds
    while True:
        try:
            return conn_pool.getconn()
        except _pg.PoolError:
            if time.monotonic() >= deadline:
                raise
            time.sleep(0.05)


@contextmanager
def connection():
    """Pinjam koneksi dari pool. Commit jika sukses, rollback jika error."""
    from psycopg2 import InterfaceError, OperationalError
    from pgvector.psycopg2 import register_vector

    conn_pool = init_pool()
    conn = _acquire_connection(conn_pool)

    # Tes koneksi; jika basi, buang dan ambil yang baru (maks 3 percobaan).
    for _ in range(3):
        try:
            with conn.cursor() as cur:
                cur.execute("SELECT 1")
            conn.rollback()
            break
        except (OperationalError, InterfaceError):
            conn_pool.putconn(conn, close=True)
            conn = _acquire_connection(conn_pool)
    else:
        conn_pool.putconn(conn, close=True)
        raise OperationalError("Tidak dapat memperoleh koneksi database yang sehat.")

    broken = False
    try:
        register_vector(conn)
        yield conn
        conn.commit()
    except Exception as exc:
        if isinstance(exc, (OperationalError, InterfaceError)):
            broken = True
        try:
            conn.rollback()
        except Exception:
            broken = True
        raise
    finally:
        conn_pool.putconn(conn, close=broken or bool(conn.closed))
