"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, Hand, Ear, Flower2, Heart, Check } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/Card";
import { Button, buttonVariants } from "@/components/ui/button";

const STEPS = [
    {
        count: 5,
        title: "Lihat 5 benda",
        hint: "Perhatikan sekelilingmu. Temukan 5 benda yang bisa kamu lihat, lalu perhatikan warna dan bentuknya.",
        Icon: Eye,
    },
    {
        count: 4,
        title: "Sentuh 4 benda",
        hint: "Sentuh 4 benda di dekatmu. Rasakan teksturnya: halus, kasar, dingin, atau hangat.",
        Icon: Hand,
    },
    {
        count: 3,
        title: "Dengar 3 suara",
        hint: "Diamlah sejenak dan dengarkan. Temukan 3 suara, entah yang dekat atau yang jauh.",
        Icon: Ear,
    },
    {
        count: 2,
        title: "Cium 2 aroma",
        hint: "Cari 2 aroma di sekitarmu. Kalau sulit, ingat 2 aroma yang kamu sukai.",
        Icon: Flower2,
    },
    {
        count: 1,
        title: "Rasakan 1 hal untuk dicecap",
        hint: "Rasakan 1 sensasi di mulutmu, atau minum seteguk air perlahan.",
        Icon: Heart,
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
                        Grounding 5-4-3-2-1
                    </h1>
                    <p className="text-svarati-teal/80 text-lg leading-relaxed max-w-2xl">
                        Membantumu mengendalikan panik atau kecemasan dengan mengalihkan fokus ke
                        apa yang ada di sekitarmu sekarang.
                    </p>
                </div>

                <Card
                    variant="white"
                    size="lg"
                    className="mx-auto flex min-h-[480px] max-w-2xl flex-col items-center justify-center text-center"
                >
                    {/* Intro */}
                    {stage === -1 && (
                        <div className="flex flex-col items-center">
                            <CardTitle className="mb-3 text-2xl">Duduk dan pijakkan kaki</CardTitle>
                            <CardDescription className="mx-auto mb-8 max-w-md text-base">
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
                            <div className="mb-8 flex gap-2" aria-label={`Langkah ${stage + 1} dari ${STEPS.length}`}>
                                {STEPS.map((_, i) => (
                                    <span
                                        key={i}
                                        className={`h-2 w-8 rounded-full ${i <= stage ? "bg-[#45B2A6]" : "bg-gray-200"}`}
                                    />
                                ))}
                            </div>

                            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-[#45B2A6]/10 text-[#45B2A6]">
                                <step.Icon className="size-8" />
                            </div>
                            <CardTitle className="mb-3 text-2xl">{step.title}</CardTitle>
                            <CardDescription className="mx-auto mb-8 max-w-md text-base">
                                {step.hint}
                            </CardDescription>

                            {/* Tap tiap kali menemukan satu */}
                            <div className="mb-3 flex flex-wrap justify-center gap-3">
                                {Array.from({ length: step.count }, (_, i) => {
                                    const done = i < marked;
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => setMarked(i < marked ? i : i + 1)}
                                            aria-pressed={done}
                                            aria-label={`Tandai ke-${i + 1}`}
                                            className={`flex size-12 items-center justify-center rounded-full border-2 font-bold transition-colors ${done
                                                ? "border-[#45B2A6] bg-[#45B2A6] text-white"
                                                : "border-[#45B2A6]/40 text-[#45B2A6] hover:bg-[#45B2A6]/10"
                                                }`}
                                        >
                                            {done ? <Check className="size-5" /> : i + 1}
                                        </button>
                                    );
                                })}
                            </div>
                            <CardDescription className="mb-8 text-xs">
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
                            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-[#45B2A6]/10 text-[#45B2A6]">
                                <Check className="size-8" />
                            </div>
                            <CardTitle className="mb-3 text-2xl">Kamu sudah melewati semuanya</CardTitle>
                            <CardDescription className="mx-auto mb-8 max-w-md text-base">
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