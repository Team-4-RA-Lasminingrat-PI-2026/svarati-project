"use client";

import { useEffect } from "react";
import { useAccessibility } from "@/context/AccessibilityContext";
import { speak, stopSpeaking } from "@/lib/speech";

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

// Elemen yang bisa dibacakan saat disorot kursor, diklik, atau difokus dengan keyboard
const READABLE = [
    "a", "button", "[role='button']", "[role='switch']", "[role='link']", "[role='tab']",
    "[role='menuitem']", "input", "textarea", "select", "label", "img", "summary",
    "h1", "h2", "h3", "h4", "h5", "h6", "p", "li", "td", "th", "dt", "dd", "figcaption",
].join(", ");

function textOf(el) {
    const labelledBy = el.getAttribute("aria-labelledby");
    if (labelledBy) {
        const text = labelledBy
            .split(/\s+/)
            .map((id) => document.getElementById(id)?.innerText || "")
            .join(" ")
            .trim();
        if (text) return text;
    }
    if (el.getAttribute("aria-label")) return el.getAttribute("aria-label");
    if (el.tagName === "IMG") return el.alt ? `Gambar, ${el.alt}` : "";

    if (["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)) {
        const label =
            (el.id && document.querySelector(`label[for="${el.id}"]`)?.innerText) ||
            el.closest("label")?.innerText ||
            el.placeholder ||
            el.name ||
            "Kolom isian";
        if (el.type === "password") return label;
        if (el.type === "checkbox" || el.type === "radio") {
            return `${label}, ${el.checked ? "dipilih" : "tidak dipilih"}`;
        }
        const value = el.tagName === "SELECT" ? el.selectedOptions[0]?.text : el.value;
        return value ? `${label}, ${value}` : label;
    }

    return el.innerText || el.textContent || el.title || "";
}

function describe(el) {
    let text = textOf(el).trim();
    if (!text) return "";

    const role = el.getAttribute("role");
    if (role === "switch") {
        text += el.getAttribute("aria-checked") === "true" ? ", aktif" : ", nonaktif";
    } else if (el.tagName === "BUTTON" || role === "button") {
        text = `Tombol, ${text}`;
    } else if (el.tagName === "A" || role === "link") {
        text = `Tautan, ${text}`;
    } else if (/^H[1-6]$/.test(el.tagName)) {
        text = `Judul, ${text}`;
    }
    return text;
}

function findReadable(target) {
    if (!(target instanceof Element)) return null;
    if (target.closest("[aria-hidden='true']")) return null;
    return target.closest(READABLE);
}

export default function ScreenReaderEnhancer() {
    const { settings } = useAccessibility();

    useEffect(() => {
        if (!settings.screenReader) {
            cleanup();
            stopSpeaking();
            return;
        }

        enhance();

        // Konten yang muncul belakangan (menu, modal, pindah halaman) ikut diproses
        const observer = new MutationObserver(enhance);
        observer.observe(document.body, { childList: true, subtree: true });

        let lastHovered = null;
        let hoverTimer = null;

        const read = (el) => {
            const text = describe(el);
            if (text) speak(text);
        };

        // Kursor diarahkan: tunggu sebentar supaya tidak membaca semua yang dilewati
        const onMouseOver = (e) => {
            const el = findReadable(e.target);
            if (!el || el === lastHovered) return;
            lastHovered = el;
            clearTimeout(hoverTimer);
            hoverTimer = setTimeout(() => read(el), 250);
        };

        const onMouseOut = (e) => {
            if (lastHovered && !lastHovered.contains(e.relatedTarget)) {
                lastHovered = null;
                clearTimeout(hoverTimer);
            }
        };

        // Diklik: tunggu tampilan diperbarui dulu (misalnya status switch berubah)
        const onClick = (e) => {
            const el = findReadable(e.target);
            if (!el) return;
            clearTimeout(hoverTimer);
            setTimeout(() => read(el), 80);
        };

        // Navigasi dengan tombol Tab
        const onFocusIn = (e) => {
            const el = findReadable(e.target);
            if (el && el.matches(":focus-visible")) read(el);
        };

        document.addEventListener("mouseover", onMouseOver);
        document.addEventListener("mouseout", onMouseOut);
        document.addEventListener("click", onClick, true);
        document.addEventListener("focusin", onFocusIn);

        return () => {
            observer.disconnect();
            clearTimeout(hoverTimer);
            document.removeEventListener("mouseover", onMouseOver);
            document.removeEventListener("mouseout", onMouseOut);
            document.removeEventListener("click", onClick, true);
            document.removeEventListener("focusin", onFocusIn);
            stopSpeaking();
        };
    }, [settings.screenReader]);

    return null;
}