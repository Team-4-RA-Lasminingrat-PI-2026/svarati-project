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
      { id: "cari-layanan", nama: "Cari Layanan Terdekat", href: "/kuratif/help-directory" },
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

// Semua teks & gambar hero ada di sini. Warna mengikuti globals.css (palet Svarati).

export const heroContent = {
  // tone: "primary" = teal, "secondary" = lavender gelap
  headline: [
    { text: "Pahami Hakmu,", tone: "primary" },
    { text: "Temukan Amanmu", tone: "secondary" },
  ],

  description:
    "Svarati adalah ruang pribadi bagi perempuan Indonesia untuk memahami hak-haknya, menemukan bantuan terpercaya, dan melangkah menuju pemulihan secara aman.",

  optionsLabel: "Apa yang kamu butuhkan saat ini?",
 options: [
  { label: "Saya butuh bantuan darurat sekarang", href: "/EmergencyModal", variant: "exit" },
  { label: "Saya ingin tahu apakah yang saya alami termasuk kekerasan", href: "/kuratif", variant: "secondary" },
  { label: "Saya hanya butuh ruang tenang dan tempat bercerita", href: "/rehabilitatif", variant: "primary" },
  { label: "Hanya ingin mencari tahu? Jelajahi edukasi", href: "/preventif", variant: "tertiary" },
],

  footnote: "*Seluruh akses dijamin anonim tanpa perlu mendaftar akun.",

  // Ganti dengan gambar 
  image: {
    src: "/image3.jpg",
    alt: "Perempuan",
    position: "40% 60%",
    zoom: 1,
  },
};

export const layananContent = {
  judul: "Apa yang Bisa Kamu Temukan di Svarati?",
  subjudul: "Tiga jalur dukungan yang dirancang untuk berbagai tahap kebutuhan.",
  items: [
    {
      id: "preventif",
      href: "/preventif",
      variant: "lavender",
      badge: "Pahami Hakmu",
      judul: "Edukasi & Simulasi Interaktif",
      deskripsi:
        "Pelajari hak-hakmu, kesehatan reproduksi, perlindungan hukum, dan simulator interaktif.",
      cta: "Buka Edukasi",
      gambar: "/preventif1.jpg",
    },
    {
      id: "kuratif",
      href: "/kuratif",
      variant: "teal",
      badge: "Pendampingan",
      judul: "Dukungan untuk Kasus yang Kamu Alami",
      deskripsi:
        "Cek kondisimu, bicara dengan Svarati AI, dan temukan bantuan atau layanan dari lembaga hukum, medis, atau lembaga terkait terdekat",
      cta: "Cari Dukungan",
      gambar: "/kuratif2.jpg",
    },
    {
      id: "rehabilitatif",
      href: "/rehabilitatif",
      variant: "coral",
      badge: "Pemulihan",
      judul: "Ruang Pemulihan & Tree of Hope",
      deskripsi:
        "Buat jurnal harian tentang emosional diri, belajar cara menenangkan diri, serta baca pesan-pesan dukungan dari komunitas (Tree of Hope).",
      cta: "Masuk Ruang Pulih",
      gambar: "/rehab2.jpg",
    },
  ],
};

