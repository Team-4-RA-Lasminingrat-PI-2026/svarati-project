import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bot, MessageCircle } from "lucide-react";
import Badge from "@/components/Badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/Card";
import { svaratiAiContent as ai } from "@/content/labels";

export default function SvaratiAiBanner() {
  return (
    <section
      id="svarati-ai"
      className="mt-16 sm:mt-20 lg:mt-24 overflow-hidden bg-svarati-lavender-light/50 px-4 pb-14 pt-10 sm:px-6 lg:pb-16 lg:pt-12"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-8">
        {/* KIRI: Teks Utama */}
        <div className="flex flex-col items-start lg:pr-8">
          <Badge
            variant="lavender"
            styleType="white"
            className="mb-4 gap-1.5 shadow-sm"
          >
            <Bot className="size-3.5" aria-hidden="true" />
            {ai.badge}
          </Badge>

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
                  className="max-w-[125px] rounded-2xl border-svarati-lavender-light/80 bg-white/95 p-2 shadow-md backdrop-blur-sm sm:max-w-[175px] sm:p-2.5"
                >
                  <div className="flex items-start gap-1.5">
                    <MessageCircle className="mt-0.5 size-3.5 shrink-0 text-svarati-coral" />
                    <p className="text-[10px] font-medium leading-snug text-svarati-teal sm:text-xs">
                      "{bubble.teks}"
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