"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { treeOfHopeContent as t } from "@/content/labels";

// page bernilai 0 untuk halaman terbaru. Kiri = lebih baru, kanan = lebih lama.
export default function Pager({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const button =
    "inline-flex size-8 items-center justify-center rounded-full border border-svarati-coral-dark/40 bg-card text-svarati-coral-dark transition-colors hover:bg-svarati-coral-soft disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-card";

  return (
    <nav className="flex items-center justify-center gap-2" aria-label={t.pager.page(page + 1, totalPages)}>
      <button
        type="button"
        className={button}
        aria-label="Halaman sebelumnya (lebih baru)"
        disabled={page === 0}
        onClick={() => onChange(page - 1)}
      >
        <ChevronLeft className="size-5" />
      </button>
      <span className="px-1 text-sm font-medium text-svarati-coral-dark" aria-live="polite">
        {t.pager.page(page + 1, totalPages)}
      </span>
      <button
        type="button"
        className={button}
        aria-label="Halaman berikutnya (lebih lama)"
        disabled={page >= totalPages - 1}
        onClick={() => onChange(page + 1)}
      >
        <ChevronRight className="size-5" />
      </button>
    </nav>
  );
}