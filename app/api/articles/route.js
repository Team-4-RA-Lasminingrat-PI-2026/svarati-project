import { NextResponse } from "next/server";
import { z } from "zod";
import { listArticles } from "@/lib/articles";

const querySchema = z.object({
  topic: z.string().regex(/^[a-z_]+$/).max(50).optional(),
  keyword: z.string().max(100).optional(),
  headline: z.enum(["true", "false"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export async function GET(req) {
  const params = Object.fromEntries(new URL(req.url).searchParams);
  const parsed = querySchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json({ error: "Parameter tidak valid" }, { status: 400 });
  }

  const { topic, keyword, headline, page, limit } = parsed.data;
  try {
    const result = await listArticles({
      topic,
      keyword,
      headline: headline === "true",
      page,
      limit,
    });
    return NextResponse.json(result);
  } catch (err) {
    console.error("GET /api/articles", err);
    return NextResponse.json({ error: "Gagal memuat artikel" }, { status: 500 });
  }
}