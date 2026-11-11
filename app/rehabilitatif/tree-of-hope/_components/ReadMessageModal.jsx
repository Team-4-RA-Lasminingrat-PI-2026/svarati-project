"use client";

import { useEffect, useRef } from "react";
import { treeOfHopeContent as t } from "@/content/labels";
import { editDeadlineText } from "@/lib/tree-of-hope/messageWarning";
import LikeButton from "./LikeButton";

export default function ReadMessageModal({
  message,
  number,
  total,
  direction,
  hasPrevious,
  hasNext,
  onNavigate,
  onLike,
  onEdit,
  onClose,
}) {
  const closeRef = useRef(null);
  const isOpen = Boolean(message);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  if (!message) return null;

  // Server tetap memeriksa batas waktu; ini hanya menyembunyikan tombol yang sudah kedaluwarsa.
  const canEdit = message.editableUntil && new Date(message.editableUntil) > new Date();

  const navButton =
    "rounded-full border border-input bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.reader.readFull(message.author)}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90svh] w-full max-w-lg overflow-y-auto rounded-3xl bg-card p-6 text-card-foreground shadow-xl animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{t.reader.position(number, total)}</p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-1 text-sm font-semibold text-muted-foreground hover:bg-accent"
          >
            {t.reader.close}
          </button>
        </div>

        <div
          key={message.id}
          className={`mt-4 animate-in fade-in duration-300 ${
            direction > 0 ? "slide-in-from-right-6" : "slide-in-from-left-6"
          }`}
        >
          <p className="whitespace-pre-line font-heading text-xl leading-relaxed text-card-foreground">
            {message.text}
          </p>
          <p className="mt-4 text-sm font-medium text-muted-foreground">{message.author}</p>
        </div>

        {canEdit && (
          <div className="mt-4 rounded-xl bg-accent p-3 text-sm text-accent-foreground">
            <p>{editDeadlineText(message.editableUntil)}</p>
            <button
              type="button"
              onClick={() => onEdit(message)}
              className="mt-2 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Ubah pesan
            </button>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between gap-2">
          <button
            type="button"
            className={navButton}
            disabled={!hasPrevious}
            onClick={() => onNavigate(-1)}
            aria-label={t.reader.previous}
          >
            ‹
          </button>
          <LikeButton
            liked={message.liked}
            count={message.supportCount}
            onClick={() => onLike(message.id)}
          />
          <button
            type="button"
            className={navButton}
            disabled={!hasNext}
            onClick={() => onNavigate(1)}
            aria-label={t.reader.next}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}