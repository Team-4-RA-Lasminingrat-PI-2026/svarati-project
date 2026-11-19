import { ensureAnonymousSession } from "@/lib/session";
import { clearSession } from "@/lib/session/storage";

// ensureAnonymousSession mengembalikan { token, wasReset }; bentuk lama berupa string juga didukung.
const toToken = (raw) => (typeof raw === "string" ? raw : raw?.token ?? null);

// fetch dengan sesi anonim. Kalau server menjawab 401 (sesi tidak dikenal),
// token lokal dibuang, dibuat ulang, lalu dicoba sekali lagi.
// Mengembalikan null kalau sesi tidak bisa dibuat sama sekali.
export async function authFetch(url, options = {}) {
  let res = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    const token = toToken(await ensureAnonymousSession());
    if (!token) return null;
    res = await fetch(url, {
      ...options,
      headers: { ...options.headers, "x-session-token": token },
    });
    if (res.status !== 401) return res;
    clearSession(); // hanya token; tidak menyentuh data lokal lain
  }
  return res;
}