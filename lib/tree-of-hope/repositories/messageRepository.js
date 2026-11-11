import "server-only";
import { supabaseServer } from "@/lib/supabase/server";

const MESSAGES = "reinforcement_messages";
const REACTIONS = "reinforcement_reactions";
const CITIES_TABLE = "cities"; // ganti kalau nama tabel kota di databasemu berbeda

// author_session_id WAJIB ada di sini, kalau tidak tombol edit tidak akan pernah muncul.
const COLUMNS =
  "reinforcement_id, author_session_id, content_messages, user_role, user_location, created_at";

export function findMessages({ from, to }) {
  return supabaseServer
    .from(MESSAGES)
    .select(`${COLUMNS}, reinforcement_reactions(count)`, { count: "exact" })
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .range(from, to);
}

export function findLikedIds(sessionId, messageIds) {
  return supabaseServer
    .from(REACTIONS)
    .select("reinforcement_id")
    .eq("reader_session_id", sessionId)
    .in("reinforcement_id", messageIds);
}

export function insertMessage(row) {
  return supabaseServer.from(MESSAGES).insert(row).select(COLUMNS).single();
}

// Satu query atomik: hanya penulis, belum dihapus, dan masih dalam batas waktu edit.
export function updateOwnMessage({ id, sessionId, row, cutoffIso }) {
  return supabaseServer
    .from(MESSAGES)
    .update({ ...row, edited_at: new Date().toISOString() })
    .eq("reinforcement_id", id)
    .eq("author_session_id", sessionId)
    .is("deleted_at", null)
    .gt("created_at", cutoffIso)
    .select(COLUMNS)
    .maybeSingle();
}

export function findActiveCityByName(name) {
  return supabaseServer
    .from(CITIES_TABLE)
    .select("city_id")
    .eq("city_name", name)
    .eq("is_active", true)
    .is("deleted_at", null)
    .limit(1);
}

  export function findProvinceByName(name) {
  return supabaseServer
    .from("provinces")
    .select("province_id")
    .eq("province_name", name)
    .eq("is_active", true)
    .is("deleted_at", null)
    .limit(1);
}

export async function addReaction(sessionId, messageId) {
  const { error } = await supabaseServer
    .from(REACTIONS)
    .insert({ reader_session_id: sessionId, reinforcement_id: messageId });
  // 23505 = sudah pernah memberi dukungan; anggap berhasil.
  return { error: error?.code === "23505" ? null : error };
}

export function removeReaction(sessionId, messageId) {
  return supabaseServer
    .from(REACTIONS)
    .delete()
    .eq("reader_session_id", sessionId)
    .eq("reinforcement_id", messageId);
}

export function countReactions(messageId) {
  return supabaseServer
    .from(REACTIONS)
    .select("reaction_id", { count: "exact", head: true })
    .eq("reinforcement_id", messageId);
}