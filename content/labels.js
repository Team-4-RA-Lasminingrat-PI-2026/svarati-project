/*import { title } from "framer-motion/client";*/

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
  },
  {
    id: "pendampingan",
    nama: "Pendampingan",
    href: "/kuratif",
    subtitle: "Kuratif",
    deskripsi: "Penanganan & bantuan",
    submenu: [
      { id: "cek-kondisi", nama: "Cek Kondisimu", href: "/kuratif/self-assessment" },
      { id: "svarati-ai", nama: "Tanya Svarati AI", href: "/kuratif/svarati-ai" },
      { id: "cari-layanan", nama: "Cari Layanan Terdekat", href: "/kuratif/help-directory" },
    ],
  },
  {
    id: "pemulihan",
    nama: "Pemulihan",
    href: "/rehabilitatif",
    subtitle: "Rehabilitatif",
    deskripsi: "Pemulihan & dukungan jangka panjang",
    submenu: [
      { id: "jurnal-pemulihan", nama: "Jurnal Pemulihan", href: "/rehabilitatif/healing-journey" },
      { id: "latihan-tenang", nama: "Latihan Tenang", href: "/rehabilitatif/training" },
      { id: "pohon-harapan", nama: "Pohon Harapan", href: "/rehabilitatif/tree-of-hope" },
    ],
  },
  {
    id: "tentang",
    nama: "Tentang Kami",
    href: "/profile",
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
    "Svarati adalah ruang aman bagi perempuan Indonesia untuk memahami hak-haknya, menemukan bantuan terpercaya, dan melangkah menuju pemulihan secara aman. Seluruh akses dijamin anonim tanpa perlu mendaftar akun.",

   optionsLabel: "Apa yang kamu butuhkan saat ini?",
  options: [
    { label: "Cek apakah yang saya alami termasuk kekerasan", href: "/kuratif/self-assessment", variant: "primary" },
    { label: "Ceritakan pada Svarati AI", href: "/kuratif/svarati-ai", variant: "secondary" },
    { label: "Jelajahi fitur lainnya", href: "#fitur", variant: "tertiary" },
  ],

  // Ganti dengan gambar 
  image: {
    src: "/image7.jpg",
    alt: "Perempuan",
    position: "50% 50%",
  },
};

