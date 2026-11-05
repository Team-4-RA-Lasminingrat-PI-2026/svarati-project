"use client";

import { createContext, useContext, useEffect, useState } from "react";

export const A11Y_STORAGE_KEY = "svarati-accessibility";

const DEFAULT_SETTINGS = { highContrast: false, screenReader: false };

const AccessibilityContext = createContext(null);

export function AccessibilityProvider({ children }) {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [isOpen, setIsOpen] = useState(false);
    const [loaded, setLoaded] = useState(false);

    // Baca pilihan tersimpan setelah komponen tampil di browser
    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem(A11Y_STORAGE_KEY));
            if (saved) setSettings({ ...DEFAULT_SETTINGS, ...saved });
        } catch {
            // localStorage tidak tersedia atau isinya rusak: pakai default
        }
        setLoaded(true);
    }, []);

    // Simpan pilihan dan terapkan ke elemen <html>
    useEffect(() => {
        if (!loaded) return;
        try {
            localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(settings));
        } catch {
            // abaikan jika penyimpanan gagal
        }
        const root = document.documentElement;
        root.dataset.contrast = settings.highContrast ? "high" : "normal";
        root.dataset.screenReader = settings.screenReader ? "on" : "off";
    }, [settings, loaded]);

    const value = {
        settings,
        toggle: (key) => setSettings((prev) => ({ ...prev, [key]: !prev[key] })),
        reset: () => setSettings(DEFAULT_SETTINGS),
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