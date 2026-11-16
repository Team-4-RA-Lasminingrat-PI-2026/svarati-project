"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

// Event internal supaya semua komponen yang membaca key yang sama ikut diperbarui
const CHANGE_EVENT = "svarati-local-storage";

// Cadangan di memori kalau localStorage tidak bisa dipakai (mode privat, penyimpanan penuh)
const memory = new Map();

function readRaw(key) {
    try {
        const raw = localStorage.getItem(key);
        if (raw !== null) return raw;
    } catch { }
    return memory.get(key) ?? null;
}

function writeRaw(key, raw) {
    if (raw === null) memory.delete(key);
    else memory.set(key, raw);
    try {
        if (raw === null) localStorage.removeItem(key);
        else localStorage.setItem(key, raw);
    } catch { }
    window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(callback) {
    window.addEventListener("storage", callback); // perubahan dari tab lain
    window.addEventListener(CHANGE_EVENT, callback);
    return () => {
        window.removeEventListener("storage", callback);
        window.removeEventListener(CHANGE_EVENT, callback);
    };
}

/**
 * Seperti useState, tapi nilainya disimpan di localStorage.
 * Di server (dan saat hydration) selalu memakai `initial`, jadi tidak ada hydration mismatch.
 * `initial` harus referensi yang tetap (definisikan di luar komponen).
 *
 * @returns [value, setValue, remove]
 */
export function useLocalStorageState(key, initial) {
    const raw = useSyncExternalStore(
        subscribe,
        () => readRaw(key),
        () => null
    );

    const value = useMemo(() => {
        if (raw === null) return initial;
        try {
            return JSON.parse(raw);
        } catch {
            return initial; // isi rusak: pakai nilai awal
        }
    }, [raw, initial]);

    const setValue = useCallback(
        (update) => {
            let current = initial;
            const currentRaw = readRaw(key);
            if (currentRaw !== null) {
                try {
                    current = JSON.parse(currentRaw);
                } catch { }
            }
            const next = typeof update === "function" ? update(current) : update;
            writeRaw(key, JSON.stringify(next));
        },
        [key, initial]
    );

    const remove = useCallback(() => writeRaw(key, null), [key]);

    return [value, setValue, remove];
}
