import { treeOfHopeContent as t } from "@/content/labels";

export function editDeadlineText(iso) {
  const d = new Date(iso);
  const tanggal = d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const jam = d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).replace(":", ".");
  return t.manage.deadline(tanggal, jam);
}