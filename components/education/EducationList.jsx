"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import ArticleCard from "@/components/education/ArticleCard";
import Tabs from "@/components/Tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ScrollRow from "@/components/education/ScrollRow";
import { educationContent as edu } from "@/content/labels";

const DEFAULT_TAB = edu.tabs[0].id;
const ANCHOR = "daftar-artikel";

// Nomor halaman dengan titik-titik, mis. [1, "...", 4, 5, 6, "...", 12]
function pageItems(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total, current - 1, current, current + 1]);
  const nums = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out = [];
  nums.forEach((n, i) => {
    if (i > 0 && n - nums[i - 1] > 1) out.push("...");
    out.push(n);
  });
  return out;
}

export default function EducationList({ articles, meta, tabs, topic, q }) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(q);
  const firstRun = useRef(true);

  const activeTab = topic || DEFAULT_TAB;
  const isFiltered = Boolean(topic) || Boolean(q);

  const buildHref = ({ topic: t = topic, q: s = q, page = 1 } = {}) => {
    const p = new URLSearchParams();
    if (t) p.set("topic", t);
    if (s) p.set("q", s);
    if (page > 1) p.set("page", String(page));
    const qs = p.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  // Pencarian: tunggu pengguna berhenti mengetik, lalu ubah URL
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const next = query.trim();
    if (next === q) return;
    const t = setTimeout(() => {
      router.replace(buildHref({ q: next, page: 1 }), { scroll: false });
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const changeTab = (id) => {
    router.push(buildHref({ topic: id === DEFAULT_TAB ? "" : id, page: 1 }), {
      scroll: false,
    });
  };

  const clearFilters = () => {
    setQuery("");
    router.push(pathname, { scroll: false });
  };

  const { page, total, total_pages } = meta;

  return (
    <section id={ANCHOR} className="scroll-mt-24 px-4 pb-6 pt-8 sm:px-6">
      <div className="mx-auto w-full max-w-6xl">
        {/* Pencarian + hapus filter */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-svarati-lavender-dark"
              aria-hidden="true"
            />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={edu.searchPlaceholder}
              aria-label={edu.searchLabel}
              className="h-11 rounded-full border-svarati-lavender-border bg-white pl-10 pr-4 text-sm text-svarati-teal"
            />
          </div>

          {isFiltered && (
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={clearFilters}
              className="rounded-full px-6 font-bold"
            >
              {edu.clearLabel}
            </Button>
          )}
        </div>

        {/* Tab kategori */}
        <div className="mt-4" role="group" aria-label={edu.filterLabel}>
          <ScrollRow>
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              onChange={changeTab}
              variant="lavender"
              boxed={false}
            />
          </ScrollRow>
        </div>

        {/* Hasil */}
        <p aria-live="polite" className="mt-5 text-sm text-svarati-lavender-dark">
          {total} {edu.resultLabel}
        </p>

        <div className="mt-4">
          {articles.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <p className="text-sm text-svarati-lavender-dark">{edu.empty}</p>
              <Button type="button" variant="ghost" onClick={clearFilters} className="rounded-full px-5">
                {edu.clearLabel}
              </Button>
            </div>
          ) : (
            <ul className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 sm:gap-5">
              {articles.map((a) => (
                <li key={a.id}>
                  <ArticleCard article={a} categoryName={a.categoryLabel} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Nomor halaman */}
        {total_pages > 1 && (
          <nav
            aria-label="Halaman artikel"
            className="mt-15 flex flex-wrap items-center justify-center gap-2"
          >
            {page > 1 ? (
              <Link
                href={`${buildHref({ page: page - 1 })}#${ANCHOR}`}
                aria-label="Halaman sebelumnya"
                className="flex size-10 items-center justify-center rounded-full bg-white text-svarati-lavender-dark transition hover:bg-svarati-lavender-light"
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
              </Link>
            ) : null}

            {pageItems(page, total_pages).map((item, i) =>
              item === "..." ? (
                <span key={`gap-${i}`} aria-hidden="true" className="px-1 text-svarati-lavender-dark">
                  …
                </span>
              ) : (
                <Link
                  key={item}
                  href={`${buildHref({ page: item })}#${ANCHOR}`}
                  aria-label={`Halaman ${item}`}
                  aria-current={item === page ? "page" : undefined}
                  className={`flex size-10 items-center justify-center rounded-full text-sm font-semibold transition ${
                    item === page
                      ? "bg-svarati-lavender-dark text-white"
                      : "bg-white text-svarati-lavender-dark hover:bg-svarati-lavender-light"
                  }`}
                >
                  {item}
                </Link>
              )
            )}

            {page < total_pages ? (
              <Link
                href={`${buildHref({ page: page + 1 })}#${ANCHOR}`}
                aria-label="Halaman berikutnya"
                className="flex size-10 items-center justify-center rounded-full bg-white text-svarati-lavender-dark transition hover:bg-svarati-lavender-light"
              >
                <ChevronRight className="size-4" aria-hidden="true" />
              </Link>
            ) : null}
          </nav>
        )}
      </div>
    </section>
  );
}