export const serviceContent = {
  title: "Apa yang Bisa Kamu Temukan di Svarati?",
  subtitle: "Tiga jalur dukungan yang dirancang untuk berbagai tahap kebutuhan.",
  items: [
    {
      id: "preventif",
      href: "/preventif",
      variant: "lavender",
      badge: "Pahami Hakmu",
      title: "Edukasi Hak Perempuan",
      description:
        "Pelajari hak-hakmu sebagai perempuan, kenali bentuk-bentuk pelecehan, dan pahami perlindungan hukum.",      cta: "Buka Edukasi",
      image: "/preventif1.jpg",
    },
    {
      id: "kuratif",
      href: "/kuratif",
      variant: "teal",
      badge: "Pendampingan",
      title: "Dukungan untuk Kasus yang Kamu Alami",
      description:
        "Cek kondisimu, bicara dengan Svarati AI, dan temukan bantuan atau layanan dari lembaga hukum, medis, atau lembaga terkait terdekat",
      cta: "Cari Dukungan",
      image: "/kuratif2.jpg",
    },
    {
      id: "rehabilitatif",
      href: "/rehabilitatif",
      variant: "coral",
      badge: "Pemulihan",
      title: "Ruang Pemulihan & Pohon Harapan",
      description:
        "Buat jurnal harian tentang emosional diri, belajar cara menenangkan diri, serta baca pesan-pesan dukungan dari komunitas (Pohon Harapan).",
      cta: "Masuk Ruang Pulih",
      image: "/rehab2.jpg",
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
  cta: { label: "Mulai Cerita", href: "/kuratif/svarati-ai" },
  gambar: { src: "/cute-ai-robot-mascot.svg", alt: "Maskot robot Svarati AI" },
  bubbles: [
    {
      id: 1,
      teks: "Halo! Aku Svarati AI",
      posisi: "-top-3 -left-4 sm:-top-5 sm:-left-8",
      delay: "animate-float-slow",
    },
    {
      id: 2,
      teks: "Aku siap menjawab semua pertanyaanmu dengan ramah",
      posisi: "top-1/4 -right-20 sm:-right-28",
      delay: "animate-float-medium",
    },
    {
      id: 3,
      teks: "Tenang saja, semua rahasiamu aman terjaga denganku",
      posisi: "-bottom-6 -left-8 sm:-bottom-8 sm:-left-12 lg:-left-16",
      delay: "animate-float-fast",
    },
  ],
};

// Rute fitur pemulihan diambil dari MENU_UTAMA agar tidak ditulis ganda.
const SUBMENU_PEMULIHAN = MENU_UTAMA.find((menu) => menu.id === "pemulihan").submenu;
const rutePemulihan = (id) => SUBMENU_PEMULIHAN.find((sub) => sub.id === id).href;

export const pemulihanContent = {
  badge: "Ruang Pemulihan",
  judul: "Mari Sembuh Bersama, Perlahan-lahan",
  deskripsi:
    "Ambil jeda sejenak untuk dirimu. Pilih fitur yang paling sesuai dengan kondisimu. Kamu tidak berjuang sendirian.",
  cta: { label: "Mulai Pemulihan", href: "/rehabilitatif" },
  gambar: { src: "/tree-of-hope-transparent.svg", alt: "Ilustrasi pohon harapan" },
  labelDukungan: "Dukungan",
  pesan: [
    {
      id: 1,
      teks: "Keberanianmu untuk bertahan hidup hari ini sudah merupakan kemenangan besar. Kamu tidak salah, dan kamu berhak pulih.",
      penulis: "Anonim • Jakarta",
      dukungan: 24,
      posisi: "left-0 top-[2%]",
    },
    {
      id: 2,
      teks: "Dahulu aku berpikir dunia runtuh. Tapi setelah melangkah mencari bantuan psikologis, aku menyadari ada masa depan yang menunggu.",
      penulis: "Penyintas • Bandung",
      dukungan: 18,
      posisi: "right-0 top-[38%]",
    },
    {
      id: 3,
      teks: "Pelan-pelan saja ya. Jangan ragu menggunakan fitur tombol darurat jika kamu merasa dalam bahaya.",
      penulis: "Pendamping • Surabaya",
      dukungan: 31,
      posisi: "left-[4%] bottom-[2%]",
    },
  ],

  fitur: [
    {
      id: "jurnal-pemulihan",
      variant: "lavender",
      badge: "Refleksi Diri",
      title: "Jurnal Pemulihan",
      description:
        "Ruang aman dan privat untuk mencatat perasaanmu hari demi hari, melihat perkembangan emosionalmu, serta memproses pengalaman secara berkala.",
      cta: "Buka Jurnal",
      href: rutePemulihan("jurnal-pemulihan"),
    },
    {
      id: "latihan-tenang",
      variant: "teal",
      badge: "Relaksasi & Grounding",
      title: "Latihan Tenang",
      description:
        "Panduan teknik pernapasan dan grounding (5-4-3-2-1) interaktif untuk membantu meredakan kecemasan dan mengembalikan fokus.",
      cta: "Mulai Latihan",
      href: rutePemulihan("latihan-tenang"),
    },
    {
      id: "pohon-harapan",
      variant: "coral",
      badge: "Dukungan Komunitas",
      title: "Pohon Harapan",
      // Bagian bertanda "tebal" ditampilkan sebagai teks tebal miring
      description: [
        { teks: "Pohon harapan berisi pesan saling menguatkan maupun cerita perjuangan penyintas lain sebagai pengingat bahwa " },
        { teks: "Kamu Tidak Sendirian", tebal: true },
        { teks: "." },
      ],
      cta: "Lihat Pohon Harapan",
      href: rutePemulihan("pohon-harapan"),
    },
  ],
};

export const privasiContent = {
  judul: "Privasimu Adalah Prioritas Utama Kami",
  // Bagian bertanda "tebal" ditampilkan sebagai teks penekanan
  deskripsi: [
    { teks: "Seluruh penjelajahan di Svarati dibuat tanpa pelacakan riwayat identitas. Kamu dapat menekan " },
    { teks: " tombol " },
    { teks: "Keluar Cepat", tebal: true, tone: "danger" },
    { teks: " kapan saja untuk mengalihkan layar secara instan." },
  ],
};

export const educationContent = {
  pageTitle: "Edukasi Svarati",
  intro: {
    badge: "Pusat Edukasi",
    title: "Pahami Hakmu, Mulai dari Sini",
    description:
      "Kumpulan artikel tentang hak perempuan, hukum terkait kekerasan seksual, mengenali bentuk pelecehan, dan keamanan diri yang ditulis dengan bahasa yang mudah dipahami.",
  },
  basePath: "/preventif",
  carouselLabel: "Banner Edukasi",
  slideLabel: { prev: "Slide sebelumnya", next: "Slide berikutnya", goTo: "Ke slide" },
  readLabel: "Baca Artikel",
  filterLabel: "Filter kategori artikel",
  searchPlaceholder: "Cari artikel edukasi",
  searchLabel: "Cari artikel",
  clearLabel: "Hapus filter",
  resultLabel: "artikel ditemukan",
  empty: "Tidak ada artikel yang cocok dengan pencarianmu.",
  tabs: [
    { id: "all", label: "Semua" },
    { id: "hak_perempuan", label: "Hak Perempuan" },
    { id: "hukum_tpks", label: "Hukum & UU TPKS" },
    { id: "pelecehan_fisik", label: "Pelecehan Fisik" },
    { id: "pelecehan_nonfisik", label: "Pelecehan Non-Fisik" },
    { id: "pemaksaan_hubungan", label: "Pemaksaan Seksual" },
    { id: "medis_visum", label: "Medis & Visum" },
    { id: "kesehatan_mental", label: "Kesehatan Mental" },
    { id: "keamanan_diri", label: "Keamanan Diri" },
  ],
  detail: {
    back: "Kembali ke Edukasi",
    like: "Suka",
    share: "Bagikan",
    copied: "Tautan disalin",
    related: "Baca Selanjutnya",
    help: {
      title: "Butuh bantuan sekarang?",
      text: "Hubungi layanan SAPA 129, layanan darurat perlindungan perempuan dan anak yang aktif 24 jam atau langsung ke Pusat Darurat 112",
      cta: "Hubungi 129",
      cta2: "Pusat Darurat 112",
      href: "tel:129",
      href2: "tel:112",
    },
  },
};

// Tema warna per kategori. Class ditulis lengkap agar terbaca oleh Tailwind.
// badge: varian komponen Badge. avatarText: warna inisial pada lingkaran putih.
export const categoryTheme = {
  hak_perempuan: {
    card: "bg-svarati-coral border-svarati-coral",
    badge: "coral",
    avatarText: "text-svarati-coral-dark",
    text: "text-svarati-coral",
    avatarBg: "bg-svarati-coral",
  },
  hukum_tpks: {
    card: "bg-svarati-lavender border-svarati-lavender",
    badge: "lavender",
    avatarText: "text-svarati-lavender",
    text: "text-svarati-lavender",
    avatarBg: "bg-svarati-lavender",
  },
  pelecehan_fisik: {
    card: "bg-svarati-coral-dark border-svarati-coral-darker",
    badge: "coral",
    avatarText: "text-svarati-coral-dark",
    text: "text-svarati-coral-dark",
    avatarBg: "bg-svarati-coral-dark",
  },
  pelecehan_nonfisik: {
    card: "bg-svarati-coral-medium border-svarati-coral-medium",
    badge: "coral",
    avatarText: "text-svarati-coral-medium",
    text: "text-svarati-coral-medium",
    avatarBg: "bg-svarati-coral-medium",
  },
  pemaksaan_hubungan: {
    card: "bg-svarati-lavender-dark border-svarati-lavender-dark",
    badge: "lavender",
    avatarText: "text-svarati-lavender",
    text: "text-svarati-lavender-dark",
    avatarBg: "bg-svarati-lavender-dark",
  },
  medis_visum: {
    card: "bg-svarati-teal border-svarati-teal",
    badge: "teal",
    avatarText: "text-svarati-teal",
    text: "text-svarati-teal",
    avatarBg: "bg-svarati-teal",
  },
  kesehatan_mental: {
    card: "bg-svarati-teal-dark border-svarati-teal-dark",
    badge: "lavender",
    avatarText: "text-svarati-teal-dark",
    text: "text-svarati-teal-dark",
    avatarBg: "bg-svarati-teal-dark",
  },
  keamanan_diri: {
    card: "bg-svarati-teal-light border-svarati-teal-light",
    badge: "teal",
    avatarText: "text-svarati-teal-light",
    text: "text-svarati-teal-light",
    avatarBg: "bg-svarati-teal-light",
  },
};
// Pencarian label kategori: categoryLabel["law"] -> "Hukum & UU TPKS"
export const categoryLabel = Object.fromEntries(
  educationContent.tabs.map((t) => [t.id, t.label])
);
// ===== KURATIF =====
// Nama dan rute diambil dari MENU_UTAMA dan DARURAT. Di sini hanya teks pendukung.
const MENU_PENDAMPINGAN = MENU_UTAMA.find((menu) => menu.id === "pendampingan");
const MENU_PREVENTIF = MENU_UTAMA.find((menu) => menu.id === "pahami-hakmu");
const SVARATI_AI = MENU_PENDAMPINGAN.submenu.find((sub) => sub.id === "svarati-ai");

export const KURATIF = {
  common: {
    emergencyLabel: DARURAT.tombol,
    back: "Kembali",
    next: "Lanjut",
    finish: "Lihat Hasil",
    skip: "Lewati pertanyaan ini",
    backToQuiz: "Kembali ke kuis",
    restart: "Ulangi kuis",
    lihatDaftar: "Lihat daftar layanan",
    storageNote: "Kamu bisa berhenti kapan saja. Jawabanmu hanya tersimpan selama halaman ini terbuka.",
    aiDisclaimer: "Ini bukan pengganti psikolog, pendamping, atau layanan hukum. Jika kamu dalam bahaya, gunakan Bantuan Darurat.",
  },

  menu: {
    title: "Dukungan untuk Kasus yang Kamu Alami.",
    intro: "Pilih langkah yang paling sesuai dengan kondisimu saat ini. Kamu bisa mulai dari mana saja.",
    disclaimer: "Layanan di halaman ini membantu kamu memahami situasi. Hasilnya bukan diagnosis dan bukan penilaian hukum.",
    hintCekKondisi: "±2 menit",
    // Deskripsi per item, dicocokkan dengan id di submenu
    desc: {
      "cek-kondisi": "Enam pertanyaan singkat, satu per layar. Kamu bisa melewati atau kembali kapan saja.",
      "svarati-ai": "Ceritakan apa yang kamu alami, atau tanyakan langkah berikutnya.",
      "cari-layanan": "Daftar layanan pendampingan dan hukum yang sudah diverifikasi.",
    },
  },

  selfAssessment: {
    title: (step, total) => `Langkah ${step} dari ${total}`,
    hint: "Boleh pilih lebih dari satu.",
    panelKiri: {
      judul: "Cek kondisimu",
      judulKuis: "Pelan-pelan, mulai dari sini.",
      dukungan:
        "Jawab sesuai yang kamu rasakan. Tidak ada jawaban yang benar atau salah, dan kamu boleh melewati pertanyaan mana pun.",
    },
    darurat: {
      judul: "Keselamatanmu adalah prioritas",
      isi: "Kamu tampaknya masih berada dalam situasi berbahaya. Hubungi salah satu layanan di bawah ini sekarang.",
      keluarCepatAwal: "Kamu juga bisa menggunakan tombol",
      keluarCepatAkhir: "di bagian atas untuk segera meninggalkan halaman ini.",
      hubungi: "Hubungi",
    },
    hasilDarurat: {
      judul: "Dalam situasi darurat?",
      isi: "Jangan tunggu daftar ini, hubungi langsung layanan darurat.",
    },
    education: {
      judul: "Edukasi Hak Perempuan untuk Kamu",
      isi: "Kamu memilih untuk memahami batasan hukum secara umum. Kamu akan diarahkan ke modul Edukasi untuk informasi yang relevan.",
      tombol: "Ke Modul Edukasi",
      route: MENU_PREVENTIF.href,
    },
    result: {
      lead: "Tidak perlu memutuskan apa pun sekarang.",
      leadRest: "Berikut beberapa langkah yang mungkin membantu.",
      disclaimer: "Hasil ini berdasarkan jawabanmu dan bukan diagnosis atau penilaian hukum.",
    },
    cards: {
      space: {
        title: "Ruang bercerita",
        body: `Kamu bisa menuliskan apa pun yang kamu rasakan di ${SVARATI_AI.nama}, dengan kecepatanmu sendiri.`,
        cta: `Buka ${SVARATI_AI.nama}`,
        route: SVARATI_AI.href,
      },
      digital: {
        title: "Menyimpan bukti digital",
        body: "Kamu punya bukti digital. Beberapa hal yang bisa dilakukan:",
        list: [
          "Jangan hapus pesan atau foto aslinya",
          "Buat salinan di tempat lain yang kamu percaya",
          "Catat tanggal dan jam kejadian selagi ingat",
        ],
      },
      institution: {
        title: "Pelaporan di institusi",
        body: "Tempat kamu belajar atau bekerja biasanya punya jalur pengaduan. Kamu bisa bertanya dulu tanpa langsung melapor.",
        list: [
          "Cari tahu prosedur pengaduan di tempatmu",
          "Kamu boleh membawa pendamping saat bertanya",
        ],
      },
      threat: {
        title: "Kamu tidak harus menghadapi ancaman sendirian",
        body: "Ancaman atau tekanan seperti ini bisa sangat berat. Berbicara dengan pendamping bisa membantu memikirkan langkah yang aman.",
        list: [
          "Hubungi pendamping atau orang yang kamu percaya",
          "Simpan bukti ancaman jika ada",
        ],
      },
      emotional: {
        title: "Dukungan emosional",
        body: "Membeku, bingung, atau baru menyadari sesuatu setelah beberapa waktu itu wajar. Tidak ada cara yang benar untuk bereaksi.",
        list: [
          "Kamu boleh membahas ini dengan psikolog atau pendamping",
          "Tidak perlu menceritakan semuanya sekaligus",
        ],
      },
      noEvidence: {
        title: "Kalau belum ada bukti",
        body: "Tidak adanya bukti tidak membuat pengalamanmu kurang berarti. Pendamping bisa membantu melihat pilihan yang tersedia.",
      },
    },
    questions: [
      {
        id: "q1",
        text: "Bagaimana kondisimu sekarang?",
        options: [
          { id: "a", label: "Dalam bahaya (mengancam jiwa atau kesehatan)", flag: "darurat" },
          { id: "b", label: "Aman, tapi bingung" },
          { id: "c", label: "Aman, tapi masih trauma" },
          { id: "d", label: "Aman, hanya ingin tahu soal hukum atau hak perempuan", flag: "edukasi" },
        ],
      },
      {
        id: "q2",
        text: "Di mana kejadiannya?",
        options: [
          { id: "a", label: "Online (chat, medsos)" },
          { id: "b", label: "Kampus, sekolah, magang, kos" },
          { id: "c", label: "Kantor atau tempat kerja" },
          { id: "d", label: "Tempat umum" },
          { id: "e", label: "Rumah atau keluarga" },
        ],
      },
      {
        id: "q3",
        text: "Siapa yang terlibat?",
        options: [
          { id: "a", label: "Atasan atau dosen" },
          { id: "b", label: "Teman atau rekan" },
          { id: "c", label: "Pacar, mantan, atau keluarga" },
          { id: "d", label: "Orang yang baru dikenal" },
        ],
      },
      {
        id: "q4",
        text: "Apa yang terjadi?",
        multi: true,
        options: [
          { id: "a", label: "Ada candaan atau komentar bernuansa seksual" },
          { id: "b", label: "Dikomentari soal tubuh" },
          { id: "c", label: "Dikirimi foto atau video tanpa izin" },
          { id: "d", label: "Diancam foto atau datanya disebar" },
          { id: "e", label: "Diintip atau direkam diam-diam" },
          { id: "f", label: "Disentuh tanpa izin" },
          { id: "g", label: "Dipaksa berhubungan intim" },
          { id: "h", label: "Nilai atau kerja dikaitkan dengan permintaan intim" },
        ],
      },
      {
        id: "q5",
        text: "Bagaimana reaksimu saat itu?",
        options: [
          { id: "a", label: "Sudah menolak, tapi tetap dilanjutkan" },
          { id: "b", label: "Membeku atau takut" },
          { id: "c", label: "Menurut karena takut diancam" },
          { id: "d", label: "Baru sadar setelah beberapa waktu" },
        ],
      },
      {
        id: "q6",
        text: "Ada bukti atau saksi?",
        options: [
          { id: "a", label: "Ada bukti digital" },
          { id: "b", label: "Ada saksi" },
          { id: "c", label: "Tidak ada, hanya ingatanku" },
          { id: "d", label: "Belum tahu" },
        ],
      },
    ],
  },

  ai: {
    badge: SVARATI_AI.nama,
    nama: "Svarati AI",
    judulPanel: "Mau mulai dari mana?",
    typing: "Svarati AI sedang mengetik",
    headerJudul: "Teman cerita",
    headerSub: "Asisten AI, bukan manusia",
    greeting: "Hai. Kamu bisa memilih apa yang ingin dilakukan, atau langsung menulis sesuatu.",
    inputLabel: "Tulis pesan",
    inputPlaceholder: "Bagikan apa yang kamu rasa nyaman...",
    send: "Kirim",
    chips: [
      { label: "Saya ingin cerita", key: "cerita" },
      { label: "Apa langkah berikutnya?", key: "langkah" },
      { label: "Saya ingin istirahat", key: "istirahat" },
      { label: "Apa hak saya sebagai korban?", key: "hak" },
    ],
    // Balasan terkurasi. Nantinya diganti dengan jawaban RAG yang sudah diverifikasi.
    replies: {
      cerita: "Terima kasih sudah memilih untuk berbagi. Kamu boleh cerita sedikit demi sedikit, atau hanya bagian yang nyaman saja.",
      langkah: "Kalau kamu ingin tahu langkah berikutnya, kita bisa mulai dari yang paling mendesak. Apakah kamu sedang merasa aman sekarang?",
      istirahat: "Tidak apa-apa untuk berhenti dulu. Halaman ini akan tetap di sini saat kamu siap kembali.",
      hak: "Sebagai korban, kamu memiliki hak untuk mendapatkan perlindungan, bantuan, dan keadilan. Kamu berhak melaporkan kejadian ini dan meminta bantuan dari pihak berwenang.",
      urgent: "Aku mendengarmu, dan keselamatanmu yang paling penting sekarang. Kalau kamu dalam bahaya, tekan tombol Bantuan Darurat di bawah ini. Kamu tidak harus menghadapinya sendirian.",
      default: "Terima kasih sudah menuliskan itu. Kamu boleh melanjutkan kapan saja, atau memilih langkah lain di atas.",
    },
    errorText: "Maaf, balasan belum bisa dikirim. Coba lagi sebentar lagi, atau gunakan tombol bantuan darurat jika kamu butuh bantuan sekarang.",
    urgentNotice: "Kedengarannya situasimu mendesak. Kamu tidak harus menghadapinya sendiri. Hubungi layanan bantuan sekarang.",
  },
};

// ===== DIREKTORI LAYANAN BANTUAN =====
export const DIREKTORI = {
  back: { label: "Pendampingan", href: MENU_PENDAMPINGAN.href },
  badge: "Direktori Layanan Bantuan",
  judul: "Temukan Bantuan Terdekat dari Lokasimu!",
  deskripsi: [
    "Tidak perlu ragu untuk mencari bantuan. Puluhan lembaga pemerintah, swasta, maupun organisasi masyarakat siap membantumu.",
    "Temukan berbagai layanan dari lembaga bantuan hukum, psikologis, maupun medis di seluruh Indonesia pada fitur di bawah ini.",
    "Filter berdasarkan provinsi dan kota untuk menemukan layanan bantuan terdekat.",
  ],

  alert: {
    judul: "Dalam situasi darurat?",
    isi: "Jangan tunggu daftar ini, hubungi langsung layanan darurat.",
    tutup: "Tutup pesan darurat",
  },

  filter: {
    judulLokasi: "Filter berdasarkan lokasi",
    judulLayanan: "Filter berdasarkan layanan",
    cariLabel: "Cari nama lembaga atau kota",
    cariPlaceholder: "Cari nama lembaga atau kota...",
    provinsiLabel: "Provinsi",
    semuaProvinsi: "Semua Provinsi",
    nilaiNasional: "__nasional__", // nilai internal, bukan teks tampilan
    provinsiNasional: "Nasional / Pusat",
    kotaLabel: "Kota",
    semuaKota: "Semua Kota",
    semua: "Semua",
    jumlah: "layanan ditemukan",
    reset: "Reset Filter",
    unduh: "Unduh dokumen hasil pencarian (.csv)",
  },

  hasil: {
    judul: "Hasil pencarian",
    kosong: "Tidak ada layanan untuk filter ini.",
    resetKosong: "Reset filter",
    petunjukNasional: "Layanan nasional seperti SAPA 129 bisa dihubungi dari mana saja.",
    lihatNasional: "Lihat layanan nasional",
    gagal: `Daftar layanan belum bisa dimuat. Coba muat ulang halaman. Jika kamu butuh bantuan sekarang, hubungi ${DARURAT.nomor.pusat.nomor} atau ${DARURAT.nomor.sapa.nomor}.`,
    muatLagi: "Muat lebih banyak",
    sedangMemuat: "Memuat...",
    menampilkan: (tampil, total) => `Menampilkan ${tampil} dari ${total} layanan`,
  },

  kartu: {
  nasional: "Layanan nasional",
  hubungi: "Hubungi Sekarang",
  situs: "Kunjungi situs",
  lihatDetail: "Lihat detail",
  tutupDetail: "Tutup detail",
  deskripsi: "Tentang lembaga",
  jam: "Jam operasional",
  email: "Email",
  sosmed: "Media sosial",
  peta: "Lokasi",
  bukaPeta: "Buka di Google Maps",
  verifikasi: "Verifikasi data",
  terverifikasi: "Data terverifikasi",
  terverifikasiPada: "Data terverifikasi pada",
},

  paginasi: {
    label: "Paginasi daftar layanan",
    sebelumnya: "Sebelumnya",
    berikutnya: "Berikutnya",
    halaman: (n) => `Halaman ${n}`,
  },

  csv: {
    header: ["Nama", "Jenis", "Provinsi", "Kota", "Alamat", "Telepon"],
    namaFile: "daftar-kontak.csv",
    peringatan:
      "File akan tersimpan di perangkat ini dan bisa dilihat orang lain yang memakai perangkat ini. Lanjutkan unduh?",
    gagal: "File belum bisa diunduh. Coba lagi sebentar lagi.",
  },
};

// ===== AKSESIBILITAS (RLA034) =====
export const AKSESIBILITAS = {
  tombol: "Aksesibilitas",
  judul: "Pengaturan Aksesibilitas",
  kontras: {
    nama: "Tema kontras tinggi",
  },
  gelap: {
    nama: "Mode gelap",
  },
  screenReader: {
    nama: "Mode screen reader",
  },
  // Pilihan ukuran untuk ukuran teks, tinggi baris, dan spasi teks
  ukuran: { kecil: "Kecil", normal: "Normal", besar: "Besar" },
  ukuranTeks: { nama: "Atur Ukuran Teks" },
  tinggiBaris: { nama: "Atur Tinggi Baris" },
  spasiTeks: { nama: "Atur Spasi Teks" },
  rataTulisan: {
    nama: "Atur Rata Tulisan",
    bawaan: "bawaan halaman",
    pilihan: {
      kiri: "Rata kiri",
      tengah: "Rata tengah",
      kanan: "Rata kanan",
      penuh: "Rata kiri-kanan",
    },
  },
  aturUlang: "Atur ulang",
  tutup: "Tutup pengaturan aksesibilitas",
  statusAktif: "aktif",
  statusMati: "nonaktif",
};

// TREE OF HOPE
export const treeOfHopeContent = {
  back: { label: "Pemulihan", href: "/rehabilitatif", aria: "Kembali ke Pemulihan" },
  badge: "DUKUNGAN KOMUNITAS",
  title: "Kamu Tidak Sendirian!",
  description:
    "Temukan kehangatan melalui pesan-pesan dukungan dari komunitas Svarati di Pohon Harapan. Bagikan juga pesan penyemangatmu dan jadilah bagian dari tumbuhnya harapan bersama perempuan lainnya!",
  scrollHint: "Geser ke bawah",
  image: { src: "/tree-of-hope-transparent.svg", alt: "Ilustrasi pohon harapan" },
  supportLabel: "Dukungan",
  anonymous: "Anonim",
  newLabel: "Baru",
  // Nilai ini disimpan di database (user_role) dan dipakai validasi API.
  roles: ["Penyintas", "Pendamping", "Keluarga", "Teman", "Aktivis"],

  composeEnvelope: "Kirim pesan dukungan anonimmu sekarang!",
  composeCta: "Klik di sini",
  moreMessages: "Klik pesan atau amplop untuk membaca semua Pesan Dukungan",
  readMore: "Baca pesan",

  like: {
    aria: (liked, count, label) =>
      `${liked ? "Batalkan dukungan" : "Beri dukungan"}. Saat ini ${count} ${label}`,
  },

  pager: {
    previous: "Halaman sebelumnya",
    next: "Halaman berikutnya",
    page: (n, total) => `Halaman ${n} dari ${total}`,
  },

  reader: {
    position: (n, total) => `Pesan ${n} dari ${total}`,
    close: "Tutup",
    previous: "Pesan sebelumnya (lebih baru)",
    next: "Pesan berikutnya (lebih lama)",
    openFrom: (author) => `Buka pesan dari ${author}`,
    readFull: (author) => `Baca pesan lengkap dari ${author}`,
  },

  form: {
    title: "Kirim pesan dukunganmu",
    info: "Pesan akan tampil secara anonim di Pohon Harapan Komunitas Svarati.",
    messageLabel: "Pesan",
    messagePlaceholder: "Tulis pesan dukungan di sini...",
    roleLabel: "Peran (opsional)",
    rolePlaceholder: "Tidak dipilih",
    locationLabel: "Asal daerah (opsional)",
    locationPlaceholder: "Contoh: Bandung",
    submit: "Kirim Pesan",
    sending: "Mengirim...",
    cancel: "Batal",
  },

  toast: {
    empty: "Tulis pesanmu dulu sebelum mengirim.",
    success: "Pesan anonimmu berhasil dikirim.",
    sendFailed: "Maaf, Pesan  Dukunganmu belum bisa dikirim sekarang. Coba lagi dalam beberapa saat.",
    loadFailed: "Maaf, Pesan Dukungan belum bisa dimuat. Coba muat ulang halaman.",
    likeFailed: "Maaf, kamu belum bisa menyukai Pesan Dukungan ini sekarang. Coba lagi dalam beberapa saat.",
    likeUnavailable: "Maaf, dukungan belum bisa disimpan untuk pesan ini.",
    offline: "Maaf, jaringan sedang offline. Menampilkan pesan-pesan pilihan untukmu.",
  },
};
