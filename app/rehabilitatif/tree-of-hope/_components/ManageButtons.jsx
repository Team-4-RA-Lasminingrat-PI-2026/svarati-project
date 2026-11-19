"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { treeOfHopeContent as t } from "@/content/labels";

// Tombol ubah/hapus untuk pesan milik pengguna yang masih dalam batas waktu.
// until = m.editableUntil (null = bukan pesan milik pengguna atau sudah lewat).
// compact = hanya ikon (kartu desktop); tanpa compact = ikon + teks (mobile).
export default function ManageButtons({ until, onEdit, onDelete, compact = false, className = "" }) {
  // Menyimpan batas waktu yang sudah lewat, jadi otomatis menyala lagi kalau `until` berubah
  const [expiredFor, setExpiredFor] = useState(null);

  useEffect(() => {
    if (!until) return;
    const ms = new Date(until).getTime() - Date.now();
    const timer = setTimeout(() => setExpiredFor(until), Math.min(Math.max(ms, 0), 2_000_000_000));
    return () => clearTimeout(timer);
  }, [until]);

  if (!until || expiredFor === until) return null;

  const base =
    "inline-flex cursor-pointer items-center gap-[0.35em] rounded-md border border-svarati-lavender-border/60 bg-white font-semibold transition-colors hover:bg-svarati-lavender-light";
  const size = compact ? "p-[0.3em]" : "px-3 py-1.5 text-sm";
  const icon = compact ? "size-[1.25em]" : "size-4";

  return (
    <div className={`flex items-center gap-[0.4em] ${className}`}>
      <button
        type="button"
        onClick={onEdit}
        title={t.manage.editButton}
        aria-label={t.manage.editButton}
        className={`${base} ${size} text-svarati-lavender-dark`}
      >
        <Pencil className={icon} aria-hidden="true" />
        {!compact && t.manage.editButton}
      </button>
      <button
        type="button"
        onClick={onDelete}
        title={t.manage.deleteButton}
        aria-label={t.manage.deleteButton}
        className={`${base} ${size} text-svarati-danger`}
      >
        <Trash2 className={icon} aria-hidden="true" />
        {!compact && t.manage.deleteButton}
      </button>
    </div>
  );
}