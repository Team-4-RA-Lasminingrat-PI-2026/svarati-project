"use client";

import { Mail } from "lucide-react";
import { treeOfHopeContent as t } from "@/content/labels";

export default function ComposeEnvelope({ onClick, className = "", style }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={style}
      className={`group relative block cursor-pointer overflow-hidden rounded-2xl border-2 border-svarati-coral bg-white text-center shadow-xl transition hover:-translate-y-1 hover:shadow-2xl motion-reduce:transform-none ${className}`}
    >
      {/* tutup amplop */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[30%] bg-svarati-coral/25 [clip-path:polygon(0_0,100%_0,50%_100%)]"
      />
      <span className="absolute inset-x-[6%] bottom-[6%] top-[32%] flex flex-col items-center justify-center gap-[0.35em]">
        <Mail className="size-[1.6em] text-svarati-coral-dark" aria-hidden="true" />
        <span className="font-bold leading-snug text-svarati-teal">{t.composeEnvelope}</span>
      </span>
    </button>
  );
}