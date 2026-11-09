"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocalStorageState } from "@/lib/useLocalStorageState";

export const A11Y_STORAGE_KEY = "svarati-accessibility";

// Nilai yang boleh dipakai; nilai lain dari localStorage diabaikan
export const PILIHAN_UKURAN = ["kecil", "normal", "besar"];
export const PILIHAN_RATA = ["kiri", "tengah", "kanan", "penuh"];

const DEFAULT_SETTINGS = {
    highContrast: false,
    screenReader: false,
    fontSize: "normal",
    lineHeight: "normal",
    letterSpacing: "normal",
    textAlign: null, // null = ikuti rata bawaan halaman
};

// Buang nilai yang tidak dikenal supaya isi localStorage yang rusak tidak merusak tampilan
function rapikan(saved) {
    const s = { ...DEFAULT_SETTINGS, ...saved };
    for (const key of ["fontSize", "lineHeight", "letterSpacing"]) {
        if (!PILIHAN_UKURAN.includes(s[key])) s[key] = "normal";
    }
    if (!PILIHAN_RATA.includes(s.textAlign)) s.textAlign = null;
    s.highContrast = s.highContrast === true;
    s.screenReader = s.screenReader === true;
    return s;
}

// Pasang setelan ke <html data-...>; CSS di globals.css (bagian 8) yang menerapkannya.
// Nilai bawaan tidak dipasang supaya halaman tampil seperti aslinya.
function terapkanKeHtml(settings) {
    const root = document.documentElement;
    root.dataset.contrast = settings.highContrast ? "high" : "normal";
    root.dataset.screenReader = settings.screenReader ? "on" : "off";
    for (const key of ["fontSize", "lineHeight", "letterSpacing"]) {
        if (settings[key] === "normal") delete root.dataset[key];
        else root.dataset[key] = settings[key];
    }
    if (settings.textAlign) root.dataset.textAlign = settings.textAlign;
    else delete root.dataset.textAlign;
}

const AccessibilityContext = createContext(null);

export function AccessibilityProvider({ children }) {
    // Pilihan langsung tersimpan di localStorage (dan ikut berubah kalau diubah di tab lain)
    const [saved, setSaved] = useLocalStorageState(A11Y_STORAGE_KEY, DEFAULT_SETTINGS);
    const settings = useMemo(() => rapikan(saved), [saved]);
    const [isOpen, setIsOpen] = useState(false);

    // Terapkan ke <html>. Selama belum ada pilihan tersimpan (termasuk saat hydration)
    // tidak perlu apa-apa: skrip init di layout.js sudah memasang setelan sebelum halaman tampil.
    useEffect(() => {
        if (saved === DEFAULT_SETTINGS) return;
        terapkanKeHtml(settings);
    }, [saved, settings]);

    // Ubah satu setelan berdasarkan nilai terbaru di localStorage
    const ubah = (key, hitung) =>
        setSaved((prev) => {
            const s = rapikan(prev);
            return { ...s, [key]: hitung(s[key]) };
        });

    const value = {
        settings,
        toggle: (key) => ubah(key, (v) => !v),
        // Ubah satu setelan, misalnya set("fontSize", "besar")
        set: (key, val) => ubah(key, () => val),
        reset: () => setSaved({ ...DEFAULT_SETTINGS }),
        isOpen,
        setOpen: setIsOpen,
        openModal: () => setIsOpen(true),
    };

    return (
        <AccessibilityContext.Provider value={value}>
            {children}
        </AccessibilityContext.Provider>
    );
}

export function useAccessibility() {
    const ctx = useContext(AccessibilityContext);
    if (!ctx) {
        throw new Error("useAccessibility harus dipakai di dalam AccessibilityProvider");
    }
    return ctx;
}