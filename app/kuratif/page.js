import Link from "next/link";
import { MENU_UTAMA, KURATIF, layananContent } from "@/content/labels";
import Badge from "@/components/Badge";
import { Card, CardIcon, CardTitle, CardDescription } from "@/components/Card";
import { ClipboardCheck, MapPin, MessageCircle, ChevronRight, Info } from "lucide-react";

const menuKuratif = KURATIF.menu;
const daftarSubmenu = MENU_UTAMA.find((menu) => menu.id === "pendampingan").submenu;
const badgeKuratif = layananContent.items.find((item) => item.id === "kuratif").badge;

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

export default function Page() {
  return (
    <div className="w-full px-2 pb-12 pt-22 sm:px-3">
      <div className="mx-auto max-w-6xl">
        <Card variant="solid" size="lg" className="bg-svarati-teal-dark">
          <Badge variant="teal" styleType="white">{badgeKuratif}</Badge>
          <h1 className="mt-4 text-3xl font-bold text-white">{menuKuratif.title}</h1>
          <p className="mt-3 max-w-3xl leading-relaxed text-white/90">{menuKuratif.intro}</p>
        </Card>

        <ul className="mt-8 grid gap-4">
          {daftarSubmenu.map((item) => {
            const meta = ITEM_META[item.id];
            const Icon = meta.icon;
            const tone = TONE_TEXT[meta.variant];
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="group block rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-svarati-teal"
                >
                  <Card
                    variant={meta.variant}
                    topBorder={meta.variant}
                    interactive
                    className="flex items-center gap-5 p-5 sm:p-6"
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
                      <CardDescription className={`mt-1 ${tone}`}>
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

        <p className="mt-8 flex items-start gap-2 text-sm text-svarati-coral-dark">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{menuKuratif.disclaimer}</span>
        </p>
      </div>
    </div>
  );
}