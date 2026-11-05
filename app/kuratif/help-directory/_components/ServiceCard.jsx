import Badge from "@/components/Badge";
import { Card } from "@/components/Card";
import { DIREKTORI } from "@/content/labels";

const K = DIREKTORI.kartu;

const telHref = (telepon) => telepon.replace(/[^0-9+]/g, "");

export default function ServiceCard({ layanan: s, badgeVariant }) {
  return (
    <Card
      variant="white"
      size="sm"
      className="h-full rounded-2xl p-5 hover:-translate-y-1 hover:shadow-md"
    >
      <div className="mb-1 flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-sm font-bold leading-snug text-svarati-teal">{s.nama}</h3>
        <Badge variant={badgeVariant}>{s.tipe}</Badge>
      </div>

      {s.nasional && (
        <p className="mb-0.5 text-xs font-semibold text-svarati-coral-dark">{K.nasional}</p>
      )}
      <p className="text-xs text-svarati-lavender-dark">
        <span aria-hidden="true">📍</span> {s.alamat}, {s.kota}
      </p>
      <p className="mb-3 mt-0.5 text-xs font-semibold text-svarati-teal-light">
        <span aria-hidden="true">📞</span> {s.telepon}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <a
          href={`tel:${telHref(s.telepon)}`}
          className="inline-block rounded-full bg-svarati-teal px-4 py-1.5 text-xs font-bold text-white transition hover:bg-svarati-teal-dark"
        >
          {K.hubungi}
        </a>
        {s.web && (
          <a
            href={s.web}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-svarati-lavender-dark underline"
          >
            {K.situs}
          </a>
        )}
      </div>
    </Card>
  );
}