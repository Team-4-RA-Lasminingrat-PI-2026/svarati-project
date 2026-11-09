import { buatClientServer as buatClient } from "@/lib/supabase/server";
import { DIREKTORI } from "@/content/labels";

const NASIONAL = DIREKTORI.filter.nilaiNasional;

export const TIPE_VALID = [
  "Pemerintah",
  "Bantuan Hukum",
  "Medis",
  "Psikologis",
  "Lembaga Masyarakat",
];

export const BATAS_DEFAULT = 10;
const BATAS_MAKS = 50;
const BATAS_EXPORT = 1000;

const KOLOM =
  "provider_id, provider_name, provider_type, province, city, city_id, cities(city_name), address, phone_number, latitude, longitude, source_url, verified_at, is_national, email_providers, desc_providers, operating_hours, social_media_providers";

function buatClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
}

// Ubah nama kolom database ke bentuk yang dipakai UI
function petakan(p) {
  return {
    id: p.provider_id,
    nama: p.provider_name,
    tipe: p.provider_type,
    provinsi: p.province,
    kota: p.cities?.city_name ?? p.city,
    alamat: p.address,
    telepon: p.phone_number,
    lat: p.latitude,
    lng: p.longitude,
    web: p.source_url,
    diverifikasiPada: p.verified_at,
    nasional: p.is_national,
    email: p.email_providers,
    deskripsi: p.desc_providers,
    jam: p.operating_hours,
    sosmed: p.social_media_providers,
  };
}

const bersihkan = (v, maks = 100) => String(v ?? "").trim().slice(0, maks);

// Buang karakter yang punya arti khusus di filter PostgREST (koma, kurung, wildcard, kutip)
const amanUntukOr = (q) =>
  q.replace(/[,()%_*\\"]/g, " ").replace(/\s+/g, " ").trim();

function terapkanFilter(query, f) {
  const cari = amanUntukOr(bersihkan(f.cari));
  if (cari) {
    const pola = `"%${cari}%"`;
    query = query.or(
      `provider_name.ilike.${pola},address.ilike.${pola},city.ilike.${pola}`
    );
  }

  const tipe = bersihkan(f.tipe);
  if (TIPE_VALID.includes(tipe)) query = query.eq("provider_type", tipe);

  const provinsi = bersihkan(f.provinsi);
  const kotaId = parseInt(f.kota, 10);

  if (provinsi === NASIONAL) {
    query = query.eq("is_national", true);
  } else if (provinsi) {
    query = query.eq("is_national", false).eq("province", provinsi);
    if (kotaId) query = query.eq("city_id", kotaId);
  }
  return query;
}

function urutkan(query, f) {
  // Tanpa filter lokasi, layanan nasional tampil di atas
  if (!bersihkan(f.provinsi)) query = query.order("is_national", { ascending: false });
  // provider_id sebagai pemisah agar urutan antarhalaman stabil
  return query.order("provider_name").order("provider_id");
}

/** RLA046: daftar layanan dengan filter + pagination */
export async function cariLayanan(f = {}, { page = 1, limit = BATAS_DEFAULT } = {}) {
  const hal = Math.max(1, parseInt(page, 10) || 1);
  const batas = Math.min(BATAS_MAKS, Math.max(1, parseInt(limit, 10) || BATAS_DEFAULT));
  const dari = (hal - 1) * batas;

  let query = buatClient()
    .from("service_providers")
    .select(KOLOM, { count: "exact" })
    .eq("is_verified", true);

  query = urutkan(terapkanFilter(query, f), f).range(dari, dari + batas - 1);

  const { data, count, error } = await query;

  // Halaman melebihi jumlah data: kembalikan kosong, bukan error
  if (error?.code === "PGRST103") {
    return { data: [], total: count ?? 0, page: hal, limit: batas, hasMore: false };
  }
  if (error) throw error;

  const total = count ?? 0;
  return {
    data: data.map(petakan),
    total,
    page: hal,
    limit: batas,
    hasMore: dari + data.length < total,
  };
}

/** RLA047: semua hasil filter (tanpa pagination) untuk CSV */
export async function ambilUntukExport(f = {}) {
  let query = buatClient()
    .from("service_providers")
    .select(KOLOM)
    .eq("is_verified", true);

  query = urutkan(terapkanFilter(query, f), f).range(0, BATAS_EXPORT - 1);

  const { data, error } = await query;
  if (error) throw error;
  return data.map(petakan);
}

/** RLA048: semua provinsi aktif */
export async function getProvinsi() {
  const { data, error } = await buatClient()
    .from("provinces")
    .select("province_id, province_name")
    .eq("is_active", true)
    .is("deleted_at", null)
    .order("province_name");

  if (error) throw error;
  return data.map((p) => ({ id: p.province_id, nama: p.province_name }));
}

/** RLA049: kota aktif berdasarkan provinsi (nama atau id) */
export async function getKota({ provinsi, provinsiId } = {}) {
  const nama = bersihkan(provinsi);
  const id = parseInt(provinsiId, 10);
  if (!nama && !id) return [];

  let query = buatClient()
    .from("cities")
    .select("city_id, city_name, provinces!inner(province_name)")
    .eq("is_active", true)
    .is("deleted_at", null)
    .order("city_name");

  query = id ? query.eq("province_id", id) : query.eq("provinces.province_name", nama);

  const { data, error } = await query;
  if (error) throw error;
  return data.map((c) => ({ id: c.city_id, nama: c.city_name }));
    }
