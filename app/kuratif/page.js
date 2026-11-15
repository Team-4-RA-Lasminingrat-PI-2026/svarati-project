import Link from "next/link";
import { MENU_UTAMA, KURATIF, serviceContent } from "@/content/labels";
import { ArrowRight, Clock, Info, Users } from "lucide-react";

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
    chip: "bg-white text-svarati-teal",
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

// Judul dengan coretan lengkung di bagian akhir.
// Kalau bagian yang ditekankan tidak ditemukan, judul tampil apa adanya.
function JudulBanner({ judul, tekanan }) {
  const potong = tekanan ? judul.lastIndexOf(tekanan) : -1;
  if (potong < 0) return judul;

  return (
    <>
      {judul.slice(0, potong)}
      <span className="relative whitespace-nowrap">
        {judul.slice(potong)}
        <svg
          viewBox="0 0 200 14"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="absolute inset-x-0 -bottom-2 h-3.5 w-full text-svarati-coral"
        >
          <path
            d="M3 9c20-6 38 4 58-1s36-5 56 0 40 3 80-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </>
  );
}

export default function Page() {
  return (
    <div className="w-full px-4 pb-12 pt-22">
      <div className="mx-auto max-w-4xl">
        {/* Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-svarati-teal-dark px-6 py-8 sm:px-10 sm:py-10">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -right-16 -top-24 size-40 rounded-full bg-svarati-teal/30 sm:size-56" />
            <div className="absolute -bottom-24 right-10 size-44 rounded-full bg-svarati-teal/25 sm:right-20 sm:size-64" />
          </div>

          <div className="relative max-w-lg">
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-svarati-teal-soft/90">
              <Users className="size-4" aria-hidden="true" />
              {badgeKuratif}
            </p>

            <h1 className="text-3xl font-semibold leading-[1.15] tracking-tight text-white sm:text-4xl">
              <JudulBanner judul={menuKuratif.title} tekanan={menuKuratif.judulTekanan} />
            </h1>

            <p className="mt-6 max-w-md text-sm leading-relaxed text-white/80">
              {menuKuratif.intro}
            </p>
          </div>
        </section>

        {/* Daftar layanan */}
        <ul className="mt-5 grid gap-3.5">
          {daftarSubmenu.map((item) => {
            const warna = TEMA[item.id];
            const Icon = warna.icon;

            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`group flex items-center justify-between gap-5 rounded-3xl p-5 transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-svarati-teal sm:gap-8 sm:p-6 ${warna.kartu}`}
                >
                  <div className="min-w-0">
                    <div className="mb-2.5 flex items-center gap-2.5">
                      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white">
                        <Icon className={`size-5 ${warna.ikon}`} />
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold leading-none ${warna.chip}`}
                      >
                        {item.id === "cek-kondisi" && (
                          <Clock className="size-3" aria-hidden="true" />
                        )}
                        {menuKuratif.chip[item.id]}
                      </span>
                    </div>

                    <h2 className={`text-xl font-semibold leading-snug ${warna.judul}`}>
                      {item.nama}
                    </h2>

                    <p className={`mt-1 text-sm leading-relaxed ${warna.teks}`}>
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

        {/* Catatan kaki */}
        <p className="mt-6 flex items-start gap-2 text-sm text-svarati-coral-dark">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{menuKuratif.disclaimer}</span>
        </p>
      </div>
    </div>
  );
}
