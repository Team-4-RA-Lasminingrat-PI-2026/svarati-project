import { redirect } from "next/navigation";
import EducationBanner from "@/components/education/EducationBanner";
import EducationList from "@/components/education/EducationList";
import { educationContent as edu } from "@/content/labels";
import { getTopics, listArticles } from "@/lib/articles";

export const metadata = { title: edu.pageTitle };

const PAGE_SIZE = 12;

const toPage = (v) => {
  const n = parseInt(Array.isArray(v) ? v[0] : v, 10);
  return Number.isFinite(n) && n >= 1 ? Math.min(n, 10000) : 1;
};

const toText = (v, max) =>
  (typeof v === "string" ? v : "").trim().slice(0, max);

export default async function EducationPage({ searchParams }) {
  const sp = await searchParams; // Next.js 16: Promise

  const [head, topics] = await Promise.all([
    listArticles({ headline: true, page: 1, limit: 5 }),
    getTopics(),
  ]);

  // Tab: "Semua" + kategori yang punya artikel tayang, urutan mengikuti labels.js
  const order = edu.tabs.map((t) => t.id);
  const rank = (id) => (order.includes(id) ? order.indexOf(id) : order.length);
  const tabs = [
    edu.tabs[0],
    ...[...topics].sort((a, b) => rank(a.id) - rank(b.id)),
  ];

  // Parameter dari URL: topik yang tidak dikenal diabaikan
  const rawTopic = toText(sp.topic, 50);
  const topic = topics.some((t) => t.id === rawTopic) ? rawTopic : "";
  const q = toText(sp.q, 100);
  const page = toPage(sp.page);

  const result = await listArticles({
    topic: topic || undefined,
    keyword: q || undefined,
    page,
    limit: PAGE_SIZE,
  });

  // Halaman di luar jangkauan: arahkan ke halaman terakhir
  const { total_pages } = result.meta;
  if (page > 1 && total_pages > 0 && page > total_pages) {
    const p = new URLSearchParams();
    if (topic) p.set("topic", topic);
    if (q) p.set("q", q);
    if (total_pages > 1) p.set("page", String(total_pages));
    const s = p.toString();
    redirect(s ? `${edu.basePath}?${s}` : edu.basePath);
  }

  return (
    <main className="min-h-svh bg-svarati-cream pb-16 pt-24">
      <EducationBanner headlines={head.data} />
      <EducationList
        articles={result.data}
        meta={result.meta}
        tabs={tabs}
        topic={topic}
        q={q}
      />
    </main>
  );
}