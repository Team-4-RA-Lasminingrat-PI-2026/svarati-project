import { BookOpen, ChevronRight, ExternalLink } from "lucide-react";
import { KURATIF } from "@/content/labels";

// Sumber dikelompokkan per dokumen. Pasal dan halaman tampil sebagai chip di bawah judul.
// Seluruh kartu adalah tautan: artikel yang tayang di edukasi membuka halaman artikel,
// selain itu membuka dokumen resmi di tab baru.
function kelompokkan(sources) {
  const grup = new Map();
  for (const s of sources) {
    const kunci = s.doc_title || s.title;
    if (!grup.has(kunci)) {
      grup.set(kunci, { judul: kunci, slug: s.article_slug, url: s.official_source_url, bagian: [] });
    }
    const g = grup.get(kunci);
    const chip = [s.article_number ? `Pasal ${s.article_number}` : null, s.page != null ? `hal. ${s.page}` : null]
      .filter(Boolean)
      .join(", ");
    if (chip && !g.bagian.includes(chip)) g.bagian.push(chip);
  }
  return [...grup.values()];
}

function tujuan(g) {
  if (g.slug) return { href: `/preventif/${g.slug}`, eksternal: false };
  if (g.url) return { href: g.url, eksternal: true };
  return null;
}

export default function SourceList({ sources }) {
  if (!Array.isArray(sources) || sources.length === 0) return null;
  const grup = kelompokkan(sources);
  return (
    <div className="mt-3 rounded-xl border border-svarati-teal/15 bg-white/70 p-2.5 shadow-sm">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-svarati-teal/80">
        <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
        {KURATIF.ai.sources.title}
      </div>
      <ul className="mt-2 space-y-2">
        {grup.map((g, i) => {
          const link = tujuan(g);
          const isi = (
            <>
              <div className="min-w-0 flex-1">
                <p className="text-[12.5px] font-semibold leading-snug">{g.judul}</p>
                {g.bagian.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {g.bagian.map((c) => (
                      <span key={c} className="rounded-full bg-svarati-lavender-light px-2 py-0.5 text-[11px] text-svarati-lavender-dark">
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {link && (
                link.eksternal ? (
                  <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden="true" />
                ) : (
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 opacity-60" aria-hidden="true" />
                )
              )}
            </>
          );
          const kelas = "flex items-start gap-2 rounded-lg border-l-2 border-svarati-teal/40 bg-svarati-teal-soft/60 px-2.5 py-2";
          return (
            <li key={`${i}-${g.judul}`}>
              {link ? (
                <a
                  href={link.href}
                  target={link.eksternal ? "_blank" : undefined}
                  rel={link.eksternal ? "noopener noreferrer" : undefined}
                  className={`${kelas} transition-colors hover:bg-svarati-teal-soft`}
                >
                  {isi}
                </a>
              ) : (
                <div className={kelas}>{isi}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}