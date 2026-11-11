// Membuang awalan "Kota"/"Kabupaten" untuk tampilan. Nilai di database tidak diubah.
export const shortPlace = (s) => (s ? s.replace(/^(Kabupaten|Kota)\s+/i, "") : s);