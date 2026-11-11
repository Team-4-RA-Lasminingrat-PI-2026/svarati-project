import { MAX_MESSAGE_LENGTH, MAX_LOCATION_LENGTH } from "@/lib/tree-of-hope/constants";
import { treeOfHopeContent } from "@/content/labels";

const URL_PATTERN = /(https?:\/\/|www\.)\S+/i;
const PHONE_PATTERN = /\+?\d[\d\s-]{8,}\d/;

// Mengembalikan { error } atau { value }
export function validateMessage(body) {
  const content = typeof body?.content === "string" ? body.content.trim() : "";
  const role = typeof body?.role === "string" ? body.role.trim() : "";
  const location = typeof body?.location === "string" ? body.location.trim() : "";

  if (!content) return { error: "Pesan wajib diisi." };
  if (content.length > MAX_MESSAGE_LENGTH) {
    return { error: `Pesan maksimal ${MAX_MESSAGE_LENGTH} karakter.` };
  }
  if (URL_PATTERN.test(content) || PHONE_PATTERN.test(content)) {
    return { error: "Demi keamananmu, jangan sertakan tautan atau nomor telepon." };
  }
  if (role && !treeOfHopeContent.roles.includes(role)) return { error: "Peran tidak valid." };
  if (location.length > MAX_LOCATION_LENGTH) return { error: "Asal daerah terlalu panjang." };

  return { value: { content, role: role || null, location: location || null } };
}
