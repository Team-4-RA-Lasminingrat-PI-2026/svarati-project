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
    { kategori: "musik", label: "Musik Tenang" },
];

// Daftar suara diambil dari GET /api/sounds (RLA055).
// Daftar ini hanya cadangan kalau API gagal (offline / Supabase bermasalah).
// `id` = sound_key di database = nama generator di BUILDERS.
const CADANGAN_SOUNDS = [
    { id: "melodi_brahms", label: "Melodi Brahms", desc: "Melodi klasik Brahms yang dimainkan piano pelan dengan iringan hangat" },
    { id: "kotak_musik", label: "Kotak Musik Bintang", desc: "Melodi Twinkle Twinkle Little Star dari kotak musik yang berdenting lembut" },
    { id: "cahaya_bulan", label: "Cahaya Bulan", desc: "Lagu rakyat Prancis Au Clair de la Lune, berdenting pelan seperti lonceng kecil" },
    { id: "arpeggio_tidur", label: "Piano Mengayun", desc: "Petikan piano pelan yang mengayun lembut" },
    { id: "ayunan", label: "Ayunan Lembut", desc: "Kotak musik dengan irama yang bergoyang pelan" },
    { id: "pelukan_hangat", label: "Pelukan Hangat", desc: "Melodi piano sederhana di atas iringan yang hangat" },
    { id: "harpa_malam", label: "Harpa Malam", desc: "Petikan harpa yang naik perlahan, lalu hening sejenak" },
    { id: "bintang_jatuh", label: "Bintang Jatuh", desc: "Denting tinggi yang turun pelan di atas dengung lembut" },
    { id: "gitar_tidur", label: "Gitar Senja", desc: "Petikan gitar nilon yang pelan dan hangat" },
    { id: "selimut_malam", label: "Selimut Malam", desc: "Akor piano panjang yang datang setiap beberapa detik" },
    { id: "dayung_perlahan", label: "Dayung Perlahan", desc: "Lagu Row, Row, Row Your Boat dari petikan harpa yang pelan" },
    { id: "lonceng_pagi", label: "Lonceng Pagi", desc: "Lagu Frère Jacques yang berdenting pelan seperti lonceng kecil" },
    { id: "awan_putih", label: "Awan Putih", desc: "Kotak musik dengan melodi ringan yang melayang pelan" },
    { id: "kunang_kunang", label: "Kunang-Kunang", desc: "Denting tinggi yang naik turun pelan, seperti cahaya kecil yang berkedip" },
    { id: "rumah_hangat", label: "Rumah Hangat", desc: "Piano elektrik yang lembut dan hangat" },
    { id: "embun_pagi", label: "Embun Pagi", desc: "Tiupan flute yang pelan di atas iringan lembut" },
    { id: "sayap_kupu", label: "Sayap Kupu-Kupu", desc: "Duet flute dan harpa yang ringan" },
    { id: "bulan_sabit", label: "Bulan Sabit", desc: "Gesekan cello yang dalam dan panjang, ditemani piano" },
    { id: "pelangi_sore", label: "Pelangi Sore", desc: "Kotak musik yang naik turun di atas iringan hangat" },
    { id: "langkah_pelan", label: "Langkah Pelan", desc: "Piano pelan yang terinspirasi Gymnopédie karya Satie" },
].map((t) => ({ ...t, kategori: "musik" }));

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

// ---------- Pembantu untuk membangun suara ----------

