import { generateToken, sha256 } from "./token";
import {
  getStoredSession,
  saveSession,
  clearSession,
  clearSessionData,
  calcExpiresAt,
} from "./storage";
import { createSessionRecord, touchSession } from "./api";

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
  let wasReset = false;

  // 1. Sudah punya session? Pakai lagi, tidak generate ulang
  const stored = getStoredSession();
  if (stored) {
    const hash = await sha256(stored.token);
    const valid = await touchSession(hash);

    if (valid === true) return { token: stored.token, wasReset: false };
    if (valid === null) return { token: stored.token, wasReset: false };

    clearSessionData(); // valid === false: tidak ada di DB / expired
    wasReset = true;
  }

  // 2. Belum punya / tidak valid: buat baru
  const token = generateToken();
  const hash = await sha256(token);
  const expiresAt = calcExpiresAt();

  if (!saveSession(token, expiresAt)) return { token: null, wasReset };

  const ok = await createSessionRecord(hash, expiresAt);
  if (!ok) {
    clearSession();
    return { token: null, wasReset };
  }
  return { token, wasReset };
}