import Link from "next/link";
import {
  Building2,
  Check,
  HeartHandshake,
  Info,
  MapPin,
  MessageCircle,
  RotateCcw,
  ShieldAlert,
  Smartphone,
} from "lucide-react";
import { KURATIF, MENU_UTAMA } from "@/content/labels";
import { Button } from "@/components/ui/button";
import { Card, CardIcon, CardTitle, CardDescription, CardLink } from "@/components/Card";
import Badge from "@/components/Badge";
import Split from "@/components/kuratif/Split";
import NomorDarurat from "@/components/kuratif/NomorDarurat";

const common = KURATIF.common;
const quiz = KURATIF.selfAssessment;
const submenu = MENU_UTAMA.find((m) => m.id === "pendampingan").submenu;
const namaKuis = submenu.find((s) => s.id === "cek-kondisi").nama;
const direktori = submenu.find((s) => s.id === "cari-layanan");

// Ikon dan warna tiap kartu. Lavender hanya untuk ajakan bercerita, coral hanya untuk ancaman.
// Class ditulis lengkap agar terdeteksi Tailwind.
const GAYA = {
  space: { Icon: MessageCircle, variant: "lavender", text: "text-svarati-lavender-dark" },
  digital: { Icon: Smartphone, variant: "teal", text: "text-svarati-teal" },
  institution: { Icon: Building2, variant: "teal", text: "text-svarati-teal" },
  threat: { Icon: ShieldAlert, variant: "coral", text: "text-svarati-coral-dark" },
  emotional: { Icon: HeartHandshake, variant: "teal", text: "text-svarati-teal" },
  noEvidence: { Icon: Info, variant: "teal", text: "text-svarati-teal" },
};

// Menentukan kartu apa saja yang tampil dari jawaban
function pilihKartu(answers) {
  const pilihan = (nomor, opsi) =>
    Array.isArray(answers[nomor]) ? answers[nomor].includes(opsi) : answers[nomor] === opsi;
  const salahSatu = (nomor, daftar) => daftar.some((opsi) => pilihan(nomor, opsi));

  const kartu = [{ id: "space", ...quiz.cards.space }];
  if (pilihan("q6", "a")) kartu.push({ id: "digital", ...quiz.cards.digital });
  if (salahSatu("q2", ["b", "c"]) || pilihan("q3", "a"))
    kartu.push({ id: "institution", ...quiz.cards.institution });
  if (salahSatu("q4", ["d", "h"]) || pilihan("q5", "c"))
    kartu.push({ id: "threat", ...quiz.cards.threat });
  if (salahSatu("q5", ["b", "d"]) || pilihan("q1", "c"))
    kartu.push({ id: "emotional", ...quiz.cards.emotional });
  if (salahSatu("q6", ["c", "d"])) kartu.push({ id: "noEvidence", ...quiz.cards.noEvidence });
  return kartu;
}

export default function Hasil({ answers, headingRef, onUlangi }) {
  return (
    <Split
      aside={
        <>
          <Badge variant="teal">{namaKuis}</Badge>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="mt-4 text-2xl font-bold leading-snug text-svarati-teal focus:outline-none lg:text-3xl"
          >
            {quiz.result.lead}
          </h1>
          <p className="mt-3 leading-relaxed text-svarati-teal">{quiz.result.leadRest}</p>
          <div className="mt-6 flex items-start gap-2 rounded-2xl bg-white/70 p-4 text-sm text-svarati-coral-dark">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{quiz.result.disclaimer}</span>
          </div>
        </>
      }
    >
      <div className="grid gap-4">
        {pilihKartu(answers).map((kartu) => {
          const gaya = GAYA[kartu.id];
          const { Icon } = gaya;
          return (
            <Card key={kartu.id} variant={gaya.variant} className="flex gap-4 p-5 sm:p-6">
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ${gaya.text}`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold leading-snug text-svarati-teal">{kartu.title}</h2>
                <p className={`mt-1 text-sm leading-relaxed ${gaya.text}`}>{kartu.body}</p>
                {kartu.list && (
                  <ul className="mt-3 grid gap-2 text-sm text-svarati-teal">
                    {kartu.list.map((item) => (
                      <li key={item} className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {kartu.route && (
                  <CardLink as={Link} href={kartu.route} className={`mt-3 ${gaya.text}`}>
                    {kartu.cta}
                  </CardLink>
                )}
              </div>
            </Card>
          );
        })}

        <Link
          href={direktori.href}
          className="group block rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-svarati-teal"
        >
          <Card variant="teal" interactive className="flex gap-4 p-5 sm:p-6">
            <CardIcon className="mb-0 shrink-0 text-svarati-teal">
              <MapPin aria-hidden="true" />
            </CardIcon>
            <div className="min-w-0 flex-1">
              <CardTitle className="mb-1">{direktori.nama}</CardTitle>
              <CardDescription className="text-svarati-teal">
                {KURATIF.menu.desc["cari-layanan"]}
              </CardDescription>
              <CardLink className="mt-3 text-svarati-teal">{common.lihatDaftar}</CardLink>
            </div>
          </Card>
        </Link>
      </div>

      <div className="mt-8 grid gap-3">
        <Card variant="coral" className="p-5 sm:p-6">
          <h2 className="text-lg font-bold leading-snug text-svarati-danger">
            {quiz.hasilDarurat.judul}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-svarati-coral-dark">
            {quiz.hasilDarurat.isi}
          </p>
          <NomorDarurat className="mt-4 grid gap-3 sm:grid-cols-2" />
        </Card>

        <Button
          variant="ghost"
          size="lg"
          fullWidth
          icon={<RotateCcw aria-hidden="true" />}
          onClick={onUlangi}
        >
          {common.restart}
        </Button>
      </div>
    </Split>
  );
}