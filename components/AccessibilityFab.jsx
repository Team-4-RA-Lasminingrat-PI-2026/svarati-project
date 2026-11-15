"use client";

import { useAccessibility } from "@/context/AccessibilityContext";
import { AKSESIBILITAS as T } from "@/content/labels";

// Ikon aksesibilitas khas Svarati: sosok dengan tangan terbuka ke atas, kepala warna coral
export function IkonAksesibilitas({ className = "size-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="4.6" r="2.3" className="fill-svarati-coral stroke-none" />
      <path d="M4.5 8.2c2.6 2 5 2.8 7.5 2.8s4.9-.8 7.5-2.8" />
      <path d="M12 11v4.2" />
      <path d="M12 15.2 8.6 20.5M12 15.2l3.4 5.3" />
    </svg>
  );
}

// Tombol melayang di pojok kiri bawah untuk membuka Pengaturan Aksesibilitas
export default function AccessibilityFab() {
  const { openModal } = useAccessibility();

  return (
    <button
      type="button"
      onClick={openModal}
      aria-haspopup="dialog"
      aria-label={T.judul}
      title={T.judul}
      className="group fixed bottom-4 left-4 z-50 flex size-14 cursor-pointer items-center justify-center rounded-full bg-svarati-teal text-white shadow-lg ring-4 ring-svarati-lavender-light transition hover:scale-105 hover:bg-svarati-teal-light focus-visible:outline-none focus-visible:ring-svarati-lavender-dark sm:bottom-6 sm:left-6"
    >
      <span className="flex size-11 items-center justify-center rounded-full border-2 border-white/80">
        <IkonAksesibilitas className="size-7" />
      </span>
    </button>
  );
}
