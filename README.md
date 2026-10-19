//Update 13 Oct 2026
# Svarati

Svarati adalah ruang digital anonim bagi perempuan Indonesia untuk memahami hak, menemukan dukungan, dan melangkah menuju pemulihan, terutama bagi korban kekerasan seksual yang membutuhkan bantuan hukum.

Berikut adalah struktur website dan komponen UI yang sedang dikembangkan oleh tim:

## Teknologi

Next.js (App Router) dan React: kerangka utama website.
Tailwind CSS v4: styling, dengan token warna di globals.css.
shadcn/ui berbasis Base UI (@base-ui/react): komponen dasar seperti Button, Input, dan Label.
class-variance-authority (cva): mengatur varian komponen.
lucide-react: ikon.
Lora dan Public Sans: font judul dan font isi, dimuat lewat next/font/google.

## Menjalankan website di lokal

npm install
npm run dev

Buka `http://localhost:3000`.

## Struktur folder (sementara, masih akan berkembang)
 svarati/
├── public/                  aset statis
├── app/
│   ├── layout.js            layout utama: font, Navbar, Footer, skip link
│   ├── page.js              halaman utama (landing page)
│   ├── globals.css          palet warna, font, dan pengaturan dasar
│   ├── kuratif/
│   │   ├── page.js          halaman bantuan cepat untuk korban
│   │   ├── cek-kondisi/
│   │   │   └── page.js
│   │   ├── svarati-ai/
│   │   │   └── page.js
│   │   └── direktori-bantuan/
│   │       └── page.js
│   ├── preventif/
│   │   └── page.js          halaman edukasi hukum dan seksual
│   └── rehabilitatif/
│       ├── page.js          halaman bantuan pemulihan
│       ├── jurnal-emosi/
│       │   └── page.js
│       └── tree-of-hope/
│           └── page.js
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── Card.jsx
│   ├── Badge.jsx
│   ├── Tabs.jsx
│   ├── Modal.jsx
│   └── ui/
│       ├── button.jsx
│       ├── input.jsx
│       └── label.jsx
├── lib/
│   └── utils.js             fungsi cn() untuk menggabungkan class
└── package.json

## Halaman
/ app/page.js: halaman utama (landing page), berisi navbar, body (penjelasan website, ringkasan fitur website), footer, tombol keluar cepat, dan aksesibilitas.
/ app/kuratif/page.js: halaman berisi fitur langkah cepat untuk korban yang sedang membutuhkan bantuan, terdiri atas fitur: cek kondisi, Svarati AI dan direktori bantuan.
/ app/preventif/page.js: halaman yang berisi fitur edukasi (pemahaman dasar hukum dan seksualitas) untuk korban maupun perempuan secara umum, terdiri atas fitur: kumpulan/ringkasan edukasi hukum dan seksual (untuk pengembangan: kuis dan simulator)
/ app/rehabilitatif/page.js: halaman yang berisi fitur bantuan pemulihan untuk korban, terdiri atas fitur: journal emosi harian, dan tree of hope.

## Layout
`layout.js` membungkus semua halaman dengan:
- Font Lora (`--font-lora`) dan Public Sans (`--font-public-sans`)
- Tautan "Lewati ke konten utama" untuk pengguna keyboard dan pembaca layar
- `Navbar` di atas, `Footer` di bawah, dan `<main id="konten-utama">` di tengah

## Komponen
### Card
@/components/Card (named export): Wadah serbaguna untuk menampilkan informasi, dilengkapi sub-komponen CardIcon, CardNumber, CardTitle, CardDescription, CardFooter, dan CardLink. Lebar, tinggi, dan jumlah kolom diatur di halaman, bukan di Card.

variant: white (default), cream, lavender, teal, coral, danger, solid, outline.
size: sm, md (default), lg. Mengatur radius dan padding.
topBorder: none (default), lavender, coral, teal, green. Garis aksen di sisi atas.
interactive: true atau false (default). Card naik sedikit saat disorot kursor.

### Badge
`@/components/Badge` (default export). Label kecil berbentuk pil.

variant: teal (default), coral, lavender.
styleType: soft (default) atau white. Versi white cocok di atas latar berwarna.

### Tabs (tab pills)
@/components/Tabs (default export). Tombol berbentuk pil untuk berpindah antar bagian konten. Komponen ini terkontrol, jadi state tab aktif disimpan di halaman.

tabs: array { id, label }.
activeTab: id tab yang sedang aktif.
onChange: dipanggil dengan id tab yang diklik.
variant: teal (default), coral, lavender

### Button
@/components/ui/button (named export Button). Tombol utama untuk semua aksi.

variant: default (default), outline, secondary, ghost, destructive, link.
size: default (default), xs, sm, lg, icon, icon-xs, icon-sm, icon-lg. Ukuran icon-* untuk tombol yang hanya berisi ikon

### Modal
@/components/Modal (default export). Jendela dialog yang muncul di atas halaman, ditutup dengan klik di area gelap.

open: true atau false, menentukan modal tampil atau tidak.
onClose: fungsi yang dipanggil saat modal diminta menutup.
size: sm, md (default), lg.
children: isi modal

### Navbar dan Footer
Dipasang sekali di `layout.js`, sehingga tampil di semua halaman.

### Input dan Label
Komponen formulir dasar dari shadcn/ui di `@/components/ui/input` dan `@/components/ui/label`.

## Desain
Semua warna dan font didefinisikan di app/globals.css dan dipakai lewat class Tailwind, misalnya bg-svarati-teal atau text-svarati-lavender-dark.

Teal (utama): svarati-teal 
#0F4C5C, -light 
#1D6577, -dark 
#0B3B47, -soft 
#E8F3F1.
Coral (aksen): svarati-coral 
#E07A5F, -dark 
#B14A25, -darker 
#9A3A1A, -soft 
#FFF5F2.
Lavender (sekunder): svarati-lavender 
#9D8FD6, -light 
#D8D1F3, -hover 
#C6BCEB, -dark 
#5A4A9E, -darker 
#463A7C.
Cream (latar belakang): svarati-cream 
#FAF8F5.
Danger (tombol darurat dan keluar cepat): svarati-danger 
#C0392B, -dark 
#A02A1F, -darker 
#7F2218, -soft 
#FBEAE8.

Font judul (h1 sampai h4) memakai Lora lewat font-heading, sedangkan teks lain memakai Public Sans lewat font-sans.

Panduan penulisan: pakai nama token seperti di atas, bukan kode hex langsung, agar warna tetap konsisten bila palet berubah.

globals.css juga mengatur fokus keyboard yang terlihat (:focus-visible) dan menonaktifkan animasi bagi pengguna yang memilih reduced motion.