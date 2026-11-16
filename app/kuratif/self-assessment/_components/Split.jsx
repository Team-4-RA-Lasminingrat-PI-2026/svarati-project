import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/Card";
import { MENU_UTAMA } from "@/content/labels";

const hub = MENU_UTAMA.find((menu) => menu.id === "pendampingan");

// Susunan dua kolom: panel kiri dan konten kanan.
// Kolom kiri berisi tautan kembali ke hub Pendampingan di atas panel, jadi kolom kanan tetap mulai dari atas.
// sembunyikanAsideDiMobile = true menyembunyikan panel kiri di layar kecil (tautan kembali tetap tampil).
export default function Split({ aside, children, sembunyikanAsideDiMobile = false }) {
  return (
    <div className="w-full px-2 pb-12 pt-22 sm:px-3">
      <div
        className={`mx-auto grid max-w-6xl items-start lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-8 ${
          sembunyikanAsideDiMobile ? "" : "gap-6"
        }`}
      >
        <div>
          <Link
            href={hub.href}
            aria-label={`Kembali ke ${hub.nama}`}
            className="group mb-4 inline-flex items-center gap-1.5 rounded text-sm font-semibold text-svarati-teal hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-svarati-teal"
          >
            <ArrowLeft
              className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            {hub.nama}
          </Link>

          <aside className={sembunyikanAsideDiMobile ? "hidden lg:block" : undefined}>
            <Card variant="teal" topBorder="teal" className="lg:p-7">
              {aside}
            </Card>
          </aside>
        </div>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}