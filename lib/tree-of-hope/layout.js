import { PAGE_SIZE } from "@/lib/tree-of-hope/constants";

/* Empat level pratinjau: besar (3), sedang (3), kecil (3), lalu amplop polos (sisanya). */
export const LEVEL = [
  { lebar: "w-44", pad: "p-3.5", teks: "text-xs", foot: "text-[11px]", klamp: "line-clamp-4", penulis: true },
  { lebar: "w-36", pad: "p-3", teks: "text-[11px]", foot: "text-[10px]", klamp: "line-clamp-3", penulis: true },
  { lebar: "w-28", pad: "p-2.5", teks: "text-[10px]", foot: "text-[10px]", klamp: "line-clamp-2", penulis: false },
];
export const PER_LEVEL = 3;
export const JUMLAH_KOTAK = LEVEL.length * PER_LEVEL;

/* Semua nilai dalam persen "peta pohon" (kotak persegi sejajar gambar pohon).
   x = dari kiri (50 = tengah), y = dari atas. */

// Satu posisi amplop per pesan (indeks sama dengan urutan pesan). 0-8 punya kartu, 9+ polos.
const AMPLOP = [
  [34.1, 28.9], [65.4, 28.9], [28.4, 54.8],   // besar
  [29.5, 42.4], [73.4, 49.0], [36.3, 66.0],   // sedang
  [25.0, 63.7], [71.2, 39.0], [72.3, 61.4],   // kecil
  [50.2, 34.8], [51.8, 41.0], [47.1, 44.6],   // polos
];

export const POSISI_AMPLOP = Array.from({ length: PAGE_SIZE }, (_, i) => {
  const [x, y] = AMPLOP[i] ?? [50 + (((i * 13) % 30) - 15), 40 + ((i * 7) % 20)];
  return { x, y, rot: ((i * 37) % 31) - 15 };
});

// x, y = titik tengah dan tepi atas kartu; r = kemiringan; ex, ey = amplop asal kartu.
const KARTU = [
  { x: 5, y: 9.5, r: -2 }, { x: 94, y: 8, r: 2 }, { x: 2, y: 57.6, r: 1 },
  { x: -23, y: 34.8, r: -1.5 }, { x: 92, y: 39.5, r: 1.5 }, { x: 5, y: 84, r: 1 },
  { x: -26, y: 66.7, r: 2 }, { x: 120, y: 32.4, r: -2 }, { x: 86, y: 82.4, r: 1.5 },
];
export const KOTAK = KARTU.map((k, i) => ({
  ...k,
  ex: POSISI_AMPLOP[i].x,
  ey: POSISI_AMPLOP[i].y,
}));