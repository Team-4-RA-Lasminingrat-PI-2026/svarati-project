# Svarati

Svarati adalah ruang digital anonim bagi perempuan Indonesia untuk memahami hak, menemukan dukungan, dan melangkah menuju pemulihan, terutama bagi korban kekerasan seksual yang membutuhkan bantuan hukum.

Demo: [svarati-project.vercel.app](https://svarati-project.vercel.app/)

_Terakhir diperbarui: 6 November 2026_

## Teknologi

- **Next.js (App Router) dan React**: kerangka utama website.
- **Tailwind CSS v4**: styling, dengan token warna di `app/globals.css`.
- **shadcn/ui berbasis Base UI (`@base-ui/react`)**: komponen dasar seperti Button, Input, dan Label.
- **class-variance-authority (cva)**: mengatur varian komponen.
- **lucide-react**: ikon.
- **Lora dan Public Sans**: font judul dan font isi, dimuat lewat `next/font/google`.
- **Vercel**: hosting dan deploy.

## Menjalankan website di lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Struktur folder

Struktur ini mengikuti konvensi Next.js App Router. Folder rute berada di `app/`, dan nama folder rute menjadi alamat URL.

```
svarati-project/
├── app/                              rute halaman (pages) dan layout
│   ├── layout.js                     layout utama: font, Navbar, Footer, skip link
│   ├── page.js                       halaman utama (landing page)
│   ├── globals.css                   palet warna, font, dan pengaturan dasar
│   ├── favicon.ico
│   ├── preventif/
│   │   ├── page.js                   daftar artikel edukasi
│   │   └── [slug]/page.jsx           detail artikel
│   ├── kuratif/
│   │   ├── page.js                   menu pendampingan untuk korban
│   │   ├── self-assessment/page.js   cek kondisi
│   │   ├── svarati-ai/page.js        tanya Svarati AI
│   │   └── help-directory/page.js    direktori layanan bantuan
│   ├── rehabilitatif/
│   │   ├── page.js                   menu pemulihan
│   │   ├── healing-journey/page.js   jurnal pemulihan
│   │   ├── training/
│   │   │   ├── page.js               pilihan latihan tenang
│   │   │   ├── breathing/page.js     latihan pernapasan
│   │   │   ├── grounding/page.js     grounding 5-4-3-2-1
│   │   │   └── sound/page.js         suara terapi
│   │   └── tree-of-hope/page.js      cerita dan pesan dukungan
│   └── profile/
│       ├── page.js                   tentang kami
│       └── components/               CountUp.jsx, Kasusbarchart.jsx
├── components/                       komponen UI yang dipakai ulang
│   ├── Navbar.jsx, Footer.jsx
│   ├── Card.jsx, Badge.jsx, Tabs.jsx
│   ├── ProgressBar.jsx, Toast.jsx, ToggleSwitch.jsx
│   ├── QuickOutButton.jsx            tombol Keluar Cepat
│   ├── home/                         bagian-bagian landing page
│   ├── education/                    komponen halaman edukasi
│   ├── kuratif/                      komponen halaman pendampingan
│   ├── modals/                       Modal.jsx, EmergencyModal.jsx
│   └── ui/                           button, input, label, calendar (shadcn/ui)
├── content/
│   └── labels.js                     seluruh teks dan data konten website
├── lib/
│   └── utils.js                      fungsi cn() untuk menggabungkan class
├── public/                           aset statis (gambar, ilustrasi)
├── components.json                   konfigurasi shadcn/ui
├── jsconfig.json                     alias import `@/` ke root proyek
├── next.config.mjs, postcss.config.mjs, eslint.config.mjs
├── AGENTS.md, CLAUDE.md              panduan untuk AI coding assistant
└── package.json
```

### Pemetaan ke konsep folder umum

| Konsep umum | Di proyek ini | Keterangan |
|---|---|---|
| `pages` | `app/` | Setiap folder berisi `page.js` menjadi satu rute |
| `layouts` | `app/layout.js` | Membungkus semua halaman |
| `components` | `components/` | Dikelompokkan per fitur (`home`, `education`, `kuratif`, `modals`, `ui`) |
| `data` | `content/labels.js` | Teks dan data konten dipusatkan di satu file |
| `services` | `lib/` | Saat ini hanya berisi `utils.js`. Folder khusus untuk layanan (misalnya integrasi Svarati AI) dibuat saat dibutuhkan |

## Halaman

Menu utama di navbar diambil dari `MENU_UTAMA` di `content/labels.js`:

| Menu | Rute | Isi |
|---|---|---|
| Beranda | `/` | Landing page: hero, mitos dan fakta, ringkasan layanan, banner Svarati AI, banner pemulihan, catatan privasi |
| Pahami Hakmu (preventif) | `/preventif` | Kumpulan artikel edukasi hukum, hak perempuan, kesehatan, dan keamanan diri, lengkap dengan filter kategori dan pencarian |
| | `/preventif/[slug]` | Halaman baca satu artikel |
| Pendampingan (kuratif) | `/kuratif` | Menu langkah cepat untuk korban |
| | `/kuratif/self-assessment` | Cek kondisi: enam pertanyaan, satu per layar |
| | `/kuratif/svarati-ai` | Ruang bercerita dengan Svarati AI |
| | `/kuratif/help-directory` | Direktori layanan pendampingan dan hukum |
| Pemulihan (rehabilitatif) | `/rehabilitatif` | Menu fitur pemulihan |
| | `/rehabilitatif/healing-journey` | Jurnal pemulihan harian |
| | `/rehabilitatif/training` | Latihan tenang: pernapasan, suara terapi, dan grounding |
| | `/rehabilitatif/tree-of-hope` | Cerita dan pesan dukungan dari komunitas |
| Tentang Kami | `/profile` | Penjelasan Svarati, tujuan, urgensi (angka dan grafik kasus), dan profil tim pengembang |

Tombol **Bantuan Darurat** dan **Keluar Cepat** tersedia di navbar pada semua halaman.

## Layout

`layout.js` membungkus semua halaman dengan:

- Font Lora (`--font-lora`) dan Public Sans (`--font-public-sans`).
- Tautan "Lewati ke konten utama" untuk pengguna keyboard dan pembaca layar.
- `Navbar` di atas, `Footer` di bawah, dan `<main id="konten-utama">` di tengah.

Karena `layout.js` sudah memiliki `<main>`, halaman di dalamnya sebaiknya memakai `<div>` atau `<section>`, bukan `<main>` lagi.

## Konten dan teks

Semua teks, menu, dan data konten ada di `content/labels.js`, bukan di dalam komponen. Untuk mengubah teks, ubah di file ini. Isinya antara lain:

- `BRAND`, `MENU_UTAMA`, `NAVBAR`, `FOOTER`: identitas, menu, dan teks footer.
- `DARURAT`: nomor darurat, teks modal, dan Silent SOS.
- `heroContent`, `serviceContent`, `mitosContent`, `svaratiAiContent`, `pemulihanContent`, `privasiContent`: konten landing page.
- `educationContent` dan `categoryTheme`: artikel edukasi dan warna per kategori.
- `KURATIF`: teks cek kondisi, pertanyaan, dan Svarati AI.

## Komponen

### Card

`@/components/Card` (named export). Wadah serbaguna untuk menampilkan informasi, dilengkapi sub-komponen `CardIcon`, `CardNumber`, `CardTitle`, `CardDescription`, `CardFooter`, dan `CardLink`. Lebar, tinggi, dan jumlah kolom diatur di halaman, bukan di Card. `cardVariants` juga diekspor agar gaya card bisa dipakai pada elemen lain, misalnya `<button>`.

- `variant`: `white` (default), `cream`, `lavender`, `teal`, `coral`, `danger`, `solid`, `outline`.
- `size`: `sm`, `md` (default), `lg`. Mengatur radius dan padding.
- `topBorder`: `none` (default), `lavender`, `coral`, `teal`, `green`. Garis aksen di sisi atas.
- `interactive`: `true` atau `false` (default). Card naik sedikit saat disorot kursor.

### Badge

`@/components/Badge` (default export). Label kecil berbentuk pil.

- `variant`: `teal` (default), `coral`, `lavender`.
- `styleType`: `soft` (default) atau `white`. Versi white cocok di atas latar berwarna.

### Tabs (tab pills)

`@/components/Tabs` (default export). Tombol berbentuk pil untuk berpindah antar bagian konten. Komponen ini terkontrol, jadi state tab aktif disimpan di halaman.

- `tabs`: array `{ id, label }`.
- `activeTab`: id tab yang sedang aktif.
- `onChange`: dipanggil dengan id tab yang diklik.
- `variant`: `teal` (default), `coral`, `lavender`.

### Button

`@/components/ui/button` (named export `Button` dan `buttonVariants`). Tombol utama untuk semua aksi.

- `variant`: `primary` (default, coral), `secondary` (teal gelap), `outline` (garis putih, untuk latar gelap seperti footer), `exit` (merah, untuk Keluar Cepat dan aksi darurat), `ghost` (garis lavender, transparan), `tertiary` (mirip tautan bergaris bawah), `soft` (lavender gelap, untuk CTA rekomendasi).
- `size`: `sm`, `md` (default), `lg`, `xl`.
- `fullWidth`: `true` untuk lebar penuh.
- `icon` dan `iconPosition` (`left` atau `right`): menambahkan ikon di samping teks.

`buttonVariants` dipakai agar tautan tampil seperti tombol, misalnya `<Link className={buttonVariants({ variant: "ghost", size: "sm" })}>`.

### Modal

`@/components/modals/Modal` (default export). Jendela dialog yang muncul di atas halaman, ditutup dengan klik di area gelap.

- `open`: `true` atau `false`, menentukan modal tampil atau tidak.
- `onClose`: fungsi yang dipanggil saat modal diminta menutup.
- `size`: `sm`, `md` (default), `lg`.
- `children`: isi modal.

`@/components/modals/EmergencyModal` adalah modal Bantuan Darurat yang dibangun di atas Modal. Teksnya diambil dari `DARURAT.modal` di `content/labels.js`.

### Komponen lain

- **ToggleSwitch**: saklar on/off.
- **ProgressBar**: bilah progres.
- **Toast**: notifikasi singkat.
- **QuickOutButton**: tombol Keluar Cepat yang memindahkan pengguna ke halaman aman.
- **Navbar dan Footer**: dipasang sekali di `layout.js`, sehingga tampil di semua halaman.
- **Input dan Label**: komponen formulir dasar dari shadcn/ui di `@/components/ui/input` dan `@/components/ui/label`.

## Desain

Semua warna dan font didefinisikan di `app/globals.css` dan dipakai lewat class Tailwind, misalnya `bg-svarati-teal` atau `text-svarati-lavender-dark`.

| Kelompok | Token | Hex |
|---|---|---|
| Teal (utama) | `svarati-teal` | `#0F4C5C` |
| | `-light` / `-dark` / `-soft` | `#1D6577` / `#0B3B47` / `#E8F3F1` |
| Coral (aksen) | `svarati-coral` | `#E07A5F` |
| | `-dark` / `-darker` / `-soft` | `#B14A25` / `#9A3A1A` / `#FFF5F2` |
| Lavender (sekunder) | `svarati-lavender` | `#9D8FD6` |
| | `-light` / `-hover` | `#D8D1F3` / `#C6BCEB` |
| | `-dark` / `-darker` | `#5A4A9E` / `#463A7C` |
| | `-border` (garis field form) | `#7E70BE` |
| Cream (latar belakang) | `svarati-cream` | `#FAF8F5` |
| Danger (darurat dan keluar cepat) | `svarati-danger` | `#C0392B` |
| | `-dark` / `-darker` / `-soft` | `#A02A1F` / `#7F2218` / `#FBEAE8` |

Font judul (`h1` sampai `h4`) memakai Lora lewat `font-heading`, sedangkan teks lain memakai Public Sans lewat `font-sans`.

Panduan penulisan: pakai nama token seperti di atas, bukan kode hex langsung, agar warna tetap konsisten bila palet berubah. Hindari teks `svarati-coral` pada latar cream untuk teks panjang karena kontrasnya rendah. Gunakan `svarati-coral-dark`.

`globals.css` juga mengatur variabel semantik shadcn (`--background`, `--primary`, dan lain-lain), fokus keyboard yang terlihat (`:focus-visible`), dan menonaktifkan animasi bagi pengguna yang memilih reduced motion.