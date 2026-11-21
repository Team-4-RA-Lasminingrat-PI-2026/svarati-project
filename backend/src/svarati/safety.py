"""Deteksi tanda bahaya langsung pada teks pengguna (berbasis pola, bukan pengganti penilaian manusia)."""
import re


def normalize_text(text):
    """Huruf kecil, simbol jadi spasi, spasi berlebih dirapatkan."""
    text = re.sub(r"[^a-z0-9 ]", " ", (text or "").lower())
    return re.sub(r"\s+", " ", text).strip()


_NEGATION = r"(?:tidak|nggak|gak|ga|enggak|ngga)"
_WANT = r"(?:ingin|mau|pengen|pingin|pengin)"

# Objek kiasan: "lagi dikejar deadline", "disiksa tugas". Frasa seperti itu bukan tanda bahaya.
_FIGURATIVE = (r"(?:deadline|dl|tugas|target|tren|trend|jadwal|kerjaan|pekerjaan|ujian|skripsi|revisi|waktu|"
               r"setoran|cicilan|utang|tagihan|ngantuk|kantuk|lapar|rindu|pikiran|mimpi|kenangan)")
_FIGURATIVE_AHEAD = rf"(?!(?: (?:sama|oleh|dengan|dgn))? {_FIGURATIVE}\b)"

EMERGENCY_PATTERNS = [re.compile(p) for p in [
    r"\b(?:mau|akan|bakal|ingin|pengen|pingin|pengin|hendak) (?:dibunuh|membunuh|bunuh (?:aku|saya|gue|gw))",
    r"\bdiancam (?:akan |mau )?(?:dibunuh|dibacok|ditusuk|ditembak|dihabisi)",
    rf"\b(?:sedang|lagi|sekarang|masih) (?:dipukul|dipukuli|dicekik|disiksa|diperkosa|dikejar|diikuti|disekap|dianiaya)\b{_FIGURATIVE_AHEAD}",
    r"\b(?:disekap|dikurung)\b",
    r"\b(?:ada|datang|menunggu|nunggu) ?di ?(?:depan|luar) (?:rumah|kamar|kos|kosan|kontrakan)\b"
    r"(?!.*\b(?:paket|kurir|ojol|ojek|driver|gofood|grabfood|shopee|tukang|tamu)\b)",
    r"\b(?:bawa|membawa) (?:pisau|senjata|golok|parang|celurit)",
    r"\b(?:bunuh diri|mengakhiri hidup|akhiri hidup|menyakiti diri|melukai diri|self harm|selfharm)",
    rf"(?<!lampu )(?<!listrik )(?<!mesin )(?<!hp )(?<!hp ku )(?<!hpku )(?<!hpnya )(?<!laptop )(?<!baterai )(?<!batre )(?<!lampunya )(?<!listriknya )\b{_WANT} mati\b",
    rf"\b{_WANT} menghilang\b",
    rf"\b{_WANT} menghilangkan (?:nyawa|diri)",
    rf"\b{_WANT} (?:hilang|ngilang|lenyap|musnah)\b(?! (?:ingatan|rasa|stres|stress|capek|lelah|pusing|jerawat|noda|bau|nafsu|sakit|pegal))",
    rf"\b{_WANT} (?:pergi|tidur) selamanya",
    r"\b(?:tidur|pergi) selamanya\b",
    rf"\b{_WANT} {_NEGATION} (?:ada|bangun|hidup)",
    r"\b(?:hilang|lenyap|menghilang|ngilang) (?:dari|di) (?:dunia|muka bumi)",
    r"\b(?:lebih baik|mending) (?:aku |saya )?mati",
    rf"\b{_NEGATION} (?:ingin|mau|kuat|sanggup) (?:lagi )?hidup",
    r"\b(?:capek|cape|lelah) hidup",
    # Bahasa Inggris (normalize_text mengubah "don't" menjadi "don t")
    r"\b(?:want|wanna|going|gonna|plan|planning|need|ready|about) (?:to )?(?:die|disappear|vanish|kill myself|end it|end my life|hurt myself|be gone|not be here)\b",
    r"\b(?:disappear|vanish|go away|be gone|fade away) (?:forever|permanently|for good)\b",
    r"\bkill myself\b|\bhurt myself\b|\bend my life\b|\bsuicid\w*\b|\bself ?harm\w*\b",
    r"\b(?:don t|do not|dont) (?:want|wanna) (?:to )?live\b",
    r"\bno reason to live\b|\bcan t go on\b|\bcannot go on\b",
    r"\bwish (?:i |i was |i were )?(?:dead|gone|not here|never born)\b",
    r"\b(?:don t|do not|dont) want to exist\b",
]]


def detect_emergency(text) -> bool:
    """True jika teks memuat pola bahaya langsung (ancaman, kekerasan berlangsung, niat mengakhiri hidup)."""
    normalized = normalize_text(text)
    return any(p.search(normalized) for p in EMERGENCY_PATTERNS)