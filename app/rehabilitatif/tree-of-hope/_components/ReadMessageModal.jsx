"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Modal from "@/components/modals/Modal";
import { Button } from "@/components/ui/button";
import { treeOfHopeContent as t } from "@/content/labels";
import { editDeadlineText } from "@/lib/tree-of-hope/messageWarning";
import LikeButton from "./LikeButton";

const ARROW =
  "flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-svarati-coral-soft text-svarati-coral-dark transition-colors hover:bg-svarati-coral-hover disabled:pointer-events-none disabled:opacity-30";

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
  onDelete,
  onClose,
}) {
  const [confirmId, setConfirmId] = useState(null); // id pesan yang menunggu konfirmasi hapus
  const [deleting, setDeleting] = useState(false);

  // Server tetap memeriksa batas waktu; ini hanya menyembunyikan tombol yang sudah kedaluwarsa.
  const canManage =
    message?.editableUntil && new Date(message.editableUntil) > new Date();
  const confirming = message && confirmId === message.id;

  async function handleDelete() {
    setDeleting(true);
    await onDelete(message.id);
    setDeleting(false);
    setConfirmId(null);
  }

  return (
    <Modal open={Boolean(message)} onClose={onClose} size="md">
      {message && (
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-semibold text-svarati-lavender-dark">
              {t.reader.position(number, total)}
            </p>
            <button
              type="button"
              onClick={onClose}
              aria-label={t.reader.close}
              className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-svarati-coral-light text-svarati-lavender-dark"
            >
              ✕
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate(-1)}
              disabled={!hasPrevious}
              aria-label={t.reader.previous}
              className={ARROW}
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>

            <div
              key={message.id}
              className={`min-w-0 flex-1 animate-in fade-in duration-300 ${
                direction > 0 ? "slide-in-from-right-8" : "slide-in-from-left-8"
              }`}
            >
              <p className="max-h-[50vh] overflow-y-auto whitespace-pre-line break-words text-base italic leading-relaxed text-svarati-coral-dark">
                “{message.text}”
              </p>
              <div className="mt-4 flex items-center justify-between gap-2 text-sm">
                <span className="text-svarati-lavender-dark">
                  {message.author}
                </span>
                <LikeButton
                  liked={message.liked}
                  count={message.supportCount}
                  onClick={() => onLike(message.id)}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate(1)}
              disabled={!hasNext}
              aria-label={t.reader.next}
              className={ARROW}
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </div>

          {canManage && (
            <div className="mt-5 rounded-xl bg-svarati-lavender-light p-3 text-sm text-svarati-lavender-dark">
              <p>{editDeadlineText(message.editableUntil)}</p>

              {!confirming ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    variant="primary"
                    size="lg"
                    className="rounded-full px-5 text-sm"
                    onClick={() => onEdit(message)}
                  >
                    {t.manage.editButton}
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="rounded-full px-5 text-sm text-svarati-danger"
                    onClick={() => setConfirmId(message.id)}
                  >
                    {t.manage.deleteButton}
                  </Button>
                </div>
              ) : (
                <div className="mt-3" role="alert">
                  <p className="font-semibold">{t.manage.confirmDelete}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      variant="primary"
                      size="lg"
                      disabled={deleting}
                      className="rounded-full bg-svarati-danger px-5 text-sm text-white hover:bg-svarati-danger-dark"
                      onClick={handleDelete}
                    >
                      {deleting ? t.manage.deleting : t.manage.confirmYes}
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      disabled={deleting}
                      className="rounded-full px-5 text-sm"
                      onClick={() => setConfirmId(null)}
                    >
                      {t.manage.confirmNo}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
