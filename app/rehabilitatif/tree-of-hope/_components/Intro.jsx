import Link from "next/link";
import { treeOfHopeContent as t } from "@/content/labels";
import { ChevronLeftIcon } from "./icons";

export function BackLink() {
  return (
    <Link
      href={t.back.href}
      aria-label={t.back.aria}
      className="inline-flex items-center gap-1 rounded-full py-2 pr-3 font-semibold text-svarati-coral-dark hover:text-svarati-coral-darker hover:underline"
    >
      <ChevronLeftIcon />
      {t.back.label}
    </Link>
  );
}

export const INTRO_BADGE =
  "inline-block rounded-full bg-svarati-coral/20 px-4 py-1.5 text-sm font-semibold text-svarati-coral-darker/80";

export function Intro({ titleClassName = "text-4xl lg:text-5xl" }) {
  return (
    <>
      <span className={INTRO_BADGE}>{t.badge}</span>
      <h1 className={`mt-4 font-bold leading-tight text-svarati-coral-darker ${titleClassName}`}>{t.title}</h1>
      <p className="mt-4 text-lg leading-relaxed text-svarati-coral-darker">{t.description}</p>
    </>
  );
}