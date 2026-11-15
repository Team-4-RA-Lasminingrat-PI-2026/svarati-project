import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Badge from "@/components/Badge";
import { treeOfHopeContent as t } from "@/content/labels";

export const BACK_LINK_CLASS =
  "inline-flex items-center gap-1.5 rounded-full py-2 pr-3 text-sm font-semibold text-svarati-coral-dark hover:underline";
export const BACK_ICON_CLASS = "size-4";

// Tombol kembali ke halaman Pemulihan
export function BackLink() {
  return (
    <Link href={t.back.href} aria-label={t.back.aria} className={BACK_LINK_CLASS}>
      <ArrowLeft className={BACK_ICON_CLASS} aria-hidden="true" />
      {t.back.label}
    </Link>
  );
}

// Badge, judul, dan deskripsi (dipakai versi mobile)
export function Intro({ titleClassName = "text-4xl lg:text-5xl" }) {
  return (
    <>
      <Badge variant="coral" styleType="soft" className="mb-3">
        {t.badge}
      </Badge>
      <h1 className={`font-bold leading-tight text-svarati-teal ${titleClassName}`}>{t.title}</h1>
      <p className="mt-3 text-base leading-relaxed text-svarati-coral-dark">{t.description}</p>
    </>
  );
}