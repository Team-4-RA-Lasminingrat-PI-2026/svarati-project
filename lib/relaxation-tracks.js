import { buatClientServer } from "@/lib/supabase/server";

// Kategori yang diizinkan tabel relaxation_tracks (constraint ck_relaxation_tracks_category),
// urutannya juga dipakai sebagai urutan tampil di halaman
export const KATEGORI_SUARA = ["noise", "suara_alam", "musik"];

const KOLOM =
  "track_id, category, title, description, sound_key, audio_url, duration_seconds, sort_order";

// Ubah nama kolom database ke bentuk yang dipakai UI
function petakan(t) {
  return {
    id: t.track_id,
    kategori: t.category,
    judul: t.title,
    deskripsi: t.description,
    soundKey: t.sound_key, // generator suara di browser (null kalau pakai file audio)
    audioUrl: t.audio_url,
    durasiDetik: t.duration_seconds,
    urutan: t.sort_order,
  };
}

/** RLA055: daftar suara terapi yang aktif, bisa difilter per kategori */
export async function getSuaraTerapi({ kategori } = {}) {
  let query = buatClientServer()
    .from("relaxation_tracks")
    .select(KOLOM)
    .eq("is_active", true)
    .order("sort_order")
    .order("track_id");

  if (KATEGORI_SUARA.includes(kategori)) query = query.eq("category", kategori);

  const { data, error } = await query;
  if (error) throw error;
  return data.map(petakan);
}
