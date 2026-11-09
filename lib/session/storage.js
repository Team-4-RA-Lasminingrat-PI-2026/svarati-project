export const SESSION_KEY = "svarati_session_token";
export const SESSION_TTL_DAYS = 30;

// Mengembalikan { token, expiresAt } atau null kalau belum ada / sudah expired
export function getStoredSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const { token, expiresAt } = JSON.parse(raw);
    if (!token || !expiresAt) return null;

    // Sudah lewat 30 hari: hapus dan anggap tidak ada
    if (new Date(expiresAt) <= new Date()) {
      localStorage.removeItem(SESSION_KEY);
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