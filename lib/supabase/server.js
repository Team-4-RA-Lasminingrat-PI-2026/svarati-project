import { createClient } from "@supabase/supabase-js";

// Client Supabase untuk kode server (Route Handler / Server Component).
// Memakai env tanpa NEXT_PUBLIC_ supaya tidak ikut terkirim ke browser.
export function buatClientServer() {
  return createClient(
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { auth: { persistSession: false } }
  );
}

// Untuk Tree of Hope dan sesi anonim: memakai service role, melewati RLS.
// Hanya boleh dipakai di server. Jangan pernah diimpor dari komponen client.
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!serviceKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY belum diisi di .env.local");
}

export const supabaseServer = createClient(
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL,
  serviceKey,
  { auth: { persistSession: false } }
);