import { NextResponse } from "next/server";
import { getSessionId } from "@/lib/tree-of-hope/session";
import { setReaction } from "@/lib/tree-of-hope/services/messageService";

export const dynamic = "force-dynamic";

async function handle(request, { params }, liked) {
  try {
    const id = Number((await params).id);
    if (!Number.isSafeInteger(id) || id <= 0) {
      return NextResponse.json({ error: "ID tidak valid." }, { status: 400 });
    }
    const sessionId = await getSessionId(request);
    if (!sessionId) return NextResponse.json({ error: "Sesi tidak valid." }, { status: 401 });
    return NextResponse.json(await setReaction(id, sessionId, liked));
  } catch (err) {
    console.error("[reaction]", err?.code, err?.message);
    return NextResponse.json({ error: "Gagal menyimpan dukungan." }, { status: 503 });
  }
}

export const POST = (req, ctx) => handle(req, ctx, true);
export const DELETE = (req, ctx) => handle(req, ctx, false);