import { Lora, Public_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AccessibilityProvider } from "@/context/AccessibilityContext";
import AccessibilityModal from "@/components/modals/AccessibilityModal";
import ScreenReaderEnhancer from "@/components/ScreenReaderEnhancer";


const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lora",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-public-sans",
});

export const metadata = {
  title: "Svarati - Ruang Aman untuk Bersuara",
  description:
    "Ruang digital anonim bagi perempuan untuk memahami hak, menemukan dukungan, dan melangkah menuju pemulihan.",
};

// Dijalankan sebelum halaman tampil, supaya tema kontras tinggi tidak "berkedip" saat refresh.
// Key harus sama dengan A11Y_STORAGE_KEY di AccessibilityContext.
const initAccessibility = `try{var s=JSON.parse(localStorage.getItem("svarati-accessibility"));if(s&&s.highContrast){document.documentElement.dataset.contrast="high";}}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="h-full" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: initAccessibility }} />
      </head>
      <body
        className={`${lora.variable} ${publicSans.variable} font-sans bg-svarati-cream text-svarati-teal antialiased h-full overflow-x-hidden`}
      >
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

          <AccessibilityModal />
          <ScreenReaderEnhancer />
        </AccessibilityProvider>
      </body>
    </html>
  );
}