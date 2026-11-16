import { ShieldAlert, X } from "lucide-react";
import { KURATIF } from "@/content/labels";
import { Button } from "@/components/ui/button";

const ai = KURATIF.ai;

export default function UrgentAlert({ onOpen, onClose }) {
  return (
    <div
      role="alert"
      className="flex shrink-0 items-center gap-2 border-b border-svarati-danger bg-svarati-danger-soft px-3 py-2 sm:px-4"
    >
      <ShieldAlert className="h-4 w-4 shrink-0 text-svarati-danger" aria-hidden="true" />
      <p className="min-w-0 flex-1 text-xs leading-snug text-svarati-danger">{ai.urgentNotice}</p>
      <Button variant="exit" onClick={onOpen}>
        {KURATIF.common.emergencyLabel}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        aria-label="Tutup pesan darurat"
        className="h-7 w-7 shrink-0 border-0 bg-transparent p-0 text-svarati-danger hover:bg-svarati-danger/10"
        icon={<X className="h-4 w-4" aria-hidden="true" />}
      />
    </div>
  );
}