import Link from "next/link";
import { Wind, Headphones, Anchor, ArrowRight } from "lucide-react";
import BackToPemulihan from "@/components/BackToPemulihan";

// Daftar memanjang: satu kartu bernuansa warna per latihan, ikon di kiri,
// tombol panah bulat di kanan. Nama fitur, keterangan singkat "cocok saat",
// dan takaran waktu ditaruh bertumpuk supaya mudah dipindai.
const exercises = [
    {
        href: "/rehabilitatif/training/breathing",
        title: "Latihan Pernapasan",
        Icon: Wind,
        cocok: "Saat cemas, stres, atau jantung berdebar.",
        takaran: "19 detik per putaran",
        warna: {
            kartu: "bg-svarati-teal-soft",
            ikon: "text-svarati-teal",
            takaran: "text-svarati-teal",
            tombol: "bg-svarati-teal",
        },
    },
    {
        href: "/rehabilitatif/training/sound",
        title: "Suara Terapi",
        Icon: Headphones,
        cocok: "Saat susah tidur atau pikiran ramai.",
        takaran: "20 musik tenang, timer 15 sampai 60 menit",
        warna: {
            kartu: "bg-svarati-lavender/15",
            ikon: "text-svarati-lavender-dark",
            takaran: "text-svarati-lavender-dark",
            tombol: "bg-svarati-lavender-dark",
        },
    },
    {
        href: "/rehabilitatif/training/grounding",
        title: "Grounding 5-4-3-2-1",
        Icon: Anchor,
        cocok: "Saat panik atau kewalahan.",
        takaran: "5 langkah, sekitar 3 menit",
        warna: {
            kartu: "bg-svarati-coral-soft",
            ikon: "text-svarati-coral-dark",
            takaran: "text-svarati-coral-dark",
            tombol: "bg-svarati-coral-dark",
        },
    },
];

export default function TrainingPage() {
    return (
        <main className="relative min-h-screen bg-svarati-cream px-4 pb-10 pt-24 font-sans md:px-8 lg:px-12">
            <BackToPemulihan />

            <div className="mx-auto max-w-3xl">
                <header className="mb-7 max-w-xl">
                    <h1 className="mb-4 text-3xl font-semibold leading-[1.18] tracking-tight text-svarati-teal md:text-4xl">
                        Beri dirimu ruang tenang sebentar.
                    </h1>
                    <p className="text-base leading-relaxed text-svarati-coral-dark">
                        Pilih yang paling dekat dengan yang kamu rasakan sekarang. Kamu bisa
                        berhenti kapan saja.
                    </p>
                </header>

                <ul aria-label="Pilihan latihan" className="space-y-3.5">
                    {exercises.map(({ href, title, Icon, cocok, takaran, warna }) => (
                        <li key={href}>
                            <Link
                                href={href}
                                className={`group flex items-center gap-4 rounded-3xl p-4 transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-svarati-lavender/40 sm:gap-5 sm:p-5 ${warna.kartu}`}
                            >
                                <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white sm:size-16">
                                    <Icon className={`size-7 ${warna.ikon}`} aria-hidden="true" />
                                </span>

                                <span className="min-w-0 flex-1">
                                    <span className="block text-lg font-semibold leading-snug text-svarati-teal sm:text-xl">
                                        {title}
                                    </span>
                                    <span className="mt-1 block text-sm leading-snug text-svarati-teal/70">
                                        {cocok}
                                    </span>
                                    <span className={`mt-1.5 block text-sm font-semibold ${warna.takaran}`}>
                                        {takaran}
                                    </span>
                                </span>

                                <span
                                    aria-hidden="true"
                                    className={`flex size-11 shrink-0 items-center justify-center rounded-full text-white transition group-hover:scale-105 ${warna.tombol}`}
                                >
                                    <ArrowRight className="size-5 transition group-hover:translate-x-0.5" />
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>

                <p className="mt-8 text-xs leading-relaxed text-svarati-teal/60">
                    Jika kamu dalam bahaya atau butuh bantuan segera, gunakan tombol Bantuan
                    Darurat di bagian atas.
                </p>
            </div>
        </main>
    );
}
