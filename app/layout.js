import { Lora, Public_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AccessibilityProvider } from "@/context/AccessibilityContext";
import AccessibilityModal from "@/components/modals/AccessibilityModal";
import ScreenReaderEnhancer from "@/components/ScreenReaderEnhancer";
import AccessibilityFab from "@/components/AccessibilityFab";
import SessionInit from "@/components/SessionInit";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lora",
  display: "swap",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-public-sans",
  display: "swap",
});

export const metadata = {
  title: "Svarati - Ruang Aman untuk Bersuara",
  description:
    "Ruang digital anonim bagi perempuan untuk memahami hak, menemukan dukungan, dan melangkah menuju pemulihan.",
};

// Dijalankan sebelum halaman tampil, supaya tema kontras tinggi dan setelan teks tidak "berkedip" saat refresh.
// Key dan nilai harus sama dengan AccessibilityContext.
const initAccessibility = `try{var s=JSON.parse(localStorage.getItem("svarati-accessibility"));if(s){var d=document.documentElement.dataset;if(s.highContrast){d.contrast="high";}["fontSize","lineHeight","letterSpacing"].forEach(function(k){if(s[k]==="kecil"||s[k]==="besar"){d[k]=s[k];}});if(["kiri","tengah","kanan","penuh"].indexOf(s.textAlign)>-1){d.textAlign=s.textAlign;}}}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    // Variabel font dipasang di <html> agar terbaca oleh :root di globals.css (@theme)
    <html
      lang="id"
      className={`${lora.variable} ${publicSans.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <Script id="init-accessibility" strategy="beforeInteractive">
          {initAccessibility}
        </Script>
      </head>
      <body className="font-sans bg-svarati-cream text-svarati-teal antialiased h-full overflow-x-hidden">
        <SessionInit />
        <AccessibilityProvider>
          <a
            href="#konten-utama"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[70] focus:bg-white focus:text-svarati-teal focus:px-4 focus:py-2 focus:rounded-full focus:font-bold"
          >
            Lewati ke konten utama
          </a>

          <div className="flex flex-col min-h-screen w-full">
            <Navbar />

            <main id="konten-utama" className="flex-1 w-full">
              {children}
            </main>

            <Footer />
          </div>

          <AccessibilityFab />
          <AccessibilityModal />
          <ScreenReaderEnhancer />
        </AccessibilityProvider>
      </body>
    </html>
  );
}
