"use client";

import { treeOfHopeContent as t } from "@/content/labels";
import { HeartIcon } from "./icons";

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
      <HeartIcon filled={liked} className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
      <span>{count}</span>
    </button>
  );
}
