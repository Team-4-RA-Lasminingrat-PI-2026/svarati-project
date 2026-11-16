"""Pembersihan teks dan chunking. Fungsi di sini murni (tanpa database/jaringan)."""
import re

from .config import CHUNK_OVERLAP, CHUNK_SIZE, INDEX_EXPLANATIONS
from .topics import detect_chunk_topics

# Penanda halaman sementara yang disisipkan join_pages(), dibuang lagi sebelum chunk disimpan.
PAGE_MARK_RE = re.compile(r"\[\[HAL:(\d+)\]\]")
HEADING_RE = re.compile(r"^\s*(Pasal\s+\d+[A-Z]?|BAB\s+[IVXLC]+|Bagian\s+\w+|Paragraf\s+\d+)\b", re.I)
CLAUSE_RE = re.compile(r"^\s*(\(\d+\)|[a-z]\.|\d+\.)\s*$")
EXPLANATION_RE = re.compile(r"(?m)^\s*PENJELASAN\s*(?:ATAS)?\s*$")
ARTICLE_RE = re.compile(r"(?m)^[ \t]*Pasal\s+(\d+[A-Z]?)[ \t]*$")
CHAPTER_RE = re.compile(r"(?m)^[ \t]*BAB\s+([IVXLC]+)[ \t]*$")
BOUNDARY_RE = re.compile(
    r"(?m)^[ \t]*(?:BAB\s+[IVXLC]+|Bagian\s+(?:Kesatu|Kedua|Ketiga|Keempat|Kelima|Keenam|Ketujuh|"
    r"Kedelapan|Kesembilan|Kesepuluh)|Paragraf\s+\d+|Disahkan di\b.*|Diundangkan di\b.*)[ \t]*$")
TRAILING_PAGE_MARKS_RE = re.compile(r"(?:\s*\[\[HAL:\d+\]\]\s*)+$")
TITLE_RE = re.compile(r"^(#{1,6}\s+.+|(?:Langkah|Tahap|Bagian)\s+\d+.*|[A-Z][A-Z0-9 ,&/()\-]{3,70})$")


def clean_text(t):
    """Rapikan spasi, pemisah kata antar baris, dan baris kosong berlebih."""
    t = t.replace("\r", "\n").replace("\u00a0", " ")
    t = re.sub(r"(\w)-\n(\w)", r"\1\2", t)
    t = re.sub(r"[ \t]+", " ", t)
    t = re.sub(r"\n[ \t]+", "\n", t)
    t = re.sub(r"\n{3,}", "\n\n", t)
    return t.strip()


def remove_headers_footers(pages, threshold=0.4):
    """Buang baris yang berulang di banyak halaman (header/footer) dan nomor halaman '- 12 -'."""
    n = len(pages)
    counts = {}
    for _, t in pages:
        for ln in {line.strip() for line in t.splitlines() if line.strip()}:
            counts[ln] = counts.get(ln, 0) + 1
    min_repeats = max(3, int(threshold * n))

    def should_remove(ln):
        s = ln.strip()
        if re.match(r"^-\s*\d{1,3}\s*-$", s) or re.match(r"^halaman\s+\d+", s, re.I):
            return True
        return (n >= 3 and counts.get(s, 0) >= min_repeats and len(s) < 80
                and not HEADING_RE.match(s) and not CLAUSE_RE.match(s))

    return [(page_no, "\n".join(line for line in t.splitlines() if not should_remove(line))) for page_no, t in pages]


def join_pages(pages):
    out = []
    for page_no, t in pages:
        if page_no is not None:
            out.append(f"\n[[HAL:{page_no}]]\n")
        out.append(t)
    return "\n".join(out)


def page_at(text, pos, base_page):
    h = base_page
    for m in PAGE_MARK_RE.finditer(text, 0, pos):
        h = int(m.group(1))
    return h


def strip_page_markers(t):
    t = re.sub(r"[ \t]*\[\[HAL:\d+\]\][ \t]*", "", t)
    return re.sub(r"\n{3,}", "\n\n", t).strip()


def split_explanation(text):
    for m in EXPLANATION_RE.finditer(text):
        if m.start() > len(text) * 0.3:
            return text[:m.start()], text[m.start():]
    return text, ""


def split_long_text(text, size=CHUNK_SIZE, overlap=CHUNK_OVERLAP):
    spans, start, n = [], 0, len(text)
    while start < n:
        end = min(start + size, n)
        if end < n:
            cut = max(text.rfind("\n", start, end), text.rfind(" ", start, end))
            if cut > start + size // 2:
                end = cut
        if text[start:end].strip():
            spans.append((start, end))
        if end >= n:
            break
        start = max(end - overlap, start + 1)
        sp = max(text.find(" ", start, end), -1)
        nl = text.find("\n", start, end)
        sp = min([x for x in (sp, nl) if x != -1], default=-1)
        if sp != -1 and sp < end - 1:
            start = sp + 1
    return spans


