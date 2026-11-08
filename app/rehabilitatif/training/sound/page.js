"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Pause, Volume2, Timer, AlertCircle, CheckCircle2 } from "lucide-react";
import Badge from "@/components/Badge";
import { Card, CardDescription, cardVariants } from "@/components/Card";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Semua suara dibuat langsung di browser (tanpa file audio)
const GROUP_ORDER = ["Noise", "Suara Alam", "Musik & Ambient"];

const SOUNDS = [
    { id: "white", group: "Noise", label: "White Noise", desc: "Desis rata yang menutupi bunyi di sekitar" },
    { id: "pink", group: "Noise", label: "Pink Noise", desc: "Lebih lembut, mirip hujan ringan" },
    { id: "brown", group: "Noise", label: "Brown Noise", desc: "Dalam dan hangat, mirip gemuruh jauh" },
    { id: "hujan", group: "Suara Alam", label: "Hujan", desc: "Rintik hujan yang rata dan menenangkan" },
    { id: "ombak", group: "Suara Alam", label: "Ombak", desc: "Gelombang yang datang dan pergi perlahan" },
    { id: "hutan", group: "Suara Alam", label: "Hutan & Angin", desc: "Angin lembut dengan kicau burung sesekali" },
    { id: "sungai", group: "Suara Alam", label: "Aliran Sungai", desc: "Air yang mengalir pelan di antara bebatuan" },
    { id: "piano", group: "Musik & Ambient", label: "Piano Lembut", desc: "Nada piano pelan yang bergema lembut" },
    { id: "mangkuk", group: "Musik & Ambient", label: "Mangkuk Tibet", desc: "Dentang mangkuk yang panjang dan dalam" },
    { id: "pad", group: "Musik & Ambient", label: "Pad Ambient", desc: "Dengung hangat yang naik turun perlahan" },
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

// ---------- Pembantu untuk membangun suara ----------

// Mencatat semua node/timer supaya bisa dihentikan dengan bersih
function createRig(ctx, getBuffer) {
    const nodes = [];
    const stoppers = [];

    const track = (node) => {
        nodes.push(node);
        return node;
    };

    return {
        track,
        // Noise yang berputar terus (loop)
        noise(type) {
            const s = ctx.createBufferSource();
            s.buffer = getBuffer(type);
            s.loop = true;
            s.start();
            return track(s);
        },
        // Osilator lambat untuk memodulasi parameter (volume, frekuensi filter, dll.)
        lfo(freq, depth, param) {
            const o = ctx.createOscillator();
            o.frequency.value = freq;
            const g = ctx.createGain();
            g.gain.value = depth;
            o.connect(g);
            g.connect(param);
            o.start();
            track(o);
            track(g);
            return o;
        },
        // Jalankan fungsi berulang dengan jeda acak (ms)
        loop(fn, minMs, maxMs) {
            let t;
            let alive = true;
            const tick = () => {
                if (!alive) return;
                fn();
                t = setTimeout(tick, minMs + Math.random() * (maxMs - minMs));
            };
            tick();
            stoppers.push(() => {
                alive = false;
                clearTimeout(t);
            });
        },
        stop() {
            stoppers.forEach((f) => f());
            nodes.forEach((n) => {
                try { n.stop(); } catch { }
                try { n.disconnect(); } catch { }
            });
        },
    };
}

function filter(ctx, r, type, frequency, Q = 0.7) {
    const f = r.track(ctx.createBiquadFilter());
    f.type = type;
    f.frequency.value = frequency;
    f.Q.value = Q;
    return f;
}

function gainNode(ctx, r, value) {
    const g = r.track(ctx.createGain());
    g.gain.value = value;
    return g;
}

// Bunyi pendek (tetesan air, gelembung)
function blip(ctx, dest, f0, f1, level, dur) {
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(f1, t + dur * 0.8);
    g.gain.setValueAtTime(level, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(dest);
    o.start(t);
    o.stop(t + dur + 0.02);
}

// Kicau burung singkat
function chirp(ctx, dest) {
    const t0 = ctx.currentTime;
    const count = 2 + Math.floor(Math.random() * 3);
    const base = 2200 + Math.random() * 1800;
    for (let i = 0; i < count; i++) {
        const t = t0 + i * 0.13;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.setValueAtTime(base, t);
        o.frequency.exponentialRampToValueAtTime(base * (1.2 + Math.random() * 0.3), t + 0.08);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.04, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
        o.connect(g);
        g.connect(dest);
        o.start(t);
        o.stop(t + 0.12);
    }
}

// Gema lembut (seperti ruangan) untuk piano dan mangkuk
function echoBus(ctx, out, r, { time = 0.4, feedback = 0.45, wet = 0.5 } = {}) {
    const input = gainNode(ctx, r, 1);
    const dly = r.track(ctx.createDelay(1.5));
    dly.delayTime.value = time;
    const fb = gainNode(ctx, r, feedback);
    const lp = filter(ctx, r, "lowpass", 2200);
    const w = gainNode(ctx, r, wet);
    input.connect(out);
    input.connect(dly);
    dly.connect(lp);
    lp.connect(fb);
    fb.connect(dly);
    lp.connect(w);
    w.connect(out);
    return input;
}

// Satu nada piano lembut
function pluck(ctx, dest, freq, when = 0) {
    const t = ctx.currentTime + when;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.14, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 3.5);
    g.connect(dest);
    [1, 2, 3].forEach((h, i) => {
        const o = ctx.createOscillator();
        o.type = "sine";
        o.frequency.value = freq * h;
        const hg = ctx.createGain();
        hg.gain.value = [1, 0.35, 0.12][i];
        o.connect(hg);
        hg.connect(g);
        o.start(t);
        o.stop(t + 3.6);
    });
}

// Satu dentang mangkuk Tibet
function bowl(ctx, dest, freq) {
    const t = ctx.currentTime;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.18, t + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 9);
    g.connect(dest);
    [[1, 1], [2.76, 0.45], [5.4, 0.18]].forEach(([ratio, amp]) => {
        [0, 0.6].forEach((detune) => {
            const o = ctx.createOscillator();
            o.type = "sine";
            o.frequency.value = freq * ratio + detune;
            const og = ctx.createGain();
            og.gain.value = amp * 0.5;
            o.connect(og);
            og.connect(g);
            o.start(t);
            o.stop(t + 9.2);
        });
    });
}