// Mencatat semua node/timer supaya bisa dihentikan dengan bersih
function createRig() {
    const nodes = [];
    const stoppers = [];
    const buffers = {};

    const track = (node) => {
        nodes.push(node);
        return node;
    };

    return {
        track,
        // Jalankan fungsi sekarang, lalu ulangi dengan jeda minMs..maxMs (acak kalau berbeda)
        loop(fn, minMs, maxMs = minMs) {
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

// Nomor not MIDI -> frekuensi (69 = A4 = 440 Hz)
const hz = (midi) => 440 * 2 ** ((midi - 69) / 12);

// Akor iringan (nomor MIDI, oktaf rendah)
const AKOR = {
    C: [48, 55, 60, 64],
    G: [43, 50, 59, 62],
    F: [41, 48, 57, 60],
    Am: [45, 52, 57, 60],
    Em: [40, 47, 55, 59],
    Dm: [50, 57, 62, 65],
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

// Warna suara (timbre) tiap alat musik
const PIANO = { attack: 0.015, decay: 3.5, partials: [[1, 1], [2, 0.3], [3, 0.08], [4, 0.03]] };
const KOTAK_MUSIK = { attack: 0.004, decay: 2.2, partials: [[1, 1], [3, 0.06], [4, 0.15]] };
const HARPA = { attack: 0.006, decay: 3, partials: [[1, 1], [2, 0.4], [3, 0.12], [4, 0.04]] };
const CELESTA = { attack: 0.003, decay: 2, partials: [[1, 1], [2, 0.08], [4, 0.2]] };

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

// Petikan gitar nilon (sintesis Karplus-Strong); bunyinya disimpan per nada
function petikGitar(ctx, dest, midi, t, level, cache) {
    let buf = cache.get(midi);
    if (!buf) {
        const sr = ctx.sampleRate;
        const len = Math.floor(sr * 3);
        const n = Math.max(2, Math.round(sr / hz(midi)));
        buf = ctx.createBuffer(1, len, sr);
        const d = buf.getChannelData(0);
        // Getaran awal yang sudah dihaluskan supaya petikannya lembut, bukan tajam
        let prev = 0;
        for (let i = 0; i < n; i++) {
            prev = (prev + Math.random() * 2 - 1) / 2;
            d[i] = prev;
        }
        for (let i = n; i < len; i++) {
            const a = d[i - n];
            const b = i - n - 1 >= 0 ? d[i - n - 1] : a;
            d[i] = 0.498 * (a + b);
        }
        cache.set(midi, buf);
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const g = ctx.createGain();
    g.gain.value = level;
    src.connect(g);
    g.connect(dest);
    src.start(t);
}

// ---------- Lagu ----------
// Ditulis dengan not angka di tangga nada C: 1 = do ... 7 = si, 8 = do tinggi.
// Koma = satu oktaf lebih rendah (6, = la rendah). ":2" = panjang 2 ketukan (tanpa = 1).
// Tiap bagian: [akor iringan, "not not ..."]
const NOT_ANGKA = { 1: 60, 2: 62, 3: 64, 4: 65, 5: 67, 6: 69, 7: 71, 8: 72 };
const parse = (str) => str.split(" ").map((x) => {
    const [n, b] = x.split(":");
    const turun = (n.match(/,/g) || []).length;
    return [NOT_ANGKA[parseInt(n, 10)] - 12 * turun, Number(b ?? 1)];
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

// Au Clair de la Lune (lagu tidur tradisional Prancis, domain publik)
const BAIT_BULAN = [["C", "1 1 1 2"], ["C", "3:2"], ["G", "2:2"], ["C", "1 3"], ["G", "2 2"], ["C", "1:4"]];
const LAGU_BULAN = [
    ...BAIT_BULAN,
    ...BAIT_BULAN,
    ["G", "2 2 2 2"], ["Am", "6,:2 6,:2"], ["G", "2 1 7, 6,"], ["G", "5,:4"],
    ...BAIT_BULAN,
];

// Melodi orisinal 6/8 yang mengayun (satu ketukan = seperdelapan)
const LAGU_AYUNAN = [
    ["C", "5:3 3:3"], ["Am", "6:2 5:1 3:3"], ["F", "4:2 5:1 6:3"], ["G", "5:6"],
    ["C", "5:3 8:3"], ["Am", "7:2 6:1 5:3"], ["F", "4:2 3:1 2:3"], ["C", "1:6"],
];

// Melodi orisinal yang sederhana dan turun pelan
const LAGU_PELUKAN = [
    ["C", "5:2 3:2"], ["G", "4:2 2:2"], ["Am", "3:2 1:2"], ["F", "2:2 6,:2"],
    ["C", "5:2 3:2"], ["G", "2:2 7,:2"], ["F", "1:2 6,:2"], ["C", "1:4"],
];

// Mainkan satu putaran lagu mulai waktu t; iringan dipanggil sekali per bagian
function mainkanLagu(ctx, dest, lagu, t, { beat, oktaf = 0, suara, level, iringan }) {
    for (const [akor, notes] of lagu) {
        const mulai = t;
        for (const [m, b] of parse(notes)) {
            if (suara.tahan) tiup(ctx, dest, hz(m + oktaf), t, b * beat * 0.92, { ...suara, level });
            else softNote(ctx, dest, hz(m + oktaf), t, { ...suara, level });
            t += b * beat;
        }
        iringan(akor, mulai, t - mulai);
    }
}

// Lagu yang diulang terus, dengan jeda singkat di antara putaran
function ulangLagu(ctx, r, bus, lagu, { beat, jeda = 4, ...opsi }) {
    const putaran = (panjangLagu(lagu) + jeda) * beat * 1000;
    r.loop(() => mainkanLagu(ctx, bus, lagu, ctx.currentTime + 0.1, { beat, ...opsi }), putaran);
}

// ---------- Alat musik bernada panjang (flute, cello) ----------

// Nada yang ditahan (bukan dipetik): masuk pelan, ditahan, lalu memudar, dengan getaran (vibrato) halus
function tiup(ctx, dest, freq, t, dur, { level, attack = 0.15, release = 0.4, partials, vibrato = 0.004 }) {
    const g = ctx.createGain();
    const tahan = Math.max(t + attack, t + dur - release);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(level, t + attack);
    g.gain.setValueAtTime(level, tahan);
    g.gain.linearRampToValueAtTime(0, t + dur + release);
    g.connect(dest);
    const vib = ctx.createOscillator();
    vib.frequency.value = 4.5;
    vib.start(t);
    vib.stop(t + dur + release + 0.05);
    partials.forEach(([ratio, amp]) => {
        const o = ctx.createOscillator();
        o.type = "sine";
        o.frequency.value = freq * ratio;
        const vg = ctx.createGain();
        vg.gain.value = freq * ratio * vibrato;
        vib.connect(vg);
        vg.connect(o.frequency);
        const og = ctx.createGain();
        og.gain.value = amp;
        o.connect(og);
        og.connect(g);
        o.start(t);
        o.stop(t + dur + release + 0.05);
    });
}

const FLUTE = { tahan: true, attack: 0.18, release: 0.5, partials: [[1, 1], [2, 0.12], [3, 0.03]] };
const CELLO = { tahan: true, attack: 0.35, release: 0.7, vibrato: 0.005, partials: [[1, 1], [2, 0.5], [3, 0.22], [4, 0.1], [5, 0.04]] };
const RHODES = { attack: 0.01, decay: 4, partials: [[1, 1], [2, 0.18], [4, 0.05]] };

// Lagu 6/8 "Row, Row, Row Your Boat" (lagu tradisional, domain publik); satu ketukan = seperdelapan
const LAGU_DAYUNG = [
    ["C", "1:3 1:3"], ["C", "1:2 2:1 3:3"], ["C", "3:2 2:1 3:2 4:1"], ["C", "5:6"],
    ["C", "8 8 8 5 5 5"], ["C", "3 3 3 1 1 1"], ["G", "5:2 4:1 3:2 2:1"], ["C", "1:6"],
];

// "Frère Jacques" (lagu tradisional Prancis, domain publik)
const LAGU_LONCENG = [
    ["C", "1 2 3 1"], ["C", "1 2 3 1"], ["C", "3 4 5:2"], ["C", "3 4 5:2"],
    ["C", "5:0.5 6:0.5 5:0.5 4:0.5 3 1"], ["C", "5:0.5 6:0.5 5:0.5 4:0.5 3 1"],
    ["C", "1 5, 1:2"], ["C", "1 5, 1:2"],
];

// Melodi orisinal 3/4 untuk kotak musik
const LAGU_AWAN = [
    ["C", "3:2 5"], ["G", "4:2 2"], ["Am", "3:2 1"], ["G", "2:3"],
    ["F", "1:2 6,"], ["C", "5,:2 1"], ["G", "2 3 2"], ["C", "1:3"],
];

// Melodi orisinal untuk electric piano
const LAGU_RUMAH = [
    ["C", "3:2 2 1"], ["F", "6,:2 1:2"], ["C", "5,:2 3:2"], ["G", "2:4"],
    ["C", "3:2 2 1"], ["F", "6,:2 1:2"], ["G", "2:2 7,:2"], ["C", "1:4"],
];

// Melodi orisinal untuk flute
const LAGU_EMBUN = [
    ["C", "5:2 6 5"], ["Am", "3:3 2"], ["F", "1:2 2 3"], ["G", "2:4"],
    ["C", "5:2 6 8"], ["Am", "6:3 5"], ["F", "3 2 1 2"], ["C", "1:4"],
];

// Melodi orisinal flute untuk duet dengan harpa
const LAGU_KUPU = [
    ["F", "5:3 6"], ["C", "5:2 3:2"], ["G", "2:3 3"], ["Am", "1:4"],
    ["F", "6,:2 1 2"], ["C", "3:2 5:2"], ["G", "4 3 2:2"], ["C", "1:4"],
];

// Melodi orisinal cello (dimainkan satu oktaf lebih rendah)
const LAGU_BULAN_SABIT = [
    ["Am", "3:2 1:2"], ["F", "6,:2 1:2"], ["C", "5,:2 1:2"], ["G", "2:2 7,:2"],
    ["Am", "1:4"], ["F", "4,:2 6,:2"], ["G", "5,:2 7,:2"], ["C", "1:4"],
];

// Kunci di sini = sound_key di tabel relaxation_tracks
const BUILDERS = {
    // Piano pelan + akor latar yang hangat
    melodi_brahms: (ctx, out, r) => {
        const bus = reverbBus(ctx, out, r, { seconds: 3.5, wet: 0.45, tone: 2600 });
        ulangLagu(ctx, r, bus, LAGU_BRAHMS, {
            beat: 0.8, suara: PIANO, level: 0.19,
            iringan: (akor, t, dur) => padChord(ctx, bus, AKOR[akor], t, dur, 0.025),
        });
    },

    // Kotak musik satu oktaf lebih tinggi, dengan nada rendah lembut di awal tiap bagian
    kotak_musik: (ctx, out, r) => {
        const bus = reverbBus(ctx, out, r, { seconds: 2.5, wet: 0.35, tone: 4200 });
        ulangLagu(ctx, r, bus, LAGU_BINTANG, {
            beat: 0.7, oktaf: 12, suara: KOTAK_MUSIK, level: 0.17,
            iringan: (akor, t) => softNote(ctx, bus, hz(AKOR[akor][0] + 12), t, { ...PIANO, level: 0.08 }),
        });
    },

    // Celesta (denting seperti lonceng kecil) dengan akor latar
    cahaya_bulan: (ctx, out, r) => {
        const bus = reverbBus(ctx, out, r, { seconds: 3.5, wet: 0.45, tone: 4500 });
        ulangLagu(ctx, r, bus, LAGU_BULAN, {
            beat: 0.75, oktaf: 12, suara: CELESTA, level: 0.17,
            iringan: (akor, t, dur) => padChord(ctx, bus, AKOR[akor], t, dur, 0.022),
        });
    },

    // Petikan akor piano yang mengayun (3/4)
    arpeggio_tidur: (ctx, out, r) => {
        const bus = reverbBus(ctx, out, r, { seconds: 3.5, wet: 0.45, tone: 2400 });
        const urutan = ["C", "Am", "F", "G", "C", "Em", "F", "G"];
        const pola = [0, 1, 2, 3, 2, 1];
        const ketuk = 0.45;
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
        }, urutan.length * pola.length * ketuk * 1000);
    },

    // Kotak musik 6/8 dengan nada bas di ketukan 1 dan 4
    ayunan: (ctx, out, r) => {
        const bus = reverbBus(ctx, out, r, { seconds: 3, wet: 0.4, tone: 4000 });
        ulangLagu(ctx, r, bus, LAGU_AYUNAN, {
            beat: 0.3, jeda: 6, oktaf: 12, suara: KOTAK_MUSIK, level: 0.21,
            iringan: (akor, t, dur) => {
                softNote(ctx, bus, hz(AKOR[akor][0] + 12), t, { ...PIANO, level: 0.11 });
                softNote(ctx, bus, hz(AKOR[akor][1] + 12), t + dur / 2, { ...PIANO, level: 0.08 });
            },
        });
    },

    // Melodi piano pelan di atas akor latar
    pelukan_hangat: (ctx, out, r) => {
        const bus = reverbBus(ctx, out, r, { seconds: 4, wet: 0.5, tone: 2400 });
        ulangLagu(ctx, r, bus, LAGU_PELUKAN, {
            beat: 0.9, suara: PIANO, level: 0.18,
            iringan: (akor, t, dur) => padChord(ctx, bus, AKOR[akor], t, dur, 0.03),
        });
    },

    // Harpa: akor dipetik naik satu per satu, lalu diam sejenak
    harpa_malam: (ctx, out, r) => {
        const bus = reverbBus(ctx, out, r, { seconds: 4, wet: 0.5, tone: 3000 });
        const akorList = [[53, 57, 60, 64], [52, 55, 59, 62], [50, 53, 57, 60], [48, 52, 55, 59]]; // Fmaj7 Em7 Dm7 Cmaj7
        const ketuk = 0.3;
        const perAkor = 8 * ketuk + 1.5;
        r.loop(() => {
            let t = ctx.currentTime + 0.1;
            akorList.forEach((akor) => {
                softNote(ctx, bus, hz(akor[0] - 12), t, { ...HARPA, level: 0.14 });
                [...akor, ...akor.map((m) => m + 12)].forEach((m, i) =>
                    softNote(ctx, bus, hz(m), t + i * ketuk, { ...HARPA, level: 0.14 })
                );
                t += perAkor;
            });
        }, akorList.length * perAkor * 1000);
    },

    // Denting tinggi yang turun pelan di atas akor latar
    bintang_jatuh: (ctx, out, r) => {
        const bus = reverbBus(ctx, out, r, { seconds: 4.5, wet: 0.55, tone: 5000 });
        const frasa = [[84, 81, 79, 76], [81, 79, 76, 74], [79, 76, 74, 72], [76, 74, 72, 67]];
        const akor = ["C", "Am", "F", "C"];
        const ketuk = 0.7;
        const perFrasa = 4 * ketuk + 1.4;
        r.loop(() => {
            let t = ctx.currentTime + 0.1;
            frasa.forEach((notes, i) => {
                padChord(ctx, bus, AKOR[akor[i]], t, perFrasa, 0.04);
                notes.forEach((m, k) => softNote(ctx, bus, hz(m), t + k * ketuk, { ...CELESTA, level: 0.16 }));
                t += perFrasa;
            });
        }, frasa.length * perFrasa * 1000);
    },

    // Gitar nilon: pola petikan pelan Am - F - C - G
    gitar_tidur: (ctx, out, r) => {
        const bus = reverbBus(ctx, out, r, { seconds: 2.5, wet: 0.3, tone: 2200 });
        const cache = new Map();
        const akorList = [[45, 52, 57, 60, 64], [41, 48, 53, 57, 60], [48, 52, 55, 60, 64], [43, 50, 55, 59, 62]];
        const pola = [0, 2, 3, 4, 3, 2, 1, 3];
        const ketuk = 0.42;
        r.loop(() => {
            let t = ctx.currentTime + 0.1;
            akorList.forEach((akor) =>
                pola.forEach((i, k) => {
                    petikGitar(ctx, bus, akor[i], t, k === 0 ? 0.52 : 0.4, cache);
                    t += ketuk;
                })
            );
        }, akorList.length * pola.length * ketuk * 1000);
    },

    // Akor piano panjang yang datang setiap beberapa detik
    selimut_malam: (ctx, out, r) => {
        const bus = reverbBus(ctx, out, r, { seconds: 4, wet: 0.5, tone: 2200 });
        const akorList = [[48, 55, 59, 64], [45, 52, 55, 60], [41, 48, 52, 57], [43, 50, 52, 59]]; // Cmaj7 Am7 Fmaj7 G6
        const jarak = 4.5;
        r.loop(() => {
            let t = ctx.currentTime + 0.1;
            akorList.forEach((akor) => {
                akor.forEach((m, i) => softNote(ctx, bus, hz(m + 12), t + i * 0.07, { ...PIANO, decay: 5.5, level: 0.16 }));
                t += jarak;
            });
        }, akorList.length * jarak * 1000);
    },

    // Harpa 6/8 dengan nada bas pelan
    dayung_perlahan: (ctx, out, r) => {
        const bus = reverbBus(ctx, out, r, { seconds: 3.5, wet: 0.45, tone: 3200 });
        ulangLagu(ctx, r, bus, LAGU_DAYUNG, {
            beat: 0.3, jeda: 6, suara: HARPA, level: 0.12,
            iringan: (akor, t, dur) => {
                softNote(ctx, bus, hz(AKOR[akor][0]), t, { ...HARPA, level: 0.07 });
                softNote(ctx, bus, hz(AKOR[akor][1]), t + dur / 2, { ...HARPA, level: 0.05 });
            },
        });
    },

    // Celesta yang pelan dengan akor latar
    lonceng_pagi: (ctx, out, r) => {
        const bus = reverbBus(ctx, out, r, { seconds: 4, wet: 0.5, tone: 4500 });
        ulangLagu(ctx, r, bus, LAGU_LONCENG, {
            beat: 0.85, oktaf: 12, suara: CELESTA, level: 0.16,
            iringan: (akor, t, dur) => padChord(ctx, bus, AKOR[akor], t, dur, 0.022),
        });
    },

    // Kotak musik 3/4 dalam nada F (lima semitone lebih tinggi dari C)
    awan_putih: (ctx, out, r) => {
        const bus = reverbBus(ctx, out, r, { seconds: 3, wet: 0.4, tone: 4200 });
        ulangLagu(ctx, r, bus, LAGU_AWAN, {
            beat: 0.55, oktaf: 17, suara: KOTAK_MUSIK, level: 0.17,
            iringan: (akor, t) => softNote(ctx, bus, hz(AKOR[akor][0] + 17), t, { ...PIANO, level: 0.08 }),
        });
    },

    // Celesta tinggi yang naik turun pelan, seperti cahaya kecil yang berkedip
    kunang_kunang: (ctx, out, r) => {
        const bus = reverbBus(ctx, out, r, { seconds: 4, wet: 0.55, tone: 5000 });
        const urutan = ["Am", "F", "C", "G"];
        const pola = [0, 1, 2, 3, 2, 1];
        const ketuk = 0.42;
        r.loop(() => {
            let t = ctx.currentTime + 0.1;
            urutan.forEach((nama) => {
                const akor = AKOR[nama];
                padChord(ctx, bus, akor, t, pola.length * ketuk, 0.022);
                pola.forEach((i) => {
                    softNote(ctx, bus, hz(akor[i] + 24), t, { ...CELESTA, level: 0.1 });
                    t += ketuk;
                });
            });
        }, urutan.length * pola.length * ketuk * 1000);
    },

    // Electric piano yang hangat dengan akor di ketukan 1 dan 3
    rumah_hangat: (ctx, out, r) => {
        const bus = reverbBus(ctx, out, r, { seconds: 3, wet: 0.4, tone: 2600 });
        ulangLagu(ctx, r, bus, LAGU_RUMAH, {
            beat: 0.85, oktaf: 12, suara: RHODES, level: 0.15,
            iringan: (akor, t, dur) => {
                [0, dur / 2].forEach((d) =>
                    AKOR[akor].forEach((m) => softNote(ctx, bus, hz(m + 12), t + d, { ...RHODES, level: 0.04 }))
                );
            },
        });
    },

    // Flute pelan di atas akor latar
    embun_pagi: (ctx, out, r) => {
        const bus = reverbBus(ctx, out, r, { seconds: 4, wet: 0.5, tone: 3500 });
        ulangLagu(ctx, r, bus, LAGU_EMBUN, {
            beat: 0.9, oktaf: 12, suara: FLUTE, level: 0.09,
            iringan: (akor, t, dur) => padChord(ctx, bus, AKOR[akor], t, dur, 0.025),
        });
    },

    // Duet flute dan harpa
    sayap_kupu: (ctx, out, r) => {
        const bus = reverbBus(ctx, out, r, { seconds: 4, wet: 0.5, tone: 3500 });
        ulangLagu(ctx, r, bus, LAGU_KUPU, {
            beat: 0.85, oktaf: 12, suara: FLUTE, level: 0.08,
            iringan: (akor, t) =>
                AKOR[akor].forEach((m, i) => softNote(ctx, bus, hz(m + 12), t + i * 0.25, { ...HARPA, level: 0.09 })),
        });
    },

    // Cello rendah yang panjang, ditemani petikan piano
    bulan_sabit: (ctx, out, r) => {
        const bus = reverbBus(ctx, out, r, { seconds: 4, wet: 0.5, tone: 2200 });
        ulangLagu(ctx, r, bus, LAGU_BULAN_SABIT, {
            beat: 0.9, oktaf: -12, suara: CELLO, level: 0.09,
            iringan: (akor, t) =>
                AKOR[akor].forEach((m, i) => softNote(ctx, bus, hz(m + 12), t + i * 0.35, { ...PIANO, level: 0.06 })),
        });
    },

    // Kotak musik yang naik turun di atas akor latar
    pelangi_sore: (ctx, out, r) => {
        const bus = reverbBus(ctx, out, r, { seconds: 3.5, wet: 0.45, tone: 4200 });
        const urutan = ["F", "C", "Dm", "G"];
        const pola = [0, 1, 2, 3, 2, 3, 2, 1];
        const ketuk = 0.32;
        r.loop(() => {
            let t = ctx.currentTime + 0.1;
            urutan.forEach((nama) => {
                const akor = AKOR[nama];
                padChord(ctx, bus, akor, t, pola.length * ketuk, 0.022);
                pola.forEach((i) => {
                    softNote(ctx, bus, hz(akor[i] + 24), t, { ...KOTAK_MUSIK, level: 0.1 });
                    t += ketuk;
                });
            });
        }, urutan.length * pola.length * ketuk * 1000);
    },

    // Terinspirasi Gymnopédie No. 1 (Satie, 1888, domain publik): bas dan akor bergantian, melodi pelan
    langkah_pelan: (ctx, out, r) => {
        const bus = reverbBus(ctx, out, r, { seconds: 4, wet: 0.5, tone: 2600 });
        const ketuk = 0.8;
        // Tiap bar 3 ketukan: [nada bas, akor, nada melodi per ketukan (null = diam)]
        const barA = [43, [59, 62, 66]]; // Gmaj7
        const barB = [38, [57, 61, 66]]; // Dmaj7
        const melodi = [
            [null, null, null], [null, null, null],
            [null, 78, 81], [79, 78, 73], [71, 73, 74], [69, null, null], [66, null, null], [null, null, null],
            [null, 78, 81], [79, 78, 73], [71, 73, 74], [69, null, null], [64, null, null], [null, null, null],
        ];
        r.loop(() => {
            let t = ctx.currentTime + 0.1;
            melodi.forEach((notes, bar) => {
                const [bas, akor] = bar % 2 === 0 ? barA : barB;
                softNote(ctx, bus, hz(bas), t, { ...PIANO, decay: 4, level: 0.12 });
                akor.forEach((m) => softNote(ctx, bus, hz(m), t + ketuk, { ...PIANO, level: 0.05 }));
                notes.forEach((m, k) => {
                    if (m) softNote(ctx, bus, hz(m), t + k * ketuk, { ...PIANO, decay: 4, level: 0.13 });
                });
                t += 3 * ketuk;
            });
        }, melodi.length * 3 * ketuk * 1000);
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

            // Volume utama untuk suara ini, naik pelan supaya tidak mengagetkan
            const gain = ctx.createGain();
            gain.gain.value = 0;
            gain.connect(ctx.destination);
            gain.gain.setTargetAtTime(volume, ctx.currentTime, 0.15);

            rig = createRig();
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