import { NextResponse } from "next/server";
import { cariLayanan } from "@/lib/help-directory";

export const dynamic = "force-dynamic";

// Hasil pencarian tidak boleh disimpan di cache mana pun
const HEADER = { "Cache-Control": "no-store" };

export async function GET(request) {
  const sp = request.nextUrl.searchParams;

  try {
    const hasil = await cariLayanan(
      {
        cari: sp.get("cari"),
        provinsi: sp.get("provinsi"),
        kota: sp.get("kota"),
        tipe: sp.get("tipe"),
      },
      { page: sp.get("page"), limit: sp.get("limit") }
    );
    return NextResponse.json(hasil, { headers: HEADER });
  } catch (e) {
    // Sengaja hanya mencatat pesan error, BUKAN parameter pencarian pengguna
    console.error("GET /api/help-directory gagal:", e?.message);
    return NextResponse.json(
      { error: "Gagal memuat data" },
      { status: 500, headers: HEADER }
    );
  }
}