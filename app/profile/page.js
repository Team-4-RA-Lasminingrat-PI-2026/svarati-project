import Image from "next/image";
import Badge from "@/components/Badge";
import CountUp from "@/app/profile/components/CountUp";
import KasusBarChart from "@/app/profile/components/Kasusbarchart";
import { Card, CardTitle, CardDescription } from "@/components/Card";

export const metadata = {
  title: "Tentang Kami | Svarati",
};

const urgensi = [
  {
    variant: "lavender",
    angka: { to: 37.51, decimals: 2, suffix: "%" },
    label: "perempuan yang mengalami kekerasan mengalaminya dalam bentuk kekerasan seksual.",
  },
  {
    variant: "teal",
    angka: { to: 4, prefix: "1 dari " },
    label: "perempuan usia 15–64 tahun pernah mengalami kekerasan fisik dan seksual.",
  },
  {
    variant: "danger",
    angka: { to: 15, prefix: "<", suffix: "%" },
    label: "korban yang berani melapor.",
  },
];

const misi = [
  "Menyediakan edukasi hukum dan hak perempuan dengan bahasa yang mudah dipahami.",
  "Menghubungkan penyintas dengan layanan bantuan yang terpercaya.",
  "Menemani proses pemulihan lewat alat bantu yang aman dan mudah diakses.",
  "Menumbuhkan keberanian untuk bicara dan melapor tanpa menyalahkan korban.",
];

const pilar = [
  {
    variant: "lavender",
    topBorder: "lavender",
    badge: "Preventif",
    judul: "Pahami Hakmu",
    deskripsi: "Edukasi & pencegahan",
    fitur: ["Edukasi Hak Perempuan"],
  },
  {
    variant: "teal",
    topBorder: "teal",
    badge: "Kuratif",
    judul: "Pendampingan",
    deskripsi: "Penanganan & bantuan",
    fitur: ["Cek Kondisimu", "Tanya Svarati AI", "Cari Layanan Terdekat"],
  },
  {
    variant: "coral",
    topBorder: "coral",
    badge: "Rehabilitatif",
    judul: "Pemulihan",
    deskripsi: "Pemulihan & dukungan jangka panjang",
    fitur: ["Jurnal Pemulihan", "Latihan Tenang", "Cerita dari Mereka"],
  },
];

const tim = [
  // Isi "foto" dengan path gambar di folder public, contoh: "/tim/gabriella.jpg"
  { nama: "Gabriella Pasaribu", foto: "/team-gaby.png" },
  { nama: "Lisa Oktarani", foto: "/team-lisa.png" },
  { nama: "Putu Sintha Atisya Armayanti", foto: "/team-sintha.png" },
  { nama: "Astrid Nurul Azizah", foto: "/team-astrid.png" },
];

function inisial(nama) {
  const kata = nama.split(" ");
  return (kata[0][0] + (kata[1]?.[0] ?? "")).toUpperCase();
}

