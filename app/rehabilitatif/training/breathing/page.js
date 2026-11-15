"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Ditulis sebagai larik supaya urutan tampilnya pasti: 4-7-8 lebih dulu.
// "nama" dipakai sebagai label batang kemajuan di bawah lingkaran.
const TECHNIQUES = [
    {
        key: "478",
        label: "Teknik 4-7-8",
        description:
            "Tarik 4 detik, tahan 7, hembus 8. Cocok untuk meredakan cemas dan sebelum tidur.",
        phases: [
            { nama: "Tarik napas", text: "Tarik napas perlahan lewat hidung", seconds: 4, scale: 1.7 },
            { nama: "Tahan", text: "Tahan napas", seconds: 7, scale: 1.7 },
            { nama: "Hembuskan", text: "Hembuskan perlahan lewat mulut", seconds: 8, scale: 1 },
        ],
    },
    {
        key: "box",
        label: "Box Breathing",
        description:
            "Tarik, tahan, hembus, tahan, masing-masing 4 detik. Cocok untuk menenangkan pikiran yang berpacu.",
        phases: [
            { nama: "Tarik napas", text: "Tarik napas perlahan lewat hidung", seconds: 4, scale: 1.7 },
            { nama: "Tahan", text: "Tahan napas", seconds: 4, scale: 1.7 },
            { nama: "Hembuskan", text: "Hembuskan perlahan lewat mulut", seconds: 4, scale: 1 },
            { nama: "Tahan", text: "Tahan sebentar sebelum mengulang", seconds: 4, scale: 1 },
        ],
    },
];

