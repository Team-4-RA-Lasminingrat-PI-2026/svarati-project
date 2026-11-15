import { NextResponse } from "next/server";
import { ambilUntukExport } from "@/lib/help-directory";
import { DIREKTORI } from "@/content/labels";

export const dynamic = "force-dynamic";

const C = DIREKTORI.csv;

// Cegah "CSV injection": sel yang diawali = @ (atau + / - non-nomor) bisa dieksekusi Excel
function esc(v) {
  let s = String(v ?? "");
  if (/^[=@\t\r]/.test(s) || /^[+-](?![\d\s()-]+$)/.test(s)) s = "'" + s;
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(request) {
  const sp = request.nextUrl.searchParams;

  try {
    const data = await ambilUntukExport({
      cari: sp.get("cari"),
      provinsi: sp.get("provinsi"),
      kota: sp.get("kota"),
      tipe: sp.get("tipe"),
    });

    const baris = data.map((s) =>
      [s.nama, s.tipe, s.provinsi, s.kota, s.alamat, s.telepon].map(esc).join(",")
    );
    const csv = "\uFEFF" + [C.header.join(","), ...baris].join("\r\n");

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${C.namaFile}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error("GET /api/help-directory/export gagal:", e?.message);
    return NextResponse.json(
      { error: "Gagal membuat file" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}