"use client";
import { useEffect, useRef, useState } from "react";
import { KURATIF } from "@/content/labels";
import { readConsent, saveConsent } from "../_lib/storage";
import {
  deleteFeedback,
  importHistory,
  sendReason,
  sendFeedback,
  sendMessage,
  loadHistory,
  syncSession,
} from "../_lib/api";
import { getRecentHistory, getUnsavedTurns } from "../_lib/chat";

const ai = KURATIF.ai;

// Semua state dan aksi chat Svarati AI. Halaman hanya merangkai komponen.
export function useSvaratiChat(questions) {
  const [messages, setMessages] = useState([{ id: 0, from: "bot", text: ai.greeting }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [showUrgent, setShowUrgent] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [consent, setConsent] = useState(null); // null = belum memilih / belum dibaca
  const [consentReady, setConsentReady] = useState(false); // localStorage sudah dibaca
  const [changeConsent, setChangeConsent] = useState(false);
  const [expiresAt, setExpiresAt] = useState(null);

  const showConsent = consent === null || changeConsent;
  const inputLocked = !consentReady || showConsent;
  // Ada giliran yang belum ada di database (belum setuju simpan, atau penyimpanan gagal)
  const hasUnsaved = getUnsavedTurns(messages).length > 0;

  const logRef = useRef(null);
  const stickRef = useRef(true); // true = pengguna sedang di dasar percakapan
  const busyRef = useRef(false); // mencegah kirim ganda sebelum state berubah
  const idRef = useRef(1);

  // Baca pilihan tersimpan saat halaman dibuka. Jika setuju, muat riwayat dan perpanjang sesi.
  useEffect(() => {
    const c = readConsent();
    /* eslint-disable react-hooks/set-state-in-effect */
    setConsent(c);
    setConsentReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    if (c === true) {
      loadHistory()
        .then((history) => {
          if (history.length > 0) {
            setMessages((m) => (m.length === 1 ? [...m, ...history] : m));
          }
        })
        .then(() => syncSession())
        .then((v) => {
          if (v) setExpiresAt(v);
        });
    }
  }, []);

  // Peringatan bawaan browser saat menutup/memuat ulang halaman dengan chat yang belum tersimpan
  useEffect(() => {
    if (!hasUnsaved) return undefined;
    const cegah = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", cegah);
    return () => window.removeEventListener("beforeunload", cegah);
  }, [hasUnsaved]);

  // Gulir ke pesan terbaru, kecuali pengguna sedang membaca pesan lama
  useEffect(() => {
    const el = logRef.current;
    if (!el || !stickRef.current) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ top: el.scrollHeight, behavior: reduceMotion ? "auto" : "smooth" });
  }, [messages, typing]);

  function handleScroll(e) {
    const el = e.currentTarget;
    stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  }

  // "Ya": simpan pilihan dan simpan chat yang tertunda, atau muat riwayat tersimpan.
  // "Tidak": hanya berhenti menyimpan pesan baru. Riwayat yang sudah tersimpan tetap ada.
  function handleConsentChange(value) {
    setConsent(value);
    saveConsent(value);
    setChangeConsent(false);
    if (!value) {
      setExpiresAt(null);
      return;
    }
    const pending = getUnsavedTurns(messages);
    if (pending.length > 0) {
      importHistory(pending.map((t) => t.turn)).then((data) => {
        if (!data) return; // tetap belum tersimpan; peringatan keluar halaman tetap aktif
        const idMap = new Map(pending.map((t, k) => [t.botId, data.message_ids[k]]));
        setMessages((m) => m.map((x) => (idMap.has(x.id) ? { ...x, serverId: idMap.get(x.id) } : x)));
        if (data.berlaku_sampai) setExpiresAt(data.berlaku_sampai);
      });
      return;
    }
    loadHistory().then((history) => {
      if (history.length > 0) {
        setMessages((m) => (m.length === 1 ? [...m, ...history] : m));
      }
    });
    syncSession().then((v) => {
      if (v) setExpiresAt(v);
    });
  }

  // Tautan "kembali": konfirmasi dulu jika ada chat yang belum tersimpan
  function confirmLeave(e) {
    if (
      hasUnsaved &&
      !window.confirm("Chat ini belum disimpan dan akan hilang jika kamu keluar. Tetap keluar?")
    ) {
      e.preventDefault();
    }
  }

  // Alasan hanya dikirim jika pengguna setuju menyimpan chat
  async function giveReason(msg, code, text) {
    if (!msg.serverId || consent !== true) return false;
    return sendReason(msg.serverId, code, text);
  }

  // Klik tombol yang sudah aktif = batalkan penilaian (baris di DB dihapus)
  async function giveFeedback(msg, value) {
    if (!msg.serverId) return;
    const previous = msg.feedback ?? null;
    const isCancel = previous === value;
    setMessages((m) => m.map((x) => (x.id === msg.id ? { ...x, feedback: isCancel ? null : value } : x)));
    const ok = isCancel ? await deleteFeedback(msg.serverId) : await sendFeedback(msg.serverId, value);
    if (!ok) {
      setMessages((m) => m.map((x) => (x.id === msg.id ? { ...x, feedback: previous } : x)));
    }
  }

  async function send(text) {
    const trimmed = text.trim();
    if (!trimmed || busyRef.current || inputLocked) return;

    busyRef.current = true;
    stickRef.current = true;
    const isFirstTurn = !messages.some((m) => m.from === "user");
    const history = getRecentHistory(messages);

    setMessages((m) => [...m, { id: idRef.current++, from: "user", text: trimmed }]);
    setTyping(true);

    try {
      const r = await sendMessage(trimmed, consent === true, questions, isFirstTurn, history);
      if (r.expiresAt) setExpiresAt(r.expiresAt);
      if (r.mode === "darurat") setShowUrgent(true); // keputusan darurat ada di backend
      setMessages((m) => [
        ...m,
        {
          id: idRef.current++,
          from: "bot",
          text: r.answer,
          mode: r.mode,
          references: r.references,
          chunks: r.chunks,
          serverId: r.serverId,
          feedback: null,
        },
      ]);
    } catch {
      setMessages((m) => [...m, { id: idRef.current++, from: "bot", text: ai.errorText }]);
    } finally {
      busyRef.current = false;
      setTyping(false);
    }
  }

  function submit(e) {
    e.preventDefault();
    if (!input.trim() || typing || inputLocked) return;
    const text = input;
    setInput("");
    send(text);
  }

  // Enter langsung kirim. Shift + Enter untuk baris baru.
  // isComposing dicek agar Enter saat menyusun huruf (IME) tidak ikut mengirim.
  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      submit(e);
    }
  }

  return {
    messages,
    input,
    setInput,
    typing,
    showUrgent,
    setShowUrgent,
    emergencyOpen,
    setEmergencyOpen,
    consent,
    consentReady,
    showConsent,
    inputLocked,
    hasUnsaved,
    expiresAt,
    setChangeConsent,
    logRef,
    handleScroll,
    handleConsentChange,
    confirmLeave,
    giveFeedback,
    giveReason,
    send,
    submit,
    handleKeyDown,
  };
}