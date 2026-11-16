import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DIREKTORI } from "@/content/labels";

const P = DIREKTORI.paginasi;

const nomorClass =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-svarati-teal focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

// Contoh hasil: [1, "…", 4, 5, 6, "…", 20]
function daftarHalaman(sekarang, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const urut = [...new Set([1, total, sekarang - 1, sekarang, sekarang + 1])]
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b);

  const hasil = [];
  urut.forEach((n, i) => {
    if (i > 0 && n - urut[i - 1] > 1) hasil.push("…");
    hasil.push(n);
  });
  return hasil;
}

export default function PaginationHelpDirectory({ halaman, totalHalaman, onUbah, disabled = false }) {
  if (totalHalaman <= 1) return null;

  return (
    <nav aria-label={P.label}>
      <ul className="flex flex-wrap items-center justify-center gap-2">
        <li>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled || halaman === 1}
            onClick={() => onUbah(halaman - 1)}
          >
            {P.sebelumnya}
          </Button>
        </li>

        {daftarHalaman(halaman, totalHalaman).map((item, i) => (
          <li key={`${item}-${i}`}>
            {item === "…" ? (
              <span aria-hidden="true" className="px-1 text-svarati-lavender-dark">
                …
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onUbah(item)}
                disabled={disabled}
                aria-label={P.halaman(item)}
                aria-current={item === halaman ? "page" : undefined}
                className={cn(
                  nomorClass,
                  item === halaman
                    ? "bg-svarati-teal text-white shadow-sm"
                    : "border border-svarati-lavender-border bg-white text-svarati-lavender-dark hover:bg-svarati-lavender-light"
                )}
              >
                {item}
              </button>
            )}
          </li>
        ))}

        <li>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled || halaman === totalHalaman}
            onClick={() => onUbah(halaman + 1)}
          >
            {P.berikutnya}
          </Button>
        </li>
      </ul>
    </nav>
  );
}