"use client";

import Link from "next/link";
import { Card } from "@/components/Card";
import { BRAND, DARURAT, FOOTER, MENU_UTAMA } from "@/content/labels";

export default function Footer() {
  // Mengambil menu pilar (Pahami Hakmu, Pendampingan, Pemulihan) dari MENU_UTAMA
  const pilarList = MENU_UTAMA.filter((item) => item.submenu && item.submenu.length > 0);
  const nomorDarurat = Object.values(DARURAT.nomor);

  return (
    <footer className="bg-svarati-teal text-white mt-auto w-full overflow-x-hidden border-t border-svarati-teal-dark">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.3fr_1.2fr_1fr_1fr] gap-6 sm:gap-8 lg:gap-10">

        {/* Kolom 1: Brand */}
        <div>
          <div className="font-bold text-2xl text-white mb-3 flex items-baseline">
            {BRAND.nama}
            <span className="text-svarati-coral ml-0.5 text-2xl font-bold leading-none">.</span>
          </div>
          <p className="italic text-base text-svarati-lavender-light mb-3">
            {BRAND.tagline}
          </p>
          <p className="text-sm text-svarati-lavender-light max-w-xs leading-relaxed">
            {FOOTER.deskripsiBrand}
          </p>
        </div>

        {/* Kolom 2: Jelajahi (ditarik otomatis dari MENU_UTAMA) */}
        <div>
          <h2 className="font-bold text-base text-white mb-3">
            {FOOTER.kolomPerjalanan}
          </h2>
          <ul className="space-y-2">
            {pilarList.map((p) => (
              <li key={p.id}>
                <Link
                  href={p.submenu[0].href}
                  className="text-sm text-svarati-lavender-light hover:text-white hover:underline transition"
                >
                  {p.nama} — {p.deskripsi}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Kolom 3: Bantuan Darurat */}
        <div>
          <h2 className="font-bold text-base text-white mb-3">
            {FOOTER.kolomDarurat}
          </h2>
          <ul className="space-y-2 text-sm">
            {/* Silent SOS: sementara masih alert placeholder, fitur aslinya menyusul */}
            <li>
              <button
                type="button"
                onClick={() => alert(DARURAT.sos.alert)}
                className="text-left text-svarati-lavender-light hover:text-white hover:underline transition cursor-pointer"
              >
                {DARURAT.sos.nama}
              </button>
            </li>
            {nomorDarurat.map((t) => (
              <li key={t.nomor}>
                <a
                  href={`tel:${t.nomor}`}
                  className="text-svarati-lavender-light hover:text-white hover:underline transition block"
                >
                  {t.nomor} · {t.nama}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Kolom 4: Keamanan Digital */}
        <div>
          <h2 className="font-bold text-base text-white mb-3">
            {FOOTER.kolomKeamanan}
          </h2>
          <Card size="sm" className="bg-white/10 border-white/20 rounded-2xl">
            <p className="text-sm text-svarati-lavender-light leading-relaxed">
              {FOOTER.keamananAwal}{" "}
              <strong className="text-white font-semibold">{DARURAT.keluarCepat}</strong>{" "}
              {FOOTER.keamananAkhir}
            </p>
          </Card>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/15">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm text-svarati-lavender-light">
          <span>
            © {BRAND.tahun} {BRAND.nama} · {BRAND.slogan}
          </span>
          <span className="italic">{BRAND.catatanPrototipe}</span>
        </div>
      </div>
    </footer>
  );
}