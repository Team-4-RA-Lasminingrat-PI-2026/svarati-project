import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva } from "class-variance-authority";
import { cn } from "cn"

const buttonVariants = cva(
  // Base styling bawaan tetap dipertahankan untuk aksesibilitas dan animasi klik/fokus
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // TODO: Nanti ubah hex ini ke variabel warna Tailwind dari Kak Lisa (RLA004) kalau sudah di-merge
        primary: "bg-[#FFDAB9] text-gray-900 hover:bg-[#ffcba0]", // Peach
        secondary: "bg-green-800 text-white hover:bg-green-900", // Hijau Tua
        outline: "border-white bg-transparent text-white hover:bg-white/10", // Garis Putih
        exit: "bg-orange-500 text-white hover:bg-orange-600", // Oranye
        ghost: "border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100", // Garis Tipis
      },
      size: {
        // Size disesuaikan dengan spek RLA005 (sm, md, lg)
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem]",
        md: "h-9 gap-1.5 px-3",
        lg: "h-11 gap-1.5 px-5 text-base",
      },
      fullWidth: {
        true: "w-full",
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

function Button({
  className,
  variant = "primary",
  size = "md",
  icon = null,
  iconPosition = "left",
  fullWidth = false,
  children,
  ...props
}) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, fullWidth, className }))}
      {...props}
    >
      {/* Logika untuk merender Icon di Kiri */}
      {icon && iconPosition === 'left' && (
        <span className="mr-1.5 flex items-center">{icon}</span>
      )}

      {children}

      {/* Logika untuk merender Icon di Kanan */}
      {icon && iconPosition === 'right' && (
        <span className="ml-1.5 flex items-center">{icon}</span>
      )}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }