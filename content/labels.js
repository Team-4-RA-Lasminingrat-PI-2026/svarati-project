export const BRAND = {
  nama: "Svarati",
  tagline: "Safety · Voice · Healing",
  slogan: "Ruang aman untuk bersuara",
  tahun: 2026,
  catatanPrototipe: "Prototype bootcamp. Bukan layanan darurat, medis, atau hukum.",
};

export const MENU_UTAMA = [
  {
    id: "beranda",
    nama: "Beranda",
    href: "/",
  },
  {
    id: "pahami-hakmu",
    nama: "Pahami Hakmu",
    href: "/preventif",
    subtitle: "Preventif",
    deskripsi: "Edukasi & pencegahan",
    submenu: [
      { id: "edukasi-hukum", nama: "Edukasi Hukum", href: "/preventif/edu" },
      { id: "kuis-singkat", nama: "Kuis Singkat", href: "/preventif/quiz" },
      { id: "simulasi-batasan", nama: "Simulasi Batasan Diri", href: "/preventif/simulator" },
    ],
  },
  {
    id: "pendampingan",
    nama: "Pendampingan",
    href: "/kuratif",
    subtitle: "Kuratif",
    deskripsi: "Penanganan & bantuan",
    submenu: [
      { id: "cek-kondisi", nama: "Cek Kondisimu", href: "/kuratif/selfassessment" },
      { id: "cari-layanan", nama: "Cari Layanan Terdekat", href: "/kuratif/helpdirectory" },
      { id: "svarati-ai", nama: "Tanya Svarati AI", href: "/kuratif/AIsupport" },
    ],
  },
  {
    id: "pemulihan",
    nama: "Pemulihan",
    href: "/rehabilitatif",
    subtitle: "Rehabilitatif",
    deskripsi: "Pemulihan & dukungan jangka panjang",
    submenu: [
      { id: "jurnal-pemulihan", nama: "Jurnal Pemulihan", href: "/rehabilitatif/healingjourney" },
      { id: "latihan-tenang", nama: "Latihan Tenang", href: "/rehabilitatif/training" },
      { id: "cerita-dari-mereka", nama: "Cerita dari Mereka", href: "/rehabilitatif/treeofhope" },
    ],
  },
  {
    id: "tentang",
    nama: "Tentang Kami",
    href: "/tentang",
  },
];

export const DARURAT = {
  tombol: "Bantuan Darurat",
  tombolRingkas: "Bantuan",
  keluarCepat: "Keluar Cepat",
  ariaKeluarCepat: "Keluar cepat dari situs ini langsung ke halaman aman",

  nomor: {
    pusat: { nomor: "112", nama: "Pusat Darurat" },
    sapa: { nomor: "129", nama: "SAPA KemenPPPA" },
  },

  modal: {
    judul: "Bantuan Darurat",
    pembuka: "Pilih tindakan cepat saat kamu berada dalam situasi mendesak atau butuh bantuan:",
    telepon: "Telepon",
    judulTips: "Tips Keselamatan Ringkas:",
    tutup: "Tutup",
  },
  sos: {
    nama: "Silent SOS",
    judul: "Kirim Pesan Darurat (Silent SOS)",
    alert: "Menghubungkan ke Silent SOS...",
    mencariLokasi: "Mengambil lokasimu…",
    keterangan: "Membuka WhatsApp dengan pesan + lokasimu.",
  },
};

export const NAVBAR = {
  navigasiUtama: "Navigasi utama",
  bukaMenu: "Buka menu",
  logoAlt: "Logo",
  toggleSubmenu: (nama) => `Toggle ${nama} submenu`,
};

export const FOOTER = {
  kolomPerjalanan: "Perjalanan",
  kolomDarurat: "Bantuan Darurat",
  kolomKeamanan: "Keamanan Digital",
  deskripsiBrand: "Tanpa login, tanpa data identitas. Kamu bisa menjelajah tanpa membuat akun.",
  keamananAwal: "Gunakan fitur",
  keamananAkhir:
    "di bagian atas situs untuk langsung berpindah ke halaman aman. Gunakan mode penyamaran jika khawatir riwayat browser tersimpan.",
};