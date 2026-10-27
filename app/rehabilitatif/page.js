"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Wind, HeartHandshake } from "lucide-react";
import Badge from "@/components/Badge";
import { 
  Card, 
  CardIcon, 
  CardTitle, 
  CardDescription, 
  CardLink 
} from "@/components/Card";
import { pemulihanContent } from "@/content/labels";
import Image from "next/image";

export default function PemulihanPage() {
  const [tampil, setTampil] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => setTampil(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const muncul = (delay) =>
    `transition-all duration-700 ease-out ${delay} ${
      tampil ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
    }`;

  const munculGambar = (delay) =>
    `transition-all duration-1000 ease-out ${delay} ${
      tampil ? "translate-x-0 scale-100 opacity-100" : "translate-x-8 scale-95 opacity-0"
    }`;

    return (
    <div className="relative scroll-mt-28 px-2 pb-8 pt-28 sm:px-3 sm:pb-12 sm:pt-22">
      <div className="mx-auto max-w-6xl">

        {/* Banner Utama */}
        <Card
          variant="coral"
          size="lg"
          className={`relative mb-8 overflow-hidden border-0 bg-linear-to-br from-svarati-coral-soft via-white to-svarati-coral/20 shadow-sm sm:p-10 ${muncul("")}`}
        >
        {/* Decorative image (icon pohon) */}
        <div
          className={`pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 p-6 md:block ${munculGambar("delay-300")}`}
        >
        <div className="relative h-full w-full">
        <Image
          src="/tree-icon.png"
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain object-right opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_80%)]"
        />
        </div>
        </div>

          <div className="relative z-10 max-w-xl">
            <Badge variant="coral" styleType="soft" className={muncul("delay-150")}>
              {pemulihanContent.badge}
            </Badge>

            <h1 className={`mb-3 mt-4 text-3xl font-extrabold tracking-tight text-svarati-teal sm:text-4xl ${muncul("delay-300")}`}>
              {pemulihanContent.judul}
            </h1>

            <p className={`text-base leading-relaxed text-svarati-coral-dark ${muncul("delay-500")}`}>
              {pemulihanContent.deskripsi}
            </p>
          </div>
        </Card>


        {/* Grid Opsi Fitur Pemulihan */}
        <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${muncul("delay-500")}`}>
          
          {/* Card 1: Jurnal Pemulihan */}
          <Card variant="lavender" className="group flex h-full flex-col justify-between" interactive>
            <div>
              <CardIcon>
                <BookOpen className="text-svarati-lavender-dark" />
              </CardIcon>

              <Badge variant="lavender" styleType="soft" className="mb-3">
                Refleksi Diri          
              </Badge>

              <CardTitle>
                Jurnal Pemulihan
              </CardTitle>
              
              <CardDescription className="text-svarati-lavender-dark">
                Ruang aman dan privat untuk mencatat perasaanmu hari demi hari, melihat perkembangan emosionalmu, serta memproses pengalaman secara berkala.
              </CardDescription>
            </div>

            <div>
              <Link href="/rehabilitatif/healing-journey">
                <CardLink className="text-svarati-lavender-dark">Buka Jurnal</CardLink>
              </Link>
            </div>
          </Card>

          {/* Card 2: Latihan Tenang */}
          <Card variant="teal" className="group flex h-full flex-col justify-between" interactive>
            <div>
              <CardIcon>
                <Wind className="text-svarati-teal" />
              </CardIcon>

              <Badge variant="teal" styleType="soft" className="mb-3">
                Relaksasi & Grounding
              </Badge>

              <CardTitle>
                Latihan Tenang
              </CardTitle>

              <CardDescription className="text-svarati-teal/80">
                Panduan teknik pernapasan dan grounding (5-4-3-2-1) interaktif untuk membantu meredakan kecemasan dan mengembalikan fokus.
              </CardDescription>
            </div>

            <div>
              <Link href="/rehabilitatif/training">
                <CardLink className="text-svarati-teal">Mulai Latihan</CardLink>
              </Link>
            </div>
          </Card>

          {/* Card 3: Cerita dari Mereka */}
          <Card variant="coral" className="group flex h-full flex-col justify-between" interactive>
            <div>
              <CardIcon>
                <HeartHandshake className="text-svarati-coral-dark" />
              </CardIcon>

              <Badge variant="coral" styleType="soft" className="mb-3">
                Dukungan Komunitas  
              </Badge>

              <CardTitle>
                Cerita dari Mereka
              </CardTitle>

              <CardDescription className="text-svarati-coral-dark">
                Pohon harapan berisi pesan saling menguatkan maupun cerita perjuangan penyintas lain sebagai pengingat bahwa <b><i>Kamu Tidak Sendirian</i></b>.
              </CardDescription>
            </div>
            
            <div>
              <Link href="/rehabilitatif/tree-of-hope">
                <CardLink className="text-svarati-coral-dark">Lihat Pohon Harapan</CardLink>
              </Link>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}