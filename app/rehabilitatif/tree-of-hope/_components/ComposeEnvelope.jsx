"use client";

import { treeOfHopeContent as t } from "@/content/labels";

// Amplop besar sebagai tombol "kirim pesan". Teks putih di atas coral-dark (kontras ~5:1).
// aspect = lebar / tinggi kotak tombol, agar gambar SVG tidak gepeng.
export default function ComposeEnvelope({
  onClick,
  aspect = 4 / 3,
  className = "",
  style,
  textClassName = "text-base",
  ctaClassName = "text-sm",
}) {
  const w = Math.round(aspect * 10000) / 100; // lebar viewBox untuk tinggi 100
  return (
    <button
      type="button"
      onClick={onClick}
      style={style}
      className={`group relative block text-white transition-transform duration-200 hover:-translate-y-1 motion-reduce:transform-none ${className}`}
    >
      <svg
        viewBox={`0 0 ${w} 100`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full drop-shadow-lg"
        aria-hidden="true"
      >
        <rect
          x="1"
          y="1"
          width={w - 2}
          height="98"
          rx="7"
          className="fill-svarati-coral-dark transition-colors group-hover:fill-svarati-coral-darker"
        />
        <path
          d={`M6 10 L${w / 2} 42 L${w - 6} 10`}
          fill="none"
          stroke="white"
          strokeOpacity="0.75"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="absolute inset-x-[8%] bottom-[7%] top-[50%] flex flex-col items-center justify-center gap-[5%] text-center">
        <span className={`font-heading font-semibold leading-snug ${textClassName}`}>
          {t.composeEnvelope}
        </span>
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-white px-[1.1em] py-[0.35em] font-semibold text-svarati-coral-dark ${ctaClassName}`}
        >
          {t.composeCta}
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
            ›
          </span>
        </span>
      </span>
    </button>
  );
}
