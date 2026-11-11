import "server-only";
import { sha256 } from "@/lib/session/token";
import { supabaseServer } from "@/lib/supabase/server";

export async function getSessionTokenHash(request) {
  const token = request.headers.get("x-session-token");
  if (!token || !/^[0-9a-f]{64}$/.test(token)) return null;
  return sha256(token);
}

// Mengembalikan session_id (int) atau null kalau token tidak ada / tidak valid / expired
export async function getSessionId(request) {
  const hash = await getSessionTokenHash(request);
  if (!hash) return null;

  const { data, error } = await supabaseServer
    .from("anonymous_sessions")
    .select("session_id")
    .eq("session_token_hash", hash)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (error) {
    console.error("[getSessionId]", error.message);
    return null;
  }
  return data?.session_id ?? null;
}