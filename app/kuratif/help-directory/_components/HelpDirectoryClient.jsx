"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Badge from "@/components/Badge";
import { Card } from "@/components/Card";
import { Button } from "@/components/ui/button";
import EmergencyAlert from "@/app/kuratif/help-directory/_components/EmergencyAlert.jsx";
import DirectoryFilter from "@/app/kuratif/help-directory/_components/DirectoryFilter.jsx";
import ServiceCard from "@/app/kuratif/help-directory/_components/ServiceCard.jsx";
import { DIREKTORI } from "@/content/labels";
import PaginationHelpDirectory from "@/app/kuratif/help-directory/_components/PaginationHelpDirectory.jsx";

const L = DIREKTORI;
const SEMUA = L.filter.semua;
const NASIONAL = L.filter.nilaiNasional;
const BATAS = 10;

const TIPE = {
  Pemerintah: { variant: "teal" },
  "Bantuan Hukum": { variant: "coral" },
  Medis: { variant: "teal" },
  Psikologis: { variant: "lavender" },
  "Lembaga Masyarakat": { variant: "lavender" },
};

const OPSI_TIPE = [SEMUA, ...Object.keys(TIPE)].map((t) => ({
  id: t,
  label: t,
}));

function buatParams({ cari, provinsi, kota, tipe }, halaman) {
  const p = new URLSearchParams();
  if (cari.trim()) p.set("cari", cari.trim());
  if (provinsi) p.set("provinsi", provinsi);
  if (kota) p.set("kota", kota);
  if (tipe !== SEMUA) p.set("tipe", tipe);
  if (halaman) {
    p.set("page", String(halaman));
    p.set("limit", String(BATAS));
  }
  return p;
}

async function ambilJson(url, opsi) {
  const res = await fetch(url, { cache: "no-store", ...opsi });
  if (!res.ok) throw new Error("Respons tidak berhasil");
  return res.json();
}

