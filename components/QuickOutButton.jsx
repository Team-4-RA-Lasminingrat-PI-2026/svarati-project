"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DARURAT } from "@/content/labels";

const QUICK_EXIT_URL = "https://www.google.com";

export default function QuickOutButton({ className = "" }) {
  const quickExit = () => window.location.replace(QUICK_EXIT_URL);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") quickExit();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <Button
      type="button"
      onClick={quickExit}
      aria-label={DARURAT.ariaKeluarCepat}
      className={`h-auto rounded-full bg-svarati-danger-dark px-4 py-2.5 text-xs font-bold tracking-wide text-white shadow-md hover:bg-svarati-danger-darker sm:text-sm ${className}`}
    >
      {DARURAT.keluarCepat}
    </Button>
  );
}