import { NextResponse } from "next/server";
import { isValidSessionToken } from "@/lib/session/validate";
import { callFastApi, getErrorMessage } from "@/lib/fastapi";

export const dynamic = "force-dynamic";

const MAX_CHARS = 4000; // samakan dengan MAX_MESSAGE_CHARS di backend/.env
export async function POST(request) {
  try {
    const body = await request.json();

    const message = typeof body?.message === "string" ? body.message.trim() : "";
    if (!message || message.length > MAX_CHARS) {
      return NextResponse.json(
        { error: "Pertanyaan tidak valid atau terlalu panjang." },
        { status: 400 }
      );
    }

    const consent = body.consent === true;
    const sessionToken = typeof body.session_token === "string" ? body.session_token : null;
    if (consent && !isValidSessionToken(sessionToken)) {
      return NextResponse.json({ error: "ID sesi tidak valid." }, { status: 400 });
    }

    const answers =
      body.answers && typeof body.answers === "object" && !Array.isArray(body.answers)
        ? body.answers
        : null;
    const city = typeof body.city === "string" ? body.city.slice(0, 100) : null;

    // true (default) = giliran pertama. Klien mengirim false untuk giliran berikutnya.
    const isFirstTurn = body.pertama !== false;
    const history = Array.isArray(body.history)
      ? body.history
          .filter((h) => h && (h.role === "user" || h.role === "bot") && typeof h.text === "string")
          .slice(-6)
          .map((h) => ({ role: h.role, text: h.text.slice(0, 2000) }))
      : [];

    const { ok, status, data } = await callFastApi("/chat", {
      method: "POST",
      body: {
        message,
        answers,
        consent,
        session_token: consent ? sessionToken : null,
        city,
        pertama: isFirstTurn, // nama field mengikuti backend
        history,
      },
    });

    if (!data) {
      return NextResponse.json({ error: "Respons backend tidak valid." }, { status: 502 });
    }
    if (!ok) {
      return NextResponse.json(
        { error: getErrorMessage(data, "Permintaan gagal.") },
        { status }
      );
    }
    return NextResponse.json(data);
  } catch (error) {
    // Jangan mencatat isi pertanyaan.
    console.error("Chat API error:", error?.name || "unknown");
    return NextResponse.json(
      { error: "Layanan chatbot belum dapat dihubungi." },
      { status: 502 }
    );
  }
}
