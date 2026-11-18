import { NextResponse } from "next/server";
import { isValidSessionToken } from "@/lib/session/validate";
import { callFastApi, getErrorMessage } from "../../../../lib/fastapi";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const token = typeof body?.session_token === "string" ? body.session_token : "";
    if (!isValidSessionToken(token)) {
      return NextResponse.json({ error: "ID sesi tidak valid." }, { status: 400 });
    }
    const { ok, status, data } = await callFastApi("/session/messages", {
      method: "POST",
      body: { session_token: token },
    });
    if (!data) {
      return NextResponse.json({ error: "Respons backend tidak valid." }, { status: 502 });
    }
    if (!ok) {
      return NextResponse.json({ error: getErrorMessage(data, "Permintaan gagal.") }, { status });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Session messages error:", error?.name || "unknown");
    return NextResponse.json({ error: "Layanan belum dapat dihubungi." }, { status: 502 });
  }
}