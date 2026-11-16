import Link from "next/link";
import { ArrowRight, BookOpen, ChevronUp } from "lucide-react";
import Badge from "@/components/Badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/Card";
import { mitosContent as m } from "@/content/labels";

export default function MythsFacts() {
  return (
    <section
      id="mitos"
      className="scroll-mt-24 bg-svarati-teal-soft px-4 pb-16 pt-10 sm:px-6 lg:pb-24 lg:pt-12"
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* Header */}
        <div className="mb-6 max-w-3xl">
          <h2 className="text-2xl font-bold text-svarati-teal md:text-3xl">
            {m.judul}
          </h2>
          <p className="mt-2 text-sm text-svarati-teal">
            {m.subjudul}
          </p>
        </div>

        {/* Kartu: hover atau fokus keyboard membuka fakta */}
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {m.items.map((item) => (
            <li key={item.id}>
              <div
                tabIndex={0}
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

                {/* Fakta: lavender, teks putih. Naik saat hover/fokus */}
                <div className="absolute inset-0 flex translate-y-[calc(100%-3.5rem)] flex-col bg-svarati-lavender-dark shadow-[0_-4px_20px_rgba(0,0,0,0.08)] transition-transform duration-500 ease-in-out group-hover:translate-y-0 group-focus-within:translate-y-0">
                  <div className="flex h-14 shrink-0 items-center justify-between px-5">
                    <h3 className="text-lg font-black uppercase text-white">
                      {m.labelFakta}
                    </h3>

                    {/* Petunjuk tap: hanya di perangkat tanpa hover, hilang saat fakta terbuka */}
                    <span
                      aria-hidden="true"
                      className="hidden items-center gap-1 text-xs font-medium text-white/80 transition-opacity duration-300 group-focus-within:opacity-0 [@media(hover:none)]:flex"
                    >
                      {m.labelLihat}
                      <ChevronUp className="size-3.5" />
                    </span>
                  </div>
                  <p className="flex-1 px-5 pb-5 pt-1 text-sm font-medium leading-relaxed text-white opacity-0 transition-opacity delay-100 duration-500 group-hover:opacity-100 group-focus-within:opacity-100">
                    {item.fakta}
                  </p>
                </div>
              </div>
            </li>
          ))}
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