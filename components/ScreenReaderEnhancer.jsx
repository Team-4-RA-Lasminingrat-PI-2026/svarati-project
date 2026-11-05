"use client";

import { useEffect } from "react";
import { useAccessibility } from "@/context/AccessibilityContext";

// Penanda untuk atribut yang ditambahkan otomatis, supaya bisa dibersihkan saat mode dimatikan
const AUTO = "data-a11y-auto";
const mark = (el) => el.setAttribute(AUTO, "");

function enhance() {
    // Tombol dan tautan tanpa teks (misalnya hanya ikon)
    document.querySelectorAll("button, a, [role='button']").forEach((el) => {
        if (el.hasAttribute("aria-label") || el.hasAttribute("aria-labelledby")) return;
        if (el.textContent.trim()) return;
        const label = el.getAttribute("title") || el.querySelector("img[alt]")?.alt;
        if (label) {
            el.setAttribute("aria-label", label);
            mark(el);
        }
    });

    // Input tanpa label
    document.querySelectorAll("input, textarea, select").forEach((el) => {
        const hasLabelFor = el.id && document.querySelector(`label[for="${el.id}"]`);
        if (el.hasAttribute("aria-label") || el.hasAttribute("aria-labelledby") || hasLabelFor) return;
        const label = el.placeholder || el.name;
        if (label) {
            el.setAttribute("aria-label", label);
            mark(el);
        }
    });

    // Gambar tanpa atribut alt
    document.querySelectorAll("img:not([alt])").forEach((el) => {
        el.setAttribute("alt", "Gambar");
        mark(el);
    });

    // Landmark tanpa nama
    [
        ["nav", "Navigasi utama"],
        ["footer", "Footer"],
    ].forEach(([tag, label]) => {
        const el = document.querySelector(tag);
        if (el && !el.hasAttribute("aria-label") && !el.hasAttribute("aria-labelledby")) {
            el.setAttribute("aria-label", label);
            mark(el);
        }
    });
}

function cleanup() {
    document.querySelectorAll(`[${AUTO}]`).forEach((el) => {
        el.removeAttribute("aria-label");
        if (el.tagName === "IMG") el.removeAttribute("alt");
        el.removeAttribute(AUTO);
    });
}

export default function ScreenReaderEnhancer() {
    const { settings } = useAccessibility();

    useEffect(() => {
        if (!settings.screenReader) {
            cleanup();
            return;
        }

        enhance();

        // Konten yang muncul belakangan (menu, modal, pindah halaman) ikut diproses
        const observer = new MutationObserver(enhance);
        observer.observe(document.body, { childList: true, subtree: true });
        return () => observer.disconnect();
    }, [settings.screenReader]);

    return null;
}