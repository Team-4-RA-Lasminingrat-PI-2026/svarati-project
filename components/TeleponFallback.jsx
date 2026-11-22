"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { DARURAT } from "@/content/labels";

const TUNGGU_MS = 1500; // waktu menunggu tanda bahwa aplikasi telepon terbuka
const TAMPIL_MS = 10000; // pesan hilang otomatis

export default function TeleponFallback() {
  const [nomor, setNomor] = useState(null);
  const popoverRef = useRef(null);
  const cekRef = useRef(null);

  // Dengarkan semua klik di situs
  useEffect(() => {
    const onClick = (e) => {
      const tautan = e.target.closest?.('a[href^="tel:"]');
      if (!tautan) return;
      // Di HP, tel: berjalan normal. Hanya periksa perangkat tanpa layar sentuh.
      if (window.matchMedia("(pointer: coarse)").matches) return;

      const nomorTelepon = decodeURIComponent(
        tautan.getAttribute("href").slice(4)
      ).trim();

      navigator.clipboard?.writeText(nomorTelepon).catch(() => {});
      setNomor(null);

      // Jika aplikasi terbuka, jendela browser biasanya kehilangan fokus
      // atau tab menjadi tersembunyi.
      cekRef.current?.abort();
      const kontrol = new AbortController();
      cekRef.current = kontrol;
      let aplikasiTerbuka = false;
      const tandai = () => {
        aplikasiTerbuka = true;
      };
      window.addEventListener("blur", tandai, { signal: kontrol.signal });
      document.addEventListener("visibilitychange", tandai, {
        signal: kontrol.signal,
      });

      setTimeout(() => {
        if (kontrol.signal.aborted) return;
        kontrol.abort();
        if (!aplikasiTerbuka) setNomor(nomorTelepon);
      }, TUNGGU_MS);
    };

    // Fase capture agar tetap jalan walau ada stopPropagation di komponen lain
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      cekRef.current?.abort();
    };
  }, []);

  // Tampilkan di top layer (di atas modal) lalu hilangkan otomatis
  useEffect(() => {
    if (!nomor) return;
    try {
      popoverRef.current?.showPopover?.();
    } catch {}
    const t = setTimeout(() => setNomor(null), TAMPIL_MS);
    return () => clearTimeout(t);
  }, [nomor]);

  if (!nomor) return null;

  return (
    <div
      ref={popoverRef}
      popover="manual"
      role="alert"
      className="pointer-events-auto fixed inset-auto bottom-4 left-1/2 m-0 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-start gap-3 rounded-2xl border-0 bg-svarati-danger-darker p-4 text-sm font-semibold text-white shadow-lg"
    >
      <p className="flex-1 leading-snug">{DARURAT.teleponDesktop(nomor)}</p>
      <button
        type="button"
        onClick={() => setNomor(null)}
        aria-label={DARURAT.tutupPemberitahuan}
        className="shrink-0 rounded-full p-1 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-white"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}