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

// Tombol melayang di pojok kiri bawah untuk membuka Pengaturan Aksesibilitas.
// HP: 36px di 6px dari pojok. >= 768px: 44px di 20px dari pojok (sejajar penanda Next.js).
// Isi halaman diberi jarak tepi (class "tepi-aman" di globals.css) supaya tombol ini tidak menutupi tulisan.
export default function AccessibilityFab() {
  const { openModal } = useAccessibility();

  return (
    <button
      type="button"
      onClick={openModal}
      aria-haspopup="dialog"
      aria-label={T.judul}
      title={T.judul}
      className="fixed bottom-1.5 left-1.5 z-50 flex size-9 cursor-pointer items-center justify-center rounded-full bg-svarati-teal text-white shadow-lg ring-2 ring-svarati-lavender-light transition hover:scale-105 hover:bg-svarati-teal-light focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-svarati-lavender-dark md:bottom-5 md:left-5 md:size-11 md:ring-4"
    >
      <span className="flex size-7 items-center justify-center rounded-full border-2 border-white/80 md:size-9">
        <IkonAksesibilitas className="size-5 md:size-6" />
      </span>
    </button>
  );
}
