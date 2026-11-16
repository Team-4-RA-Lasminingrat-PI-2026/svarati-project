import { DARURAT, KURATIF } from "@/content/labels";
import { buttonVariants } from "@/components/ui/button";

const quiz = KURATIF.selfAssessment;

// Dua tombol nomor darurat. "lengkap" untuk layar darurat, ringkas untuk hasil.
export default function NomorDarurat({ lengkap = false, className = "" }) {
  return (
    <div className={className}>
      {[DARURAT.nomor.pusat, DARURAT.nomor.sapa].map((n) => (
        <a
          key={n.nomor}
          href={`tel:${n.nomor}`}
          className={buttonVariants({ variant: "exit", size: "lg", fullWidth: true })}
        >
          {lengkap ? `${quiz.darurat.hubungi} ${n.nomor}, ${n.nama}` : `${n.nomor} ${n.nama}`}
        </a>
      ))}
    </div>
  );
}