// Semua pemanggilan ke route Next.js /api/* (yang meneruskan ke FastAPI).
import { bacaAsesmen } from "@/lib/self-assessment/storage";
import { getSessionToken } from "./storage";

const JSON_HEADERS = { "Content-Type": "application/json" };

// Jawaban cek kondisi dari localStorage. Kosong jika belum diisi (opsional).
function getAssessmentAnswers(questions) {
  if (!questions) return {};
  return bacaAsesmen(questions)?.answers ?? {};
}

// Perpanjang masa simpan sesi dan ambil tanggal kedaluwarsanya.
export async function syncSession() {
  const token = getSessionToken();
  if (!token) return null;
  try {
    const res = await fetch("/api/session", {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({ session_token: token }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data?.berlaku_sampai === "string" ? data.berlaku_sampai : null;
  } catch {
    return null;
  }
}

// Ambil riwayat percakapan tersimpan. Hanya dipanggil jika pengguna setuju.
export async function loadHistory() {
  const token = getSessionToken();
  if (!token) return [];
  try {
    const res = await fetch("/api/session/messages", {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({ session_token: token }),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.messages)
      ? data.messages.map((m) => ({
          id: `h${m.id}`,
          from: m.from,
          text: m.text,
          mode: m.mode ?? null,
          serverId: m.from === "bot" ? m.id : null,
          feedback: m.helpful ?? null,
          references: Array.isArray(m.rujukan) ? m.rujukan : [],
        }))
      : [];
  } catch {
    return [];
  }
}

// Kirim satu pesan. Percakapan hanya disimpan jika pengguna setuju DAN ID sesi tersedia.
// isFirstTurn: giliran pertama. history: beberapa giliran terakhir untuk pertanyaan lanjutan.
export async function sendMessage(message, consented, questions, isFirstTurn, history) {
  const token = consented ? getSessionToken() : null;
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({
      message,
      answers: getAssessmentAnswers(questions),
      consent: token !== null,
      session_token: token,
      pertama: isFirstTurn, // nama field mengikuti backend
      history,
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return {
    answer: data.answer,
    mode: data.mode ?? null,
    references: Array.isArray(data.rujukan) ? data.rujukan : [],
    chunks: Array.isArray(data.chunks) ? data.chunks : [],
    serverId: data.message_id ?? null,
    expiresAt: data.berlaku_sampai ?? null,
  };
}

// Simpan giliran yang tertunda sekaligus. Mengembalikan { message_ids, berlaku_sampai } atau null.
export async function importHistory(turns) {
  const token = getSessionToken();
  if (!token) return null;
  try {
    const res = await fetch("/api/session/import", {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({ session_token: token, turns }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data?.message_ids) && data.message_ids.length === turns.length ? data : null;
  } catch {
    return null;
  }
}

export async function sendFeedback(messageId, isHelpful) {
  const token = getSessionToken();
  if (!token) return false;
  try {
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({ messageId, isHelpful, sessionToken: token }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Kirim alasan penilaian. Backend hanya menyimpannya jika pengguna setuju menyimpan chat.
export async function sendReason(messageId, code, text) {
  const token = getSessionToken();
  if (!token) return false;
  try {
    const res = await fetch("/api/feedback/alasan", {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({ messageId, sessionToken: token, reasonCode: code, reasonText: text }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Batalkan penilaian (klik tombol yang sudah aktif)
export async function deleteFeedback(messageId) {
  const token = getSessionToken();
  if (!token) return false;
  try {
    const res = await fetch("/api/feedback", {
      method: "DELETE",
      headers: JSON_HEADERS,
      body: JSON.stringify({ messageId, sessionToken: token }),
    });
    return res.ok;
  } catch {
    return false;
  }
}