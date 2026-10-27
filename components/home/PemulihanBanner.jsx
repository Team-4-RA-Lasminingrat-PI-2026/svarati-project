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
      className="overflow-hidden bg-svarati-coral-soft px-4 pb-12 pt-10 sm:px-6 lg:pb-16 lg:pt-12"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-6">
        {/* KIRI: pohon + kartu melayang (mobile dan desktop) */}
        <div className="relative order-2 mx-auto w-full max-w-2xl lg:order-1">          
          <div className="relative mx-auto aspect-4/5 w-full max-w-md sm:aspect-[5/4] sm:max-w-2xl lg:aspect-auto lg:h-[62vh] lg:max-h-130 lg:max-w-none">
            <Image
              src={p.gambar.src}
              alt={p.gambar.alt}
              fill
              sizes="(min-width: 1024px) 700px, 90vw"
              className="object-contain lg:scale-110"
            />

            <ul>
              {p.pesan.map((m) => (
                <li
                  key={m.id}
                  className={`absolute w-[62%] max-w-60 sm:w-64 lg:w-60 ${m.posisi}`}
                >
                  <PesanCard m={m} label={p.labelDukungan} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* KANAN: teks */}
          <div className="order-1 flex flex-col items-start lg:order-2 lg:pl-8">          <Badge
            variant="coral"
            styleType="white"
            className="mb-4 gap-1.5 normal-case tracking-normal"
          >
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
    <Card
      variant="white"
      size="sm"
      className="rounded-xl p-2.5 shadow-lg sm:rounded-2xl sm:p-3.5"
    >
      <CardDescription className="line-clamp-4 text-[10px] italic leading-snug text-svarati-lavender-dark sm:line-clamp-none sm:text-xs sm:leading-relaxed">
        “{m.teks}”
      </CardDescription>
      <CardFooter className="mt-1.5 gap-2 pt-1.5 text-[9px] sm:mt-2.5 sm:pt-2 sm:text-[11px]">
        <span className="truncate text-svarati-lavender-dark">{m.penulis}</span>
        <span className="flex shrink-0 items-center gap-1 font-bold text-svarati-coral-dark">
          <Heart className="size-2.5 fill-current sm:size-3" aria-hidden="true" />
          {m.dukungan}
          <span className="hidden sm:inline">{label}</span>
        </span>
      </CardFooter>
    </Card>
  );
}