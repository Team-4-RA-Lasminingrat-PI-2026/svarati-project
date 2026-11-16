"use client";

import { useEffect, useRef, useState } from "react";
import { ensureAnonymousSession } from "@/lib/session";
import {
  getStoredSession,
  clearSessionData,
  isNoticeSeen,
  markNoticeSeen,
} from "@/lib/session/storage";
import { sessionNotice } from "@/content/labels";
import { Button } from "@/components/ui/button";

function zoneLabel(date) {
  const offset = -date.getTimezoneOffset() / 60;
  const map = { 7: "WIB", 8: "WITA", 9: "WIT" };
  return map[offset] ?? `GMT${offset >= 0 ? "+" : ""}${offset}`;
}

function formatExpiry(iso) {
  const date = new Date(iso);
  const text = date.toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });
  return `${text} ${zoneLabel(date)}`;
}

export default function SessionInit() {
  const [expiresAt, setExpiresAt] = useState(null); // dipakai untuk notifikasi
  const expiryRef = useRef(null); // dipakai untuk pengecekan expired

  // Inisialisasi sesi + tampilkan notifikasi sekali per sesi
  useEffect(() => {
    let cancelled = false;

    ensureAnonymousSession().then(({ token, wasReset }) => {
      if (cancelled) return;

      // Sesi direset: data di layar masih state lama, reload supaya bersih
      if (wasReset) {
        window.location.reload();
        return;
      }

      if (!token) return;

      const stored = getStoredSession();
      if (!stored) return;

      expiryRef.current = stored.expiresAt;

      // Notif muncul kalau expiresAt sesi ini belum pernah ditandai
      if (!isNoticeSeen(stored.expiresAt)) {
        setExpiresAt(stored.expiresAt);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Cek expired tiap menit, dan saat tab kembali aktif.
  // Tidak pakai setTimeout karena batas maksimalnya ~24,8 hari (TTL kita 30 hari).
  useEffect(() => {
    const check = () => {
      if (!expiryRef.current) return;
      if (Date.now() >= new Date(expiryRef.current).getTime()) {
        clearSessionData();
        window.location.reload(); // reload -> sesi baru dibuat otomatis
      }
    };

    const id = setInterval(check, 60 * 1000);
    document.addEventListener("visibilitychange", check);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", check);
    };
  }, []);

  if (!expiresAt) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-4 bottom-4 z-50 ml-auto max-w-sm rounded-xl bg-svarati-teal-dark p-4 text-sm leading-relaxed text-white shadow-lg sm:inset-x-auto sm:right-4"
    >
      <p>{sessionNotice.message(formatExpiry(expiresAt))}</p>
      <p className="mt-1.5 opacity-85">{sessionNotice.note}</p>
      <Button
        variant="primary"
        size="sm"
        className="mt-3"
        onClick={() => {
          markNoticeSeen(expiresAt);
          setExpiresAt(null);
        }}
      >
        {sessionNotice.button}
      </Button>
    </div>
  );
}