import { cariLayanan, getProvinsi } from "@/lib/help-directory";
import HelpDirectoryClient from "./_components/HelpDirectoryClient";

// Selalu ambil data terbaru. Dengan revalidate, kegagalan sesaat (misalnya
// Supabase sedang gangguan) bisa ikut tersimpan di cache sampai 1 jam.
export const dynamic = "force-dynamic";

export default async function HelpDirectoryPage() {
  const [layanan, provinsi] = await Promise.allSettled([cariLayanan(), getProvinsi()]);

  const gagal = layanan.status === "rejected" || provinsi.status === "rejected";
  if (gagal) {
    console.error(
      "Gagal memuat direktori:",
      (layanan.reason ?? provinsi.reason)?.message
    );
  }

  return (
    <HelpDirectoryClient
      awal={layanan.status === "fulfilled" ? layanan.value : { data: [], total: 0 }}
      provinsi={provinsi.status === "fulfilled" ? provinsi.value.map((p) => p.nama) : []}
      gagal={gagal}
    />
  );
}