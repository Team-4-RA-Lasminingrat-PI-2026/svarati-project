// Pilihan persetujuan simpan chat. Disimpan di localStorage (bukan isi chat).
const KEY_CONSENT = "svarati_consent";

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