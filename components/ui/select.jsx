import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const SELECT_CLASS =
  "h-11 w-full cursor-pointer appearance-none rounded-lg border border-input bg-card px-4 pr-8 text-sm text-foreground outline-none transition-colors focus-visible:border-svarati-lavender-dark focus-visible:ring-3 focus-visible:ring-svarati-lavender/40 disabled:cursor-not-allowed disabled:opacity-50";

export function Select({ id, label, className, children, ...props }) {
  return (
    <div className="relative">
      <Label htmlFor={id} className="sr-only">
        {label}
      </Label>
      <select id={id} className={cn(SELECT_CLASS, className)} {...props}>
        {children}
      </select>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-svarati-lavender-dark"
      >
        ▾
      </span>
    </div>
  );
}