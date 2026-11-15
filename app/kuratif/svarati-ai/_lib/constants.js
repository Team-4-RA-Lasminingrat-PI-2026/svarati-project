import { MENU_UTAMA } from "@/content/labels";

export const MAX_LENGTH = 500;
export const COUNTER_FROM = 400;

const MENU_ASSISTANCE = MENU_UTAMA.find((m) => m.id === "pendampingan");
const MENU_RECOVERY = MENU_UTAMA.find((m) => m.id === "pemulihan");

// Tujuan tautan rujukan dari backend (type: layanan | pemulihan). Artikel dibentuk di ReferenceList.
export const REFERENCE_SERVICES = {
  href: MENU_ASSISTANCE.submenu.find((s) => s.id === "cari-layanan").href,
  label: "Cari layanan terdekat",
};
export const REFERENCE_RECOVERY = { href: MENU_RECOVERY.href, label: "Buka ruang pemulihan" };

// Hanya jawaban RAG dan tanpa_sumber yang bisa dinilai
export const MODE_FEEDBACK = new Set(["rag", "tanpa_sumber"]);

// Batas teks alasan penilaian (sama dengan MAX_REASON_TEXT_LENGTH di backend/storage.py)
export const MAX_REASON_LENGTH = 200;
