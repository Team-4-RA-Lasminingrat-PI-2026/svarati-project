import { Button } from "@/components/ui/button";

// Chip saran hanya ditampilkan sebelum pesan pertama (diatur di page.js)
export default function ChatSuggestions({ chips, disabled, typing, onSelect }) {
  return (
    <div
      className={`mb-3 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible ${
        disabled ? "opacity-50" : ""
      }`}
    >
      {chips.map((chip) => (
        <Button
          key={chip.key}
          variant="ghost"
          size="lg"
          className="shrink-0 border-svarati-lavender-light bg-white text-sm text-svarati-teal hover:bg-svarati-lavender-light/40"
          disabled={typing || disabled}
          onClick={() => onSelect(chip.label)}
        >
          {chip.label}
        </Button>
      ))}
    </div>
  );
}