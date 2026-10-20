"use client";

import { useEffect } from "react";

const types = {
  sukses: {
    style: "border-svarati-teal/15 bg-svarati-teal-soft text-svarati-teal",
    icon: "✓",
  },
  gagal: {
    style: "border-svarati-danger/20 bg-svarati-danger-soft text-svarati-danger-dark",
    icon: "✕",
  },
  peringatan: {
    style: "border-svarati-coral/20 bg-svarati-coral-soft text-svarati-coral-dark",
    icon: "⚠",
  },
};

export default function Toast({ open, onClose, type = "sukses", message, duration = 3000 }) {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [open, onClose, duration]);

  if (!open) return null;

  const { style, icon } = types[type] || types.sukses;

  return (
    <div
      role={type === "gagal" ? "alert" : "status"}
      className={`fixed bottom-6 left-1/2 z-[60] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-lg ${style}`}
    >
      <span aria-hidden="true">{icon}</span>
      <span>{message}</span>
    </div>
  );
}