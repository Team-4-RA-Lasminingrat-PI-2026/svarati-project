"""Membaca DOCX (termasuk hasil ekspor Google Docs) menjadi dua keluaran dari satu kali baca:

  markdown : untuk ditampilkan (judul, daftar, tebal, miring, tautan, tabel)
  text     : untuk chunk RAG (struktur tetap, tanpa penanda tebal/miring/tautan)

Membutuhkan python-docx. Gambar, catatan kaki, header/footer, dan kotak teks tidak dibaca.
"""
import io
import re


# ----------------------------------------------------------------- inline
def _escape(t):
    return re.sub(r"([\\`*_\[\]<>])", r"\\\1", t)


def _escape_line_start(s):
    """Cegah paragraf biasa terbaca sebagai judul/daftar/kutipan karena karakter pertamanya."""
    s = re.sub(r"^(\s*)(\d+)([.)])(\s)", r"\1\2\\\3\4", s)
    return re.sub(r"^(\s*)([-+#>])", r"\1\\\2", s)


def _markdown_segment(text, bold, italic, url):
    lead = text[: len(text) - len(text.lstrip())]
    trail = text[len(text.rstrip()):]
    core = text.strip()
    if not core:
        return text
    core = _escape(core)
    if bold and italic:
        core = f"***{core}***"
    elif bold:
        core = f"**{core}**"
    elif italic:
        core = f"*{core}*"
    if url and re.match(r"(?i)(https?://|mailto:)", url):
        core = f"[{core}]({url})"
    return lead + core + trail


def _inline_markdown(segments):
    return "".join(_markdown_segment(*s) for s in segments).replace("\n", "  \n").strip()


def _inline_text(segments):
    return "".join(s[0] for s in segments).strip()


def _strip_formatting(segments):
    return [(s[0], False, False, None) for s in segments]


# ----------------------------------------------------------------- pembacaan dokumen
def read_docx(data: bytes, title=None) -> dict:
    from docx import Document
    from docx.oxml.ns import qn
    from docx.table import Table
    from docx.text.paragraph import Paragraph

    doc = Document(io.BytesIO(data))
    blocks = []
    for el in doc.element.body.iterchildren():
        if el.tag == qn("w:p"):
            b = _parse_paragraph(doc, Paragraph(el, doc))
        elif el.tag == qn("w:tbl"):
            b = _parse_table(Table(el, doc))
        else:
            b = None
        if b:
            blocks.append(b)
    text = _render(blocks, markdown=False)
    # Markdown untuk halaman: judul artikel dibuang (sudah tampil di header). Chunk tetap memakai blok lengkap.
    return {"markdown": _render(_drop_title(blocks, title), markdown=True), "text": text,
            "word_count": len(re.findall(r"\w+", text))}


def _extract_segments(doc, par):
    from docx.oxml.ns import qn
    from docx.text.run import Run

    segments = []
    recursive_tags = {qn("w:ins"), qn("w:smartTag"), qn("w:sdt"), qn("w:sdtContent"), qn("w:fldSimple")}

    def add_text(text, bold, italic, url):
        if not text:
            return
        if segments and segments[-1][1:] == (bold, italic, url):
            segments[-1] = (segments[-1][0] + text, bold, italic, url)
        else:
            segments.append((text, bold, italic, url))

    def walk(el, url=None):
        for ch in el.iterchildren():
            if ch.tag == qn("w:r"):
                run = Run(ch, par)
                add_text(run.text, _is_bold(run), _is_italic(run), url)
            elif ch.tag == qn("w:hyperlink"):
                rid = ch.get(qn("r:id"))
                u = None
                if rid and rid in doc.part.rels and doc.part.rels[rid].is_external:
                    u = doc.part.rels[rid].target_ref
                walk(ch, u or url)
            elif ch.tag in recursive_tags:
                walk(ch, url)

    walk(par._p)
    return segments


def _style_name(obj):
    try:
        return (obj.style.name or "").lower()
    except Exception:
        return ""


def _is_bold(run):
    return bool(run.bold) or (run.bold is None and _style_name(run) == "strong")


def _is_italic(run):
    return bool(run.italic) or (run.italic is None and _style_name(run) == "emphasis")


def _drop_title(blocks, title=None):
    """Buang judul artikel dari daftar blok (hanya untuk Markdown halaman).

    Judul dicari sebagai heading yang teksnya sama dengan judul entri. Jika tidak ada, dibuang heading
    level 1 (gaya Title / Heading 1) yang berada di tiga blok pertama.
    """
    def norm(t):
        return " ".join(t.split()).lower()

    if title:
        for i, b in enumerate(blocks):
            if b["t"] == "h" and norm(_inline_text(b["segments"])) == norm(title):
                return blocks[:i] + blocks[i + 1:]
    for i, b in enumerate(blocks[:3]):
        if b["t"] == "h" and b["level"] == 1:
            return blocks[:i] + blocks[i + 1:]
    return blocks


def _heading_level(par, style_name):
    m = re.match(r"heading\s*(\d)", style_name)
    if m:
        return max(1, min(int(m.group(1)), 6))
    if style_name == "title":
        return 1
    values = par._p.xpath("./w:pPr/w:outlineLvl/@w:val")
    if values and str(values[0]).isdigit() and int(values[0]) < 9:
        return min(int(values[0]) + 1, 6)
    return 0


