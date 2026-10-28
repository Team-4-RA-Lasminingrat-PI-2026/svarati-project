"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardTitle, CardDescription } from "@/components/Card";
import { Button, buttonVariants } from "@/components/ui/button";
import { X, Leaf, Trash2, Check, Pencil } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const STORAGE_KEY = "svarati-mood-history";
const NOTES_KEY = "svarati-mood-notes";
const MAX_NOTE = 1000;

// Mulai dari kosong, hanya check-in yang benar-benar dicatat yang tampil
const initialMoods = {};

const moodDetails = {
    "😡": {
        label: "Marah",
        quote: '"Rasanya aku ingin meledak dan marah pada keadaan."',
        rekomendasi:
            "Kemarahanmu adalah bentuk pertahanan diri yang wajar. Cobalah teknik grounding (5-4-3-2-1) untuk mengembalikan kendali tubuhmu.",
        actionText: "Coba Latihan Grounding →",
        href: "/rehabilitatif/training",
    },
    "😨": {
        label: "Takut",
        quote: '"Aku merasa tidak aman dan terus waspada."',
        rekomendasi:
            "Rasa takut ini nyata, tapi kamu sedang berada di ruang yang aman sekarang. Latihan pernapasan 4-7-8 bisa membantu menurunkan detak jantungmu.",
        actionText: "Coba Latihan Breathing →",
        href: "/rehabilitatif/training",
    },
    "😭": {
        label: "Sedih",
        quote: '"Kenapa aku harus mengalami ini?"',
        rekomendasi:
            "Kamu sedang merasakan beban yang berat hari ini. Itu tidak apa-apa, perasaanmu valid. Latihan pernapasan sekarang bisa membantu menenangkan tubuhmu.",
        actionText: "Coba Latihan Breathing/Grounding →",
        href: "/rehabilitatif/training",
    },
    "😔": {
        label: "Cemas",
        quote: '"Pikiranku berpacu dan aku merasa gelisah."',
        rekomendasi:
            "Kecemasan sering membuat kita memikirkan masa depan. Mari kembali ke saat ini. Menulis jurnal atau teknik mindfulness bisa sangat membantu.",
        actionText: "Coba Latihan Mindfulness →",
        href: "/rehabilitatif/training",
    },
    "😐": {
        label: "Biasa Saja",
        quote: '"Hari ini berlalu begitu saja, terasa hampa."',
        rekomendasi:
            "Tidak merasakan emosi yang kuat juga bagian dari proses. Kamu bisa membaca beberapa artikel edukasi ringan untuk mengisi waktu.",
        actionText: "Lihat Edukasi Ringan →",
        href: "/preventif/edu",
    },
    "🙂": {
        label: "Cukup Baik",
        quote: '"Aku merasa sedikit lebih tenang hari ini."',
        rekomendasi:
            "Ini adalah progres yang bagus! Pertahankan rutinitas pemulihanmu. Kamu mungkin ingin mengeksplorasi modul Tree of Hope hari ini.",
        actionText: "Buka Tree of Hope →",
        href: "/rehabilitatif/treeofhope",
    },
    "😀": {
        label: "Sangat Baik",
        quote: '"Aku merasa kuat dan berdaya hari ini!"',
        rekomendasi:
            "Luar biasa! Momen seperti ini sangat berharga. Catat apa yang membuatmu merasa baik hari ini agar bisa jadi pengingat di hari yang berat.",
        actionText: "Buka Tree of Hope →",
        href: "/rehabilitatif/treeofhope",
    },
};

// Hitung hari berturut-turut yang berakhir di check-in terakhir
function computeStreak(moods) {
    const keys = Object.keys(moods).sort();
    if (keys.length === 0) return 0;

    let count = 1;
    for (let i = keys.length - 1; i > 0; i--) {
        const curr = new Date(keys[i] + "T00:00:00");
        const prev = new Date(keys[i - 1] + "T00:00:00");
        const diffDays = Math.round((curr - prev) / (24 * 60 * 60 * 1000));
        if (diffDays === 1) count++;
        else break;
    }
    return count;
}

