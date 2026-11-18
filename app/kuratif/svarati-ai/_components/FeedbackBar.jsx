import { useState } from "react";
import { Check, Copy, Download, ThumbsDown, ThumbsUp } from "lucide-react";
import { KURATIF } from "@/content/labels";
import { MODE_FEEDBACK, MAX_REASON_LENGTH } from "../_lib/constants";

const fb = KURATIF.ai.feedback;

// Tooltip sederhana di atas ikon; muncul saat hover atau saat tombol difokus lewat keyboard.
function Tip({ label, children }) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-svarati-teal px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {label}
      </span>
    </span>
  );
}

// Baris aksi di dalam bubble bot: children (badge rujukan) di kiri, aksi di kanan.
// Aksi: jempol atas/bawah (hanya jika jawaban tersimpan), salin, dan unduh sebagai .txt.
// Setelah jempol bawah, pengguna boleh (opsional) memilih alasan di bawah baris ini.
export default function FeedbackBar({ msg, onSelect, onReason, children }) {
  const [step, setStep] = useState("initial"); // initial | other | sent | closed
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [copied, setCopied] = useState(false);

  const bisaNilai = Boolean(msg.serverId && MODE_FEEDBACK.has(msg.mode));
  const showReason = bisaNilai && msg.feedback === false && step !== "closed";

  function select(value) {
    setStep("initial");
    setText("");
    onSelect(msg, value);
  }

  async function submit(code, reasonText) {
    setIsSending(true);
    await onReason?.(msg, code, reasonText);
    setIsSending(false);
    setStep("sent");
  }

  function selectReason(code) {
    if (code === "lainnya") {
      setStep("other");
      return;
    }
    submit(code, null);
  }

  async function salin() {
    try {
      await navigator.clipboard.writeText(msg.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard tidak tersedia di browser ini: tidak ada yang perlu ditampilkan.
    }
  }

  function unduh() {
    const url = URL.createObjectURL(new Blob([msg.text], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "jawaban-svarati.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  const renderButton = (value, Icon, label) => (
    <button
      type="button"
      onClick={() => select(value)}
      aria-pressed={msg.feedback === value}
      aria-label={label}
      className={`rounded-full border p-1 ${
        msg.feedback === value
          ? "border-svarati-teal bg-svarati-teal-soft text-svarati-teal"
          : "border-svarati-lavender-light text-svarati-lavender-dark hover:bg-svarati-lavender-light/40"
      }`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
    </button>
  );

  const iconBtn = "rounded-full border border-svarati-lavender-light p-1 text-svarati-lavender-dark hover:bg-svarati-lavender-light/40";

  const baris = (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-col items-start gap-1.5 sm:flex-row sm:flex-wrap">{children}</div>
      <div className="ml-auto flex shrink-0 items-center gap-1">
        {bisaNilai && <Tip label="Suka">{renderButton(true, ThumbsUp, "Jawaban membantu")}</Tip>}
        {bisaNilai && <Tip label="Tidak suka">{renderButton(false, ThumbsDown, "Jawaban kurang membantu")}</Tip>}
        <Tip label={copied ? "Tersalin" : "Salin"}>
          <button type="button" onClick={salin} aria-label={copied ? "Tersalin" : "Salin jawaban"} className={iconBtn}>
            {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
          </button>
        </Tip>
        <Tip label="Unduh">
          <button type="button" onClick={unduh} aria-label="Unduh jawaban" className={iconBtn}>
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </Tip>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-2">
      {baris}

      {showReason && step === "initial" && (
        <div className="flex flex-col gap-2" role="group" aria-label={fb.group}>
          <p className="text-xs text-svarati-lavender-dark">{fb.question}</p>
          <div className="flex flex-wrap gap-2">
            {fb.options.map((option) => (
              <button
                key={option.code}
                type="button"
                disabled={isSending}
                onClick={() => selectReason(option.code)}
                className="rounded-full border border-svarati-lavender-light bg-white px-3 py-1 text-xs font-semibold text-svarati-teal hover:bg-svarati-lavender-light/40 disabled:opacity-50"
              >
                {option.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setStep("closed")}
              className="rounded-full px-3 py-1 text-xs text-svarati-lavender-dark underline underline-offset-2"
            >
              {fb.skip}
            </button>
          </div>
        </div>
      )}

      {showReason && step === "other" && (
        <div className="flex flex-col gap-2">
          <label htmlFor={`alasan-${msg.id}`} className="text-xs text-svarati-lavender-dark">
            {fb.otherHint(MAX_REASON_LENGTH)}
          </label>
          <textarea
            id={`alasan-${msg.id}`}
            rows={2}
            maxLength={MAX_REASON_LENGTH}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full resize-none rounded-xl border border-svarati-lavender-light px-3 py-2 text-sm text-svarati-teal"
          />
          <div className="flex gap-2">
            <button
              type="button"
              disabled={isSending}
              onClick={() => submit("lainnya", text.trim() || null)}
              className="rounded-full bg-svarati-teal px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
            >
              {fb.send}
            </button>
            <button
              type="button"
              onClick={() => setStep("closed")}
              className="rounded-full px-3 py-1.5 text-xs text-svarati-lavender-dark underline underline-offset-2"
            >
              {fb.skip}
            </button>
          </div>
        </div>
      )}

      {showReason && step === "sent" && (
        <p role="status" className="text-xs text-svarati-teal">
          {fb.thanks}
        </p>
      )}
    </div>
  );
}