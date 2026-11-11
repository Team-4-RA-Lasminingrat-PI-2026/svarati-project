export function editDeadlineText(iso) {
  const d = new Date(iso);
  const tanggal = d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const jam = d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).replace(":", ".");
  return `Kamu dapat mengubah pesanmu sampai tanggal ${tanggal} jam ${jam}. Setelah itu, pesan akan tersimpan permanen di Pohon Svarati.`;
}