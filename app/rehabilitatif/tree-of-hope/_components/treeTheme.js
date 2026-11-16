// Tiga warna palet Svarati bergiliran per pesan: Warna dominan CORAL dipakai selang-seling dengan ungu danhijau (teal).
export const TREE_COLORS = [
  {
    text: "text-svarati-coral-dark",
    envelope: "text-svarati-coral-dark",
    border: "border-svarati-coral-dark",
    accent: "border-l-svarati-coral-dark",
    stroke: "stroke-svarati-coral-dark",
    fill: "fill-svarati-coral-dark",
  },
  {
    text: "text-svarati-lavender-dark",
    envelope: "text-svarati-lavender-dark",
    border: "border-svarati-lavender-dark",
    accent: "border-l-svarati-lavender-dark",
    stroke: "stroke-svarati-lavender-dark",
    fill: "fill-svarati-lavender-dark",
  },
  {
    text: "text-svarati-coral-dark",
    envelope: "text-svarati-coral-dark",
    border: "border-svarati-coral-dark",
    accent: "border-l-svarati-coral-dark",
    stroke: "stroke-svarati-coral-dark",
    fill: "fill-svarati-coral-dark",
  },
  {
    text: "text-svarati-teal-light",
    envelope: "text-svarati-teal-light",
    border: "border-svarati-teal-light",
    accent: "border-l-svarati-teal-light",
    stroke: "stroke-svarati-teal-light",
    fill: "fill-svarati-teal-light",
  },
];

export const paletteOf = (i) => TREE_COLORS[i % TREE_COLORS.length];
