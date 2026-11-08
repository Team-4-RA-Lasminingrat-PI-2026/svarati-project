"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Button } from "@/components/ui/button";
import { useAccessibility } from "@/context/AccessibilityContext";
import { AKSESIBILITAS as T } from "@/content/labels";
import { speak, stopSpeaking } from "@/lib/speech";

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
    const { isOpen, setOpen, settings, toggle, reset } = useAccessibility();

    return (
        <Dialog.Root open={isOpen} onOpenChange={setOpen}>
            <Dialog.Portal>
                <Dialog.Backdrop className="fixed inset-0 z-[100] bg-black/50" />
                <Dialog.Popup className="fixed left-1/2 top-1/2 z-[101] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-xl">
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
                    </div>

                    {/* Diumumkan screen reader setiap kali toggle berubah */}
                    <p role="status" className="sr-only">
                        {T.kontras.nama} {settings.highContrast ? T.statusAktif : T.statusMati}.{" "}
                        {T.screenReader.nama} {settings.screenReader ? T.statusAktif : T.statusMati}.
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