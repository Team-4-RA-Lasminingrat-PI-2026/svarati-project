"use client";

import Link from "next/link";
import { ArrowRight, Building2, MessageCircle, Phone, X, Zap } from "lucide-react";
import Modal from "@/components/modals/Modal";

function kirimSOS() {
  const kirim = (lokasi) => {
    const pesan = `Saya butuh bantuan darurat.${lokasi ? ` Lokasi saya: ${lokasi}` : ""}`;
    window.location.href = `https://wa.me/?text=${encodeURIComponent(pesan)}`;
  };

  if (!navigator.geolocation) return kirim();

  navigator.geolocation.getCurrentPosition(
    (pos) =>
      kirim(`https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`),
    () => kirim()
  );
}

export default function EmergencyModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} size="lg">
      <div className="max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between border-b border-svarati-lavender-light pb-4">
          <div className="flex items-center gap-3">
            <Zap className="size-5 fill-current text-svarati-coral" />
            <h2 className="text-2xl font-bold text-svarati-teal">Bantuan Darurat</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex size-10 items-center justify-center rounded-full bg-svarati-lavender-light text-svarati-lavender-dark"
          >
            <X className="size-5" />
          </button>
        </div>

        <p className="mt-4 text-svarati-lavender-dark">
          Pilih tindakan cepat saat kamu berada dalam situasi mendesak atau butuh bantuan:
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <a
            href="tel:112"
            className="block rounded-2xl bg-svarati-danger p-4 text-center text-white transition hover:bg-svarati-danger-dark"
          >
            <span className="flex items-center justify-center gap-2 font-bold">
              <Phone className="size-4" /> Telepon 112
            </span>
            <span className="block text-sm">Pusat Darurat</span>
          </a>
          <a
            href="tel:129"
            className="block rounded-2xl bg-svarati-danger-dark p-4 text-center text-white transition hover:bg-svarati-danger-darker"
          >
            <span className="flex items-center justify-center gap-2 font-bold">
              <Phone className="size-4" /> Telepon 129
            </span>
            <span className="block text-sm">SAPA KemenPPPA</span>
          </a>
        </div>

        <button
          type="button"
          onClick={kirimSOS}
          className="mt-4 flex w-full items-center gap-4 rounded-2xl border border-svarati-danger/20 bg-svarati-danger-soft p-4 text-left text-svarati-danger-dark"
        >
          <MessageCircle className="size-6 shrink-0" />
          <span className="flex-1">
            <span className="block font-bold">Kirim Pesan Darurat (Silent SOS)</span>
            <span className="block text-sm">
              Cara cepat buka Whatsapp dan kirim pesan "Saya butuh bantuan darurat" beserta lokasimu. Kamu hanya perlu memilih kontak penerima pesan dan menekan tombol kirim.
            </span>
          </span>
          <ArrowRight className="size-5 shrink-0" />
        </button>

        <Link
          href="/kuratif/direktori-bantuan"
          onClick={onClose}
          className="mt-4 flex items-center gap-4 rounded-2xl border border-svarati-teal/15 bg-svarati-teal-soft p-4 text-svarati-teal"
        >
          <Building2 className="size-6 shrink-0" />
          <span className="flex-1">
            <span className="block font-bold">Direktori Bantuan &amp; Rumah Aman</span>
            <span className="block text-sm text-svarati-teal-dark">
              Lihat lokasi layanan pendampingan terdekat
            </span>
          </span>
          <ArrowRight className="size-5 shrink-0" />
        </Link>

        <div className="mt-4 rounded-2xl border border-svarati-lavender bg-svarati-lavender-light p-4 text-sm text-svarati-lavender-dark">
          <p className="mb-2 font-bold">💡 Tips Keselamatan Ringkas:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Pindah ke area publik/keramaian jika situasi tidak aman.</li>
            <li>
              Pesan Darurat (Silent SOS) tersimpan di riwayat WhatsApp. Hapus chat jika perangkatmu mungkin
              dilihat orang lain dan membuatmu tidak aman.
            </li>
          </ul>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-2xl bg-svarati-lavender-light py-3 font-bold text-svarati-lavender-dark transition hover:bg-svarati-lavender-hover"
        >
          Tutup
        </button>
      </div>
    </Modal>
  );
}