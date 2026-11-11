// Amplop memakai currentColor untuk isi, garis putih untuk tutup dan tepi (agar terpisah dari daun).
export function EnvelopeIcon({ className = "block h-auto w-full" }) {
  return (
    <svg viewBox="0 0 80 56" className={className} aria-hidden="true">
      <rect x="1" y="1" width="78" height="54" rx="7" fill="currentColor" stroke="white" strokeWidth="2" />
      <path
        d="M6 10 L40 35 L74 10"
        fill="none"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeartIcon({ filled = false, className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 21s-7.5-4.6-9.5-9.2C1.2 8.6 3 5.5 6.1 5.5c1.8 0 3.2 1 3.9 2.2.7-1.2 2.1-2.2 3.9-2.2 3.1 0 4.9 3.1 3.6 6.3C19.5 16.4 12 21 12 21z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronLeftIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}

export function ChevronDownIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 9l7 7 7-7" />
    </svg>
  );
}
