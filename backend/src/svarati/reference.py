"""Rujukan ke halaman lain dari sumber yang dipakai jawaban: artikel edukasi, direktori layanan, pemulihan."""

from .retrieval import build_display_title

RECOVERY_TOPICS = {"kesehatan_mental"}
MAX_ARTICLES = 2
MAIN_SOURCE_COUNT = 3  # hanya sumber peringkat teratas yang dianggap benar-benar dipakai jawaban

_SQL_CHUNK = """SELECT c.chunk_id, c.metadata, e.entry_type, e.topic, e.slug, e.title,
                       e.show_in_education, e.is_active,
                       (e.content_md IS NOT NULL AND e.content_md <> '') AS has_content
                FROM public.knowledge_chunks c
                JOIN public.knowledge_entries e ON e.entry_id = c.entry_id
                WHERE c.chunk_id = ANY(%s)"""

_SQL_MESSAGE = """SELECT s.message_id, s.rank_order, c.metadata, e.entry_type, e.topic, e.slug, e.title,
                         e.show_in_education, e.is_active,
                         (e.content_md IS NOT NULL AND e.content_md <> '') AS has_content
                  FROM public.ai_message_sources s
                  JOIN public.knowledge_chunks c ON c.chunk_id = s.chunk_id
                  JOIN public.knowledge_entries e ON e.entry_id = c.entry_id
                  WHERE s.message_id = ANY(%s)
                  ORDER BY s.message_id, s.rank_order"""


def build_references(rows, mentions_provider=False):
    """Murni (tanpa database). rows: dict berurut menurut peringkat sumber.

    Hasil: daftar {'type': 'artikel' | 'layanan' | 'pemulihan', ...} (nilai 'type' dibaca frontend).
    Artikel hanya jika show_in_education.
    """
    main_rows = list(rows)[:MAIN_SOURCE_COUNT]
    references, seen_slugs = [], set()
    for row in main_rows:
        slug = row.get("slug")
        if (row.get("show_in_education") and row.get("is_active") and row.get("has_content")
                and slug and slug not in seen_slugs):
            seen_slugs.add(slug)
            references.append({"type": "artikel", "title": row.get("title"), "slug": slug})
            if len(references) >= MAX_ARTICLES:
                break
    if mentions_provider or any(row.get("entry_type") == "layanan" for row in main_rows):
        references.append({"type": "layanan"})
    topics = set()
    for row in main_rows:
        topics.add(row.get("topic"))
        topics.update((row.get("metadata") or {}).get("topics", []))
    if topics & RECOVERY_TOPICS:
        references.append({"type": "pemulihan"})
    return references


def get_references_for_chunks(conn, chunks, mentions_provider=False):
    """Rujukan untuk jawaban yang baru dibuat (chunks = hasil pencarian)."""
    ids = [int(c["chunk_id"]) for c in (chunks or [])[:MAIN_SOURCE_COUNT]]
    if not ids:
        return []
    from psycopg2.extras import RealDictCursor

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(_SQL_CHUNK, (ids,))
        by_chunk_id = {r["chunk_id"]: r for r in cur.fetchall()}
    return build_references([by_chunk_id[i] for i in ids if i in by_chunk_id], mentions_provider)


def get_references_for_messages(conn, message_ids):
    """Rujukan untuk riwayat tersimpan: {message_id: [rujukan]}, dihitung dari ai_message_sources."""
    if not message_ids:
        return {}
    from psycopg2.extras import RealDictCursor

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(_SQL_MESSAGE, (list(message_ids),))
        rows = cur.fetchall()
    by_message = {}
    for row in rows:
        by_message.setdefault(row["message_id"], []).append(row)
    return {message_id: build_references(message_rows) for message_id, message_rows in by_message.items()}


_SQL_SOURCES = """SELECT s.message_id, s.rank_order, c.article_number, c.page_number,
                         e.title, e.entry_type, e.slug, e.official_source_url,
                         e.show_in_education, e.is_active,
                         (e.content_md IS NOT NULL AND e.content_md <> '') AS has_content
                  FROM public.ai_message_sources s
                  JOIN public.knowledge_chunks c ON c.chunk_id = s.chunk_id
                  JOIN public.knowledge_entries e ON e.entry_id = c.entry_id
                  WHERE s.message_id = ANY(%s)
                  ORDER BY s.message_id, s.rank_order"""


def get_sources_for_messages(conn, message_ids):
    """Sumber untuk riwayat tersimpan: {message_id: [sumber]}, bentuk sama dengan chat.list_sources."""
    if not message_ids:
        return {}
    from psycopg2.extras import RealDictCursor

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(_SQL_SOURCES, (list(message_ids),))
        rows = cur.fetchall()
    by_message, seen = {}, set()
    for row in rows:
        title = build_display_title(row)
        key = (row["message_id"], title)
        if key in seen:  # judul unik per pesan, seperti di list_sources
            continue
        seen.add(key)
        by_message.setdefault(row["message_id"], []).append({
            "title": title,
            "doc_title": row.get("title"),
            "entry_type": row.get("entry_type"),
            "article_number": row.get("article_number"),
            "page": row.get("page_number"),
            "slug": row.get("slug"),
            "article_slug": row.get("slug") if (row.get("show_in_education") and row.get("is_active")
                                                and row.get("has_content")) else None,
            "official_source_url": row.get("official_source_url"),
        })
    return by_message