"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/Card";
import { Button, buttonVariants } from "@/components/ui/button";

// Ikon padat buatan sendiri untuk tiap indra.
// Warnanya ikut text-* dari pemanggil; bagian putih sengaja putih,
// bukan lubang, karena ditaruh di atas lingkaran berwarna muda.
function IkonLihat({ className }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
            <circle cx="10.5" cy="10.5" r="5.6" stroke="currentColor" strokeWidth="2.6" />
            <path d="M14.9 14.9 20 20" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
        </svg>
    );
}

function IkonSentuh({ className }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
            <path d="M5 13.2a1.5 1.5 0 0 1 2.2-2.1l2 2" stroke="currentColor" strokeWidth="2.9" strokeLinecap="round" />
            <rect x="6.3" y="6.4" width="2.6" height="7" rx="1.3" fill="currentColor" />
            <rect x="9.4" y="3.6" width="2.6" height="9.8" rx="1.3" fill="currentColor" />
            <rect x="12.5" y="2.9" width="2.6" height="10.5" rx="1.3" fill="currentColor" />
            <rect x="15.6" y="4.6" width="2.6" height="8.8" rx="1.3" fill="currentColor" />
            <path d="M6.3 11.8h11.9v5.1a4.6 4.6 0 0 1-4.6 4.6h-2.7a4.6 4.6 0 0 1-4.6-4.6z" fill="currentColor" />
        </svg>
    );
}

function IkonDengar({ className }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
            <path d="M4 9.4h2.7L11.6 5v14l-4.9-4.4H4a1.2 1.2 0 0 1-1.2-1.2v-2.8A1.2 1.2 0 0 1 4 9.4z" fill="currentColor" />
            <path d="M14.8 9.3a4 4 0 0 1 0 5.4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M17.7 6.7a8 8 0 0 1 0 10.6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
    );
}

function IkonCium({ className }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
            <circle cx="12" cy="5.4" r="3.2" fill="currentColor" />
            <circle cx="7.9" cy="8.7" r="3.2" fill="currentColor" />
            <circle cx="16.1" cy="8.7" r="3.2" fill="currentColor" />
            <circle cx="9.5" cy="12.9" r="3.2" fill="currentColor" />
            <circle cx="14.5" cy="12.9" r="3.2" fill="currentColor" />
            <circle cx="12" cy="9.7" r="2" fill="#fff" />
            <path d="M12 13.4V21" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
        </svg>
    );
}

function IkonCecap({ className }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
            <path d="M5.5 4.6h13l-1.5 13.9a3.1 3.1 0 0 1-3.1 2.8h-3.8a3.1 3.1 0 0 1-3.1-2.8z" fill="currentColor" />
            <path d="M6.9 9.1c1.6-1.2 3.3 1.2 5 0s3.3 1.2 5 0" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" />
        </svg>
    );
}

const STEPS = [
    {
        count: 5,
        title: "Lihat 5 benda",
        hint: "Perhatikan sekelilingmu. Temukan 5 benda yang bisa kamu lihat, lalu perhatikan warna dan bentuknya.",
        Icon: IkonLihat,
    },
    {
        count: 4,
        title: "Sentuh 4 benda",
        hint: "Sentuh 4 benda di dekatmu. Rasakan teksturnya: halus, kasar, dingin, atau hangat.",
        Icon: IkonSentuh,
    },
    {
        count: 3,
        title: "Dengar 3 suara",
        hint: "Diamlah sejenak dan dengarkan. Temukan 3 suara, entah yang dekat atau yang jauh.",
        Icon: IkonDengar,
    },
    {
        count: 2,
        title: "Cium 2 aroma",
        hint: "Cari 2 aroma di sekitarmu. Kalau sulit, ingat 2 aroma yang kamu sukai.",
        Icon: IkonCium,
    },
    {
        count: 1,
        title: "Rasakan 1 hal untuk dicecap",
        hint: "Rasakan 1 sensasi di mulutmu, atau minum seteguk air perlahan.",
        Icon: IkonCecap,
    },
];

