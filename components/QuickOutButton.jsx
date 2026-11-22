"use client";

import { useEffect, useCallback, useId } from "react";
import { Button } from "@/components/ui/button";
import { DARURAT } from "@/content/labels";
import { LogOut } from "lucide-react";

const QUICK_EXIT_URL = "https://translate.google.com/?hl=id";

export default function QuickOutButton({ className = "" }) {
  const tooltipId = useId();

  const quickExit = useCallback(() => {
    // 1. Tab baru tanpa riwayat: panah Back-nya kosong
    window.open(QUICK_EXIT_URL, "_blank", "noopener,noreferrer");
    // 2. Tab Svarati langsung dikosongkan dan diganti halaman netral
    document.documentElement.style.display = "none";
    window.location.replace(QUICK_EXIT_URL);
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== "Escape" || e.repeat) return;
      if (document.querySelector('[role="dialog"]')) return; // Escape menutup dialog, bukan keluar
      quickExit();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [quickExit]);

  return (
    <span className="group relative inline-flex">
      <Button
        type="button"
        onClick={quickExit}
        aria-label={DARURAT.ariaKeluarCepat}
        aria-describedby={tooltipId}
        className={`h-auto gap-1.5 rounded-full border-2 border-white bg-svarati-danger-darker px-4 py-2.5 text-xs font-bold tracking-wide text-white shadow-md hover:bg-svarati-danger-dark sm:text-sm ${className}`}
      >
        <LogOut aria-hidden="true" className="size-4" />
        <span className="max-[375px]:hidden">{DARURAT.keluarCepat}</span>
      </Button>

      <span
        id={tooltipId}
        role="tooltip"
        className="pointer-events-none absolute right-0 top-full z-50 mt-2 w-64 rounded-xl bg-[#0f4c5c] px-3.5 py-2.5 text-xs font-semibold leading-snug text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {DARURAT.tooltipKeluarCepat}
      </span>
    </span>
  );
}
