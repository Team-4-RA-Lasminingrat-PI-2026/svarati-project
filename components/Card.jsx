import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

/* ============================================================
   CARD (container)
   - variant   : warna & gaya permukaan
   - size      : radius + padding (ukuran INTERNAL card)
   - topBorder : aksen garis atas (melengkung mengikuti radius)
   - interactive: efek hover naik (untuk card yang bisa diklik)
   Lebar/tinggi/kolom TIDAK diatur di sini -> atur di halaman.
   ============================================================ */
const cardVariants = cva(
  "relative overflow-hidden transition-all duration-300",
  {
    variants: {
      variant: {
        // Default
        white: "bg-white border border-gray-100 shadow-sm",
        cream: "bg-svarati-cream border border-gray-200/60 shadow-sm",
        // Tinted — border tipis senada
        lavender: "bg-[#EDE9F7] border border-svarati-lavender-light",
        teal: "bg-svarati-teal-soft border border-svarati-teal/15",
        coral: "bg-svarati-coral-soft border border-svarati-coral/20",
        danger: "bg-svarati-danger-soft border border-svarati-danger/20",
        // Varian lain
        solid: "bg-svarati-teal text-white border border-svarati-teal-dark",
        outline: "bg-transparent border-2 border-dashed border-svarati-lavender",
      },
      size: {
        sm: "rounded-xl p-4",
        md: "rounded-3xl p-6",
        lg: "rounded-3xl p-8",
      },
      topBorder: {
        none: "",
        lavender: "border-t-[6px] border-t-svarati-lavender",
        coral: "border-t-[6px] border-t-svarati-coral",
        teal: "border-t-[6px] border-t-svarati-teal",
        green: "border-t-[6px] border-t-[#6B9E78]",
      },
      interactive: {
        true: "cursor-pointer hover:-translate-y-1 hover:shadow-md",
        false: "",
      },
    },
    defaultVariants: {
      variant: "white",
      size: "md",
      topBorder: "none",
      interactive: false,
    },
  }
)

function Card({ className, variant, size, topBorder, interactive, children, ...props }) {
  return (
    <div
      className={cn(cardVariants({ variant, size, topBorder, interactive }), className)}
      {...props}
    >
      {children}
    </div>
  )
}

/* ============================================================
   SUB-KOMPONEN
   ============================================================ */

