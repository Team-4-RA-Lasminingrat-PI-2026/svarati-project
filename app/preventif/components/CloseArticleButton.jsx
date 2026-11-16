"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { educationContent as edu } from "@/content/labels";

const ANCHOR = "daftar-artikel";

export default function CloseArticleButton() {
  const router = useRouter();

  const close = () => {
    let last = null;
    try {
      last = sessionStorage.getItem("edu:last-list");
    } catch {
      // abaikan
    }

    // Ada daftar terakhir: kembali ke sana (filter dan halaman terjaga).
    // Tidak ada (artikel dibuka dari link langsung): ke halaman utama edukasi.
    const target = last && last.startsWith(edu.basePath) ? `${last}#${ANCHOR}` : edu.basePath;
    router.push(target);
  };

  return (
    <button
      type="button"
      onClick={close}
      aria-label={edu.detail.back}
      title={edu.detail.back}
      className="flex size-11 items-center justify-center rounded-xl bg-svarati-cream text-svarati-teal transition hover:bg-svarati-lavender-light"
    >
      <X className="size-5" aria-hidden="true" />
    </button>
  );
}