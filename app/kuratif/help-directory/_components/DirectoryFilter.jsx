import { Download } from "lucide-react";
import { Card } from "@/components/Card";
import Tabs from "@/components/Tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { DIREKTORI } from "@/content/labels";

const F = DIREKTORI.filter;

export default function DirectoryFilter({
  cari,
  onCariChange,
  provinsi,
  onProvinsiChange,
  kota,
  onKotaChange,
  tipe,
  onTipeChange,
  daftarProvinsi,
  daftarKota,
  opsiTipe,
  jumlahHasil,
  adaFilter,
  onReset,
  onUnduh,
  className,
}) {
  return (
    <div className={className}>
      <Card variant="white" size="sm" className="rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col gap-5">
          {/* Pencarian */}
          <div>
            <Label htmlFor="cari-layanan" className="sr-only">
              {F.cariLabel}
            </Label>
            <Input
              id="cari-layanan"
              tone="accent"
              size="lg"
              value={cari}
              onChange={(e) => onCariChange(e.target.value)}
              placeholder={F.cariPlaceholder}
            />
          </div>

          {/* Filter berdasarkan lokasi */}
          <div>
            <p
              id="judul-filter-lokasi"
              className="mb-2 text-xs font-semibold uppercase tracking-wider text-svarati-teal"
            >
              {F.judulLokasi}
            </p>

            <div
              role="group"
              aria-labelledby="judul-filter-lokasi"
              className="grid grid-cols-2 gap-3"
            >
              <Select
                id="pilih-provinsi"
                label={F.provinsiLabel}
                value={provinsi}
                onChange={(e) => onProvinsiChange(e.target.value)}
              >
                <option value="">{F.semuaProvinsi}</option>
                <option value={F.nilaiNasional}>{F.provinsiNasional}</option>
                {daftarProvinsi.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </Select>

              <Select
                id="pilih-kota"
                label={F.kotaLabel}
                value={kota}
                onChange={(e) => onKotaChange(e.target.value)}
                disabled={!provinsi || provinsi === F.nilaiNasional}
              >
                <option value="">{F.semuaKota}</option>
                {daftarKota.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Filter berdasarkan layanan */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-svarati-teal">
              {F.judulLayanan}
            </p>

            <Tabs
              tabs={opsiTipe}
              activeTab={tipe}
              onChange={onTipeChange}
              variant="teal"
              boxed={false}
              className="w-full [&>button]:grow [&>button]:text-center"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <p aria-live="polite" className="text-xs text-svarati-teal-dark">
              {jumlahHasil} {F.jumlah}
            </p>
            <div className="flex items-center gap-3">
              {adaFilter && (
                <Button type="button" variant="ghost" size="sm" onClick={onReset}>
                  {F.reset}
                </Button>
              )}
              <Button
                type="button"
                variant="tertiary"
                size="sm"
                icon={<Download className="size-3.5" aria-hidden="true" />}
                onClick={onUnduh}
                className="text-xs font-semibold"
              >
                {F.unduh}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}