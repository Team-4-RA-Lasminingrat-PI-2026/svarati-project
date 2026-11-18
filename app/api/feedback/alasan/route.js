import { NextResponse } from "next/server";
import { isValidSessionToken } from "@/lib/session/validate";
import { callFastApi, getErrorMessage } from "../../../../lib/fastapi";

export const dynamic = "force-dynamic";

const VALID_REASON_CODES = new Set(["tidak_sesuai", "terlalu_panjang", "kurang_jelas", "layanan_tidak_tepat", "lainnya"]);
const MAX_REASON_TEXT_LENGTH = 200;

// Simpan alasan penilaian "kurang membantu". Backend juga memeriksa persetujuan dan validasi.
export async function POST(request) {
  try {
    const body = await request.json();
    const messageId = body?.messageId;
    const sessionToken = body?.sessionToken;
    const reasonCode = body?.reasonCode;
    const reasonText =
      typeof body?.reasonText === "string" ? body.reasonText.slice(0, MAX_REASON_TEXT_LENGTH) : null;

    if (!Number.isInteger(messageId) || messageId <= 0) {
      return NextResponse.json({ error: "Data umpan balik tidak valid." }, { status: 400 });
    }
    if (typeof sessionToken !== "string" || !isValidSessionToken(sessionToken)) {
      return NextResponse.json({ error: "ID sesi tidak valid." }, { status: 400 });
    }
    if (!VALID_REASON_CODES.has(reasonCode)) {
      return NextResponse.json({ error: "Alasan tidak dikenal." }, { status: 400 });
    }

    const { ok, status, data } = await callFastApi("/feedback/alasan", {
      method: "POST",
      timeoutMs: 15000,
      body: {
        message_id: messageId,
        session_token: sessionToken,
        reason_code: reasonCode,
        reason_text: reasonText,
        consent: true,
      },
    });
    if (!data) return NextResponse.json({ error: "Respons backend tidak valid." }, { status: 502 });
    if (!ok) return NextResponse.json({ error: getErrorMessage(data, "Gagal menyimpan alasan.") }, { status });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Feedback alasan API error:", error?.name || "unknown");
    return NextResponse.json({ error: "Layanan chatbot belum dapat dihubungi." }, { status: 502 });
  }
}
