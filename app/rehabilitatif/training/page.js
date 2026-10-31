import Link from "next/link";
import { Wind, Music, Anchor } from "lucide-react";
import Badge from "@/components/Badge";
import {
    Card,
    CardIcon,
    CardTitle,
    CardDescription,
    CardLink,
} from "@/components/Card";

const exercises = [
    {
        href: "/rehabilitatif/training/breathing",
        title: "Latihan Pernapasan",
        Icon: Wind,
        badge: "Box Breathing · 4-7-8",
        variant: "teal",
        color: "text-[#0f4c5c]",
        cta: "Mulai Pernapasan",
        description:
            "Panduan pernapasan interaktif untuk menurunkan ketegangan, menstabilkan detak jantung, dan memberi rasa tenang saat cemas atau stres.",
    },
    {
        href: "/rehabilitatif/training/sound",
        title: "Suara Terapi",
        Icon: Music,
        badge: "Musik · Suara alam · White noise",
        variant: "lavender",
        color: "text-[#5a4a9e]",
        cta: "Dengarkan Suara",
        description:
            "Pilihan suara yang menenangkan untuk membantumu rileks, mengurangi rasa cemas, dan tidur lebih nyenyak.",
    },
    {
        href: "/rehabilitatif/training/grounding",
        title: "Grounding 5-4-3-2-1",
        Icon: Anchor,
        badge: "Sekitar 3 menit",
        variant: "coral",
        color: "text-[#b14a25]",
        cta: "Mulai Grounding",
        description:
            "Panduan cepat saat panik: lihat 5 benda, sentuh 4 benda, dengar 3 suara, cium 2 aroma, dan rasakan 1 sensasi untuk kembali ke saat ini.",
    },
];

export default function TrainingPage() {
    return (
        // pt-28 / md:pt-36 memberi ruang untuk navbar yang melayang di atas
         <main className="min-h-screen bg-svarati-cream px-4 pb-8 pt-24 font-sans md:px-8 md:pb-12 lg:px-12">
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

                <div className="grid gap-6 md:grid-cols-3">
                    {exercises.map(({ href, title, Icon, badge, variant, color, cta, description }) => (
                        <Link key={href} href={href} className="group block h-full">
                            <Card variant={variant} interactive className="flex h-full flex-col">
                                <CardIcon>
                                    <Icon className={color} />
                                </CardIcon>
                                <Badge variant={variant} className="mb-3 self-start">
                                    {badge}
                                </Badge>
                                <CardTitle>{title}</CardTitle>
                                <CardDescription className={`flex-1 ${color}`}>
                                    {description}
                                </CardDescription>
                                <CardLink className={`self-start ${color}`}>{cta}</CardLink>
                            </Card>
                        </Link>
                    ))}
                </div>

                <p className="text-center text-xs text-svarati-teal/60">
                    Jika kamu dalam bahaya atau butuh bantuan segera, gunakan tombol Bantuan Darurat di bagian atas.
                </p>
            </div>
        </main>
    );
}