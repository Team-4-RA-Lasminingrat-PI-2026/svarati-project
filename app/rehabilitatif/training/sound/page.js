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
    { kategori: "suara_alam", label: "Suara Alam" },
];

// Daftar suara diambil dari GET /api/sounds (RLA055).
// Daftar ini hanya cadangan kalau API gagal (offline / Supabase bermasalah).
// `id` = sound_key di database = nama generator di BUILDERS.
const CADANGAN_SOUNDS = [
    { id: "melodi_brahms", kategori: "musik", label: "Melodi Brahms", desc: "Melodi klasik Brahms yang dimainkan piano pelan dengan iringan hangat" },
    { id: "kotak_musik", kategori: "musik", label: "Kotak Musik Bintang", desc: "Melodi Twinkle Twinkle Little Star dari kotak musik yang berdenting lembut" },
    { id: "cahaya_bulan", kategori: "musik", label: "Cahaya Bulan", desc: "Lagu rakyat Prancis Au Clair de la Lune, berdenting pelan seperti lonceng kecil" },
    { id: "arpeggio_tidur", kategori: "musik", label: "Piano Mengayun", desc: "Petikan piano pelan yang mengayun lembut" },
    { id: "ayunan", kategori: "musik", label: "Ayunan Lembut", desc: "Kotak musik dengan irama yang bergoyang pelan" },
    { id: "pelukan_hangat", kategori: "musik", label: "Pelukan Hangat", desc: "Melodi piano sederhana di atas iringan yang hangat" },
    { id: "harpa_malam", kategori: "musik", label: "Harpa Malam", desc: "Petikan harpa yang naik perlahan, lalu hening sejenak" },
    { id: "bintang_jatuh", kategori: "musik", label: "Bintang Jatuh", desc: "Denting tinggi yang turun pelan di atas dengung lembut" },
    { id: "gitar_tidur", kategori: "musik", label: "Gitar Senja", desc: "Petikan gitar nilon yang pelan dan hangat" },
    { id: "selimut_malam", kategori: "musik", label: "Selimut Malam", desc: "Akor piano panjang yang datang setiap beberapa detik" },
    { id: "hujan_lembut", kategori: "suara_alam", label: "Hujan Lembut", desc: "Rintik hujan yang hangat dan empuk, tanpa desis tajam" },
    { id: "ombak_jauh", kategori: "suara_alam", label: "Ombak Jauh", desc: "Gelombang di kejauhan yang datang dan pergi perlahan" },
    { id: "angin_sore", kategori: "suara_alam", label: "Angin Sore", desc: "Hembusan angin pelan yang naik turun" },
    { id: "sungai_kecil", kategori: "suara_alam", label: "Sungai Kecil", desc: "Air mengalir pelan dengan gelembung-gelembung kecil" },
    { id: "malam_tenang", kategori: "suara_alam", label: "Malam Tenang", desc: "Udara malam yang sunyi dengan jangkrik di kejauhan" },
    { id: "gerimis_hutan", kategori: "suara_alam", label: "Gerimis di Hutan", desc: "Gerimis dan angin pelan dengan suara burung jauh" },
    { id: "api_unggun", kategori: "suara_alam", label: "Api Unggun", desc: "Gemuruh api yang hangat dan letupan kayu yang halus" },
    { id: "hujan_piano", kategori: "suara_alam", label: "Hujan & Piano", desc: "Hujan pelan ditemani akor piano yang datang sesekali" },
    { id: "lonceng_angin", kategori: "suara_alam", label: "Lonceng Angin", desc: "Angin sepoi dengan denting lonceng angin yang lembut" },
    { id: "ombak_harpa", kategori: "suara_alam", label: "Ombak & Harpa", desc: "Ombak di kejauhan ditemani petikan harpa pelan" },
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

// ---------- Pembantu untuk membangun suara ----------

// Derau dasar untuk suara alam (8 detik, diputar berulang).
// Ujung buffer disambung halus ke awalnya supaya tidak ada bunyi "tik" setiap putaran.
function createNoiseBuffer(ctx, type) {
    const size = ctx.sampleRate * 8;
    const sambung = Math.floor(ctx.sampleRate * 0.5);
    const raw = new Float32Array(size + sambung);
    if (type === "pink") {
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < raw.length; i++) {
            const w = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + w * 0.0555179;
            b1 = 0.99332 * b1 + w * 0.0750759;
            b2 = 0.969 * b2 + w * 0.153852;
            b3 = 0.8665 * b3 + w * 0.3104856;
            b4 = 0.55 * b4 + w * 0.5329522;
            b5 = -0.7616 * b5 - w * 0.016898;
            raw[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
            b6 = w * 0.115926;
        }
    } else {
        // brown: lebih dalam dan hangat
        let last = 0;
        for (let i = 0; i < raw.length; i++) {
            last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
            raw[i] = last * 3.5;
        }
    }
    const buffer = ctx.createBuffer(1, size, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < size; i++) {
        data[i] = i < sambung ? raw[i] * (i / sambung) + raw[size + i] * (1 - i / sambung) : raw[i];
    }
    return buffer;
}

// Tekstur hujan stereo (12 detik, diputar berulang): ribuan tetesan kecil di waktu acak,
// berbeda di kiri dan kanan supaya terdengar luas seperti hujan sungguhan.
// rapat = jumlah tetesan per detik per sisi.
function createRainBuffer(ctx, rapat) {
    const sr = ctx.sampleRate;
    const size = sr * 12;
    const sambung = Math.floor(sr * 0.5);
    const buffer = ctx.createBuffer(2, size, sr);
    for (let ch = 0; ch < 2; ch++) {
        const raw = new Float32Array(size + sambung);
        const jumlah = Math.floor(rapat * (raw.length / sr));
        for (let n = 0; n < jumlah; n++) {
            const mulai = Math.floor(Math.random() * raw.length);
            if (Math.random() < 0.88) {
                // Tetesan kecil: letupan derau yang sangat pendek
                const amp = Math.random() ** 2 * 0.35;
                const tau = sr * (0.0008 + Math.random() * 0.0025);
                for (let k = 0; k < tau * 5 && mulai + k < raw.length; k++) {
                    raw[mulai + k] += (Math.random() * 2 - 1) * amp * Math.exp(-k / tau);
                }
            } else {
                // Tetesan yang jatuh ke genangan: "plip" yang nadanya sedikit naik
                const amp = 0.04 + Math.random() * 0.08;
                const f0 = 1200 + Math.random() * 1600;
                const tau = sr * (0.006 + Math.random() * 0.01);
                let fase = 0;
                for (let k = 0; k < tau * 5 && mulai + k < raw.length; k++) {
                    fase += (2 * Math.PI * f0 * (1 + (0.5 * k) / (tau * 5))) / sr;
                    raw[mulai + k] += Math.sin(fase) * amp * Math.exp(-k / tau);
                }
            }
        }
        // Haluskan bagian yang terlalu tajam (low-pass satu kutub, ~5 kHz)
        const a = Math.exp((-2 * Math.PI * 5000) / sr);
        let y = 0;
        for (let i = 0; i < raw.length; i++) {
            y = (1 - a) * raw[i] + a * y;
            raw[i] = y;
        }
        const d = buffer.getChannelData(ch);
        for (let i = 0; i < size; i++) {
            d[i] = i < sambung ? raw[i] * (i / sambung) + raw[size + i] * (1 - i / sambung) : raw[i];
        }
    }
    return buffer;
}

// Mencatat semua node/timer supaya bisa dihentikan dengan bersih
function createRig(ctx) {
    const nodes = [];
    const stoppers = [];
    const buffers = {};

    const track = (node) => {
        nodes.push(node);
        return node;
    };

    return {
        track,
        // Buffer derau (dibuat sekali per jenis)
        buffer(type, buat = () => createNoiseBuffer(ctx, type)) {
            return (buffers[type] ??= buat());
        },
        // Derau yang berputar terus (dasar suara hujan, angin, ombak)
        noise(type) {
            const s = ctx.createBufferSource();
            s.buffer = this.buffer(type);
            s.loop = true;
            s.start();
            return track(s);
        },
        // Ayunan pelan untuk parameter (volume, nada filter); depth harus <= nilai dasarnya
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
        },
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
            softNote(ctx, dest, hz(m + oktaf), t, { ...suara, level });
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

// ---------- Suara alam ----------
// Semua dibuat hangat: frekuensi tinggi dipotong, naik-turunnya sangat pelan, tanpa hentakan.

// Derau -> filter -> volume. Mengembalikan node volume (untuk diayun pelan)
function lapisan(ctx, r, out, { jenis, tipe, freq, Q = 0.7, level }) {
    const f = filter(ctx, r, tipe, freq, Q);
    const g = gainNode(ctx, r, level);
    r.noise(jenis).connect(f);
    f.connect(g);
    g.connect(out);
    return { f, g };
}

// Hujan: tekstur tetesan stereo + desir jauh yang pelan. rapat = tetesan per detik.
function dasarHujan(ctx, r, out, level, rapat = 700) {
    const s = r.track(ctx.createBufferSource());
    s.buffer = r.buffer("hujan" + rapat, () => createRainBuffer(ctx, rapat));
    s.loop = true;
    s.start();
    const lp = filter(ctx, r, "lowpass", 6500);
    const g = gainNode(ctx, r, level);
    s.connect(lp);
    lp.connect(g);
    g.connect(out);
    // Desir hujan di kejauhan
    const jauh = lapisan(ctx, r, out, { jenis: "pink", tipe: "lowpass", freq: 900, level: level * 0.12 });
    r.lfo(0.03, level * 0.04, jauh.g.gain);
}

// Ombak yang jauh: gemuruh dalam yang datang dan pergi tiap ~14 detik
function dasarOmbak(ctx, r, out, level) {
    const { f, g } = lapisan(ctx, r, out, { jenis: "brown", tipe: "lowpass", freq: 450, level: level * 0.6 });
    r.lfo(0.07, level * 0.45, g.gain);
    r.lfo(0.07, 200, f.frequency);
    const buih = lapisan(ctx, r, out, { jenis: "pink", tipe: "bandpass", freq: 1100, Q: 0.5, level: level * 0.08 });
    r.lfo(0.07, level * 0.07, buih.g.gain);
}

// Angin sore yang berhembus pelan
function dasarAngin(ctx, r, out, level) {
    const a = lapisan(ctx, r, out, { jenis: "pink", tipe: "bandpass", freq: 450, Q: 0.6, level: level * 0.6 });
    r.lfo(0.03, level * 0.4, a.g.gain);
    r.lfo(0.05, 180, a.f.frequency);
    const b = lapisan(ctx, r, out, { jenis: "brown", tipe: "lowpass", freq: 300, level: level * 0.5 });
    r.lfo(0.02, level * 0.3, b.g.gain);
}

// Nada pendek yang empuk (gelembung air, suara burung jauh)
function nadaAlam(ctx, dest, f0, f1, { level, attack, dur }) {
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(level, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(dest);
    o.start(t);
    o.stop(t + dur + 0.05);
}

// "Huu... huu..." burung jauh di kejauhan, sangat pelan
function burungJauh(ctx, dest, level) {
    const f = 380 + Math.random() * 120;
    nadaAlam(ctx, dest, f, f * 0.9, { level, attack: 0.15, dur: 0.7 });
    setTimeout(() => nadaAlam(ctx, dest, f * 0.95, f * 0.85, { level: level * 0.8, attack: 0.15, dur: 0.8 }), 900);
}

// Lonceng angin: nada logam yang panjang
function lonceng(ctx, dest, midi, level) {
    softNote(ctx, dest, hz(midi), ctx.currentTime, { attack: 0.004, decay: 4, level, partials: [[1, 1], [2.76, 0.25], [5.4, 0.08]] });
}

// Pembungkus: jalankan generator lain dengan volume lebih kecil
function lebihPelan(ctx, r, out, level) {
    const g = gainNode(ctx, r, level);
    g.connect(out);
    return g;
}

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

    // ===== Suara alam =====

    hujan_lembut: (ctx, out, r) => dasarHujan(ctx, r, out, 1),

    ombak_jauh: (ctx, out, r) => dasarOmbak(ctx, r, out, 0.5),

    angin_sore: (ctx, out, r) => dasarAngin(ctx, r, out, 0.45),

    // Air mengalir pelan dengan gelembung kecil yang empuk
    sungai_kecil: (ctx, out, r) => {
        lapisan(ctx, r, out, { jenis: "pink", tipe: "bandpass", freq: 800, Q: 0.7, level: 0.65 });
        const kilau = lapisan(ctx, r, out, { jenis: "pink", tipe: "bandpass", freq: 1600, Q: 1, level: 0.08 });
        r.lfo(2, 0.03, kilau.g.gain);
        const lp = filter(ctx, r, "lowpass", 1500);
        lp.connect(out);
        r.loop(() => {
            const f = 300 + Math.random() * 250;
            nadaAlam(ctx, lp, f, f * 1.5, { level: 0.03, attack: 0.012, dur: 0.12 });
        }, 150, 600);
    },

    // Udara malam yang tenang, jangkrik jauh, dan burung sesekali
    malam_tenang: (ctx, out, r) => {
        lapisan(ctx, r, out, { jenis: "brown", tipe: "lowpass", freq: 250, level: 0.3 });
        const jauh = filter(ctx, r, "lowpass", 5000);
        const jg = gainNode(ctx, r, 1);
        jauh.connect(jg);
        jg.connect(out);
        r.loop(() => {
            const f = 3900 + Math.random() * 400;
            [0, 0.07, 0.14].forEach((d) =>
                setTimeout(() => nadaAlam(ctx, jauh, f, f, { level: 0.006, attack: 0.008, dur: 0.035 }), d * 1000)
            );
        }, 900, 1700);
        r.loop(() => burungJauh(ctx, jauh, 0.03), 12000, 20000);
    },

    // Gerimis di hutan dengan suara burung jauh
    gerimis_hutan: (ctx, out, r) => {
        dasarHujan(ctx, r, out, 0.75, 300);
        dasarAngin(ctx, r, out, 0.25);
        const lp = filter(ctx, r, "lowpass", 1500);
        lp.connect(out);
        r.loop(() => burungJauh(ctx, lp, 0.035), 9000, 16000);
    },

    // Api unggun: gemuruh hangat dan letupan kayu yang halus
    api_unggun: (ctx, out, r) => {
        const dasar = lapisan(ctx, r, out, { jenis: "brown", tipe: "lowpass", freq: 400, level: 0.32 });
        r.lfo(0.1, 0.06, dasar.g.gain);
        const bp = filter(ctx, r, "bandpass", 1800, 1);
        const lp = filter(ctx, r, "lowpass", 3000);
        bp.connect(lp);
        lp.connect(out);
        r.loop(() => {
            const t = ctx.currentTime;
            const s = ctx.createBufferSource();
            s.buffer = r.buffer("pink");
            const g = ctx.createGain();
            const lvl = 0.1 + Math.random() * 0.2;
            g.gain.setValueAtTime(0.0001, t);
            g.gain.exponentialRampToValueAtTime(lvl, t + 0.003);
            g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
            s.connect(g);
            g.connect(bp);
            s.start(t, Math.random() * 7, 0.06);
        }, 90, 700);
    },

    // Hujan pelan dengan akor piano yang datang sesekali
    hujan_piano: (ctx, out, r) => {
        dasarHujan(ctx, r, out, 0.8);
        BUILDERS.selimut_malam(ctx, lebihPelan(ctx, r, out, 0.6), r);
    },

    // Angin dengan lonceng angin yang berdenting lembut
    lonceng_angin: (ctx, out, r) => {
        dasarAngin(ctx, r, out, 0.5);
        const bus = reverbBus(ctx, out, r, { seconds: 4, wet: 0.5, tone: 5000 });
        const nada = [72, 74, 76, 79, 81, 84, 86];
        r.loop(() => {
            const jumlah = 1 + Math.floor(Math.random() * 3);
            for (let i = 0; i < jumlah; i++) {
                const m = nada[Math.floor(Math.random() * nada.length)];
                setTimeout(() => lonceng(ctx, bus, m, 0.05 + Math.random() * 0.04), i * (150 + Math.random() * 250));
            }
        }, 1800, 5000);
    },

    // Ombak jauh dengan petikan harpa pelan
    ombak_harpa: (ctx, out, r) => {
        dasarOmbak(ctx, r, out, 0.45);
        BUILDERS.harpa_malam(ctx, lebihPelan(ctx, r, out, 0.6), r);
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

            rig = createRig(ctx);
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