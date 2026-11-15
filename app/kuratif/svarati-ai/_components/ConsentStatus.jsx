import { Button } from "@/components/ui/button";
import ConsentBox, { TEXT_CONSENT } from "./ConsentBox";
import { formatDate } from "../_lib/chat";

export default function ConsentStatus({
  consentReady,
  showConsent,
  consent,
  hasUnsaved,
  expiresAt,
  onConsentChange,
  onSaveChat,
  onEdit,
}) {
  return (
    <>
      {consentReady && !showConsent && consent !== true && hasUnsaved && (
        <p role="status" className="mb-2 text-xs text-svarati-coral-dark">
          Chat ini belum disimpan dan akan hilang jika kamu keluar atau memuat ulang halaman.{" "}
          <Button
            variant="ghost"
            size="sm"
            onClick={onSaveChat}
            className="h-auto border-0 bg-transparent px-0 text-xs font-semibold text-svarati-coral-dark underline underline-offset-2 hover:bg-transparent"
          >
            Simpan chat ini
          </Button>
        </p>
      )}

      {!consentReady ? null : showConsent ? (
        <div className="mb-3">
          <ConsentBox value={consent} onChange={onConsentChange} />
        </div>
      ) : (
        <p className="mb-2 text-xs text-svarati-teal">
          {consent
            ? expiresAt
              ? `Percakapan tersimpan sampai ${formatDate(expiresAt)}. `
              : "Percakapan disimpan untuk memperbaiki layanan. "
            : `${TEXT_CONSENT.declinedSummary} `}
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="h-auto border-0 bg-transparent px-0 text-xs font-semibold text-svarati-teal underline underline-offset-2 hover:bg-transparent"
          >
            {TEXT_CONSENT.change}
          </Button>
        </p>
      )}
    </>
  );
}