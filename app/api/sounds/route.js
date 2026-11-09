import { NextResponse } from "next/server";
import { getSuaraTerapi, KATEGORI_SUARA } from "@/lib/relaxation-tracks";

export async function GET(request) {
  const kategori = request.nextUrl.searchParams.get("kategori");

  if (kategori && !KATEGORI_SUARA.includes(kategori)) {
    return NextResponse.json(
      { error: `Kategori tidak dikenal. Pilihan: ${KATEGORI_SUARA.join(", ")}` },
      { status: 400 }
    );
  }

  try {
    const data = await getSuaraTerapi({ kategori });
    return NextResponse.json(
      { data },
      // Daftar suara jarang berubah, aman di-cache sebentar
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } }
    );
  } catch (e) {
    console.error("GET /api/sounds gagal:", e?.message);
    return NextResponse.json({ error: "Gagal memuat suara terapi" }, { status: 500 });
  }
}
