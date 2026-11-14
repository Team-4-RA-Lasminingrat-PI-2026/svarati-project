import { cache } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/Card";
import ArticleCard from "@/components/education/ArticleCard";
import ArticleActions from "@/components/education/ArticleActions";
import { educationContent as edu } from "@/content/labels";
import { getArticleBySlug, listArticles } from "@/lib/articles";

// Satu kali query untuk generateMetadata dan halaman
const getArticle = cache(getArticleBySlug);

const initials = (name = "") =>
  name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};
  return { title: `${article.title} | Svarati`, description: article.summary ?? undefined };
}

// Gaya sama persis dengan komponen Body sebelumnya
const mdComponents = {
  h2: ({ children }) => (
    <h2 className="mb-3 mt-10 text-2xl font-bold leading-snug text-svarati-teal">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 mt-8 text-xl font-bold leading-snug text-svarati-teal">{children}</h3>
  ),
  p: ({ children }) => <p className="my-5">{children}</p>,
  ul: ({ children }) => (
    <ul className="my-5 list-disc space-y-2 pl-6 marker:text-svarati-lavender">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-5 list-decimal space-y-2 pl-6 marker:text-svarati-lavender">{children}</ol>
  ),
  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ href, children }) => (
    <a href={href} className="font-semibold text-svarati-lavender-dark underline" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
};

// Artikel terkait: kategori sama dulu, lalu isi dengan yang lain, maksimal 3
async function getRelated(article) {
  const sameTopic = await listArticles({ topic: article.category, page: 1, limit: 4 });
  let related = sameTopic.data.filter((a) => a.slug !== article.slug);

  if (related.length < 3) {
    const any = await listArticles({ page: 1, limit: 8 });
    const taken = new Set([article.slug, ...related.map((a) => a.slug)]);
    related = [...related, ...any.data.filter((a) => !taken.has(a.slug))];
  }
  return related.slice(0, 3);
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const related = await getRelated(article);

  return (
    <main className="min-h-svh px-2 pb-32 pt-24 sm:px-3">
      {/* Kotak artikel */}
      <article className="mx-auto w-full max-w-6xl overflow-hidden rounded-3xl border border-svarati-lavender-light bg-white shadow-sm">
        {/* Bar atas: tutup (kiri), logo (tengah) */}
        <div className="grid grid-cols-3 items-center border-b border-svarati-lavender-light px-4 py-3 sm:px-6">
          <div>
            <Link
              href={edu.basePath}
              aria-label={edu.detail.back}
              title={edu.detail.back}
              className="flex size-11 items-center justify-center rounded-xl bg-svarati-cream text-svarati-teal transition hover:bg-svarati-lavender-light"
            >
              <X className="size-5" aria-hidden="true" />
            </Link>
          </div>

          <Link
            href="/"
            aria-label="Svarati, ke beranda"
            className="mx-auto flex size-11 items-center justify-center overflow-hidden rounded-xl bg-svarati-lavender-light"
          >
            <Image src="/images/logo.png" alt="" width={44} height={44} className="h-auto w-auto object-contain" />
          </Link>

          <div aria-hidden="true" />
        </div>

        {/* Header artikel */}
        <header className="mx-auto w-full max-w-3xl px-5 pt-12 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-svarati-lavender-dark">
            {article.categoryLabel}
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-svarati-teal md:text-4xl lg:text-5xl">
            {article.title}
          </h1>
          {article.summary && (
            <p className="mt-3 text-base leading-relaxed text-svarati-teal/60 md:text-lg">
              {article.summary}
            </p>
          )}

          <div className="mt-6 flex items-center gap-3 border-b border-svarati-lavender-light pb-8">
            <span
              aria-hidden="true"
              className="flex size-12 shrink-0 items-center justify-center rounded-full bg-svarati-lavender-dark text-sm font-bold text-white"
            >
              {initials(article.author)}
            </span>
            <div className="min-w-0 text-sm">
              <p className="font-semibold uppercase tracking-wide text-svarati-teal">
                {article.author}
              </p>
              <p className="mt-0.5 uppercase text-svarati-teal/60">
                {[article.date, article.readTime].filter(Boolean).join(" • ")}
              </p>
            </div>
          </div>
        </header>

        {/* Gambar utama: tampil utuh sesuai rasio aslinya */}
        {article.image && (
          <div className="mx-auto mt-12 w-full max-w-4xl px-5 sm:px-6">
            <Image
              src={article.image}
              alt=""
              width={1200}
              height={800}
              priority
              sizes="(min-width: 896px) 896px, 100vw"
              className="mx-auto h-auto max-h-[80vh] w-auto max-w-full bg-svarati-lavender-light"
            />
          </div>
        )}

        {/* Isi artikel (Markdown dari DOCX) */}
        <div className="mx-auto w-full max-w-3xl px-5 pb-16 pt-6 text-base leading-8 text-svarati-teal/90 sm:px-6 md:text-lg">
          <ReactMarkdown components={mdComponents}>{article.content}</ReactMarkdown>

          <Card variant="danger" className="mt-12 border-l-4 border-l-svarati-danger">
            <CardTitle className="text-svarati-danger">{edu.detail.help.title}</CardTitle>
            <CardDescription className="text-[15px] leading-relaxed">
              {edu.detail.help.text}
            </CardDescription>
            <Button
              render={<a href={edu.detail.help.href} />}
              nativeButton={false}
              variant="exit"
              size="md"
              className="mt-4 rounded-full px-5 font-bold"
              icon={<Phone className="size-4" aria-hidden="true" />}
            >
              {edu.detail.help.cta}
            </Button>
            <Button
              render={<a href={edu.detail.help.href2} />}
              nativeButton={false}
              variant="exit"
              size="md"
              className="rounded-full px-5 font-bold"
              icon={<Phone className="size-4" aria-hidden="true" />}
            >
              {edu.detail.help.cta2}
            </Button>
          </Card>
        </div>
      </article>

      {/* Artikel terkait */}
      {related.length > 0 && (
        <section className="mt-16 px-2 sm:px-3">
          <div className="mx-auto w-full max-w-6xl">
            <h2 className="mb-5 text-2xl font-bold text-svarati-teal">{edu.detail.related}</h2>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <li key={a.slug}>
                  <ArticleCard article={a} categoryName={a.categoryLabel} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <ArticleActions
        title={article.title}
        slug={article.slug}
        initialLikes={article.likes ?? 0}
      />    
    </main>
  );
}
