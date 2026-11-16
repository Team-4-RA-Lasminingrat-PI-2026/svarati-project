"""Teks yang tampil ke pengguna atau dikirim ke LLM, dipusatkan di satu tempat.

Ubah kalimat di sini saja; logika tetap di modul masing-masing.
Bagian bertanda KONTRAK dibaca frontend atau tersimpan di database: jangan diubah sembarangan.
"""

# ---------------------------------------------------------------- mode jawaban (KONTRAK)
# Disimpan di ai_messages.response_mode dan dibaca frontend (useSvaratiChat, FeedbackBar).
MODE_RAG = "rag"
MODE_EMERGENCY = "darurat"
MODE_NO_SOURCE = "tanpa_sumber"
MODE_VERIFICATION_FAILED = "gagal_verifikasi"
MODE_GREETING = "sapaan"
MODE_LLM_ERROR = "error_llm"
MODE_LLM_EMPTY = "llm_kosong"

# ---------------------------------------------------------------- balasan chat
GREETING_REPLY = (
    "Hai, aku di sini. Kamu boleh menceritakan apa yang sedang kamu alami, "
    "atau menanyakan hal yang ingin kamu ketahui. Pelan-pelan saja, tidak perlu terburu-buru."
)
NO_SOURCE_REPLY = (
    "Maaf, aku belum menemukan informasi yang cukup tepat di sumber yang kami miliki untuk "
    "pertanyaanmu. Kamu bisa menceritakan lebih rinci, atau hubungi layanan pendampingan "
    "terverifikasi."
)
ANSWER_FAILED_REPLY = (
    "Maaf, aku belum bisa menyusun jawaban untuk pertanyaan ini. Coba tuliskan dengan kata-kata lain, "
    "atau hubungi layanan pendampingan terverifikasi."
)
LLM_ERROR_REPLY = "Maaf, layanan Svarati AI sedang bermasalah. Coba lagi nanti ya."

# ---------------------------------------------------------------- pesan darurat
EMERGENCY_INTRO = (
    "Aku khawatir dengan keselamatanmu sekarang, dan aku di sini bersamamu. "
    "Kalau kamu dalam bahaya langsung, hubungi kontak di bawah secepatnya. "
    "Jika memungkinkan, menjauhlah ke tempat yang lebih aman atau dekati orang yang kamu percaya."
)
EMERGENCY_CONTACTS_TITLE = "Kontak bantuan:"
EMERGENCY_OUTRO = "Kamu tidak sendirian, dan ini bukan salahmu."
# Dipakai jika tabel service_providers kosong atau tidak bisa dibaca.
FALLBACK_EMERGENCY_CONTACTS = ["112 (Pusat Darurat)", "129 (SAPA KemenPPPA)"]

# ---------------------------------------------------------------- pesan error API (detail HTTP)
ERR_UNAUTHORIZED = "Tidak diizinkan."
ERR_EMPTY_QUESTION = "Pertanyaan tidak boleh kosong"
ERR_INVALID_SESSION = "ID sesi tidak valid."
ERR_SERVICE_FAILED = "Terjadi kendala pada layanan. Coba lagi nanti yaa."
ERR_DB_UNREACHABLE = "Database tidak dapat dihubungi."
ERR_SESSION_REFRESH_FAILED = "Gagal memperbarui sesi."
ERR_SESSION_DELETE_FAILED = "Gagal menghapus sesi."
ERR_HISTORY_LOAD_FAILED = "Gagal memuat riwayat."
ERR_HISTORY_SAVE_FAILED = "Gagal menyimpan riwayat."
ERR_STORAGE_DISABLED = "Penyimpanan percakapan sedang dinonaktifkan."
ERR_MESSAGE_OR_SESSION_NOT_FOUND = "Pesan atau sesi tidak ditemukan."
ERR_FEEDBACK_SAVE_FAILED = "Gagal menyimpan umpan balik."
ERR_FEEDBACK_DELETE_FAILED = "Gagal menghapus umpan balik."
ERR_UNKNOWN_REASON = "Alasan tidak dikenal."
ERR_REASON_SAVE_FAILED = "Gagal menyimpan alasan."
ERR_ANSWERS_TOO_LARGE = "answers terlalu besar"

# ---------------------------------------------------------------- label Cek Kondisi untuk query RAG
QUERY_PREFIX = "Pertanyaan"
# Pertanyaan asesmen yang jawabannya menjadi fakta kondisi, kunci = q_code.
QUERY_LABELS = {"q2": "Lokasi", "q3": "Pihak terlibat", "q4": "Kejadian", "q6": "Bukti"}
# Pertanyaan asesmen yang jawabannya menjadi gambaran emosi.
EMOTION_LABELS = {"q1": "Kondisi saat ini", "q5": "Reaksi saat kejadian"}

