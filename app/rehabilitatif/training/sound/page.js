"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Pause, Volume2, Timer } from "lucide-react";
import { Card, CardDescription, cardVariants } from "@/components/Card";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// noise: dibuat langsung di browser (tanpa file audio)
// src: file audio di folder public/ (tambahkan sendiri filenya)
const SOUNDS = [
    { id: "white", label: "White Noise", desc: "Desis rata yang menutupi bunyi di sekitar", noise: "white" },
    { id: "pink", label: "Pink Noise", desc: "Lebih lembut, mirip hujan ringan", noise: "pink" },
    { id: "brown", label: "Brown Noise", desc: "Dalam dan hangat, mirip gemuruh jauh", noise: "brown" },
    { id: "alam", label: "Suara Alam", desc: "Hujan, hutan, atau aliran air", src: "/audio/suara-alam.mp3" },
    { id: "instrumen", label: "Instrumen Lembut", desc: "Piano atau musik santai", src: "/audio/instrumen-lembut.mp3" },
];

const TIMERS = [
    { minutes: 0, label: "Tanpa timer" },
    { minutes: 15, label: "15 menit" },
    { minutes: 30, label: "30 menit" },
    { minutes: 60, label: "60 menit" },
];

// Format detik menjadi mm:ss (atau h:mm:ss untuk 1 jam atau lebih)
function formatTime(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const mm = String(m).padStart(2, "0");
    const ss = String(s).padStart(2, "0");
    return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

function createNoiseBuffer(ctx, type) {
    const size = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, size, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    if (type === "white") {
        for (let i = 0; i < size; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
    } else if (type === "pink") {
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < size; i++) {
            const w = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + w * 0.0555179;
            b1 = 0.99332 * b1 + w * 0.0750759;
            b2 = 0.969 * b2 + w * 0.153852;
            b3 = 0.8665 * b3 + w * 0.3104856;
            b4 = 0.55 * b4 + w * 0.5329522;
            b5 = -0.7616 * b5 - w * 0.016898;
            data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
            b6 = w * 0.115926;
        }
    } else {
        // brown
        let last = 0;
        for (let i = 0; i < size; i++) {
            const w = Math.random() * 2 - 1;
            last = (last + 0.02 * w) / 1.02;
            data[i] = last * 3.5;
        }
    }
    return buffer;
}

export default function SoundPage() {
    const [activeId, setActiveId] = useState(null);
    const [volume, setVolume] = useState(0.5);
    const [timerMin, setTimerMin] = useState(0);
    const [remaining, setRemaining] = useState(null); // sisa detik, null = tidak ada timer berjalan
    const [error, setError] = useState("");

    const ctxRef = useRef(null);
    const sourceRef = useRef(null);
    const gainRef = useRef(null);
    const audioRef = useRef(null);

    const isPlaying = activeId !== null;

    const stopSound = useCallback(() => {
        try {
            sourceRef.current?.stop();
            sourceRef.current?.disconnect();
        } catch { }
        sourceRef.current = null;
        gainRef.current = null;
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        setActiveId(null);
    }, []);

    const playSound = (sound) => {
        stopSound();
        setError("");

        if (sound.noise) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!ctxRef.current) ctxRef.current = new AudioCtx();
            const ctx = ctxRef.current;
            ctx.resume?.();

            const source = ctx.createBufferSource();
            source.buffer = createNoiseBuffer(ctx, sound.noise);
            source.loop = true;
            const gain = ctx.createGain();
            gain.gain.value = volume;
            source.connect(gain);
            gain.connect(ctx.destination);
            source.start();

            sourceRef.current = source;
            gainRef.current = gain;
        } else {
            const audio = new Audio(sound.src);
            audio.loop = true;
            audio.volume = volume;
            const fail = () => {
                if (audioRef.current !== audio) return;
                stopSound();
                setError("File audio belum ditemukan. Tambahkan file ke folder public/audio/ sesuai nama di kode.");
            };
            audio.addEventListener("error", fail);
            audio.play().catch(fail);
            audioRef.current = audio;
        }
        setActiveId(sound.id);
    };

    // Volume langsung berubah saat slider digeser
    useEffect(() => {
        if (gainRef.current) gainRef.current.gain.value = volume;
        if (audioRef.current) audioRef.current.volume = volume;
    }, [volume]);

    // Hitung mundur: mulai saat suara diputar dan timer dipilih,
    // mulai ulang kalau pilihan timer diganti, tetap jalan saat ganti suara
    useEffect(() => {
        if (!isPlaying || timerMin === 0) {
            setRemaining(null);
            return;
        }
        const endAt = Date.now() + timerMin * 60 * 1000;
        setRemaining(timerMin * 60);

        const interval = setInterval(() => {
            const left = Math.max(0, Math.round((endAt - Date.now()) / 1000));
            setRemaining(left);
            if (left <= 0) {
                clearInterval(interval);
                stopSound();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isPlaying, timerMin, stopSound]);

    // Bersihkan saat halaman ditutup
    useEffect(() => {
        return () => {
            stopSound();
            ctxRef.current?.close?.();
        };
    }, [stopSound]);

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
                        Suara Terapi
                    </h1>
                    <p className="text-svarati-teal/80 text-lg leading-relaxed max-w-2xl">
                        Pilih suara yang membuatmu nyaman untuk membantu rileks, mengurangi rasa
                        cemas, dan menjaga keseimbangan emosi.
                    </p>
                </div>

                <Card variant="white" size="lg" className="mx-auto max-w-2xl space-y-6">
                    {/* Daftar suara: tombol bergaya card */}
                    <div className="space-y-3">
                        {SOUNDS.map((sound) => {
                            const isActive = activeId === sound.id;
                            return (
                                <button
                                    key={sound.id}
                                    onClick={() => (isActive ? stopSound() : playSound(sound))}
                                    aria-pressed={isActive}
                                    className={cn(
                                        cardVariants({
                                            variant: isActive ? "teal" : "cream",
                                            size: "sm",
                                            interactive: true,
                                        }),
                                        "flex w-full items-center gap-4 text-left"
                                    )}
                                >
                                    <span
                                        className={`flex size-11 shrink-0 items-center justify-center rounded-full ${isActive
                                            ? "bg-svarati-teal text-white"
                                            : "bg-white text-svarati-lavender-dark shadow-sm"
                                            }`}
                                    >
                                        {isActive ? <Pause className="size-5" /> : <Play className="size-5" />}
                                    </span>
                                    <span>
                                        <span className="block font-bold text-svarati-teal">{sound.label}</span>
                                        <span className="block text-sm text-svarati-teal/80">{sound.desc}</span>
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {error && (
                        <Card variant="danger" size="sm" role="alert">
                            <CardDescription className="text-red-700">{error}</CardDescription>
                        </Card>
                    )}

                    {/* Volume */}
                    <div>
                        <label htmlFor="volume" className="mb-2 flex items-center gap-2 text-sm font-bold text-svarati-teal">
                            <Volume2 className="size-4" /> Volume
                        </label>
                        <input
                            id="volume"
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={volume}
                            onChange={(e) => setVolume(Number(e.target.value))}
                            className="w-full accent-svarati-teal"
                        />
                    </div>

                    {/* Timer */}
                    <div>
                        <p className="mb-2 text-sm font-bold text-svarati-teal">Berhenti otomatis</p>
                        <div className="flex flex-wrap gap-2">
                            {TIMERS.map((t) => (
                                <Button
                                    key={t.minutes}
                                    variant={timerMin === t.minutes ? "secondary" : "ghost"}
                                    size="sm"
                                    onClick={() => setTimerMin(t.minutes)}
                                >
                                    {t.label}
                                </Button>
                            ))}
                        </div>

                        {/* Sisa waktu */}
                        {remaining !== null ? (
                            <Card
                                variant="teal"
                                size="sm"
                                role="timer"
                                className="mt-4 flex items-center justify-between gap-3"
                            >
                                <span className="flex items-center gap-2 text-sm font-medium text-svarati-teal">
                                    <Timer className="size-4" /> Berhenti otomatis dalam
                                </span>
                                <span className="text-2xl font-bold tabular-nums text-svarati-teal">
                                    {formatTime(remaining)}
                                </span>
                            </Card>
                        ) : (
                            timerMin > 0 && (
                                <CardDescription className="mt-3 text-xs">
                                    Hitung mundur dimulai saat kamu memutar suara.
                                </CardDescription>
                            )
                        )}
                    </div>
                </Card>
            </div>
        </main>
    );
}