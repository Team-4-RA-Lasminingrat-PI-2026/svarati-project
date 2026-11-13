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
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold transition-colors ${
        compact ? "px-2 py-0.5 text-xs" : "px-3 py-1.5 text-sm"
      } ${
        liked
          ? "border-svarati-coral-dark bg-svarati-coral-dark text-white"
          : "border-input bg-card text-foreground hover:bg-accent"
      }`}
    >
      <Heart
        className={`shrink-0 ${compact ? "size-3.5" : "size-4"}`}
        fill={liked ? "currentColor" : "none"}
        aria-hidden="true"
      />
      <span>{count}</span>
    </button>
  );
}
