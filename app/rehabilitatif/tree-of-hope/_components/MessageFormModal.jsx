"use client";

import { useEffect, useState } from "react";
import { Send, ChevronDown} from "lucide-react";
import Modal from "@/components/modals/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { treeOfHopeContent as t } from "@/content/labels";
import { MAX_MESSAGE_LENGTH, EDIT_WINDOW_MINUTES, LOCATIONS_URL } from "@/lib/tree-of-hope/constants";
import LocationCombobox from "./LocationCombobox";

let groupsCache = null; // daftar daerah diambil sekali per kunjungan halaman
let draft = { text: "", role: "", location: "", agreed: false }; // draf pesan baru yang belum terkirim

export default function MessageFormModal({ open, editing, onClose, onSubmit, onEmpty }) {
  return (
    <Modal open={open} onClose={onClose} size="lg" bare>
      {open && (
        <MessageForm
          key={editing ? `edit-${editing.id}` : "new"} // pasang ulang tiap mode/pesan berganti
          editing={editing}
          onClose={onClose}
          onSubmit={onSubmit}
          onEmpty={onEmpty}
        />
      )}
    </Modal>
  );
}

function MessageForm({ editing, onClose, onSubmit, onEmpty }) {
  const init = editing
    ? { text: editing.text ?? "", role: editing.role ?? "", location: editing.location ?? "", agreed: false }
    : draft;

  const [text, setText] = useState(init.text);
  const [role, setRole] = useState(init.role);
  const [location, setLocation] = useState(init.location);
  const [agreed, setAgreed] = useState(init.agreed);
  const [groups, setGroups] = useState(groupsCache ?? []);
  const [locError, setLocError] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!editing) draft = { text, role, location, agreed };
  }, [editing, text, role, location, agreed]);

  useEffect(() => {
    if (groupsCache) return;
    fetch(LOCATIONS_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`locations ${r.status}`);
        return r.json();
      })
      .then((j) => {
        groupsCache = j.data ?? [];
        setGroups(groupsCache);
      })
      .catch((err) => console.error("[locations]", err));
  }, []);

  // Daerah lama yang tidak ada di daftar (mis. pesan sebelum ada dropdown)
  const known = new Set(groups.flatMap((g) => [g.province, ...g.cities]));
  const legacy = Boolean(location) && groups.length > 0 && !known.has(location);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return onEmpty();
    if (legacy) {
      setLocError(t.location.notInList(location));
      return;
    }
    setLocError("");

    setSending(true);
    const ok = await onSubmit({ text: text.trim(), role, location });
    setSending(false);
    if (ok && !editing) draft = { text: "", role: "", location: "", agreed: false };
  }

  const canSubmit = !sending && (Boolean(editing) || agreed);

  return (
    // Form mengisi tinggi dialog: bagian atas scroll, footer tetap di bawah (bukan sticky).
    <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-6">
        <h2 className="text-xl font-bold text-svarati-teal">{editing ? t.form.editTitle : t.form.title}</h2>
        <p className="text-sm text-svarati-lavender-dark">{t.form.info}</p>

        <div className="space-y-1.5">
          <Label htmlFor="toh-message" className="text-svarati-teal">
            {t.form.messageLabel}
          </Label>
          <Input
            id="toh-message"
            variant="textarea"
            tone="coral"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={MAX_MESSAGE_LENGTH}
            placeholder={t.form.messagePlaceholder}
          />
          <p className="text-right text-xs text-svarati-lavender-dark">
            {text.length}/{MAX_MESSAGE_LENGTH}
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="toh-role" className="text-svarati-teal">
            {t.form.roleLabel}
          </Label>
          <div className="relative">
            <select
              id="toh-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full appearance-none rounded-xl border border-input bg-card py-2 pl-3 pr-10 text-svarati-teal"
            >
              <option value="">{t.form.rolePlaceholder}</option>
              {t.roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-svarati-teal"
            />
          </div>
        </div>

        <div>
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
        </div>

        {!editing && (
          <>
            <p className="rounded-xl bg-svarati-lavender-light p-3 text-xs text-svarati-lavender-dark">
              {t.form.note(EDIT_WINDOW_MINUTES)}
            </p>
            <label className="flex items-start gap-2 text-sm text-svarati-teal">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-svarati-teal"
              />
              <span>{t.form.terms}</span>
            </label>
          </>
        )}
      </div>

      <div className="flex shrink-0 gap-3 border-t border-svarati-lavender-light bg-white px-6 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={!canSubmit}
          className="rounded-full px-7 font-bold"
          icon={<Send size={16} aria-hidden="true" />}
          iconPosition="right"
        >
          {sending ? t.form.sending : editing ? t.form.save : t.form.submit}
        </Button>
        <Button type="button" variant="ghost" size="lg" className="rounded-full px-5" onClick={onClose} disabled={sending}>
          {t.form.cancel}
        </Button>
      </div>
    </form>
  );
}
