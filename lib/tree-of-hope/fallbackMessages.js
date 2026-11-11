import { PAGE_SIZE, FALLBACK_ID_PREFIX } from "@/lib/tree-of-hope/constants";

// Pesan awalan: tampil saat database kosong atau tidak terjangkau.
// Minimal 9 pesan agar seluruh amplop di pohon terisi; 12 membuat ada halaman kedua.
const make = (id, text, author = "Anonim", supportCount = 0) => ({
  id: `${FALLBACK_ID_PREFIX}${id}`,
  text,
  author,
  supportCount,
  liked: false,
});

export const FALLBACK_MESSAGES = [
  make(1, "Keberanianmu untuk bertahan hidup hari ini sudah merupakan kemenangan besar. Kamu tidak salah, dan kamu berhak pulih.", "Anonim • Jakarta", 24),
  make(2, "Dahulu aku berpikir dunia runtuh. Tapi setelah melangkah mencari bantuan psikologis, aku menyadari ada masa depan yang menunggu.", "Penyintas • Bandung", 18),
  make(3, "Pelan-pelan saja ya. Jangan ragu menggunakan fitur tombol darurat jika kamu merasa dalam bahaya.", "Pendamping • Surabaya", 31),
  make(4, "Kamu tidak sendirian, dan ini bukan salahmu."),
  make(5, "Bertahan sampai hari ini adalah bentuk keberanian."),
  make(6, "Pelan-pelan tidak apa-apa. Pulih tidak punya batas waktu."),
  make(7, "Kamu berhak merasa aman, hari ini dan seterusnya."),
  make(8, "Tidak apa-apa kalau hari ini terasa berat. Istirahat juga bagian dari pulih."),
  make(9, "Suaramu penting, dan ceritamu layak didengar."),
  make(10, "Satu langkah kecil hari ini tetap sebuah kemajuan."),
  make(11, "Apa pun yang terjadi, itu bukan salahmu."),
  make(12, "Kamu sudah sejauh ini. Itu sudah sangat berarti."),
];

export function getFallbackPage(page = 1) {
  const total = FALLBACK_MESSAGES.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const current = Math.min(Math.max(1, page), totalPages);
  const from = (current - 1) * PAGE_SIZE;
  return {
    messages: FALLBACK_MESSAGES.slice(from, from + PAGE_SIZE),
    total,
    totalPages,
    source: "fallback",
  };
}
