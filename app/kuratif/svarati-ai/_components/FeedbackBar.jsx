import { useState } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { KURATIF } from "@/content/labels";
import { MODE_FEEDBACK, MAX_REASON_LENGTH } from "../_lib/constants";

const fb = KURATIF.ai.feedback;

// Jempol atas/bawah. Setelah jempol bawah, pengguna boleh (opsional) memilih alasan.
// Alasan tidak wajib dan tidak menghalangi penilaian yang sudah tersimpan.
export default function FeedbackBar({ msg, onSelect, onReason }) {
  const [step, setStep] = useState("initial"); // initial | other | sent | closed
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);

  if (!msg.serverId || !MODE_FEEDBACK.has(msg.mode)) return null;

  const showReason = msg.feedback === false && step !== "closed";

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

  const renderButton = (value, Icon, label) => (
    <button
      type="button"
      onClick={() => select(value)}
      aria-pressed={msg.feedback === value}
      aria-label={label}
      className={`rounded-full border p-1.5 ${
        msg.feedback === value
          ? "border-svarati-teal bg-svarati-teal-soft text-svarati-teal"
          : "border-svarati-lavender-light text-svarati-lavender-dark hover:bg-svarati-lavender-light/40"
      }`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-xs text-svarati-lavender-dark">Jawaban ini membantu?</span>
        {renderButton(true, ThumbsUp, "Jawaban membantu")}
        {renderButton(false, ThumbsDown, "Jawaban kurang membantu")}
      </div>

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