"use client";

import { useEffect, useState } from "react";
import { Heart, Share2 } from "lucide-react";
import { educationContent as edu } from "@/content/labels";
import { ensureAnonymousSession } from "@/lib/session";
import { getStoredSession } from "@/lib/session/storage";

export default function ArticleActions({ title, slug, initialLikes = 0 }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  const url = `/api/articles/${slug}/like`;

  // Saat dibuka: cek status hanya jika token sudah ada (tidak membuat sesi baru)
  useEffect(() => {
    let off = false;
    (async () => {
      const stored = getStoredSession();
      if (!stored) return;
      try {
        const res = await fetch(url, {
          headers: { "x-session-token": stored.token },
          cache: "no-store",
        });
        if (res.ok && !off) {
          const d = await res.json();
          setLiked(d.liked);
          setLikes(d.likes);
        }
      } catch {
        // jaringan gagal: tetap tampilkan angka dari server
      }
    })();
    return () => {
      off = true;
    };
  }, [url]);

  const toggleLike = async () => {
    if (busy) return;
    setBusy(true);
    const prev = { liked, likes };
    setLiked(!liked); // optimistic
    setLikes(likes + (liked ? -1 : 1));
    try {
      const token = await ensureAnonymousSession(); // membuat sesi jika belum ada
      if (!token) throw new Error("no session");
      const res = await fetch(url, {
        method: prev.liked ? "DELETE" : "POST",
        headers: { "x-session-token": token },
      });
      if (!res.ok) throw new Error("gagal");
      const d = await res.json();
      setLiked(d.liked);
      setLikes(d.likes);
    } catch {
      setLiked(prev.liked); // rollback
      setLikes(prev.likes);
    } finally {
      setBusy(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
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
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-30 sm:bottom-4 flex justify-center px-4">
      <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-svarati-lavender-light bg-white/90 p-1.5 shadow-lg backdrop-blur-md">
        <button
          type="button"
          onClick={toggleLike}
          disabled={busy}
          aria-pressed={liked}
          aria-label={edu.detail.like}
          className={btn}
        >
          <Heart
            className={`size-4 ${liked ? "fill-svarati-coral-dark text-svarati-coral-dark" : ""}`}
            aria-hidden="true"
          />
          {likes}
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