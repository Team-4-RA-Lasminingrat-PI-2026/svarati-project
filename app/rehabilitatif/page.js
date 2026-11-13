"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Wind, HeartHandshake } from "lucide-react";
import Badge from "@/components/Badge";
import {
  Card,
  CardIcon,
  CardTitle,
  CardDescription,
  CardLink,
} from "@/components/Card";
import { pemulihanContent as t } from "@/content/labels";

// Ikon per fitur, dicocokkan dengan id di labels.
const IKON = {
  "jurnal-pemulihan": BookOpen,
  "latihan-tenang": Wind,
  "pohon-harapan": HeartHandshake,
};

// Warna teks per varian. Class ditulis lengkap agar terbaca oleh Tailwind.
const TEMA = {
  lavender: { ikon: "text-svarati-lavender-dark", deskripsi: "text-svarati-lavender-dark", link: "text-svarati-lavender-dark" },
  teal: { ikon: "text-svarati-teal", deskripsi: "text-svarati-teal/80", link: "text-svarati-teal" },
  coral: { ikon: "text-svarati-coral-dark", deskripsi: "text-svarati-coral-dark", link: "text-svarati-coral-dark" },
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
  const [tampil, setTampil] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => setTampil(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const muncul = (delay) =>
    `transition-all duration-700 ease-out ${delay} ${
      tampil ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
    }`;

  const munculGambar = (delay) =>
    `transition-all duration-1000 ease-out ${delay} ${
      tampil ? "translate-x-0 scale-100 opacity-100" : "translate-x-8 scale-95 opacity-0"
    }`;

  return (
    <div className="relative scroll-mt-28 px-2 pb-8 pt-28 sm:px-3 sm:pb-12 sm:pt-22">
      <div className="mx-auto max-w-6xl">
        {/* Banner Utama */}
        <Card
          variant="coral"
          size="lg"
          className={`relative mb-8 overflow-hidden border-0 from-svarati-coral-soft via-white to-svarati-coral/20 shadow-sm sm:p-10 ${muncul("")}`}
        >
          {/* Lingkaran dekoratif */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div
              className={`absolute -right-16 -top-24 size-56 rounded-full bg-svarati-coral/15 sm:size-72 ${munculGambar("delay-300")}`}
            />
            <div
              className={`absolute -bottom-20 right-16 size-40 rounded-full bg-svarati-coral/25 sm:right-24 sm:size-56 ${munculGambar("delay-500")}`}
            />
          </div>

          <div className="relative z-10 max-w-xl">
            <Badge variant="coral" styleType="soft" className={muncul("delay-150")}>
              {t.badge}
            </Badge>

            <h1 className={`mb-3 mt-4 text-3xl font-extrabold tracking-tight text-svarati-teal sm:text-4xl ${muncul("delay-300")}`}>
              {t.judul}
            </h1>

            <p className={`text-base leading-relaxed text-svarati-coral-dark ${muncul("delay-500")}`}>
              {t.deskripsi}
            </p>
          </div>
        </Card>

        {/* Grid Opsi Fitur Pemulihan */}
        <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${muncul("delay-500")}`}>
          {t.fitur.map((item) => {
            const Ikon = IKON[item.id];
            const warna = TEMA[item.variant];

            return (
              <Card
                key={item.id}
                variant={item.variant}
                className="group flex h-full flex-col justify-between"
                interactive
              >
                <div>
                  <CardIcon>
                    <Ikon className={warna.ikon} />
                  </CardIcon>

                  <Badge variant={item.variant} styleType="soft" className="mb-3">
                    {item.badge}
                  </Badge>

                  <CardTitle>{item.title}</CardTitle>

                  <CardDescription className={warna.deskripsi}>
                    {renderDeskripsi(item.description)}
                  </CardDescription>
                </div>

                <div>
                  <Link href={item.href}>
                    <CardLink className={warna.link}>{item.cta}</CardLink>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}