"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { heroContent as c } from "@/content/labels";

const toneClass = {
  primary: "text-svarati-teal",
  secondary: "text-svarati-lavender-dark",
};

export default function Hero() {
  return (
    <section className="hero keluar-tepi bg-linear-to-b from-svarati-lavender-light to-svarati-teal-soft text-svarati-teal">
      <div className="hero-grid">
        {/* TEKS */}
        <div className="hero-col">
          <div className="hero-inner">
            <h1
              className="hero-title font-bold tracking-tight"
              style={{ fontFamily: "var(--font-hero, var(--font-sans))" }}
            >
              {c.headline.map((line) => (
                <span key={line.text} className={`${toneClass[line.tone]} block`}>
                  {line.text}
                </span>
              ))}
            </h1>

            <p className="hero-desc text-svarati-lavender-dark">{c.description}</p>

            <p className="hero-label font-bold uppercase tracking-wide text-svarati-lavender-dark">
              {c.optionsLabel}
            </p>

            <ul className="hero-list">
              {c.options.map((o) => {
                const isTertiary = o.variant === "tertiary";
                const isCoral = o.variant === "primary";

                const className = [
                  "hero-btn h-auto whitespace-normal text-left font-semibold",
                  isTertiary ? "justify-center" : "justify-between gap-3 shadow-lg",
                  // Coral lebih tua agar kontras teks putih lolos AA
                  isCoral ? "bg-svarati-coral-medium hover:bg-svarati-coral-darker" : "",
                ].join(" ");

                return (
                  <li key={o.label}>
                    <Button
                      render={<Link href={o.href} />}
                      nativeButton={false}
                      variant={o.variant}
                      size={isTertiary ? "lg" : "xl"}
                      fullWidth
                      className={className}
                    >
                      <span className="min-w-0">{o.label}</span>
                      {!isTertiary && (
                        <ArrowRight
                          size={16}
                          className="hero-arrow shrink-0 transition group-hover/button:translate-x-0.5"
                        />
                      )}
                    </Button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* GAMBAR */}
        <div aria-hidden="true" className="hero-art-box">
          <div className="hero-art">
            <Image
              src={c.image.src}
              alt=""
              fill
              priority
              sizes="(min-width:1024px) 58vw, 100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}