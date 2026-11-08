"use client";

import { AlertDialog } from "@base-ui/react/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";

// Dialog konfirmasi untuk aksi yang tidak bisa dibatalkan (misalnya menghapus data).
// Pakai AlertDialog supaya fokus keyboard terkunci di dialog dan dibacakan screen reader.
export default function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel = "Hapus",
    cancelLabel = "Batal",
    onConfirm,
}) {
    const handleConfirm = () => {
        onConfirm?.();
        onOpenChange(false);
    };

    return (
        <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
            <AlertDialog.Portal>
                <AlertDialog.Backdrop className="fixed inset-0 z-[100] bg-black/50" />
                <AlertDialog.Popup className="fixed left-1/2 top-1/2 z-[101] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-6 text-svarati-teal shadow-xl">
                    <AlertDialog.Title className="text-xl font-bold">{title}</AlertDialog.Title>
                    {description && (
                        <AlertDialog.Description className="mt-2 text-sm leading-relaxed text-svarati-teal/80">
                            {description}
                        </AlertDialog.Description>
                    )}
                    <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <AlertDialog.Close className={buttonVariants({ variant: "ghost", size: "lg" })}>
                            {cancelLabel}
                        </AlertDialog.Close>
                        <Button variant="exit" size="lg" onClick={handleConfirm}>
                            {confirmLabel}
                        </Button>
                    </div>
                </AlertDialog.Popup>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
}
