import { NextResponse } from "next/server";
import { getProvinsi } from "@/lib/help-directory";

export async function GET() {
  try {
    const data = await getProvinsi();
    return NextResponse.json(
      { data },
      // Daftar provinsi publik dan jarang berubah, aman di-cache
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } }
    );
  } catch (e) {
    console.error("GET /api/provinces gagal:", e?.message);
    return NextResponse.json({ error: "Gagal memuat provinsi" }, { status: 500 });
  }
}