import Image from "next/image";
import Link from "next/link";
import CountUp from "@/app/profile/components/CountUp";
import KasusBarChart from "@/app/profile/components/Kasusbarchart";

export const metadata = {
  title: "Tentang Svarati | Svarati",
};

const misi = [
  "Menjelaskan hukum dan hak perempuan dengan bahasa sehari-hari.",
  "Menghubungkan penyintas dengan layanan bantuan yang terverifikasi.",
  "Menyediakan alat bantu pemulihan yang bisa dipakai sendiri, kapan saja.",
  "Membuat bicara dan melapor terasa mungkin, tanpa menyalahkan korban.",
];

const pilar = [
  {
    label: "Preventif",
    judul: "Pahami Hakmu",
    garis: "bg-svarati-lavender",
    fitur: [
      {
        nama: "Edukasi Hak Perempuan",
        href: "/preventif",
        teks: "Apa saja yang termasuk kekerasan seksual menurut UU TPKS, dan apa hakmu sebagai korban.",
      },
    ],
  },
  {
    label: "Kuratif",
    judul: "Pendampingan",
    garis: "bg-svarati-teal",
    fitur: [
      {
        nama: "Cek Kondisimu",
        href: "/kuratif/self-assessment",
        teks: "Beberapa pertanyaan singkat untuk membantumu memahami situasimu.",
      },
      {
        nama: "Tanya Svarati AI",
        href: "/kuratif/svarati-ai",
        teks: "Tanyakan apa saja tanpa harus mencantumkan identitasmu.",
      },
      {
        nama: "Cari Layanan Terdekat",
        href: "/kuratif/help-directory",
        teks: "UPTD PPA, lembaga bantuan hukum, dan layanan psikologis di kotamu.",
      },
    ],
  },
  {
    label: "Rehabilitatif",
    judul: "Pemulihan",
    garis: "bg-svarati-coral",
    fitur: [
      {
        nama: "Jurnal Pemulihan",
        href: "/rehabilitatif/healing-journey",
        teks: "Tulis apa yang kamu rasakan. Catatan hanya tersimpan di perangkatmu.",
      },
      {
        nama: "Latihan Tenang",
        href: "/rehabilitatif/training",
        teks: "Latihan napas, musik relaxing, dan grounding singkat saat cemas datang.",
      },
      {
        nama: "Pohon Harapan",
        href: "/rehabilitatif/tree-of-hope",
        teks: "Baca dan tinggalkan pesan dukungan untuk sesama penyintas.",
      },
    ],
  },
];

const tim = [
  { nama: "Gabriella Pasaribu", foto: "/team-gaby.png" },
  { nama: "Lisa Oktarani", foto: "/team-lisa.png" },
  { nama: "Putu Sintha Atisya Armayanti", foto: "/team-sintha.png" },
  { nama: "Astrid Nurul Azizah", foto: "/team-astrid.png" },
];

function inisial(nama) {
  const kata = nama.split(" ");
  return (kata[0][0] + (kata[1]?.[0] ?? "")).toUpperCase();
}

// Label kecil di atas judul bagian.
function Label({ children, warna = "text-svarati-lavender-dark" }) {
  return (
    <p className={`text-xs font-bold uppercase tracking-[0.12em] ${warna}`}>{children}</p>
  );
}

// Ikon orang untuk statistik "1 dari 4".
function IkonOrang({ className }) {
  return (
    <svg viewBox="0 0 24 32" aria-hidden="true" className={className} fill="currentColor">
      <circle cx="12" cy="7" r="6" />
      <path d="M12 15c-5.5 0-10 4-10 9v8h20v-8c0-5-4.5-9-10-9z" />
    </svg>
  );
}