export default function TentangKamiPage() {
  return (
    <main>
      {/* 1. Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-12 pt-22 lg:grid-cols-2">
        <div>
          <Badge variant="lavender">Tentang Kami</Badge>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-svarati-teal md:text-5xl">
            Svarati: Ruang aman untuk melangkah menuju pemulihan
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-svarati-teal/80">
            Svarati adalah ruang aman bagi perempuan Indonesia, terutama korban atau penyintas
            kekerasan seksual, untuk memahami hak-haknya, menemukan bantuan terpercaya, dan
            melangkah menuju pemulihan secara aman.
          </p>
        </div>
        <Image
          src="/profile-imghero.png"
          alt="Ilustrasi seorang perempuan duduk memeluk lutut di antara tanaman"
          width={2752}
          height={1536}
          priority
          className="h-auto w-full rounded-3xl"
        />
      </section>

      {/* 2. Urgensi */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="mb-8 text-center">
          <Badge variant="coral">Mengapa Svarati ada</Badge>
          <h2 className="mt-3 text-3xl font-bold text-svarati-teal">
            Kekerasan seksual masih sering tak terlaporkan
          </h2>
        </div>

        <Card variant="white" size="lg" className="mb-6">
          <CardTitle>Kasus kekerasan terhadap perempuan per tahun</CardTitle>
          <CardDescription className="mb-6">
            Jumlah kasus yang tercatat terus meningkat dari tahun ke tahun.
          </CardDescription>
          <KasusBarChart />
          <p className="mt-4 text-xs text-svarati-teal/70">Sumber: Kementerian PPPA</p>
        </Card>

        <div className="grid gap-6 md:grid-cols-3">
          {urgensi.map((item) => (
            <Card key={item.label} variant={item.variant} className="h-full">
              <CountUp
                {...item.angka}
                className="block font-heading text-4xl font-bold text-svarati-teal"
              />
              <CardDescription className="mt-3">{item.label}</CardDescription>
            </Card>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-svarati-teal/70">
          Sumber: Laporan Analisis Mendalam Survei Pengalaman Hidup Perempuan Nasional (SPHPN)
          2024
        </p>
      </section>

      {/* 3. Visi dan Misi */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-24 lg:grid-cols-2">
        <Image
          src="/profile-img2.png"
          alt="Ilustrasi seorang perempuan berhijab menutup wajah dengan kedua tangan"
          width={2752}
          height={1536}
          className="h-auto w-full rounded-3xl"
        />
        <div>
          <Badge variant="teal">Visi dan Misi</Badge>
          <h2 className="mt-3 text-3xl font-bold text-svarati-teal">Visi kami</h2>
          <p className="mt-3 text-lg leading-relaxed text-svarati-teal/80">
            Menjadi ruang aman yang dipercaya perempuan Indonesia untuk mengenali hak, mencari
            bantuan, dan pulih tanpa rasa takut dan tanpa merasa sendirian.
          </p>

          <h3 className="mt-8 text-2xl font-bold text-svarati-teal">Misi kami</h3>
          <ul className="mt-4 space-y-3">
            {misi.map((teks) => (
              <li key={teks} className="flex gap-3 text-svarati-teal/80">
                <span
                  aria-hidden="true"
                  className="mt-2 size-2 shrink-0 rounded-full bg-svarati-coral"
                />
                <span className="leading-relaxed">{teks}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. Tiga Pilar: banner gambar, kartu menumpuk di atasnya */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <Image
          src="/profile-img3.png"
          alt="Ilustrasi tiga perempuan berjalan dan berbincang bersama"
          width={2752}
          height={1536}
          className="h-64 w-full rounded-3xl object-cover object-top md:h-96"
        />

        <div className="relative -mt-16 px-2 md:-mt-24 md:px-8">
          <div className="mb-6 text-center">
            <Badge variant="lavender" styleType="white">
              Tiga pilar Svarati
            </Badge>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {pilar.map((p) => (
              <Card
                key={p.badge}
                variant={p.variant}
                topBorder={p.topBorder}
                className="h-full bg-white shadow-md"
              >
                <Badge variant={p.variant} className="mb-3">
                  {p.badge}
                </Badge>
                <CardTitle>{p.judul}</CardTitle>
                <CardDescription>{p.deskripsi}</CardDescription>
                <ul className="mt-4 space-y-2">
                  {p.fitur.map((f) => (
                    <li key={f} className="text-sm font-semibold text-svarati-teal">
                      {f}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Tim Pengembang */}
      <section className="bg-svarati-teal-soft px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <Badge variant="teal">Tim Pengembangan Website</Badge>
            <h2 className="mt-3 text-3xl font-bold text-svarati-teal">Kelompok 4 - RA Lasminingrat</h2>
            <p className="mt-2 text-svarati-teal/80">Bootcamp Perempuan Indonesia 2026</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tim.map((anggota) => (
              <Card key={anggota.nama} variant="white" className="h-full text-center">
                <div className="relative mx-auto mb-4 size-24 overflow-hidden rounded-full bg-svarati-lavender-light">
                  {anggota.foto ? (
                    <Image
                      src={anggota.foto}
                      alt={`Foto ${anggota.nama}`}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="flex size-full items-center justify-center font-heading text-2xl font-bold text-svarati-lavender-dark"
                    >
                      {inisial(anggota.nama)}
                    </span>
                  )}
                </div>
                <CardTitle className="mb-0 text-lg">{anggota.nama}</CardTitle>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}