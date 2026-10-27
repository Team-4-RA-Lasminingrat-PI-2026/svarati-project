import Image from "next/image";
import Link from "next/link";
import Badge from "@/components/Badge";
import { Card, CardTitle, CardDescription, CardLink } from "@/components/Card";
import { serviceContent as s } from "@/content/labels";

const TONE_TEXT = {
  lavender: "text-svarati-lavender-dark",
  teal: "text-svarati-teal-light",
  coral: "text-svarati-coral-dark",
};

export default function Services() {
  return (
    <section id="services" className="scroll-mt-24 px-4 pb-12 pt-22 sm:px-6 lg:pb-16">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mx-auto mb-6 max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-svarati-teal md:text-3xl">
            {s.title}
          </h2>
          <p className="mt-1 text-sm text-svarati-lavender-dark">
            {s.subtitle}
          </p>
        </div>

        <ul className="grid gap-5 md:grid-cols-3">
          {s.items.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="group block h-full rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-svarati-teal"
              >
                <Card
                  variant={item.variant}
                  interactive
                  className="flex h-full flex-col p-0"
                >
                  {/* Gambar */}
                  <div className="relative h-40 w-full shrink-0 bg-white/60">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover"
                    />
                  </div>

                  {/* Teks */}
                  <div className="flex flex-1 flex-col p-5">
                    <Badge
                      variant={item.variant}
                      styleType="white"
                      className="mb-3 w-fit"
                    >
                      {item.badge}
                    </Badge>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription
                      className={`text-[13px] ${TONE_TEXT[item.variant]}`}
                    >
                      {item.description}
                    </CardDescription>
                    <CardLink
                      className={`mt-auto pt-4 ${TONE_TEXT[item.variant]}`}
                    >
                      {item.cta}
                    </CardLink>
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}