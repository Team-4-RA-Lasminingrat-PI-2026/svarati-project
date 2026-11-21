import { NextResponse } from "next/server";
import { isValidSessionToken } from "@/lib/session/validate";
import { callFastApi, getErrorMessage } from "@/lib/fastapi";

export const dynamic = "force-dynamic";

async function forwardRequest(request, method) {
  try {
    const body = await request.json();
    const sessionToken =
      typeof body?.session_token === "string" ? body.session_token : "";
    if (!isValidSessionToken(sessionToken)) {
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