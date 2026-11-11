"use client";

import { Dialog } from "@base-ui/react/dialog";
import {
    ALargeSmall,
    ListChevronsUpDown,
    Space,
    Text,
    TextAlignCenter,
    TextAlignEnd,
    TextAlignJustify,
    TextAlignStart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAccessibility, PILIHAN_UKURAN } from "@/context/AccessibilityContext";
import { AKSESIBILITAS as T } from "@/content/labels";
import { speak, stopSpeaking } from "@/lib/speech";

const IKON_RATA = {
    kiri: TextAlignStart,
    tengah: TextAlignCenter,
    kanan: TextAlignEnd,
    penuh: TextAlignJustify,
};

// Satu baris pengaturan: judul dengan ikon, lalu deretan tombol pilihan
function OptionGroup({ id, Icon, nama, children }) {
    return (
        <div className="py-4">
            <p id={`${id}-label`} className="flex items-center gap-2 font-semibold">
                <Icon className="size-5 shrink-0" aria-hidden="true" /> {nama}
            </p>
            <div role="group" aria-labelledby={`${id}-label`} className="mt-3 flex flex-wrap gap-2">
                {children}
            </div>
        </div>
    );
}

// Tombol pilihan; aria-pressed memberi tahu screen reader pilihan mana yang aktif
function OptionButton({ active, onClick, className, ...props }) {
    return (
        <Button
            type="button"
            variant={active ? "secondary" : "ghost"}
            size="md"
            aria-pressed={active}
            onClick={onClick}
            className={className}
            {...props}
        />
    );
}

// Pengaturan Kecil / Normal / Besar (ukuran teks, tinggi baris, spasi teks)
function SizeGroup({ id, Icon, nama, value, onChange }) {
    return (
        <OptionGroup id={id} Icon={Icon} nama={nama}>
            {PILIHAN_UKURAN.map((pilihan) => (
                <OptionButton
                    key={pilihan}
                    active={value === pilihan}
                    onClick={() => onChange(pilihan)}
                    className="min-w-20"
                >
                    {T.ukuran[pilihan]}
                </OptionButton>
            ))}
        </OptionGroup>
    );
}

function SwitchRow({ id, nama, desk, checked, onChange }) {
    return (
        <div className="flex items-center justify-between gap-4 py-4">
            <div>
                <p id={`${id}-label`} className="font-semibold">
                    {nama}
                </p>
                <p className="text-sm text-muted-foreground">{desk}</p>
            </div>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                aria-labelledby={`${id}-label`}
                onClick={onChange}
                className={`relative h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-svarati-lavender-border transition ${checked ? "bg-svarati-lavender-dark" : "bg-white"
                    }`}
            >
                <span
                    aria-hidden="true"
                    className={`absolute top-0.5 size-5 rounded-full transition-all ${checked ? "left-5 bg-white" : "left-0.5 bg-svarati-lavender-border"
                        }`}
                />
            </button>
        </div>
    );
}

export default function AccessibilityModal() {
    const { isOpen, setOpen, settings, toggle, set, reset } = useAccessibility();

    // Klik pilihan rata yang sedang aktif = kembali ke rata bawaan halaman
    const pilihRata = (rata) => set("textAlign", settings.textAlign === rata ? null : rata);
    const statusRata = settings.textAlign
        ? T.rataTulisan.pilihan[settings.textAlign]
        : T.rataTulisan.bawaan;

    return (
        <Dialog.Root open={isOpen} onOpenChange={setOpen}>
            <Dialog.Portal>
                <Dialog.Backdrop className="fixed inset-0 z-[100] bg-black/50" />
                <Dialog.Popup className="fixed left-1/2 top-1/2 z-[101] max-h-[90vh] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 overflow-y-auto -translate-y-1/2 rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-xl">
                    <div className="flex items-start justify-between gap-4">
                        <Dialog.Title className="text-xl font-bold">{T.judul}</Dialog.Title>
                        <Dialog.Close
                            aria-label={T.tutup}
                            className="cursor-pointer rounded-full px-2 py-1 text-lg leading-none hover:bg-muted"
                        >
                            ✕
                        </Dialog.Close>
                    </div>

                    <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                        {T.deskripsi}
                    </Dialog.Description>

                    <div className="mt-2 divide-y divide-border">
                        <SwitchRow
                            id="a11y-kontras"
                            nama={T.kontras.nama}
                            desk={T.kontras.desk}
                            checked={settings.highContrast}
                            onChange={() => toggle("highContrast")}
                        />
                        <SwitchRow
                            id="a11y-gelap"
                            nama={T.gelap.nama}
                            desk={T.gelap.desk}
                            checked={settings.darkMode}
                            onChange={() => toggle("darkMode")}
                        />
                        <SwitchRow
                            id="a11y-sr"
                            nama={T.screenReader.nama}
                            desk={T.screenReader.desk}
                            checked={settings.screenReader}
                            onChange={() => {
                                const aktif = !settings.screenReader;
                                toggle("screenReader");
                                if (aktif) {
                                    speak(`${T.screenReader.nama} ${T.statusAktif}`);
                                } else {
                                    stopSpeaking();
                                }
                            }}
                        />
                        <SizeGroup
                            id="a11y-ukuran-teks"
                            Icon={ALargeSmall}
                            nama={T.ukuranTeks.nama}
                            value={settings.fontSize}
                            onChange={(v) => set("fontSize", v)}
                        />
                        <SizeGroup
                            id="a11y-tinggi-baris"
                            Icon={ListChevronsUpDown}
                            nama={T.tinggiBaris.nama}
                            value={settings.lineHeight}
                            onChange={(v) => set("lineHeight", v)}
                        />
                        <SizeGroup
                            id="a11y-spasi-teks"
                            Icon={Space}
                            nama={T.spasiTeks.nama}
                            value={settings.letterSpacing}
                            onChange={(v) => set("letterSpacing", v)}
                        />
                        <OptionGroup id="a11y-rata" Icon={Text} nama={T.rataTulisan.nama}>
                            {Object.entries(T.rataTulisan.pilihan).map(([rata, label]) => {
                                const Ikon = IKON_RATA[rata];
                                return (
                                    <OptionButton
                                        key={rata}
                                        active={settings.textAlign === rata}
                                        onClick={() => pilihRata(rata)}
                                        aria-label={label}
                                        title={label}
                                        className="size-11 p-0"
                                    >
                                        <Ikon className="size-5" aria-hidden="true" />
                                    </OptionButton>
                                );
                            })}
                        </OptionGroup>
                    </div>

                    {/* Diumumkan screen reader setiap kali pengaturan berubah */}
                    <p role="status" className="sr-only">
                        {T.kontras.nama} {settings.highContrast ? T.statusAktif : T.statusMati}.{" "}
                        {T.gelap.nama} {settings.darkMode ? T.statusAktif : T.statusMati}.{" "}
                        {T.screenReader.nama} {settings.screenReader ? T.statusAktif : T.statusMati}.{" "}
                        {T.ukuranTeks.nama}: {T.ukuran[settings.fontSize]}.{" "}
                        {T.tinggiBaris.nama}: {T.ukuran[settings.lineHeight]}.{" "}
                        {T.spasiTeks.nama}: {T.ukuran[settings.letterSpacing]}.{" "}
                        {T.rataTulisan.nama}: {statusRata}.
                    </p>

                    <div className="mt-4 flex justify-end">
                        <Button variant="tertiary" onClick={reset}>
                            {T.aturUlang}
                        </Button>
                    </div>
                </Dialog.Popup>
            </Dialog.Portal>
        </Dialog.Root>
    );
}