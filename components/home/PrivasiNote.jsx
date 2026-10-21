import { Lock } from "lucide-react";
import { Card, CardIcon, CardTitle, CardDescription } from "@/components/Card";
import { privasiContent as pv } from "@/content/labels";

const TONE = {
  coral: "text-svarati-coral-dark underline underline-offset-2",
  danger: "text-svarati-danger",
};

export default function PrivasiNote() {
  return (
    <section id="privasi" className="px-4 pb-12 pt-10 sm:px-6 lg:pb-16 lg:pt-12">
      <div className="mx-auto w-full max-w-2xl">
        <Card
          variant="white"
          className="flex flex-col items-center rounded-3xl px-6 py-6 text-center shadow-sm"
        >
          <CardIcon className="mb-3 bg-svarati-teal-soft shadow-none">
            <Lock className="text-svarati-teal" aria-hidden="true" />
          </CardIcon>

          <CardTitle className="mb-2 text-lg">{pv.judul}</CardTitle>

          <CardDescription className="max-w-xl text-[13px] text-svarati-lavender-dark">
            {pv.deskripsi.map((d, i) =>
              d.tebal ? (
                <strong key={i} className={`font-bold ${TONE[d.tone] ?? ""}`}>
                  {d.teks}
                </strong>
              ) : (
                <span key={i}>{d.teks}</span>
              )
            )}
          </CardDescription>
        </Card>
      </div>
    </section>
  );
}