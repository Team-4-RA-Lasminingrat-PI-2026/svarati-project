"""Deteksi tanda bahaya langsung pada teks pengguna (berbasis pola, bukan pengganti penilaian manusia)."""
import re


def normalize_text(text):
    """Huruf kecil, simbol jadi spasi, spasi berlebih dirapatkan."""
    text = re.sub(r"[^a-z0-9 ]", " ", (text or "").lower())
    return re.sub(r"\s+", " ", text).strip()


_NEGATION = r"(?:tidak|nggak|gak|ga|enggak|ngga)"
_WANT = r"(?:ingin|mau|pengen|pingin|pengin)"

EMERGENCY_PATTERNS = [re.compile(p) for p in [
    r"\b(?:mau|akan|bakal|ingin|pengen|pingin|pengin|hendak) (?:dibunuh|membunuh|bunuh (?:aku|saya|gue|gw))",
    r"\bdiancam (?:akan |mau )?(?:dibunuh|dibacok|ditusuk|ditembak|dihabisi)",
    r"\b(?:sedang|lagi|sekarang|masih) (?:dipukul|dipukuli|dicekik|disiksa|diperkosa|dikejar|diikuti|disekap|dianiaya)",
    r"\b(?:disekap|dikurung)\b",
    r"\b(?:ada|datang|menunggu|nunggu) ?di ?(?:depan|luar) (?:rumah|kamar|kos|kosan|kontrakan)",
    r"\b(?:bawa|membawa) (?:pisau|senjata|golok|parang|celurit)",
    r"\b(?:bunuh diri|mengakhiri hidup|akhiri hidup|menyakiti diri|melukai diri|self harm|selfharm)",
    rf"\b{_WANT} (?:mati|menghilang)",
    r"\b(?:lebih baik|mending) (?:aku |saya )?mati",
    rf"\b{_NEGATION} (?:ingin|mau|kuat|sanggup) (?:lagi )?hidup",
    r"\b(?:capek|cape|lelah) hidup",
]]


def detect_emergency(text) -> bool:
    """True jika teks memuat pola bahaya langsung (ancaman, kekerasan berlangsung, niat mengakhiri hidup)."""
    normalized = normalize_text(text)
    return any(p.search(normalized) for p in EMERGENCY_PATTERNS)
