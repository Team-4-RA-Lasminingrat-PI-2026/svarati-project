"use client";

import { useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { DARURAT } from "@/content/labels";
import { LogOut } from "lucide-react";

const QUICK_EXIT_URL = "https://www.google.com";
const EXIT_FLAG = "svarati_exit";

export default function QuickOutButton({ className = "" }) {
  const quickExit = useCallback(() => {
    document.documentElement.style.display = "none";
    window.location.replace(QUICK_EXIT_URL);
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== "Escape"|| e.repeat)return;
      if (document.querySelector('[role="dialog"]')) return; // Escape menutup modal, bukan keluar
        quickExit();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [quickExit]);

  return (
    <Button
      type="button"
      onClick={quickExit}
      aria-label={DARURAT.ariaKeluarCepat}
      className={`h-auto gap-1.5 rounded-full border-2 border-white bg-svarati-danger-darker px-4 py-2.5 text-xs font-bold tracking-wide text-white shadow-md hover:bg-svarati-danger-dark sm:text-sm ${className}`}
    >
  <LogOut aria-hidden="true" className="size-4" />
      {DARURAT.keluarCepat}
    </Button>
  );
}