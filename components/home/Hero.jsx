"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmergencyModal from "@/components/modals/EmergencyModal";
import { heroContent as c } from "@/content/labels";

const toneClass = {
  primary: "text-svarati-teal",
  secondary: "text-svarati-lavender-dark",
};

export default function Hero() {
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  return (
    <>
      <section className="hero-root relative min-h-svh overflow-hidden bg-linear-to-b from-svarati-lavender-light to-svarati-teal-soft text-svarati-teal">
      <div className="grid min-h-svh grid-cols-1">
          {/* KIRI: teks */}
          <div className="hero-col relative z-10 flex min-w-0 flex-col justify-center px-5 pb-6 pt-28 sm:px-8">
            <div className="hero-inner max-w-xl">
              <h1
                className="hero-title text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl"
                style={{ fontFamily: "var(--font-hero, var(--font-sans))" }}
              >
                {c.headline.map((line) => (
                  <span key={line.text} className={`${toneClass[line.tone]} block`}>
                    {line.text}
                  </span>
                ))}
              </h1>

              <p className="hero-desc mt-3 max-w-md text-sm leading-relaxed text-svarati-lavender-dark">
                {c.description}
              </p>

              <p className="hero-label mt-4 text-[11px] font-bold uppercase tracking-wide text-svarati-lavender-dark">
                {c.optionsLabel}
              </p>

              <ul className="hero-list mt-2 flex w-full max-w-md flex-col gap-2">
                {c.options.map((o) => {
                  const isTertiary = o.variant === "tertiary";
                  const className = `hero-btn h-auto whitespace-normal py-2.5 text-left text-sm font-semibold ${
                    isTertiary ? "justify-center" : "justify-between gap-3 shadow-md"
                  }`;

                  const content = (
                    <>
                      <span className="min-w-0">{o.label}</span>
                      {!isTertiary && (
                        <ArrowRight
                          size={16}
                          className="hero-arrow shrink-0 transition group-hover/button:translate-x-0.5"
                        />
                      )}
                    </>
                  );

                  return (
                    <li key={o.label}>
                      {o.action === "emergency" ? (
                        <Button
                          type="button"
                          onClick={() => setEmergencyOpen(true)}
                          variant={o.variant}
                          size="lg"
                          fullWidth
                          className={className}
                        >
                          {content}
                        </Button>
                      ) : (
                        <Button
                          render={<Link href={o.href} />}
                          nativeButton={false}
                          variant={o.variant}
                          size="lg"
                          fullWidth
                          className={className}
                        >
                          {content}
                        </Button>
                      )}
                    </li>
                  );
                })}
              </ul>

              <p className="hero-note mt-4 text-xs italic text-svarati-lavender-dark">
                {c.footnote}
              </p>
            </div>
          </div>

         {/* KANAN: desktop = kotak rasio tetap menempel di kanan atas setinggi layar */}
         <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 opacity-60 lg:inset-auto lg:right-0 lg:top-0 lg:h-full lg:w-[var(--art-w)] lg:opacity-100"
          >
            <div className="hero-art absolute inset-0">
              <Image
                src={c.image.src}
                alt=""
                fill
                priority
                sizes="(min-width:1024px) 50vw, 100vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      <EmergencyModal open={emergencyOpen} onClose={() => setEmergencyOpen(false)} />
    </>
  );
}