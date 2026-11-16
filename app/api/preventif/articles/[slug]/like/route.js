import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getSessionId,
  getLiveEntryId,
  countLikes,
  hasLiked,
  addLike,
  removeLike,
} from "@/lib/edulikes";

const schema = z.object({
  slug: z.string().max(200).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  token: z.string().regex(/^[a-f0-9]{64}$/),
});

const fail = (status, message) =>
  NextResponse.json({ error: message }, { status });

async function resolve(request, params) {
  const { slug } = await params;
  const parsed = schema.safeParse({
    slug,
    token: request.headers.get("x-session-token"),
  });
  if (!parsed.success) return { res: fail(400, "Permintaan tidak valid") };

  const sessionId = await getSessionId(parsed.data.token);
  if (!sessionId) return { res: fail(401, "Sesi tidak valid atau kedaluwarsa") };

  const entryId = await getLiveEntryId(parsed.data.slug);
  if (!entryId) return { res: fail(404, "Artikel tidak ditemukan") };

  return { sessionId, entryId };
}

async function handle(request, params, action) {
  try {
    const r = await resolve(request, params);
    if (r.res) return r.res;

    if (action === "add") await addLike(r.entryId, r.sessionId);
    if (action === "remove") await removeLike(r.entryId, r.sessionId);

    const [liked, likes] = await Promise.all([
      hasLiked(r.entryId, r.sessionId),
      countLikes(r.entryId),
    ]);
    return NextResponse.json(
      { liked, likes },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("[likes]", err.message);
    return fail(500, "Terjadi kesalahan");
  }
}

export const GET = (req, { params }) => handle(req, params, "status");
export const POST = (req, { params }) => handle(req, params, "add");
export const DELETE = (req, { params }) => handle(req, params, "remove");