import { NextResponse } from "next/server";
import { isValidSessionToken } from "@/lib/session/validate";
import { callFastApi, getErrorMessage } from "../../../../lib/fastapi";

export const dynamic = "force-dynamic";

// Menyimpan chat yang semula tidak disimpan. Validasi isi giliran dilakukan di backend (FastAPI).
export async function POST(request) {
  try {
    const body = await request.json();
    const token = typeof body?.session_token === "string" ? body.session_token : "";
    if (!isValidSessionToken(token)) {
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