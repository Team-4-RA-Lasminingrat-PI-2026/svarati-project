import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cva } from "class-variance-authority"
import { cn } from "cn"

const inputVariants = cva(
  "w-full min-w-0 rounded-lg border bg-card px-3 text-foreground outline-none transition-colors placeholder:text-svarati-teal-light dark:placeholder:text-foreground/60 focus-visible:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted disabled:text-svarati-teal-light dark:disabled:text-foreground/60 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
  {
    variants: {
      tone: {
        default:
          "border-svarati-teal-light focus-visible:border-svarati-teal focus-visible:ring-svarati-teal/30 dark:border-svarati-lavender dark:focus-visible:border-svarati-cream dark:focus-visible:ring-svarati-cream/30",
        accent:
          "border-svarati-lavender-border focus-visible:border-svarati-lavender-dark focus-visible:ring-svarati-lavender/40 dark:border-svarati-lavender-light dark:focus-visible:border-svarati-lavender-hover dark:focus-visible:ring-svarati-lavender-light/40",
        coral:
          "border-svarati-coral-dark focus-visible:border-svarati-coral-darker focus-visible:ring-svarati-coral/40 dark:border-svarati-coral dark:focus-visible:border-svarati-coral-soft dark:focus-visible:ring-svarati-coral/40",
      },
      size: {
        sm: "h-7 px-2.5 text-base md:text-sm rounded-[min(var(--radius-md),12px)]",
        md: "h-9 px-3 text-base md:text-sm",
        lg: "h-11 px-4 text-base",
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
    },
    defaultVariants: {
      tone: "default",
      size: "md",
      fullWidth: true,
    },
  }
)

function Input({
  className,
  variant = "text",
  tone,
  size,
  fullWidth,
  ...props
}) {
  // Hanya tiga tipe yang diizinkan sesuai tiket RLA015
  const allowedVariants = ["text", "number", "textarea"]
  const safeVariant = allowedVariants.includes(variant) ? variant : "text"

  if (safeVariant === "textarea") {
    return (
      <textarea
        data-slot="input"
        data-variant="textarea"
        className={cn(
          inputVariants({ tone, fullWidth }),
          "h-auto min-h-20 py-2 break-words",
          className
        )}
        {...props}
      />
    )
  }

  return (
    <InputPrimitive
      type={safeVariant}
      data-slot="input"
      data-variant={safeVariant}
      className={cn(inputVariants({ tone, size, fullWidth }), className)}
      {...props}
    />
  )
}

export { Input, inputVariants }