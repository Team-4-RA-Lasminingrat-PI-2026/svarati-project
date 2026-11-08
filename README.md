# Svarati

**Ruang aman untuk bersuara.** Svarati adalah ruang digital anonim bagi perempuan Indonesia untuk memahami hak, menemukan dukungan, dan melangkah menuju pemulihan, terutama bagi korban kekerasan seksual yang membutuhkan bantuan hukum.

- **Demo:** [svarati-project.vercel.app](https://svarati-project.vercel.app/)
- **Tim:** Team 4 RA Lasminingrat, PI 2026

_Terakhir diperbarui: 8 November 2026_

## Daftar isi

- [Prinsip produk](#prinsip-produk)
- [Fitur](#fitur)
- [Teknologi](#teknologi)
- [Memulai](#memulai)
- [Struktur folder](#struktur-folder)
- [Halaman](#halaman)
- [API](#api)
- [Penyimpanan data di browser](#penyimpanan-data-di-browser)
- [Aksesibilitas](#aksesibilitas)
- [Konten dan teks](#konten-dan-teks)
- [Komponen](#komponen)
- [Desain](#desain)
- [Alur kerja tim](#alur-kerja-tim)

## Prinsip produk

Setiap fitur Svarati dibuat dengan tiga prinsip ini. Pegang ketiganya saat menambah atau mengubah fitur.

1. **Anonim.** Tidak ada login dan tidak ada data identitas. Pengguna dikenali hanya lewat token sesi acak (lihat [Sesi anonim](#sesi-anonim)).
2. **Data pribadi tetap di perangkat.** Jurnal, mood, dan pengaturan disimpan di `localStorage` browser, bukan di server. Pengguna bisa menghapusnya kapan saja.
3. **Aman saat darurat.** Tombol **Bantuan Darurat** dan **Keluar Cepat** selalu ada di navbar. Keluar Cepat langsung memindahkan pengguna ke halaman lain yang aman.

## Fitur

| Pilar | Fitur |
|---|---|
| **Preventif** (Pahami Hakmu) | Artikel edukasi hukum, hak perempuan, kesehatan, dan keamanan diri, dengan filter kategori dan pencarian |
| **Kuratif** (Pendampingan) | Cek kondisi (*self-assessment*), Svarati AI, direktori layanan bantuan dengan filter provinsi/kota dan unduh CSV |
| **Rehabilitatif** (Pemulihan) | Jurnal pemulihan harian (*healing journey*), latihan tenang (pernapasan, grounding 5-4-3-2-1, suara terapi), Tree of Hope |
| **Di semua halaman** | Bantuan Darurat, Keluar Cepat, pengaturan aksesibilitas (kontras tinggi dan mode screen reader bersuara) |

## Teknologi

| Bagian | Teknologi |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) dan React 19 |
| Styling | Tailwind CSS v4, token warna di `app/globals.css` |
| Komponen dasar | shadcn/ui berbasis Base UI (`@base-ui/react`), varian dengan class-variance-authority (cva) |
| Database | [Supabase](https://supabase.com/) (`@supabase/supabase-js`) |
| Ikon dan font | lucide-react; Lora (judul) dan Public Sans (isi) lewat `next/font/google` |
| Lainnya | date-fns dan react-day-picker (kalender), framer-motion (animasi), Web Audio API (suara terapi), Web Speech API (screen reader bersuara) |
| Hosting | Vercel |

> **Penting untuk developer dan AI coding assistant:** Next.js 16 punya banyak perubahan dibanding versi sebelumnya. Baca dokumentasi di `node_modules/next/dist/docs/` sebelum menulis kode (lihat `AGENTS.md`).

## Memulai

### Kebutuhan

- Node.js **20.9 atau lebih baru**
- npm
- Akses ke project Supabase tim (minta ke anggota tim yang memegang database)

### Langkah

1. **Clone dan install**

   ```bash
   git clone https://github.com/Team-4-RA-Lasminingrat-PI-2026/svarati-project.git
   cd svarati-project
   npm install
   ```

2. **Buat file `.env.local`** di folder utama (sejajar `package.json`):

   ```env
   # Dipakai di browser (sesi anonim)
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=

   # Dipakai di server (API direktori layanan, provinsi, kota)
   SUPABASE_URL=
   SUPABASE_ANON_KEY=
   ```

   Nilainya ada di dashboard Supabase: **Project Settings → API** (Project URL dan key `anon`/`public`). Biasanya keempatnya bernilai sama. Jangan pakai key `service_role`.

   File `.env*` sudah ada di `.gitignore`, jadi tidak akan ikut ter-commit. **Jangan pernah menaruh key di dalam kode.**

3. **Jalankan**

   ```bash
   npm run dev
   ```

   Buka [http://localhost:3000](http://localhost:3000).

### Perintah lain

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Menjalankan server pengembangan |
| `npm run build` | Membuat versi produksi (sekaligus mengecek error build) |
| `npm run start` | Menjalankan hasil `build` |
| `npm run lint` | Mengecek kode dengan ESLint |

### Masalah yang sering muncul

| Pesan error | Penyebab dan solusi |
|---|---|
| `Module not found: Can't resolve '...'` | Ada paket baru di `package.json` setelah pindah branch atau pull. Jalankan `npm install`. |
| `supabaseUrl is required` | File `.env.local` belum ada atau belum lengkap. Lihat langkah 2. |
| Perubahan `.env.local` tidak terbaca | Hentikan `npm run dev` (Ctrl+C), lalu jalankan lagi. |

## Struktur folder

Struktur ini mengikuti konvensi Next.js App Router. Folder rute berada di `app/`, dan nama folder rute menjadi alamat URL.

```
svarati-project/
├── app/                              rute halaman, API, dan layout
│   ├── layout.js                     layout utama: font, Navbar, Footer, skip link, aksesibilitas
│   ├── page.js                       halaman utama (landing page)
│   ├── globals.css                   palet warna, font, tema kontras tinggi
│   ├── api/                          endpoint backend (lihat bagian API)
│   │   ├── help-directory/route.js
│   │   ├── help-directory/export/route.js
│   │   ├── provinces/route.js
│   │   └── cities/route.js
│   ├── preventif/
│   │   ├── page.js                   daftar artikel edukasi
│   │   └── [slug]/page.jsx           detail artikel
│   ├── kuratif/
│   │   ├── page.js                   menu pendampingan
│   │   ├── self-assessment/page.js   cek kondisi
│   │   ├── svarati-ai/page.js        tanya Svarati AI
│   │   └── help-directory/
│   │       ├── page.js               direktori layanan bantuan
│   │       └── _components/          filter, kartu layanan, pagination, peringatan darurat
│   ├── rehabilitatif/
│   │   ├── page.js                   menu pemulihan
│   │   ├── healing-journey/page.js   jurnal pemulihan (mood dan catatan harian)
│   │   ├── training/
│   │   │   ├── page.js               pilihan latihan tenang
│   │   │   ├── breathing/page.js     latihan pernapasan
│   │   │   ├── grounding/page.js     grounding 5-4-3-2-1
│   │   │   └── sound/page.js         suara terapi dengan timer
│   │   └── tree-of-hope/page.js      cerita dan pesan dukungan
│   └── profile/
│       ├── page.js                   tentang kami
│       └── components/               CountUp.jsx, Kasusbarchart.jsx
├── components/                       komponen UI yang dipakai ulang
│   ├── Navbar.jsx, Footer.jsx
│   ├── Card.jsx, Badge.jsx, Tabs.jsx
│   ├── ProgressBar.jsx, Toast.jsx, ToggleSwitch.jsx
│   ├── QuickOutButton.jsx            tombol Keluar Cepat
│   ├── ScreenReaderEnhancer.jsx      mode screen reader bersuara
│   ├── SessionInit.jsx               membuat sesi anonim saat website dibuka
│   ├── home/                         bagian-bagian landing page
│   ├── education/                    komponen halaman edukasi
│   ├── kuratif/                      komponen halaman pendampingan
│   ├── modals/                       Modal, EmergencyModal, AccessibilityModal, ConfirmDialog
│   └── ui/                           button, input, label, select, calendar (shadcn/ui)
├── content/
│   └── labels.js                     seluruh teks dan data konten website
├── context/
│   └── AccessibilityContext.jsx      state pengaturan aksesibilitas
├── lib/
│   ├── supabase/client.js            klien Supabase untuk browser
│   ├── session/                      token, penyimpanan, dan API sesi anonim
│   ├── help-directory.js             query Supabase untuk direktori, provinsi, kota
│   ├── useLocalStorageState.js       hook useState yang tersimpan di localStorage
│   ├── speech.js                     pembaca suara (Web Speech API)
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
| `services` | `lib/` | Supabase, sesi anonim, query direktori, dan fungsi bantu |
| `state` | `context/` | State global (pengaturan aksesibilitas) |
| `api` | `app/api/` | Endpoint backend (Route Handlers Next.js) |

## Halaman

Menu utama di navbar diambil dari `MENU_UTAMA` di `content/labels.js`:

| Menu | Rute | Isi |
|---|---|---|
| Beranda | `/` | Landing page: hero, mitos dan fakta, ringkasan layanan, banner Svarati AI, banner pemulihan, catatan privasi |
| Pahami Hakmu (preventif) | `/preventif` | Kumpulan artikel edukasi dengan filter kategori dan pencarian |
| | `/preventif/[slug]` | Halaman baca satu artikel |
| Pendampingan (kuratif) | `/kuratif` | Menu langkah cepat untuk korban |
| | `/kuratif/self-assessment` | Cek kondisi: enam pertanyaan, satu per layar |
| | `/kuratif/svarati-ai` | Ruang bercerita dengan Svarati AI |
| | `/kuratif/help-directory` | Direktori layanan pendampingan dan hukum, filter provinsi/kota/jenis, unduh CSV |
| Pemulihan (rehabilitatif) | `/rehabilitatif` | Menu fitur pemulihan |
| | `/rehabilitatif/healing-journey` | Jurnal harian: pilih mood, tulis catatan (draf tersimpan otomatis), hapus per tanggal atau semua |
| | `/rehabilitatif/training` | Pilihan latihan tenang |
| | `/rehabilitatif/training/breathing` | Latihan pernapasan |
| | `/rehabilitatif/training/grounding` | Teknik grounding 5-4-3-2-1 |
| | `/rehabilitatif/training/sound` | 10 suara terapi (dibuat langsung di browser, tanpa file audio), volume, dan timer yang bisa dijeda |
| | `/rehabilitatif/tree-of-hope` | Cerita dan pesan dukungan dari komunitas |
| Tentang Kami | `/profile` | Penjelasan Svarati, tujuan, urgensi (angka dan grafik kasus), dan profil tim |

## API

Semua endpoint ada di `app/api/` dan mengambil data dari Supabase lewat `lib/help-directory.js`. Kalau gagal, endpoint mengembalikan status `500` dengan `{ "error": "..." }`.

| Endpoint | Parameter | Hasil |
|---|---|---|
| `GET /api/help-directory` | `cari`, `provinsi`, `kota` (id), `tipe`, `page`, `limit` (maks. 50) | `{ data, total, page, limit, hasMore }` |
| `GET /api/help-directory/export` | `cari`, `provinsi`, `kota`, `tipe` | File CSV (maks. 1000 baris) |
| `GET /api/provinces` | – | `{ data: [{ id, nama }] }` |
| `GET /api/cities` | `provinsi` (nama) atau `provinsi_id` | `{ data: [{ id, nama }] }` |

`tipe` yang valid: `Pemerintah`, `Bantuan Hukum`, `Medis`, `Psikologis`, `Lembaga Masyarakat`. Hanya layanan dengan `is_verified = true` yang ditampilkan.

Catatan keamanan yang sudah diterapkan:

- Hasil pencarian direktori tidak disimpan di cache (`Cache-Control: no-store`), dan parameter pencarian pengguna tidak dicatat di log.
- Input pencarian dibersihkan dari karakter khusus filter PostgREST.
- Export CSV dilindungi dari *CSV injection*.

## Penyimpanan data di browser

Data pribadi pengguna tidak dikirim ke server. Semua key `localStorage` yang dipakai:

| Key | Isi | Dipakai di |
|---|---|---|
| `svarati-mood-history` | Mood per tanggal | Healing journey |
| `svarati-mood-notes` | Catatan per tanggal | Healing journey |
| `svarati-mood-drafts` | Catatan yang sedang ditulis tapi belum disimpan | Healing journey |
| `svarati-accessibility` | Pengaturan kontras tinggi dan mode screen reader | Seluruh website |
| `svarati_session_token` | Token sesi anonim dan waktu kedaluwarsanya | Seluruh website |

Untuk fitur baru yang perlu menyimpan data di browser, pakai hook `useLocalStorageState` dari `@/lib/useLocalStorageState`:

```jsx
const [catatan, setCatatan, hapusCatatan] = useLocalStorageState("svarati-nama-fitur", NILAI_AWAL);
```

Hook ini bekerja seperti `useState`, tapi nilainya langsung tersimpan ke `localStorage`, aman dari *hydration error*, dan tetap berjalan meski `localStorage` diblokir. `NILAI_AWAL` harus didefinisikan di luar komponen. Beri nama key dengan awalan `svarati-` dan tambahkan ke tabel di atas.

### Sesi anonim

Saat website dibuka, `SessionInit` membuat token acak 256-bit yang disimpan di browser selama 30 hari. Yang dikirim ke tabel Supabase `anonymous_sessions` hanya **hash SHA-256** dari token itu, bukan tokennya. Setiap kunjungan berikutnya memperbarui `last_active_at` lewat fungsi database `touch_session`. Kodenya ada di `lib/session/`.

## Aksesibilitas

Pengaturan aksesibilitas dibuka dari tombol **Aksesibilitas** dan disimpan di `context/AccessibilityContext.jsx`.

- **Tema kontras tinggi:** mengganti token warna lewat atribut `data-contrast="high"` di `<html>`. Script kecil di `layout.js` menerapkannya sebelum halaman tampil, supaya layar tidak berkedip saat refresh.
- **Mode screen reader:** `ScreenReaderEnhancer` membacakan teks dengan suara (bahasa Indonesia) saat elemen disorot kursor, diklik, atau dipilih dengan Tab. Mode ini juga melengkapi label yang hilang pada tombol, gambar, dan input.

Panduan saat membuat komponen:

- Pakai elemen HTML yang sesuai (`<button>` untuk aksi, `<a>`/`<Link>` untuk pindah halaman).
- Tombol yang hanya berisi ikon wajib diberi `aria-label`.
- Tombol on/off dan pilihan aktif diberi `aria-pressed` atau `aria-checked`.
- Pesan yang muncul setelah aksi (misalnya "data sudah dihapus") ditaruh di elemen `role="status"` supaya ikut dibacakan.
- Untuk dialog, pakai komponen dari `@base-ui/react` (`Dialog` atau `AlertDialog`) karena sudah menangani fokus keyboard.
- `layout.js` sudah memiliki `<main id="konten-utama">`, jadi halaman sebaiknya memakai `<div>` atau `<section>` sebagai pembungkus, bukan `<main>` lagi.

## Konten dan teks

Semua teks, menu, dan data konten ada di `content/labels.js`, bukan di dalam komponen. Untuk mengubah teks, ubah di file ini.

| Export | Isi |
|---|---|
| `BRAND`, `MENU_UTAMA`, `NAVBAR`, `FOOTER` | Identitas, menu, dan teks footer |
| `DARURAT` | Nomor darurat, teks modal, dan Silent SOS |
| `heroContent`, `serviceContent`, `mitosContent`, `svaratiAiContent`, `pemulihanContent`, `privasiContent` | Konten landing page |
| `educationContent`, `categoryTheme`, `categoryLabel` | Artikel edukasi, warna, dan label per kategori |
| `KURATIF` | Teks cek kondisi, pertanyaan, dan Svarati AI |
| `DIREKTORI` | Teks direktori layanan, filter, dan format CSV |
| `AKSESIBILITAS` | Teks modal pengaturan aksesibilitas |

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

- `variant`: `primary` (default, coral), `secondary` (teal gelap), `outline` (garis putih, untuk latar gelap seperti footer), `exit` (merah, untuk Keluar Cepat, aksi darurat, dan konfirmasi hapus), `ghost` (garis lavender, transparan), `tertiary` (mirip tautan bergaris bawah), `soft` (lavender gelap, untuk CTA rekomendasi).
- `size`: `sm`, `md` (default), `lg`, `xl`.
- `fullWidth`: `true` untuk lebar penuh.
- `icon` dan `iconPosition` (`left` atau `right`): menambahkan ikon di samping teks.

`buttonVariants` dipakai agar tautan tampil seperti tombol:

```jsx
<Link href="/rehabilitatif" className={buttonVariants({ variant: "ghost", size: "sm" })}>
  Kembali
</Link>
```

### ConfirmDialog

`@/components/modals/ConfirmDialog` (default export). Dialog konfirmasi untuk aksi yang tidak bisa dibatalkan, misalnya menghapus data. Dibangun dengan `AlertDialog` dari Base UI, sehingga fokus keyboard terkunci di dialog, bisa ditutup dengan Esc, dan dibacakan screen reader. **Pakai komponen ini sebagai pengganti `window.confirm`.**

```jsx
<ConfirmDialog
  open={bukaDialog}
  onOpenChange={setBukaDialog}
  title="Hapus semua data jurnal?"
  description="Data akan dihapus dari perangkat ini dan tidak bisa dikembalikan."
  confirmLabel="Ya, hapus semua"
  onConfirm={hapusSemua}
/>
```

- `open`, `onOpenChange`: mengatur tampil atau tidaknya dialog.
- `title`, `description`: judul dan penjelasan.
- `confirmLabel` (default `Hapus`), `cancelLabel` (default `Batal`).
- `onConfirm`: dipanggil saat tombol konfirmasi diklik. Dialog menutup otomatis.

### Modal

`@/components/modals/Modal` (default export). Jendela dialog sederhana, ditutup dengan klik di area gelap.

- `open`: `true` atau `false`, menentukan modal tampil atau tidak.
- `onClose`: fungsi yang dipanggil saat modal diminta menutup.
- `size`: `sm`, `md` (default), `lg`.
- `children`: isi modal.

`EmergencyModal` (modal Bantuan Darurat) dibangun di atas Modal, dengan teks dari `DARURAT.modal` di `content/labels.js`. `AccessibilityModal` (pengaturan aksesibilitas) memakai `Dialog` dari Base UI.

### Komponen lain

- **ToggleSwitch**: saklar on/off.
- **ProgressBar**: bilah progres.
- **Toast**: notifikasi singkat.
- **QuickOutButton**: tombol Keluar Cepat yang memindahkan pengguna ke halaman aman.
- **Navbar dan Footer**: dipasang sekali di `layout.js`, sehingga tampil di semua halaman.
- **Input, Label, Select, Calendar**: komponen formulir dasar dari shadcn/ui di `@/components/ui/`.

## Desain

Semua warna dan font didefinisikan di `app/globals.css` dan dipakai lewat class Tailwind, misalnya `bg-svarati-teal` atau `text-svarati-lavender-dark`.

| Kelompok | Token | Hex |
|---|---|---|
| Teal (utama) | `svarati-teal` | `#0F4C5C` |
| | `-light` / `-dark` / `-soft` | `#1D6577` / `#0B3B47` / `#E8F3F1` |
| Coral (aksen) | `svarati-coral` | `#E07A5F` |
| | `-medium` / `-dark` / `-darker` / `-soft` | `#C0502F` / `#B14A25` / `#9A3A1A` / `#FFF5F2` |
| Lavender (sekunder) | `svarati-lavender` | `#9D8FD6` |
| | `-light` / `-hover` | `#D8D1F3` / `#C6BCEB` |
| | `-dark` / `-darker` | `#5A4A9E` / `#463A7C` |
| | `-border` (garis field form) | `#7E70BE` |
| Cream (latar belakang) | `svarati-cream` | `#FAF8F5` |
| Danger (darurat, keluar cepat, hapus) | `svarati-danger` | `#C0392B` |
| | `-dark` / `-darker` / `-soft` | `#A02A1F` / `#7F2218` / `#FBEAE8` |

Tema kontras tinggi menimpa token yang sama dengan warna hitam, putih, dan warna gelap. Karena itu, **selalu pakai nama token, jangan kode hex langsung**, supaya tema kontras tinggi ikut berlaku di komponen baru.

Font judul (`h1` sampai `h4`) memakai Lora lewat `font-heading`, sedangkan teks lain memakai Public Sans lewat `font-sans`.

Hindari teks `svarati-coral` pada latar cream untuk teks panjang karena kontrasnya rendah. Gunakan `svarati-coral-dark`.

`globals.css` juga mengatur variabel semantik shadcn (`--background`, `--primary`, dan lain-lain), fokus keyboard yang terlihat (`:focus-visible`), dan menonaktifkan animasi bagi pengguna yang memilih *reduced motion*.

## Alur kerja tim

### Branch

Buat branch baru dari `main` terbaru untuk setiap ticket:

```bash
git checkout main
git pull
git checkout -b feature/RLA0xx-nama-singkat
```

| Jenis | Format | Contoh |
|---|---|---|
| Fitur | `feature/RLA0xx-nama-singkat` | `feature/RLA054-hapus-jurnal-localstorage` |
| Perbaikan dari QA | `QA-RLA0xx` | `QA-RLA017+RLA023` |

### Commit

Awali judul commit dengan nomor ticket, lalu jelaskan perubahannya:

```
RLA054: hapus data jurnal di localStorage
```

### Sebelum membuat Pull Request

- [ ] `npm run lint` tidak menunjukkan error baru
- [ ] `npm run build` berhasil
- [ ] Fitur sudah dicoba di browser, termasuk tampilan HP
- [ ] Bisa dipakai dengan keyboard saja (Tab, Enter, Esc)
- [ ] Teks baru ditaruh di `content/labels.js`
- [ ] Warna memakai token `svarati-*`, bukan kode hex
- [ ] Tidak ada key, password, atau data pribadi di dalam kode

Pull Request ditujukan ke `main`. Tuliskan ringkasan perubahan dan langkah tes untuk QA di deskripsi PR.
