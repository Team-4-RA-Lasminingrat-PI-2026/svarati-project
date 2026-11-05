"use client";

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { Card } from "@/components/Card";
import { DARURAT } from "@/content/labels";

const ANCHOR_SELECTOR = "header nav > div:last-child > button";
const LEBAR_MAKS = 384; // setara max-w-sm
const MARGIN = 16; // jarak minimum ke tepi layar
const JARAK = 12; // jarak alert dari tombol
const PANAH = 12; // ukuran panah

export default function EmergencyAlert({ judul, isi, labelTutup }) {
  const [tampil, setTampil] = useState(false);
  const [pos, setPos] = useState(null);

  // Hitung posisi alert dari posisi tombol di navbar
  const hitungPosisi = useCallback(() => {
    const el = document.querySelector(ANCHOR_SELECTOR);
    if (!el) return false;

    const r = el.getBoundingClientRect();
    const lebar = Math.min(LEBAR_MAKS, window.innerWidth - MARGIN * 2);
    const pusatTombol = r.left + r.width / 2;

    // Alert berpusat di bawah tombol, tapi tidak keluar dari layar
    const left = Math.max(
      MARGIN,
      Math.min(pusatTombol - lebar / 2, window.innerWidth - lebar - MARGIN)
    );

    // Panah selalu menunjuk ke tengah tombol
    const panah = Math.max(24, Math.min(pusatTombol - left, lebar - 24));

    setPos({ top: r.bottom + JARAK, left, width: lebar, panah });
    return true;
  }, []);

  // Muncul setelah 400 ms, hilang otomatis setelah 10 detik
  useEffect(() => {
    const timerMuncul = setTimeout(() => {
      if (hitungPosisi()) setTampil(true);
    }, 400);
    const timerHilang = setTimeout(() => setTampil(false), 10400);

    return () => {
      clearTimeout(timerMuncul);
      clearTimeout(timerHilang);
    };
  }, [hitungPosisi]);

  // Ikuti perubahan ukuran layar
  useEffect(() => {
    if (!tampil) return;
    window.addEventListener("resize", hitungPosisi);
    return () => window.removeEventListener("resize", hitungPosisi);
  }, [tampil, hitungPosisi]);

  if (!tampil || !pos) return null;

  return (
    <div
      role="alert"
      style={{ top: pos.top, left: pos.left, width: pos.width }}
      className="fixed z-50 animate-in fade-in slide-in-from-top-2 duration-300"
    >
      {/* Panah penunjuk ke tombol Bantuan Darurat */}
      <span
        aria-hidden="true"
        style={{ left: pos.panah - PANAH / 2, width: PANAH, height: PANAH }}
        className="absolute -top-1.5 z-10 rotate-45 border-l border-t border-svarati-danger/20 bg-white"
      />

      <Card
        variant="danger"
        size="sm"
        className="relative rounded-2xl border-l-4 border-l-svarati-danger bg-white/95 p-4 shadow-2xl backdrop-blur-md"
      >
        <button
          type="button"
          onClick={() => setTampil(false)}
          className="absolute right-3 top-3 rounded-full p-1 text-svarati-danger-dark transition hover:bg-svarati-danger/10"
          aria-label={labelTutup}
        >
          <X className="size-4" aria-hidden="true" />
        </button>

        <p className="mb-1 pr-6 text-sm font-bold text-svarati-danger-dark">{judul}</p>
        <p className="mb-3 text-xs leading-relaxed text-svarati-danger-dark">{isi}</p>

        <div className="flex flex-wrap gap-2">
          <a
            href={`tel:${DARURAT.nomor.pusat.nomor}`}
            className="rounded-full bg-svarati-danger px-4 py-1.5 text-xs font-bold text-white transition hover:bg-svarati-danger-dark"
          >
            <span aria-hidden="true">📞</span> {DARURAT.nomor.pusat.nomor} {DARURAT.nomor.pusat.nama}
          </a>
          <a
            href={`tel:${DARURAT.nomor.sapa.nomor}`}
            className="rounded-full bg-svarati-danger-dark px-4 py-1.5 text-xs font-bold text-white transition hover:bg-svarati-danger-darker"
          >
            <span aria-hidden="true">📞</span> {DARURAT.nomor.sapa.nomor} {DARURAT.nomor.sapa.nama}
          </a>
        </div>
      </Card>
    </div>
  );
}