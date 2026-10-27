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
      { id: "jurnal-pemulihan", nama: "Jurnal Pemulihan", href: "/rehabilitatif/healing-journey" },
      { id: "latihan-tenang", nama: "Latihan Tenang", href: "/rehabilitatif/training" },
      { id: "cerita-dari-mereka", nama: "Cerita dari Mereka", href: "/rehabilitatif/tree-of-hope" },
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
  { label: "Saya butuh bantuan darurat sekarang", action: "emergency", variant: "exit" },
  { label: "Cek apakah yang saya alami termasuk kekerasan", href: "/kuratif", variant: "secondary" },
  { label: "Saya hanya butuh ruang tenang dan tempat bercerita", href: "/rehabilitatif", variant: "primary" },
  { label: "Hanya ingin mencari tahu? Jelajahi edukasi", href: "/preventif", variant: "tertiary" },
],

  footnote: "*Seluruh akses dijamin anonim tanpa perlu mendaftar akun.",

  // Ganti dengan gambar 
  image: {
    src: "/image3.jpg",
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
        "Pelajari hak-hakmu sebagai perempuan, kesehatan reproduksi, dan perlindungan hukum.",
      cta: "Buka Edukasi",
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
      title: "Ruang Pemulihan & Tree of Hope",
      description:
        "Buat jurnal harian tentang emosional diri, belajar cara menenangkan diri, serta baca pesan-pesan dukungan dari komunitas (Tree of Hope).",
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
};

export const privasiContent = {
  judul: "Privasimu Adalah Prioritas Utama Kami",
  // Bagian bertanda "tebal" ditampilkan sebagai teks penekanan
  deskripsi: [
    { teks: "Seluruh penjelajahan di Svarati dibuat tanpa pelacakan riwayat identitas. Kamu dapat menekan " },
    { teks: "Esc", tebal: true, tone: "coral" },
    { teks: " atau tombol " },
    { teks: "Keluar Cepat", tebal: true, tone: "danger" },
    { teks: " kapan saja untuk mengalihkan layar secara instan." },
  ],
};

