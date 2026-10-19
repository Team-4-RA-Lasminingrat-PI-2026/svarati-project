"use client";

import React from 'react';

export default function ToggleSwitch({
    checked = false,
    onChange,
    disabled = false,
    className = "",
    ...props
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            // Memanggil fungsi onChange dan mengirimkan nilai kebalikannya (!checked) saat diklik
            onClick={() => onChange && onChange(!checked)}
            className={`
        relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-svarati-teal focus-visible:ring-offset-2
        ${checked ? 'bg-svarati-teal' : 'bg-svarati-lavender-border'}
        ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
        ${className}
      `}
            {...props}
        >
            <span className="sr-only">Toggle switch</span>

            {/* Lingkaran putih yang bergerak (thumb) */}
            <span
                aria-hidden="true"
                className={`
          pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
          ${checked ? 'translate-x-5' : 'translate-x-0'}
        `}
            />
        </button>
    );
}