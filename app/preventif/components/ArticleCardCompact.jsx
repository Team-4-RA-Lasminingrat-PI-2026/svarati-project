import Image from "next/image";
import Link from "next/link";
import { educationContent as edu, categoryTheme } from "@/content/labels";

export default function ArticleCardCompact({ article, categoryName }) {
  const theme = categoryTheme[article.category] ?? categoryTheme.hak_perempuan;

  return (
    <Link
      href={`${edu.basePath}/${article.slug}`}
      className="group flex gap-3 rounded-2xl py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-svarati-lavender-dark"
    >
      <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-svarati-lavender-light">
        <Image src={article.image} alt="" fill sizes="96px" className="object-cover" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className={`text-xs font-semibold ${theme.avatarText}`}>{categoryName}</span>
        <h3 className="line-clamp-3 text-sm font-bold leading-snug text-svarati-teal">
          {article.title}
        </h3>
        <p className="mt-auto text-[11px] text-svarati-lavender-dark">
          {article.readTime} • {article.date}
        </p>
      </div>
    </Link>
  );
}