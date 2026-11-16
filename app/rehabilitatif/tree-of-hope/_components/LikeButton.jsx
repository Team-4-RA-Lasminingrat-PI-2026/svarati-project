"use client";

import { Heart } from "lucide-react";
import { treeOfHopeContent as t } from "@/content/labels";

export default function LikeButton({ liked, count, onClick, compact = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={liked}
      aria-label={t.like.aria(liked, count, t.supportLabel)}
      className={`relative z-20 inline-flex shrink-0 cursor-pointer items-center font-bold transition-transform hover:scale-110 active:scale-95 ${
        compact ? "gap-[0.3em] p-[0.3em]" : "gap-1.5 p-1.5 text-sm"
      } ${liked ? "text-svarati-danger" : "text-svarati-teal"}`}
    >
      <Heart
        aria-hidden="true"
        className={`shrink-0 transition-colors ${compact ? "size-[1.25em]" : "size-5"} ${
          liked
            ? "animate-in zoom-in-75 fill-svarati-danger stroke-svarati-danger duration-200"
            : "fill-card stroke-svarati-teal"
        }`}
      />
      <span>{count}</span>
    </button>
  );
}