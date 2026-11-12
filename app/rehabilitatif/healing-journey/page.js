"use client";
import React, { useState } from "react";
import { useLocalStorageState } from "@/lib/useLocalStorageState";
import Link from "next/link";
import { Card, CardTitle, CardDescription } from "@/components/Card";
import  Badge  from "@/components/Badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { X, Leaf, Trash2, Check, Pencil } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import ConfirmDialog from "@/components/modals/ConfirmDialog";
import BackToPemulihan from "@/components/BackToPemulihan";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const STORAGE_KEY = "svarati-mood-history";
const NOTES_KEY = "svarati-mood-notes";
// Tulisan yang belum ditekan "Simpan catatan", supaya tidak hilang saat refresh atau tab tertutup
const DRAFTS_KEY = "svarati-mood-drafts";
const MAX_NOTE = 1000;

// Contoh: "Minggu, 8 November 2026"
const formatTanggal = (d) => format(d, "EEEE, d MMMM yyyy", { locale: id });

// Mulai dari kosong, hanya check-in yang benar-benar dicatat yang tampil
const initialMoods = {};
const EMPTY = {};

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
            "Kecemasan sering membuat kita memikirkan masa depan. Mari kembali ke saat ini. Dengarkan musik yang tenang sambil menarik napas pelan, biarkan tubuhmu ikut melambat.",
        actionText: "Dengarkan Suara Terapi →",
        href: "/rehabilitatif/training/sound",
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
    // Semua input jurnal langsung tersimpan di localStorage setiap kali berubah
    const [moodHistory, setMoodHistory, removeMoods] = useLocalStorageState(STORAGE_KEY, initialMoods);
    const [noteHistory, setNoteHistory, removeNotes] = useLocalStorageState(NOTES_KEY, EMPTY);
    const [draftHistory, setDraftHistory, removeDrafts] = useLocalStorageState(DRAFTS_KEY, EMPTY);
    // Disimpan sebagai tanggal (bukan true/false), jadi otomatis "reset" saat pindah tanggal
    const [editingKey, setEditingKey] = useState(null);
    const [savedKey, setSavedKey] = useState(null);
    const [confirmTarget, setConfirmTarget] = useState(null); // "day" | "all" | null
    const [notice, setNotice] = useState("");

    const dateKey = date ? format(date, "yyyy-MM-dd") : null;

    // Nilai turunan: dihitung langsung dari data, tanpa state tambahan
    const activeMoodEmoji = dateKey ? moodHistory[dateKey] ?? null : null;
    const savedNote = dateKey ? noteHistory[dateKey] ?? "" : "";
    const draft = dateKey ? draftHistory[dateKey] : undefined;
    const noteDraft = draft ?? savedNote;
    const isEditing = dateKey !== null && (editingKey === dateKey || draft !== undefined);
    const noteSaved = dateKey !== null && savedKey === dateKey;

    const handleSelectMood = (emoji) => {
        if (!dateKey) return;
        setMoodHistory((prev) => ({ ...prev, [dateKey]: emoji }));
    };

    // Draf disimpan selama isinya berbeda dari catatan tersimpan (termasuk kalau dikosongkan)
    const handleChangeNote = (value) => {
        if (!dateKey) return;
        const text = value.slice(0, MAX_NOTE);
        setSavedKey(null);
        setDraftHistory((prev) => {
            const next = { ...prev };
            if (text !== savedNote) next[dateKey] = text;
            else delete next[dateKey];
            return next;
        });
    };

    const discardDraft = () => {
        setDraftHistory((prev) => {
            const next = { ...prev };
            delete next[dateKey];
            return next;
        });
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
        discardDraft(); // sudah disimpan, draf tidak diperlukan lagi
        setEditingKey(null); // setelah disimpan, tampil mode baca
        setSavedKey(dateKey);
        setTimeout(() => setSavedKey((k) => (k === dateKey ? null : k)), 2000);
    };

    const handleStartEdit = () => {
        setEditingKey(dateKey);
    };

    const handleCancelEdit = () => {
        discardDraft(); // batal = buang draf
        setEditingKey(null);
    };

    // Pesan singkat setelah data dihapus (dibacakan juga oleh screen reader)
    const showNotice = (text) => {
        setNotice(text);
        setTimeout(() => setNotice((n) => (n === text ? "" : n)), 4000);
    };

    // Hapus satu tanggal dari data; kalau datanya jadi kosong, key-nya ikut dihapus dari localStorage
    const removeEntry = (history, setHistory, removeAll) => {
        if (!(dateKey in history)) return;
        const next = { ...history };
        delete next[dateKey];
        if (Object.keys(next).length > 0) setHistory(next);
        else removeAll();
    };

    const handleDeleteDay = () => {
        if (!dateKey) return;
        removeEntry(moodHistory, setMoodHistory, removeMoods);
        removeEntry(noteHistory, setNoteHistory, removeNotes);
        removeEntry(draftHistory, setDraftHistory, removeDrafts);
        setEditingKey(null);
        setSavedKey(null);
        showNotice(`Data tanggal ${formatTanggal(date)} sudah dihapus dari perangkat ini.`);
    };

    const handleClearAll = () => {
        removeMoods();
        removeNotes();
        removeDrafts();
        setEditingKey(null);
        setSavedKey(null);
        showNotice("Semua data mood dan catatan sudah dihapus dari perangkat ini.");
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
    const showEditor = isEditing || !savedNote;
    const hasUnsavedChange = noteDraft.trim() !== savedNote;
    const hasDayData = Boolean(activeMoodEmoji || savedNote || draft !== undefined);
    const hasAnyData =
        Object.keys(moodHistory).length > 0 ||
        Object.keys(noteHistory).length > 0 ||
        Object.keys(draftHistory).length > 0;

    return (
        // pt-28 / md:pt-36 memberi ruang untuk navbar yang melayang di atas
        <main className="min-h-screen bg-svarati-cream px-4 pb-8 pt-24 font-sans md:px-8 md:pb-12 lg:px-12">
            <BackToPemulihan />
            <div className="mx-auto max-w-4xl space-y-8">
                {/* Header: badge + ajakan healing journey */}
                <div className="max-w-2xl">
                   <Badge variant="coral" styleType="soft" className="mb-5">
                        Refleksi Diri
                    </Badge>
                    <h1 className="mb-5 text-4xl font-bold leading-tight text-svarati-teal font-heading md:text-5xl">
                        Mulai Jurnal Pemulihan-mu, Selangkah Demi Selangkah
                    </h1>
                    <p className="text-lg leading-relaxed text-svarati-coral">
                        Kamu berhak pulih dengan ritmemu sendiri... Check-in emosi harianmu,
                        temukan latihan yang sesuai, dan bergabung bersama komunitas untuk
                        saling memberi dukungan antar penyintas.
                    </p>
                </div>

                {/* Kartu progres */}
                <Card variant="coral" className="flex items-center justify-between border-svarati-coral/30 bg-linear-to-r from-svarati-coral-soft via-white to-svarati-coral/20 p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-svarati-coral/20 rounded-xl">
                            <Leaf className="size-8 text-svarati-coral-dark" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-svarati-coral-dark uppercase tracking-wider mb-1">
                                Progresmu
                            </p>
                            <h2 className="text-2xl font-bold text-svarati-teal mb-1">
                                {streakCount > 0
                                    ? `${streakCount} hari check-in beruntun`
                                    : "Belum ada check-in"}
                            </h2>
                            <p className="text-sm text-svarati-teal/80">
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
                                {emoji ? emoji : <span className="size-2 rounded-full bg-svarati-coral/40" />}
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
                                            className={`text-xs ${isActive ? "font-bold text-svarati-coral-dark" : "text-gray-400"
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
                                            onChange={(e) => handleChangeNote(e.target.value)}
                                            rows={5}
                                            maxLength={MAX_NOTE}
                                            autoFocus={isEditing}
                                            placeholder="Tulis apa yang kamu rasakan hari ini, apa yang terjadi, atau apa pun yang ingin kamu keluarkan. Hanya kamu yang bisa melihatnya di perangkat ini."
                                            className="w-full resize-y rounded-2xl border border-svarati-coral/30 bg-white p-4 text-sm leading-relaxed text-svarati-teal placeholder:text-gray-400 focus:border-svarati-coral-dark focus:outline-none focus:ring-2 focus:ring-svarati-coral/25"
                                        />
                                        <div className="mt-2 flex items-center justify-between gap-3">
                                            <span className="text-xs text-gray-400">
                                                {noteDraft.length}/{MAX_NOTE}
                                                {hasUnsavedChange && noteDraft.trim() && " · Draf tersimpan otomatis"}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                {savedNote && (
                                                    <Button variant="ghost" size="md" onClick={handleCancelEdit}>
                                                        Batal
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="primary"
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
                                    <div className="mt-6 rounded-2xl border border-svarati-coral/20 bg-svarati-coral-soft p-5">
                                        <div className="mb-2 flex items-center justify-between gap-3">
                                            <p className="text-sm font-bold text-svarati-teal">
                                                Catatanmu hari ini
                                            </p>
                                            {noteSaved && (
                                                <span className="flex items-center gap-1 text-xs font-medium text-svarati-coral-dark">
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

                                <Card variant="coral" className="mt-6">
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

                        {/* Hapus data tanggal ini saja */}
                        {hasDayData && (
                            <div className="mt-6 flex justify-center border-t border-gray-100 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setConfirmTarget("day")}
                                    className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-svarati-danger hover:bg-svarati-danger-soft"
                                >
                                    <Trash2 className="size-4" />
                                    Hapus data tanggal ini
                                </button>
                            </div>
                        )}
                    </Card>
                )}

                {/* Pesan setelah hapus; selalu ada di halaman supaya dibacakan screen reader */}
                <p
                    role="status"
                    className={`mx-auto max-w-3xl text-center text-sm font-medium text-svarati-teal ${notice ? "" : "sr-only"}`}
                >
                    {notice && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 shadow-sm">
                            <Check className="size-4" /> {notice}
                        </span>
                    )}
                </p>

                {/* Hapus semua data */}
                {hasAnyData && (
                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={() => setConfirmTarget("all")}
                            className="flex items-center gap-2 text-xs text-svarati-teal/60 hover:text-svarati-teal"
                        >
                            <Trash2 className="size-3.5" />
                            Hapus semua data mood dan catatan dari perangkat ini
                        </button>
                    </div>
                )}
            </div>

            <ConfirmDialog
                open={confirmTarget === "day"}
                onOpenChange={(open) => !open && setConfirmTarget(null)}
                title="Hapus data tanggal ini?"
                description={`Mood, catatan, dan draf pada ${date ? formatTanggal(date) : ""} akan dihapus dari perangkat ini dan tidak bisa dikembalikan.`}
                confirmLabel="Ya, hapus"
                onConfirm={handleDeleteDay}
            />
            <ConfirmDialog
                open={confirmTarget === "all"}
                onOpenChange={(open) => !open && setConfirmTarget(null)}
                title="Hapus semua data jurnal?"
                description="Semua mood, catatan, dan draf di perangkat ini akan dihapus dan tidak bisa dikembalikan."
                confirmLabel="Ya, hapus semua"
                onConfirm={handleClearAll}
            />
        </main>
    );
}