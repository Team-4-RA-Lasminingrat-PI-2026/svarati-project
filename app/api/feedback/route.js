import { NextResponse } from "next/server";
import { isValidSessionToken } from "@/lib/session/validate";
import { callFastApi, getErrorMessage } from "../../../lib/fastapi";

export const dynamic = "force-dynamic";

async function validateRequest(body) {
  const messageId = body?.messageId;
  const sessionToken = body?.sessionToken;
  if (!Number.isInteger(messageId) || messageId <= 0) return { error: "Data umpan balik tidak valid." };
  if (typeof sessionToken !== "string" || !isValidSessionToken(sessionToken)) return { error: "ID sesi tidak valid." };
  return { messageId, sessionToken };
}

// Batalkan penilaian (klik tombol yang sama dua kali)
export async function DELETE(request) {
  try {
    const v = await validateRequest(await request.json());
    if (v.error) return NextResponse.json({ error: v.error }, { status: 400 });
    const { ok, status, data } = await callFastApi("/feedback", {
      method: "DELETE",
      timeoutMs: 15000,
      body: { message_id: v.messageId, session_token: v.sessionToken },
    });
    if (!data) return NextResponse.json({ error: "Respons backend tidak valid." }, { status: 502 });
    if (!ok) return NextResponse.json({ error: getErrorMessage(data, "Gagal menghapus umpan balik.") }, { status });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Feedback API error:", error?.name || "unknown");
    return NextResponse.json({ error: "Layanan chatbot belum dapat dihubungi." }, { status: 502 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const messageId = body?.messageId;
    const isHelpful = body?.isHelpful;
    const sessionToken = body?.sessionToken;

    if (!Number.isInteger(messageId) || messageId <= 0 || typeof isHelpful !== "boolean") {
      return NextResponse.json({ error: "Data umpan balik tidak valid." }, { status: 400 });
    }
    if (typeof sessionToken !== "string" || !isValidSessionToken(sessionToken)) {
      return NextResponse.json({ error: "ID sesi tidak valid." }, { status: 400 });
    }

    const { ok, status, data } = await callFastApi("/feedback", {
      method: "POST",
      timeoutMs: 15000,
      body: { message_id: messageId, session_token: sessionToken, is_helpful: isHelpful },
    });
    if (!data) {
      return NextResponse.json({ error: "Respons backend tidak valid." }, { status: 502 });
    }
    if (!ok) {
      return NextResponse.json(
        { error: getErrorMessage(data, "Gagal menyimpan umpan balik.") },
        { status }
      );
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Feedback API error:", error?.name || "unknown");
    return NextResponse.json(
      { error: "Layanan chatbot belum dapat dihubungi." },
      { status: 502 }
    );
  }
}
