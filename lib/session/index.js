import { generateToken, sha256 } from "./token";
import {
  getStoredSession,
  saveSession,
  clearSession,
  calcExpiresAt,
} from "./storage";
import { createSessionRecord, touchSession } from "./api"; // sesuaikan kalau nama file api kamu beda

let pending = null; // cegah proses dobel (misal React Strict Mode)

export function ensureAnonymousSession() {
  if (!pending) {
    pending = run().finally(() => {
      pending = null;
    });
  }
  return pending;
}

async function run() {
  // 1. Sudah punya session? Pakai lagi, tidak generate ulang
  const stored = getStoredSession();
  if (stored) {
    const hash = await sha256(stored.token);
    const valid = await touchSession(hash);

    if (valid === true) return stored.token; // valid, last_active_at ter-update
    if (valid === null) return stored.token; // error jaringan, pertahankan token
    clearSession(); // valid === false: tidak ada di DB / expired
  }

  // 2. Belum punya / tidak valid: buat baru
  const token = generateToken();
  const hash = await sha256(token);
  const expiresAt = calcExpiresAt();

  // Simpan di browser dulu; kalau gagal, jangan buat row di DB
  if (!saveSession(token, expiresAt)) return null;

  const ok = await createSessionRecord(hash, expiresAt);
  if (!ok) {
    clearSession(); // supaya percobaan berikutnya mengulang dari awal
    return null;
  }
  return token;
}