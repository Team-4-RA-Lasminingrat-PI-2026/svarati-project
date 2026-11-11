"use client";

import { useEffect, useRef, useState } from "react";
import { treeOfHopeContent as t } from "@/content/labels";
import {
  MAX_MESSAGE_LENGTH,
  EDIT_WINDOW_MINUTES,
  LOCATIONS_URL,
} from "@/lib/tree-of-hope/constants";
import LocationCombobox from "./LocationCombobox";

let groupsCache = null; // daftar daerah diambil sekali per kunjungan halaman

export default function MessageFormModal({ open, editing, onClose, onSubmit, onEmpty }) {
  // Tulisan pesan baru yang belum terkirim dipertahankan saat form ditutup.
  const draftRef = useRef({ text: "", role: "", location: "", agreed: false });
  if (!open) return null;

  return (
    <MessageForm
      key={editing ? `edit-${editing.id}` : "new"} // pasang ulang tiap mode/pesan berganti
      editing={editing}
      draftRef={draftRef}
      onClose={onClose}
      onSubmit={onSubmit}
      onEmpty={onEmpty}
    />
  );
}

function MessageForm({ editing, draftRef, onClose, onSubmit, onEmpty }) {
  // Nilai awal: pesan yang diedit, atau draf pesan baru
  const init = editing
    ? { text: editing.text ?? "", role: editing.role ?? "", location: editing.location ?? "", agreed: false }
    : draftRef.current;

  const [text, setText] = useState(init.text);
  const [role, setRole] = useState(init.role);
  const [location, setLocation] = useState(init.location);
  const [agreed, setAgreed] = useState(init.agreed);
  const [groups, setGroups] = useState(groupsCache ?? []);
  const [locError, setLocError] = useState("");
  const [sending, setSending] = useState(false);

  // Simpan draf hanya untuk pesan baru
  useEffect(() => {
    if (!editing) draftRef.current = { text, role, location, agreed };
  }, [editing, draftRef, text, role, location, agreed]);

  // Daftar provinsi + kota
  useEffect(() => {
    if (groupsCache) return;
    fetch(LOCATIONS_URL)
      .then((r) => r.json())
      .then((j) => {
        groupsCache = j.data ?? [];
        setGroups(groupsCache);
      })
      .catch(() => {});
  }, []);

  // Semua nilai yang sah (nama provinsi dan nama kota)
  const known = new Set(groups.flatMap((g) => [g.province, ...g.cities]));
  // Daerah lama yang tidak ada di daftar (mis. pesan yang dikirim sebelum ada dropdown)
  const legacy = Boolean(location) && groups.length > 0 && !known.has(location);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && !sending && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sending, onClose]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return onEmpty();
    if (legacy) {
      setLocError(`"${location}" tidak ada di daftar. Pilih daerah dari daftar, atau pilih "Tidak dipilih".`);
      return;
    }
    setLocError("");

    setSending(true);
    const ok = await onSubmit({ text: text.trim(), role, location });
    setSending(false);
    if (ok && !editing) draftRef.current = { text: "", role: "", location: "", agreed: false };
  }

  const field = "mt-1 w-full rounded-xl border border-input bg-card px-3 py-2 text-card-foreground";
  const canSubmit = !sending && (Boolean(editing) || agreed);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => !sending && onClose()}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-label={t.form.title}
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90svh] w-full max-w-lg overflow-y-auto rounded-3xl bg-card p-6 text-card-foreground shadow-xl animate-in fade-in zoom-in-95 duration-200"
      >
        <h2 className="text-2xl font-bold">{editing ? "Ubah pesanmu" : t.form.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t.form.info}</p>

        <label className="mt-4 block text-sm font-semibold">
          {t.form.messageLabel}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={MAX_MESSAGE_LENGTH}
            rows={5}
            placeholder={t.form.messagePlaceholder}
            className={`${field} font-normal`}
            autoFocus
          />
          <span className="mt-1 block text-right text-xs font-normal text-muted-foreground">
            {text.length}/{MAX_MESSAGE_LENGTH}
          </span>
        </label>

        <label className="mt-2 block text-sm font-semibold">
          {t.form.roleLabel}
          <select value={role} onChange={(e) => setRole(e.target.value)} className={`${field} font-normal`}>
            <option value="">{t.form.rolePlaceholder}</option>
            {t.roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>

        <LocationCombobox
  label={t.form.locationLabel}
  value={location}
  onChange={(v) => {
    setLocation(v);
    setLocError("");
  }}
  groups={groups}
  invalid={Boolean(locError)}
/>
{locError && <p className="mt-1 text-xs text-destructive">{locError}</p>}

        {!editing && (
          <>
            <p className="mt-4 rounded-xl bg-accent p-3 text-xs text-accent-foreground">
              Kamu dapat mengubah pesanmu sampai {EDIT_WINDOW_MINUTES} menit setelah dikirim, dari
              perangkat dan peramban yang sama. Setelah itu, pesan akan tersimpan permanen di Pohon
              Svarati.
            </p>
            <label className="mt-3 flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 h-4 w-4 accent-svarati-teal"
              />
              <span>
                Pesanku tidak mengandung unsur SARA, ujaran kebencian, atau kekerasan, dan tidak
                memuat data yang dapat mengidentifikasi seseorang (nama, nomor telepon, alamat, nama
                pelaku). Aku menulisnya untuk memberi motivasi atau inspirasi bagi rekan penyintas.
                Tim Svarati berhak menghapus pesan yang dinilai melanggar ketentuan ini.
              </span>
            </label>
          </>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={sending}
            className="rounded-full px-5 py-2 text-sm font-semibold hover:bg-accent disabled:opacity-50"
          >
            {t.form.cancel}
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {sending ? t.form.sending : editing ? "Simpan perubahan" : t.form.submit}
          </button>
        </div>
      </form>
    </div>
  );
}