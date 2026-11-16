import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { COUNTER_FROM, MAX_LENGTH } from "../_lib/constants";

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  onKeyDown,
  disabled,
  typing,
  placeholder,
  label,
  sendLabel,
}) {
  return (
    <>
      <form onSubmit={onSubmit} className="flex items-end gap-2">
        <div className="min-w-0 flex-1">
          <Input
            variant="textarea"
            tone="accent"
            rows={1}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={disabled}
            maxLength={MAX_LENGTH}
            placeholder={placeholder}
            aria-label={label}
            className="block field-sizing-content overflow-hidden min-h-0 resize-none rounded-2xl px-4 py-2 text-sm leading-snug placeholder:text-svarati-lavender-dark/80"
          />
        </div>
        <Button
          type="submit"
          variant="secondary"
          size="lg"
          className="h-11 shrink-0 rounded-full bg-svarati-teal px-5 text-white hover:bg-svarati-teal-light disabled:bg-svarati-teal disabled:opacity-40"
          icon={<Send aria-hidden="true" />}
          iconPosition="right"
          disabled={!value.trim() || typing || disabled}
        >
          {sendLabel}
        </Button>
      </form>

      {value.length >= COUNTER_FROM && (
        <p className="mt-2 text-right text-xs text-svarati-coral-dark">
          {value.length}/{MAX_LENGTH}
        </p>
      )}
    </>
  );
}