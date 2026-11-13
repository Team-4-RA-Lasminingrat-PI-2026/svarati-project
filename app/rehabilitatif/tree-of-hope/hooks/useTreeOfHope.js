"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { treeOfHopeContent as t } from "@/content/labels";
import {
  API_URL,
  PAGE_SIZE,
  FALLBACK_ID_PREFIX,
  TOAST_TYPE,
} from "@/lib/tree-of-hope/constants";
import { fetchMessagesPage } from "@/lib/tree-of-hope/client";
import { editDeadlineText } from "@/lib/tree-of-hope/messageWarning";
import { ensureAnonymousSession } from "@/lib/session";

export default function useTreeOfHope() {
  const [revealed, setRevealed] = useState(false);
  const [messages, setMessages] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0); // 0 = halaman terbaru
  const [reloadKey, setReloadKey] = useState(0);
  const [activeIndex, setActiveIndex] = useState(null);
  const [direction, setDirection] = useState(1);
  const [newId, setNewId] = useState(null);
  const [pingId, setPingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState(null); // pesan yang sedang diedit (null = pesan baru)
  const [toast, setToast] = useState({
    open: false,
    type: TOAST_TYPE.SUCCESS,
    message: "",
  });
  const hasPinged = useRef(false);
  const offlineShown = useRef(false);

  const reveal = useCallback(() => setRevealed(true), []);

  const selected =
    activeIndex !== null ? (messages[activeIndex] ?? null) : null;
  const number = activeIndex !== null ? page * PAGE_SIZE + activeIndex + 1 : 0;
  const hasPrevious = activeIndex !== null && activeIndex > 0;
  const hasNext = activeIndex !== null && activeIndex < messages.length - 1;

  const showToast = useCallback((type, message) => {
    setToast({ open: true, type, message });
  }, []);

  function closeToast() {
    setToast((x) => ({ ...x, open: false }));
  }

  // Ambil satu halaman pesan: live -> cache -> pesan awalan
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await fetchMessagesPage(page + 1);
      if (cancelled) return;
      setMessages(result.messages);
      setTotal(result.total);
      setTotalPages(result.totalPages);
      if (result.source === "live" || result.source === "empty") {
        offlineShown.current = false;
      } else if (!offlineShown.current) {
        offlineShown.current = true;
        showToast(TOAST_TYPE.WARNING, t.toast.offline);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page, reloadKey, showToast]);

  // Isyarat sekali setelah pohon terungkap: amplop terbaru berdenyut beberapa detik
  useEffect(() => {
    if (!revealed || hasPinged.current || messages.length === 0) return;
    hasPinged.current = true;
    setPingId(messages[0].id);
    const timer = setTimeout(() => setPingId(null), 5000);
    return () => clearTimeout(timer);
  }, [revealed, messages]);

  // Tanda "Baru" hilang sendiri
  useEffect(() => {
    if (!newId) return;
    const timer = setTimeout(() => setNewId(null), 5000);
    return () => clearTimeout(timer);
  }, [newId]);

  const navigate = useCallback(
    (delta) => {
      setDirection(delta);
      setActiveIndex((i) => {
        if (i === null) return i;
        const next = i + delta;
        return next < 0 || next >= messages.length ? i : next;
      });
    },
    [messages.length],
  );

  // Panah kiri/kanan untuk pindah pesan, Esc untuk menutup
  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight") navigate(1);
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "Escape") setActiveIndex(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, navigate]);

  function changePage(next) {
    setActiveIndex(null);
    setPage(next);
  }

  // Dukungan bisa dibatalkan: POST memberi dukungan, DELETE membatalkannya
  async function like(id) {
    if (String(id).startsWith(FALLBACK_ID_PREFIX)) {
      showToast(TOAST_TYPE.WARNING, t.toast.likeUnavailable);
      return;
    }
    const token = await ensureAnonymousSession();
    if (!token) {
      showToast(TOAST_TYPE.ERROR, t.toast.likeFailed);
      return;
    }

    const wasLiked = messages.find((m) => m.id === id)?.liked;
    const apply = (liked, delta) =>
      setMessages((list) =>
        list.map((m) =>
          m.id === id
            ? { ...m, liked, supportCount: m.supportCount + delta }
            : m,
        ),
      );

    apply(!wasLiked, wasLiked ? -1 : 1); // update optimistis
    try {
      const res = await fetch(`${API_URL}/${id}/reaction`, {
        method: wasLiked ? "DELETE" : "POST",
        headers: { "x-session-token": token },
      });
      if (!res.ok) throw new Error("bad response");
      const json = await res.json();
      setMessages((list) =>
        list.map((m) =>
          m.id === id
            ? { ...m, liked: json.liked, supportCount: json.supportCount }
            : m,
        ),
      );
    } catch {
      apply(!!wasLiked, wasLiked ? 1 : -1);
      showToast(TOAST_TYPE.ERROR, t.toast.likeFailed);
    }
  }

  // Membuat pesan baru, atau mengubah pesan kalau `editing` terisi.
  // Mengembalikan true jika berhasil.
  async function submit({ text, role, location }) {
    const token = await ensureAnonymousSession();
    if (!token) {
      showToast(TOAST_TYPE.ERROR, t.toast.sendFailed);
      return false; // form tetap terbuka, tulisan pengguna tidak hilang
    }

    const isEdit = editing !== null;
    try {
      const res = await fetch(isEdit ? `${API_URL}/${editing.id}` : API_URL, {
        method: isEdit ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-token": token,
        },
        body: JSON.stringify({ content: text, role, location }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          [400, 403].includes(res.status) ? json.error : t.toast.sendFailed,
        );
      }

      if (!isEdit) {
        setNewId(json.id);
        setPage(0);
      }
      setReloadKey((n) => n + 1);
      setIsFormOpen(false);
      setEditing(null);
      setActiveIndex(null);

      const deadline = json.editableUntil
        ? ` ${editDeadlineText(json.editableUntil)}`
        : "";
      showToast(
        TOAST_TYPE.SUCCESS,
        isEdit
          ? `Pesanmu berhasil diubah.${deadline}`
          : `${t.toast.success}${deadline}`,
      );
      return true;
    } catch (err) {
      showToast(
        TOAST_TYPE.ERROR,
        err instanceof TypeError
          ? t.toast.sendFailed
          : err.message || t.toast.sendFailed,
      );
      return false;
    }
  }

  return {
    revealed,
    reveal,
    messages,
    total,
    totalPages,
    page,
    changePage,
    selected,
    number,
    direction,
    hasPrevious,
    hasNext,
    openMessage: setActiveIndex,
    closeMessage: () => setActiveIndex(null),
    navigate,
    newId,
    pingId,
    like,
    submit,
    isFormOpen,
    editing,
    openForm: () => {
      setEditing(null);
      setIsFormOpen(true);
    },
    startEdit: (m) => {
      setEditing(m);
      setActiveIndex(null);
      setIsFormOpen(true);
    },
    closeForm: () => {
      setIsFormOpen(false);
      setEditing(null);
    },
    warnEmpty: () => showToast(TOAST_TYPE.WARNING, t.toast.empty),
    toast,
    closeToast,
  };
}
