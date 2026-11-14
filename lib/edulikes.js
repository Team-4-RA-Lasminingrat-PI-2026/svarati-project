import "server-only";
import { createHash } from "node:crypto";
import { supabaseService } from "@/lib/supabase/service";
import { live } from "@/lib/articles";

const hashToken = (token) =>
  createHash("sha256").update(token).digest("hex");

export async function getSessionId(token) {
  const { data, error } = await supabaseService
    .from("anonymous_sessions")
    .select("session_id")
    .eq("session_token_hash", hashToken(token))
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();
  if (error) throw error;
  return data?.session_id ?? null;
}

export async function getLiveEntryId(slug) {
  const { data, error } = await live(
    supabaseService
      .from("knowledge_entries")
      .select("entry_id, knowledge_topics!inner(is_active)")
  )
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data?.entry_id ?? null;
}

export async function countLikes(entryId) {
  const { count, error } = await supabaseService
    .from("article_likes")
    .select("like_id", { count: "exact", head: true })
    .eq("entry_id", entryId);
  if (error) throw error;
  return count ?? 0;
}

export async function hasLiked(entryId, sessionId) {
  const { data, error } = await supabaseService
    .from("article_likes")
    .select("like_id")
    .eq("entry_id", entryId)
    .eq("reader_session_id", sessionId)
    .maybeSingle();
  if (error) throw error;
  return !!data;
}

export async function addLike(entryId, sessionId) {
  const { error } = await supabaseService
    .from("article_likes")
    .upsert(
      { entry_id: entryId, reader_session_id: sessionId },
      { onConflict: "entry_id,reader_session_id", ignoreDuplicates: true }
    );
  if (error) throw error;
}

export async function removeLike(entryId, sessionId) {
  const { error } = await supabaseService
    .from("article_likes")
    .delete()
    .eq("entry_id", entryId)
    .eq("reader_session_id", sessionId);
  if (error) throw error;
}