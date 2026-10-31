"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, X } from "lucide-react";
import Badge from "@/components/Badge";
import Tabs from "@/components/Tabs";
import { Card } from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/* ============================================================
   DATA CONTOH (sementara, nanti diganti database)
   ================================a============================ */
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

const TAB_TIPE = ["Semua", ...Object.keys(TIPE)].map((t) => ({ id: t, label: t }));

const SELECT_CLASS =
  "h-11 w-full cursor-pointer appearance-none rounded-lg border border-input bg-card px-4 pr-8 text-sm text-foreground outline-none transition-colors focus-visible:border-svarati-lavender-dark focus-visible:ring-3 focus-visible:ring-svarati-lavender/40 disabled:cursor-not-allowed disabled:opacity-50";

const telHref = (telepon) => telepon.replace(/[^0-9+]/g, "");

export default function HelpDirectoryPage() {
  const [cari, setCari] = useState("");
  const [provinsi, setProvinsi] = useState("");
  const [kota, setKota] = useState("");
  const [tipe, setTipe] = useState("Semua");
  const [tampil, setTampil] = useState(false);
  
  // State tambahan untuk pesan mengambang darurat
  const [showAlert, setShowAlert] = useState(false);

  // Mulai dari paling atas, jalankan animasi masuk, dan atur kemunculan serta timer 10 detik alert darurat
  useEffect(() => {
    window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => setTampil(true));
    
    const timerAlert = setTimeout(() => {
      setShowAlert(true);
    }, 400);

    const timerDismiss = setTimeout(() => {
      setShowAlert(false);
    }, 10400);

    return () => {
      cancelAnimationFrame(id);
      clearTimeout(timerAlert);
      clearTimeout(timerDismiss);
    };
  }, []);

  // Animasi masuk: muncul dari bawah sambil memudar
  const muncul = (delay) =>
    `transition-all duration-700 ease-out ${delay} ${
      tampil ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
    }`;

  const daftarKota = provinsi ? PROVINSI[provinsi] ?? [] : [];
  const adaFilter = cari || provinsi || kota || tipe !== "Semua";

  const hasil = LAYANAN.filter((s) => {
    const cocokTipe = tipe === "Semua" || s.tipe === tipe;
   const cocokLokasi =
      s.provinsi === "Seluruh Indonesia" ||
      ((!provinsi || s.provinsi === provinsi) && (!kota || s.kota === kota));
    const q = cari.trim().toLowerCase();
    const cocokCari =
      !q || [s.nama, s.alamat, s.kota].some((v) => v.toLowerCase().includes(q));
    return cocokTipe && cocokLokasi && cocokCari;
  });

  function resetFilter() {
    setCari("");
    setProvinsi("");
    setKota("");
    setTipe("Semua");
  }

  function unduhCSV() {
    const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
    const baris = hasil.map((s) =>
      [s.nama, s.tipe, s.provinsi, s.kota, s.alamat, s.telepon].map(esc).join(",")
    );
    const csv = ["Nama,Jenis,Provinsi,Kota,Alamat,Telepon", ...baris].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "direktori-bantuan-svarati.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="relative scroll-mt-28 px-2 pb-4 pt-28 sm:px-3 sm:pb-10 sm:pt-22">
      
      {/* Pesan Mengambang Darurat (Floating Alert) otomatis dari Navbar */}
      {showAlert && (
        <div className="fixed top-16 right-4 left-4 sm:left-200 sm:right-16 z-50 max-w-md animate-in fade-in slide-in-from-top-4 duration-300">
          <Card variant="danger" size="sm" className="relative rounded-2xl border-l-4 border-l-svarati-danger p-4 shadow-2xl bg-white/95 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setShowAlert(false)}
              className="absolute right-3 top-3 rounded-full p-1 text-svarati-danger-dark hover:bg-svarati-danger/10 transition"
              aria-label="Tutup pesan darurat">
              <X className="size-4" />
            </button>

            <p className="mb-1 text-sm font-bold text-svarati-danger-dark pr-6">
              Dalam situasi darurat?
            </p>

            <p className="mb-3 text-xs leading-relaxed text-svarati-danger-dark">
              Jangan tunggu daftar ini, hubungi langsung layanan darurat.
            </p>

            <div className="flex flex-wrap gap-2">
              <a href="tel:112"
                className="rounded-full bg-svarati-danger px-4 py-1.5 text-xs font-bold text-white transition hover:bg-svarati-danger-dark"
              >
                📞 112 Pusat Darurat
              </a>

              <a href="tel:129"
                className="rounded-full bg-svarati-danger-dark px-4 py-1.5 text-xs font-bold text-white transition hover:bg-svarati-danger-darker"
              >
                📞 129 SAPA KemenPPPA
              </a>
            </div>
          </Card>
        </div>
      )}

      <div className="mx-auto max-w-6xl">
        <Card variant="teal" size="lg" className="mb-6 p-6 sm:p-8">
          <Link href="/kuratif" className={`mb-4 flex w-fit items-center gap-1.5 text-sm font-semibold text-svarati-teal transition-colors hover:text-svarati-teal-dark ${muncul("")}`}>
          <ArrowLeft className="size-4" aria-hidden="true" />
            Kembali
          </Link>

          <Badge variant="teal" className={muncul("")}>
            Direktori Layanan Bantuan
          </Badge>

          <h1 className={`mb-3 mt-3 text-2xl font-extrabold text-svarati-teal sm:text-3xl ${muncul("delay-150")}`}>
            Temukan Bantuan Terdekat dari Lokasimu!
          </h1>

          <p className={`text-sm leading-relaxed text-svarati-teal-dark sm:text-base ${muncul("delay-300")}`}>
            Tidak perlu ragu untuk mencari bantuan. Puluhan lembaga pemerintah, swasta, maupun organisasi masyarakat siap membantumu. <br/> Temukan berbagai layanan dari lembaga bantuan hukum, psikologis, maupun medis di seluruh Indonesia pada fitur di bawah ini. <br/> Filter
            berdasarkan provinsi dan kota untuk menemukan layanan bantuan terdekat.
          </p>
        </Card>
        
        {/* Filter */}
        <div className={`mb-6 pt-2 ${muncul("delay-500")}`}>
          <Card variant="white" size="sm" className="rounded-2xl p-4 sm:p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-svarati-teal">
              Filter Lokasi &amp; Jenis
            </p>

            <div className="flex flex-col gap-3">
              <div>
                <Label htmlFor="cari-layanan" className="sr-only">
                  Cari nama lembaga atau kota
                </Label>
                <Input
                  id="cari-layanan"
                  tone="accent"
                  size="lg"
                  value={cari}
                  onChange={(e) => setCari(e.target.value)}
                  placeholder="Cari nama lembaga atau kota..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <Label htmlFor="pilih-provinsi" className="sr-only">
                    Provinsi
                  </Label>
                  <select
                    id="pilih-provinsi"
                    value={provinsi}
                    onChange={(e) => {
                      setProvinsi(e.target.value);
                      setKota("");
                    }}
                    className={SELECT_CLASS}
                  >
                    <option value="">Semua Provinsi</option>
                    {Object.keys(PROVINSI).map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-svarati-lavender-dark"
                  >
                    ▾
                  </span>
                </div>

                <div className="relative">
                  <Label htmlFor="pilih-kota" className="sr-only">
                    Kota
                  </Label>
                  <select
                    id="pilih-kota"
                    value={kota}
                    onChange={(e) => setKota(e.target.value)}
                    disabled={!provinsi}
                    className={SELECT_CLASS}
                  >
                    <option value="">Semua Kota</option>
                    {daftarKota.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-svarati-lavender-dark"
                  >
                    ▾
                  </span>
                </div>
              </div>

              {/* Tabs filter kategori (disusun per baris rapi menggunakan grid responsif) */}
              <Tabs
                tabs={TAB_TIPE}
                activeTab={tipe}
                onChange={setTipe}
                variant="teal"
                boxed={false}
                className="w-full [&>button]:grow [&>button]:text-center"
              />

              <div className="flex flex-wrap items-center justify-between gap-2">
                <p aria-live="polite" className="text-xs text-svarati-teal-dark">
                  {hasil.length} layanan ditemukan
                </p>
                <div className="flex items-center gap-3">
                  {adaFilter && (
                    <Button type="button" variant="ghost" size="sm" onClick={resetFilter}>
                      Reset Filter
                    </Button>
                  )}
                 <Button
                    type="button"
                    variant="tertiary"
                    size="sm"
                    icon={<Download className="size-3.5" aria-hidden="true" />}
                    onClick={unduhCSV}
                    className="text-xs font-semibold"
                  >
                    Unduh dokumen hasil pencarian (.csv)
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Hasil */}
        <h2 className="sr-only">Hasil pencarian</h2>
        {hasil.length === 0 ? (
          <div className="py-16 text-center text-svarati-lavender-dark">
            <p className="mb-3 text-4xl" aria-hidden="true">
              🔍
            </p>
            <p className="text-sm">Tidak ada layanan untuk filter ini.</p>
            <Button type="button" variant="ghost" size="sm" onClick={resetFilter} className="mt-3">
              Reset filter
            </Button>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {hasil.map((s) => (
              <li key={s.id}>
                <Card
                  variant="white"
                  size="sm"
                  className="h-full rounded-2xl p-5 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-1 flex flex-wrap items-start justify-between gap-2">
                    <h3 className="text-sm font-bold leading-snug text-svarati-teal">{s.nama}</h3>
                    <Badge variant={TIPE[s.tipe].variant}>{s.tipe}</Badge>
                  </div>

                  {s.nasional && (
                    <p className="mb-0.5 text-xs font-semibold text-svarati-coral-dark">
                      Layanan nasional
                    </p>
                  )}
                  <p className="text-xs text-svarati-lavender-dark">
                    📍 {s.alamat}, {s.kota}
                  </p>
                  <p className="mb-3 mt-0.5 text-xs font-semibold text-svarati-teal-light">
                    📞 {s.telepon}
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={`tel:${telHref(s.telepon)}`}
                      className="inline-block rounded-full bg-svarati-teal px-4 py-1.5 text-xs font-bold text-white transition hover:bg-svarati-teal-dark"
                    >
                      Hubungi Sekarang
                    </a>
                    {s.web && (
                      <a
                        href={s.web}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-svarati-lavender-dark underline"
                      >
                        Kunjungi situs
                      </a>
                    )}
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}