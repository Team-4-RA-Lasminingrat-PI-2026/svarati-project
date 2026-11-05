import Link from "next/link";
import { MENU_UTAMA, KURATIF, serviceContent } from "@/content/labels";
import Badge from "@/components/Badge";
import { Card, CardIcon, CardTitle, CardDescription } from "@/components/Card";
import { ClipboardCheck, MapPin, MessageCircle, ChevronRight, Info } from "lucide-react";

const menuKuratif = KURATIF.menu;
const daftarSubmenu = MENU_UTAMA.find((menu) => menu.id === "pendampingan").submenu;
const badgeKuratif = serviceContent.items.find((item) => item.id === "kuratif").badge;

// Warna deskripsi dan ikon mengikuti latar kartu. Judul tetap teal.
// Class ditulis lengkap agar terdeteksi Tailwind.
const TONE_TEXT = {
  teal: "text-svarati-teal",
  lavender: "text-svarati-lavender-dark",
  coral: "text-svarati-coral-dark",
};

// Ikon, petunjuk, dan variant kartu per item.
const ITEM_META = {
  "cek-kondisi": { icon: ClipboardCheck, variant: "teal" , textClass: "text-svarati-teal"},
  "cari-layanan": { icon: MapPin, variant: "coral" },
  "svarati-ai": { icon: MessageCircle, variant: "lavender" },
};

const DOT_PATTERN = {
  backgroundImage: "radial-gradient(rgba(255,255,255,0.7) 1.5px, transparent 1.5px)",
  backgroundSize: "14px 14px",
};

// Latar halaman: gradasi krem ke lavender, blob teal muda di kiri bawah, blob lavender di kanan bawah.
function PageBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#fff3d9] via-[#fdf7ef] to-[#e9e1fb]" />

      {/* Kiri bawah: teal muda */}
      <span className="absolute -left-24 bottom-0 h-[26rem] w-[22rem] rounded-[45%_55%_60%_40%/55%_45%_55%_45%] bg-[#cdebe8]/80" />
      <span className="absolute bottom-40 left-28 size-24 rounded-full bg-[#bfe5e1]/80" />

      {/* Kanan bawah: lavender */}
      <span className="absolute -bottom-20 -right-24 h-[24rem] w-[26rem] rounded-[55%_45%_40%_60%/50%_55%_45%_50%] bg-[#d6cbf3]/85" />
      <span className="absolute bottom-24 right-36 size-16 rounded-full bg-[#c4b5ee]/70" />
    </div>
  );
}

// Kilau empat sudut. Posisi lewat style supaya pasti di sisi kanan banner.
function Sparkle({ right, top, size, className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute hidden lg:block ${className}`}
      style={{ right, top, width: size, height: size }}
    >
      <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor">
        <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
      </svg>
    </span>
  );
}

export default function Page() {
  return (
    <div className="relative w-full overflow-hidden px-2 pb-4 pt-[5.5rem] sm:px-3">
      <PageBackground />

      <div className="relative z-10 mx-auto max-w-6xl">
        <Card
          variant="solid"
          size="lg"
          className="relative overflow-hidden rounded-[2rem] !py-4 bg-svarati-teal-dark bg-gradient-to-r from-[#17313f] via-svarati-teal-dark to-[#1d4d55]"
        >
          {/* Kiri: lingkaran besar terang, titik gelap kecil */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -left-16 -top-20 size-52 rounded-full bg-white/[0.07]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-6 left-24 size-12 rounded-full bg-black/20"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-5 left-10 size-4 rounded-full bg-black/25"
          />

          {/* Kanan: blob gelap di atas, blob teal di bawah */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-16 size-52 rounded-full bg-black/20"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 right-4 h-56 w-[28rem] rounded-[50%] bg-svarati-teal/40"
          />

          {/* Pola titik dan kilau di sisi kanan */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute hidden opacity-40 lg:block"
            style={{ right: "6rem", top: "1rem", width: "7rem", height: "4rem", ...DOT_PATTERN }}
          />
          <Sparkle right="13rem" top="1.25rem" size="1.5rem" className="text-svarati-coral" />
          <Sparkle right="9rem" top="3.5rem" size="1rem" className="text-svarati-coral/80" />

          <div className="relative md:pl-6 lg:pl-[18%]">
            <Badge variant="teal" styleType="white">{badgeKuratif}</Badge>
            <h1 className="mt-2 max-w-[21ch] text-2xl font-bold leading-snug text-white sm:text-3xl">
              {menuKuratif.title}
            </h1>
            <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-white/90">
              {menuKuratif.intro}
            </p>
          </div>
        </Card>

        <ul className="mt-3 grid gap-2.5">
          {daftarSubmenu.map((item) => {
            const meta = ITEM_META[item.id];
            const Icon = meta.icon;
            const tone = TONE_TEXT[meta.variant];
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="group block rounded-3xl bg-svarati-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-svarati-teal"
                >
                  <Card
                    variant={meta.variant}
                    topBorder={meta.variant}
                    interactive
                    className="flex items-center gap-4 !px-5 !py-3"
                  >
                    <CardIcon className={`mb-0 shrink-0 ${tone}`}>
                      <Icon aria-hidden="true" />
                    </CardIcon>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <CardTitle className="mb-0">{item.nama}</CardTitle>
                        {item.id === "cek-kondisi" && (
                          <Badge variant={meta.accent} styleType="white">
                            {menuKuratif.hintCekKondisi}
                          </Badge>
                        )}
                      </div>
                      <CardDescription className={`mt-0.5 ${tone}`}>
                        {menuKuratif.desc[item.id]}
                      </CardDescription>
                    </div>

                    <ChevronRight
                      className={`h-5 w-5 shrink-0 transition-transform duration-200 group-hover:translate-x-1 ${tone}`}
                      aria-hidden="true"
                    />
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mt-3 flex items-start gap-2 text-sm text-svarati-coral-dark">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{menuKuratif.disclaimer}</span>
        </p>
      </div>
    </div>
  );
}