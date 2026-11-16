"""Kata kunci topik (multi-label). Kode topik harus sama dengan tabel knowledge_topics."""
import re

TOPIC_KEYWORDS = {
    "keamanan_diri": ["ancaman", "mengancam", "membahayakan", "keselamatan", "perlindungan korban",
                      "rekaman", "foto", "video", "media sosial", "elektronik", "daring", "online",
                      "penguntitan", "stalking", "bukti digital"],
    "pelecehan_nonfisik": ["nonfisik", "non fisik", "komentar", "candaan", "siulan", "catcalling",
                           "ucapan bernuansa seksual", "isyarat", "menatap"],
    "pelecehan_fisik": ["pelecehan fisik", "menyentuh", "meraba", "mencium", "memeluk", "sentuhan"],
    "pemaksaan_hubungan": ["pemaksaan", "perkosaan", "persetubuhan", "pencabulan", "kontrasepsi",
                           "perbudakan seksual"],
    "hukum_tpks": ["uu tpks", "undang-undang tindak pidana kekerasan seksual", "dipidana",
                   "pidana penjara", "restitusi", "penyidik", "penuntut umum"],
    "hak_perempuan": ["hak korban", "hak atas", "pendampingan", "pemulihan", "keadilan", "kesetaraan"],
    "kesehatan_mental": ["trauma", "psikolog", "psikologis", "konseling", "stres", "depresi",
                         "kecemasan", "dukungan emosional", "healing"],
    "medis_visum": ["reproduksi", "kehamilan", "kontrasepsi", "kesehatan seksual", "visum",
                    "pemeriksaan medis"],
}


def detect_chunk_topics(text, entry_topic=None, max_topics=3):
    """Topik yang cocok untuk satu chunk (urut skor kata kunci, maksimal max_topics) + topik dokumennya."""
    t = text.lower()
    scores = {}
    for k, keywords in TOPIC_KEYWORDS.items():
        scores[k] = sum(len(re.findall(r"(?<![\w-])" + re.escape(w) + r"(?![\w-])", t)) for w in keywords)
    topics = [k for k, v in sorted(scores.items(), key=lambda kv: -kv[1]) if v > 0][:max_topics]
    if entry_topic and entry_topic not in topics:
        topics.append(entry_topic)
    return topics