# ---------------------------------------------------------------- prompt Gemini
SYSTEM_PROMPT = """Kamu adalah Svarati, pendamping informasi untuk perempuan yang mengalami atau khawatir tentang kekerasan seksual.
Prinsip:
1. Empatik, tenang, dan tidak menghakimi. Tanggapi isi pesan pengguna secara wajar dan singkat; jangan mengulang kalimat validasi yang sama di setiap jawaban.
2. Jawab HANYA berdasarkan bagian SUMBER. Jika sumber tidak cukup, katakan terus terang dan jangan menebak.
3. Sebut Pasal hanya jika tertulis di SUMBER. Jangan mengarang pasal, nomor telepon, alamat, atau nama lembaga.
4. Untuk rujukan layanan, hanya gunakan yang ada di LAYANAN TERVERIFIKASI beserta kontaknya.
5. Bahasa Indonesia yang sederhana, ringkas, dengan langkah konkret yang bisa dilakukan.
6. Jangan memberi diagnosis medis/psikologis dan jangan menjanjikan hasil hukum. Ini informasi, bukan nasihat hukum.
7. Jika ada tanda bahaya langsung, dahulukan keselamatan dan arahkan ke kontak darurat.
8. Tulis jawaban sebagai teks biasa tanpa Markdown: jangan pakai tanda ** atau *, tanda #, atau tanda bintang di awal baris. Untuk daftar, gunakan nomor (1., 2., 3.) di awal baris.
9. Jangan membuka jawaban dengan salam atau perkenalan ("Halo", "Hai", "Saya Svarati"). Langsung ke isi. Salam sudah ditampilkan di awal chat.
10. Gunakan "aku" dan "kamu".
11. KONDISI PENGGUNA hanya latar belakang. Pakai hanya jika relevan dengan pesan terakhir; jangan menyebut kejadiannya kembali kalau pengguna tidak membicarakannya, dan jangan menyatakan perasaanmu tentang kondisinya ("saya lega...").
12. Jika pesan pengguna bukan pertanyaan tentang kekerasan atau layanan (misalnya keluhan ringan seperti ngantuk atau lelah), tanggapi singkat dan hangat tanpa mencantumkan pasal atau daftar kontak. Tawarkan bantuan dengan satu kalimat.
13. Cocokkan pasal dengan situasi pengguna: pilih huruf/ayat yang sesuai kasusnya. Jika SUMBER memuat ayat tentang delik aduan atau pelaporan, sebutkan.
14. Nomor telepon hanya dari LAYANAN TERVERIFIKASI atau SUMBER. Jangan menambah nomor WhatsApp atau nomor lain dari ingatanmu.
15. RIWAYAT PERCAKAPAN hanya untuk memahami pertanyaan lanjutan. Jangan jadikan riwayat sebagai sumber pasal, nomor, atau fakta; fakta tetap hanya dari SUMBER."""

# Kerangka isi prompt. Placeholder: {sources} {providers} {conditions} {history} {message}
PROMPT_TEMPLATE = (
    "SUMBER:\n{sources}\n\nLAYANAN TERVERIFIKASI:\n{providers}\n\nKONDISI PENGGUNA:\n{conditions}\n\n"
    "RIWAYAT PERCAKAPAN (konteks saja, bukan sumber fakta):\n{history}\n\n"
    "PERTANYAAN PENGGUNA:\n{message}"
)
PROMPT_NONE = "(tidak ada)"
PROMPT_NO_PROVIDERS = "(tidak ada data layanan terverifikasi)"
PROMPT_ROLE_USER = "PENGGUNA"
PROMPT_ROLE_BOT = "SVARATI"

# Instruksi percobaan ulang saat jawaban memuat pasal/nomor yang tidak ada di sumber.
CORRECTION_ARTICLES = "Pasal berikut TIDAK ada di SUMBER: {items}."
CORRECTION_PHONES = "Nomor berikut TIDAK ada di SUMBER maupun LAYANAN TERVERIFIKASI: {items}."
CORRECTION_TEMPLATE = (
    "\n\nKOREKSI: Jawaban sebelumnya memuat informasi yang tidak ada di sumber. {details}"
    " Tulis ulang jawaban tanpa menyebutkannya. Hanya gunakan Pasal dan nomor "
    "yang tertulis di SUMBER atau LAYANAN TERVERIFIKASI."
)
# Pengganti rujukan pasal yang dibuang karena tidak ada di sumber.
UNSOURCED_ARTICLE_REPLACEMENT = "ketentuan terkait"
