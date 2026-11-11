"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Pause, Volume2, Timer, AlertCircle, CheckCircle2 } from "lucide-react";
import Badge from "@/components/Badge";
import { Card, CardDescription, cardVariants } from "@/components/Card";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Kode kategori di database (relaxation_tracks.category) dan judul yang tampil di halaman
const GROUPS = [
    { kategori: "noise", label: "Noise" },
    { kategori: "suara_alam", label: "Suara Alam" },
    { kategori: "musik", label: "Musik Pengantar Tidur" },
];

// Daftar suara diambil dari GET /api/sounds (RLA055).
// Daftar ini hanya cadangan kalau API gagal (offline / Supabase bermasalah).
// `id` = sound_key di database = nama generator di BUILDERS.
const CADANGAN_SOUNDS = [
    { id: "white", kategori: "noise", label: "White Noise", desc: "Desis rata yang menutupi bunyi di sekitar" },
    { id: "pink", kategori: "noise", label: "Pink Noise", desc: "Lebih lembut, mirip hujan ringan" },
    { id: "brown", kategori: "noise", label: "Brown Noise", desc: "Dalam dan hangat, mirip gemuruh jauh" },
    { id: "hujan", kategori: "suara_alam", label: "Hujan", desc: "Rintik hujan yang rata dan menenangkan" },
    { id: "ombak", kategori: "suara_alam", label: "Ombak", desc: "Gelombang yang datang dan pergi perlahan" },
    { id: "hutan", kategori: "suara_alam", label: "Hutan & Angin", desc: "Angin lembut dengan kicau burung sesekali" },
    { id: "sungai", kategori: "suara_alam", label: "Aliran Sungai", desc: "Air yang mengalir pelan di antara bebatuan" },
    { id: "lullaby_brahms", kategori: "musik", label: "Lullaby Brahms", desc: "Lagu nina bobo klasik, dimainkan piano pelan dengan iringan hangat" },
    { id: "kotak_musik", kategori: "musik", label: "Kotak Musik Bintang", desc: "Melodi Twinkle Twinkle Little Star dari kotak musik yang berdenting lembut" },
    { id: "arpeggio_tidur", kategori: "musik", label: "Piano Pengantar Tidur", desc: "Petikan piano pelan yang mengayun seperti buaian" },
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

// ---------- Musik pengantar tidur (lullaby) ----------

// Nomor not MIDI -> frekuensi (69 = A4 = 440 Hz)
const hz = (midi) => 440 * 2 ** ((midi - 69) / 12);

// Not angka (1 = do ... 7 = si, 8 = do tinggi) di tangga nada C mayor
const NOT_ANGKA = { 1: 60, 2: 62, 3: 64, 4: 65, 5: 67, 6: 69, 7: 71, 8: 72 };

// Akor iringan (nomor MIDI, oktaf rendah)
const AKOR = {
    C: [48, 55, 60, 64],
    G: [43, 50, 59, 62],
    F: [41, 48, 57, 60],
    Am: [45, 52, 57, 60],
    Em: [40, 47, 55, 59],
};

// Gema ruangan yang lembut: dibuat dari derau yang meluruh pelan
function reverbBus(ctx, out, r, { seconds = 3, wet = 0.4, tone = 3000 } = {}) {
    const input = gainNode(ctx, r, 1);
    const lp = filter(ctx, r, "lowpass", tone);
    const len = Math.floor(ctx.sampleRate * seconds);
    const ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
        const d = ir.getChannelData(ch);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 3;
    }
    const conv = r.track(ctx.createConvolver());
    conv.buffer = ir;
    const w = gainNode(ctx, r, wet);
    input.connect(lp);
    lp.connect(out);
    lp.connect(conv);
    conv.connect(w);
    w.connect(out);
    return input;
}

// Satu nada lembut. partials = [rasio frekuensi, kekuatan]
function softNote(ctx, dest, freq, t, { level = 0.12, attack = 0.02, decay = 3, partials }) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(level, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    g.connect(dest);
    partials.forEach(([ratio, amp]) => {
        const o = ctx.createOscillator();
        o.type = "sine";
        o.frequency.value = freq * ratio;
        const og = ctx.createGain();
        og.gain.value = amp;
        o.connect(og);
        og.connect(g);
        o.start(t);
        o.stop(t + decay + 0.05);
    });
}

