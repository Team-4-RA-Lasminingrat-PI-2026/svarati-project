"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardDescription } from "@/components/Card";
import { Button, buttonVariants } from "@/components/ui/button";

const TECHNIQUES = {
    box: {
        label: "Box Breathing",
        pattern: "4 - 4 - 4 - 4",
        description: "Tarik, tahan, hembus, tahan, masing-masing 4 detik. Cocok untuk menenangkan pikiran yang berpacu.",
        phases: [
            { text: "Tarik napas perlahan lewat hidung", seconds: 4, scale: 1.7 },
            { text: "Tahan napas...", seconds: 4, scale: 1.7 },
            { text: "Hembuskan perlahan lewat mulut", seconds: 4, scale: 1 },
            { text: "Tahan sebentar sebelum mengulang", seconds: 4, scale: 1 },
        ],
    },
    "478": {
        label: "Teknik 4-7-8",
        pattern: "4 - 7 - 8",
        description: "Tarik 4 detik, tahan 7 detik, hembus 8 detik. Hembusan panjang membantu menurunkan detak jantung.",
        phases: [
            { text: "Tarik napas perlahan lewat hidung", seconds: 4, scale: 1.7 },
            { text: "Tahan napas...", seconds: 7, scale: 1.7 },
            { text: "Hembuskan perlahan lewat mulut", seconds: 8, scale: 1 },
        ],
    },
};

export default function BreathingPage() {
    const [techniqueKey, setTechniqueKey] = useState("box");
    const [running, setRunning] = useState(false);
    const [state, setState] = useState({ phase: 0, left: 0, cycles: 0 });

    const technique = TECHNIQUES[techniqueKey];
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

    const handleStart = () => {
        setState({ phase: 0, left: phases[0].seconds, cycles: 0 });
        setRunning(true);
    };

    const handleStop = () => setRunning(false);

    const scale = current ? current.scale : 1;
    const duration = current ? current.seconds : 0.6;

    return (
        <main
            className="min-h-screen bg-svarati-cream px-4 pb-12 md:px-8 lg:px-12 font-sans"
            style={{ paddingTop: "5rem" }}
        >
            <div className="mx-auto max-w-4xl space-y-8">
                <div>
                    <Link
                        href="/rehabilitatif/training"
                        className={buttonVariants({ variant: "ghost", size: "sm", className: "mb-6" })}
                    >
                        <ArrowLeft className="size-4" /> Semua latihan
                    </Link>
                    <h1 className="text-4xl font-bold text-svarati-teal mb-4 font-heading">
                        Latihan Pernapasan
                    </h1>
                    <p className="text-svarati-teal/80 text-lg leading-relaxed max-w-2xl">
                        Panduan pernapasan interaktif untuk menurunkan ketegangan, menstabilkan
                        detak jantung, dan memberi rasa tenang saat stres.
                    </p>
                </div>

                <Card
                    variant="white"
                    size="lg"
                    className="mx-auto flex min-h-[520px] max-w-2xl flex-col items-center text-center"
                >
                    {/* Pilihan teknik */}
                    <div className="mb-2 flex flex-wrap justify-center gap-2">
                        {Object.entries(TECHNIQUES).map(([key, t]) => (
                            <Button
                                key={key}
                                variant={techniqueKey === key ? "secondary" : "ghost"}
                                size="md"
                                disabled={running}
                                onClick={() => setTechniqueKey(key)}
                            >
                                {t.label} ({t.pattern})
                            </Button>
                        ))}
                    </div>
                    <CardDescription className="mx-auto mb-8 max-w-md">
                        {technique.description}
                    </CardDescription>

                    {/* Instruksi */}
                    <h2
                        aria-live="polite"
                        className="mb-8 min-h-[2.5rem] text-xl font-bold text-svarati-teal sm:text-2xl"
                    >
                        {current ? current.text : "Duduk dengan nyaman, lalu tekan Mulai"}
                    </h2>

                    {/* Lingkaran animasi */}
                    <div className="relative flex size-64 items-center justify-center">
                        <div className="absolute inset-0 rounded-full bg-[#45B2A6]/10" />
                        <div
                            className="absolute size-36 rounded-full bg-[#45B2A6] shadow-lg"
                            style={{
                                transform: `scale(${scale})`,
                                transition: `transform ${duration}s linear`,
                            }}
                        />
                        <div className="relative z-10 text-6xl font-bold text-white drop-shadow-md">
                            {running ? state.left : ""}
                        </div>
                    </div>

                    <p className="mt-6 h-5 text-sm text-svarati-teal/60">
                        {running && state.cycles > 0 ? `${state.cycles} siklus selesai` : ""}
                    </p>

                    <div className="mt-6">
                        {running ? (
                            <Button variant="ghost" size="lg" onClick={handleStop}>
                                Berhenti
                            </Button>
                        ) : (
                            <Button variant="secondary" size="lg" onClick={handleStart}>
                                Mulai Latihan
                            </Button>
                        )}
                    </div>

                    <CardDescription className="mx-auto mt-8 max-w-sm text-xs">
                        Jika kamu merasa pusing atau tidak nyaman, berhenti dan bernapaslah seperti biasa.
                    </CardDescription>
                </Card>
            </div>
        </main>
    );
}