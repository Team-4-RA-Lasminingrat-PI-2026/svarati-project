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
      <section className="relative min-h-svh overflow-hidden bg-linear-to-b from-svarati-lavender-light to-svarati-teal-soft text-svarati-teal">
        <div className="grid min-h-svh grid-cols-1 lg:grid-cols-2">
          {/* KIRI: teks. pt menyisakan ruang untuk navbar fixed */}
          <div className="relative z-10 flex min-w-0 flex-col justify-center px-5 pb-6 pt-28 sm:px-8 lg:pb-8 lg:pl-16 lg:pr-8 lg:pt-28 xl:pl-24">
            <div className="max-w-xl">
              {/* Ukuran headline mengikuti tinggi layar agar tidak terpotong */}
              <h1
                className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-[clamp(2rem,6.5vh,3.75rem)]"
                style={{ fontFamily: "var(--font-hero, var(--font-sans))" }}
              >
                {c.headline.map((line) => (
                  <span key={line.text} className={`${toneClass[line.tone]} mr-2 inline-block`}>
                    {line.text}
                  </span>
                ))}
              </h1>

              <p className="mt-3 max-w-md text-sm leading-relaxed text-svarati-lavender-dark">
                {c.description}
              </p>

              <p className="mt-4 text-[11px] font-bold uppercase tracking-wide text-svarati-lavender-dark">
                {c.optionsLabel}
              </p>

              <ul className="mt-2 flex w-full max-w-md flex-col gap-2">
                {c.options.map((o) => {
                  const isTertiary = o.variant === "tertiary";
                  const className = `h-auto whitespace-normal py-2.5 text-left text-sm font-semibold ${
                    isTertiary ? "justify-center" : "justify-between gap-3 shadow-md"
                  }`;

                  const content = (
                    <>
                      <span className="min-w-0">{o.label}</span>
                      {!isTertiary && (
                        <ArrowRight
                          size={16}
                          className="shrink-0 transition group-hover/button:translate-x-0.5"
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

              <p className="mt-4 text-xs italic text-svarati-lavender-dark">{c.footnote}</p>
            </div>
          </div>

          {/* KANAN: gambar edge-to-edge (atas, kanan, bawah) di desktop */}
          <div
            aria-hidden="true"
           className="pointer-events-none absolute inset-0 z-0 opacity-60 lg:pointer-events-auto lg:relative lg:inset-auto lg:min-w-0 lg:opacity-100"
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