import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/Card";
import ArticleCard from "@/components/education/ArticleCard";
import ArticleActions from "@/components/education/ArticleActions";
import { educationContent as edu, categoryLabel } from "@/content/labels";

const initials = (name) =>
  name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

export function generateStaticParams() {
  return edu.articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = edu.articles.find((a) => a.slug === slug);
  if (!article) return {};
  return { title: `${article.title} | Svarati`, description: article.summary };
}

function Body({ blocks }) {
  return blocks.map((b, i) => {
    if (b.type === "h2")
      return (
        <h2 key={i} className="mb-3 mt-10 text-2xl font-bold leading-snug text-svarati-teal">
          {b.text}
        </h2>
      );
    if (b.type === "ul")
      return (
        <ul key={i} className="my-5 list-disc space-y-2 pl-6 marker:text-svarati-lavender">
          {b.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    return (
      <p key={i} className="my-5">
        {b.text}
      </p>
    );
  });
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = edu.articles.find((a) => a.slug === slug);
  if (!article) notFound();

  // Artikel terkait: kategori sama dulu, lalu isi dengan yang lain, maksimal 3
  const others = edu.articles.filter((a) => a.id !== article.id);
  const related = [
    ...others.filter((a) => a.category === article.category),
    ...others.filter((a) => a.category !== article.category),
  ].slice(0, 3);

  const blocks = article.body ?? [{ type: "p", text: article.summary }];

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
            <Image src="/images/logo.png" alt="" width={44} height={44} className="object-contain" />
          </Link>

          <div aria-hidden="true" />
        </div>

        {/* Header artikel */}
        <header className="mx-auto w-full max-w-3xl px-5 pt-12 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-svarati-lavender-dark">
            {categoryLabel[article.category]}
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-svarati-teal md:text-4xl lg:text-5xl">
            {article.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-svarati-teal/60 md:text-lg">
            {article.summary}
          </p>

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
                {article.date} • {article.readTime}
              </p>
            </div>
          </div>
        </header>

        {/* Gambar utama: sedikit lebih lebar dari kolom teks */}
        <div className="mx-auto mt-12 w-full max-w-4xl px-5 sm:px-6">
         {/* Gambar utama: tampil utuh sesuai rasio aslinya */}
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
        </div>

        {/* Isi artikel */}
        <div className="mx-auto w-full max-w-3xl px-5 pb-16 pt-6 text-base leading-8 text-svarati-teal/90 sm:px-6 md:text-lg">
          <Body blocks={blocks} />

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
      <section className="mt-16 px-2 sm:px-3">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="mb-5 text-2xl font-bold text-svarati-teal">{edu.detail.related}</h2>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => (
              <li key={a.id}>
                <ArticleCard article={a} categoryName={categoryLabel[a.category]} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ArticleActions title={article.title} initialLikes={article.likes ?? 0} />
    </main>
  );
}