// Persetujuan penyimpanan percakapan. Belum ada pilihan secara default (value = null).
// Tampil lengkap sampai pengguna memilih, lalu diringkas jadi satu baris di halaman.
// TODO: pindahkan teks ke content/labels.js (KURATIF.ai) setelah disetujui tim pendamping.
export const TEXT_CONSENT = {
  title: "Kebijakan Privasi",
  question: "Apakah kami boleh menyimpan percakapan ini?",
  description:
    "Percakapan disimpan tanpa nama untuk membantu kami mengembangkan layanan. Kalau tidak, percakapan akan dihapus ketika refresh dan berpindah halaman. Pilihanmu tidak memengaruhi hasil jawaban AI, dan bisa diubah kapan saja.",
  agree: "Ya, simpan",
  decline: "Tidak, jangan simpan",
  declinedSummary: "Percakapan tidak disimpan.",
  change: "Ubah",
};

const OPTIONS = [
  { value: true, label: TEXT_CONSENT.agree },
  { value: false, label: TEXT_CONSENT.decline },
];

export default function ConsentBox({ value, onChange }) {
  return (
    <fieldset className="text-xs leading-relaxed text-svarati-teal">
      <legend className="text-sm font-semibold">{TEXT_CONSENT.title}</legend>
      <p className="mt-1 font-medium">{TEXT_CONSENT.question}</p>
      <p className="mt-0.5">{TEXT_CONSENT.description}</p>

      <div className="mt-2 flex gap-5">
        {OPTIONS.map((p) => (
          <label
            key={String(p.value)}
            className="flex cursor-pointer items-center gap-2"
          >
            <input
              type="radio"
              name="consent-simpan"
              checked={value === p.value}
              onChange={() => onChange(p.value)}
              className="h-4 w-4 shrink-0 cursor-pointer accent-svarati-teal"
            />
            <span>{p.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}