// Lingkaran putih berisi ikon. Isi dengan ikon lucide.
function CardIcon({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "mb-4 flex size-10 items-center justify-center rounded-full bg-white shadow-sm",
        "[&>svg]:size-4.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Nomor besar transparan di pojok kanan atas
function CardNumber({ className, children, ...props }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute right-6 top-4 font-heading text-5xl font-bold text-gray-200/70",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

// Font mengikuti globals.css 
function CardTitle({ className, children, ...props }) {
  return (
    <h3
      className={cn("mb-2 text-xl font-bold leading-snug text-svarati-teal", className)}
      {...props}
    >
      {children}
    </h3>
  )
}

function CardDescription({ className, children, ...props }) {
  return (
    <p className={cn("text-sm leading-relaxed text-svarati-teal/80", className)} {...props}>
      {children}
    </p>
  )
}

// Footer dengan garis pemisah 
function CardFooter({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "mt-4 flex items-center justify-between border-t border-svarati-lavender-light pt-4 text-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Link CTA. Pakai `as` agar bisa jadi <a>/<Link>.
function CardLink({ as: Comp = "span", className, children, ...props }) {
  return (
    <Comp
      className={cn(
        "mt-5 inline-flex items-center gap-2 text-sm font-bold text-svarati-teal",
        "transition-all group-hover:gap-3",
        className
      )}
      {...props}
    >
      {children} <span aria-hidden="true">→</span>
    </Comp>
  )
}

export {
  Card,
  cardVariants,
  CardIcon,
  CardNumber,
  CardTitle,
  CardDescription,
  CardFooter,
  CardLink,
}

/* ============================================================
   CONTOH PEMAKAIAN CARD + SEMUA SUB KOMPONEN (salin ke page, hapus dari sini). 
   Pemakaian sub komponen bisa disesuaikan dengan kebutuhan, jika hanya perlu cardnya saja, 
   import card dan variantnya saja 
   ============================================================

   import React from "react";
import Badge from "@/components/Badge";
import { 
  HelpCircle, 
  PhoneCall, 
  Heart, 
  XCircle, 
  CheckCircle2, 
  BookOpen, 
  ShieldAlert 
} from "lucide-react";
import {
  Card,
  CardIcon,
  CardNumber,
  CardTitle,
  CardDescription,
  CardFooter,
  CardLink,
} from "@/components/Card";

export default function CardDisplay() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="mx-auto max-w-5xl space-y-12">
        
        /* Header 
        <div>
          <h1 className="mb-2 text-3xl font-bold text-[#0f4c5c]">Test Tampilan Card Svarati</h1>
          <p className="text-gray-600">Semua variasi komponen Card dan Badge yang digabungkan.</p>
        </div>*/

        /* 1. Tiga Card Tinted (Grid 3 Kolom) 
        <section>
          <h2 className="mb-4 text-xl font-bold text-gray-800">1. Card Tinted (Informasi & Edukasi)</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card variant="lavender" className="group h-full" interactive>
              <CardIcon><HelpCircle className="text-[#5a4a9e]" /></CardIcon>
              <Badge variant="lavender" className="mb-3">Preventif</Badge>
              <CardTitle>Edukasi & Simulasi Hukum</CardTitle>
              <CardDescription className="text-[#5a4a9e]">
                Pelajari hak-hakmu, kenali bentuk kekerasan berbasis UU TPKS dan cara menghadapinya.
              </CardDescription>
              <CardLink className="text-[#5a4a9e]">Buka Edukasi</CardLink>
            </Card>

            <Card variant="teal" className="group h-full" interactive>
              <CardIcon><BookOpen className="text-[#0f4c5c]" /></CardIcon>
              <Badge variant="teal" className="mb-3">Kuratif</Badge>
              <CardTitle>Pendampingan Psikologis</CardTitle>
              <CardDescription className="text-[#0f4c5c]">
                Temukan layanan pendampingan terdekat untuk memulihkan trauma.
              </CardDescription>
              <CardLink className="text-[#0f4c5c]">Cari Bantuan</CardLink>
            </Card>

            <Card variant="coral" className="group h-full" interactive>
              <CardIcon><ShieldAlert className="text-[#b14a25]" /></CardIcon>
              <Badge variant="coral" className="mb-3">Rehabilitatif</Badge>
              <CardTitle>Bantuan Medis Darurat</CardTitle>
              <CardDescription className="text-[#b14a25]">
                Akses cepat ke rumah sakit dan klinik rujukan penanganan kasus kekerasan.
              </CardDescription>
              <CardLink className="text-[#b14a25]">Lihat Faskes</CardLink>
            </Card>
          </div>
        </section>*/

        /*2. Card Kutipan / Testimoni 
        <section>
          <h2 className="mb-4 text-xl font-bold text-gray-800">2. Card Kutipan (Testimoni)</h2>
          <Card variant="white" className="max-w-xl shadow-md">
            <p className="font-medium italic leading-relaxed text-[#0f4c5c]">
              "Keberanianmu untuk bertahan hidup hari ini sudah merupakan kemenangan besar. Jangan pernah merasa sendirian dalam perjuangan ini."
            </p>
            <CardFooter>
              <span className="text-[#5a4a9e]">Anonim • Jakarta</span>
              <span className="flex items-center gap-1.5 font-bold text-[#b14a25]">
                <Heart className="size-4 fill-current" /> 24 Dukungan
              </span>
            </CardFooter>
          </Card>
        </section>*/

        /* 3. Card Bersarang (Nested) 
        <section>
          <h2 className="mb-4 text-xl font-bold text-gray-800">3. Card Nested</h2>
          <Card variant="white" size="lg" className="shadow-md">
            <div className="grid gap-4 md:grid-cols-2">
              <Card variant="danger" size="sm">
                <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase text-red-700">
                  <XCircle className="size-4" /> lorem ipsum
                </p>
                <p className="font-bold text-[#0f4c5c]">"lorem ipsum"</p>
              </Card>
              <Card variant="teal" size="sm">
                <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase text-[#0f4c5c]">
                  <CheckCircle2 className="size-4" /> Lorem ipsum
                </p>
                <CardDescription>
                  lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </CardDescription>
              </Card>
            </div>
          </Card>
        </section>*/

        /* 4. Card dengan Top Border & Nomor Seri 
        <section>
          <h2 className="mb-4 text-xl font-bold text-gray-800">4. Card Top Border & Nomor Seri</h2>
          <div className="grid max-w-2xl gap-6 md:grid-cols-2">
            <Card variant="white" topBorder="lavender" className="group h-full">
              <CardNumber>01</CardNumber>
              <Badge variant="lavender" className="mb-3">Langkah 1</Badge>
              <CardTitle>Kenali Hakmu</CardTitle>
              <CardDescription>Pahami dasar hukum perlindungan perempuan di Indonesia.</CardDescription>
              <CardLink>Jelajahi</CardLink>
            </Card>

            <Card variant="white" topBorder="coral" className="group h-full">
              <CardNumber>02</CardNumber>
              <Badge variant="coral" className="mb-3">Langkah 2</Badge>
              <CardTitle>Amankan Bukti</CardTitle>
              <CardDescription>Cara mendokumentasikan bukti kekerasan secara aman.</CardDescription>
              <CardLink>Pelajari</CardLink>
            </Card>
          </div>
        </section>*/

        /* 5. Highlight & Darurat 
        <section>
          <h2 className="mb-4 text-xl font-bold text-gray-800">5. Highlight Solid & Card Darurat</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card variant="solid">
              <p className="text-5xl font-bold">1 dari 3</p>
              <p className="mt-2 text-sm text-white/80">
                Perempuan di Indonesia pernah mengalami kekerasan fisik atau seksual.
              </p>
            </Card>

            <Card variant="danger" topBorder="none" className="border-l-4 border-l-red-600">
              <CardTitle className="text-red-700">Butuh bantuan sekarang?</CardTitle>
              <CardDescription>Hubungi layanan SAPA 129 darurat perlindungan perempuan dan anak 24 jam.</CardDescription>
              <button className="mt-4 rounded-full bg-red-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-red-700">
                Hubungi 129
              </button>
            </Card>

            <Card variant="outline" topBorder="none">
                <CardTitle className="text-red-700">Butuh bantuan sekarang?</CardTitle>
            </Card>
          </div>
        </section>

      </div>
    </div>
  );
}*/