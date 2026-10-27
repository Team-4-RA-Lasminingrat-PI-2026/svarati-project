import Image from "next/image";
import Link from "next/link";
import Badge from "@/components/Badge";
import { Card, CardTitle } from "@/components/Card";
import { educationContent as edu, categoryTheme } from "@/content/labels";

const initials = (name) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

export default function ArticleCard({ article, categoryName }) {
  // Kategori yang belum terdaftar memakai tema lavender
  const theme = categoryTheme[article.category] ?? categoryTheme.rights;

  return (
    <Link
      href={`${edu.basePath}/${article.slug}`}
      className="group block h-full rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-svarati-lavender-dark"
    >
      <Card
        variant="solid"
        size="md"
        interactive
        className={`flex h-full flex-col p-0 ${theme.card}`}
      >
        <div className="relative aspect-[4/3] w-full shrink-0 bg-white/20">
          <Image
            src={article.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <Badge
            variant={theme.badge}
            styleType="white"
            className="absolute left-3 top-3 shadow-sm"
          >
            {categoryName}
          </Badge>
        </div>

        <div className="flex flex-1 flex-col gap-2.5 p-4">
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className={`flex size-6 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-bold ${theme.avatarText}`}
            >
              {initials(article.author)}
            </span>
            <span className="truncate text-xs text-white/85">
              {article.author} • {article.readTime}
            </span>
          </div>

          <CardTitle className="mb-0 line-clamp-2 text-base text-white">
            {article.title}
          </CardTitle>

          <p className="mt-auto text-[11px] text-white/70">{article.date}</p>
        </div>
      </Card>
    </Link>
  );
}