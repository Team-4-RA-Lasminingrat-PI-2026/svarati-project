"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import ArticleCard from "@/app/preventif/components/ArticleCard";
import ArticleCardCompact from "@/app/preventif/components/ArticleCardCompact";
import Tabs from "@/components/Tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ScrollRow from "@/components/ScrollRow";
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

export default function EducationList({ articles, featured = [], meta, tabs, topic, q }) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(q);
  const firstRun = useRef(true);
  const tabsRef = useRef(null);

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

  // Saat halaman dibuka: geser baris kategori seperlunya sampai tab aktif terlihat.
  // Hanya sekali (saat mount): tidak menengahkan dan tidak menggeser saat user klik tab.
  useEffect(() => {
    const root = tabsRef.current;
    if (!root) return;
    const active = root.querySelector(
      '[aria-selected="true"], [aria-current="true"], [data-state="active"], [data-active="true"]'
    );
    const scroller = root.querySelector(".overflow-x-auto"); // wadah geser milik ScrollRow
    if (!active || !scroller) return;

    const a = active.getBoundingClientRect();
    const s = scroller.getBoundingClientRect();
    const gap = 16; // sisa ruang di tepi supaya tab tidak mepet

    if (a.right > s.right) scroller.scrollLeft += a.right - s.right + gap;
    else if (a.left < s.left) scroller.scrollLeft -= s.left - a.left + gap;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Simpan URL daftar terakhir supaya tombol X di halaman artikel bisa kembali ke sini
  useEffect(() => {
    try {
      sessionStorage.setItem("edu:last-list", buildHref({ page }));
    } catch {
      // sessionStorage tidak tersedia: abaikan
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, topic, q, page]);

  // Carousel hanya tampil jika ada artikel yang diberi flag is_featured
  const showFeatured = featured.length > 0 && page === 1 && !isFiltered;

  // Artikel yang sudah ada di carousel tidak diulang di list mobile
  const featuredIds = new Set(featured.map((a) => a.id));
  const rest = showFeatured ? articles.filter((a) => !featuredIds.has(a.id)) : articles;

  return (
    <section id={ANCHOR} className="scroll-mt-24 pb-6 pt-8">
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
        <div ref={tabsRef} className="mt-4" role="group" aria-label={edu.filterLabel}>
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
            <>
              {/* ===== Mobile (di bawah md) ===== */}
              <div className="md:hidden">
                {showFeatured && (
                  <section aria-label={edu.featuredLabel} className="mb-6">
                    <h2 className="mb-3 text-lg font-bold text-svarati-teal">
                      {edu.featuredLabel}
                    </h2>
                    {/* -mx-4 px-4: carousel menempel ke tepi layar, kartu pertama tetap sejajar konten */}
                    <ul className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {featured.map((a) => (
                        <li key={a.id} className="w-[78%] shrink-0 snap-start">
                          <ArticleCard article={a} categoryName={a.categoryLabel} />
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {showFeatured && rest.length > 0 && (
                  <h2 className="mb-1 text-lg font-bold text-svarati-teal">
                    {edu.moreLabel}
                  </h2>
                )}
                <ul className="divide-y divide-svarati-lavender-light">
                  {rest.map((a) => (
                    <li key={a.id}>
                      <ArticleCardCompact article={a} categoryName={a.categoryLabel} />
                    </li>
                  ))}
                </ul>
              </div>

              {/* ===== Tablet & desktop (md ke atas): grid seperti semula ===== */}
              <ul className="hidden gap-5 md:grid md:grid-cols-2 lg:grid-cols-3">
                {articles.map((a) => (
                  <li key={a.id}>
                    <ArticleCard article={a} categoryName={a.categoryLabel} />
                  </li>
                ))}
              </ul>
            </>
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