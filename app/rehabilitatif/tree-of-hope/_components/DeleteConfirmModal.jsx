"use client";

import { useState } from "react";
import Modal from "@/components/modals/Modal";
import { Button } from "@/components/ui/button";
import { treeOfHopeContent as t } from "@/content/labels";

export default function DeleteConfirmModal({ message, onConfirm, onCancel }) {
  const [busy, setBusy] = useState(false);

  async function handleConfirm() {
    setBusy(true);
    await onConfirm();
    setBusy(false);
  }

  return (
    <Modal open={Boolean(message)} onClose={onCancel} size="md" bare>
      {message && (
        <div
          role="alertdialog"
          aria-label={t.manage.deleteButton}
          className="flex min-h-0 flex-1 flex-col"
        >
          {/* Bagian atas scroll, footer tetap di bawah (sama seperti MessageFormModal) */}
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-6">
            <h2 className="text-xl font-bold text-svarati-teal">{t.manage.deleteButton}</h2>
            <p className="text-sm text-svarati-lavender-dark">{t.manage.confirmDelete}</p>
            <p className="whitespace-pre-line break-words rounded-xl bg-svarati-lavender-light p-3 text-sm italic text-svarati-lavender-dark">
              “{message.text}”
            </p>
          </div>

          <div className="flex shrink-0 gap-3 border-t border-svarati-lavender-light bg-white px-6 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <Button
              type="button"
              variant="primary"
              size="lg"
              disabled={busy}
              className="rounded-full bg-svarati-danger px-6 font-bold text-white hover:bg-svarati-danger-dark"
              onClick={handleConfirm}
            >
              {busy ? t.manage.deleting : t.manage.confirmYes}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="lg"
              disabled={busy}
              className="rounded-full px-5"
              onClick={onCancel}
            >
              {t.manage.confirmNo}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}