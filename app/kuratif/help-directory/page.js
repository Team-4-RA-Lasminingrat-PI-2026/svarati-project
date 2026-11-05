"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Badge from "@/components/Badge";
import { Card } from "@/components/Card";
import { Button } from "@/components/ui/button";
import EmergencyAlert from "./_components/EmergencyAlert";
import DirectoryFilter from "./_components/DirectoryFilter";
import ServiceCard from "./_components/ServiceCard";
import { DIREKTORI } from "@/content/labels";

const L = DIREKTORI;
const SEMUA = L.filter.semua;
const NASIONAL = L.filter.nilaiNasional;

/* ============================================================
   DATA CONTOH (sementara, nanti diganti database)
   ============================================================ */
const PROVINSI = {
  "DKI Jakarta": ["Jakarta Pusat", "Jakarta Timur", "Jakarta Selatan", "Jakarta Utara", "Jakarta Barat"],
  "Jawa Barat": ["Bandung", "Bogor", "Depok", "Bekasi", "Cirebon", "Sukabumi"],
  "Jawa Tengah": ["Semarang", "Solo", "Magelang", "Pekalongan"],
  "D.I. Yogyakarta": ["Kota Yogyakarta", "Sleman", "Bantul", "Gunung Kidul", "Kulon Progo"],
  "Jawa Timur": ["Surabaya", "Malang", "Sidoarjo", "Gresik", "Jember"],
  Bali: ["Denpasar", "Badung", "Gianyar", "Tabanan", "Karangasem"],
  "Sumatera Utara": ["Medan", "Deli Serdang", "Binjai", "Pematang Siantar"],
  "Sulawesi Selatan": ["Makassar", "Gowa", "Maros", "Bone"],
  "Kalimantan Timur": ["Samarinda", "Balikpapan", "Bontang", "Kutai Kartanegara"],
  NTT: ["Kupang", "Ende", "Flores", "Timor Tengah Selatan"],
};

