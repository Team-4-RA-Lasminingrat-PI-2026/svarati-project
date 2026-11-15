// Penyimpanan lokal: hanya pilihan persetujuan dan ID sesi acak, bukan isi chat.

const KEY_CONSENT = "svarati_consent";
// Satu-satunya tempat nama kunci sesi ditulis. Ganti di sini jika ingin mengubahnya.
const KEY_SESSION = "svarati_session";

export function readConsent() {
  try {
    const v = localStorage.getItem(KEY_CONSENT);
    return v === null ? null : v === "true";
  } catch {
    return null;
  }
}

export function saveConsent(value) {
  try {
    localStorage.setItem(KEY_CONSENT, String(value));
  } catch {
    // diabaikan: pilihan hanya berlaku untuk sesi ini
  }
}

// ID sesi dibuat sekali per browser. Mengembalikan null jika tidak bisa dibuat.
export function getSessionToken() {
  try {
    let token = localStorage.getItem(KEY_SESSION);
    if (!token) {
      token = crypto.randomUUID();
      localStorage.setItem(KEY_SESSION, token);
    }
    return token;
  } catch {
    return null;
  }
}