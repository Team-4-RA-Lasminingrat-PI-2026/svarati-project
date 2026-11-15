"use client";
import { useState } from "react";
import { useLocalStorageState } from "@/lib/useLocalStorageState";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Check, Pencil } from "lucide-react";
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

// Emoji di sini dipakai sebagai kunci penyimpanan di localStorage.
// Jangan diganti, catatan lama akan kehilangan mood-nya.
const moodDetails = {
    "😡": {
        label: "Marah",
        rekomendasi:
            "Kemarahanmu adalah bentuk pertahanan diri yang wajar. Cobalah teknik grounding (5-4-3-2-1) untuk mengembalikan kendali tubuhmu.",
        actionText: "Coba latihan grounding",
        href: "/rehabilitatif/training/grounding",
    },
    "😨": {
        label: "Takut",
        rekomendasi:
            "Rasa takut ini nyata, tapi kamu sedang berada di ruang yang aman sekarang. Latihan pernapasan 4-7-8 bisa membantu menurunkan detak jantungmu.",
        actionText: "Coba latihan pernapasan",
        href: "/rehabilitatif/training/breathing",
    },
    "😭": {
        label: "Sedih",
        rekomendasi:
            "Kamu sedang merasakan beban yang berat hari ini. Itu tidak apa-apa, perasaanmu valid. Suara yang tenang bisa menemanimu sebentar.",
        actionText: "Dengarkan suara terapi",
        href: "/rehabilitatif/training/sound",
    },
    "😔": {
        label: "Cemas",
        rekomendasi:
            "Napas pelan bisa membantu tubuhmu merasa lebih aman. Mari kembali ke saat ini, biarkan tubuhmu ikut melambat.",
        actionText: "Coba latihan pernapasan",
        href: "/rehabilitatif/training/breathing",
    },
    "😐": {
        label: "Biasa Saja",
        rekomendasi:
            "Hari yang biasa juga layak dicatat. Kamu bisa membaca beberapa artikel edukasi ringan untuk mengisi waktu.",
        actionText: "Lihat edukasi ringan",
        href: "/preventif",
    },
    "🙂": {
        label: "Cukup Baik",
        rekomendasi:
            "Senang mendengarnya. Pertahankan ritme pemulihanmu, dan simpan apa yang membantu hari ini.",
        actionText: "Buka Pohon Harapan",
        href: "/rehabilitatif/tree-of-hope",
    },
    "😀": {
        label: "Sangat Baik",
        rekomendasi:
            "Momen seperti ini berharga. Catat apa yang membuatmu merasa baik hari ini, supaya bisa jadi pengingat di hari yang berat.",
        actionText: "Buka Pohon Harapan",
        href: "/rehabilitatif/tree-of-hope",
    },
};