const LAYANAN = [
  // Kementerian dan lembaga nasional
  { id: "kemenpppa", nama: "Kementerian PPPA (Layanan SAPA 129)", tipe: "Pemerintah", alamat: "Jl. Medan Merdeka Barat No. 15", kota: "Jakarta Pusat", provinsi: "DKI Jakarta", telepon: "129", web: "https://www.kemenpppa.go.id", nasional: true },
  { id: "komnas-perempuan", nama: "Komnas Perempuan", tipe: "Pemerintah", alamat: "Jl. Latuharhary No. 4B, Menteng", kota: "Jakarta Pusat", provinsi: "DKI Jakarta", telepon: "(021) 3903963", web: "https://komnasperempuan.go.id", nasional: true },
  { id: "lpsk", nama: "LPSK (Lembaga Perlindungan Saksi dan Korban)", tipe: "Pemerintah", alamat: "Jl. Raya Bogor Km. 24 No. 47-49, Susukan, Ciracas", kota: "Jakarta Timur", provinsi: "DKI Jakarta", telepon: "148", web: "https://www.lpsk.go.id", nasional: true },
  { id: "kemensos", nama: "Kementerian Sosial (Contact Center 171)", tipe: "Pemerintah", alamat: "Jl. Salemba Raya No. 28", kota: "Jakarta Pusat", provinsi: "DKI Jakarta", telepon: "171", web: "https://kemensos.go.id", nasional: true },
  { id: "kemenkes", nama: "Kementerian Kesehatan (Halo Kemenkes)", tipe: "Pemerintah", alamat: "Jl. H.R. Rasuna Said Blok X5 Kav. 4-9, Kuningan", kota: "Jakarta Selatan", provinsi: "DKI Jakarta", telepon: "1500-567", web: "https://kemkes.go.id", nasional: true },
  { id: "polri", nama: "Kepolisian RI (Layanan 110)", tipe: "Pemerintah", alamat: "Kantor polisi terdekat", kota: "Seluruh Indonesia", provinsi: "Seluruh Indonesia", telepon: "110", nasional: true },
  // Lembaga daerah
  { id: "lbh-apik-jakarta", nama: "LBH APIK Jakarta", tipe: "Bantuan Hukum", alamat: "Jl. Raya Tengah No.10", kota: "Jakarta Timur", provinsi: "DKI Jakarta", telepon: "(021) 877 97232" },
  { id: "lbh-jakarta", nama: "LBH Jakarta", tipe: "Bantuan Hukum", alamat: "Jl. Diponegoro No.74", kota: "Jakarta Pusat", provinsi: "DKI Jakarta", telepon: "(021) 3145 518" },
  { id: "yayasan-pulih", nama: "Yayasan Pulih", tipe: "Psikologis", alamat: "Jl. Teluk Peleng No.63A", kota: "Jakarta Utara", provinsi: "DKI Jakarta", telepon: "(021) 6584 7511" },
  { id: "rscm", nama: "RSUPN Dr. Cipto Mangunkusumo", tipe: "Medis", alamat: "Jl. Diponegoro No.71", kota: "Jakarta Pusat", provinsi: "DKI Jakarta", telepon: "(021) 500 135" },
  { id: "lbh-bandung", nama: "LBH Bandung", tipe: "Bantuan Hukum", alamat: "Jl. Jawa No.14", kota: "Bandung", provinsi: "Jawa Barat", telepon: "(022) 423 7146" },
  { id: "lrc-kjham", nama: "LRC-KJHAM Semarang", tipe: "Lembaga Masyarakat", alamat: "Jl. Tlogosari Raya I No.39", kota: "Semarang", provinsi: "Jawa Tengah", telepon: "(024) 671 0071" },
  { id: "rifka-annisa", nama: "Rifka Annisa Women's Crisis Center", tipe: "Lembaga Masyarakat", alamat: "Jl. Jambon IV/Ringin Putih, Gamping", kota: "Sleman", provinsi: "D.I. Yogyakarta", telepon: "(0274) 623 703" },
  { id: "p2tp2a-yogyakarta", nama: "P2TP2A Kota Yogyakarta", tipe: "Pemerintah", alamat: "Jl. Kenari No.56", kota: "Kota Yogyakarta", provinsi: "D.I. Yogyakarta", telepon: "(0274) 515 865" },
];

const TIPE = {
  "Pemerintah": { variant: "teal", className: "text-svarati-teal-darker" },
  "Bantuan Hukum": { variant: "coral" },
  "Medis": { variant: "teal" },
  "Psikologis": { variant: "lavender" },
  "Lembaga Masyarakat": { variant: "lavender" },
};

const OPSI_TIPE = [SEMUA, ...Object.keys(TIPE)].map((t) => ({ id: t, label: t }));

