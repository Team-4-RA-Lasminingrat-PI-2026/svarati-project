"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import Badge from "@/components/Badge";
import { Button } from "@/components/ui/button";
import { educationContent as edu, categoryLabel } from "@/content/labels";

export default function EducationBanner({ headlines }) {
  const totalSlides = headlines.length + 1; // 1 slide intro + artikel headline
  const trackRef = useRef(null);
  const [slideIndex, setSlideIndex] = useState(0);

  const goTo = (i) => {
    const el = trackRef.current;
    if (!el) return;
    const next = Math.max(0, Math.min(totalSlides - 1, i));
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  };

  const onScroll = (ev) => {
    const el = ev.currentTarget;
    setSlideIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  const arrowClass =
    "absolute top-1/2 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-svarati-lavender-dark shadow-md transition hover:bg-svarati-lavender-light disabled:opacity-30 md:flex";

  return (
    <section aria-roledescription="carousel" aria-label={edu.carouselLabel} className="px-2 sm:px-3">
      <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-3xl shadow-sm">
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {/* Slide 1: penjelasan halaman */}
          <div
            aria-roledescription="slide"
            className="relative flex h-[26rem] w-full flex-none snap-center flex-col justify-center overflow-hidden bg-svarati-lavender-dark px-8 sm:px-14 md:h-80 lg:h-[22rem] lg:px-20"
          >
            <span aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 size-72 rounded-full bg-svarati-lavender/40" />
            <span aria-hidden="true" className="pointer-events-none absolute -bottom-24 right-24 size-56 rounded-full bg-svarati-lavender-darker/60" />

            <div className="relative max-w-2xl">
              <Badge variant="lavender" styleType="white" className="mb-4 gap-1.5">
                <BookOpen className="size-3.5" aria-hidden="true" />
                {edu.intro.badge}
              </Badge>
              <h1 className="text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
                {edu.intro.title}
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-svarati-lavender-light md:text-base">
                {edu.intro.description}
              </p>
            </div>
          </div>

          {/* Slide 2+: artikel headline */}
          {headlines.map((a) => (
            <div
              key={a.id}
              aria-roledescription="slide"
              className="grid h-[26rem] w-full flex-none snap-center grid-rows-[10rem_1fr] bg-svarati-lavender-light md:h-80 md:grid-cols-2 md:grid-rows-1 lg:h-[22rem]"
            >
              <div className="flex min-w-0 flex-col justify-center px-8 py-5 sm:px-14 lg:px-20">
                <Badge variant="lavender" styleType="white" className="mb-3 w-fit">
                  {categoryLabel[a.category]}
                </Badge>
                <h2 className="text-xl font-bold leading-snug text-svarati-teal md:text-2xl lg:text-3xl">
                  {a.title}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-svarati-lavender-dark">
                  {a.summary}
                </p>
                <div className="mt-4">
                  <Button
                    render={<Link href={`${edu.basePath}/${a.slug}`} />}
                    nativeButton={false}
                    variant="primary"
                    size="md"
                    className="rounded-full px-5 font-bold"
                    icon={<ChevronRight className="size-4" aria-hidden="true" />}
                    iconPosition="right"
                  >
                    {edu.readLabel}
                  </Button>
                </div>
              </div>

              <div className="relative order-first md:order-none">
                <Image
                  src={a.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Panah: md ke atas. Di HP cukup digeser dengan jari */}
        <button
          type="button"
          onClick={() => goTo(slideIndex - 1)}
          disabled={slideIndex === 0}
          aria-label={edu.slideLabel.prev}
          className={`${arrowClass} left-3`}
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => goTo(slideIndex + 1)}
          disabled={slideIndex === totalSlides - 1}
          aria-label={edu.slideLabel.next}
          className={`${arrowClass} right-3`}
        >
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>

        {/* Indikator titik: berubah warna sesuai slide agar tetap terlihat */}
        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
          {Array.from({ length: totalSlides }).map((_, i) => {
            const active = i === slideIndex;
            const onDark = slideIndex === 0;
            return (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`${edu.slideLabel.goTo} ${i + 1}`}
                aria-current={active}
                className={`h-2 rounded-full transition-all ${
                  active
                    ? `w-6 ${onDark ? "bg-white" : "bg-svarati-lavender-dark"}`
                    : `w-2 ${onDark ? "bg-white/40 hover:bg-white/70" : "bg-svarati-lavender-dark/40 hover:bg-svarati-lavender-dark/70"}`
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}