export default function ProgressBar({ value, max, label }) {
  const persen = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  return (
    <div>
      {label && <p className="text-sm font-medium text-svarati-coral-dark">{label}</p>}
      <div
        className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-svarati-coral/40"
        role="progressbar"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className="h-full rounded-full bg-svarati-teal transition-all duration-300"
          style={{ width: `${persen}%` }}
        />
      </div>
    </div>
  );
}