export default function TentangSvaratiPage() {
  return (
    <main>
      {/* 1. Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-16 pt-22 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <Label>Tentang Svarati</Label>
          <h1 className="mt-4 font-heading text-4xl font-bold leading-[1.15] text-svarati-teal md:text-5xl">
            Ruang aman untuk melangkah menuju pemulihan
          </h1>
          <p className="mt-6 max-w-xl leading-relaxed text-svarati-teal/80">
            Svarati adalah ruang aman bagi perempuan Indonesia, terutama korban atau penyintas
            kekerasan seksual, untuk memahami hak-haknya, menemukan bantuan terpercaya, dan
            melangkah menuju pemulihan secara aman.
          </p>
        </div>
        <Image
          src="/profile-imghero.png"
          alt="Ilustrasi dua perempuan duduk berdampingan, satu merangkul yang lain"
          width={2752}
          height={1536}
          priority
          className="h-auto w-full rounded-3xl"
        />
      </section>

      {/* 2. Urgensi */}
      <section className="lebar-penuh bg-svarati-teal-soft px-6 py-20 [--pad-x:1.5rem]">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-end">
            <h2 className="font-heading text-3xl font-bold leading-tight text-svarati-teal md:text-4xl">
              <CountUp to={38810} className="text-svarati-coral-dark" /> kasus tercatat
              sepanjang 2025.
            </h2>
            <p className="leading-relaxed text-svarati-teal/80">
              Itu baru yang dilaporkan. Survei nasional 2024 menemukan kurang dari 15% korban
              berani melapor, jadi kejadian sebenarnya jauh lebih banyak dari yang terlihat di
              grafik ini.
            </p>
          </div>

          <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-svarati-teal">
                Kasus kekerasan terhadap perempuan yang tercatat, 2016–2025
              </h3>
              <ul className="flex items-center gap-4 text-xs text-svarati-teal/70">
                <li className="flex items-center gap-1.5">
                  <span aria-hidden="true" className="size-2.5 rounded-sm bg-svarati-lavender" />
                  Tahun sebelumnya
                </li>
                <li className="flex items-center gap-1.5">
                  <span aria-hidden="true" className="size-2.5 rounded-sm bg-svarati-coral" />
                  Angka terbaru
                </li>
              </ul>
            </div>

            <KasusBarChart />

            <p className="mt-5 text-xs leading-relaxed text-svarati-teal/60">
              Sumber: Kementerian PPPA. Kenaikan bisa mencerminkan bertambahnya korban yang
              melapor, bukan hanya bertambahnya kejadian.
            </p>
          </div>

          <div className="mt-12 grid gap-10 md:grid-cols-2">
            <div>
              <div className="mb-4 flex items-end gap-1.5" aria-hidden="true">
                <IkonOrang className="h-9 text-svarati-coral" />
                <IkonOrang className="h-9 text-svarati-lavender" />
                <IkonOrang className="h-9 text-svarati-lavender" />
                <IkonOrang className="h-9 text-svarati-lavender" />
              </div>
              <p className="font-heading text-3xl font-bold text-svarati-teal">1 dari 4</p>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-svarati-teal/80">
                perempuan usia 15–64 tahun pernah mengalami kekerasan fisik dan/atau seksual.
              </p>
            </div>

            <div className="md:pt-13">
              <p className="font-heading text-3xl font-bold text-svarati-teal">
                <CountUp to={37.51} decimals={2} suffix="%" />
              </p>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-svarati-teal/80">
                dari perempuan yang mengalami kekerasan, mengalaminya dalam bentuk kekerasan
                seksual.
              </p>
            </div>
          </div>

          <p className="mt-10 text-xs text-svarati-teal/60">
            Sumber: Laporan Analisis Mendalam Survei Pengalaman Hidup Perempuan Nasional (SPHPN)
            2024.
          </p>
        </div>
      </section>

      {/* 3. Visi dan Misi */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 lg:grid-cols-2">
        <Image
          src="/profile-img2.png"
          alt="Ilustrasi seorang perempuan berhijab menutup wajah dengan kedua tangan"
          width={2752}
          height={1536}
          className="h-auto w-full rounded-3xl"
        />
        <div>
          <Label>Visi kami</Label>
          <p className="mt-3 text-lg leading-relaxed text-svarati-teal/80">
            Perempuan Indonesia bisa mengenali haknya, mencari bantuan, dan pulih tanpa rasa
            takut, tanpa merasa sendirian.
          </p>

          <div className="mt-10">
            <Label>Misi kami</Label>
            <ul className="mt-3">
              {misi.map((teks) => (
                <li
                  key={teks}
                  className="border-b border-svarati-teal/15 py-3.5 text-sm leading-relaxed text-svarati-teal/85 first:border-t"
                >
                  {teks}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Tiga pilar */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-end">
          <h2 className="font-heading text-3xl font-bold leading-tight text-svarati-teal md:text-4xl">
            Yang bisa kamu lakukan di Svarati
          </h2>
        </div>

        <Image
          src="/profile-img3.png"
          alt="Ilustrasi tiga perempuan berjalan dan berbincang bersama"
          width={2752}
          height={1536}
          className="mt-10 h-56 w-full rounded-3xl object-cover object-top md:h-72"
        />

        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {pilar.map((p) => (
            <div key={p.label}>
              <span aria-hidden="true" className={`block h-0.5 w-full ${p.garis}`} />
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-svarati-teal/60">
                {p.label}
              </p>
              <h3 className="mt-1 font-heading text-2xl font-bold text-svarati-teal">
                {p.judul}
              </h3>
              <ul className="mt-5 space-y-5">
                {p.fitur.map((f) => (
                  <li key={f.nama}>
                    <Link
                      href={f.href}
                      className="text-sm font-bold text-svarati-teal underline underline-offset-4 hover:text-svarati-coral-dark"
                    >
                      {f.nama}
                    </Link>
                    <p className="mt-1.5 text-sm leading-relaxed text-svarati-teal/75">
                      {f.teks}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Tim Pengembang */}
      <section className="lebar-penuh bg-svarati-teal-soft px-6 py-20 [--pad-x:1.5rem]">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="font-heading text-3xl font-bold leading-tight text-svarati-teal md:text-4xl">
              Tim Pengembangan Svarati
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-svarati-teal/80">
              <strong>Kelompok 4 – RA Lasminingrat</strong>
              <br/>Bootcamp Perempuan Indonesia 2026
            </p>
            <blockquote className="mt-6 rounded-2xl border border-svarati-teal/20 p-5">
              <p lang="en" className="text-lg font-medium italic leading-snug text-svarati-teal">
                From Silent Fear, To Empowered Voice
              </p>
            </blockquote>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {tim.map((anggota) => (
              <div
                key={anggota.nama}
                className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm"
              >
                <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-svarati-lavender-light">
                  {anggota.foto ? (
                    <Image
                      src={anggota.foto}
                      alt={`Foto ${anggota.nama}`}
                      fill
                      sizes="64px"
                      className="object-cover object-top"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="flex size-full items-center justify-center font-heading text-lg font-bold text-svarati-lavender-dark"
                    >
                      {inisial(anggota.nama)}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold leading-snug text-svarati-teal">
                  {anggota.nama}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
