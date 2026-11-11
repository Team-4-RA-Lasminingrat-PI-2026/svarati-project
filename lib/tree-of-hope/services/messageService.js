import "server-only";
import * as repo from "@/lib/tree-of-hope/repositories/messageRepository";
import { PAGE_SIZE, EDIT_WINDOW_MINUTES } from "@/lib/tree-of-hope/constants";
import { treeOfHopeContent } from "@/content/labels";
import { shortPlace } from "@/lib/tree-of-hope/place";

const editWindowMs = EDIT_WINDOW_MINUTES * 60 * 1000;

// Bentuk database -> bentuk yang dipakai UI.
// author_session_id tidak pernah dikirim ke browser, hanya editableUntil.
function toMessage(row, liked = false, supportCount, sessionId = null) {
  const isMine = sessionId != null && Number(row.author_session_id) === Number(sessionId);
  const until = new Date(row.created_at).getTime() + editWindowMs;
  return {
    id: row.reinforcement_id,
    text: row.content_messages,
    role: row.user_role ?? "",
    location: row.user_location ?? "",
    author: [row.user_role || treeOfHopeContent.anonymous, shortPlace(row.user_location)]
  .filter(Boolean)
  .join(" • "),
    supportCount: supportCount ?? row.reinforcement_reactions?.[0]?.count ?? 0,
    liked,
    editableUntil: isMine && until > Date.now() ? new Date(until).toISOString() : null,
  };
}

  async function assertValidLocation(location) {
  if (!location) return;
  const [city, prov] = await Promise.all([
    repo.findActiveCityByName(location),
    repo.findProvinceByName(location),
  ]);
  if (city.error) throw city.error;
  if (prov.error) throw prov.error;
  if (!city.data?.length && !prov.data?.length) {
    throw Object.assign(new Error("Pilih asal daerah dari daftar yang tersedia."), {
      code: "BAD_LOCATION",
    });
  }
}

export async function getMessages(page, sessionId) {
  const from = (page - 1) * PAGE_SIZE;
  const { data, count, error } = await repo.findMessages({ from, to: from + PAGE_SIZE - 1 });
  if (error) throw error;

  let liked = new Set();
  if (sessionId && data.length) {
    const res = await repo.findLikedIds(sessionId, data.map((m) => m.reinforcement_id));
    // Gagal mengambil status "suka" tidak boleh menjatuhkan seluruh halaman.
    if (!res.error) liked = new Set(res.data.map((r) => r.reinforcement_id));
  }

  const total = count ?? 0;
  return {
    messages: data.map((m) => toMessage(m, liked.has(m.reinforcement_id), undefined, sessionId)),
    total,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export async function createMessage({ content, role, location }, sessionId) {
  await assertValidLocation(location);
  const { data, error } = await repo.insertMessage({
    author_session_id: sessionId,
    content_messages: content,
    user_role: role,
    user_location: location,
  });
  if (error) throw error;
  return toMessage(data, false, 0, sessionId);
}

// Mengembalikan null kalau bukan penulis, pesan sudah dihapus, atau waktu edit habis.
export async function updateMessage(id, { content, role, location }, sessionId) {
  await assertValidLocation(location);
  const { data, error } = await repo.updateOwnMessage({
    id,
    sessionId,
    row: { content_messages: content, user_role: role, user_location: location },
    cutoffIso: new Date(Date.now() - editWindowMs).toISOString(),
  });
  if (error) throw error;
  return data ? toMessage(data, false, undefined, sessionId) : null;
}

export async function setReaction(messageId, sessionId, liked) {
  const change = liked
    ? await repo.addReaction(sessionId, messageId)
    : await repo.removeReaction(sessionId, messageId);
  if (change.error) throw change.error;

  const { count, error } = await repo.countReactions(messageId);
  if (error) throw error;
  return { liked, supportCount: count ?? 0 };
}