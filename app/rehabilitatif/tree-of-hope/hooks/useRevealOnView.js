"use client";

import { useEffect } from "react";

// Memanggil onReveal sekali ketika elemen sudah terlihat minimal `minRatio`
// (dihitung terhadap min(tinggi elemen, tinggi layar), jadi tetap jalan di layar pendek).
// Elemen yang disembunyikan CSS (display: none) tingginya 0 dan diabaikan.
export default function useRevealOnView(
  ref,
  revealed,
  onReveal,
  minRatio = 0.85,
  watch,
) {
  useEffect(() => {
    if (revealed) return;

    const check = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.height === 0) return;
      const vh = window.innerHeight;
      const visible = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
      if (visible / Math.min(rect.height, vh) >= minRatio) onReveal();
    };

    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [ref, revealed, onReveal, minRatio, watch]);
}
