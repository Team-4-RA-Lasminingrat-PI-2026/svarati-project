"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { svaratiAiContent as ai } from "@/content/labels";

const F = ai.fab;

// Tombol melayang menuju Svarati AI, duduk tepat di atas tombol aksesibilitas.
// Ukuran mengikuti AccessibilityFab (HP: 36px di 6px dari pojok, >= 768px: 44px di 20px),
// jadi titik tengah kedua tombol sejajar: HP 44px di left-0.5, desktop 56px di left-3.5.
// Isi halaman sudah diberi jarak tepi lewat class "tepi-aman" di globals.css.
export default function SvaratiAiFab() {
  const pathname = usePathname();

  // Tidak perlu tampil kalau pengguna sudah berada di halaman Svarati AI
  if (pathname === ai.cta.href || pathname.startsWith(`${ai.cta.href}/`)) {
    return null;
  }

  return (
    // Pembungkus ikut melebar saat label muncul, jadi klik hanya aktif di tombolnya
    <div className="group pointer-events-none fixed bottom-12 left-0.5 z-50 flex items-center md:bottom-19 md:left-3.5">
      <Link
        href={ai.cta.href}
        aria-label={F.label}
        title={F.label}
        className="pointer-events-auto flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-lg ring-2 ring-svarati-lavender-light transition hover:scale-105 hover:ring-svarati-lavender focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-svarati-lavender-dark md:size-14 md:ring-4"
      >
        <Image
          src={F.gambar.src}
          alt={F.gambar.alt}
          width={112}
          height={112}
          className="size-full object-cover"
        />
      </Link>

      {/* Label kecil saat disentuh kursor atau fokus keyboard. Hanya hiasan: nama tombol
          sudah dibacakan pembaca layar lewat aria-label di atas. */}
      <span
        aria-hidden="true"
        className="ml-2 hidden -translate-x-1 whitespace-nowrap rounded-full bg-svarati-teal px-3 py-1.5 text-xs font-bold text-white opacity-0 shadow-md transition duration-200 group-focus-within:translate-x-0 group-focus-within:opacity-100 group-hover:translate-x-0 group-hover:opacity-100 md:block"
      >
        {F.label}
      </span>
    </div>
  );
}