export const educationContent = {
  pageTitle: "Edukasi | Svarati",
  intro: {
    badge: "Pusat Edukasi",
    title: "Pahami Hakmu, Mulai dari Sini",
    description:
      "Kumpulan artikel tentang hak perempuan, hukum terkait kekerasan seksual, kesehatan reproduksi, dan keamanan diri, ditulis dengan bahasa yang mudah dipahami.",
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
    { id: "rights", label: "Hak Perempuan" },
    { id: "law", label: "Hukum & UU TPKS" },
    { id: "reproductive", label: "Kesehatan Reproduksi" },
    { id: "mental", label: "Kesehatan Mental" },
    { id: "safety", label: "Keamanan Diri" },
  ],
  articles: [
    { id: "a1", 
      slug: "perempuan-dan-harga-yang-dibayar-untuk-merasa-aman", 
      headline: true, 
      category: "rights", 
      author: "Rara kinda ia",
      title: "Perempuan dan “Harga” yang Harus Dibayar untuk Merasa Aman", 
      summary: "Tentang ruang publik, ketakutan, dan kebiasaan yang membuat perempuan belajar untuk selalu waspada.", 
      date: "20 Sept 2026", 
      readTime: "6 menit baca", 
      image: "/imageA1.jpg",
      imagePosition: "50% 5%",
      likes: 128,
      body: [
        { type: "p", text: "Mengapa perempuan harus mengeluarkan lebih banyak tenaga, uang, dan kewaspadaan hanya untuk merasa aman?" },
        { type: "p", text: "Bukankah rasa aman adalah hak semua orang?" },
        { type: "p", text: "Pertanyaan itu mungkin terdengar sederhana. Namun bagi banyak perempuan, rasa aman justru menjadi sesuatu yang harus diperhitungkan sebelum melangkahkan kaki keluar rumah. Harus melihat jam sebelum pulang. Harus memilih kendaraan yang dianggap paling aman. Harus memastikan pakaian tidak terlalu terbuka. Harus memberi kabar ketika sudah sampai. Harus menggenggam ponsel lebih erat ketika berjalan sendirian. Bahkan terkadang, harus berpura-pura tidak takut ketika sebenarnya ada ketakutan yang terus berjalan di belakangnya." },
        { type: "p", text: "Lalu, sampai kapan perempuan harus hidup dengan kewaspadaan seperti itu?" },
        { type: "p", text: "Ruang publik seharusnya menjadi milik semua orang. Jalanan, transportasi umum, tempat kerja, kampus, sekolah, bahkan ruang digital seharusnya menjadi tempat di mana setiap manusia dapat hadir tanpa harus merasa tubuhnya adalah sesuatu yang boleh diganggu." },
        { type: "p", text: "Namun kenyataannya, bagi sebagian perempuan, ruang-ruang tersebut justru menyimpan kemungkinan terjadinya kekerasan." },
        { type: "p", text: "Catcalling yang dianggap sekadar candaan. Tatapan yang membuat tidak nyaman tetapi diminta untuk diabaikan. Komentar mengenai tubuh yang dianggap lumrah. Pesan-pesan seksual dalam ruang digital yang diperlakukan seolah hanya bagian dari percakapan sehari-hari. Pelecehan yang kemudian ditutup dengan kalimat sederhana: “kan cuma bercanda.”" },
        { type: "p", text: "Padahal, bercanda seharusnya tidak membutuhkan ketakutan orang lain sebagai bahan hiburan." },
        { type: "p", text: "Dan kekerasan tidak berhenti di jalanan." },
        { type: "p", text: "Ia bisa hadir di dalam kendaraan umum, di tempat kerja, di sekolah, di kampus, di ruang digital, bahkan di tempat yang seharusnya menjadi ruang paling aman: rumah dan relasi personal." },
        { type: "p", text: "Data Catatan Tahunan Komnas Perempuan 2025 mencatat 376.529 kasus Kekerasan Berbasis Gender terhadap Perempuan di Indonesia sepanjang 2025. Angka tersebut meningkat 14,07 persen dibandingkan tahun sebelumnya. Sebanyak 337.961 kasus atau 89,76 persen tercatat terjadi di ranah personal. Sementara itu, 17.252 kasus tercatat di ranah publik. (Komnas Perempuan)" },
        { type: "p", text: "Angka-angka itu bukan sekadar angka." },
        { type: "p", text: "Di baliknya ada seseorang yang mungkin pernah takut pulang sendirian. Ada seseorang yang menghapus pesan karena malu. Ada seseorang yang memilih diam karena tidak tahu harus bercerita kepada siapa. Ada seseorang yang mungkin masih menyalahkan dirinya sendiri atas sesuatu yang sejak awal bukan kesalahannya." },
        { type: "p", text: "Dan ketika seorang perempuan akhirnya berani berbicara, pertanyaan yang datang sering kali justru bukan, “apa yang terjadi kepadamu?”" },
        { type: "p", text: "Melainkan:" },
        { type: "p", text: <i>“Pakai baju apa?”</i> },
        { type: "p", text: <i>“Pulang jam berapa?”</i> },
        { type: "p", text: <i>“Kenapa sendirian?”</i> },
        { type: "p", text: <i>“Kenapa tidak melawan?”</i> },
        { type: "p", text: <i>“Kenapa masih berada di sana?”</i> },
        { type: "p", text: "Seolah-olah selalu ada sesuatu dari diri korban yang harus diperiksa terlebih dahulu sebelum kesalahan pelaku dibicarakan." },
        { type: "p", text: "Seolah-olah pakaian dapat menjadi izin." },
        { type: "p", text: "Seolah-olah waktu dapat menjadi pembenaran." },
        { type: "p", text: "Seolah-olah berada di tempat tertentu berarti seseorang kehilangan hak untuk dihormati." },
        { type: "p", text: "Inilah victim blaming, ketika korban justru dibebani pertanyaan yang seharusnya diarahkan kepada pelaku. Padahal, tidak ada pakaian yang mengundang pelecehan. Tidak ada jam pulang yang memberikan izin untuk melakukan kekerasan. Tidak ada sikap, senyum, ataupun keberadaan seseorang yang dapat menjadi persetujuan untuk menyakiti tubuh dan martabatnya." },
        { type: "p", text: "Yang salah adalah tindakan kekerasannya." },
        { type: "p", text: "Yang harus dipertanyakan adalah pelakunya." },
        { type: "p", text: "Yang seharusnya dibangun adalah ruang yang membuat korban berani berbicara, bukan ruang yang membuat mereka semakin takut untuk bersuara." },
        { type: "p", text: "Sebab mungkin selama ini kita terlalu sering meminta perempuan untuk mengubah dirinya demi menghindari kekerasan." },
        { type: "p", text: <i>“Jangan pulang terlalu malam.”</i> },
        { type: "p", text: <i>“Jangan memakai pakaian seperti itu.”</i> },
        { type: "p", text: <i>“Jangan berjalan sendirian.”</i> },
        { type: "p", text: <i>“Jangan terlalu ramah.”</i> },
        { type: "p", text: <i>“Jangan terlalu percaya orang.”</i> },
        { type: "p", text: <i>“Jangan duduk di tempat itu.”</i> },
        { type: "p", text: <i>“Jangan pergi ke sana.”</i> },
        { type: "p", text: "Jangan ini. Jangan itu." },
        { type: "p", text: "Begitu banyak “jangan” yang dibebankan kepada perempuan, sampai kita lupa mengajarkan satu hal yang jauh lebih penting kepada mereka yang berpotensi menjadi pelaku:" },
        { type: "p", text: <b>Jangan menyakiti orang lain.</b> },
        { type: "p", text: "Mengapa perempuan yang harus terus belajar bagaimana cara menghindari kekerasan, sementara masyarakat tidak cukup serius belajar bagaimana cara menghentikannya?" },
        { type: "p", text: "Apa lagi yang harus dikorbankan perempuan hanya untuk merasa aman?" },
        { type: "p", text: "Uang untuk memilih transportasi yang lebih mahal." },
        { type: "p", text: "Waktu untuk mencari jalan pulang yang lebih ramai." },
        { type: "p", text: "Kebebasan untuk menentukan pakaian sendiri." },
        { type: "p", text: "Tenaga untuk terus waspada." },
        { type: "p", text: "Tidur yang terganggu karena takut." },
        { type: "p", text: "Dan mungkin, bagian paling menyakitkan: rasa percaya kepada dunia yang perlahan-lahan hilang." },
        { type: "p", text: "Padahal perempuan seharusnya tidak perlu membayar semahal itu hanya untuk mendapatkan sesuatu yang sejak awal merupakan haknya." },
        { type: "p", text: <b>Rasa aman bukan kemewahan.</b> },
        { type: "p", text: "Ia bukan hadiah untuk perempuan yang berpakaian “pantas”." },
        { type: "p", text: "Ia bukan penghargaan untuk mereka yang pulang sebelum malam." },
        { type: "p", text: "Ia bukan sesuatu yang harus diperoleh setelah perempuan membuktikan bahwa dirinya cukup berhati-hati." },
        { type: "p", text: "Rasa aman adalah hak." },
        { type: "p", text: "Dan rasa hormat seharusnya tidak pernah menjadi sesuatu yang harus diminta." },
        { type: "p", text: "Untuk setiap perempuan yang pernah mengalami hal serupa, aku ingin mengatakan satu hal:" },
        { type: "p", text: <b>Ini bukan salahmu.</b> },
        { type: "p", text: "Bukan karena pakaianmu." },
        { type: "p", text: "Bukan karena caramu berbicara." },
        { type: "p", text: "Bukan karena kamu terlalu ramah." },
        { type: "p", text: "Bukan karena kamu pulang terlalu malam." },
        { type: "p", text: "Bukan karena kamu berada di tempat yang salah." },
        { type: "p", text: "Dan bukan karena kamu kurang berhati-hati." },
        { type: "p", text: "Apa yang dilakukan seseorang kepadamu adalah tanggung jawab orang tersebut. Kamu tidak menjadi lebih kotor hanya karena seseorang memilih untuk melanggar batasmu. Kamu tidak kehilangan harga dirimu hanya karena seseorang pernah memperlakukanmu tanpa hormat." },
        { type: "p", text: "Kamu tetap berharga." },
        { type: "p", text: "Bahkan setelah hari yang paling buruk sekalipun." },
        { type: "p", text: "Bahkan setelah kamu merasa takut." },
        { type: "p", text: "Bahkan setelah kamu menangis sendirian dan bertanya-tanya apakah semua ini salahmu." },
        { type: "p", text: "Tidak." },
        { type: "p", text: "Kamu tidak gagal menjadi perempuan hanya karena dunia pernah gagal menjagamu." },
        { type: "p", text: "Dan mungkin, suatu hari nanti, kita tidak lagi hidup di dunia yang mengajarkan perempuan bagaimana cara bertahan dari kekerasan, melainkan dunia yang sejak awal mengajarkan manusia untuk tidak melakukan kekerasan." },
        { type: "p", text: "Sampai hari itu datang, semoga kita tidak berhenti bertanya." },
        { type: "p", text: "Tidak berhenti bersuara." },
        { type: "p", text: "Tidak berhenti menciptakan ruang yang lebih aman." },
        { type: "p", text: "Karena perempuan tidak seharusnya menghabiskan hidupnya dengan menghitung risiko hanya untuk sekadar pulang ke rumah." },
        { type: "p", text: "Perempuan seharusnya bisa berjalan tanpa menundukkan kepala karena takut." },
        { type: "p", text: "Bisa tertawa tanpa takut disalahartikan." },
        { type: "p", text: "Bisa berpakaian tanpa merasa bersalah." },
        { type: "p", text: "Bisa mengatakan tidak tanpa harus menjelaskan berkali-kali." },
        { type: "p", text: "Dan yang paling sederhana, bisa hidup tanpa terus-menerus bertanya apakah hari ini dirinya akan aman." },
      ],
    },
    {     
      id: "a2",
      slug: "mengenal-uu-tpks-bab-1",
      headline: true,
      category: "law",
      author: "Tim Hukum Svarati",
      title: "Mengenal Undang-Undang Tindak Pidana Kekerasan Seksual: Pengenalan dan Tujuan Dasar",
      summary: "Memahami fondasi UU TPKS: siapa yang dilindungi, hak-hak korban, dan tujuan utama dibuatnya undang-undang ini.",
      date: "27 Okt 2026",
      readTime: "4 menit baca",
      image: "/hukum.jpg",
      likes: 5,
      body: [
        { type: "p", text: "Undang-Undang Nomor 12 Tahun 2022 dibuat khusus untuk memberikan perlindungan dan keadilan terkait kasus kekerasan seksual di Indonesia. Pada Bab I (Pasal 1 sampai Pasal 3), aturan ini meletakkan fondasi dasar, menjelaskan pihak-pihak yang terlibat, serta tujuan utama dari undang-undang ini." },
        { type: "p", text: "Dalam undang-undang ini, perlindungan difokuskan kepada Korban, yaitu siapa saja yang mengalami penderitaan fisik, mental, maupun kerugian ekonomi dan sosial akibat kekerasan seksual. Aturan ini juga memberikan perhatian khusus pada kelompok rentan, seperti Anak (siapa saja yang belum berusia 18 tahun, termasuk yang masih dalam kandungan) dan Penyandang Disabilitas (orang yang memiliki keterbatasan fisik atau mental yang membuatnya kesulitan beraktivitas penuh). Penting untuk diketahui bahwa pelaku kejahatan ini tidak hanya perorangan, tetapi bisa juga berupa Korporasi atau sebuah perusahaan/badan usaha." },
        { type: "p", text: "Korban dan para saksi tidak akan dibiarkan sendirian dalam menghadapi proses hukum. Mereka berhak mendapatkan bantuan dari seorang Pendamping yang dapat dipercaya, serta perlindungan dari lembaga-lembaga resmi pemerintah seperti Lembaga Perlindungan Saksi dan Korban (LPSK) dan unit pelayanan terpadu di daerah (UPTD PPA)." },
        { type: "p", text: "Salah satu hak terpenting bagi korban dalam bab ini adalah Restitusi. Restitusi adalah uang ganti rugi yang wajib dibayarkan oleh pelaku kejahatan kepada korban untuk mengganti semua kerugian yang dialami. Jika terjadi kendala, negara juga menyiapkan Dana Bantuan Korban sebagai bentuk kompensasi. Secara keseluruhan, korban berhak mendapatkan penanganan medis dan hukum yang baik, perlindungan rasa aman, hingga proses pemulihan atau rehabilitasi agar bisa kembali menjalani hidup secara wajar." },
        { type: "p", text: "Undang-undang ini dijalankan dengan prinsip sangat menghargai martabat manusia, tidak membeda-bedakan latar belakang siapa pun (tanpa diskriminasi), menjamin keadilan hukum, dan selalu mengutamakan kepentingan terbaik bagi korban." },
        { type: "p", text: "Tujuan utama diciptakannya hukum ini sangat jelas, yaitu:" },
        { type: "p", text: "• Mencegah terjadinya segala bentuk kekerasan seksual." },
        { type: "p", text: "• Menangani, melindungi, dan memulihkan kondisi korban." },
        { type: "p", text: "• Menghukum pelaku sesuai perbuatannya dan memberikan rehabilitasi agar mereka menyadari kesalahannya." },
        { type: "p", text: "• Menciptakan lingkungan masyarakat yang aman dan bebas dari kekerasan seksual." },
        { type: "p", text: "• Memastikan kejadian buruk tersebut tidak terulang kembali di masa depan." },
        { type: "p", text: <i>Sumber: UU Nomor 12 Tahun 2022 (Bab I, Pasal 1 - 3).</i> },
      ],
    },
    { id: "a3", slug: "kenali-kekerasan-digital", headline: true, category: "safety", author: "Tim Keamanan Svarati",
      title: "Kekerasan Seksual Berbasis Elektronik: Kenali dan Lawan",
      summary: "Ancaman penyebaran foto atau video intim adalah kejahatan. Pelajari cara mengamankan bukti dan langkah pelaporannya.",
      date: "3 Okt 2026", readTime: "7 menit baca", image: "/edukasi/artikel-3.jpg" },
    {  
      id: "a4",
      slug: "stres-dan-siklus-menstruasi-remaja",
      headline: false,
      category: "reproductive",
      author: "Tim Medis Svarati",
      title: "Pengaruh Stres terhadap Keteraturan Siklus Menstruasi pada Remaja",
      summary: "Bagaimana stres emosional memengaruhi hormon dan membuat siklus menstruasi remaja putri menjadi tidak teratur, serta cara menjaganya.",
      date: "27 Okt 2026",
      readTime: "3 menit baca",
      image: "/imagea4.jpg",
      likes: 0,
      body: [
        { type: "p", text: "Masa remaja merupakan periode transisi yang diwarnai oleh berbagai perubahan fisik, emosional, dan psikologis. Salah satu masalah kesehatan reproduksi yang cukup sering dialami oleh remaja putri adalah ketidakteraturan siklus menstruasi. Di antara berbagai faktor gaya hidup, kondisi stres emosional terbukti menjadi salah satu pemicu utama yang mempengaruhi kelancaran siklus bulanan tersebut." },
        { type: "p", text: "Tekanan emosional atau beban pikiran yang tinggi memiliki dampak langsung terhadap keseimbangan hormon di dalam tubuh. Ketika seorang remaja mengalami stres pada tingkat sedang hingga berat, tubuh akan merespons dengan meningkatkan produksi hormon kortisol. Lonjakan hormon kortisol ini kemudian dapat menekan kadar Luteinizing Hormone (LH), yaitu hormon yang berfungsi mengatur pelepasan sel telur. Akibat ketidakseimbangan sistem hormonal tersebut, proses pelepasan sel telur menjadi terganggu sehingga jadwal menstruasi menjadi tidak teratur atau terlambat." },
        { type: "p", text: "Sementara itu, durasi dan kualitas tidur pada dasarnya penting untuk pemulihan fisik harian. Namun, apabila durasi tidur remaja masih tercukupi dalam rentang 7 hingga 8 jam per hari, faktor stres emosional tetap menjadi variabel yang paling dominan dalam mempengaruhi stabilitas siklus menstruasi." },
        { type: "p", text: "Oleh karena itu, pengelolaan stres menjadi langkah krusial dalam menjaga kesehatan reproduksi remaja putri. Menerapkan pola hidup seimbang, mengontrol emosi dengan baik, serta meluangkan waktu untuk istirahat dan kegiatan yang menyenangkan dapat membantu menstabilkan produksi hormon dalam tubuh agar siklus menstruasi tetap lancar dan teratur." },

        { type: "p", text: <i>Sumber Referensi: Efendi, B. P., Latifah, Lestari, Y. P., & Basit, M. (2024). Tingkat Stres dan Kualitas Tidur yang Mempengaruhi Siklus Menstruasi pada Remaja Putri. Jurnal Keperawatan Jiwa, 12(3), 657-666.</i> },
      ],
    },
    {
      id: "a5",
      slug: "mengenal-uu-tpks-bab-2",
      headline: false,
      category: "law",
      author: "Tim Hukum Svarati",
      title: "Mengenal UU TPKS: Jenis Perbuatan dan Ancaman Hukuman",
      summary: "Mengenal jenis-jenis kekerasan seksual menurut UU TPKS beserta ancaman pidana, denda, pemberatan hukuman, dan hak korban atas restitusi.",
      date: "27 Okt 2026",
      readTime: "7 menit baca",
      image: "/hukum1.jpg",
      likes: 5,
      body: [
        { type: "p", text: "Bab II (Pasal 4 sampai Pasal 18) memuat aturan inti mengenai tindakan apa saja yang masuk kategori kekerasan seksual beserta sanksi pidana dan denda bagi pelakunya." },
        { type: "p", text: <b>Jenis Kekerasan Seksual (Pasal 4)</b> },
        { type: "p", text: "UU ini mengatur 9 bentuk utama kekerasan seksual. Selain itu, bentuk kejahatan lain yang sudah diatur di hukum sebelumnya (seperti perkosaan, pencabulan, kejahatan seksual pada anak, pornografi anak, pemaksaan pelacuran, perdagangan orang, dan kekerasan seksual dalam rumah tangga) juga diakui sepenuhnya sebagai tindak pidana kekerasan seksual." },
        { type: "p", text: <b>Bentuk Perbuatan dan Sanksinya (Pasal 5 - 14)</b> },
        { type: "ul", items: [
          <><b>Pelecehan Seksual Nonfisik (Pasal 5):</b> Perbuatan seperti siulan, ucapan, atau isyarat bernada seksual yang merendahkan martabat seseorang. Sanksinya adalah penjara paling lama 9 bulan dan/atau denda maksimal Rp10 juta.</>,
          <><b>Pelecehan Seksual Fisik (Pasal 6):</b> Memegang, meraba, atau menyentuh tubuh/organ seksual tanpa persetujuan. Pelaku diancam penjara maksimal 4 tahun dan denda hingga Rp50 juta. Jika perbuatan dilakukan dengan memanfaatkan wewenang, jabatan, atau kondisi korban yang bergantung padanya, sanksi meningkat menjadi penjara maksimal 12 tahun dan denda hingga Rp300 juta.</>,
          <><b>Syarat Pelaporan Pelecehan (Pasal 7):</b> Pelecehan nonfisik dan pelecehan fisik ringan bersifat delik aduan (hanya bisa diproses jika korban melapor). Namun, jika korbannya adalah Anak atau Penyandang Disabilitas, polisi wajib memprosesnya secara langsung meski tanpa laporan dari korban.</>,
          <><b>Pemaksaan Kontrasepsi (Pasal 8):</b> Memaksa orang lain menggunakan alat pencegah kehamilan hingga korban kehilangan fungsi reproduksinya untuk sementara. Sanksinya berupa penjara maksimal 5 tahun dan/atau denda hingga Rp50 juta.</>,
          <><b>Pemaksaan Sterilisasi (Pasal 9):</b> Memaksa atau menghilangkan fungsi reproduksi seseorang secara permanen/tetap. Pelaku diancam penjara maksimal 9 tahun dan/atau denda maksimal Rp200 juta.</>,
          <><b>Pemaksaan Perkawinan (Pasal 10):</b> Memaksa seseorang untuk menikah, termasuk perkawinan anak, pemaksaan nikah atas nama tradisi/budaya, atau memaksa korban memperkosa untuk menikahi pelakunya. Sanksinya adalah penjara maksimal 9 tahun dan/atau denda hingga Rp200 juta.</>,
          <><b>Penyiksaan Seksual (Pasal 11):</b> Kekerasan seksual yang dilakukan oleh pejabat atau aparat resmi untuk mengintimidasi, memaksa pengakuan, atau mempermalukan seseorang. Pelaku diancam penjara maksimal 12 tahun dan/atau denda maksimal Rp300 juta.</>,
          <><b>Eksploitasi Seksual (Pasal 12):</b> Memanfaatkan tubuh atau organ seksual orang lain demi mencari keuntungan atau uang dengan memanfaatkan kerentanan atau ketidakberdayaan korban. Pelaku diancam penjara maksimal 15 tahun dan/atau denda hingga Rp1 miliar.</>,
          <><b>Perbudakan Seksual (Pasal 13):</b> Mengendalikan dan membuat seseorang tidak berdaya agar bisa terus-menerus dieksploitasi secara seksual. Sanksinya adalah penjara maksimal 15 tahun dan/atau denda maksimal Rp1 miliar.</>,
          <><b>Kekerasan Seksual Berbasis Elektronik / Online (Pasal 14):</b> Merekam/mengambil foto bernada seksual tanpa izin, menyebarkan konten seksual pribadi seseorang, atau menguntit seseorang secara digital untuk tujuan seksual. Pelaku diancam penjara maksimal 4 tahun dan denda hingga Rp200 juta. Jika disertai pemerasan atau ancaman, sanksinya naik menjadi penjara maksimal 6 tahun dan denda hingga Rp300 juta. Perekaman atau penyebaran demi pembelaan diri atau kepentingan umum tidak dapat dipidana.</>,
        ] },
        { type: "p", text: <b>Pemberatan Hukuman (Pasal 15)</b> },
        { type: "p", text: "Hukuman penjara dan denda akan ditambah sepertiga (1/3) jika perbuatan dilakukan oleh anggota keluarga, pengajar, tenaga medis, atasan kerja, atau pejabat publik. Pemberatan juga berlaku jika kejahatan dilakukan oleh lebih dari satu orang (bersekutu), dilakukan berulang kali, atau korbannya adalah anak, penyandang disabilitas, wanita hamil, orang pingsan/tidak berdaya, serta dalam kondisi bencana atau perang." },
        { type: "p", text: <b>Ganti Rugi, Hukuman Tambahan, dan Rehabilitasi (Pasal 16 dan 17)</b> },
        { type: "p", text: <><b>Restitusi dan Sanksi Tambahan (Pasal 16):</b> Hakim wajib mewajibkan pelaku membayar uang ganti rugi (restitusi) kepada korban untuk kasus dengan ancaman hukuman 4 tahun atau lebih. Hakim juga dapat menjatuhkan sanksi tambahan berupa pencabutan hak asuh anak, pengumuman identitas pelaku ke publik, serta penyitaan harta hasil kejahatan.</> },
        { type: "p", text: <><b>Rehabilitasi Pelaku (Pasal 17):</b> Selain hukuman pidana, pelaku dapat diwajibkan menjalani rehabilitasi medis dan sosial di bawah pengawasan dinas kesehatan dan sosial.</> },
        { type: "p", text: <b>Hukuman untuk Perusahaan / Korporasi (Pasal 18)</b> },
        { type: "p", text: "Jika tindak pidana kekerasan seksual dilakukan oleh atau atas nama perusahaan (korporasi), perusahaan tersebut diancam denda Rp5 miliar hingga Rp15 miliar. Hakim juga dapat menjatuhkan sanksi tambahan seperti penutupan usaha, pembekuan kegiatan, hingga pembubaran perusahaan." },
        { type: "p", text: <i>Sumber: UU Nomor 12 Tahun 2022 (Bab II, Pasal 4 - 18).</i> },
      ],
    },
        {
      id: "a6",
      slug: "trauma-freeze-fawn",
      headline: false,
      category: "mental",
      author: "Tim Psikologi Svarati",
      title: "Mengapa Korban Bisa 'Freeze' atau 'Fawn'?",
      summary: "Respons tubuh saat menghadapi ancaman bukanlah pilihan sadar, dan bukan tanda bahwa korban menyetujui apa yang terjadi.",
      date: "15 Sep 2026",
      readTime: "5 menit baca",
      image: "/imagea6.jpg",
      likes: 0,
      body: [
        { type: "p", text: "Ketika seseorang berada dalam situasi terancam atau mengalami kekerasan, tanggapan yang paling umum diketahui masyarakat adalah melawan (fight) atau melarikan diri (flight). Namun, dalam banyak kasus ancaman hebat atau kekerasan seksual, korban justru mengalami kondisi freeze (terpaku dan tidak bisa bergerak) atau fawn (menuruti atau berusaha menyenangkan pelaku)." },
        { type: "p", text: "Respons freeze dan fawn bukanlah pertanda bahwa korban lemah, pasrah, atau menyetujui perlakuan yang dialaminya. Kedua respons ini merupakan mekanisme pertahanan diri otomatis dari otak dan sistem saraf demi mempertahankan hidup." },

        { type: "p", text: <b>Mekanisme Otomatis Sistem Saraf</b> },
        { type: "p", text: "Saat ancaman datang, bagian otak yang bernama amigdala langsung memproses bahaya dan mengaktifkan sistem saraf otonom. Otak akan melakukan kalkulasi kilat tentang tindakan yang paling memungkinkan untuk bertahan hidup. Ketika sistem saraf menilai bahwa melawan atau melarikan diri justru akan memperbesar risiko kematian atau cedera yang lebih parah, tubuh secara otomatis beralih ke mode pertahanan freeze atau fawn." },

        { type: "p", text: <b>Memahami Respons 'Freeze' (Terpaku)</b> },
        { type: "p", text: "Freeze atau tonic immobility adalah kondisi kelumpuhan sementara secara involunter (tanpa kendali sadar). Korban merasa tubuhnya mendadak kaku, bersuara pun tidak mampu, meskipun dalam keadaan sadar penuh. Secara biologis, respons ini terjadi ketika otak mengaktifkan sistem saraf parasimpatis secara ekstrem untuk menahan rasa sakit fisik dan meminimalkan kerusakan pada tubuh akibat ancaman hebat." },

        { type: "p", text: <b>Memahami Respons 'Fawn' (Berusaha Menyenangkan Ancaman)</b> },
        { type: "p", text: "Respons fawn merujuk pada perilaku menuruti keinginan pelaku, berbicara dengan nada lembut, atau berpura-pura kooperatif saat ancaman berlangsung. Mekanisme ini digunakan oleh otak untuk meredam kecenderungan agresif pelaku (de-escalation) demi mencegah kekerasan fisik yang lebih fatal. Korban tidak bertindak berdasarkan keinginan pribadi, melainkan dorongan biologis untuk meminimalkan bahaya saat itu juga." },

        { type: "p", text: <b>Refleks Pertahanan Tubuh Bukan Persetujuan (Consent)</b> },
        { type: "p", text: "Hal mendasar yang harus dipahami oleh masyarakat maupun penegak hukum adalah bahwa persetujuan (consent) hanya dapat diberikan secara sadar, bebas, dan tanpa paksaan. Respons freeze dan fawn adalah refleks neurobiologis involunter di bawah tekanan dan ancaman. Oleh karena itu, ketidakmampuan untuk melawannya atau perilaku menuruti ancaman tidak boleh disalahartikan sebagai persetujuan dari korban." },

        { type: "p", text: <i>Sumber Referensi:</i> },
        { type: "ul", items: [
          "Möller, A., Söndergaard, H. P., & Helström, L. (2017). Tonic immobility during sexual assault - a common reaction predicting post-traumatic stress disorder and severe depression. Acta Obstetricia et Gynecologica Scandinavica, 96(8), 932-938.",
          "Porges, S. W. (2011). The Polyvagal Theory: Neurophysiological Foundations of Emotions, Attachment, Communication, and Self-regulation. W. W. Norton & Company.",
          "Walker, P. (2013). Complex PTSD: From Surviving to Thriving. Azure Coyote Publishing.",
        ] },
      ],
    },
    { 
      id: "a7",
      slug: "hak-di-tempat-kerja",
      headline: false,
      category: "rights",
      author: "Redaksi Svarati",
      title: "Hakmu di Tempat Kerja dan Kampus: Perlindungan Hukum dan Mekanisme Pengaduan Pelecehan",
      summary: "Perlindungan hukum dari pelecehan di lingkungan kerja dan pendidikan, serta mekanisme pengaduan yang bisa kamu gunakan.",
      date: "9 Sep 2026",
      readTime: "6 menit baca",
      image: "/imagea7.jpg",
      likes: 0,
      body: [
        { type: "p", text: "Sebagai perempuan, setiap individu memiliki hak dasar yang dilindungi oleh hukum untuk belajar dan bekerja dalam lingkungan yang aman, adil, serta bebas dari segala bentuk diskriminasi maupun kekerasan. Hak-hak ini mencakup jaminan atas kesehatan reproduksi, kesetaraan kesempatan karir dan akademik, hingga perlindungan fisik dan mental dari perlakuan tidak adil yang memanfaatkan ketimpangan relasi kuasa." },

        { type: "p", text: <b>Gambaran Hak Dasar di Tempat Kerja dan Kampus</b> },
        { type: "ul", items: [
          <><b>Hak di Tempat Kerja:</b> Perempuan berhak atas lingkungan kerja yang bebas dari intimidasi dan perlakuan diskriminatif. Hal ini mencakup perlindungan kesehatan reproduksi (seperti hak atas cuti haid, cuti melahirkan, cuti keguguran, serta waktu/fasilitas menyusui), kesetaraan upah dan promosi jabatan, serta jaminan penanganan jika terjadi pelecehan di tempat kerja.</>,
          <><b>Hak di Lingkungan Kampus:</b> Perempuan berhak atas ruang belajar yang aman dari bahaya kekerasan seksual dan penyalahgunaan relasi kuasa oleh sesama civitas akademika. Kampus wajib menyediakan pendampingan medis dan psikologis, menjaga kerahasiaan identitas pelapor, serta menjamin keberlanjutan hak akademik korban tanpa ancaman sanksi atau intimidasi.</>,
        ] },

        { type: "p", text: <b>Payung Hukum Perlindungan</b> },
        { type: "p", text: "Untuk menjamin pemenuhan hak-hak tersebut, pemerintah Indonesia telah menetapkan regulasi yang mengikat sektor pendidikan dan ketenagakerjaan:" },
        { type: "ul", items: [
          <><b>Di Lingkungan Kampus:</b> Permendikbudristek No. 30 Tahun 2021 mewajibkan setiap perguruan tinggi membentuk Satuan Tugas Pencegahan dan Penanganan Kekerasan Seksual (Satgas PPKS) serta menyediakan mekanisme penanganan laporan kekerasan seksual yang transparan.</>,
          <><b>Di Lingkungan Kerja:</b> Kepmenaker No. 88 Tahun 2023 memberikan petunjuk teknis pencegahan dan penanganan kekerasan seksual di tempat kerja. Hal ini diperkuat oleh Undang-Undang No. 12 Tahun 2022 tentang Tindak Pidana Kekerasan Seksual (UU TPKS) yang menindak tegas tindak kekerasan seksual yang memanfaatkan relasi kuasa di dunia kerja.</>,
        ] },

        { type: "p", text: <b>Hak-Hak Utama Korban dan Pelapor</b> },
        { type: "p", text: "Apabila terjadi tindak kekerasan atau pelecehan, korban maupun pelapor berhak mendapatkan:" },
        { type: "ul", items: [
          <><b>Hak atas Penanganan:</b> Akses langsung terhadap bantuan hukum, layanan konseling psikologis, serta tindakan medis tanpa diskriminasi.</>,
          <><b>Hak atas Perlindungan:</b> Jaminan kerahasiaan identitas dan perlindungan penuh dari ancaman balasan, seperti Pemutusan Hubungan Kerja (PHK), skorsing, atau penurunan nilai akademik.</>,
          <><b>Hak atas Pemulihan:</b> Pemulihan kondisi fisik, mental, serta pemulihan status kerja atau akademik yang terdampak akibat kejadian tersebut.</>,
        ] },

        { type: "p", text: <b>Langkah dan Mekanisme Pengaduan</b> },
        { type: "p", text: "Jika Anda atau rekan Anda mengalami pelecehan di kampus maupun tempat kerja, langkah-langkah penanganan yang dapat ditempuh meliputi:" },
        { type: "ol", items: [
          <><b>Mengumpulkan dan Memelihara Bukti:</b> Simpan pesan singkat, pos-el, dokumen fisik, rekaman suara, tangkapan layar, serta catat rincian kejadian dan saksi-saksi yang berada di lokasi.</>,
          <>
            <b>Melaporkan ke Unit Internal:</b>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Di kampus: Hubungi Satgas PPKS perguruan tinggi setempat.</li>
              <li>Di tempat kerja: Laporkan kepada divisi HRD, Manajer Kepatuhan, atau tim internal penanganan kekerasan di perusahaan.</li>
            </ul>
          </>,
          <><b>Mengakses Layanan Rujukan Nasional:</b> Manfaatkan layanan pengaduan pemerintah melalui Call Center SAPA 129 (KemenPPPA) via telepon di nomor 129 atau pesan WhatsApp di 08111-129-129.</>,
          <><b>Menempuh Jalur Hukum:</b> Mengajukan laporan resmi kepada pihak kepolisian dengan menggunakan landasan hukum UU TPKS.</>,
        ] },

        { type: "p", text: <i>Sumber Referensi:</i> },
        { type: "ul", items: [
          "Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi Republik Indonesia. (2021). Peraturan Menteri Pendidikan, Kebudayaan, Riset, dan Teknologi Nomor 30 Tahun 2021 tentang Pencegahan dan Penanganan Kekerasan Seksual di Lingkungan Perguruan Tinggi.",
          "Kementerian Ketenagakerjaan Republik Indonesia. (2023). Keputusan Menteri Ketenagakerjaan Nomor 88 Tahun 2023 tentang Pedoman Pencegahan dan Penanganan Kekerasan Seksual di Tempat Kerja.",
          "Undang-Undang Republik Indonesia Nomor 12 Tahun 2022 tentang Tindak Pidana Kekerasan Seksual (UU TPKS).",
        ] },
      ],
    },
    { id: "a8", slug: "mengamankan-akun", headline: false, category: "safety", author: "Tim Keamanan Svarati",
      title: "Cara Mengamankan Akun dan Jejak Digitalmu",
      summary: "Langkah praktis melindungi akun, lokasi, dan percakapan dari pihak yang tidak berhak mengaksesnya.",
      date: "2 Sep 2026", readTime: "4 menit baca", image: "/edukasi/artikel-8.jpg" },
    {
      id: "a9",
      slug: "mengenal-uu-tpks-bab-3",
      headline: false,
      category: "law",
      author: "Tim Hukum Svarati",
      title: "Mengenal UU TPKS: Tindak Pidana Lain yang Berkaitan",
      summary: "Aturan tegas bagi siapa pun yang berusaha menghalangi jalannya proses hukum dalam penanganan kasus kekerasan seksual.",
      date: "27 Okt 2026",
      readTime: "2 menit baca",
      image: "/hukum2.jpg",
      likes: 0,
      body: [
        { type: "p", text: "Bab III terdiri dari Pasal 19 yang mengatur aturan tegas bagi siapa saja yang berusaha menghalangi jalannya proses hukum dalam penanganan kasus kekerasan seksual." },
        { type: "p", text: <b>Larangan Menghalangi Proses Hukum (Pasal 19)</b> },
        { type: "p", text: "Setiap orang dilarang keras secara sengaja mencegah, merintangi, atau menggagalkan proses hukum yang sedang berjalan, baik secara langsung maupun tidak langsung. Larangan ini berlaku pada seluruh tingkatan proses peradilan, mulai dari penyidikan oleh pihak kepolisian, penuntutan oleh jaksa, hingga pemeriksaan perkara di sidang pengadilan." },
        { type: "p", text: "Tindakan menghalangi ini mencakup perbuatan yang menyasar atau memengaruhi posisi tersangka, terdakwa, maupun saksi. Bagi siapa pun yang terbukti melakukan perbuatan merintangi proses peradilan ini, diancam dengan hukuman penjara paling lama 5 tahun." },
        { type: "p", text: <i>Sumber: UU Nomor 12 Tahun 2022 (Bab III, Pasal 19).</i> },
      ],
    },
    {
      id: "a10",
      slug: "mengenal-uu-tpks-bab-4",
      headline: false,
      category: "law",
      author: "Tim Hukum Svarati",
      title: "Mengenal UU TPKS: Prosedur Hukum, Alat Bukti, dan Perlindungan Korban",
      summary: "Alur proses hukum dari pelaporan sampai putusan hakim, jenis alat bukti, pendampingan, restitusi, dan perlindungan darurat bagi korban.",
      date: "27 Okt 2026",
      readTime: "10 menit baca",
      image: "/hukum3.jpg",
      likes: 0,
      body: [
        { type: "p", text: "Bab IV mengatur seluruh tahapan proses hukum mulai dari pelaporan, pemeriksaan, pembuktian, hingga pelaksanaan putusan hakim. Agar mudah dipahami, berikut adalah pengelompokan seluruh pasal dalam Bab IV beserta penjelasannya:" },

        { type: "p", text: <b>1. Aturan Umum dan Syarat Aparat Hukum (Pasal 20 - 23)</b> },
        { type: "ul", items: [
          <><b>Prinsip Dasar Hukum (Pasal 20):</b> Seluruh proses peradilan menggunakan aturan hukum acara pidana biasa, kecuali jika diatur secara khusus di dalam UU ini.</>,
          <><b>Syarat Aparat Penegak Hukum (Pasal 21):</b> Polisi, jaksa, dan hakim wajib memiliki pemahaman hak asasi manusia, bersikap empati pada korban, serta pernah mengikuti pelatihan khusus kekerasan seksual. Jika belum ada, pimpinan lembaga harus menunjuk petugas yang berpengalaman.</>,
          <><b>Sikap Aparat Saat Memeriksa (Pasal 22):</b> Aparat dilarang keras menakut-nakuti korban, dilarang menyalahkan cara hidup atau pakaian korban, dan dilarang memberikan pertanyaan yang menjebak atau membuat korban trauma.</>,
          <><b>Dilarang Damai di Luar Pengadilan (Pasal 23):</b> Kasus kekerasan seksual wajib diproses secara hukum dan tidak boleh diselesaikan secara “kekeluargaan”, kecuali jika pelakunya adalah anak-anak.</>,
        ] },

        { type: "p", text: <b>2. Kemudahan Pembuktian dan Alat Bukti (Pasal 24 - 25)</b> },
        { type: "ul", items: [
          <><b>Jenis Alat Bukti Sah (Pasal 24):</b> Bukti kekerasan seksual tidak hanya berupa kesaksian biasa, tetapi juga bisa berupa bukti elektronik (chat, rekaman, foto), rekam medis, hasil pemeriksaan forensik, surat keterangan dari psikolog/psikiater, hingga rekam rekening bank.</>,
          <><b>Kemudahan Pembuktian (Pasal 25):</b> Kesaksian dari korban yang ditambah 1 alat bukti sah lainnya sudah cukup bagi hakim untuk menyatakan pelaku bersalah. Selain itu, kesaksian dari keluarga pelaku di bawah sumpah dapat diterima, serta kesaksian dari penyandang disabilitas diakui memiliki kekuatan hukum yang setara.</>,
        ] },

        { type: "p", text: <b>3. Pendampingan Korban dan Saksi (Pasal 26 - 29)</b> },
        { type: "ul", items: [
          <><b>Hak Didampingi (Pasal 26):</b> Korban berhak ditemani oleh pendamping (dari LPSK, UPTD PPA, advokat, psikolog, atau pekerja sosial) dari awal laporan hingga persidangan selesai, di mana pendamping diutamakan memiliki jenis kelamin yang sama dengan korban.</>,
          <><b>Pendampingan Penyandang Disabilitas (Pasal 27):</b> Korban atau saksi penyandang disabilitas berhak ditemani orang tua, wali, atau pendamping khusus, selama orang tua/wali tersebut bukan merupakan tersangka.</>,
          <><b>Perlindungan Bagi Pendamping (Pasal 28 dan 29):</b> Pendamping mendapatkan perlindungan hukum penuh dan tidak dapat dituntut secara pidana maupun perdata selama menjalankan tugasnya dengan niat baik.</>,
        ] },

        { type: "p", text: <b>4. Tata Cara Ganti Rugi / Restitusi (Pasal 30 - 38)</b> },
        { type: "ul", items: [
          <><b>Bentuk Ganti Rugi (Pasal 30):</b> Korban berhak atas restitusi yang meliputi penggantian harta/penghasilan yang hilang, penderitaan fisik/mental yang dialami, biaya pengobatan medis dan psikologis, serta biaya peradilan.</>,
          <><b>Pemberitahuan dan Penyitaan Harta (Pasal 31):</b> Polisi, jaksa, dan hakim wajib memberi tahu korban soal hak restitusi. Polisi dapat menyita harta pelaku sejak tahap penyidikan sebagai jaminan ganti rugi atas izin pengadilan.</>,
          <><b>Pengembalian Harta (Pasal 32):</b> Harta pelaku yang disita wajib dikembalikan jika pengadilan menyatakan pelaku tidak bersalah atau diputus bebas.</>,
          <><b>Tenggat Pelunasan dan Sanksi Pengganti (Pasal 33):</b> Pelaku wajib membayar ganti rugi maksimal 30 hari setelah putusan inkrah. Jika tidak dibayar, harta pelaku akan dilelang oleh jaksa. Apabila hartanya tidak cukup, pelaku diganti dengan hukuman penjara tambahan. Untuk perusahaan, sanksi penggantinya berupa penutupan usaha maksimal 1 tahun.</>,
          <><b>Berita Acara Pembayaran (Pasal 34):</b> Jaksa wajib membuat laporan resmi mengenai penyerahan restitusi kepada korban, polisi, dan pengadilan.</>,
          <><b>Bantuan Kompensasi Negara (Pasal 35):</b> Jika harta pelaku yang dilelang tetap tidak cukup untuk membayar ganti rugi, negara akan membayar kekurangannya kepada korban melalui Dana Bantuan Korban.</>,
          <><b>Kasus yang Dihentikan (Pasal 36):</b> Jika kasus dihentikan demi hukum atau kepentingan umum, harta pelaku yang sempat disita tetap dapat dilelang atas izin pengadilan untuk membayar restitusi kepada korban.</>,
          <><b>Pelaku Anak (Pasal 37):</b> Jika pelaku kekerasan seksual adalah anak-anak, pembayaran ganti rugi menjadi tanggung jawab orang tua atau walinya.</>,
          <><b>Aturan Pengajuan (Pasal 38):</b> Tata cara pengajuan restitusi mengikuti ketentuan peraturan perundang-undangan yang berlaku.</>,
        ] },

        { type: "p", text: <b>5. Pelaporan dan Perlindungan Darurat (Pasal 39 - 47)</b> },
        { type: "ul", items: [
          <><b>Tempat Lapor dan Kewajiban Tenaga Medis (Pasal 39):</b> Laporan dapat diajukan ke polisi, UPTD PPA, atau lembaga sosial. Tenaga medis yang menemukan tanda kekerasan seksual wajib melaporkannya ke pihak berwenang.</>,
          <><b>Tanggung Jawab Lembaga Layanan (Pasal 40):</b> UPTD PPA atau lembaga layanan setempat wajib memberikan perlindungan dan bantuan yang dibutuhkan korban secara langsung.</>,
          <><b>Kerahasiaan Laporan (Pasal 41):</b> Laporan harus diterima di ruang khusus yang aman dan rahasia. Lembaga penerima laporan wajib memproses laporan ke polisi paling lambat 3x24 jam.</>,
          <><b>Perlindungan Darurat 1x24 Jam (Pasal 42):</b> Polisi wajib memberikan perlindungan awal paling lambat 1x24 jam setelah laporan diterima, yang berlaku selama 14 hari dan berwenang membatasi gerak pelaku agar tidak mendekati korban.</>,
          <><b>Perlindungan Lanjutan ke LPSK (Pasal 43 dan 44):</b> Dalam 1x24 jam sejak memberi perlindungan awal, polisi wajib mengajukan perlindungan jangka panjang bagi korban ke LPSK dengan melibatkan UPTD PPA.</>,
          <><b>Pembatasan Gerak Pelaku oleh Hakim (Pasal 45):</b> Jika tersangka tidak ditahan, hakim dapat memerintahkan pembatasan gerak pelaku (misalnya dilarang mendatangi korban) selama 6 bulan dan bisa diperpanjang 1 kali.</>,
          <><b>Penghapusan Konten Digital (Pasal 46 dan 47):</b> Pemerintah berwenang langsung memutus akses konten kekerasan seksual di internet, dan jaksa dapat meminta pengadilan memerintahkan Kominfo menghapus konten digital tersebut demi kepentingan umum.</>,
        ] },

        { type: "p", text: <b>6. Aturan Pemeriksaan Saksi dan Korban (Pasal 48 - 51)</b> },
        { type: "ul", items: [
          <><b>Metode Pemeriksaan Alternatif (Pasal 48):</b> Jika saksi/korban berhalangan hadir di persidangan karena sakit, takut, atau alasan keamanan, pemeriksaan dapat menggunakan pembacaan berita acara, rekaman video, atau video call.</>,
          <><b>Pemeriksaan Rekaman Elektronik (Pasal 49 dan 50):</b> Penyidik polisi bisa merekam pemeriksaan saksi/korban atas izin ketua pengadilan negeri agar korban tidak perlu ditanya berulang-ulang, dan hasilnya dituangkan dalam berita acara resmi.</>,
          <><b>Pemeriksaan Video Call di Persidangan (Pasal 51):</b> Hakim dapat memerintahkan persidangan via video call dari tempat lain yang aman atau kantor perwakilan RI jika saksi/korban berada di luar negeri.</>,
        ] },

        { type: "p", text: <b>7. Prosedur Khusus Penyidikan dan Penuntutan (Pasal 52 - 57)</b> },
        { type: "ul", items: [
          <><b>Pemeriksaan Anak (Pasal 52):</b> Untuk saksi/korban anak, pemeriksaan rekaman atau video call dapat dilakukan demi keselamatan anak, baik dengan atau tanpa persetujuan orang tua.</>,
          <><b>Tempat Pemeriksaan Khusus (Pasal 53):</b> Pemeriksaan oleh penyidik dilakukan di ruang pelayanan khusus polisi, UPTD PPA, atau tempat aman seperti rumah sakit/rumah aman.</>,
          <><b>Konsultasi Pendamping (Pasal 54):</b> Polisi wajib berkonsultasi dengan pendamping sebelum bertanya kepada korban, dan pertanyaan disalurkan lewat pendamping jika korban trauma berat.</>,
          <><b>Pengamanan Data Digital (Pasal 55):</b> Penyidik berwenang mengunci data/sistem elektronik kasus agar tidak tersebar ke luar proses hukum atas penetapan kejaksaan.</>,
          <><b>Pertemuan Pendahuluan (Pasal 56):</b> Jaksa dapat bertemu korban dan pendamping sebelum sidang untuk menjelaskan tahapan peradilan, hak restitusi, dan hak pemeriksaan jarak jauh.</>,
          <><b>Aturan Wajah dan Detail Dakwaan (Pasal 57):</b> Jaksa dilarang menuliskan dakwaan secara vulgar, terlalu rinci, atau menempelkan foto organ seksual korban demi menjaga martabat dan kerahasiaan korban.</>,
        ] },

        { type: "p", text: <b>8. Pelaksanaan Persidangan dan Putusan (Pasal 58 - 64)</b> },
        { type: "ul", items: [
          <><b>Sidang Tertutup (Pasal 58):</b> Seluruh rangkaian persidangan kekerasan seksual wajib digelar secara tertutup untuk umum.</>,
          <><b>Kerahasiaan Identitas (Pasal 59):</b> Pembacaan putusan dilakukan terbuka untuk umum, tetapi nama dan identitas korban serta saksi wajib dirahasiakan dalam surat putusan.</>,
          <><b>Pertanyaan yang Dilarang di Sidang (Pasal 60):</b> Hakim dan jaksa dilarang memberikan pertanyaan yang merendahkan, menyalahkan, mengintimidasi, atau mengungkit latar belakang kehidupan seksual korban.</>,
          <><b>Fasilitas Sidang (Pasal 61 dan 62):</b> Pengadilan wajib menyediakan fasilitas perlindungan bagi saksi/korban, dan hakim dapat memerintahkan penggantian pendamping jika diminta oleh korban/keluarga.</>,
          <><b>Wajib Memuat Pemulihan (Pasal 63):</b> Hakim dalam putusannya wajib mempertimbangkan dan mencantumkan upaya pemulihan bagi korban.</>,
          <><b>Eksekusi Pidana Denda (Pasal 64):</b> Denda pidana wajib dilunasi pelaku dalam waktu 30 hari. Jika tidak dibayar, hartanya dilelang oleh jaksa, dan jika hartanya kurang, diganti dengan hukuman penjara pengganti. Bagi korporasi, sanksi penggantinya berupa pembekuan kegiatan usaha maksimal 1 tahun.</>,
        ] },

        { type: "p", text: <i>Sumber: UU Nomor 12 Tahun 2022 (Bab IV, Pasal 20 - 64).</i> },
      ],
    },
    {
      id: "a11",
      slug: "status-gizi-pola-makan-dan-nyeri-menstruasi",
      headline: false,
      category: "reproductive",
      author: "Tim Medis Svarati",
      title: "Hubungan Status Gizi dan Pola Makan terhadap Nyeri Menstruasi (Dismenore) pada Wanita",
      summary: "Mengapa nyeri haid bisa lebih parah, dan bagaimana status gizi serta pola makan memengaruhi tingkat keparahannya.",
      date: "27 Okt 2026",
      readTime: "3 menit baca",
      image: "/imagea11.jpg",
      likes: 0,
      body: [
        { type: "p", text: "Nyeri menstruasi atau dismenore merupakan salah satu gangguan kesehatan reproduksi yang paling umum dialami oleh wanita usia subur. Rasa kram atau nyeri pada perut bagian bawah saat menstruasi terjadi akibat peningkatan produksi senyawa prostaglandin yang memicu kontraksi otot rahim. Meskipun kerap dianggap sebagai hal yang wajar, tingkat keparahan nyeri menstruasi ini sangat dipengaruhi oleh kondisi fisik dan pola hidup harian, khususnya status gizi dan asupan makanan." },
        { type: "p", text: "Status gizi yang tidak seimbang, baik terlalu kurus maupun berlebih, dapat mengganggu kestabilan hormon reproduksi wanita. Pada wanita dengan status gizi kurang, keterbatasan asupan nutrisi menurunkan daya tahan tubuh terhadap sensasi nyeri serta mengganggu keseimbangan hormon estrogen dan progesteron. Sementara itu, pada kondisi berat badan berlebih atau obesitas, penumpukan jaringan lemak memicu reaksi peradangan kronis yang mendorong produksi prostaglandin berlebihan, sehingga rasa kram yang dialami menjadi lebih parah." },
        { type: "p", text: "Selain berat badan, kebiasaan mengonsumsi makanan cepat saji dan makanan tinggi lemak jenuh turut berkontribusi terhadap munculnya dismenore primer. Jenis makanan yang bersifat proinflamasi tersebut mempercepat proses peradangan di dalam tubuh dan memperkuat kontraksi otot rahim saat haid. Sebaliknya, menerapkan pola makan bergizi seimbang yang kaya akan serat, mikronutrien, dan zat antiinflamasi terbukti dapat menekan peradangan dan meredakan intensitas nyeri haid." },
        { type: "p", text: "Menjaga berat badan tetap ideal dan membatasi konsumsi makanan olahan tinggi lemak merupakan langkah preventif yang sangat dianjurkan bagi wanita. Pemenuhan gizi yang tepat tidak hanya membantu meredakan rasa tidak nyaman selama menstruasi, tetapi juga menjaga fungsi sistem reproduksi tetap sehat secara berkelanjutan." },

        { type: "p", text: <i>Sumber Referensi:</i> },
        { type: "p", text: <i>Aulya, Y., Kundaryanti, R., & Rena, A. (2021). Hubungan Usia Menarche dan Konsumsi Makanan Cepat Saji dengan Kejadian Dismenore Primer pada Siswi di Jakarta Tahun 2021. Jurnal Menara Medika, 4(1), 10-21.</i> },
        { type: "p", text: <i>Dewi, N. P. S. R., Citrawathi, D. M., & Savitri, N. P. W. (2019). Status Gizi dan Usia Saat Menarche Berkorelasi terhadap Kejadian Dismenore Siswi SMP. Jurnal Penelitian dan Pengembangan Sains dan Humaniora, 3(2), 99-108.</i> },
      ],
    },
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
  rights: {
    card: "bg-svarati-coral border-svarati-coral",
    badge: "coral",
    avatarText: "text-svarati-coral-dark",
  },
  law: {
    card: "bg-svarati-lavender border-svarati-lavender",
    badge: "lavender",
    avatarText: "text-svarati-lavender",
  },
  reproductive: {
    card: "bg-svarati-coral-dark border-svarati-coral-darker",
    badge: "coral",
    avatarText: "text-svarati-coral-dark",
  },
  mental: {
    card: "bg-svarati-lavender-dark border-svarati-lavender-dark",
    badge: "lavender",
    avatarText: "text-svarati-lavender",
  },
  safety: {
    card: "bg-svarati-teal-light border-svarati-teal",
    badge: "teal",
    avatarText: "text-svarati-teal-light",
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
