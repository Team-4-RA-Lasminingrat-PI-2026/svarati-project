"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Heart, Mail, Send } from "lucide-react";
import Toast from "@/components/Toast";
import Modal from "@/components/modals/Modal"; // sesuaikan path jika berbeda
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // sesuaikan path jika berbeda
import { Label } from "@/components/ui/label";
import { Card, CardDescription, CardFooter } from "@/components/Card";
import { pemulihanContent as p } from "@/content/labels";
import Badge from "@/components/Badge";

const DESKRIPSI =
  "Kamu tidak sendirian... Temukan harapan dan kekuatan baru dengan membaca pesan dukungan dari komunitas Svarati di Tree of Hope. Kamu juga bisa memberikan dukungan dan semangatmu kepada komunitas Svarati!";

const PERAN = ["Penyintas", "Pendamping", "Keluarga", "Teman", "Aktivis"];

/* ============================================================
   DATA CONTOH TAMBAHAN (sementara)
   Dipakai hanya bila pesan awal dari labels kurang dari 12, agar tampilan awal
   punya 9 pesan berpratinjau + 3 amplop kecil. Hapus setelah data asli tersedia.
   ============================================================ */
const CONTOH = [
  { id: "contoh-1", teks: "Kamu sudah sangat berani sampai di titik ini. Pelan-pelan saja, setiap langkah kecil itu berarti.", penulis: "Teman • Yogyakarta", dukungan: 12 },
  { id: "contoh-2", teks: "Aku keluarga seorang penyintas. Kami belajar bahwa mendengarkan tanpa menghakimi adalah dukungan terbaik yang bisa kami berikan, dan itu dimulai dari percaya pada ceritanya.", penulis: "Keluarga • Medan", dukungan: 9 },
  { id: "contoh-3", teks: "Kamu tidak perlu kuat setiap hari. Boleh istirahat, dan kami di sini menemanimu.", penulis: "Aktivis • Makassar", dukungan: 15 },
  { id: "contoh-4", teks: "Pemulihan bukan garis lurus. Hari yang berat bukan berarti kamu mundur.", penulis: "Penyintas • Denpasar", dukungan: 7 },
  { id: "contoh-5", teks: "Terima kasih sudah bertahan. Ceritamu penting dan kamu berhak mendapatkan keadilan.", penulis: "Pendamping • Malang", dukungan: 21 },
  { id: "contoh-6", teks: "Aku di sini kalau kamu butuh teman cerita. Tidak ada yang perlu kamu jelaskan berlebihan.", penulis: "Teman • Samarinda", dukungan: 5 },
  { id: "contoh-7", teks: "Dulu aku takut bicara. Sekarang aku tahu suaraku berharga, dan suaramu juga.", penulis: "Penyintas • Surabaya", dukungan: 18 },
  { id: "contoh-8", teks: "Kami belajar mendampingi tanpa memaksa. Kamu yang menentukan langkahmu sendiri.", penulis: "Keluarga • Semarang", dukungan: 11 },
  { id: "contoh-9", teks: "Kamu tidak sendirian. Ada banyak orang yang percaya padamu dan siap membantu.", penulis: "Aktivis • Kupang", dukungan: 14 },
];
const MINIMAL_AWAL = 12;
const AWAL =
  p.pesan.length >= MINIMAL_AWAL
    ? p.pesan
    : [...p.pesan, ...CONTOH.slice(0, MINIMAL_AWAL - p.pesan.length)];

/* ============================================================
   EMPAT LEVEL PRATINJAU PESAN (desktop)
   besar (3 pesan terbaru) > sedang (3) > kecil (3) > hanya amplop (semua yang lebih lama)
   ============================================================ */
const LEVEL = [
  { lebar: "w-44", pad: "p-3.5", teks: "text-xs", foot: "text-[11px]", klamp: "line-clamp-4", penulis: true },
  { lebar: "w-36", pad: "p-3", teks: "text-[11px]", foot: "text-[10px]", klamp: "line-clamp-3", penulis: true },
  { lebar: "w-28", pad: "p-2.5", teks: "text-[10px]", foot: "text-[10px]", klamp: "line-clamp-2", penulis: false },
];
const PER_LEVEL = 3;
const JUMLAH_KOTAK = LEVEL.length * PER_LEVEL; // 9 pesan berpratinjau di halaman pertama
const PER_HALAMAN = 30;

