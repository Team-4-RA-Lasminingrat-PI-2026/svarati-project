import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import Badge from "@/components/Badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter } from "@/components/Card";
import { pemulihanContent as p } from "@/content/labels";

export default function RuangPemulihan() {
  return (
    <section
      id="ruang-pemulihan"
      className="overflow-hidden px-4 pb-12 pt-10 sm:px-6 lg:pb-16 lg:pt-12 bg-svarati-coral-soft"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-6">
        {/* KIRI: pohon + kartu melayang */}
        <div className="relative mx-auto w-full max-w-2xl">
          {/* Tinggi dibatasi mengikuti layar agar tidak melebihi 1 viewport */}
          <div className="relative mx-auto aspect-square w-full max-w-md lg:h-[62vh] lg:max-h-[520px] lg:w-full lg:max-w-none lg:aspect-auto">
            <Image
              src={p.gambar.src}
              alt={p.gambar.alt}
              fill
              sizes="(min-width: 1024px) 700px, 90vw"
              className="object-contain lg:scale-110"
            />

            {/* Desktop: kartu melayang di atas pohon */}
            <ul className="hidden lg:block">
              {p.pesan.map((m) => (
                <li key={m.id} className={`absolute w-60 ${m.posisi}`}>
                  <PesanCard m={m} label={p.labelDukungan} />
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile/tablet: kartu tersusun di bawah pohon */}
          <ul className="mt-4 flex flex-col gap-3 lg:hidden">
            {p.pesan.map((m) => (
              <li key={m.id}>
                <PesanCard m={m} label={p.labelDukungan} />
              </li>
            ))}
          </ul>
        </div>

        {/* KANAN: teks */}
        <div className="flex flex-col items-start lg:pl-8">
          <Badge variant="coral" styleType="white" className="mb-4 gap-1.5 normal-case tracking-normal">
            <Heart className="size-3.5" aria-hidden="true" />
            {p.badge}
          </Badge>

          <h2 className="text-3xl font-bold leading-tight text-svarati-teal md:text-4xl lg:text-[2.6rem]">
            {p.judul}
          </h2>

          <p className="mt-4 max-w-lg text-sm leading-relaxed text-svarati-coral-dark/80 md:text-base">
            {p.deskripsi}
          </p>

          <Button
            render={<Link href={p.cta.href} />}
            nativeButton={false}
            variant="primary"
            size="lg"
            className="mt-6 rounded-full px-7 font-bold"
            icon={<ArrowRight size={16} aria-hidden="true" />}
            iconPosition="right"
          >
            {p.cta.label}
          </Button>
        </div>
      </div>
    </section>
  );
}

function PesanCard({ m, label }) {
  return (
    <Card variant="white" size="sm" className="rounded-2xl p-3.5 shadow-lg">
      <CardDescription className="text-xs italic leading-relaxed text-svarati-lavender-dark">
        “{m.teks}”
      </CardDescription>
      <CardFooter className="mt-2.5 pt-2 text-[11px]">
        <span className="text-svarati-lavender-dark">{m.penulis}</span>
        <span className="flex items-center gap-1 font-bold text-svarati-coral-dark">
          <Heart className="size-3 fill-current" aria-hidden="true" />
          {m.dukungan} {label}
        </span>
      </CardFooter>
    </Card>
  );
}