import { NextResponse } from "next/server";
import { getSessionId } from "@/lib/tree-of-hope/session";
import { updateMessage } from "@/lib/tree-of-hope/services/messageService";
import { validateMessage } from "@/lib/tree-of-hope/validations/messageValidation";

export const dynamic = "force-dynamic";

export async function PATCH(request, { params }) {
  const id = Number((await params).id);
  if (!Number.isSafeInteger(id) || id <= 0) {
    return NextResponse.json({ error: "ID tidak valid." }, { status: 400 });
  }

  const sessionId = await getSessionId(request);
  if (!sessionId) return NextResponse.json({ error: "Sesi tidak valid." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const { error, value } = validateMessage(body);
  if (error) return NextResponse.json({ error }, { status: 400 });

  try {
    const message = await updateMessage(id, value, sessionId);
    if (!message) {
      return NextResponse.json(
        { error: "Waktu untuk mengubah pesan sudah habis." },
        { status: 403 }
      );
    }
    return NextResponse.json(message);
  } catch (err) {
    if (err?.code === "BAD_LOCATION") {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("[PATCH message]", err);
    return NextResponse.json({ error: "Pesan belum bisa diubah." }, { status: 503 });
  }
}