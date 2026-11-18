// Validasi format token sesi (hasil generateToken di token.js: 32 byte hex = 64 karakter).
// Backend punya salinannya di backend/src/svarati/storage.py (TOKEN_RE).
export const SESSION_TOKEN_RE = /^[0-9a-f]{64}$/;

export function isValidSessionToken(token) {
  return typeof token === "string" && SESSION_TOKEN_RE.test(token);
}