export default function JurnalPemulihanPage() {
    const [date, setDate] = useState(new Date());
    const [moodHistory, setMoodHistory, removeMoods] = useLocalStorageState(STORAGE_KEY, initialMoods);
    const [noteHistory, setNoteHistory, removeNotes] = useLocalStorageState(NOTES_KEY, EMPTY);
    const [draftHistory, setDraftHistory, removeDrafts] = useLocalStorageState(DRAFTS_KEY, EMPTY);
    // Disimpan sebagai tanggal (bukan true/false), jadi otomatis "reset" saat pindah tanggal
    const [editingKey, setEditingKey] = useState(null);
    const [savedKey, setSavedKey] = useState(null);
    const [confirmTarget, setConfirmTarget] = useState(null); // "day" | "all" | null
    const [notice, setNotice] = useState("");

    const dateKey = date ? format(date, "yyyy-MM-dd") : null;
    const todayKey = format(new Date(), "yyyy-MM-dd");

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

    const handleStartEdit = () => setEditingKey(dateKey);

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

    const currentDetail = activeMoodEmoji ? moodDetails[activeMoodEmoji] : null;
    const showEditor = isEditing || !savedNote;
    const hasUnsavedChange = noteDraft.trim() !== savedNote;
    const hasDayData = Boolean(activeMoodEmoji || savedNote || draft !== undefined);
    const hasAnyData =
        Object.keys(moodHistory).length > 0 ||
        Object.keys(noteHistory).length > 0 ||
        Object.keys(draftHistory).length > 0;

    // Ringkasan bulan yang sedang dilihat, diambil dari bulan tanggal terpilih
    const bulanKey = (dateKey ?? todayKey).slice(0, 7);
    const jumlahBulanIni = new Set(
        [...Object.keys(moodHistory), ...Object.keys(noteHistory)].filter((k) =>
            k.startsWith(bulanKey)
        )
    ).size;

    const namaHari = date ? format(date, "EEEE", { locale: id }) : "";
    const labelHari = dateKey === todayKey ? `Hari ini, ${namaHari}` : namaHari;

    return (
        <main className="relative min-h-screen bg-svarati-cream px-4 pb-12 pt-24 font-sans md:px-8 lg:px-12">
            <BackToPemulihan />

            <div className="mx-auto max-w-5xl">
                <header className="mb-7">
                    <h1 className="mb-1.5 text-3xl font-semibold leading-[1.1] tracking-tight text-svarati-teal md:text-4xl">
                        Jurnal Pemulihan
                    </h1>
                    <p className="text-svarati-teal/70">Hanya tersimpan di perangkat ini.</p>
                </header>

                <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start">
                    {/* Lembar tanggal terpilih */}
                    <section
                        aria-labelledby="judul-tanggal"
                        className="rounded-3xl border border-svarati-lavender-light/60 bg-white p-6 sm:p-8"
                    >
                        <p className="text-sm font-bold text-svarati-coral-dark">{labelHari}</p>
                        <h2
                            id="judul-tanggal"
                            className="mt-0.5 text-2xl font-semibold leading-tight text-svarati-teal sm:text-3xl"
                        >
                            {date ? format(date, "d MMMM yyyy", { locale: id }) : ""}
                        </h2>

                        {/* Pilihan mood */}
                        <p id="tanya-mood" className="mt-6 font-bold text-svarati-teal">
                            Bagaimana perasaanmu?
                        </p>
                        <div
                            role="radiogroup"
                            aria-labelledby="tanya-mood"
                            className="mt-3 grid grid-cols-4 gap-1 sm:grid-cols-7"
                        >
                            {Object.entries(moodDetails).map(([emoji, { label }]) => {
                                const isActive = activeMoodEmoji === emoji;
                                return (
                                    <button
                                        key={emoji}
                                        type="button"
                                        role="radio"
                                        aria-checked={isActive}
                                        onClick={() => handleSelectMood(emoji)}
                                        className="flex cursor-pointer flex-col items-center gap-1.5 rounded-xl py-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-svarati-teal"
                                    >
                                        <span
                                            aria-hidden="true"
                                            className={`grid size-12 place-items-center rounded-full text-3xl leading-none transition ${isActive
                                                ? "bg-svarati-teal-soft ring-2 ring-svarati-teal"
                                                : "opacity-75 grayscale hover:opacity-100 hover:grayscale-0"
                                                }`}
                                        >
                                            {emoji}
                                        </span>
                                        <span
                                            className={`text-center text-xs leading-tight ${isActive
                                                ? "font-bold text-svarati-teal"
                                                : "text-svarati-teal/70"
                                                }`}
                                        >
                                            {label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {!currentDetail ? (
                            <p className="mt-6 text-sm text-svarati-teal/60">
                                Pilih salah satu wajah di atas untuk mencatat perasaanmu.
                            </p>
                        ) : (
                            <>
                                <p className="mt-6 leading-relaxed text-svarati-teal/80">
                                    {currentDetail.rekomendasi}
                                </p>

                                <Link
                                    href={currentDetail.href}
                                    className={buttonVariants({
                                        variant: "soft",
                                        size: "lg",
                                        className: "mt-4",
                                    })}
                                >
                                    {currentDetail.actionText}
                                </Link>

                                {/* Catatan: mode tulis atau mode baca */}
                                {showEditor ? (
                                    <div className="mt-8">
                                        <label
                                            htmlFor="mood-note"
                                            className="mb-2 block font-bold text-svarati-teal"
                                        >
                                            Mau cerita lebih banyak?
                                        </label>
                                        <textarea
                                            id="mood-note"
                                            value={noteDraft}
                                            onChange={(e) => handleChangeNote(e.target.value)}
                                            maxLength={MAX_NOTE}
                                            autoFocus={isEditing}
                                            placeholder="Tulis di sini. Tidak wajib."
                                            // Garis buku: diulang tiap 32px, sama dengan line-height
                                            style={{
                                                lineHeight: "32px",
                                                backgroundAttachment: "local",
                                                backgroundImage:
                                                    "repeating-linear-gradient(transparent, transparent 31px, var(--color-svarati-lavender-light) 31px, var(--color-svarati-lavender-light) 32px)",
                                            }}
                                            className="min-h-48 w-full resize-y border-0 bg-transparent p-0 text-svarati-teal placeholder:text-svarati-teal/40 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-svarati-teal"
                                        />
                                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                                            <span className="text-sm text-svarati-teal/60">
                                                {noteDraft.length}/{MAX_NOTE}
                                                {hasUnsavedChange && " · Belum disimpan"}
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
                                    <div className="mt-8 rounded-2xl border border-svarati-lavender-light/70 bg-svarati-cream p-5">
                                        <div className="mb-2 flex items-center justify-between gap-3">
                                            <p className="font-bold text-svarati-teal">Catatanmu</p>
                                            {noteSaved && (
                                                <span className="flex items-center gap-1 text-xs font-medium text-svarati-coral-dark">
                                                    <Check className="size-3.5" aria-hidden="true" /> Tersimpan
                                                </span>
                                            )}
                                        </div>
                                        <p className="whitespace-pre-wrap break-words leading-relaxed text-svarati-teal/90">
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
                            </>
                        )}

                        {hasDayData && (
                            <div className="mt-6 border-t border-svarati-lavender-light/60 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setConfirmTarget("day")}
                                    className="cursor-pointer text-sm text-svarati-danger underline underline-offset-4 hover:text-svarati-danger-darker"
                                >
                                    Hapus catatan tanggal ini
                                </button>
                            </div>
                        )}
                    </section>

                    {/* Riwayat */}
                    <aside aria-labelledby="judul-riwayat">
                        <h2
                            id="judul-riwayat"
                            className="mb-3 text-xl font-semibold text-svarati-teal"
                        >
                            Riwayat
                        </h2>

                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(d) => d && setDate(d)}
                            locale={id}
                            moodData={moodHistory}
                        />

                        <p className="mt-3 text-sm text-svarati-teal/70">
                            {jumlahBulanIni > 0
                                ? `${jumlahBulanIni} catatan bulan ini`
                                : "Belum ada catatan bulan ini"}
                        </p>

                        {hasAnyData && (
                            <div className="mt-4 border-t border-svarati-lavender-light/60 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setConfirmTarget("all")}
                                    className="cursor-pointer text-sm text-svarati-danger underline underline-offset-4 hover:text-svarati-danger-darker"
                                >
                                    Hapus semua data jurnal
                                </button>
                            </div>
                        )}
                    </aside>
                </div>

                {/* Pesan setelah hapus; selalu ada di halaman supaya dibacakan screen reader */}
                <p
                    role="status"
                    className={`mt-6 text-sm font-medium text-svarati-teal ${notice ? "" : "sr-only"}`}
                >
                    {notice && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 shadow-sm">
                            <Check className="size-4" aria-hidden="true" /> {notice}
                        </span>
                    )}
                </p>
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
