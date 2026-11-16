import Link from "next/link";
import { REFERENCE_SERVICES, REFERENCE_RECOVERY } from "../_lib/constants";

// Satu tautan kecil bergaris bawah di bawah jawaban AI.
// Prioritas: direktori layanan (jika jawaban menyebut layanan), lalu artikel, lalu pemulihan.
const ORDER = ["layanan", "artikel", "pemulihan"];

function getDestination(r) {
  if (r.type === "artikel") {
    return { href: `/preventif/${r.slug}`, label: r.judul_singkat ?? "Baca artikel terkait" };
  }
  if (r.type === "layanan") return REFERENCE_SERVICES;
  if (r.type === "pemulihan") return REFERENCE_RECOVERY;
  return null;
}

export default function ReferenceList({ items }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  const destination = ORDER.map((type) => items.find((r) => r.type === type))
    .filter(Boolean)
    .map(getDestination)
    .find(Boolean);
  if (!destination) return null;

  return (
    <div className="pl-11">
      <Link
        href={destination.href}
        className="inline-flex text-xs font-semibold text-svarati-teal underline underline-offset-2 hover:text-svarati-teal-light"
      >
        {destination.label}
      </Link>
    </div>
  );
}