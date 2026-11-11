"use client";

import { treeOfHopeContent as t } from "@/content/labels";

// page bernilai 0 untuk halaman terbaru. "previous" = lebih baru, "next" = lebih lama.
export default function Pager({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const button =
    "rounded-full border border-input bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <nav className="flex items-center justify-center gap-3" aria-label={t.pager.page(page + 1, totalPages)}>
      <button type="button" className={button} disabled={page === 0} onClick={() => onChange(page - 1)}>
        {t.pager.previous}
      </button>
      <span className="text-sm text-muted-foreground" aria-live="polite">
        {t.pager.page(page + 1, totalPages)}
      </span>
      <button
        type="button"
        className={button}
        disabled={page >= totalPages - 1}
        onClick={() => onChange(page + 1)}
      >
        {t.pager.next}
      </button>
    </nav>
  );
}
