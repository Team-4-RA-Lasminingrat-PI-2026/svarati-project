"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, HeartHandshake, Sprout, Wind } from "lucide-react";
import Badge from "@/components/Badge";
import EmergencyModal from "@/components/modals/EmergencyModal";
import { pemulihanContent as t } from "@/content/labels";

// Ikon per fitur, dicocokkan dengan id di labels.
const IKON = {
  "jurnal-pemulihan": BookOpen,
  "latihan-tenang": Wind,
  "pohon-harapan": HeartHandshake,
};

// Warna per varian. Class ditulis lengkap agar terbaca oleh Tailwind.
const TEMA = {
  lavender: {
    kartu: "bg-svarati-lavender/15 hover:border-svarati-lavender-light",
    ikon: "text-svarati-lavender-dark",
    judul: "text-svarati-lavender-darker",
    teks: "text-svarati-lavender-dark",
  },
  teal: {
    kartu: "bg-svarati-teal-soft hover:border-svarati-teal/25",
    ikon: "text-svarati-teal",
    judul: "text-svarati-teal",
    teks: "text-svarati-teal/80",
  },
  coral: {
    kartu: "bg-svarati-coral-soft hover:border-svarati-coral/30",
    ikon: "text-svarati-coral",
    judul: "text-svarati-coral-dark",
    teks: "text-svarati-coral-dark/85",
  },
};

// Deskripsi bisa berupa string biasa atau potongan teks dengan bagian tebal.
function renderDeskripsi(deskripsi) {
  if (typeof deskripsi === "string") return deskripsi;
  return deskripsi.map((bagian, i) =>
    bagian.tebal ? (
      <b key={i}>
        <i>{bagian.teks}</i>
      </b>
    ) : (
      <span key={i}>{bagian.teks}</span>
    )
  );
}

// Judul dengan coretan lengkung di bagian akhir.
// Kalau bagian yang ditekankan tidak ditemukan, judul tampil apa adanya.
function JudulBanner({ judul, tekanan }) {
  const potong = tekanan ? judul.lastIndexOf(tekanan) : -1;
  if (potong < 0) return judul;

  return (
    <>
      {judul.slice(0, potong)}
      <span className="relative whitespace-nowrap">
        {judul.slice(potong)}
        <svg
          viewBox="0 0 200 14"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="absolute inset-x-0 -bottom-2 h-3.5 w-full text-svarati-coral"
        >
          <path
            d="M3 9c20-6 38 4 58-1s36-5 56 0 40 3 80-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </>
  );
}

export default function PemulihanPage() {
  const [daruratOpen, setDaruratOpen] = useState(false);

  // Mulai dari paling atas
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative scroll-mt-28 px-4 pb-12 pt-28 sm:pt-22">
      <div className="mx-auto max-w-5xl">
        {/* Banner Utama */}
        <section className="relative mb-10 overflow-hidden rounded-3xl border border-svarati-coral/20 bg-svarati-coral-soft px-7 py-9 sm:px-14 sm:py-14">
          {/* Lingkaran dekoratif */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -right-24 -top-32 size-52 rounded-full bg-svarati-coral/20 sm:size-80" />
            <div className="absolute -bottom-28 right-0 size-44 rounded-full bg-svarati-coral/25 sm:right-12 sm:size-72" />
          </div>

          <div className="relative z-10 max-w-xl">
            <p className="mb-3.5 flex items-center gap-2 text-sm font-semibold text-svarati-coral-dark">
              <Sprout className="size-4.5" aria-hidden="true" />
              {t.badge}
            </p>

            <h1 className="mb-5 text-3xl font-semibold leading-[1.18] tracking-tight text-svarati-teal sm:text-4xl lg:text-5xl">
              <JudulBanner judul={t.judul} tekanan={t.judulTekanan} />
            </h1>

            <p className="max-w-lg text-base leading-relaxed text-svarati-coral-dark sm:text-lg">
              {t.deskripsi}
            </p>
          </div>
        </section>

        {/* Pilihan fitur pemulihan */}
        <div className="grid gap-3.5">
          {t.fitur.map((item) => {
            const Ikon = IKON[item.id];
            const warna = TEMA[item.variant];

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`group grid gap-5 rounded-3xl border border-transparent px-6 py-6 transition-colors sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:gap-8 sm:px-8 ${warna.kartu}`}
              >
                <div>
                  <div className="mb-3 flex items-center gap-3">
                    <Ikon className={`size-7 shrink-0 ${warna.ikon}`} aria-hidden="true" />
                    <Badge
                      variant={item.variant}
                      styleType="white"
                      className="normal-case tracking-normal"
                    >
                      {item.badge}
                    </Badge>
                  </div>

                  <h2 className={`mb-1.5 text-xl font-semibold leading-snug sm:text-2xl ${warna.judul}`}>
                    {item.title}
                  </h2>

                  <p className={`max-w-2xl text-sm leading-relaxed sm:text-base ${warna.teks}`}>
                    {renderDeskripsi(item.description)}
                  </p>
                </div>

                <span
                  className={`inline-flex items-center gap-2 whitespace-nowrap text-base font-bold ${warna.judul}`}
                >
                  <span className="underline-offset-4 group-hover:underline">{item.cta}</span>
                  <ArrowRight
                    className="size-4.5 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            );
          })}
        </div>

        {/* Jalan pintas ke bantuan darurat */}
        <p className="mt-10 max-w-xl border-t border-dashed border-svarati-lavender-light pt-6 text-svarati-teal/70">
          {t.tanyaDarurat}{" "}
          <button
            type="button"
            onClick={() => setDaruratOpen(true)}
            className="cursor-pointer font-semibold text-svarati-danger underline underline-offset-4 transition hover:text-svarati-danger-darker"
          >
            {t.ctaDarurat}
          </button>
        </p>
      </div>

      <EmergencyModal open={daruratOpen} onClose={() => setDaruratOpen(false)} />
    </div>
  );
}
