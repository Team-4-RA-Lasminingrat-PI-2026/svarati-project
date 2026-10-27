"use client";

import { useState } from "react";
import { Heart, Share2 } from "lucide-react";
import { educationContent as edu } from "@/content/labels";

export default function ArticleActions({ title, initialLikes = 0 }) {
  const [liked, setLiked] = useState(false);
  const [status, setStatus] = useState("");

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setStatus(edu.detail.copied);
        setTimeout(() => setStatus(""), 2000);
      }
    } catch {
      // Pengguna menutup dialog bagikan: abaikan
    }
  };

  const btn =
    "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-svarati-lavender-dark transition hover:bg-svarati-lavender-light";

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-30 flex justify-center px-4">
      <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-svarati-lavender-light bg-white/90 p-1.5 shadow-lg backdrop-blur-md">
        <button
          type="button"
          onClick={() => setLiked((v) => !v)}
          aria-pressed={liked}
          aria-label={edu.detail.like}
          className={btn}
        >
          <Heart
            className={`size-4 ${liked ? "fill-svarati-coral-dark text-svarati-coral-dark" : ""}`}
            aria-hidden="true"
          />
          {initialLikes + (liked ? 1 : 0)}
        </button>

        <button type="button" onClick={handleShare} aria-label={edu.detail.share} className={btn}>
          <Share2 className="size-4" aria-hidden="true" />
          {edu.detail.share}
        </button>

        <span role="status" aria-live="polite" className="px-2 text-xs text-svarati-lavender-dark">
          {status}
        </span>
      </div>
    </div>
  );
}