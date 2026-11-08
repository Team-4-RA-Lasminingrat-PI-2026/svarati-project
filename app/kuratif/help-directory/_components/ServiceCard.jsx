"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import Badge from "@/components/Badge";
import { Card } from "@/components/Card";
import { DIREKTORI } from "@/content/labels";

const K = DIREKTORI.kartu;

const telHref = (telepon) => telepon.replace(/[^0-9+]/g, "");

// Hanya izinkan tautan http/https dari database (cegah "javascript:" dll.)
function amanUrl(nilai) {
  try {
    const u = new URL(nilai);
    return u.protocol === "http:" || u.protocol === "https:" ? u.href : null;
  } catch {
    return null;
  }
}

// Kolom sosmed bisa berisi beberapa tautan, dipisah koma / titik koma / baris baru
const pecahSosmed = (v) =>
  (v ?? "").split(/[\n,;]+/).map((t) => t.trim()).filter(Boolean);

const linkClass = "font-semibold text-svarati-teal underline";

function Baris({ label, children }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-svarati-teal">
        {label}
      </dt>
      <dd className="mt-0.5 text-xs leading-relaxed text-svarati-teal-dark">{children}</dd>
    </div>
  );
}

export default function ServiceCard({ layanan: s, badgeVariant }) {
  const [buka, setBuka] = useState(false);
  const panelId = useId();

  const sosmed = pecahSosmed(s.sosmed);

  const adaKoordinat = s.lat != null && s.lng != null;
  const urlPeta = adaKoordinat
  ? `https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lng}`
  : s.alamat && s.kota !== "Seluruh Indonesia"
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${s.nama}, ${s.alamat}, ${s.kota}`
      )}`
    : null;

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
      {s.telepon && (
        <p className="mt-0.5 text-xs font-semibold text-svarati-teal-light">
          <span aria-hidden="true">📞</span> {s.telepon}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-3">
        {s.telepon && (
          <a
            href={`tel:${telHref(s.telepon)}`}
            className="inline-block rounded-full bg-svarati-teal px-4 py-1.5 text-xs font-bold text-white transition hover:bg-svarati-teal-dark"
          >
            {K.hubungi}
          </a>
        )}
        {amanUrl(s.web) && (
          <a
            href={amanUrl(s.web)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-svarati-lavender-dark underline"
          >
            {K.situs}
          </a>
        )}

        <button
          type="button"
          onClick={() => setBuka((v) => !v)}
          aria-expanded={buka}
          aria-controls={buka ? panelId : undefined}
          className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-svarati-teal hover:underline"
        >
          {buka ? K.tutupDetail : K.lihatDetail}
          <ChevronDown
            aria-hidden="true"
            className={`size-3.5 transition-transform ${buka ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {buka && (
        <dl id={panelId} className="mt-4 space-y-3 border-t border-svarati-teal/10 pt-4">
          {s.deskripsi && <Baris label={K.deskripsi}>{s.deskripsi}</Baris>}

          {s.jam && <Baris label={K.jam}>{s.jam}</Baris>}

          {s.email && (
            <Baris label={K.email}>
              <a href={`mailto:${s.email}`} className={linkClass}>
                {s.email}
              </a>
            </Baris>
          )}

          {sosmed.length > 0 && (
            <Baris label={K.sosmed}>
              <ul className="space-y-0.5">
                {sosmed.map((item) => {
                  const href = amanUrl(item);
                  return (
                    <li key={item}>
                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={linkClass}
                        >
                          {href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                        </a>
                      ) : (
                        <span>{item}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Baris>
          )}

          {urlPeta && (
            <Baris label={K.peta}>
              <a href={urlPeta} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {K.bukaPeta}
              </a>
            </Baris>
          )}

          <Baris label={K.verifikasi}>
            {s.diverifikasiPada
              ? `${K.terverifikasiPada} ${new Date(s.diverifikasiPada).toLocaleDateString(
                  "id-ID",
                  { day: "numeric", month: "long", year: "numeric" }
                )}`
              : K.terverifikasi}
          </Baris>
        </dl>
      )}
    </Card>
  );
}