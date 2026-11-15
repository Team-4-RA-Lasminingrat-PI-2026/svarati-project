"""Pencarian: kandidat dari match_knowledge_chunks (pgvector) lalu re-rank di aplikasi."""
from . import config


def build_display_title(row):
    """Judul untuk UI dan prompt: judul dokumen, plus Pasal dan halaman jika ada."""
    title = row.get("title") or ""
    if row.get("article_number"):
        title += f" - Pasal {row['article_number']}"
    if row.get("page_number") is not None:
        title += f" (hal. {int(row['page_number'])})"
    return title


def rerank(rows, plan, k, min_sim, max_per_entry=None, topic_boost=None, type_boost=None):
    """Murni (tanpa database): saring MIN_SIM, beri boost topik/tipe, batasi chunk per dokumen, ambil k teratas."""
    max_per_entry = config.MAX_PER_ENTRY if max_per_entry is None else max_per_entry
    topic_boost = config.TOPIC_BOOST if topic_boost is None else topic_boost
    type_boost = config.TYPE_BOOST if type_boost is None else type_boost
    plan_topics = set(plan.get("topics", []))
    plan_types = set(plan.get("entry_types", []))

    scored = []
    for row in rows:
        sim = float(row["similarity"])
        if sim < min_sim:
            continue
        topics = set((row.get("metadata") or {}).get("topics", [])) | {row.get("topic")}
        topic_match = bool(plan_topics & topics)
        type_match = row.get("entry_type") in plan_types
        item = dict(row)
        item.update(sim=sim, topic_match=topic_match, type_match=type_match,
                    score=sim + topic_boost * topic_match + type_boost * type_match,
                    display_title=build_display_title(row))
        scored.append(item)
    scored.sort(key=lambda x: x["score"], reverse=True)

    selected, counts = [], {}
    for item in scored:
        if counts.get(item["entry_id"], 0) >= max_per_entry:
            continue
        counts[item["entry_id"]] = counts.get(item["entry_id"], 0) + 1
        selected.append(item)
        if len(selected) >= k:
            break
    return selected


def search_chunks(conn, embedder, query, plan, k=None, min_sim=None):
    """Cari chunk paling mirip (CANDIDATE_LIMIT kandidat dari database), lalu re-rank."""
    from psycopg2.extras import RealDictCursor

    k = config.TOP_K if k is None else k
    min_sim = config.MIN_SIM if min_sim is None else min_sim
    query_vector = embedder.queries([query])[0]
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("SELECT * FROM public.match_knowledge_chunks(%s::vector, %s, %s)",
                    (query_vector, config.CANDIDATE_LIMIT, config.REQUIRE_VERIFIED))
        rows = cur.fetchall()
    return rerank(rows, plan, k, min_sim)


def top_similarity(conn, embedder, text):
    """Skor kemiripan tertinggi untuk satu teks (untuk kalibrasi MIN_SIM)."""
    query_vector = embedder.queries([text])[0]
    with conn.cursor() as cur:
        cur.execute("SELECT similarity FROM public.match_knowledge_chunks(%s::vector, 1, %s)",
                    (query_vector, config.REQUIRE_VERIFIED))
        row = cur.fetchone()
    return float(row[0]) if row else None