const NOTES = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25]; // pentatonik C

const BUILDERS = {
    white: (ctx, out, r) => r.noise("white").connect(out),
    pink: (ctx, out, r) => r.noise("pink").connect(out),
    brown: (ctx, out, r) => r.noise("brown").connect(out),

    hujan: (ctx, out, r) => {
        const hp = filter(ctx, r, "highpass", 900);
        const lp = filter(ctx, r, "lowpass", 9000);
        const g = gainNode(ctx, r, 0.9);
        r.noise("pink").connect(hp);
        hp.connect(lp);
        lp.connect(g);
        g.connect(out);
        r.loop(() => {
            const f = 1500 + Math.random() * 2500;
            blip(ctx, out, f, f * 0.5, 0.05, 0.06);
        }, 150, 450);
    },

    ombak: (ctx, out, r) => {
        // Gemuruh dalam yang naik turun
        const lp = filter(ctx, r, "lowpass", 500);
        const swell = gainNode(ctx, r, 0.5);
        r.noise("brown").connect(lp);
        lp.connect(swell);
        swell.connect(out);
        r.lfo(0.1, 0.35, swell.gain);
        r.lfo(0.1, 300, lp.frequency);
        // Buih di puncak gelombang
        const hp = filter(ctx, r, "highpass", 3000);
        const foam = gainNode(ctx, r, 0.1);
        r.noise("white").connect(hp);
        hp.connect(foam);
        foam.connect(out);
        r.lfo(0.1, 0.08, foam.gain);
    },

    hutan: (ctx, out, r) => {
        const bp = filter(ctx, r, "bandpass", 400, 0.6);
        const g = gainNode(ctx, r, 0.6);
        r.noise("pink").connect(bp);
        bp.connect(g);
        g.connect(out);
        r.lfo(0.07, 0.3, g.gain);
        r.lfo(0.05, 200, bp.frequency);
        r.loop(() => chirp(ctx, out), 2500, 7000);
    },

    sungai: (ctx, out, r) => {
        const bp1 = filter(ctx, r, "bandpass", 900, 0.6);
        const g1 = gainNode(ctx, r, 0.9);
        r.noise("pink").connect(bp1);
        bp1.connect(g1);
        g1.connect(out);

        const bp2 = filter(ctx, r, "bandpass", 2600, 1.2);
        const g2 = gainNode(ctx, r, 0.12);
        r.noise("white").connect(bp2);
        bp2.connect(g2);
        g2.connect(out);
        r.lfo(6, 0.06, g2.gain);

        r.loop(() => {
            const f = 350 + Math.random() * 500;
            blip(ctx, out, f, f * 1.7, 0.035, 0.09);
        }, 90, 300);
    },

    piano: (ctx, out, r) => {
        const bus = echoBus(ctx, out, r, { time: 0.4, feedback: 0.45, wet: 0.5 });
        const pick = () => NOTES[Math.floor(Math.random() * NOTES.length)];
        r.loop(() => {
            pluck(ctx, bus, pick());
            if (Math.random() < 0.3) pluck(ctx, bus, pick(), 0.4);
        }, 1800, 4200);
    },

    mangkuk: (ctx, out, r) => {
        const bus = echoBus(ctx, out, r, { time: 0.5, feedback: 0.5, wet: 0.6 });
        const tones = [196, 220, 261.63, 293.66];
        r.loop(() => {
            bowl(ctx, bus, tones[Math.floor(Math.random() * tones.length)]);
        }, 7000, 11000);
    },

    pad: (ctx, out, r) => {
        const lp = filter(ctx, r, "lowpass", 900);
        const swell = gainNode(ctx, r, 0.1);
        lp.connect(swell);
        swell.connect(out);
        r.lfo(0.05, 0.04, swell.gain);

        const chords = [
            [130.81, 196.0, 261.63, 329.63], // C
            [110.0, 164.81, 220.0, 261.63], // Am
        ];
        const oscs = [];
        chords[0].forEach((f) => {
            [0, 1.2].forEach((detune) => {
                const o = r.track(ctx.createOscillator());
                o.type = "sine";
                o.frequency.value = f + detune;
                const og = gainNode(ctx, r, 0.25);
                o.connect(og);
                og.connect(lp);
                o.start();
                oscs.push({ o, detune });
            });
        });
        let step = 0;
        r.loop(() => {
            const chord = chords[step % 2];
            const t = ctx.currentTime;
            oscs.forEach(({ o, detune }, i) => {
                o.frequency.setTargetAtTime(chord[Math.floor(i / 2)] + detune, t, 2);
            });
            step++;
        }, 12000, 12000);
    },
};

