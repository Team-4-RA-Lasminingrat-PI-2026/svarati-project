import { createClient } from "@supabase/supabase-js";

// Client Supabase untuk kode server (Route Handler / Server Component).
// Memakai env tanpa NEXT_PUBLIC_ supaya tidak ikut terkirim ke browser.
export function buatClientServer() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
}
