import { NextResponse } from "next/server";
import { getArticleBySlug } from "@/lib/articles";

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export async function GET(_req, { params }) {
  const { slug } = await params;
  if (!SLUG.test(slug)) {
    return NextResponse.json({ error: "Slug tidak valid" }, { status: 400 });
  }

  try {
    const article = await getArticleBySlug(slug);
    if (!article) {
      return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json(article);
  } catch (err) {
    console.error("GET /api/articles/[slug]", err);
    return NextResponse.json({ error: "Gagal memuat artikel" }, { status: 500 });
  }
}