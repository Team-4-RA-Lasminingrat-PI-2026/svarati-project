import { NextResponse } from "next/server";
import { callFastApi, getErrorMessage } from "../../../lib/fastapi";

export const dynamic = "force-dynamic";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function forwardRequest(request, method) {
  try {
    const body = await request.json();
    const sessionToken =
      typeof body?.session_token === "string" ? body.session_token : "";
    if (!UUID_RE.test(sessionToken)) {
      return NextResponse.json({ error: "ID sesi tidak valid." }, { status: 400 });
    }

    const { ok, status, data } = await callFastApi("/session", {
      method,
      body: { session_token: sessionToken },
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
    // console.error("Session API error:", error?.name || "unknown");
    console.error("Session API error:", error?.name, error?.message, error?.stack?.split("\n")[1]);
    return NextResponse.json(
      { error: "Layanan belum dapat dihubungi." },
      { status: 502 }
    );
  }
}

export async function POST(request) {
  return forwardRequest(request, "POST");
}

export async function DELETE(request) {
  return forwardRequest(request, "DELETE");
}