import { NextResponse } from "next/server";
import { callFastApi, getErrorMessage } from "../../../lib/fastapi";

export const dynamic = "force-dynamic";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function validateRequest(body) {
  const messageId = body?.messageId;
  const sessionToken = body?.sessionToken;
  if (!Number.isInteger(messageId) || messageId <= 0) return { error: "Data umpan balik tidak valid." };
  if (typeof sessionToken !== "string" || !UUID_RE.test(sessionToken)) return { error: "ID sesi tidak valid." };
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
    if (typeof sessionToken !== "string" || !UUID_RE.test(sessionToken)) {
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