/* ============================================================
   TATA LETAK POHON (desktop)

   Semua posisi memakai persen dari "peta pohon": kotak persegi setinggi area pohon,
   rata tengah, yang sejajar dengan gambar pohon. Karena skalanya mengikuti tinggi
   gambar, amplop tetap berada di daun pada ukuran layar yang berbeda.
   x = dari kiri (50 = tengah pohon), y = dari atas. Nilai boleh di bawah 0 atau di atas 100.

   Sembilan kotak pesan, urut dari level besar, sedang, lalu kecil:
   x, y   = titik tengah dan tepi atas kartu (tempat tali terikat)
   r      = kemiringan kartu (derajat)
   ex, ey = letak amplop kecil di daun (ubah agar amplop pindah, tali ikut menyesuaikan)
   ============================================================ */
const KOTAK = [
  // besar
  { x: 10, y: 10, r: -2, ex: 36, ey: 27 },
  { x: 7, y: 52, r: 1.5, ex: 31, ey: 50 },
  { x: 90, y: 8, r: 2, ex: 64, ey: 27 },
  // sedang
  { x: -15, y: 32, r: -1.5, ex: 32, ey: 39 },
  { x: 88, y: 36, r: 1.5, ex: 71, ey: 45 },
  { x: 10, y: 76, r: 1, ex: 38, ey: 60 },
  // kecil
  { x: -18, y: 60, r: 2, ex: 28, ey: 58 },
  { x: 112, y: 30, r: -2, ex: 69, ey: 36 },
  { x: 82, y: 74, r: 1.5, ex: 70, ey: 56 },
];
const TALI = 6; // panjang tali tegak di atas kartu (persen)

/* Daerah daun untuk amplop polos: setengah lebar tajuk pada tiap ketinggian
   (pasangan [y, setengah lebar]). Bentuknya mengikuti gambar: ujung atas sempit, lalu melebar. */
const LEBAR_TAJUK = [[12, 3], [20, 9], [30, 19], [40, 24], [50, 25.5], [60, 22], [64, 12]];

function setengahLebar(y) {
  for (let k = 1; k < LEBAR_TAJUK.length; k++) {
    const [y1, w1] = LEBAR_TAJUK[k - 1];
    const [y2, w2] = LEBAR_TAJUK[k];
    if (y <= y2) return w1 + ((w2 - w1) * (Math.max(y, y1) - y1)) / (y2 - y1);
  }
  return LEBAR_TAJUK[LEBAR_TAJUK.length - 1][1];
}

// Amplop polos tersebar di dalam daerah daun, dari tengah ke tepi (pesan lebih lama makin ke tepi).
// Pusat sebaran (50, 38), tinggi sebaran (20), dan faktor lebar (0.6) bisa disetel.
const POSISI_AMPLOP = Array.from({ length: PER_HALAMAN }, (_, i) => {
  const jarak = Math.sqrt((i + 0.5) / PER_HALAMAN);
  const sudut = i * 2.39996;
  const y = 38 + 20 * jarak * Math.sin(sudut);
  let x = 50 + setengahLebar(y) * 0.6 * jarak * Math.cos(sudut);
  // Hindari batang pohon di bagian bawah tajuk
  if (y > 46 && Math.abs(x - 50) < 8) x = 50 + (x >= 50 ? 8 : -8);
  return {
    x: Number(x.toFixed(1)),
    y: Number(y.toFixed(1)),
    rot: ((i * 37) % 31) - 15,
  };
});

// Garis coklat dari amplop ke atas kartu: melengkung, lalu tali tegak ke kartu.
// Titik ikat tali selalu di atas kartu dan tidak lebih rendah dari amplop.
function sambungan({ x, y, ex, ey }) {
  const ay = Math.min(ey, y - TALI);
  return { ay, d: `M ${ex} ${ey} Q ${(ex + x) / 2} ${ay - 4} ${x} ${ay}` };
}

const PANAH =
  "flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-svarati-lavender-light text-svarati-lavender-dark transition-colors hover:bg-svarati-lavender-hover disabled:pointer-events-none disabled:opacity-30";

