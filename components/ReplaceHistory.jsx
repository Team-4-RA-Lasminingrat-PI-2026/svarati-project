"use client";

import { useEffect } from "react";

// Semua perpindahan halaman di Svarati mengganti entri riwayat, tidak menambahnya
export default function ReplaceHistory() {
  useEffect(() => {
    const originalPush = window.history.pushState;
    window.history.pushState = function (...args) {
      return window.history.replaceState.apply(window.history, args);
    };
    return () => {
      window.history.pushState = originalPush;
    };
  }, []);

  return null;
}