def _is_ordered(doc, num_id, ilvl):
    try:
        numbering = doc.part.numbering_part.element
        num = numbering.xpath(f'w:num[@w:numId="{num_id}"]')
        if not num:
            return False
        abs_id = num[0].xpath("w:abstractNumId/@w:val")[0]
        fmt = numbering.xpath(
            f'w:abstractNum[@w:abstractNumId="{abs_id}"]/w:lvl[@w:ilvl="{ilvl}"]/w:numFmt/@w:val')
        return bool(fmt) and str(fmt[0]) not in ("bullet", "none")
    except Exception:
        return False


def _list_info(doc, par, style_name):
    """Kembalikan (berurut, level) jika paragraf butir daftar, selain itu None."""
    pPr = par._p.pPr
    numPr = pPr.numPr if pPr is not None else None
    num_id = ilvl = None
    if numPr is not None:
        num_id = numPr.numId.val if numPr.numId is not None else None
        ilvl = numPr.ilvl.val if numPr.ilvl is not None else None
    if num_id is None:  # penomoran yang terikat pada gaya (mis. 'List Bullet')
        style = par.style
        for _ in range(6):
            if style is None:
                break
            sp = style.element.pPr
            if sp is not None and sp.numPr is not None and sp.numPr.numId is not None:
                num_id = sp.numPr.numId.val
                if ilvl is None:
                    ilvl = sp.numPr.ilvl.val if sp.numPr.ilvl is not None else 0
                break
            style = style.base_style
    m = re.match(r"list\s+(?:bullet|number)\s*(\d)?", style_name)
    style_level = (int(m.group(1)) - 1) if (m and m.group(1)) else 0   # 'List Bullet 2' = tingkat kedua
    if num_id is not None:
        if num_id == 0:
            return None
        lv = max(ilvl or 0, style_level)
        return (_is_ordered(doc, num_id, ilvl or 0), lv)
    if m:
        return ("number" in style_name, style_level)
    return None


def _parse_paragraph(doc, par):
    segments = _extract_segments(doc, par)
    if not "".join(s[0] for s in segments).strip():
        return None
    style_name = _style_name(par)
    level = _heading_level(par, style_name)
    if level:
        return {"t": "h", "level": level, "segments": _strip_formatting(segments)}
    list_info = _list_info(doc, par, style_name)
    if list_info:
        return {"t": "li", "ordered": list_info[0], "level": list_info[1], "segments": segments}
    return {"t": "p", "segments": segments}


def _parse_table(tbl):
    rows = []
    for row in tbl.rows:
        cells_text, seen_cells = [], []
        for cell in row.cells:
            if any(cell._tc is t for t in seen_cells):  # sel gabungan muncul berulang
                continue
            seen_cells.append(cell._tc)
            cells_text.append(" ".join(p.text.strip() for p in cell.paragraphs if p.text.strip()))
        rows.append(cells_text)
    rows = [r for r in rows if any(r)]
    return {"t": "table", "rows": rows} if rows else None


# ----------------------------------------------------------------- penyusunan keluaran
def _table_markdown(rows):
    width = max(len(r) for r in rows)
    clean_rows = [[_escape(c).replace("|", "\\|") for c in r] + [""] * (width - len(r)) for r in rows]
    out = ["| " + " | ".join(clean_rows[0]) + " |", "| " + " | ".join(["---"] * width) + " |"]
    out += ["| " + " | ".join(r) + " |" for r in clean_rows[1:]]
    return "\n".join(out)


def _render(blocks, markdown):
    pieces, counters = [], {}
    previous_type = None
    top_list_kind = None   # jenis daftar tingkat 0 yang sedang berjalan (berurut atau tidak)
    for b in blocks:
        if b["t"] != "li":
            counters = {}
        if b["t"] == "h":
            text = _inline_text(b["segments"])
            # Markdown: subjudul mulai dari ## (Heading 1 non-judul juga menjadi ##)
            lv = min(max(b["level"], 2), 6) if markdown else b["level"]
            s = ("#" * lv) + " " + (_escape(text) if markdown else text)
        elif b["t"] == "p":
            s = _escape_line_start(_inline_markdown(b["segments"])) if markdown else _inline_text(b["segments"])
        elif b["t"] == "li":
            lv = b["level"]
            if lv == 0 and previous_type == "li" and b["ordered"] != top_list_kind:
                counters = {}   # daftar baru berganti jenis: penomoran mulai dari awal
            counters = {k: v for k, v in counters.items() if k <= lv}
            counters[lv] = counters.get(lv, 0) + 1
            if markdown:
                marker = "1. " if b["ordered"] else "- "
                s = "    " * lv + marker + _inline_markdown(b["segments"])
            else:
                marker = f"{counters[lv]}. " if b["ordered"] else "- "
                s = "  " * lv + marker + _inline_text(b["segments"])
        else:  # tabel
            if markdown:
                s = _table_markdown(b["rows"])
            else:
                s = "\n".join(" | ".join(r) for r in b["rows"])
        separator = "\n\n"
        if b["t"] == "li" and previous_type == "li":
            # satu daftar berlanjut; daftar tingkat 0 yang berganti jenis dipisah baris kosong
            separator = "\n\n" if (b["level"] == 0 and b["ordered"] != top_list_kind) else "\n"
        if b["t"] == "li" and b["level"] == 0:
            top_list_kind = b["ordered"]
        if b["t"] != "li":
            top_list_kind = None
        pieces.append((separator, s))
        previous_type = b["t"]
    output = ""
    for i, (separator, s) in enumerate(pieces):
        output += (separator if i else "") + s
    return output.strip() + ("\n" if output.strip() else "")