export default function HelpDirectoryPage() {
  const [cari, setCari] = useState("");
  const [provinsi, setProvinsi] = useState("");
  const [kota, setKota] = useState("");
  const [tipe, setTipe] = useState(SEMUA);
  const [tampil, setTampil] = useState(false);

  // Mulai dari paling atas dan jalankan animasi masuk
  useEffect(() => {
    window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => setTampil(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Animasi masuk: muncul dari bawah sambil memudar
  const muncul = (delay) =>
    `transition-all duration-700 ease-out ${delay} ${
      tampil ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
    }`;

  const daftarKota =
    provinsi && provinsi !== NASIONAL ? PROVINSI[provinsi] ?? [] : [];
  const adaFilter = cari || provinsi || kota || tipe !== SEMUA;

  const q = cari.trim().toLowerCase();

  const hasil = LAYANAN.filter((s) => {
    const cocokTipe = tipe === SEMUA || s.tipe === tipe;

    const cocokCari =
      !q || [s.nama, s.alamat, s.kota].some((v) => (v ?? "").toLowerCase().includes(q));

    let cocokLokasi;
    if (!provinsi) {
      cocokLokasi = true; // semua lokasi
    } else if (provinsi === NASIONAL) {
      cocokLokasi = Boolean(s.nasional); // hanya layanan pusat
    } else {
      // provinsi biasa: hanya layanan daerah yang cocok
      cocokLokasi = !s.nasional && s.provinsi === provinsi && (!kota || s.kota === kota);
    }

    return cocokTipe && cocokCari && cocokLokasi;
  });

  // Saat belum memilih lokasi, layanan nasional tampil di atas
  if (!provinsi) {
    hasil.sort((a, b) => Number(Boolean(b.nasional)) - Number(Boolean(a.nasional)));
  }

  const tampilPetunjukNasional = provinsi && provinsi !== NASIONAL;

  function ubahProvinsi(value) {
    setProvinsi(value);
    setKota("");
  }

  function resetFilter() {
    setCari("");
    setProvinsi("");
    setKota("");
    setTipe(SEMUA);
  }

  function unduhCSV() {
    if (!window.confirm(L.csv.peringatan)) return;

    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const baris = hasil.map((s) =>
      [s.nama, s.tipe, s.provinsi, s.kota, s.alamat, s.telepon].map(esc).join(",")
    );
    const csv = [L.csv.header.join(","), ...baris].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = L.csv.namaFile;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="relative scroll-mt-28 px-2 pb-4 pt-28 sm:px-3 sm:pb-10 sm:pt-22">
      <EmergencyAlert
        judul={L.alert.judul}
        isi={L.alert.isi}
        labelTutup={L.alert.tutup}
      />

      <div className="mx-auto max-w-6xl">
        <Card variant="teal" size="lg" className="mb-6 p-6 sm:p-8">
          <Link
            href={L.back.href}
            className={`mb-4 flex w-fit items-center gap-1.5 text-sm font-semibold text-svarati-teal transition-colors hover:text-svarati-teal-dark ${muncul("")}`}
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            {L.back.label}
          </Link>

          <Badge variant="teal" className={muncul("")}>
            {L.badge}
          </Badge>

          <h1 className={`mb-3 mt-3 text-2xl font-extrabold text-svarati-teal sm:text-3xl ${muncul("delay-150")}`}>
            {L.judul}
          </h1>

          <p className={`text-sm leading-relaxed text-svarati-teal-dark sm:text-base ${muncul("delay-300")}`}>
            {L.deskripsi.map((teks, i) => (
              <span key={i} className="block">
                {teks}
              </span>
            ))}
          </p>
        </Card>

        <DirectoryFilter
          className={`mb-6 pt-2 ${muncul("delay-500")}`}
          cari={cari}
          onCariChange={setCari}
          provinsi={provinsi}
          onProvinsiChange={ubahProvinsi}
          kota={kota}
          onKotaChange={setKota}
          tipe={tipe}
          onTipeChange={setTipe}
          daftarProvinsi={Object.keys(PROVINSI)}
          daftarKota={daftarKota}
          opsiTipe={OPSI_TIPE}
          jumlahHasil={hasil.length}
          adaFilter={adaFilter}
          onReset={resetFilter}
          onUnduh={unduhCSV}
        />

        {/* Hasil */}
        <h2 className="sr-only">{L.hasil.judul}</h2>

        {hasil.length === 0 ? (
          <div className="py-16 text-center text-svarati-lavender-dark">
            <p className="mb-3 text-4xl" aria-hidden="true">
              🔍
            </p>
            <p className="text-sm">{L.hasil.kosong}</p>
            <Button type="button" variant="ghost" size="sm" onClick={resetFilter} className="mt-3">
              {L.hasil.resetKosong}
            </Button>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {hasil.map((s) => (
              <li key={s.id}>
                <ServiceCard layanan={s} badgeVariant={TIPE[s.tipe].variant} />
              </li>
            ))}
          </ul>
        )}

        {/* Petunjuk agar tidak ada jalan buntu */}
        {tampilPetunjukNasional && (
          <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-svarati-teal-dark">
            <p>{L.hasil.petunjukNasional}</p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => ubahProvinsi(NASIONAL)}
            >
              {L.hasil.lihatNasional}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}