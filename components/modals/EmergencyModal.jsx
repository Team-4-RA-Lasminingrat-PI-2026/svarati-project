"use client";

import Link from "next/link";
import { ArrowRight, Building2, MessageCircle, Phone, X, Zap } from "lucide-react";
import Modal from "@/components/modals/Modal";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DARURAT } from "@/content/labels";

export function kirimSOS() {
  const kirim = (lokasi) => {
    const pesan = `${DARURAT.sos.pesan}${lokasi ? DARURAT.sos.pesanLokasi(lokasi) : ""}`;
    window.location.href = `https://wa.me/?text=${encodeURIComponent(pesan)}`;
  };

  if (!navigator.geolocation) return kirim();

  navigator.geolocation.getCurrentPosition(
    (pos) =>
      kirim(`https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`),
    () => kirim()
  );
}

// Class umum untuk tombol telepon (dua baris teks, tinggi mengikuti isi)
const TELEPON_CLASS = "h-auto flex-col gap-0 py-3 text-white";

// Class umum untuk tombol berbentuk kartu (teks multi-baris, rata kiri)
const KARTU_CLASS =
  "h-auto justify-start gap-4 rounded-2xl p-4 text-left whitespace-normal";

export default function EmergencyModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} size="lg" bare label={DARURAT.modal.judul}>
    {/* Header tetap */}
      <div className="flex shrink-0 items-center justify-between border-b border-svarati-lavender-light p-6 pb-4">
        <div className="flex items-center gap-3">
          <Zap className="size-5 fill-current text-svarati-coral" />
          <h2 className="text-2xl font-bold text-svarati-teal">{DARURAT.modal.judul}</h2>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          aria-label={DARURAT.modal.ariaTutup}
          className="size-10 rounded-full border-0 bg-svarati-lavender-light p-0 text-svarati-lavender-dark hover:bg-svarati-lavender-hover"
        >
          <X className="size-5" />
        </Button>
      </div>
    
      {/* Isi yang tergulir */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-6">
      <p className="mt-4 text-svarati-lavender-dark">
          {DARURAT.modal.pembuka}
        </p>
        
        <div className="mt-4 grid grid-cols-2 gap-3">
          <a
            href={`tel:${DARURAT.nomor.pusat.nomor}`}
            className={cn(
              buttonVariants({ variant: "exit", size: "xl" }),
              TELEPON_CLASS
            )}
          >
            <span className="flex items-center justify-center gap-2 font-bold">
              <Phone className="size-4" /> {DARURAT.modal.telepon} {DARURAT.nomor.pusat.nomor}
            </span>
            <span className="block text-sm font-normal">{DARURAT.nomor.pusat.nama}</span>
          </a>
          <a
            href={`tel:${DARURAT.nomor.sapa.nomor}`}
            className={cn(
              buttonVariants({ variant: "exit", size: "xl" }),
              TELEPON_CLASS,
              "bg-svarati-danger-dark hover:bg-svarati-danger-darker"
            )}
          >
            <span className="flex items-center justify-center gap-2 font-bold">
              <Phone className="size-4" /> {DARURAT.modal.telepon} {DARURAT.nomor.sapa.nomor}
            </span>
            <span className="block text-sm font-normal">{DARURAT.nomor.sapa.nama}</span>
          </a>
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={kirimSOS}
          className={cn(
            KARTU_CLASS,
            "mt-4 w-full border-svarati-danger/20 bg-svarati-danger-soft text-svarati-danger-dark hover:bg-svarati-danger-soft/70"
          )}
        >
          <MessageCircle className="size-6 shrink-0" />
          <span className="flex-1">
            <span className="block font-bold">{DARURAT.sos.judul}</span>
            <span className="block text-sm font-normal">
              {DARURAT.sos.deskripsi}
            </span>
          </span>
          <ArrowRight className="size-5 shrink-0" />
        </Button>

        <Link
          href="/kuratif/help-directory"
          onClick={onClose}
          className={cn(
            buttonVariants({ variant: "ghost", size: "md" }),
            KARTU_CLASS,
            "mt-4 flex w-full border-svarati-teal/15 bg-svarati-teal-soft text-svarati-teal hover:bg-svarati-teal-soft/70"
          )}
        >
          <Building2 className="size-6 shrink-0" />
          <span className="flex-1">
            <span className="block font-bold">{DARURAT.modal.direktori.judul}</span>
            <span className="block text-sm font-normal text-svarati-teal-dark">
              {DARURAT.modal.direktori.deskripsi}
            </span>
          </span>
          <ArrowRight className="size-5 shrink-0" />
        </Link>

        <div className="mt-4 rounded-2xl border border-svarati-lavender bg-svarati-lavender-light p-4 text-sm text-svarati-lavender-dark">
          <p className="mb-2 font-bold">💡 {DARURAT.modal.judulTips}</p>
          <ul className="list-disc space-y-1 pl-5">
            {DARURAT.modal.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>

        <Button
          type="button"
          variant="soft"
          size="xl"
          fullWidth
          onClick={onClose}
          className="mt-4"
        >
          {DARURAT.modal.tutup}
        </Button>
      </div>
    </Modal>
  );
}