const PIANO = { attack: 0.015, decay: 3.5, partials: [[1, 1], [2, 0.3], [3, 0.08], [4, 0.03]] };
const KOTAK_MUSIK = { attack: 0.004, decay: 2.2, partials: [[1, 1], [3, 0.06], [4, 0.15]] };

// Akor latar yang masuk dan keluar perlahan (tanpa hentakan)
function padChord(ctx, dest, notes, t, dur, level = 0.03) {
    const fade = Math.min(1.2, dur / 3);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(level, t + fade);
    g.gain.setValueAtTime(level, t + dur - fade);
    g.gain.linearRampToValueAtTime(0, t + dur + fade);
    g.connect(dest);
    notes.forEach((m) => {
        [0, 0.8].forEach((detune) => {
            const o = ctx.createOscillator();
            o.type = "sine";
            o.frequency.value = hz(m) + detune;
            o.connect(g);
            o.start(t);
            o.stop(t + dur + fade + 0.05);
        });
    });
}

// Bagian lagu: [akor, "not:ketukan not:ketukan ..."] (tanpa ":ketukan" = 1 ketukan)
const parse = (str) => str.split(" ").map((x) => {
    const [n, b] = x.split(":");
    return [Number(n), Number(b ?? 1)];
});
const panjangLagu = (lagu) =>
    lagu.reduce((sum, [, notes]) => sum + parse(notes).reduce((a, [, b]) => a + b, 0), 0);

// Wiegenlied (Brahms, 1868, domain publik)
const LAGU_BRAHMS = [
    ["C", "3 3 5:2.5"],
    ["C", "3 3 5:2.5"],
    ["C", "3 5 8:1.5 7:0.5 6 6 5:2.5"],
    ["G", "2 3 4 2 2 3 4:2.5"],
    ["G", "2 4 7 6 5 7 8:2.5"],
    ["F", "1 1 8:2.5 6 4 5:2.5"],
    ["C", "3 1 4 5 6 5:2.5"],
    ["F", "1 1 8:2.5 6 4 5:2.5"],
    ["C", "3 1 4 3 2 1:3"],
];

// Twinkle Twinkle Little Star (lagu tradisional, domain publik)
const LAGU_BINTANG = [
    ["C", "1 1 5 5"], ["F", "6 6"], ["C", "5:2"], ["F", "4 4"], ["C", "3 3"], ["G", "2 2"], ["C", "1:2"],
    ["C", "5 5"], ["F", "4 4"], ["C", "3 3"], ["G", "2:2"],
    ["C", "5 5"], ["F", "4 4"], ["C", "3 3"], ["G", "2:2"],
    ["C", "1 1 5 5"], ["F", "6 6"], ["C", "5:2"], ["F", "4 4"], ["C", "3 3"], ["G", "2 2"], ["C", "1:3"],
];

