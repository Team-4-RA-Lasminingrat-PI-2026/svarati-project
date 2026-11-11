// Dipakai di browser: ambil satu halaman pesan dengan urutan live -> cache -> pesan awalan.
import { getStoredSession } from "@/lib/session/storage";
import { getFallbackPage } from "@/lib/tree-of-hope/fallbackMessages";
import { API_URL } from "@/lib/tree-of-hope/constants";

const cacheKey = (page) => `svarati_toh_page_${page}`;

function saveCache(page, { messages, total, totalPages }) {
  try {
    // Status "liked" dan hak edit milik pengguna tidak ikut disimpan.
    const safe = messages.map((m) => ({ ...m, liked: false, editableUntil: null }));
    localStorage.setItem(cacheKey(page), JSON.stringify({ messages: safe, total, totalPages }));
  } catch {}
}

function readCache(page) {
  try {
    const raw = localStorage.getItem(cacheKey(page));
    return raw ? { ...JSON.parse(raw), source: "cache" } : null;
  } catch {
    return null;
  }
}

export async function fetchMessagesPage(page) {
  const token = getStoredSession()?.token; // hanya membaca, tidak membuat sesi baru
  try {
    const res = await fetch(`${API_URL}?page=${page}`, {
      headers: token ? { "x-session-token": token } : {},
      cache: "no-store",
    });
    if (!res.ok) throw new Error("bad response");
    const json = await res.json();
    if (json.source === "live") {
      saveCache(page, json);
      return json;
    }
    return readCache(page) ?? json;
  } catch {
    return readCache(page) ?? getFallbackPage(page);
  }
}