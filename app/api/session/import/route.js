import { NextResponse } from "next/server";
import { callFastApi, getErrorMessage } from "../../../../lib/fastapi";

export const dynamic = "force-dynamic";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Menyimpan chat yang semula tidak disimpan. Validasi isi giliran dilakukan di backend (FastAPI).
export async function POST(request) {
  try {
    const body = await request.json();
    const token = typeof body?.session_token === "string" ? body.session_token : "";
    if (!UUID_RE.test(token)) {
      return NextResponse.json({ error: "ID sesi tidak valid." }, { status: 400 });
    }
    const turns = Array.isArray(body?.turns) ? body.turns.slice(0, 50) : [];
    if (turns.length === 0) {
      return NextResponse.json({ error: "Tidak ada percakapan untuk disimpan." }, { status: 400 });
    }

    const { ok, status, data } = await callFastApi("/session/import", {
      method: "POST",
      timeoutMs: 30000,
      body: { session_token: token, turns },
    });
    if (!data) {
      return NextResponse.json({ error: "Respons backend tidak valid." }, { status: 502 });
    }
    if (!ok) {
      return NextResponse.json({ error: getErrorMessage(data, "Gagal menyimpan riwayat.") }, { status });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Session import error:", error?.name || "unknown");
    return NextResponse.json({ error: "Layanan belum dapat dihubungi." }, { status: 502 });
  }
}