// Mainkan satu putaran lagu mulai waktu t; iringan dipanggil sekali per bagian
function mainkanLagu(ctx, dest, lagu, t, { beat, oktaf = 0, suara, level, iringan }) {
    for (const [akor, notes] of lagu) {
        const mulai = t;
        for (const [n, b] of parse(notes)) {
            softNote(ctx, dest, hz(NOT_ANGKA[n] + oktaf), t, { ...suara, level });
            t += b * beat;
        }
        iringan(akor, mulai, t - mulai);
    }
}

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

    // Lullaby Brahms: piano pelan + akor latar yang hangat
    lullaby_brahms: (ctx, out, r) => {
        const bus = reverbBus(ctx, out, r, { seconds: 3.5, wet: 0.45, tone: 2600 });
        const beat = 0.8;
        const putaran = (panjangLagu(LAGU_BRAHMS) + 4) * beat * 1000;
        r.loop(() => {
            mainkanLagu(ctx, bus, LAGU_BRAHMS, ctx.currentTime + 0.1, {
                beat,
                suara: PIANO,
                level: 0.19,
                iringan: (akor, t, dur) => padChord(ctx, bus, AKOR[akor], t, dur, 0.025),
            });
        }, putaran, putaran);
    },

    // Kotak musik: melodi satu oktaf lebih tinggi, iringan nada rendah yang lembut
    kotak_musik: (ctx, out, r) => {
        const bus = reverbBus(ctx, out, r, { seconds: 2.5, wet: 0.35, tone: 4200 });
        const beat = 0.7;
        const putaran = (panjangLagu(LAGU_BINTANG) + 4) * beat * 1000;
        r.loop(() => {
            mainkanLagu(ctx, bus, LAGU_BINTANG, ctx.currentTime + 0.1, {
                beat,
                oktaf: 12,
                suara: KOTAK_MUSIK,
                level: 0.17,
                iringan: (akor, t) => softNote(ctx, bus, hz(AKOR[akor][0] + 12), t, { ...PIANO, level: 0.08 }),
            });
        }, putaran, putaran);
    },

    // Petikan akor yang mengayun (3/4), seperti buaian
    arpeggio_tidur: (ctx, out, r) => {
        const bus = reverbBus(ctx, out, r, { seconds: 3.5, wet: 0.45, tone: 2400 });
        const urutan = ["C", "Am", "F", "G", "C", "Em", "F", "G"];
        const pola = [0, 1, 2, 3, 2, 1];
        const ketuk = 0.45;
        const putaran = urutan.length * pola.length * ketuk * 1000;
        r.loop(() => {
            let t = ctx.currentTime + 0.1;
            urutan.forEach((nama, bar) => {
                const akor = AKOR[nama];
                // Nada tinggi tipis di awal bar genap, seperti kilau kecil
                if (bar % 2 === 0) softNote(ctx, bus, hz(akor[3] + 24), t, { ...PIANO, level: 0.05 });
                pola.forEach((i, k) => {
                    softNote(ctx, bus, hz(akor[i] + 12), t, { ...PIANO, level: k === 0 ? 0.16 : 0.12 });
                    t += ketuk;
                });
            });
        }, putaran, putaran);
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

// Ambil daftar suara dari API. Hanya track dengan generator yang dikenal yang dipakai
// (track berbasis file audio belum didukung pemutar ini).
async function ambilDaftarSuara(signal) {
    const res = await fetch("/api/sounds", { signal });
    if (!res.ok) throw new Error(`GET /api/sounds ${res.status}`);
    const { data } = await res.json();
    const sounds = (data ?? [])
        .filter((t) => t.soundKey && BUILDERS[t.soundKey])
        .map((t) => ({ id: t.soundKey, kategori: t.kategori, label: t.judul, desc: t.deskripsi ?? "" }));
    if (sounds.length === 0) throw new Error("Daftar suara kosong");
    return sounds;
}

export default function SoundPage() {
    const [sounds, setSounds] = useState(null); // null = sedang dimuat
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

    // Muat daftar suara sekali saat halaman dibuka; kalau gagal, pakai daftar cadangan
    useEffect(() => {
        const controller = new AbortController();
        ambilDaftarSuara(controller.signal)
            .then(setSounds)
            .catch((e) => {
                if (controller.signal.aborted) return;
                console.warn("Daftar suara dari API gagal dimuat, pakai cadangan:", e?.message);
                setSounds(CADANGAN_SOUNDS);
            });
        return () => controller.abort();
    }, []);

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
                    {sounds === null ? (
                        <div role="status" aria-label="Memuat daftar suara" className="space-y-3">
                            {[0, 1, 2].map((i) => (
                                <div key={i} className="h-[76px] animate-pulse rounded-2xl bg-svarati-cream" />
                            ))}
                        </div>
                    ) : (
                    <div className="space-y-6">
                        {GROUPS.filter((g) => sounds.some((s) => s.kategori === g.kategori)).map((group) => (
                            <div key={group.kategori}>
                                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-svarati-teal/60">
                                    {group.label}
                                </p>
                                <div className="space-y-3">
                                    {sounds.filter((s) => s.kategori === group.kategori).map((sound) => {
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
                    )}

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