import { NextResponse } from "next/server";
import { getKota } from "@/lib/help-directory";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const sp = request.nextUrl.searchParams;
  const headers = { "Cache-Control": "no-store" };

  try {
    const data = await getKota({
      provinsi: sp.get("provinsi"),
      provinsiId: sp.get("provinsi_id"),
    });
    return NextResponse.json({ data }, { headers });
  } catch (e) {
    console.error("GET /api/cities gagal:", e?.message);
    return NextResponse.json({ error: "Gagal memuat kota" }, { status: 500, headers });
  }
}