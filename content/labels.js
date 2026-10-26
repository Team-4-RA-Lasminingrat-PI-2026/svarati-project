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
      { id: "edukasi-hukum", nama: "Edukasi Hak", href: "/preventif/edu" },
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
      { id: "cek-kondisi", nama: "Cek Kondisimu", href: "/kuratif/self-assessment" },
      { id: "cari-layanan", nama: "Cari Layanan Terdekat", href: "/kuratif/help-directory" },
      { id: "svarati-ai", nama: "Tanya Svarati AI", href: "/kuratif/svarati-ai" },
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
    "Svarati adalah ruang aman bagi perempuan Indonesia untuk memahami hak-haknya, menemukan bantuan terpercaya, dan melangkah menuju pemulihan secara aman.",

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
  cta: { label: "Mulai Cerita", href: "/svarati-ai" },
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

// ===== KURATIF =====
// Nama dan rute diambil dari MENU_UTAMA dan DARURAT. Di sini hanya teks pendukung.
const MENU_PENDAMPINGAN = MENU_UTAMA.find((menu) => menu.id === "pendampingan");
const MENU_PREVENTIF = MENU_UTAMA.find((menu) => menu.id === "pahami-hakmu");
const EDU_HUKUM = MENU_PREVENTIF.submenu.find((sub) => sub.id === "edukasi-hukum");
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
      judul: "Edukasi Hukum untuk Kamu",
      isi: "Kamu memilih untuk memahami batasan hukum secara umum. Kamu akan diarahkan ke modul Edukasi untuk informasi yang relevan.",
      tombol: "Ke Modul Edukasi",
      route: EDU_HUKUM.href,
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
          { id: "a", group: "Kata-kata", label: "Ada candaan atau komentar bernuansa seksual" },
          { id: "b", group: "Kata-kata", label: "Dikomentari soal tubuh" },
          { id: "c", group: "Online", label: "Dikirimi foto atau video tanpa izin" },
          { id: "d", group: "Online", label: "Diancam foto atau datanya disebar" },
          { id: "e", group: "Online", label: "Diintip atau direkam diam-diam" },
          { id: "f", group: "Fisik", label: "Disentuh tanpa izin" },
          { id: "g", group: "Fisik", label: "Dipaksa berhubungan intim" },
          { id: "h", group: "Ancaman", label: "Nilai atau kerja dikaitkan dengan permintaan intim" },
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