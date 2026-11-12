import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { KEMBALI_PEMULIHAN as t } from "@/content/labels";

// Tombol "< Pemulihan" untuk halaman-halaman pilar Pemulihan, posisinya sama dengan Pohon Harapan:
// - HP/tablet: di atas konten
// - Desktop (lg): di ujung kiri, sejajar dengan badge di baris pertama konten
export default function BackToPemulihan() {
  return (
    <div className="relative mx-auto mb-4 w-full max-w-[84rem] lg:mb-0 lg:h-0">
      <Link
        href={t.href}
        aria-label={t.aria}
        className="inline-flex items-center gap-1 rounded-full py-2 pr-3 font-semibold text-svarati-coral-dark hover:text-svarati-coral-darker hover:underline lg:absolute lg:left-0 lg:-top-2.5"
      >
        <ChevronLeft className="size-5" strokeWidth={2.5} aria-hidden="true" />
        {t.label}
      </Link>
    </div>
  );
}
