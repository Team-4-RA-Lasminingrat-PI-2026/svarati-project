import { supabase } from "@/lib/supabase/client";

// Mengembalikan true kalau row berhasil dibuat, false kalau gagal
export async function createSessionRecord(tokenHash, expiresAt) {
  const { error } = await supabase.from("anonymous_sessions").insert({
    session_token_hash: tokenHash,
    expires_at: expiresAt,
  });

  if (error) {
    console.warn("[session] gagal membuat session di DB:", error.message);
    return false;
  }
  return true;
}

// true  = sesi valid dan last_active_at ter-update
// false = sesi tidak ada di DB / sudah expired
// null  = error jaringan atau DB (status tidak diketahui)
export async function touchSession(tokenHash) {
  
    const { data, error } = await supabase.rpc("touch_session", {
      p_token_hash: tokenHash,
    });
  
    if (error) {
      console.warn("[session] gagal touch session:", error.message);
      return null;
    }
    return data === true;
  }