export const mitosContent = {
  badge: "Pahami Hakmu",
  judul: "Meluruskan Mitos Seputar Hak Perempuan",
  subjudul:
    "Mari pahami fakta objektif untuk mengikis stigma dan membangun ruang aman di masyarakat.",
  labelMitos: "Mitos",
  labelFakta: "Fakta",
  cta: { label: "Pelajari lebih lanjut? Buka Edukasi", href: "/preventif" },
  items: [
    {
      id: 1,
      mitos:
        "Pelecehan seksual terjadi karena pakaian perempuan yang terlalu terbuka atau perilakunya yang dianggap 'memancing'.",
      fakta:
        "Pelecehan seksual murni terjadi karena niat dan kesalahan pelaku, bukan pakaian korban. Data membuktikan bahwa kekerasan seksual tetap menimpa perempuan dengan pakaian tertutup sekalipun.",
    },
    {
      id: 2,
      mitos:
        "Jika korban tidak melawan, berteriak, atau berusaha lari, berarti kejadian tersebut dilakukan atas dasar suka sama suka.",
      fakta:
        "Saat menghadapi ancaman, otak manusia sering memicu respons traumatis 'Freeze' (lumpuh sesaat) atau 'Fawn' (tunduk demi keselamatan). Diamnya korban bukanlah sebuah persetujuan.",
    },
    {
      id: 3,
      mitos:
        "Persetujuan (consent) yang sudah diberikan satu kali berarti berlaku untuk seterusnya dan tidak bisa ditarik kembali.",
      fakta:
        "Persetujuan dapat ditarik kembali kapan saja. Seseorang berhak mengubah pikirannya, bahkan saat aktivitas atau hubungan sedang berlangsung.",
    },
    {
      id: 4,
      mitos:
        "Kekerasan seksual di ranah digital (seperti ancaman penyebaran foto/video intim) bukanlah bentuk kekerasan fisik, sehingga tidak bisa dipidana.",
      fakta:
        "Kekerasan Seksual Berbasis Elektronik (KSBE) adalah kejahatan serius yang berdampak besar pada psikologis korban dan dapat dipidana secara hukum di bawah payung UU TPKS.",
    },
  ],
};

export const svaratiAiContent = {
  badge: "Svarati AI",
  judul: "Bingung dengan Apa yang Baru Saja Terjadi?",
  deskripsi:
    "Ceritakan secara anonim. Svarati AI hadir untuk memvalidasi ceritamu, menjelaskan hak hukummu dalam bahasa awam, dan memberikan checklist langkah pertama dengan aman tanpa menghakimi.",
  cta: { label: "Mulai Cerita", href: "/AIsupport" },
};

export const pemulihanContent = {
  badge: "Ruang Pemulihan",
  judul: "Mari Sembuh Bersama, Perlahan-lahan",
  deskripsi:
    "Ambil jeda sejenak untuk dirimu. Kelola emosimu hari ini melalui jurnal penenang diri, dan temukan kekuatan baru dengan membaca pesan dukungan dari sesama penyintas di Pohon Harapan. Kamu tidak berjuang sendirian.",
  cta: { label: "Mulai Pemulihan", href: "/rehabilitatif" },
  gambar: { src: "/tree-of-hope-transparent.svg", alt: "Ilustrasi pohon harapan" },
  labelDukungan: "Dukungan",
  pesan: [
    {
      id: 1,
      teks: "Keberanianmu untuk bertahan hidup hari ini sudah merupakan kemenangan besar. Kamu tidak salah, dan kamu berhak pulih.",
      penulis: "Anonim • Jakarta",
      dukungan: 24,
      posisi: "lg:left-0 lg:top-[8%]",
    },
    {
      id: 2,
      teks: "Dahulu aku berpikir dunia runtuh. Tapi setelah melangkah mencari bantuan psikologis, aku menyadari ada masa depan yang menunggu.",
      penulis: "Penyintas • Bandung",
      dukungan: 18,
      posisi: "lg:right-0 lg:top-[38%]",
    },
    {
      id: 3,
      teks: "Pelan-pelan saja ya. Jangan ragu menggunakan fitur tombol darurat jika kamu merasa dalam bahaya.",
      penulis: "Pendamping • Surabaya",
      dukungan: 31,
      posisi: "lg:left-[18%] lg:bottom-[2%]",
    },
  ],
};

export const privasiContent = {
  judul: "Privasimu Adalah Prioritas Utama Kami",
  // Bagian bertanda "tebal" ditampilkan sebagai teks penekanan
  deskripsi: [
    { teks: "Seluruh penjelajahan di Svarati dibuat tanpa pelacakan riwayat identitas. Kamu dapat menekan " },
    { teks: "Esc 2x", tebal: true, tone: "coral" },
    { teks: " atau tombol " },
    { teks: "Keluar Cepat", tebal: true, tone: "danger" },
    { teks: " kapan saja untuk mengalihkan layar secara instan." },
  ],
};