export default function PemulihanPage() {
    const [date, setDate] = useState(new Date());
    const [activeMoodEmoji, setActiveMoodEmoji] = useState(null);
    const [moodHistory, setMoodHistory] = useState(initialMoods);
    const [noteHistory, setNoteHistory] = useState({});
    const [noteDraft, setNoteDraft] = useState("");
    const [noteSaved, setNoteSaved] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const dateKey = date ? format(date, "yyyy-MM-dd") : null;

    // Load dari localStorage sekali saat mount
    useEffect(() => {
        try {
            const savedMoods = localStorage.getItem(STORAGE_KEY);
            if (savedMoods) setMoodHistory(JSON.parse(savedMoods));
            const savedNotes = localStorage.getItem(NOTES_KEY);
            if (savedNotes) setNoteHistory(JSON.parse(savedNotes));
        } catch { }
        setLoaded(true);
    }, []);

    // Simpan mood setiap kali berubah (setelah load selesai)
    useEffect(() => {
        if (!loaded) return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(moodHistory));
        } catch { }
    }, [moodHistory, loaded]);

    // Simpan catatan setiap kali berubah (setelah load selesai)
    useEffect(() => {
        if (!loaded) return;
        try {
            localStorage.setItem(NOTES_KEY, JSON.stringify(noteHistory));
        } catch { }
    }, [noteHistory, loaded]);

    // Sinkronkan emoji aktif dengan tanggal yang dipilih
    useEffect(() => {
        setActiveMoodEmoji(dateKey ? moodHistory[dateKey] ?? null : null);
    }, [dateKey, moodHistory]);

    // Muat catatan tanggal yang dipilih ke kolom ketik
    useEffect(() => {
        setNoteDraft(dateKey ? noteHistory[dateKey] ?? "" : "");
        setNoteSaved(false);
        setIsEditing(false); // pindah tanggal = kembali ke mode baca
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateKey, loaded]);

    const handleSelectMood = (emoji) => {
        if (!dateKey) return;
        setActiveMoodEmoji(emoji);
        setMoodHistory((prev) => ({ ...prev, [dateKey]: emoji }));
    };

    const handleSaveNote = () => {
        if (!dateKey) return;
        const text = noteDraft.trim();
        setNoteHistory((prev) => {
            const next = { ...prev };
            if (text) next[dateKey] = text;
            else delete next[dateKey]; // kolom dikosongkan = hapus catatan hari itu
            return next;
        });
        setNoteDraft(text);
        setIsEditing(false); // setelah disimpan, tampil mode baca
        setNoteSaved(true);
        setTimeout(() => setNoteSaved(false), 2000);
    };

    const handleStartEdit = () => {
        setNoteDraft(noteHistory[dateKey] ?? "");
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setNoteDraft(noteHistory[dateKey] ?? "");
        setIsEditing(false);
    };

    const handleClearAll = () => {
        if (window.confirm("Hapus semua data mood dan catatan dari perangkat ini?")) {
            setMoodHistory({});
            setNoteHistory({});
            setNoteDraft("");
            setIsEditing(false);
            setActiveMoodEmoji(null);
            try {
                localStorage.removeItem(STORAGE_KEY);
                localStorage.removeItem(NOTES_KEY);
            } catch { }
        }
    };

    const streakCount = computeStreak(moodHistory);

    // 7 hari terakhir sampai hari ini; emoji sesuai mood yang dicatat tiap hari
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const key = format(d, "yyyy-MM-dd");
        const emoji = moodHistory[key] ?? null;
        return {
            key,
            emoji,
            title: emoji
                ? `${format(d, "EEEE, d MMM", { locale: id })}: ${moodDetails[emoji]?.label ?? ""}`
                : `${format(d, "EEEE, d MMM", { locale: id })}: belum check-in`,
        };
    });

    const currentDetail = activeMoodEmoji ? moodDetails[activeMoodEmoji] : null;
    const savedNote = dateKey ? noteHistory[dateKey] ?? "" : "";
    const showEditor = isEditing || !savedNote;
    const hasUnsavedChange = noteDraft.trim() !== savedNote;

    return (
        // pt-28 / md:pt-36 memberi ruang untuk navbar yang melayang di atas
        <main className="min-h-screen bg-svarati-cream px-4 pb-8 pt-24 font-sans md:px-8 md:pb-12 lg:px-12">
            <div className="mx-auto max-w-4xl space-y-8">
                {/* Header: badge + ajakan healing journey */}
                <div className="max-w-2xl">
                    <span className="mb-5 inline-block rounded-full bg-svarati-coral/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-svarati-coral">
                        Healing Journey
                    </span>
                    <h1 className="mb-5 text-4xl font-bold leading-tight text-svarati-teal font-heading md:text-5xl">
                        Mulai Healing Journey-mu, Selangkah Demi Selangkah
                    </h1>
                    <p className="text-lg leading-relaxed text-svarati-coral">
                        Kamu berhak pulih dengan ritmemu sendiri... Check-in emosi harianmu,
                        temukan latihan yang sesuai, dan bergabung bersama komunitas untuk
                        saling memberi dukungan antar penyintas.
                    </p>
                </div>

                {/* Kartu progres */}
                <Card variant="solid" className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/10 rounded-xl">
                            <Leaf className="size-8 text-svarati-cream" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-svarati-cream/80 uppercase tracking-wider mb-1">
                                Progresmu
                            </p>
                            <h2 className="text-2xl font-bold text-white mb-1">
                                {streakCount > 0
                                    ? `${streakCount} hari check-in beruntun`
                                    : "Belum ada check-in"}
                            </h2>
                            <p className="text-sm text-svarati-cream/80">
                                {streakCount > 0
                                    ? "Terus lanjutkan, setiap hari berarti."
                                    : "Pilih tanggal dan catat perasaanmu untuk memulai."}
                            </p>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-2">
                        {last7Days.map(({ key, emoji, title }) => (
                            <span
                                key={key}
                                title={title}
                                className="flex size-9 items-center justify-center text-2xl"
                            >
                                {emoji ? emoji : <span className="size-2 rounded-full bg-white/25" />}
                            </span>
                        ))}
                    </div>
                </Card>

                <p className="text-center text-sm text-svarati-teal/60 font-medium">
                    Klik tanggal untuk mencatat atau melihat mood
                </p>

                {/* Kalender */}
                <Card variant="white" size="lg" className="mx-auto w-full max-w-3xl p-4 sm:p-8">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        locale={id}
                        moodData={moodHistory}
                    />
                </Card>

                {/* Panel check-in */}
                {dateKey && (
                    <Card
                        variant="white"
                        size="lg"
                        className="mx-auto max-w-3xl relative animate-in slide-in-from-bottom-4 fade-in duration-300"
                    >
                        <button
                            onClick={() => setDate(undefined)}
                            className="absolute right-6 top-6 text-gray-400 hover:text-gray-600"
                            aria-label="Tutup"
                        >
                            <X className="size-5" />
                        </button>

                        <p className="text-sm font-medium text-gray-400 mb-1">{dateKey}</p>
                        <CardTitle>Bagaimana perasaanmu hari ini?</CardTitle>

                        <div className="flex justify-between items-start my-6 px-2 md:px-8">
                            {Object.keys(moodDetails).map((emojiKey) => {
                                const isActive = activeMoodEmoji === emojiKey;
                                return (
                                    <div key={emojiKey} className="flex flex-col items-center gap-1">
                                        <button
                                            onClick={() => handleSelectMood(emojiKey)}
                                            className={`text-4xl transition-transform hover:scale-110 ${isActive ? "scale-110 drop-shadow-md" : "opacity-60 grayscale"
                                                }`}
                                        >
                                            {emojiKey}
                                        </button>
                                        <span
                                            className={`text-xs ${isActive ? "font-bold text-svarati-teal" : "text-gray-400"
                                                }`}
                                        >
                                            {moodDetails[emojiKey].label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {!currentDetail ? (
                            <div className="mt-6 text-center text-gray-400 py-8 border-t border-gray-100">
                                Pilih emoji di atas untuk menyimpan perasaanmu hari ini.
                            </div>
                        ) : (
                            <>
                                <div className="mt-6 flex items-start gap-4">
                                    <span className="text-4xl">{activeMoodEmoji}</span>
                                    <div>
                                        <h4 className="font-bold text-svarati-teal text-lg">
                                            {currentDetail.label}
                                        </h4>
                                        <p className="text-gray-400 italic">{currentDetail.quote}</p>
                                    </div>
                                </div>

                                {/* Catatan: mode tulis atau mode baca */}
                                {showEditor ? (
                                    <div className="mt-6">
                                        <label
                                            htmlFor="mood-note"
                                            className="mb-2 block text-sm font-bold text-svarati-teal"
                                        >
                                            Ceritakan lebih detail (opsional)
                                        </label>
                                        <textarea
                                            id="mood-note"
                                            value={noteDraft}
                                            onChange={(e) => {
                                                setNoteDraft(e.target.value.slice(0, MAX_NOTE));
                                                setNoteSaved(false);
                                            }}
                                            rows={5}
                                            maxLength={MAX_NOTE}
                                            autoFocus={isEditing}
                                            placeholder="Tulis apa yang kamu rasakan hari ini, apa yang terjadi, atau apa pun yang ingin kamu keluarkan. Hanya kamu yang bisa melihatnya di perangkat ini."
                                            className="w-full resize-y rounded-2xl border border-svarati-teal/20 bg-white p-4 text-sm leading-relaxed text-svarati-teal placeholder:text-gray-400 focus:border-svarati-teal focus:outline-none focus:ring-2 focus:ring-svarati-teal/20"
                                        />
                                        <div className="mt-2 flex items-center justify-between gap-3">
                                            <span className="text-xs text-gray-400">
                                                {noteDraft.length}/{MAX_NOTE}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                {savedNote && (
                                                    <Button variant="ghost" size="md" onClick={handleCancelEdit}>
                                                        Batal
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="secondary"
                                                    size="md"
                                                    onClick={handleSaveNote}
                                                    disabled={!hasUnsavedChange}
                                                >
                                                    Simpan catatan
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-6 rounded-2xl border border-svarati-teal/20 bg-svarati-cream p-5">
                                        <div className="mb-2 flex items-center justify-between gap-3">
                                            <p className="text-sm font-bold text-svarati-teal">
                                                Catatanmu hari ini
                                            </p>
                                            {noteSaved && (
                                                <span className="flex items-center gap-1 text-xs font-medium text-svarati-teal">
                                                    <Check className="size-3.5" /> Tersimpan
                                                </span>
                                            )}
                                        </div>
                                        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-svarati-teal/90">
                                            {savedNote}
                                        </p>
                                        <div className="mt-4 flex justify-end">
                                            <Button
                                                variant="ghost"
                                                size="md"
                                                icon={<Pencil className="size-3.5" />}
                                                onClick={handleStartEdit}
                                            >
                                                Edit catatan
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                <Card variant="cream" className="mt-6 border-svarati-teal/20">
                                    <p className="font-bold text-svarati-teal text-sm mb-2 flex items-center gap-2">
                                        💡 Rekomendasi Untukmu
                                    </p>
                                    <CardDescription>{currentDetail.rekomendasi}</CardDescription>
                                </Card>

                                {/* Tombol ungu: variant soft dari Button, berupa link */}
                                <Link
                                    href={currentDetail.href}
                                    className={buttonVariants({
                                        variant: "soft",
                                        size: "xl",
                                        fullWidth: true,
                                        className: "mt-6",
                                    })}
                                >
                                    {currentDetail.actionText}
                                </Link>
                            </>
                        )}
                    </Card>
                )}

                {/* Hapus data */}
                <div className="flex justify-center">
                    <button
                        onClick={handleClearAll}
                        className="flex items-center gap-2 text-xs text-svarati-teal/60 hover:text-svarati-teal"
                    >
                        <Trash2 className="size-3.5" />
                        Hapus data mood dan catatan dari perangkat ini
                    </button>
                </div>
            </div>
        </main>
    );
}