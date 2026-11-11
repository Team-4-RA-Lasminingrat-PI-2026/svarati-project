import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const revalidate = 86400;

export async function GET() {
  const [prov, city] = await Promise.all([
    supabaseServer
      .from("provinces")
      .select("province_id, province_name")
      .eq("is_active", true)
      .is("deleted_at", null)
      .order("province_name")
      .limit(1000),
    supabaseServer
      .from("cities")
      .select("province_id, city_name")
      .eq("is_active", true)
      .is("deleted_at", null)
      .order("city_name")
      .limit(1000),
  ]);

  if (prov.error || city.error) {
    console.error("[GET locations]", prov.error?.message, city.error?.message);
    return NextResponse.json({ error: "Gagal memuat daftar daerah." }, { status: 500 });
  }

  const byProvince = new Map();
  for (const c of city.data) {
    if (!byProvince.has(c.province_id)) byProvince.set(c.province_id, []);
    byProvince.get(c.province_id).push(c.city_name);
  }

  const data = prov.data.map((p) => ({
    province: p.province_name,
    cities: byProvince.get(p.province_id) ?? [],
  }));
  return NextResponse.json({ data });
}