import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BackToPemulihan from "@/components/BackToPemulihan";

// Ikon padat buatan sendiri. Warnanya ikut text-* dari pemanggil,
// dan bagian putih mengandalkan ubin di belakangnya yang berwarna putih.
function IkonNapas({ className }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
            <path
                d="M11.05 3.1a.95.95 0 0 1 1.9 0v4.3l3 1.85-1 1.6-2.95-1.8-2.95 1.8-1-1.6 3-1.85z"
                fill="currentColor"
            />
            <path
                d="M9.3 10.2v9.4c0 .8-.65 1.4-1.45 1.4H5.7c-1.75 0-3.1-1.55-2.85-3.3l.85-5.85c.2-1.45 1.25-2.65 2.65-3.05 1.5-.45 2.95.65 2.95 2.2z"
                fill="currentColor"
            />
            <path
                d="M14.7 10.2v9.4c0 .8.65 1.4 1.45 1.4h2.15c1.75 0 3.1-1.55 2.85-3.3l-.85-5.85c-.2-1.45-1.25-2.65-2.65-3.05-1.5-.45-2.95.65-2.95 2.2z"
                fill="currentColor"
            />
        </svg>
    );
}

// Ikon kecil di label atas judul: awan dengan satu hembusan napas
function IkonNapasKecil({ className }) {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M7.5 14.5a3.4 3.4 0 0 1 .5-6.8 4.4 4.4 0 0 1 8.2 1.1 3 3 0 0 1-.7 5.7z" />
            <path d="M8.5 18.8c1.7 0 1.7 1.9 3.5 1.9s1.8-1.9 3.5-1.9" />
        </svg>
    );
}

function IkonHeadphone({ className }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
            <path
                d="M4.5 13.6v-1.6a7.5 7.5 0 0 1 15 0v1.6"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
            />
            <rect x="2.2" y="13" width="5.2" height="8.2" rx="2.6" fill="currentColor" />
            <rect x="16.6" y="13" width="5.2" height="8.2" rx="2.6" fill="currentColor" />
        </svg>
    );
}

function IkonJangkar({ className }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
            <circle cx="12" cy="4.3" r="2.9" fill="currentColor" />
            <circle cx="12" cy="4.3" r="1.1" fill="#fff" />
            <rect x="10.8" y="6.4" width="2.4" height="14.4" rx="1.2" fill="currentColor" />
            <rect x="7.4" y="8.4" width="9.2" height="2.3" rx="1.15" fill="currentColor" />
            <path
                d="M4.4 12.8a7.6 7.6 0 0 0 15.2 0"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
            />
        </svg>
    );
}

// Daftar memanjang: satu kartu bernuansa warna per latihan, ikon di kiri,
// tombol panah bulat di kanan. Nama fitur, keterangan singkat "cocok saat",
// dan takaran waktu ditaruh bertumpuk supaya mudah dipindai.
const exercises = [
    {
        href: "/rehabilitatif/training/breathing",
        title: "Latihan Pernapasan",
        Icon: IkonNapas,
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
        Icon: IkonHeadphone,
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
        Icon: IkonJangkar,
        cocok: "Saat panik atau kewalahan.",
        takaran: "5 langkah, sekitar 3 menit",
        warna: {
            // Coral paling muda di antara ketiganya, jadi dipertua satu tingkat
            // supaya bobotnya setara ikon teal dan lavender
            kartu: "bg-svarati-coral-soft",
            ikon: "text-svarati-coral-darker",
            takaran: "text-svarati-coral-darker",
            tombol: "bg-svarati-coral-darker",
        },
    },
];

export default function TrainingPage() {
    return (
        <main className="relative min-h-screen bg-svarati-cream pb-10 pt-24 font-sans">
            <BackToPemulihan />

            <div className="mx-auto max-w-3xl">
                <header className="mb-7 max-w-xl">
                    <p className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-svarati-coral-dark">
                        <IkonNapasKecil className="size-4.5" />
                        Latihan Tenang
                    </p>

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