export default function TreeOfHopePage() {
  const [scrolled, setScrolled] = useState(false);
  // Urutan array = urutan waktu input (terbaru di depan)
  const [daftar, setDaftar] = useState(AWAL);
  const [halaman, setHalaman] = useState(0);
  const [aktif, setAktif] = useState(null); // indeks pesan yang sedang dibaca
  const [arah, setArah] = useState(1);
  const [idBaru, setIdBaru] = useState(null); // pesan yang baru dikirim: tanda "Baru" + animasi masuk
  const [idPing, setIdPing] = useState(null); // isyarat saat pohon pertama muncul
  const [disukai, setDisukai] = useState({}); // id pesan yang sudah kamu beri love
  const [modalOpen, setModalOpen] = useState(false);
  const [pesan, setPesan] = useState("");
  const [peran, setPeran] = useState("");
  const [daerah, setDaerah] = useState("");
  const [error, setError] = useState(false);
  const [toast, setToast] = useState({ open: false, type: "sukses", message: "" });
  const mulaiX = useRef(null);
  const sudahIsyarat = useRef(false);

  const totalHalaman = Math.max(1, Math.ceil(daftar.length / PER_HALAMAN));
  const awalHalaman = halaman * PER_HALAMAN;
  const tampil = daftar.slice(awalHalaman, awalHalaman + PER_HALAMAN);
  // Desktop: 9 pesan berpratinjau di halaman pertama, sisanya amplop
  const kotak = halaman === 0 ? tampil.slice(0, JUMLAH_KOTAK) : [];
  const amplop = halaman === 0 ? tampil.slice(JUMLAH_KOTAK) : tampil;
  const geserAmplop = halaman === 0 ? JUMLAH_KOTAK : 0;
  // Mobile: 3 pesan terbaru sebagai kartu, sisanya amplop
  const kotakMobile = kotak.slice(0, PER_LEVEL);
  const amplopMobile = tampil.slice(kotakMobile.length);
  const terpilih = aktif !== null ? daftar[aktif] : null;

  // Kelas muncul setelah pohon naik
  const muncul = scrolled ? "visible opacity-100 delay-500" : "invisible opacity-0";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Isyarat sekali saat pohon pertama muncul: amplop pesan terbaru berdenyut beberapa detik
  useEffect(() => {
    if (!scrolled || sudahIsyarat.current) return;
    sudahIsyarat.current = true;
    setIdPing(daftar[0]?.id ?? null);
    setTimeout(() => setIdPing(null), 4000);
  }, [scrolled]);

  // Tanda "Baru" pada pesan yang baru dikirim hilang sendiri
  useEffect(() => {
    if (!idBaru) return;
    const t = setTimeout(() => setIdBaru(null), 5000);
    return () => clearTimeout(t);
  }, [idBaru]);

  function geser(delta) {
    setArah(delta);
    setAktif((i) => {
      if (i === null) return i;
      const n = i + delta;
      return n < 0 || n >= daftar.length ? i : n;
    });
  }

  // Panah kiri/kanan untuk pindah pesan, Esc untuk menutup
  useEffect(() => {
    if (aktif === null) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight") geser(1);
      if (e.key === "ArrowLeft") geser(-1);
      if (e.key === "Escape") setAktif(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [aktif, daftar.length]);

  function tutupModal() {
    setModalOpen(false);
    setError(false);
  }

  // Love bisa dibatalkan: klik sekali memberi dukungan, klik lagi membatalkannya
  function suka(id) {
    const sudah = !!disukai[id];
    setDisukai((d) => ({ ...d, [id]: !sudah }));
    setDaftar((d) =>
      d.map((m) => (m.id === id ? { ...m, dukungan: m.dukungan + (sudah ? -1 : 1) } : m))
    );
  }

  // Pesan baru masuk (dari formulir ini; nanti juga bisa dipanggil dari langganan realtime database)
  function tambahPesan(m) {
    setDaftar((d) => [m, ...d]);
    setHalaman(0);
    setIdBaru(m.id);
  }

  function kirim(e) {
    e.preventDefault();
    const teks = pesan.trim();
    const asal = daerah.trim();

    if (!teks) {
      setError(true);
      setToast({ open: true, type: "peringatan", message: "Tulis pesanmu dulu sebelum mengirim." });
      return;
    }

    tambahPesan({
      id: `baru-${Date.now()}`,
      teks,
      penulis: [peran || "Anonim", asal].filter(Boolean).join(" • "),
      peran,
      daerah: asal,
      dukungan: 0,
      waktu: Date.now(),
    });
    setPesan("");
    setPeran("");
    setDaerah("");
    setModalOpen(false);
    setToast({ open: true, type: "sukses", message: "Pesan anonimmu berhasil dikirim." });
  }

  return (
    // Padding atas dibuat lebih besar dari tinggi navbar (juga di mobile) agar judul tidak tertutup
    <div className="scroll-mt-28 px-2 pb-10 pt-22 sm:px-3">
      {/* DESKTOP: panggung yang menempel (sticky) di bawah navbar selama discroll */}
      <div className="relative hidden h-[170vh] lg:block">
        <div className="sticky top-32 h-[calc(100vh-7rem)]">
          <div className="relative mx-auto h-full max-w-5xl px-4">
            {/* Teks: besar di atas, lalu mengecil saat discroll */}
            <div
              className={`absolute inset-x-0 mx-auto max-w-4xl px-4 text-center transition-all duration-700 ease-out ${
                scrolled ? "top-0" : "top-[0%]"
              }`}
            >
              <Badge variant="coral" styleType="soft" className="mb-3">
                Dukungan Komunitas
              </Badge>
              <h1
                className={`text-balance font-bold leading-tight text-svarati-teal transition-all duration-700 ease-out ${
                  scrolled ? "text-3xl" : "text-4xl xl:text-5xl"
                }`}
              >
                Mari Bangkit Bersama Komunitas Svarati
              </h1>
              <p
                className={`mx-auto max-w-2xl leading-relaxed text-svarati-coral-dark/80 transition-all duration-700 ease-out ${
                  scrolled ? "mt-2 text-sm" : "mt-6 text-lg"
                }`}
              >
                {DESKRIPSI}
              </p>
            </div>

            {/* Area pohon: awalnya mengintip separuh dari bawah, naik penuh saat discroll */}
            <div
              className={`absolute inset-x-4 bottom-0 top-40 transition-transform duration-700 ease-out ${
                scrolled ? "translate-y-0" : "translate-y-[30%]"
              }`}
            >
              <Image
                src={p.gambar.src}
                alt={p.gambar.alt}
                fill
                sizes="700px"
                className="object-contain"
              />

              {/* Peta pohon: kotak persegi setinggi area pohon, rata tengah.
                  Amplop, garis, dan kartu diposisikan dalam persen kotak ini. */}
              <div
                className={`absolute left-1/2 top-0 aspect-square h-full -translate-x-1/2 transition-all duration-700 ${muncul}`}
              >
                {/* Garis coklat (amplop -> atas kartu -> tali) */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute inset-0 size-full overflow-visible"
                >
                  {kotak.map((m, i) => {
                    const { x, y } = KOTAK[i];
                    const { d, ay } = sambungan(KOTAK[i]);
                    return (
                      <g key={m.id} className="fill-none stroke-svarati-coral-darker/70">
                        <path
                          d={d}
                          strokeWidth="3"
                          strokeLinecap="round"
                          vectorEffect="non-scaling-stroke"
                        />
                        <line
                          x1={x}
                          y1={ay}
                          x2={x}
                          y2={y}
                          strokeWidth="1.5"
                          vectorEffect="non-scaling-stroke"
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Level 4: hanya amplop kecil tanpa garis, menempel di daun (semua pesan yang lebih lama) */}
                <ul>
                  {amplop.map((m, j) => {
                    const { x, y, rot } = POSISI_AMPLOP[j];
                    return (
                      <li key={m.id}>
                        <AmplopKecil
                          m={m}
                          onClick={() => setAktif(awalHalaman + geserAmplop + j)}
                          ping={m.id === idBaru || m.id === idPing}
                          masuk={m.id === idBaru}
                          className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                          style={{ left: `${x}%`, top: `${y}%`, rotate: `${rot}deg` }}
                        />
                      </li>
                    );
                  })}
                </ul>

                {/* Level 1-3: amplop kecil di daun + garis coklat + kotak pratinjau (besar, sedang, kecil) */}
                <ul>
                  {kotak.map((m, i) => {
                    const { x, y, r, ex, ey } = KOTAK[i];
                    const level = LEVEL[Math.floor(i / PER_LEVEL)];
                    const baru = m.id === idBaru;
                    return (
                      <li key={m.id}>
                        <AmplopKecil
                          m={m}
                          onClick={() => setAktif(awalHalaman + i)}
                          ping={baru || m.id === idPing}
                          masuk={baru}
                          className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                          style={{ left: `${ex}%`, top: `${ey}%` }}
                        />
                        <div
                          style={{ left: `${x}%`, top: `${y}%`, rotate: `${r}deg` }}
                          className={`absolute z-30 origin-top -translate-x-1/2 ${level.lebar} ${
                            baru ? "animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-700" : ""
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className="absolute -top-1 left-1/2 z-10 size-2.5 -translate-x-1/2 rounded-full border-2 border-svarati-coral-darker bg-white"
                          />
                          {baru && (
                            <span className="pointer-events-none absolute -right-2 -top-3 z-20 rounded-full bg-svarati-coral-dark px-2 py-0.5 text-[10px] font-bold text-white">
                              Baru
                            </span>
                          )}
                          <PesanCard
                            m={m}
                            liked={!!disukai[m.id]}
                            label={p.labelDukungan}
                            onSuka={suka}
                            onBuka={() => setAktif(awalHalaman + i)}
                            level={level}
                            pratinjau
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Amplop kosong untuk menulis pesan (sisi kanan, tidak menutupi pohon) dan navigasi halaman */}
              <div className={`transition-all duration-700 ${muncul}`}>
                <div className="absolute right-0 top-[68%] z-40 -translate-y-1/2">
                  <Amplop onClick={() => setModalOpen(true)} />
                </div>

                <div className="absolute inset-x-0 bottom-2 z-40">
                  <Pager halaman={halaman} total={totalHalaman} onChange={setHalaman} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE dan tablet: tanpa panggung, disusun ke bawah */}
      <div className="lg:hidden">
        <div className="text-center">
          <Badge variant="coral" styleType="soft" className="mb-3">
            Dukungan Komunitas
          </Badge>
          <h1 className="text-balance text-3xl font-bold leading-tight text-svarati-teal">
            Mari Bangkit Bersama Komunitas Svarati
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-svarati-coral-dark/80">{DESKRIPSI}</p>
        </div>

        <div className="relative mx-auto mt-6 aspect-square w-full max-w-sm">
          <Image
            src={p.gambar.src}
            alt={p.gambar.alt}
            fill
            sizes="90vw"
            className="object-contain"
          />
        </div>

        <div className="mt-4 flex justify-center">
          <Amplop onClick={() => setModalOpen(true)} />
        </div>

        {kotakMobile.length > 0 && (
          <ul className="mt-6 flex flex-col gap-3">
            {kotakMobile.map((m, i) => (
              <li key={m.id}>
                <PesanCard
                  m={m}
                  liked={!!disukai[m.id]}
                  label={p.labelDukungan}
                  onSuka={suka}
                  onBuka={() => setAktif(awalHalaman + i)}
                />
              </li>
            ))}
          </ul>
        )}

        {amplopMobile.length > 0 && (
          <>
            <p className="mt-6 text-xs font-semibold text-svarati-lavender-dark">
              Pesan lainnya, ketuk amplop untuk membaca
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {amplopMobile.map((m, j) => (
                <li key={m.id}>
                  <AmplopKecil
                    m={m}
                    onClick={() => setAktif(awalHalaman + kotakMobile.length + j)}
                    ping={m.id === idBaru || m.id === idPing}
                    masuk={m.id === idBaru}
                    className="relative"
                  />
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="mt-6">
          <Pager halaman={halaman} total={totalHalaman} onChange={setHalaman} />
        </div>
      </div>

      {/* Membaca pesan lengkap: panah kiri/kanan atau geser untuk pesan lain */}
      <Modal open={aktif !== null} onClose={() => setAktif(null)} size="md">
        {terpilih && (
          <div
            className="touch-pan-y p-6"
            onPointerDown={(e) => {
              mulaiX.current = e.clientX;
            }}
            onPointerCancel={() => {
              mulaiX.current = null;
            }}
            onPointerUp={(e) => {
              const awal = mulaiX.current;
              mulaiX.current = null;
              // Swipe hanya untuk sentuhan/pena; pengguna mouse memakai panah
              if (awal === null || e.pointerType === "mouse") return;
              const dx = e.clientX - awal;
              if (Math.abs(dx) > 60) geser(dx < 0 ? 1 : -1);
            }}
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-semibold text-svarati-lavender-dark">
                Pesan {aktif + 1} dari {daftar.length}
              </p>
              <button
                type="button"
                onClick={() => setAktif(null)}
                aria-label="Tutup"
                className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-svarati-lavender-light text-svarati-lavender-dark"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => geser(-1)}
                disabled={aktif === 0}
                aria-label="Pesan sebelumnya (lebih baru)"
                className={PANAH}
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>

              <div
                key={aktif}
                className={`min-w-0 flex-1 animate-in fade-in duration-300 ${
                  arah > 0 ? "slide-in-from-right-8" : "slide-in-from-left-8"
                }`}
              >
                <p className="max-h-[50vh] overflow-y-auto whitespace-pre-line break-words text-base italic leading-relaxed text-svarati-lavender-dark">
                  “{terpilih.teks}”
                </p>
                <div className="mt-4 flex items-center justify-between gap-2 text-sm">
                  <span className="text-svarati-lavender-dark">{terpilih.penulis}</span>
                  <TombolSuka
                    liked={!!disukai[terpilih.id]}
                    jumlah={terpilih.dukungan}
                    label={p.labelDukungan}
                    tampilLabel
                    ikon="size-4"
                    onClick={() => suka(terpilih.id)}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => geser(1)}
                disabled={aktif === daftar.length - 1}
                aria-label="Pesan berikutnya (lebih lama)"
                className={PANAH}
              >
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Formulir pesan: dibuka dari amplop kosong */}
      <Modal open={modalOpen} onClose={tutupModal} size="md">
        <form onSubmit={kirim} className="space-y-4 p-6">
          <h2 className="text-xl font-bold text-svarati-teal">Kirim pesan dukunganmu</h2>
          <p className="text-sm text-svarati-lavender-dark">
            Pesanmu akan tampil secara anonim di Tree of Hope.
          </p>

          <div className="space-y-1.5">
            <Label htmlFor="pesan-anonim" className="text-svarati-teal">
              Pesan
            </Label>
            <Input
              id="pesan-anonim"
              variant="textarea"
              tone="coral"
              value={pesan}
              onChange={(e) => {
                setPesan(e.target.value);
                setError(false);
              }}
              placeholder="Tulis pesan dukungan atau harapanmu di sini..."
              aria-invalid={error}
            />
          </div>

          <div className="space-y-1.5">
            <p id="label-peran" className="text-sm font-medium text-svarati-teal">
              Peran (opsional)
            </p>
            <div role="group" aria-labelledby="label-peran" className="flex flex-wrap gap-2">
              {PERAN.map((r) => (
                <button
                  key={r}
                  type="button"
                  aria-pressed={peran === r}
                  onClick={() => setPeran((sekarang) => (sekarang === r ? "" : r))}
                  className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                    peran === r
                      ? "border-svarati-teal bg-svarati-teal text-white"
                      : "border-svarati-lavender-border bg-card text-svarati-teal hover:bg-svarati-coral-soft"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="asal-daerah" className="text-svarati-teal">
              Asal daerah (opsional)
            </Label>
            <Input
              id="asal-daerah"
              tone="coral"
              value={daerah}
              onChange={(e) => setDaerah(e.target.value)}
              placeholder="Contoh: Bandung"
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="rounded-full px-7 font-bold"
              icon={<Send size={16} aria-hidden="true" />}
              iconPosition="right"
            >
              Kirim Pesan
            </Button>
            <Button type="button" variant="ghost" size="lg" className="rounded-full px-5" onClick={tutupModal}>
              Batal
            </Button>
          </div>
        </form>
      </Modal>

      <Toast
        open={toast.open}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        type={toast.type}
        message={toast.message}
      />
    </div>
  );
}

function Amplop({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative w-56 cursor-pointer overflow-hidden rounded-2xl border-2 border-svarati-coral bg-white px-5 pb-5 pt-14 text-center shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-12 bg-svarati-coral/25 [clip-path:polygon(0_0,100%_0,50%_100%)]"
      />
      <Mail className="mx-auto mb-2 size-6 text-svarati-coral-dark" aria-hidden="true" />
      <span className="block text-sm font-bold text-svarati-teal">
        Kirim pesan dukungan anonimmu sekarang!
      </span>
    </button>
  );
}

// Amplop kecil: tombol untuk membuka pesan di popup.
// ping = cincin berdenyut penanda pesan baru; masuk = animasi muncul. className harus memuat
// posisi ("absolute ..." di desktop, "relative" di mobile) agar cincin menempel pada amplop.
function AmplopKecil({ m, onClick, className = "", style, ping = false, masuk = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Buka pesan dari ${m.penulis}`}
      title={m.penulis}
      style={style}
      className={`flex size-7 cursor-pointer items-center justify-center rounded-md border border-svarati-coral-dark/60 bg-white shadow-md transition hover:z-50 hover:scale-125 ${
        masuk ? "animate-in fade-in zoom-in-50 duration-500" : ""
      } ${className}`}
    >
      {ping && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-1 animate-ping rounded-lg bg-svarati-coral/50"
        />
      )}
      <Mail className="relative size-4 text-svarati-coral-dark" aria-hidden="true" />
    </button>
  );
}

function Pager({ halaman, total, onChange }) {
  if (total <= 1) return null;

  const tombol =
    "rounded-full border border-svarati-coral/30 bg-white px-4 py-1.5 shadow-sm transition hover:bg-svarati-coral-soft disabled:pointer-events-none disabled:opacity-40";

  return (
    <div className="flex items-center justify-center gap-3 text-sm font-semibold text-svarati-teal">
      <button
        type="button"
        disabled={halaman === 0}
        onClick={() => onChange(halaman - 1)}
        className={tombol}
      >
        ‹ Lebih baru
      </button>
      <span>
        Halaman {halaman + 1} dari {total}
      </span>
      <button
        type="button"
        disabled={halaman === total - 1}
        onClick={() => onChange(halaman + 1)}
        className={tombol}
      >
        Lebih lama ›
      </button>
    </div>
  );
}

// Tombol love: berubah tampilan setelah di-love (hati terisi, merah, latar muda) dan bisa dibatalkan.
function TombolSuka({ liked, jumlah, label, onClick, tampilLabel = false, ikon = "size-3", className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={liked}
      aria-label={`${liked ? "Batalkan dukungan" : "Beri dukungan"}. Saat ini ${jumlah} ${label}`}
      className={`flex shrink-0 cursor-pointer items-center gap-1 whitespace-nowrap rounded-full px-1.5 py-0.5 font-bold transition hover:scale-110 active:scale-95 ${
        liked
          ? "bg-svarati-danger-soft text-svarati-danger"
          : "text-svarati-coral-dark hover:bg-svarati-coral-soft"
      } ${className}`}
    >
      <Heart
        aria-hidden="true"
        className={`${ikon} ${liked ? "animate-in zoom-in-50 fill-current duration-300" : ""}`}
      />
      {jumlah}
      {tampilLabel ? ` ${label}` : ""}
    </button>
  );
}

// Seluruh kartu bisa diklik (tombol transparan menutupi kartu); tombol love berada di atasnya.
// pratinjau = ukuran dan potongan teks mengikuti level (besar, sedang, kecil); tanpa pratinjau = kartu penuh.
function PesanCard({ m, label, onSuka, onBuka, level, pratinjau = false, liked = false }) {
  const l = level ?? LEVEL[0];
  return (
    <Card variant="white" size="sm" className={`rounded-2xl shadow-lg ${pratinjau ? l.pad : "p-3.5"}`}>
      <button
        type="button"
        onClick={onBuka}
        aria-label={`Baca pesan lengkap dari ${m.penulis}`}
        className="absolute inset-0 cursor-pointer rounded-2xl focus-visible:-outline-offset-3"
      />
      <CardDescription
        className={`break-words italic leading-relaxed text-svarati-lavender-dark ${
          pratinjau ? `${l.teks} ${l.klamp}` : "text-xs"
        }`}
      >
        “{m.teks}”
      </CardDescription>
      <CardFooter className={`mt-2 gap-2 pt-2 ${pratinjau ? l.foot : "text-[11px]"}`}>
        {!pratinjau || l.penulis ? (
          <span className="min-w-0 truncate text-svarati-lavender-dark">{m.penulis}</span>
        ) : (
          <span />
        )}
        <TombolSuka
          liked={liked}
          jumlah={m.dukungan}
          label={label}
          tampilLabel={!pratinjau}
          onClick={() => onSuka(m.id)}
          className="relative z-10"
        />
      </CardFooter>
    </Card>
  );
}
