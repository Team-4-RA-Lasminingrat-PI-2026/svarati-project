import Link from "next/link";
import { Wind, Music, Anchor, Clock, ArrowRight } from "lucide-react";
import Badge from "@/components/Badge";
import BackToPemulihan from "@/components/BackToPemulihan";
// Tampilan sengaja berbeda dari kartu di halaman Pemulihan: daftar memanjang (bukan 3 kolom),
// kartu putih dengan garis warna di kiri, label "Cocok saat", durasi, dan tombol panah bulat.
const exercises = [
    {
        href: "/rehabilitatif/training/breathing",
        title: "Latihan Pernapasan",
        Icon: Wind,
        teknik: "Box Breathing · 4-7-8",
        durasi: "Satu putaran 16–19 detik",
        cocok: ["Cemas", "Stres", "Jantung berdebar"],
        description:
            "Panduan pernapasan interaktif untuk menurunkan ketegangan, menstabilkan detak jantung, dan memberi rasa tenang saat cemas atau stres.",
        warna: {
            garis: "border-l-svarati-teal",
            ikon: "bg-svarati-teal-soft text-svarati-teal",
            teks: "text-svarati-teal",
            chip: "bg-svarati-teal-soft text-svarati-teal",
            tombol: "border-svarati-teal/30 text-svarati-teal group-hover:bg-svarati-teal group-hover:text-white",
        },
    },
    {
        href: "/rehabilitatif/training/sound",
        title: "Suara Terapi",
        Icon: Music,
        teknik: "20 Musik Tenang",
        durasi: "Bebas, ada timer 15–60 menit",
        cocok: ["Susah tidur", "Pikiran ramai", "Ingin rileks"],
        description:
            "Pilihan musik yang menenangkan untuk membantumu rileks, mengurangi rasa cemas, dan tidur lebih nyenyak.",
        warna: {
            garis: "border-l-svarati-lavender-dark",
            ikon: "bg-svarati-lavender-light text-svarati-lavender-dark",
            teks: "text-svarati-lavender-dark",
            chip: "bg-svarati-lavender-light/70 text-svarati-lavender-dark",
            tombol: "border-svarati-lavender-dark/30 text-svarati-lavender-dark group-hover:bg-svarati-lavender-dark group-hover:text-white",
        },
    },
    {
        href: "/rehabilitatif/training/grounding",
        title: "Grounding 5-4-3-2-1",
        Icon: Anchor,
        teknik: "5 langkah singkat",
        durasi: "Sekitar 3 menit",
        cocok: ["Panik", "Kewalahan", "Sulit fokus"],
        description:
            "Panduan cepat saat panik: lihat 5 benda, sentuh 4 benda, dengar 3 suara, cium 2 aroma, dan rasakan 1 sensasi untuk kembali ke saat ini.",
        warna: {
            garis: "border-l-svarati-coral-dark",
            ikon: "bg-svarati-coral-soft text-svarati-coral-dark",
            teks: "text-svarati-coral-dark",
            chip: "bg-svarati-coral-soft text-svarati-coral-dark",
            tombol: "border-svarati-coral-dark/30 text-svarati-coral-dark group-hover:bg-svarati-coral-dark group-hover:text-white",
        },
    },
];

export default function TrainingPage() {
    return (
        // pt-28 / md:pt-36 memberi ruang untuk navbar yang melayang di atas
         <main className="relative min-h-screen bg-svarati-cream px-4 pb-8 pt-24 font-sans md:px-8 md:pb-12 lg:px-12">
            <BackToPemulihan />
            <div className="mx-auto max-w-4xl space-y-8">
                {/* Header: badge + ajakan latihan */}
                <div className="max-w-2xl">
                    <Badge variant="coral" className="mb-5">
                        Relaksasi & Grounding
                    </Badge>
                    <h1 className="mb-5 text-4xl font-bold leading-tight text-svarati-teal font-heading md:text-5xl">
                        Yuk Berikan Ruang Tenang untuk Dirimu Hari Ini!
                    </h1>
                    <p className="text-lg leading-relaxed text-svarati-coral">
                        Pilih latihan yang paling cocok dengan kondisimu saat ini. Kamu bisa
                        berhenti kapan saja, dan tidak ada yang salah dalam melakukannya.
                    </p>
                </div>

                <section aria-labelledby="judul-pilihan-latihan" className="space-y-4">
                    <h2 id="judul-pilihan-latihan" className="font-sans text-sm font-bold uppercase tracking-widest text-svarati-teal/60">
                        Pilih sesuai yang kamu rasakan
                    </h2>
                    <ul className="space-y-4">
                        {exercises.map(({ href, title, Icon, teknik, durasi, cocok, description, warna }) => (
                            <li key={href}>
                                <Link
                                    href={href}
                                    className={`group flex flex-col gap-5 rounded-3xl border border-l-[6px] border-svarati-lavender-light bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-svarati-lavender/40 sm:flex-row sm:items-center sm:p-6 ${warna.garis}`}
                                >
                                    <span className={`flex size-16 shrink-0 items-center justify-center rounded-2xl ${warna.ikon}`}>
                                        <Icon className="size-8" aria-hidden="true" />
                                    </span>

                                    <span className="min-w-0 flex-1">
                                        <span className={`block text-xs font-bold uppercase tracking-wider ${warna.teks}`}>
                                            {teknik}
                                        </span>
                                        <span className="mt-1 block font-heading text-2xl font-bold text-svarati-teal">
                                            {title}
                                        </span>
                                        <span className="mt-2 block text-sm leading-relaxed text-svarati-teal/80">
                                            {description}
                                        </span>
                                        <span className="mt-3 flex flex-wrap items-center gap-2">
                                            <span className="text-xs font-semibold text-svarati-teal/70">Cocok saat:</span>
                                            {cocok.map((c) => (
                                                <span key={c} className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${warna.chip}`}>
                                                    {c}
                                                </span>
                                            ))}
                                        </span>
                                        <span className="mt-3 flex items-center gap-1.5 text-xs font-medium text-svarati-teal/70">
                                            <Clock className="size-3.5" aria-hidden="true" /> {durasi}
                                        </span>
                                    </span>

                                    <span
                                        aria-hidden="true"
                                        className={`hidden size-12 shrink-0 items-center justify-center rounded-full border-2 transition sm:flex ${warna.tombol}`}
                                    >
                                        <ArrowRight className="size-5 transition group-hover:translate-x-0.5" />
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>

                <p className="text-center text-xs text-svarati-teal/60">
                    Jika kamu dalam bahaya atau butuh bantuan segera, gunakan tombol Bantuan Darurat di bagian atas.
                </p>
            </div>
        </main>
    );
}