"use client";

import { useEffect, useRef, useState } from "react";
import { Music2, Pause, Play, SkipBack, SkipForward, Timer, Volume2 } from "lucide-react";

/**
 * Pemutar yang menempel di bawah layar.
 * Muncul begitu satu suara dipilih supaya pengguna tidak perlu menggulir
 * ke atas hanya untuk menjeda, mengatur volume, atau mengubah timer.
 */
export default function MiniPlayer({
    sound,
    isPlaying,
    onToggle,
    onPrev,
    onNext,
    volume,
    onVolume,
    timers,
    timerMin,
    onChooseTimer,
    remaining,
    formatTime,
}) {
    const [menuTerbuka, setMenuTerbuka] = useState(false);
    const menuRef = useRef(null);

    // Tutup menu timer saat mengklik di luar atau menekan Esc
    useEffect(() => {
        if (!menuTerbuka) return;

        const klikLuar = (e) => {
            if (!menuRef.current?.contains(e.target)) setMenuTerbuka(false);
        };
        const tekanEsc = (e) => {
            if (e.key === "Escape") setMenuTerbuka(false);
        };

        document.addEventListener("mousedown", klikLuar);
        document.addEventListener("keydown", tekanEsc);
        return () => {
            document.removeEventListener("mousedown", klikLuar);
            document.removeEventListener("keydown", tekanEsc);
        };
    }, [menuTerbuka]);

    const labelTimer = remaining !== null ? formatTime(remaining) : "Timer";

    return (
        <div
            role="region"
            aria-label="Pemutar suara"
            className="fixed bottom-2.5 left-1/2 z-40 flex w-[min(40rem,calc(100%-1.5rem))] -translate-x-1/2 items-center gap-2 rounded-3xl bg-svarati-teal p-2.5 text-white shadow-[0_12px_32px_rgba(15,76,92,0.28)] sm:gap-3 sm:p-3"
        >
            {/* Suara yang sedang diputar */}
            <div className="flex min-w-0 flex-1 items-center gap-3">
                <span
                    aria-hidden="true"
                    className="hidden size-11 shrink-0 place-items-center rounded-xl bg-svarati-teal-light sm:grid"
                >
                    <Music2 className="size-5 text-svarati-lavender-light" />
                </span>
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{sound.label}</p>
                    <p className="truncate text-xs text-white/75">
                        {isPlaying ? "Sedang diputar" : "Dijeda"}
                    </p>
                </div>
            </div>

            {/* Kendali putar */}
            <div className="order-3 flex shrink-0 items-center gap-1 sm:order-none">
                <button
                    type="button"
                    onClick={onPrev}
                    aria-label="Suara sebelumnya"
                    className="hidden size-10 cursor-pointer place-items-center rounded-full transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-svarati-lavender-light sm:grid"
                >
                    <SkipBack className="size-5 fill-current" />
                </button>

                <button
                    type="button"
                    onClick={onToggle}
                    aria-label={isPlaying ? `Jeda ${sound.label}` : `Putar ${sound.label}`}
                    className="grid size-12 cursor-pointer place-items-center rounded-full bg-white text-svarati-teal transition hover:bg-svarati-teal-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-svarati-lavender-light"
                >
                    {isPlaying ? (
                        <Pause className="size-5 fill-current" />
                    ) : (
                        <Play className="size-5 fill-current" />
                    )}
                </button>

                <button
                    type="button"
                    onClick={onNext}
                    aria-label="Suara berikutnya"
                    className="hidden size-10 cursor-pointer place-items-center rounded-full transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-svarati-lavender-light sm:grid"
                >
                    <SkipForward className="size-5 fill-current" />
                </button>
            </div>

            {/* Volume dan timer */}
            <div className="order-2 flex shrink-0 items-center gap-2.5 sm:order-none">
                <label className="hidden items-center gap-2 sm:flex">
                    <Volume2 className="size-4.5 text-white/80" aria-hidden="true" />
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
                </label>

                <div className="relative" ref={menuRef}>
                    <button
                        type="button"
                        onClick={() => setMenuTerbuka((buka) => !buka)}
                        aria-haspopup="true"
                        aria-expanded={menuTerbuka}
                        aria-label={
                            remaining !== null
                                ? `Berhenti otomatis dalam ${formatTime(remaining)}. Ubah timer`
                                : "Atur timer berhenti otomatis"
                        }
                        className="flex h-9 cursor-pointer items-center gap-1.5 rounded-xl border border-white/25 px-3 text-sm font-semibold tabular-nums transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-svarati-lavender-light"
                    >
                        <Timer className="size-4" aria-hidden="true" />
                        <span className={remaining === null ? "hidden sm:inline" : undefined}>
                            {labelTimer}
                        </span>
                    </button>

                    {menuTerbuka && (
                        <div
                            role="menu"
                            className="absolute bottom-[calc(100%+0.875rem)] right-0 min-w-45 rounded-2xl border border-svarati-lavender-light bg-white p-1.5 text-svarati-teal shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
                        >
                            <p className="mx-2.5 my-1.5 text-xs text-svarati-teal/70">
                                Berhenti otomatis setelah
                            </p>
                            {timers.map((t) => (
                                <button
                                    key={t.minutes}
                                    type="button"
                                    role="menuitemradio"
                                    aria-checked={timerMin === t.minutes}
                                    onClick={() => {
                                        onChooseTimer(t.minutes);
                                        setMenuTerbuka(false);
                                    }}
                                    className="flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm transition hover:bg-svarati-cream focus-visible:outline-none focus-visible:bg-svarati-cream"
                                >
                                    {t.label}
                                    {timerMin === t.minutes && (
                                        <span aria-hidden="true" className="font-bold">
                                            ✓
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
