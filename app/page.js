import Hero from "@/components/home/Hero";
import Layanan from "@/components/home/Layanan";
import MythsFacts from "@/components/home/MythsFacts";
import SvaratiAiBanner from "@/components/home/SvaratiAiBanner";
import PemulihanBanner from "@/components/home/PemulihanBanner";
import PrivasiNote from "@/components/home/PrivasiNote";

export default function Home() {
  return (
    <>
      <Hero />
      <Layanan />
      <MythsFacts/>
      <SvaratiAiBanner/>
      <PemulihanBanner/>
      <PrivasiNote/>
    </>
  );
}