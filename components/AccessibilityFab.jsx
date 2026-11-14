"use client";

import { useEffect, useRef, useState } from "react";
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

// Posisi & ukuran tombol (px). Sejajar dengan penanda Next.js di pojok kiri bawah: 20px dari kiri dan bawah.
const JARAK = 20;
const UKURAN = 44;
const BINGKAI = 4; // ring di sekeliling tombol

// Apakah ada tulisan di bawah area tombol (saat tombol keluar penuh)?
function adaTulisanDiBawah(tombol) {
  const vh = window.innerHeight;
  const kiri = JARAK - BINGKAI;
  const kanan = JARAK + UKURAN + BINGKAI;
  const atas = vh - JARAK - UKURAN - BINGKAI;
  const bawah = vh - JARAK + BINGKAI;
  for (let x = kiri; x <= kanan; x += 6) {
    for (let y = atas; y <= bawah; y += 6) {
      // Beberapa elemen teratas di titik ini (selain tombol sendiri dan penanda Next.js).
      // Lebih dari satu, karena tulisan bisa berada di bawah lapisan transparan (misalnya link selebar kartu).
      const tumpukan = document
        .elementsFromPoint(x, y)
        .filter((e) => !tombol.contains(e) && e.tagName !== "NEXTJS-PORTAL" && e !== document.documentElement && e !== document.body)
        .slice(0, 4);
      for (const el of tumpukan) {
        for (const node of el.childNodes) {
          if (node.nodeType !== Node.TEXT_NODE || !node.textContent.trim()) continue;
          const range = document.createRange();
          range.selectNodeContents(node);
          for (const r of range.getClientRects()) {
            if (x >= r.left - 2 && x <= r.right + 2 && y >= r.top - 2 && y <= r.bottom + 2) return true;
          }
        }
      }
    }
  }
  return false;
}

// Tombol melayang di pojok kiri bawah untuk membuka Pengaturan Aksesibilitas.
// Kalau ada tulisan di bawahnya, tombol menyingkir ke tepi kiri (tinggal pegangan tipis)
// supaya tidak menutupi tulisan. Disorot / difokus / diklik = keluar lagi.
export default function AccessibilityFab() {
  const { openModal } = useAccessibility();
  const ref = useRef(null);
  const [menyingkir, setMenyingkir] = useState(false);

  useEffect(() => {
    let frame = 0;
    const cek = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (ref.current) setMenyingkir(adaTulisanDiBawah(ref.current));
      });
    };
    cek();
    window.addEventListener("scroll", cek, { passive: true });
    window.addEventListener("resize", cek);
    // Isi halaman bisa berubah tanpa scroll (pindah halaman, data selesai dimuat)
    const interval = setInterval(cek, 1000);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", cek);
      window.removeEventListener("resize", cek);
      clearInterval(interval);
    };
  }, []);

  return (
    <button
      ref={ref}
      type="button"
      onClick={openModal}
      aria-haspopup="dialog"
      aria-label={T.judul}
      title={T.judul}
      data-menyingkir={menyingkir || undefined}
      style={{ "--jarak": `${JARAK}px`, "--sembunyi": `${-(UKURAN - 10)}px` }}
      className="group fixed bottom-(--jarak) left-(--jarak) z-50 flex size-11 cursor-pointer items-center justify-center rounded-full bg-svarati-teal text-white shadow-lg ring-4 ring-svarati-lavender-light transition-all duration-300 hover:bg-svarati-teal-light focus-visible:outline-none focus-visible:ring-svarati-lavender-dark data-menyingkir:left-(--sembunyi) data-menyingkir:rounded-l-none data-menyingkir:ring-0 data-menyingkir:hover:left-(--jarak) data-menyingkir:hover:rounded-l-full data-menyingkir:hover:ring-4 data-menyingkir:focus-visible:left-(--jarak) data-menyingkir:focus-visible:rounded-l-full data-menyingkir:focus-visible:ring-4"
    >
      <span className="flex size-9 items-center justify-center rounded-full border-2 border-white/80">
        <IkonAksesibilitas className="size-6" />
      </span>
    </button>
  );
}
