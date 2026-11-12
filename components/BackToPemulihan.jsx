import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { KEMBALI_PEMULIHAN as t } from "@/content/labels";

// Tombol "< Pemulihan" di pojok kiri atas halaman-halaman pilar Pemulihan
// (gayanya sama dengan tombol kembali di Pohon Harapan)
export default function BackToPemulihan() {
  return (
    <div className="mx-auto mb-4 w-full max-w-[84rem]">
      <Link
        href={t.href}
        aria-label={t.aria}
        className="inline-flex items-center gap-1 rounded-full py-2 pr-3 font-semibold text-svarati-coral-dark hover:text-svarati-coral-darker hover:underline"
      >
        <ChevronLeft className="size-5" strokeWidth={2.5} aria-hidden="true" />
        {t.label}
      </Link>
    </div>
  );
}
