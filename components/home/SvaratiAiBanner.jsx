import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/Card";
import { svaratiAiContent as ai } from "@/content/labels";

// Gelembung chat padat dengan tiga titik dan ekor di kiri bawah.
// Warnanya ikut text-* dari pemanggil.
function IkonBubble({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M6.5 17.5h3.2L6.3 21.4a.55.55 0 0 1-.96-.37V17.5h1.16Z" />
      <rect x="2" y="3" width="20" height="14.5" rx="4.5" />
      <g fill="#fff">
        <circle cx="7.6" cy="10.25" r="1.55" />
        <circle cx="12" cy="10.25" r="1.55" />
        <circle cx="16.4" cy="10.25" r="1.55" />
      </g>
    </svg>
  );
}

export default function SvaratiAiBanner() {
  return (
    <section
      id="svarati-ai"
      className="mt-5 sm:mt-10 lg:mt-15 lebar-penuh overflow-hidden bg-svarati-lavender-light/50 px-4 pb-14 pt-10 sm:px-6 [--pad-x:1rem] sm:[--pad-x:1.5rem] lg:pb-16 lg:pt-12"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-8">
        {/* KIRI: Teks Utama */}
        <div className="flex flex-col items-start lg:pr-8">
          <p className="mb-3 text-sm font-bold text-svarati-lavender-dark">
            {ai.badge}
          </p>

          <h2 className="text-3xl font-bold leading-tight text-svarati-teal md:text-4xl lg:text-[2.6rem]">
            {ai.judul}
          </h2>

          <p className="mt-4 max-w-lg text-sm leading-relaxed text-svarati-lavender-dark md:text-base">
            {ai.deskripsi}
          </p>

          <Button
            render={<Link href={ai.cta.href} />}
            nativeButton={false}
            variant="secondary"
            size="lg"
            className="mt-6 rounded-full px-7 font-bold"
            icon={<ArrowRight size={16} aria-hidden="true" />}
            iconPosition="right"
          >
            {ai.cta.label}
          </Button>
        </div>

        {/* KANAN: Maskot Robot + Bubble Chat */}
        <div className="flex w-full items-center justify-center px-6 py-6 sm:px-10">
          <div className="relative flex aspect-square w-48 items-center justify-center sm:w-64 md:w-72 lg:w-80">
            {/* Glow Latar Belakang */}
            <span
              aria-hidden="true"
              className="absolute inset-0 size-full rounded-full bg-white/70 blur-2xl"
            />

            {/* Maskot Robot */}
            <div className="relative z-10 size-full">
              <Image
                src={ai.gambar.src}
                alt={ai.gambar.alt}
                fill
                sizes="(min-width: 1024px) 320px, 60vw"
                className="object-contain drop-shadow-md"
                priority
              />
            </div>

            {/* Floating Bubble Chat */}
            {ai.bubbles?.map((bubble) => (
              <div
                key={bubble.id}
                className={`absolute z-20 ${bubble.posisi} transition-all duration-300`}
              >
                <Card
                  variant="white"
                  size="sm"
                  className="max-w-[125px] overflow-visible rounded-2xl border-svarati-lavender-light/80 bg-white/95 p-2 shadow-md backdrop-blur-sm sm:max-w-[175px] sm:p-2.5"
                >
                  {/* Ekor lancip yang menunjuk ke maskot */}
                  <span
                    aria-hidden="true"
                    className={`absolute size-3 rotate-45 border-svarati-lavender-light/80 bg-white/95 ${bubble.ekor}`}
                  />
                  <div className="flex items-start gap-1.5">
                    <IkonBubble className="mt-0.5 size-3.5 shrink-0 text-svarati-coral" />
                    <p className="text-[10px] font-medium leading-snug text-svarati-teal sm:text-xs">
                      {bubble.teks}
                    </p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}