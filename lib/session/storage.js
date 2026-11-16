export const SESSION_KEY = "svarati_session_token";
export const NOTICE_KEY = "svarati_session_notice_seen";
export const SESSION_TTL_DAYS = 30;

// Key yang TIDAK ikut dihapus saat sesi berakhir
const KEEP_KEYS = ["svarati-accessibility"];

// Hapus semua data lokal kecuali pengaturan aksesibilitas
export function clearSessionData() {
  try {
    Object.keys(localStorage).forEach((key) => {
      if (!KEEP_KEYS.includes(key)) localStorage.removeItem(key);
    });
  } catch (err) {
    console.warn("[session] gagal membersihkan localStorage:", err);
  }
}

// Mengembalikan { token, expiresAt } atau null kalau belum ada / sudah expired
export function getStoredSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const { token, expiresAt } = JSON.parse(raw);
    if (!token || !expiresAt) return null;

    // Sudah lewat 30 hari: bersihkan semua data lokal dan anggap tidak ada
    if (new Date(expiresAt) <= new Date()) {
      clearSessionData();
      return null;
    }
    return { token, expiresAt };
  } catch (err) {
    console.warn("[session] gagal membaca localStorage:", err);
    return null;
  }
}

// Mengembalikan true kalau berhasil, false kalau gagal
export function saveSession(token, expiresAt) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ token, expiresAt }));
    return true;
  } catch (err) {
    console.warn("[session] gagal menyimpan ke localStorage:", err);
    return false;
  }
}

// Hanya hapus token (dipakai kalau pembuatan sesi gagal di tengah jalan)
export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (err) {
    console.warn("[session] gagal menghapus localStorage:", err);
  }
}

// Hitung waktu expired: sekarang + 30 hari
export function calcExpiresAt() {
  return new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString();
}

// Penanda notifikasi sesi sudah ditampilkan.
// Ikut terhapus saat sesi berakhir, jadi notif muncul lagi di sesi berikutnya.
export function isNoticeSeen(expiresAt) {
  try {
    return localStorage.getItem(NOTICE_KEY) === expiresAt;
  } catch {
    return true; // kalau storage error, jangan tampilkan berulang
  }
}

export function markNoticeSeen(expiresAt) {
  try {
    localStorage.setItem(NOTICE_KEY, expiresAt);
  } catch {}
}