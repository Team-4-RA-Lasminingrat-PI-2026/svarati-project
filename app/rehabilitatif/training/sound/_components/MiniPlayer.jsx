"use client";

import { Pause, Play, Volume2, X } from "lucide-react";

/**
 * Bilah pemutar yang menempel di bawah layar, mirip pemutar musik.
 * Muncul begitu satu suara dipilih supaya pengguna tidak perlu menggulir
 * ke atas hanya untuk menjeda atau mengatur volume.
 *
 * Posisi kiri diberi jarak supaya tidak menutupi tombol aksesibilitas
 * yang melayang di pojok kiri bawah.
 */
export default function MiniPlayer({
    sound,
    isPlaying,
    onToggle,
    onClose,
    volume,
    onVolume,
    elapsed,
    total,
    formatTime,
}) {
    const adaTimer = typeof total === "number" && total > 0;
    const persen = adaTimer ? Math.min(100, (elapsed / total) * 100) : 0;

    return (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-svarati-teal-dark bg-svarati-teal text-white shadow-[0_-4px_20px_rgba(0,0,0,0.18)]">
            <div className="mx-auto flex max-w-4xl items-center gap-3 py-3 pl-14 pr-4 md:gap-4 md:pl-20 md:pr-8">
                <button
                    type="button"
                    onClick={onToggle}
                    aria-label={isPlaying ? `Jeda ${sound.label}` : `Putar ${sound.label}`}
                    className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white text-svarati-teal transition hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-svarati-lavender-light"
                >
                    {isPlaying ? <Pause className="size-5" /> : <Play className="size-5" />}
                </button>

                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{sound.label}</p>

                    {adaTimer ? (
                        // Angka waktu di sini hanya pelengkap visual. Hitung mundur
                        // resmi sudah dibacakan oleh kartu timer di atas.
                        <div aria-hidden="true" className="mt-1.5 flex items-center gap-2">
                            <span className="text-xs tabular-nums text-white/80">
                                {formatTime(elapsed)}
                            </span>
                            <span className="h-1 flex-1 overflow-hidden rounded-full bg-white/25">
                                <span
                                    className="block h-full rounded-full bg-svarati-coral transition-[width] duration-1000 ease-linear"
                                    style={{ width: `${persen}%` }}
                                />
                            </span>
                            <span className="text-xs tabular-nums text-white/80">
                                {formatTime(total)}
                            </span>
                        </div>
                    ) : (
                        <p className="truncate text-xs text-white/70">
                            {isPlaying ? "Sedang diputar" : "Dijeda"}
                        </p>
                    )}
                </div>

                <div className="hidden shrink-0 items-center gap-2 sm:flex">
                    <Volume2 className="size-4 text-white/80" aria-hidden="true" />
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={volume}
                        onChange={(e) => onVolume(Number(e.target.value))}
                        aria-label="Volume"
                        aria-valuetext={`${Math.round(volume * 100)} persen`}
                        className="w-24 accent-svarati-coral"
                    />
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Tutup pemutar dan hentikan suara"
                    className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-svarati-lavender-light"
                >
                    <X className="size-4" />
                </button>
            </div>
        </div>
    );
}
