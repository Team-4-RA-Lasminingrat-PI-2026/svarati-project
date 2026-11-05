import { Lora, Public_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${lora.variable} ${publicSans.variable} h-full`}
    >
      <body className="font-sans bg-svarati-cream text-svarati-teal antialiased h-full overflow-x-hidden">
        <div className="flex flex-col min-h-screen w-full">
          <Navbar />

          <main id="konten-utama" className="flex-1 w-full">
            {children}
          </main>

          <Footer />
        </div>
      </body>
    </html>
  );
}