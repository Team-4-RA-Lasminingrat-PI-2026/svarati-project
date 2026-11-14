import { NextResponse } from "next/server";
import { getTopics } from "@/lib/articles";

export async function GET() {
  try {
    return NextResponse.json({ data: await getTopics() });
  } catch (err) {
    console.error("GET /api/topics", err);
    return NextResponse.json({ error: "Gagal memuat kategori" }, { status: 500 });
  }
}