def segment_articles(text):
    articles = [(m.start(), m.group(1)) for m in ARTICLE_RE.finditer(text)]
    boundaries = sorted([m.start() for m in BOUNDARY_RE.finditer(text)] + [p[0] for p in articles] + [len(text)])
    chapters = [(m.start(), m.group(1)) for m in CHAPTER_RE.finditer(text)]
    out = []
    for start, number in articles:
        end = next(b for b in boundaries if b > start)
        chapter = [b for p, b in chapters if p < start]
        out.append(dict(number=number, start=start, end=end, chapter=chapter[-1] if chapter else None))
    return out


def chunk_legal(text, base_page, section_name, title):
    rows = []
    segments = segment_articles(text)
    if not segments:
        for j, (a, b) in enumerate(split_long_text(text), 1):
            rows.append(dict(article_number=None, text=strip_page_markers(text[a:b]),
                             page=page_at(text, a, base_page), page_end=page_at(text, b, base_page),
                             title=f"{title} (bagian {j})", meta=dict(section=section_name)))
        return rows
    for s in segments:
        content = TRAILING_PAGE_MARKS_RE.sub("", text[s["start"]:s["end"]])
        if section_name == "penjelasan" and len(strip_page_markers(content)) < 80 and "cukup jelas" in content.lower():
            continue
        spans = split_long_text(content)
        for j, (a, b) in enumerate(spans, 1):
            part = j if len(spans) > 1 else None
            rows.append(dict(
                article_number=s["number"], text=strip_page_markers(content[a:b]),
                page=page_at(text, s["start"] + a, base_page),
                page_end=page_at(text, s["start"] + b, base_page),
                title=f"{title} - Pasal {s['number']}" + (f" (bagian {part})" if part else ""),
                meta={"section": section_name, "bab": s["chapter"], "bagian": part}))
    return rows


def chunk_structured(text, base_page, doc_title):
    """Chunking per judul bagian untuk dokumen non-hukum (panduan, prosedur, layanan, checklist)."""
    rows = []
    state = dict(buffer=[], start=None, title=None, has_content=False)

    def display_title():
        return f"{doc_title} - {state['title']}" if state["title"] else doc_title

    def flush(end):
        if state["buffer"] and state["has_content"]:
            content = strip_page_markers("\n\n".join(state["buffer"]))
            if content:
                rows.append(dict(article_number=None, text=content,
                                 page=page_at(text, state["start"], base_page),
                                 page_end=page_at(text, end, base_page),
                                 title=display_title(), meta=dict(section=state["title"])))
        state["buffer"], state["start"], state["has_content"] = [], None, False

    for m in re.finditer(r"\S(?:.|\n)*?(?=\n[ \t]*\n|\Z)", text):
        b = m.group(0).strip()
        if not b or PAGE_MARK_RE.fullmatch(b):
            continue
        if len(b) < 90 and "\n" not in b and TITLE_RE.match(b):
            if state["has_content"]:
                flush(m.start())
            state["title"] = b.lstrip("# ").strip()
            if state["start"] is None:
                state["start"] = m.start()
            state["buffer"].append(b)
            continue
        if len(b) > CHUNK_SIZE:
            # Judul yang belum punya isi dipertahankan di awal potongan pertama (jangan hilang).
            pending_title = state["buffer"] and not state["has_content"]
            prefix = strip_page_markers("\n\n".join(state["buffer"])) if pending_title else ""
            flush(m.start())
            for j, (a, z) in enumerate(split_long_text(b)):
                chunk_text = strip_page_markers(b[a:z])
                if j == 0 and prefix:
                    chunk_text = prefix + "\n\n" + chunk_text
                rows.append(dict(article_number=None, text=chunk_text,
                                 page=page_at(text, m.start() + a, base_page),
                                 page_end=page_at(text, m.start() + z, base_page),
                                 title=display_title(), meta=dict(section=state["title"])))
            continue
        if state["has_content"] and sum(len(x) for x in state["buffer"]) + len(b) > CHUNK_SIZE:
            flush(m.start())
            if state["title"]:
                state["buffer"].append(state["title"])
            state["start"] = m.start()
        if state["start"] is None:
            state["start"] = m.start()
        state["buffer"].append(b)
        state["has_content"] = True
    flush(len(text))
    return rows


def build_chunks(entry, pages):
    """entry: dict dengan kunci entry_type, topic, title. pages: list (halaman|None, teks)."""
    pages = remove_headers_footers(pages)
    text = clean_text(join_pages(pages))
    base_page = 1 if PAGE_MARK_RE.search(text) else None
    doc_title = entry["title"]
    if entry["entry_type"] == "hukum":
        body, explanation = split_explanation(text)
        rows = chunk_legal(body, base_page, "batang", doc_title)
        if INDEX_EXPLANATIONS and explanation:
            rows += chunk_legal(explanation, page_at(text, len(body), base_page), "penjelasan",
                                doc_title + " - Penjelasan")
    else:
        rows = chunk_structured(text, base_page, doc_title)
    rows = [r for r in rows if r["text"].strip()]
    for i, r in enumerate(rows):
        r["chunk_index"] = i
        r["meta"]["topics"] = detect_chunk_topics(r["text"], entry["topic"])
        r["meta"]["judul"] = r["title"]
        r["meta"]["embed"] = "passage: {judul}\n{teks}"
    return rows
