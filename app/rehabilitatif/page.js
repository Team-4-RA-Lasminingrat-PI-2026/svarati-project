"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sprout } from "lucide-react";
import { pemulihanContent as t } from "@/content/labels";

// Ikon padat buatan sendiri. Warnanya ikut text-* dari pemanggil,
// garis putih di atasnya dipakai sebagai detail.
function IkonJurnal({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
      <rect x="4.5" y="2.5" width="15" height="19" rx="3" fill="currentColor" />
      <path d="M9 8h6.5M9 11.5h6.5M9 15h4" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M7.2 2.5v19" stroke="#fff" strokeOpacity=".35" strokeWidth="1" />
    </svg>
  );
}

function IkonDaun({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
      <path
        d="M20.5 3.5C11 3.5 4.5 7.5 4.5 14.5c0 2.3.7 4.1 1.8 5.3 1.4-5 5-8.8 10.2-11.3-4 2.6-6.9 6.3-8 11.9 1 .4 2.2.6 3.5.6 6.5 0 8.5-6.5 8.5-17.5z"
        fill="currentColor"
      />
    </svg>
  );
}

function IkonTanganHati({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
      <path
        d="M12 13.4 8.3 9.9C6.6 8.3 7.5 5.2 9.9 5.2c.9 0 1.6.4 2.1 1.1.5-.7 1.2-1.1 2.1-1.1 2.4 0 3.3 3.1 1.6 4.7z"
        fill="currentColor"
      />
      <path
        d="M2.6 12.9c.6-.6 1.5-.6 2.1-.1L7.8 15.6H13c1 0 1.7.7 1.7 1.6 0 .2 0 .4-.1.5l4.3-2.3c.9-.5 2-.1 2.3.9.2.7-.1 1.4-.7 1.8l-5.9 3.5c-.6.4-1.3.6-2.1.6H7.4c-.9 0-1.7-.3-2.3-.9L2.6 15c-.6-.6-.6-1.5 0-2.1z"
        fill="currentColor"
      />
      <path d="M9.4 18.8h3.6" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

// Ikon per fitur, dicocokkan dengan id di labels.
const IKON = {
  "jurnal-pemulihan": IkonJurnal,
  "latihan-tenang": IkonDaun,
  "pohon-harapan": IkonTanganHati,
};

// Semua teks memakai tinta netral svarati-teal supaya tidak senada dengan
// latar kartunya. Warna khas tiap pilar dipakai di ikon dan tautan saja.
// Class ditulis lengkap agar terbaca oleh Tailwind.
const TEKS_JUDUL = "text-svarati-teal";
const TEKS_LEMBUT = "text-svarati-teal/80";

const TEMA = {
  lavender: {
    kartu: "bg-svarati-lavender/15 hover:border-svarati-lavender-light",
    aksen: "text-svarati-lavender-dark",
  },
  teal: {
    kartu: "bg-svarati-teal-soft hover:border-svarati-teal/25",
    aksen: "text-svarati-teal",
  },
  coral: {
    kartu: "bg-svarati-coral-soft hover:border-svarati-coral/30",
    aksen: "text-svarati-coral-dark",
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

export default function PemulihanPage() {
  // Mulai dari paling atas
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative scroll-mt-28 pb-10 pt-24">
      <div className="mx-auto max-w-6xl">
        {/* Banner Utama. Dibuat ringkas supaya banner dan ketiga kartu
            muat dalam satu layar tanpa perlu menggulir. */}
        <section className="relative mb-5 overflow-hidden rounded-3xl border border-svarati-coral/20 bg-svarati-coral-soft py-7 sm:px-10 sm:py-9">
          {/* Lingkaran dekoratif */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -right-24 -top-28 size-48 rounded-full bg-svarati-coral/20 sm:size-64" />
            <div className="absolute -bottom-24 right-0 size-40 rounded-full bg-svarati-coral/25 sm:right-12 sm:size-56" />
          </div>

          <div className="relative z-10 max-w-2xl lg:max-w-4xl">
            <p className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-svarati-coral-dark">
              <Sprout className="size-4.5" aria-hidden="true" />
              {t.badge}
            </p>

            <h1 className="mb-5 text-2xl font-bold leading-[1.18] tracking-tight text-svarati-teal sm:text-3xl lg:text-4xl">
              {t.judul}
            </h1>

            <p className="max-w-xl text-sm leading-relaxed text-svarati-coral-dark sm:text-base lg:max-w-2xl">
              {t.deskripsi}
            </p>
          </div>
        </section>

        {/* Pilihan fitur pemulihan: berjejer ke samping, bukan bertumpuk,
            supaya ketiganya terlihat sekaligus */}
        <div className="grid gap-4 md:grid-cols-3">
          {t.fitur.map((item) => {
            const Ikon = IKON[item.id];
            const warna = TEMA[item.variant];

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`group flex h-full flex-col rounded-3xl border border-transparent px-6 py-6 transition-colors ${warna.kartu}`}
              >
                <div className="mb-3 flex items-center gap-3">
                  <Ikon className={`size-7 shrink-0 ${warna.aksen}`} />
                  <span className={`text-[13.5px] font-semibold leading-none ${TEKS_LEMBUT}`}>
                    {item.badge}
                  </span>
                </div>

                <h2 className={`mb-1.5 text-xl font-semibold leading-snug ${TEKS_JUDUL}`}>
                  {item.title}
                </h2>

                {/* flex-1 mendorong tautan ke dasar kartu, jadi ketiganya sejajar */}
                <p className={`flex-1 text-sm leading-relaxed ${TEKS_LEMBUT}`}>
                  {renderDeskripsi(item.description)}
                </p>

                <span
                  className={`mt-5 inline-flex items-center gap-2 whitespace-nowrap text-[15px] font-bold ${warna.aksen}`}
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

      </div>
    </div>
  );
}
