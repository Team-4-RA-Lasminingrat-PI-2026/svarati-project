"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { shortPlace } from "@/lib/tree-of-hope/place";

const MAX_SHOWN = 30;
const norm = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

// groups: [{ province, cities: [...] }] -> daftar datar
function buildOptions(groups) {
  const out = [];
  for (const g of groups) {
    out.push({
      value: g.province,
      label: g.province,
      hint: "Seluruh provinsi",
      province: g.province,
      isProvince: true,
    });
    const counts = new Map();
    for (const c of g.cities)
      counts.set(shortPlace(c), (counts.get(shortPlace(c)) ?? 0) + 1);
    for (const c of g.cities) {
      const short = shortPlace(c);
      const kind = /^Kota/i.test(c) ? "Kota" : "Kabupaten";
      out.push({
        value: c,
        label: counts.get(short) > 1 ? `${short} (${kind})` : short, // awalan hanya bila nama kembar
        hint: g.province,
        province: g.province,
        isProvince: false,
      });
    }
  }
  return out;
}

export default function LocationCombobox({
  label,
  value,
  onChange,
  groups,
  invalid,
}) {
  const uid = useId();
  const inputId = `${uid}-input`;
  const listId = `${uid}-list`;
  const rootRef = useRef(null);

  const options = useMemo(() => buildOptions(groups), [groups]);
  const selected = options.find((o) => o.value === value);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const q = norm(query.trim());
    if (!q) {
      // Belum mengetik: tampilkan provinsi saja, supaya daftar pendek
      return [
        { value: "", label: "Tidak dipilih", hint: "" },
        ...options.filter((o) => o.isProvince),
      ];
    }
    return options
      .filter((o) => norm(o.label).includes(q) || norm(o.province).includes(q))
      .sort((a, b) => {
        const as = norm(a.label).startsWith(q) ? 0 : 1;
        const bs = norm(b.label).startsWith(q) ? 0 : 1;
        return as - bs;
      })
      .slice(0, MAX_SHOWN);
  }, [options, query]);

  // Dijaga agar tidak melewati panjang daftar (tanpa setState di dalam effect)
  const activeIndex = Math.min(active, Math.max(results.length - 1, 0));

  // Tutup saat klik di luar
  useEffect(() => {
    const onDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // Pastikan opsi aktif terlihat
  useEffect(() => {
    if (open)
      document
        .getElementById(`${uid}-opt-${activeIndex}`)
        ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open, uid]);

  function choose(opt) {
    onChange(opt.value);
    setQuery("");
    setActive(0);
    setOpen(false);
  }

  function onKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive(Math.min(activeIndex + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(Math.max(activeIndex - 1, 0));
    } else if (e.key === "Enter" && open) {
      e.preventDefault(); // jangan mengirim form
      if (results[activeIndex]) choose(results[activeIndex]);
    } else if (e.key === "Escape" && open) {
      e.stopPropagation(); // hanya menutup daftar, bukan seluruh form
      setOpen(false);
      setQuery("");
      setActive(0);
    }
  }

  const shownText = open ? query : (selected?.label ?? value ?? "");

  return (
    <div ref={rootRef} className="relative mt-4">
      <label htmlFor={inputId} className="block text-sm font-semibold">
        {label}
      </label>
      <input
        id={inputId}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open ? `${uid}-opt-${activeIndex}` : undefined}
        aria-invalid={invalid || undefined}
        autoComplete="off"
        value={shownText}
        placeholder="Ketik nama kota atau provinsi"
        onFocus={() => {
          setActive(0);
          setOpen(true);
        }}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onKeyDown={onKeyDown}
        className="mt-1 w-full rounded-xl border border-input bg-card px-3 py-2 font-normal text-card-foreground"
      />

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label={label}
          className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-input bg-card py-1 shadow-lg"
        >
          {results.length === 0 && (
            <li className="px-3 py-2 text-sm text-muted-foreground">
              Daerah tidak ditemukan.
            </li>
          )}
          {results.map((o, i) => (
            <li
              key={`${o.value}-${i}`}
              id={`${uid}-opt-${i}`}
              role="option"
              aria-selected={o.value === value}
              onMouseDown={(e) => e.preventDefault()} // input tidak kehilangan fokus
              onClick={() => choose(o)}
              onMouseEnter={() => setActive(i)}
              className={`flex cursor-pointer items-baseline justify-between gap-3 px-3 py-2 text-sm ${
                i === activeIndex ? "bg-accent text-accent-foreground" : ""
              }`}
            >
              <span className="font-medium">{o.label}</span>
              {o.hint && (
                <span className="shrink-0 text-xs text-muted-foreground">
                  {o.hint}
                </span>
              )}
            </li>
          ))}
          {!query && (
            <li
              className="px-3 py-1.5 text-xs text-muted-foreground"
              aria-hidden="true"
            >
              Ketik untuk mencari kota atau kabupaten.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
