import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/Card";
import { svaratiAiContent as ai } from "@/content/labels";

// Gelembung chat padat dengan tiga titik dan ekor di kiri bawah.
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

// Posisi bubble relatif terhadap kotak robot
// "box"  = posisi bubble di sekitar robot
// "ekor" = posisi + arah ekor lancip yang menunjuk ke robot
// "anim" = animasi melayang (keyframes ada di globals.css)
const POSISI_BUBBLE = [
  {
    // Kiri atas, di atas bahu kiri robot
    box: "-left-[12%] -top-[8%] max-w-[115px] sm:max-w-[160px]",
    ekor: "-bottom-1.5 right-5 border-b border-r",
    anim: "animate-float-slow",
  },
  {
    // Kanan atas, di atas telinga kanan
    box: "-right-[22%] top-[2%] max-w-[125px] sm:max-w-[170px]",
    ekor: "-bottom-1.5 left-5 border-b border-r",
    anim: "animate-float-medium",
  },
  {
    // Kiri bawah
    box: "-left-[22%] -bottom-[8%] max-w-[125px] sm:max-w-[170px]",
    ekor: "-right-1.5 top-4 border-r border-t",
    anim: "animate-float-fast",
  },
];

export default function SvaratiAiBanner() {
  const bubbles = ai.bubbles?.slice(0, POSISI_BUBBLE.length) ?? [];

  return (
    <section
      id="svarati-ai"
      className="mt-5 sm:mt-10 lg:mt-15 lebar-penuh overflow-hidden bg-svarati-lavender-light/50 pb-14 pt-10 lg:pb-16 lg:pt-12"
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
        <div className="flex w-full items-center justify-center py-10 sm:py-12 lg:-translate-x-6">
          {/* Kotak robot: bubble dipasang relatif terhadap kotak ini */}
          <div className="relative size-52 sm:size-64 lg:size-72">
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
                sizes="(min-width: 1024px) 288px, (min-width: 640px) 256px, 208px"
                className="object-contain drop-shadow-md"
                priority
              />
            </div>

            {/* Floating Bubble Chat */}
            {bubbles.map((bubble, i) => {
              const pos = POSISI_BUBBLE[i];
              return (
                <div
                  key={bubble.id}
                  className={`absolute z-20 w-max ${pos.box} ${pos.anim}`}
                >
                  <Card
                    variant="white"
                    size="sm"
                    className="relative w-fit overflow-visible rounded-2xl border-svarati-lavender-light/80 bg-white/95 p-2 shadow-md backdrop-blur-sm sm:p-2.5"
                  >
                    {/* Ekor lancip yang menunjuk ke maskot */}
                    <span
                      aria-hidden="true"
                      className={`absolute size-3 rotate-45 border-svarati-lavender-light/80 bg-white/95 ${pos.ekor}`}
                    />
                    <div className="flex items-start gap-1.5">
                      <IkonBubble className="mt-0.5 size-3.5 shrink-0 text-svarati-coral" />
                      <p className="text-[10px] font-medium leading-snug text-svarati-teal sm:text-xs">
                        {bubble.teks}
                      </p>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}