import Link from "next/link";
import { MapPin } from "lucide-react";
import { REFERENCE_SERVICES, REFERENCE_RECOVERY } from "../_lib/constants";

// Artikel sudah tampil di kotak SUMBER. Di sini hanya bantuan lanjutan, tampil sebagai badge.
const TIPE_TAMPIL = ["layanan", "pemulihan"];

const GAYA = {
  layanan: { Icon: MapPin, kelas: "bg-svarati-lavender-light text-svarati-lavender-dark" },
  pemulihan: { Icon: null, kelas: "bg-svarati-coral/15 text-svarati-coral-medium" },
};

function getDestination(r) {
  if (r.type === "layanan") return { ...REFERENCE_SERVICES, tipe: "layanan" };
  if (r.type === "pemulihan") return { ...REFERENCE_RECOVERY, tipe: "pemulihan" };
  return null;
}

export default function ReferenceList({ items }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  const links = items
    .filter((r) => TIPE_TAMPIL.includes(r.type))
    .map(getDestination)
    .filter(Boolean);
  if (links.length === 0) return null;

  return (
    <div className="flex flex-col items-start gap-1.5 sm:flex-row sm:flex-wrap">
      {links.map((d) => {
        const { Icon, kelas } = GAYA[d.tipe];
        return (
          <Link
            key={d.href}
            href={d.href}
            className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-colors hover:opacity-80 ${kelas}`}
          >
            {Icon && <Icon className="h-3 w-3" aria-hidden="true" />}
            {d.label}
          </Link>
        );
      })}
    </div>
  );
}