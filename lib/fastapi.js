// Helper server-side untuk memanggil backend FastAPI. Hanya dipakai oleh route handler Next.js.
const BASE_URL = process.env.FASTAPI_BASE_URL || "http://127.0.0.1:8000";
const API_KEY = process.env.BACKEND_API_KEY || "";

export async function callFastApi(path, { method = "GET", body, timeoutMs = 60000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(API_KEY ? { "x-api-key": API_KEY } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
      signal: controller.signal,
    });
    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }
    return { ok: response.ok, status: response.status, data };
  } finally {
    clearTimeout(timer);
  }
}

// FastAPI mengirim { detail: "teks" } untuk error biasa, atau daftar untuk error validasi (422).
export function getErrorMessage(data, fallback) {
  return typeof data?.detail === "string" ? data.detail : fallback;
}