export default function GroundingPage() {
    // stage: -1 = intro, 0..4 = langkah, 5 = selesai
    const [stage, setStage] = useState(-1);
    const [marked, setMarked] = useState(0);

    const goTo = (next) => {
        setStage(next);
        setMarked(0);
    };

    const step = stage >= 0 && stage < STEPS.length ? STEPS[stage] : null;

    return (
        <main
            className="min-h-screen bg-svarati-cream px-4 pb-8 md:px-8 lg:px-12 font-sans"
            style={{ paddingTop: "6rem" }}
        >
            {/* Jarak dirapatkan supaya satu langkah muat dalam satu layar
                dan tombol Lanjut tidak perlu digulir */}
            <div className="mx-auto max-w-4xl space-y-5">
                <div>
                <Link
                    href="/rehabilitatif/training"
                    aria-label="Kembali ke Semua latihan"
                    className="group mb-6 inline-flex items-center gap-1.5 rounded text-sm font-semibold text-svarati-teal hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-svarati-teal"
                >
                    <ArrowLeft
                        className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
                        aria-hidden="true"
                    />
                    Semua latihan
                </Link>
                    <h1 className="mb-2 text-balance font-heading text-3xl font-bold text-svarati-teal">
                        Grounding <span className="whitespace-nowrap">5-4-3-2-1</span>
                    </h1>
                    <p className="text-svarati-teal/80 leading-relaxed max-w-2xl">
                        Membantumu mengendalikan panik atau kecemasan dengan mengalihkan fokus ke
                        apa yang ada di sekitarmu sekarang.
                    </p>
                </div>

                <Card
                    variant="white"
                    size="md"
                    className="mx-auto flex min-h-[21rem] max-w-2xl flex-col items-center justify-center text-center"
                >
                    {/* Intro */}
                    {stage === -1 && (
                        <div className="flex flex-col items-center">
                            <CardTitle className="mb-2 text-xl">Duduk dan pijakkan kaki</CardTitle>
                            <CardDescription className="mx-auto mb-5 max-w-md">
                                Duduklah dengan nyaman, pijakkan kedua kaki ke lantai, lalu tarik napas
                                perlahan. Kita akan melewati 5 langkah singkat, tanpa terburu-buru.
                            </CardDescription>
                            <Button variant="secondary" size="lg" onClick={() => goTo(0)}>
                                Mulai
                            </Button>
                        </div>
                    )}

                    {/* Langkah */}
                    {step && (
                        <div className="flex w-full flex-col items-center">
                            {/* Progres */}
                            <div className="mb-5 flex gap-2" aria-label={`Langkah ${stage + 1} dari ${STEPS.length}`}>
                                {STEPS.map((_, i) => (
                                    <span
                                        key={i}
                                        className={`h-2 w-8 rounded-full ${i <= stage ? "bg-svarati-teal" : "bg-gray-200"}`}
                                    />
                                ))}
                            </div>

                            <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-svarati-teal/10 text-svarati-teal">
                                <step.Icon className="size-7" />
                            </div>
                            <CardTitle className="mb-2 text-xl">{step.title}</CardTitle>
                            <CardDescription className="mx-auto mb-5 max-w-md">
                                {step.hint}
                            </CardDescription>

                            {/* Tap tiap kali menemukan satu */}
                            <div className="mb-2 flex flex-wrap justify-center gap-2.5">
                                {Array.from({ length: step.count }, (_, i) => {
                                    const done = i < marked;
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => setMarked(i < marked ? i : i + 1)}
                                            aria-pressed={done}
                                            aria-label={`Tandai ke-${i + 1}`}
                                            className={`flex size-11 items-center justify-center rounded-full border-2 font-bold transition-colors ${done
                                                ? "border-svarati-teal bg-svarati-teal text-white"
                                                : "border-svarati-teal/40 text-svarati-teal hover:bg-svarati-teal/10"
                                                }`}
                                        >
                                            {done ? <Check className="size-5" /> : i + 1}
                                        </button>
                                    );
                                })}
                            </div>
                            <CardDescription className="mb-5 text-xs">
                                Ketuk lingkaran setiap kali kamu menemukannya ({marked}/{step.count})
                            </CardDescription>

                            <div className="flex gap-3">
                                <Button variant="ghost" size="lg" onClick={() => goTo(stage - 1)}>
                                    Kembali
                                </Button>
                                <Button variant="secondary" size="lg" onClick={() => goTo(stage + 1)}>
                                    {stage === STEPS.length - 1 ? "Selesai" : "Lanjut"}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Selesai */}
                    {stage === STEPS.length && (
                        <div className="flex w-full flex-col items-center">
                            <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-svarati-teal/10 text-svarati-teal">
                                <Check className="size-7" />
                            </div>
                            <CardTitle className="mb-2 text-xl">Kamu sudah melewati semuanya</CardTitle>
                            <CardDescription className="mx-auto mb-5 max-w-md">
                                Tarik napas pelan sekali lagi. Kamu berada di sini, di saat ini, dan kamu
                                aman untuk beristirahat sejenak.
                            </CardDescription>
                            <div className="flex w-full max-w-sm flex-col gap-3">
                                <Link
                                    href="/rehabilitatif/training/breathing"
                                    className={buttonVariants({ variant: "soft", size: "xl", fullWidth: true })}
                                >
                                    Lanjut latihan pernapasan →
                                </Link>
                                <Button variant="ghost" size="lg" onClick={() => goTo(-1)}>
                                    Ulangi dari awal
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </main>
    );
}