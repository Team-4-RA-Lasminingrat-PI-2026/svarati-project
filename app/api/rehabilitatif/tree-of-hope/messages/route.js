import { NextResponse } from "next/server";
import { getSessionId } from "@/lib/tree-of-hope/session";
import { getMessages, createMessage } from "@/lib/tree-of-hope/services/messageService";
import { validateMessage } from "@/lib/tree-of-hope/validations/messageValidation";
import { getFallbackPage } from "@/lib/tree-of-hope/fallbackMessages";

export const dynamic = "force-dynamic"; // jangan pernah di-cache: editableUntil bergantung pada sesi

export async function GET(request) {
  const page = Math.max(1, Number(new URL(request.url).searchParams.get("page")) || 1);
  try {
    const sessionId = await getSessionId(request); // boleh null: pembaca tanpa sesi
    const result = await getMessages(page, sessionId);
    if (result.total === 0) return NextResponse.json(getFallbackPage(page));
    return NextResponse.json({ ...result, source: "live" });
  } catch (err) {
    console.error("[GET messages]", err);
    return NextResponse.json(getFallbackPage(page));
  }
}

export async function POST(request) {
  const sessionId = await getSessionId(request);
  if (!sessionId) {
    return NextResponse.json(
      { error: "Sesi tidak valid. Coba muat ulang halaman." },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => null);
  const { error, value } = validateMessage(body);
  if (error) return NextResponse.json({ error }, { status: 400 });

  try {
    const message = await createMessage(value, sessionId);
    return NextResponse.json(message, { status: 201 });
  } catch (err) {
    if (err?.code === "BAD_LOCATION") {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("[POST messages]", err);
    return NextResponse.json({ error: "Pesan belum bisa disimpan." }, { status: 503 });
  }
}