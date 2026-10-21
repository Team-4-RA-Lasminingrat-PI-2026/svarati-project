import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { heroContent as c } from "@/content/labels";

const toneClass = {
  primary: "text-svarati-teal",
  secondary: "text-svarati-lavender-dark",
};

// Masking dibuat memenuhi sisi kanan
const maskStyle = {
  WebkitMaskImage: "url(/woman.svg)",
  maskImage: "url(/woman.svg)",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskSize: "cover", 
  maskSize: "cover",
  WebkitMaskPosition: "right top",
  maskPosition: "right top",
};

export default function Hero() {
  return (
    <section className="flex min-h-[calc(100svh)] flex-col px-2 pb-12 pt-22 sm:px-3">
      <div className="mx-auto grid w-full max-w-6xl flex-1 overflow-hidden rounded-3xl border border-svarati-lavender-light bg-linear-to-b from-svarati-lavender-light/70 to-svarati-teal-soft text-svarati-teal shadow-sm lg:grid-cols-2">
        
        <div className="flex flex-col justify-center px-6 py-6 lg:px-12">
          <div className="my-auto py-10">
            <h1
              className="text-6xl font-bold leading-[1.1] tracking-text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl xl:text-5xl"
              style={{ fontFamily: "var(--font-hero, var(--font-sans))" }}
            >
              {c.headline.map((line) => (
                <span key={line.text} className={`${toneClass[line.tone]} mr-3`}>
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

            <ul className="mt-2 flex max-w-md flex-col gap-2">
              {c.options.map((o) => (
                <li key={o.label}>
                  <Button
                  render={<Link href={o.href} />}
                    nativeButton={false}
                    variant={o.variant}
                    size="lg"
                    fullWidth
                    className={`h-auto whitespace-normal py-2.5 text-left text-sm font-semibold ${
                      o.variant === "tertiary" ? "justify-center" : "justify-between shadow-md"
                    }`}
                  >
                    {o.label}
                    {o.variant !== "tertiary" && (
                      <ArrowRight size={16} className="shrink-0 transition group-hover/button:translate-x-0.5" />
                    )}
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-4 text-xs italic text-svarati-lavender-dark">{c.footnote}</p>
        </div>

        
        <div className="relative hidden lg:block">
          <div className="absolute inset-0" style={maskStyle}>
            <Image
              src={c.image.src}
              alt={c.image.alt}
              fill
              priority
              sizes="(min-width:1024px) 50vw, 100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}