// Lama suara memudar saat dihentikan, supaya tidak berhenti mendadak
const FADE_MS = 1500;

// Pembantu waktu timer (dipanggil dari klik tombol, bukan saat render)
const waktuSekarang = () => Date.now();
const sisaDetik = (endAt) => Math.max(1, Math.ceil((endAt - waktuSekarang()) / 1000));

const PESAN = {
    tidakDidukung:
        "Browsermu belum mendukung pemutar suara ini. Coba buka halaman ini di Chrome, Edge, Firefox, atau Safari versi terbaru.",
    gagalPutar: "Suara tidak bisa diputar. Coba muat ulang halaman, lalu pilih suara lagi.",
    timerSelesai: "Waktu selesai. Suara sudah dihentikan.",
};

export default function SoundPage() {
    const [activeId, setActiveId] = useState(null);
    const [volume, setVolume] = useState(0.5);
    const [timerMin, setTimerMin] = useState(0);
    // Timer berjalan: simpan waktu selesainya. Timer dijeda: simpan sisa detiknya.
    const [endAt, setEndAt] = useState(null);
    const [pausedLeft, setPausedLeft] = useState(null);
    const [now, setNow] = useState(0);
    const [notice, setNotice] = useState("");
    const [error, setError] = useState("");

    const ctxRef = useRef(null);
    const gainRef = useRef(null);
    const stopRef = useRef(null);
    const buffersRef = useRef({});
    const fadingRef = useRef(new Set()); // suara yang sedang memudar

    const isPlaying = activeId !== null;
    const remaining =
        endAt !== null ? Math.max(0, Math.ceil((endAt - now) / 1000)) : pausedLeft;
    const isPaused = !isPlaying && pausedLeft !== null;

    // Hentikan suara yang sedang diputar; fade = memudar pelan dulu
    const stopAudio = useCallback((fade = true) => {
        const stop = stopRef.current;
        const gain = gainRef.current;
        const ctx = ctxRef.current;
        stopRef.current = null;
        gainRef.current = null;
        if (!stop) return;

        const stopNow = () => {
            fadingRef.current.delete(stopNow);
            try { stop(); } catch { }
        };

        if (fade && gain && ctx?.state === "running") {
            try {
                gain.gain.cancelScheduledValues(ctx.currentTime);
                gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
                gain.gain.setTargetAtTime(0, ctx.currentTime, FADE_MS / 4000);
            } catch { }
            fadingRef.current.add(stopNow);
            setTimeout(stopNow, FADE_MS);
        } else {
            stopNow();
        }
    }, []);

    // Mulai hitung mundur dengan sisa waktu tertentu (detik)
    const startCountdown = (seconds) => {
        const t = waktuSekarang();
        setEndAt(t + seconds * 1000);
        setNow(t);
        setPausedLeft(null);
    };

    const playSound = (sound) => {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) {
            setError(PESAN.tidakDidukung);
            return;
        }

        stopAudio(true); // suara sebelumnya memudar, suara baru naik pelan

        let rig = null;
        try {
            if (!ctxRef.current) ctxRef.current = new AudioCtx();
            const ctx = ctxRef.current;
            ctx.resume?.()?.catch?.(() => { });

            const getBuffer = (type) =>
                (buffersRef.current[type] ??= createNoiseBuffer(ctx, type));

            // Volume utama untuk suara ini, naik pelan supaya tidak mengagetkan
            const gain = ctx.createGain();
            gain.gain.value = 0;
            gain.connect(ctx.destination);
            gain.gain.setTargetAtTime(volume, ctx.currentTime, 0.15);

            rig = createRig(ctx, getBuffer);
            BUILDERS[sound.id](ctx, gain, rig);

            stopRef.current = () => {
                rig.stop();
                try { gain.disconnect(); } catch { }
            };
            gainRef.current = gain;
        } catch {
            try { rig?.stop(); } catch { }
            setError(PESAN.gagalPutar);
            return;
        }

        setActiveId(sound.id);
        setError("");
        setNotice("");

        // Timer: ganti suara = lanjut, dijeda = lanjut dari sisa, belum mulai = dari awal
        if (timerMin > 0 && endAt === null) {
            startCountdown(pausedLeft ?? timerMin * 60);
        }
    };

    // Dijeda: suara berhenti dan sisa waktu disimpan
    const pauseSound = () => {
        stopAudio(true);
        setActiveId(null);
        if (endAt !== null) {
            setPausedLeft(sisaDetik(endAt));
            setEndAt(null);
        }
    };

    const chooseTimer = (minutes) => {
        if (minutes === timerMin) return; // klik ulang pilihan yang sama: timer tetap jalan
        setTimerMin(minutes);
        setPausedLeft(null);
        setNotice("");
        // Durasi baru dihitung dari awal; kalau suara belum diputar, mulai saat diputar
        if (minutes > 0 && isPlaying) startCountdown(minutes * 60);
        else setEndAt(null);
    };

    // Volume langsung berubah saat slider digeser
    useEffect(() => {
        if (gainRef.current && ctxRef.current) {
            gainRef.current.gain.setTargetAtTime(volume, ctxRef.current.currentTime, 0.05);
        }
    }, [volume]);

    // Hitung mundur selama timer berjalan; saat habis, suara memudar lalu berhenti
    useEffect(() => {
        if (endAt === null) return;
        const interval = setInterval(() => {
            const t = Date.now();
            setNow(t);
            if (t >= endAt) {
                clearInterval(interval);
                stopAudio(true);
                setActiveId(null);
                setEndAt(null);
                setPausedLeft(null);
                setNotice(PESAN.timerSelesai);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [endAt, stopAudio]);

    // Bersihkan saat halaman ditutup (langsung berhenti, tanpa memudar)
    useEffect(() => {
        const fading = fadingRef.current;
        return () => {
            try { stopRef.current?.(); } catch { }
            stopRef.current = null;
            gainRef.current = null;
            fading.forEach((stop) => stop());
            ctxRef.current?.close?.();
            ctxRef.current = null;
            buffersRef.current = {};
        };
    }, []);

    return (
        // pt-28 / md:pt-36 memberi ruang untuk navbar yang melayang di atas
        <main className="min-h-screen bg-svarati-cream px-4 pb-12 pt-28 font-sans md:px-8 md:pt-36 lg:px-12">
            <div className="mx-auto max-w-4xl space-y-8">
                <div className="max-w-2xl">
                    <Link
                        href="/rehabilitatif/training"
                        className={buttonVariants({ variant: "ghost", size: "sm", className: "mb-6" })}
                    >
                        <ArrowLeft className="size-4" /> Semua latihan
                    </Link>

                    {/* Header: badge + ajakan */}
                    <div>
                        <Badge variant="coral" className="mb-5">
                            Suara Terapi
                        </Badge>
                        <h1 className="mb-5 text-4xl font-bold leading-tight text-svarati-teal font-heading md:text-5xl">
                            Biarkan Suara Menemanimu Menemukan Tenang
                        </h1>
                        <p className="text-lg leading-relaxed text-svarati-coral">
                            Pilih suara yang membuatmu nyaman untuk membantu rileks, mengurangi rasa
                            cemas, dan menjaga keseimbangan emosi.
                        </p>
                    </div>
                </div>

                <Card variant="white" size="lg" className="mx-auto max-w-2xl space-y-6">
                    {/* Pesan error (browser tidak mendukung / gagal memutar) */}
                    {error && (
                        <p
                            role="alert"
                            className="flex items-start gap-2 rounded-2xl bg-svarati-danger-soft p-4 text-sm text-svarati-danger-darker"
                        >
                            <AlertCircle className="mt-0.5 size-4 shrink-0" /> {error}
                        </p>
                    )}

                    {/* Daftar suara per kelompok: tombol bergaya card */}
                    <div className="space-y-6">
                        {GROUP_ORDER.map((group) => (
                            <div key={group}>
                                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-svarati-teal/60">
                                    {group}
                                </p>
                                <div className="space-y-3">
                                    {SOUNDS.filter((s) => s.group === group).map((sound) => {
                                        const isActive = activeId === sound.id;
                                        return (
                                            <button
                                                key={sound.id}
                                                onClick={() => (isActive ? pauseSound() : playSound(sound))}
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
                            </div>
                        ))}
                    </div>

                    {/* Volume */}
                    <div>
                        <div className="mb-2 flex items-center justify-between gap-2">
                            <label htmlFor="volume" className="flex items-center gap-2 text-sm font-bold text-svarati-teal">
                                <Volume2 className="size-4" /> Volume
                            </label>
                            <span className="text-sm font-medium tabular-nums text-svarati-teal/80" aria-hidden="true">
                                {Math.round(volume * 100)}%
                            </span>
                        </div>
                        <input
                            id="volume"
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={volume}
                            aria-valuetext={`${Math.round(volume * 100)} persen`}
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
                                    aria-pressed={timerMin === t.minutes}
                                    onClick={() => chooseTimer(t.minutes)}
                                >
                                    {t.label}
                                </Button>
                            ))}
                        </div>

                        {/* Sisa waktu: berjalan, dijeda, atau belum mulai */}
                        {isPaused ? (
                            <Card
                                variant="cream"
                                size="sm"
                                className="mt-4 flex items-center justify-between gap-3"
                            >
                                <span className="text-sm font-medium text-svarati-teal">
                                    <span className="flex items-center gap-2">
                                        <Pause className="size-4" /> Dijeda
                                    </span>
                                    <span className="mt-0.5 block text-xs text-svarati-teal/70">
                                        Putar suara untuk melanjutkan hitung mundur.
                                    </span>
                                </span>
                                <span className="text-right">
                                    <span className="block text-xs text-svarati-teal/70">Sisa</span>
                                    <span className="text-2xl font-bold tabular-nums text-svarati-teal">
                                        {formatTime(pausedLeft)}
                                    </span>
                                </span>
                            </Card>
                        ) : remaining !== null ? (
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

                        {/* Pesan saat timer selesai; selalu ada supaya dibacakan screen reader */}
                        <p
                            role="status"
                            className={notice ? "mt-4 flex items-center gap-2 text-sm font-medium text-svarati-teal" : "sr-only"}
                        >
                            {notice && <CheckCircle2 className="size-4 shrink-0" />}
                            {notice}
                        </p>
                    </div>
                </Card>
            </div>
        </main>
    );
}