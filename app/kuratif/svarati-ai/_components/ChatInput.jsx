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
            className="block field-sizing-content overflow-hidden min-h-11 resize-none rounded-2xl px-4 py-3 text-sm leading-5 placeholder:text-svarati-lavender-dark/80"
          />
        </div>
        <Button
          type="submit"
          variant="secondary"
          size="lg"
          className="relative h-11 w-11 shrink-0 items-center justify-center rounded-full bg-svarati-teal p-0 text-white hover:bg-svarati-teal-light disabled:bg-svarati-teal disabled:opacity-40 sm:w-auto sm:px-5"
          icon={
            <Send
              aria-hidden="true"
              className="max-sm:absolute max-sm:inset-0 max-sm:m-auto max-sm:!size-6 max-sm:-translate-x-px max-sm:translate-y-px sm:-translate-x-0.5 sm:translate-y-0.5"
            />
          }
          iconPosition="right"
          disabled={!value.trim() || typing || disabled}
        >
          <span className="sr-only sm:not-sr-only">{sendLabel}</span>
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