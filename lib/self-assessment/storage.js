// RLA044 (simpan) dan RLA045 (hapus): jawaban asesmen di local storage.
// Semua akses dibungkus try/catch karena local storage bisa kosong atau diblokir
// (mode privat, data situs dihapus, dll). Halaman harus tetap jalan tanpanya.

const KEY = "svarati:cek-kondisi";
const TTL_MS = 24 * 60 * 60 * 1000; // jawaban dibuang otomatis setelah 24 jam

export function simpanAsesmen({ answers, index, selesai }) {
  try {
    if (Object.keys(answers).length === 0 && !selesai) {
      localStorage.removeItem(KEY);
      return;
    }
    localStorage.setItem(
      KEY,
      JSON.stringify({ v: 1, savedAt: Date.now(), answers, index, selesai })
    );
  } catch {
    /* abaikan: penyimpanan hanya kemudahan, bukan syarat */
  }
}

// RLA045
export function hapusAsesmen() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* abaikan */
  }
}

// Membaca dan membersihkan data tersimpan. Hanya kode yang cocok dengan pertanyaan
// dari server yang dipakai, jadi data yang rusak atau diubah manual tidak ikut masuk.
export function bacaAsesmen(questions) {
  try {
    const mentah = localStorage.getItem(KEY);
    if (!mentah) return null;

    const data = JSON.parse(mentah);
    if (data?.v !== 1 || Date.now() - data.savedAt > TTL_MS) {
      hapusAsesmen();
      return null;
    }

    const answers = {};
    for (const q of questions) {
      if (!(q.id in (data.answers || {}))) continue;
      const nilai = data.answers[q.id];
      const kodeValid = new Set(q.options.map((o) => o.id));

      if (nilai === null) {
        answers[q.id] = null; // pertanyaan yang dilewati
      } else if (q.multi && Array.isArray(nilai)) {
        const bersih = nilai.filter((k) => kodeValid.has(k));
        if (bersih.length) answers[q.id] = bersih;
      } else if (!q.multi && typeof nilai === "string" && kodeValid.has(nilai)) {
        answers[q.id] = nilai;
      }
    }

    if (Object.keys(answers).length === 0) {
      hapusAsesmen();
      return null;
    }

    const index = Number.isInteger(data.index)
      ? Math.min(Math.max(data.index, 0), questions.length - 1)
      : 0;

    return { answers, index, selesai: data.selesai === true };
  } catch {
    hapusAsesmen();
    return null;
  }
}