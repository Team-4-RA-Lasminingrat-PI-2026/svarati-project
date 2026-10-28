"use client";

import { useEffect, useRef, useState } from "react";

const data = [
  { tahun: 2016, kasus: 7474 },
  { tahun: 2017, kasus: 17943 },
  { tahun: 2018, kasus: 18118 },
  { tahun: 2019, kasus: 17132 },
  { tahun: 2020, kasus: 17574 },
  { tahun: 2021, kasus: 21753 },
  { tahun: 2022, kasus: 25053 },
  { tahun: 2023, kasus: 26161 },
  { tahun: 2024, kasus: 35533 },
  { tahun: 2025, kasus: 38810 },
];

const maks = Math.max(...data.map((d) => d.kasus));

export default function KasusBarChart() {
  const ref = useRef(null);
  const [tampil, setTampil] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTampil(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTampil(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="overflow-x-auto">
      <div
        ref={ref}
        role="img"
        aria-label={`Grafik jumlah kasus kekerasan terhadap perempuan per tahun, dari ${data[0].kasus.toLocaleString("id-ID")} kasus pada ${data[0].tahun} menjadi ${data[data.length - 1].kasus.toLocaleString("id-ID")} kasus pada ${data[data.length - 1].tahun}`}
        className="flex h-72 min-w-[560px] items-end gap-2 border-b border-svarati-teal/20 pb-2 sm:gap-4"
      >
        {data.map((d, i) => {
          const tinggi = (d.kasus / maks) * 100;
          const terbaru = i >= data.length - 2;
          return (
            <div key={d.tahun} className="flex h-full flex-1 flex-col justify-end text-center">
              <span className="mb-1 text-xs font-bold text-svarati-teal">
                {d.kasus.toLocaleString("id-ID")}
              </span>
              <div
                className={`w-full rounded-t-lg transition-[height] duration-1000 ease-out ${
                  terbaru ? "bg-svarati-coral" : "bg-svarati-lavender"
                }`}
                style={{
                  height: tampil ? `${tinggi * 0.85}%` : "0%",
                  transitionDelay: `${i * 80}ms`,
                }}
              />
            </div>
          );
        })}
      </div>

      <div aria-hidden="true" className="flex min-w-[560px] gap-2 pt-2 sm:gap-4">
        {data.map((d) => (
          <span key={d.tahun} className="flex-1 text-center text-xs font-semibold text-svarati-teal/80">
            {d.tahun}
          </span>
        ))}
      </div>
    </div>
  );
}
