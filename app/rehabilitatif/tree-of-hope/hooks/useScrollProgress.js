"use client";

import { useEffect } from "react";

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const easeInOut = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// Menghitung progres scroll 0..1 sepanjang "track" dan menulisnya ke CSS variable --p pada panggung.
// Nilai dihaluskan (lerp) lewat requestAnimationFrame, tanpa setState React, jadi animasi tetap mulus.
// Mengisi data-done="true" saat progres >= doneAt, dan memanggil onDone sekali.
//
// snap: satu gerakan scroll ke bawah (roda, panah bawah, PageDown, spasi, geser jari)
// di awal track langsung membawa halaman ke ujung track, jadi pohon terbuka 100%.
export default function useScrollProgress({
  trackRef,
  stageRef,
  onDone,
  doneAt = 0.85,
  snap = true,
  snapDuration = 700, // ms
}) {
  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;

    let target = 0;
    let current = 0;
    let raf = 0;
    let snapFrame = 0;
    let announced = false;
    let snapping = false;

    const write = (v) => {
      stage.style.setProperty("--p", v.toFixed(4));
      const done = v >= doneAt;
      stage.dataset.done = done ? "true" : "false";
      if (done && !announced) {
        announced = true;
        onDone?.();
      }
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      track.style.height = "100svh";
      write(1);
      return;
    }

    const measure = () => {
      const rect = track.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (rect.height === 0 || scrollable <= 0) return; // disembunyikan CSS (di bawah breakpoint)
      target = clamp(-rect.top / scrollable, 0, 1);
    };

    const tick = () => {
      current += (target - current) * 0.16;
      if (Math.abs(target - current) < 0.0015) current = target;
      write(current);
      raf = current === target ? 0 : requestAnimationFrame(tick);
    };

    const onScroll = () => {
      measure();
      if (!raf) raf = requestAnimationFrame(tick);
    };

    // ---------- Snap ----------
    const trackBounds = () => {
      const start = track.getBoundingClientRect().top + window.scrollY;
      return { start, end: start + track.offsetHeight - window.innerHeight };
    };

    // Aktif hanya di desktop (track tinggi 0 di bawah breakpoint), di dalam track,
    // dan tidak saat modal terbuka (modal mengunci scroll body).
    const canSnap = () => {
      if (!track.offsetHeight || document.body.style.overflow === "hidden")
        return false;
      const { start, end } = trackBounds();
      return window.scrollY >= start - 2 && window.scrollY < end - 4;
    };

    const snapToEnd = () => {
      const { end } = trackBounds();
      const from = window.scrollY;
      const t0 = performance.now();
      snapping = true;
      const step = (now) => {
        const k = Math.min(1, (now - t0) / snapDuration);
        // "instant": CSS html { scroll-behavior: smooth } tidak boleh memperlambat tiap frame
        window.scrollTo({
          top: from + (end - from) * easeInOut(k),
          behavior: "instant",
        });
        if (k < 1) snapFrame = requestAnimationFrame(step);
        else snapping = false;
      };
      snapFrame = requestAnimationFrame(step);
    };

    const onWheel = (e) => {
      if (snapping) return e.preventDefault(); // abaikan gulungan lanjutan selama animasi
      if (e.deltaY > 4 && canSnap()) {
        e.preventDefault();
        snapToEnd();
      }
    };

    const onKey = (e) => {
      if (!["ArrowDown", "PageDown", " "].includes(e.key) || e.shiftKey) return;
      if (
        /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(document.activeElement?.tagName)
      )
        return;
      if (snapping) return e.preventDefault();
      if (canSnap()) {
        e.preventDefault();
        snapToEnd();
      }
    };

    let touchY = null;
    const onTouchStart = (e) => (touchY = e.touches[0].clientY);
    const onTouchMove = (e) => {
      if (touchY === null) return;
      if (snapping) return e.preventDefault();
      if (touchY - e.touches[0].clientY > 12 && canSnap()) {
        e.preventDefault();
        touchY = null;
        snapToEnd();
      }
    };

    measure();
    current = target; // halaman dimuat di tengah scroll: langsung ke posisi itu
    write(current);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    if (snap) {
      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("keydown", onKey);
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: false });
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(snapFrame);
    };
  }, [trackRef, stageRef, onDone, doneAt, snap, snapDuration]);
}
