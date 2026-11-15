"use client";
import { useCallback, useEffect, useState } from "react";

// Cache di memori modul: kunjungan kembali dalam sesi yang sama langsung tampil tanpa loader.
// Refresh (reload penuh) menghapus cache ini, jadi refresh tetap mengambil data dari server.
let cacheQuestions = null;

// Mengambil pertanyaan asesmen dari API (RLA043).
// status: "loading" | "ready" | "error"
export function useQuestions() {
  const [questions, setQuestions] = useState(cacheQuestions);
  const [status, setStatus] = useState(cacheQuestions ? "ready" : "loading");
  const [percobaan, setPercobaan] = useState(0);

  useEffect(() => {
    // Data sudah ada di cache dan ini bukan muat ulang manual: tidak perlu fetch
    if (cacheQuestions && percobaan === 0) return;

    const controller = new AbortController();

    fetch("/api/self-assessment/questions", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (!Array.isArray(json.questions) || json.questions.length === 0) {
          throw new Error("Data kosong");
        }
        cacheQuestions = json.questions;
        setQuestions(json.questions);
        setStatus("ready");
      })
      .catch((err) => {
        if (err.name !== "AbortError") setStatus("error");
      });

    return () => controller.abort();
  }, [percobaan]);

  // Dipanggil dari klik (bukan effect), jadi aman mengubah state di sini
  const muatUlang = useCallback(() => {
    cacheQuestions = null;
    setStatus("loading");
    setPercobaan((n) => n + 1);
  }, []);

  return { questions, status, muatUlang };
}