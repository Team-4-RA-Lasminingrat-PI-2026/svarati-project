"use client";

import { useEffect } from "react";

const sizes = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
};

/**
 * Modal dengan layout flex column.
 *
 * - Default: children dibungkus area scroll ber-padding (dipakai ReadMessageModal).
 * - bare: children dirender apa adanya, jadi children bebas mengatur
 *   area scroll dan footer sendiri (dipakai MessageFormModal).
 */
export default function Modal({ open, onClose, size = "md", label, bare = false, children }) {
  // Kunci scroll halaman di belakang dan tutup dengan Esc selama modal terbuka
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      // z-[100]: pastikan di atas widget melayang (mis. chatbot). Sesuaikan jika widget lebih tinggi.
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={`flex max-h-[90dvh] w-full ${sizes[size]} flex-col overflow-hidden rounded-lg bg-white`}
        onClick={(e) => e.stopPropagation()}
      >
        {bare ? (
          children
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6">{children}</div>
        )}
      </div>
    </div>
  );
}