export default function BreathingPage() {
    const [techniqueKey, setTechniqueKey] = useState(TECHNIQUES[0].key);
    const [running, setRunning] = useState(false);
    const [state, setState] = useState({ phase: 0, left: 0, cycles: 0 });

    const technique = TECHNIQUES.find((t) => t.key === techniqueKey);
    const phases = technique.phases;
    const current = running ? phases[state.phase] : null;

    // Timer: hitung mundur tiap detik, pindah fase saat habis
    useEffect(() => {
        if (!running) return;
        const interval = setInterval(() => {
            setState((prev) => {
                if (prev.left > 1) return { ...prev, left: prev.left - 1 };
                const next = (prev.phase + 1) % phases.length;
                return {
                    phase: next,
                    left: phases[next].seconds,
                    cycles: next === 0 ? prev.cycles + 1 : prev.cycles,
                };
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [running, phases]);

    const toggleLatihan = () => {
        if (running) {
            setRunning(false);
            return;
        }
        setState({ phase: 0, left: phases[0].seconds, cycles: 0 });
        setRunning(true);
    };

    const pilihTeknik = (key) => {
        setRunning(false);
        setTechniqueKey(key);
    };

    const scale = current ? current.scale : 1;
    const duration = current ? current.seconds : 0.6;

    return (
        <main className="min-h-screen bg-svarati-cream px-4 pb-8 pt-20 font-sans md:px-8 lg:px-12">
            <Link
                href="/rehabilitatif/training"
                aria-label="Kembali ke Semua latihan"
                className="group mb-4 inline-flex items-center gap-1.5 rounded text-sm font-semibold text-svarati-teal hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-svarati-teal"
            >
                <ArrowLeft
                    className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
                    aria-hidden="true"
                />
                Semua latihan
            </Link>

            {/* Seluruh isi dipusatkan: lingkarannya memang di tengah, jadi
                teks yang rata kiri membuat sisi kiri terasa kosong melompong */}
            <div className="mx-auto flex max-w-xl flex-col items-center text-center">
                <h1 className="mb-2 text-3xl font-semibold leading-[1.18] tracking-tight text-svarati-teal">
                    Latihan Pernapasan
                </h1>
                <p className="text-base leading-relaxed text-svarati-teal/80">
                    Duduk dengan nyaman, lalu ikuti lingkarannya: membesar saat tarik napas,
                    mengecil saat hembus.
                </p>

                {/* Pilihan teknik */}
                <div
                    role="group"
                    aria-label="Pilih teknik pernapasan"
                    className="mt-5 inline-flex gap-1 rounded-full bg-white p-1 shadow-sm"
                >
                    {TECHNIQUES.map((t) => {
                        const aktif = t.key === techniqueKey;
                        return (
                            <button
                                key={t.key}
                                type="button"
                                aria-pressed={aktif}
                                onClick={() => pilihTeknik(t.key)}
                                className={`cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-svarati-teal ${aktif
                                    ? "bg-svarati-teal text-white"
                                    : "text-svarati-teal hover:bg-svarati-teal-soft"
                                    }`}
                            >
                                {t.label}
                            </button>
                        );
                    })}
                </div>

                <p className="mt-3 text-sm leading-relaxed text-svarati-coral-dark">
                    {technique.description}
                </p>

                {/* Lingkaran yang membesar dan mengecil */}
                <div className="mt-5 flex flex-col items-center">
                    <button
                        type="button"
                        onClick={toggleLatihan}
                        aria-label={running ? "Hentikan latihan" : "Mulai latihan"}
                        // Ukuran ikut tinggi layar supaya seluruh halaman tetap
                        // muat satu layar di laptop pendek, tanpa mengecil berlebihan
                        style={{ width: "clamp(10rem, 29vh, 17rem)", height: "clamp(10rem, 29vh, 17rem)" }}
                        className="relative flex cursor-pointer items-center justify-center rounded-full bg-svarati-teal-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-svarati-teal/40"
                    >
                        <span
                            aria-hidden="true"
                            className="absolute rounded-full bg-svarati-teal shadow-lg"
                            style={{
                                width: "56%",
                                height: "56%",
                                transform: `scale(${scale})`,
                                transition: `transform ${duration}s linear`,
                            }}
                        />
                        <span className="relative z-10 font-semibold text-white drop-shadow-sm">
                            {running ? (
                                <span className="text-5xl font-bold tabular-nums">{state.left}</span>
                            ) : (
                                <span className="text-xl">Mulai</span>
                            )}
                        </span>
                    </button>

                    <p className="mt-3 text-sm text-svarati-teal/70">
                        {running ? "Ketuk lingkaran untuk berhenti." : "Ketuk lingkaran untuk mulai."}
                    </p>
                </div>

                {/* Urutan fase. Sengaja tanpa batang yang terisi: bilah yang
                    berlomba penuh terasa mengejar waktu, bukan menenangkan.
                    Fase yang sedang berjalan cukup ditandai dengan warna. */}
                {/* Pemisahnya berupa karakter, bukan jarak CSS, supaya tidak
                    pernah berdempetan kalau satu kelas gagal termuat */}
                <p className="mt-4 text-sm leading-relaxed">
                    {phases.map((p, i) => {
                        const aktif = running && i === state.phase;
                        return (
                            <span key={`${p.nama}-${i}`}>
                                {i > 0 && (
                                    <span aria-hidden="true" className="text-svarati-teal/30">
                                        {"  ·  "}
                                    </span>
                                )}
                                <span
                                    className={
                                        aktif
                                            ? "font-semibold text-svarati-teal"
                                            : "text-svarati-teal/45"
                                    }
                                >
                                    {p.nama} {p.seconds}
                                </span>
                            </span>
                        );
                    })}
                </p>

                {/* Hanya untuk pembaca layar: mengumumkan pergantian fase */}
                <p aria-live="polite" className="sr-only">
                    {current ? `${current.text}, ${state.left} detik` : ""}
                </p>

                <p className="mt-4 text-sm leading-relaxed text-svarati-coral-dark">
                    Kalau pusing atau tidak nyaman, berhenti dan bernapaslah seperti biasa.
                </p>
            </div>
        </main>
    );
}
