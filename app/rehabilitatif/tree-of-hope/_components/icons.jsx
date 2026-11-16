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
