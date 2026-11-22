import Link from "next/link";
import { MENU_UTAMA, KURATIF, serviceContent } from "@/content/labels";
import { ArrowRight, Clock, Users } from "lucide-react";

// Ikon padat buatan sendiri. Warnanya ikut text-* dari pemanggil,
// bagian putih sengaja putih karena ditaruh di atas ubin putih.
function IkonPapan({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
      <rect x="4" y="3.6" width="16" height="18.4" rx="3.2" fill="currentColor" />
      <rect x="8.4" y="1.4" width="7.2" height="4.2" rx="1.7" fill="currentColor" />
      <path d="M7.6 10.6l1.5 1.5 2.6-2.9" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.2 10.4h2.3" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M7.6 16.4l1.5 1.5 2.6-2.9" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.2 16.2h2.3" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function IkonRobot({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
      <circle cx="12" cy="3.1" r="1.6" fill="currentColor" />
      <path d="M12 4.5v2.3" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <rect x="1.5" y="11" width="2.8" height="5.2" rx="1.4" fill="currentColor" />
      <rect x="19.7" y="11" width="2.8" height="5.2" rx="1.4" fill="currentColor" />
      <rect x="4" y="6.8" width="16" height="13.4" rx="4.6" fill="currentColor" />
      <circle cx="9" cy="12.4" r="1.6" fill="#fff" />
      <circle cx="15" cy="12.4" r="1.6" fill="#fff" />
      <path d="M9.5 16.3c1.4 1.1 3.6 1.1 5 0" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function IkonPenandaHati({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
      <path d="M12 22.2s7.6-7.4 7.6-12.8a7.6 7.6 0 1 0-15.2 0c0 5.4 7.6 12.8 7.6 12.8z" fill="currentColor" />
      <path d="M12 13.9 9.2 11.2c-1.1-1.1-.4-3 1.2-3 .6 0 1.2.3 1.6.9.4-.6 1-.9 1.6-.9 1.6 0 2.3 1.9 1.2 3z" fill="#fff" />
    </svg>
  );
}

const menuKuratif = KURATIF.menu;
const daftarSubmenu = MENU_UTAMA.find((menu) => menu.id === "pendampingan").submenu;
const badgeKuratif = serviceContent.items.find((item) => item.id === "kuratif").badge;

// Warna per layanan. Class ditulis lengkap agar terbaca oleh Tailwind.
const TEMA = {
  "cek-kondisi": {
    icon: IkonPapan,
    kartu: "bg-svarati-teal-soft",
    ikon: "text-svarati-teal",
    judul: "text-svarati-teal",
    teks: "text-svarati-teal/80",
    chip: "bg-svarati-teal/15 text-svarati-teal",
    aksi: "text-svarati-teal",
  },
  "svarati-ai": {
    icon: IkonRobot,
    kartu: "bg-svarati-lavender/15",
    ikon: "text-svarati-lavender-dark",
    judul: "text-svarati-lavender-dark",
    teks: "text-svarati-lavender-dark/85",
    chip: "bg-white text-svarati-lavender-dark",
    aksi: "text-svarati-lavender-dark",
  },
  "cari-layanan": {
    icon: IkonPenandaHati,
    // Coral paling muda di antara ketiganya, jadi dipertua satu tingkat
    kartu: "bg-svarati-coral-soft",
    ikon: "text-svarati-coral-dark",
    judul: "text-svarati-coral-darker",
    teks: "text-svarati-coral-dark",
    chip: "bg-svarati-coral/15 text-svarati-coral-darker",
    aksi: "text-svarati-coral-darker",
  },
};

export default function Page() {
  return (
    // Banner dan ketiga kartu dirapatkan supaya muat satu layar di laptop
    <div className="w-full pb-8 pt-24">
      <div className="mx-auto max-w-6xl">
        {/* Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-svarati-teal-dark px-6 py-7 sm:px-9 sm:py-8">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -right-16 -top-20 size-36 rounded-full bg-svarati-teal/30 sm:size-48" />
            <div className="absolute -bottom-20 right-10 size-40 rounded-full bg-svarati-teal/25 sm:right-20 sm:size-56" />
          </div>

          <div className="relative max-w-2xl lg:max-w-3xl">
            <p className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-svarati-teal-soft/90">
              <Users className="size-4" aria-hidden="true" />
              {badgeKuratif}
            </p>

            <h1 className="text-2xl font-bold leading-[1.18] tracking-tight text-white sm:text-3xl">
              {menuKuratif.title}
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/80 lg:max-w-2xl">
              {menuKuratif.intro}
            </p>
          </div>
        </section>

        {/* Daftar layanan */}
        <ul className="mt-4 grid gap-3">
          {daftarSubmenu.map((item) => {
            const warna = TEMA[item.id];
            const Icon = warna.icon;

            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`group flex items-center justify-between gap-4 rounded-3xl p-4 transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-svarati-teal sm:gap-7 sm:p-5 ${warna.kartu}`}
                >
                  {/* Ikon berdiri sendiri tanpa ubin latar */}
                  <Icon className={`size-7 shrink-0 ${warna.ikon}`} />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                      <h2 className={`text-lg font-semibold leading-snug ${warna.judul}`}>
                        {item.nama}
                      </h2>
                      {menuKuratif.chip[item.id] && (
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold leading-none ${warna.chip}`}
                        >
                          <Clock className="size-3.5" aria-hidden="true" />
                          {menuKuratif.chip[item.id]}
                        </span>
                      )}
                    </div>

                    <p className={`mt-1.5 text-sm leading-relaxed ${warna.teks}`}>
                      {menuKuratif.desc[item.id]}
                    </p>
                  </div>

                  <span
                    className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-sm font-bold ${warna.aksi}`}
                  >
                    <span className="hidden underline-offset-4 group-hover:underline sm:inline">
                      {menuKuratif.cta[item.id]}
                    </span>
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
