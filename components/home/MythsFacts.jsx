"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/Card";
import { mitosContent as m } from "@/content/labels";

export default function MythsFacts() {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => setOpenId((cur) => (cur === id ? null : id));

  return (
    <section
      id="mitos"
      className="lebar-penuh scroll-mt-24 bg-svarati-teal-soft pb-16 pt-10 lg:pb-24 lg:pt-12"
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* Header */}
        <div className="mb-6 max-w-3xl">
          <h2 className="text-2xl font-bold text-svarati-teal md:text-3xl">
            {m.judul}
          </h2>
          <p className="mt-2 text-sm text-svarati-teal">{m.subjudul}</p>
        </div>

        {/* Kartu: hover (desktop), ketuk atau Enter/Spasi (HP & keyboard) */}
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {m.items.map((item) => {
            const isOpen = openId === item.id;

            return (
              <li key={item.id}>
                <div
                  role="button"
                  tabIndex={0}
                  aria-expanded={isOpen}
                  onClick={() => toggle(item.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggle(item.id);
                    }
                  }}
                  onBlur={() =>
                    setOpenId((cur) => (cur === item.id ? null : cur))
                  }
                  className="group relative h-72 w-full cursor-pointer overflow-hidden rounded-3xl outline-offset-2 focus-visible:outline-svarati-lavender-dark"
                >
                  {/* Mitos: putih, teks lavender */}
                  <Card
                    variant="white"
                    className="absolute inset-0 flex h-full flex-col rounded-3xl p-5"
                  >
                    <CardTitle className="mb-2 text-lg font-black uppercase text-svarati-lavender-dark">
                      {m.labelMitos}
                    </CardTitle>

                    <CardDescription className="text-sm leading-relaxed text-svarati-lavender-dark">
                      <span
                        aria-hidden="true"
                        className="mr-0.5 select-none align-[-0.25em] font-serif text-4xl font-black leading-[0] text-svarati-lavender-dark/40"
                      >
                        “
                      </span>
                      {item.mitos}
                      <span
                        aria-hidden="true"
                        className="ml-0.5 select-none align-[-0.25em] font-serif text-4xl font-black leading-[0] text-svarati-lavender-dark/40"
                      >
                        ”
                      </span>
                    </CardDescription>
                  </Card>

                  {/* Fakta: naik saat state terbuka, atau hover (hanya perangkat dengan hover) */}
                  <div
                    className={`absolute inset-0 flex flex-col bg-svarati-lavender-dark shadow-[0_-4px_20px_rgba(0,0,0,0.08)] transition-transform duration-500 ease-in-out [@media(hover:hover)]:group-hover:translate-y-0 ${
                      isOpen ? "translate-y-0" : "translate-y-[calc(100%-3.5rem)]"
                    }`}
                  >
                    <div className="flex h-14 shrink-0 items-center justify-between px-5">
                      <h3 className="text-lg font-black uppercase text-white">
                        {m.labelFakta}
                      </h3>

                      {/* Petunjuk: hanya di perangkat tanpa hover */}
                      <span
                        aria-hidden="true"
                        className="hidden items-center gap-1 text-xs font-medium text-white/80 [@media(hover:none)]:flex"
                      >
                        {isOpen ? m.labelTutup : m.labelLihat}
                        {isOpen ? (
                          <ChevronDown className="size-3.5" />
                        ) : (
                          <ChevronUp className="size-3.5" />
                        )}
                      </span>
                    </div>

                    <p
                      className={`flex-1 px-5 pb-5 pt-1 text-sm font-medium leading-relaxed text-white transition-opacity delay-100 duration-500 [@media(hover:hover)]:group-hover:opacity-100 ${
                        isOpen ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      “{item.fakta}”
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* CTA */}
        <div className="mt-6">
          <Button
            render={<Link href={m.cta.href} />}
            nativeButton={false}
            variant="tertiary"
            size="lg"
            className="gap-2 font-bold"
            icon={<ArrowRight size={16} aria-hidden="true" />}
            iconPosition="right"
          >
            {m.cta.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
