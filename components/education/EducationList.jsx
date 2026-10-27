"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import ArticleCard from "@/components/education/ArticleCard";
import Tabs from "@/components/Tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { educationContent as edu, categoryLabel } from "@/content/labels";

const DEFAULT_TAB = edu.tabs[0].id;

export default function EducationList({ articles }) {
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB);
  const [query, setQuery] = useState("");

  const keyword = query.trim().toLowerCase();
  const filtered = articles.filter((a) => {
    const matchTab = activeTab === DEFAULT_TAB || a.category === activeTab;
    const matchQuery =
      !keyword ||
      a.title.toLowerCase().includes(keyword) ||
      a.summary.toLowerCase().includes(keyword);
    return matchTab && matchQuery;
  });

  const isFiltered = activeTab !== DEFAULT_TAB || keyword !== "";
  const clearFilters = () => {
    setActiveTab(DEFAULT_TAB);
    setQuery("");
  };

  return (
    <section className="px-4 pb-6 pt-8 sm:px-6">
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
          <Tabs
            tabs={edu.tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
            variant="lavender"
            boxed={false}
          />
        </div>

        {/* Hasil */}
        <p aria-live="polite" className="mt-5 text-sm text-svarati-lavender-dark">
          {filtered.length} {edu.resultLabel}
        </p>

        <div className="mt-4">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <p className="text-sm text-svarati-lavender-dark">{edu.empty}</p>
              <Button type="button" variant="ghost" onClick={clearFilters} className="rounded-full px-5">
                {edu.clearLabel}
              </Button>
            </div>
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((a) => (
                <li key={a.id}>
                  <ArticleCard article={a} categoryName={categoryLabel[a.category]} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}