export default function HelpDirectoryClient({
  awal,
  provinsi: daftarProvinsi,
  gagal,
}) {
  // Filter
  const [cari, setCari] = useState("");
  const [cariTunda, setCariTunda] = useState("");
  const [provinsi, setProvinsi] = useState("");
  const [kota, setKota] = useState("");
  const [tipe, setTipe] = useState(SEMUA);

  // Data
  const [kotaData, setKotaData] = useState({ provinsi: "", daftar: [] });
  const [hasil, setHasil] = useState(awal.data);
  const [total, setTotal] = useState(awal.total);

  // Status
  const [memuat, setMemuat] = useState(false);

  const [galat, setGalat] = useState(gagal ? "muat" : null); // null | "muat" | "unduh"
  const [tampil, setTampil] = useState(false);

  const pertama = useRef(true);
  const kunciFilter = `${cariTunda}|${provinsi}|${kota}|${tipe}`;
  const [pilihan, setPilihan] = useState({ kunci: "", nomor: 1 });
  const halaman = pilihan.kunci === kunciFilter ? pilihan.nomor : 1;
  const totalHalaman = Math.ceil(total / BATAS);

  function pindahHalaman(nomor) {
    setPilihan({ kunci: kunciFilter, nomor });
  }

  // Animasi masuk
  useEffect(() => {
    window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => setTampil(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const muncul = (delay) =>
    `transition-all duration-700 ease-out ${delay} ${
      tampil ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
    }`;

  // Debounce kolom pencarian
  useEffect(() => {
    const t = setTimeout(() => setCariTunda(cari), 350);
    return () => clearTimeout(t);
  }, [cari]);

  // RLA049: ambil kota saat provinsi berubah
  useEffect(() => {
    if (!provinsi || provinsi === NASIONAL) return;

    const ctrl = new AbortController();
    ambilJson(`/api/cities?provinsi=${encodeURIComponent(provinsi)}`, {
      signal: ctrl.signal,
    })
      .then((j) => setKotaData({ provinsi, daftar: j.data }))
      .catch((e) => {
        if (e.name !== "AbortError") setKotaData({ provinsi, daftar: [] });
      });

    return () => ctrl.abort();
  }, [provinsi]);

  // RLA046: ambil daftar setiap filter atau halaman berubah
  useEffect(() => {
    if (pertama.current) {
      pertama.current = false; // data awal sudah dari server
      return;
    }
    const ctrl = new AbortController();
    setMemuat(true);
    setGalat(null);

    ambilJson(
      `/api/help-directory?${buatParams({ cari: cariTunda, provinsi, kota, tipe }, halaman)}`,
      { signal: ctrl.signal },
    )
      .then((j) => {
        setHasil(j.data);
        setTotal(j.total);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setGalat("muat");
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setMemuat(false);
      });

    return () => ctrl.abort();
  }, [cariTunda, provinsi, kota, tipe, halaman]);

  function ubahProvinsi(value) {
    setProvinsi(value);
    setKota("");
  }

  function resetFilter() {
    setCari("");
    setCariTunda("");
    setProvinsi("");
    setKota("");
    setTipe(SEMUA);
  }

  // RLA047: unduh CSV dari endpoint, lewat blob agar URL filter tidak tercatat di riwayat unduhan
  async function unduhCSV() {
    if (!window.confirm(L.csv.peringatan)) return;
    setGalat(null);
    try {
      const res = await fetch(
        `/api/help-directory/export?${buatParams({ cari, provinsi, kota, tipe })}`,
        { cache: "no-store" },
      );
      if (!res.ok) throw new Error("Gagal");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = L.csv.namaFile;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setGalat("unduh");
    }
  }

  const adaFilter = cari || provinsi || kota || tipe !== SEMUA;
  const daftarKota =
    provinsi && provinsi !== NASIONAL && kotaData.provinsi === provinsi
      ? kotaData.daftar
      : [];
  const tampilPetunjukNasional = provinsi && provinsi !== NASIONAL;
  const kosong = !galat && !memuat && hasil.length === 0;

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

          <h1
            className={`mb-3 mt-3 text-2xl font-extrabold text-svarati-teal sm:text-3xl ${muncul("delay-150")}`}
          >
            {L.judul}
          </h1>

          <p
            className={`text-sm leading-relaxed text-svarati-teal-dark sm:text-base ${muncul("delay-300")}`}
          >
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
          daftarProvinsi={daftarProvinsi}
          daftarKota={daftarKota}
          opsiTipe={OPSI_TIPE}
          jumlahHasil={total}
          adaFilter={adaFilter}
          onReset={resetFilter}
          onUnduh={unduhCSV}
        />

        {/* Hasil */}
        <div className={muncul("delay-700")}>
          <h2 className="sr-only">{L.hasil.judul}</h2>

          {galat && (
            <p
              role="alert"
              className="mb-4 rounded-xl bg-svarati-danger/10 p-4 text-sm text-svarati-danger-dark"
            >
              {galat === "unduh" ? L.csv.gagal : L.hasil.gagal}
            </p>
          )}

          {kosong ? (
            <div className="py-16 text-center text-svarati-lavender-dark">
              <p className="mb-3 text-4xl" aria-hidden="true">
                🔍
              </p>
              <p className="text-sm">{L.hasil.kosong}</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetFilter}
                className="mt-3"
              >
                {L.hasil.resetKosong}
              </Button>
            </div>
          ) : (
            <ul
              aria-busy={memuat}
              className={`grid items-start gap-4 transition-opacity sm:grid-cols-2 ${
                memuat ? "opacity-60" : ""
              }`}
            >
              {hasil.map((s) => (
                <li key={s.id}>
                  <ServiceCard
                    layanan={s}
                    badgeVariant={TIPE[s.tipe]?.variant ?? "lavender"}
                  />
                </li>
              ))}
            </ul>
          )}

          {/* Paginasi */}
          {hasil.length > 0 && (
            <div className="mt-6 flex flex-col items-center gap-3">
              <p aria-live="polite" className="text-xs text-svarati-teal-dark">
                {L.hasil.menampilkan(hasil.length, total)}
              </p>
              <PaginationHelpDirectory
                halaman={halaman}
                totalHalaman={totalHalaman}
                onUbah={pindahHalaman}
                disabled={memuat}
              />
            </div>
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
    </div>
  );
}
