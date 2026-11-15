// Mengubah nomor telepon dan email di teks menjadi tautan (tel: dan mailto:).
// Hanya pola yang dikenali yang diubah. Teks tidak dirender sebagai HTML.

const PATTERN = new RegExp(
  [
    "[\\w.+-]+@[\\w-]+(?:\\.[\\w-]+)+", // email
    "(?<!\\d)(?:\\+?62|0)\\d{2,3}[-\\s]?\\d{4,8}(?!\\d)", // telepon Indonesia (rumah/seluler)
    "(?<!\\d)1500[-\\s]?\\d{3}(?!\\d)", // Halo Kemenkes
    "(?<!\\d)(?:110|112|119|129|171)(?!\\d)", // nomor darurat dan layanan
  ].join("|"),
  "g"
);

export default function LinkifiedText({ text }) {
  const parts = [];
  let lastEnd = 0;

  for (const m of text.matchAll(PATTERN)) {
    const start = m.index;
    const matched = m[0];
    if (start > lastEnd) parts.push(text.slice(lastEnd, start));

    const href = matched.includes("@") ? `mailto:${matched}` : `tel:${matched.replace(/[^\d+]/g, "")}`;
    parts.push(
      <a
        key={start}
        href={href}
        className="font-semibold underline underline-offset-2 hover:text-svarati-teal-light"
      >
        {matched}
      </a>
    );
    lastEnd = start + matched.length;
  }

  if (lastEnd < text.length) parts.push(text.slice(lastEnd));
  return <>{parts}</>;
}