// Fungsi murni untuk riwayat dan format tampilan. Tanpa React, tanpa network.

// Beberapa giliran terakhir (tanpa sapaan awal dan pesan galat) untuk konteks pertanyaan lanjutan.
export function getRecentHistory(messages) {
  return messages
    .filter((m) => m.id !== 0 && (m.from === "user" || m.mode))
    .slice(-6)
    .map((m) => ({ role: m.from, text: m.text.slice(0, 1500) }));
}

// Giliran (pesan pengguna + jawaban AI) yang belum ada di database.
// Jawaban galat (tanpa mode) tidak ikut.
export function getUnsavedTurns(messages) {
  const unsaved = [];
  for (let i = 1; i < messages.length - 1; i++) {
    const u = messages[i];
    const b = messages[i + 1];
    if (u.from === "user" && b.from === "bot" && b.mode && !b.serverId) {
      unsaved.push({
        botId: b.id,
        turn: { user: u.text, answer: b.text, mode: b.mode, chunks: (b.chunks ?? []).slice(0, 10) },
      });
    }
  }
  return unsaved;
}

export function formatDate(iso) {
  if (typeof iso !== "string") return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}