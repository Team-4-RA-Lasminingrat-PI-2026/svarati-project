import "server-only";
import { supabaseService as supabase } from "./supabase/service";

const fmtDate = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

// Bentuk data yang dipakai komponen FE (ArticleCard, EducationBanner, halaman detail)
const toItem = (r) => ({
  id: r.slug,
  slug: r.slug,
  headline: r.is_headline,
  category: r.topic,
  categoryLabel: r.knowledge_topics?.topic_label ?? null,
  author: r.publisher,
  title: r.title,
  summary: r.summary,
  date: r.published_at ? fmtDate.format(new Date(r.published_at)) : null,
  readTime: r.read_minutes ? `${r.read_minutes} menit baca` : null,
  image: r.image_url,
});

const LIST_COLUMNS =
  "slug,title,publisher,topic,summary,image_url,is_headline,published_at,read_minutes," +
  "knowledge_topics!inner(topic_label,is_active)";

// Satu-satunya tempat aturan "artikel boleh tayang di /preventif"
export const live = (query) =>
  query
    .eq("is_active", true)
    .eq("show_in_education", true)
    .not("slug", "is", null)
    .neq("slug", "")
    .not("content_md", "is", null)
    .neq("content_md", "")
    .eq("knowledge_topics.is_active", true);

export async function listArticles({ topic, keyword, headline, page, limit }) {
  const from = (page - 1) * limit;

  let query = live(
    supabase.from("knowledge_entries").select(LIST_COLUMNS, { count: "exact" })
  )
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("entry_id", { ascending: false })
    .range(from, from + limit - 1);

  if (topic) query = query.eq("topic", topic);
  if (headline) query = query.eq("is_headline", true);

  // Karakter yang punya arti khusus di filter dibuang dari keyword
  const kw = keyword?.replace(/[%_\\",()*]/g, " ").trim();
  if (kw) query = query.or(`title.ilike."%${kw}%",summary.ilike."%${kw}%"`);

  const { data, count, error } = await query;
  if (error) throw error;

  const total = count ?? 0;
  return {
    data: data.map(toItem),
    meta: { page, limit, total, total_pages: Math.ceil(total / limit) },
  };
}

export async function getTopics() {
  const { data, error } = await live(
    supabase
      .from("knowledge_entries")
      .select("topic,knowledge_topics!inner(topic_label,is_active)")
  );
  if (error) throw error;

  const unique = new Map();
  for (const row of data) unique.set(row.topic, row.knowledge_topics.topic_label);
  return [...unique].map(([id, label]) => ({ id, label }));
}

export async function getArticleBySlug(slug) {
  const { data, error } = await live(
    supabase
      .from("knowledge_entries")
      .select(`${LIST_COLUMNS},content_md,article_likes(count)`)
  )
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  return {
    ...toItem(data),
    content: data.content_md,
    likes: data.article_likes?.[0]?.count ?? 0,
  };

}