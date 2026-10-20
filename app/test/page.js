"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Card,
  CardIcon,
  CardNumber,
  CardTitle,
  CardDescription,
  CardFooter,
  CardLink,
} from "@/components/Card";
import Badge from "@/components/Badge";
import Tabs from "@/components/Tabs";
import { Button } from "@/components/ui/button"; // sesuaikan path jika berbeda

const tabItems = [
  { id: "tab1", label: "Cek Kondisi" },
  { id: "tab2", label: "Svarati AI" },
  { id: "tab3", label: "Cari Bantuan" },
];

const cardVariantList = ["white", "cream", "lavender", "teal", "coral", "danger", "solid", "outline"];
const topBorderList = ["lavender", "coral", "teal", "green"];
const badgeVariantList = ["teal", "coral", "lavender"];
const buttonVariantList = ["default", "outline", "secondary", "ghost", "destructive", "link"];
const buttonSizeList = ["xs", "sm", "default", "lg"];
const iconSizeList = ["icon-xs", "icon-sm", "icon", "icon-lg"];

function Section({ title, children }) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-svarati-teal">{title}</h2>
      {children}
    </section>
  );
}

export default function TestPage() {
  const [activeTab, setActiveTab] = useState(tabItems[0].id);
  const [clicks, setClicks] = useState(0);

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl space-y-12">
        <h1 className="text-3xl font-bold text-svarati-teal">Halaman Uji Komponen Svarati</h1>

        {/* CARD */}
        <Section title="Card: variant">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {cardVariantList.map((v) => (
              <Card key={v} variant={v}>
                <CardTitle>{v}</CardTitle>
                <CardDescription>Teks deskripsi untuk variant {v}.</CardDescription>
              </Card>
            ))}
          </div>
        </Section>

        <Section title="Card: size">
          <div className="grid items-start gap-6 md:grid-cols-3">
            {["sm", "md", "lg"].map((s) => (
              <Card key={s} size={s}>
                <CardTitle>size {s}</CardTitle>
                <CardDescription>Radius dan padding mengikuti ukuran {s}.</CardDescription>
              </Card>
            ))}
          </div>
        </Section>

        <Section title="Card: topBorder dan CardNumber">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {topBorderList.map((t, i) => (
              <Card key={t} topBorder={t}>
                <CardNumber>{String(i + 1).padStart(2, "0")}</CardNumber>
                <CardTitle>topBorder {t}</CardTitle>
                <CardDescription>Garis atas harus mengikuti lengkung card.</CardDescription>
              </Card>
            ))}
          </div>
        </Section>

        <Section title="Card: semua sub-komponen dan interactive">
          <Card interactive className="group max-w-sm">
            <CardIcon>
              <Plus />
            </CardIcon>
            <Badge className="mb-3">Preventif</Badge>
            <CardTitle>Judul Card</CardTitle>
            <CardDescription>
              Deskripsi singkat untuk mengecek jarak, warna teks, dan efek hover.
            </CardDescription>
            <CardLink>Selengkapnya</CardLink>
            <CardFooter>
              <span>Footer kiri</span>
              <span>Footer kanan</span>
            </CardFooter>
          </Card>
        </Section>

        {/* BADGE */}
        <Section title="Badge">
          <div className="flex flex-wrap gap-3">
            {badgeVariantList.map((v) => (
              <Badge key={v} variant={v}>
                {v} soft
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 rounded-3xl bg-svarati-lavender-light p-4">
            {badgeVariantList.map((v) => (
              <Badge key={v} variant={v} styleType="white">
                {v} white
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge variant="tidak-ada">variant salah (fallback teal)</Badge>
            <Badge styleType="tidak-ada">styleType salah (fallback soft)</Badge>
            <Badge>Langkah 1 • Pahami hakmu dan kenali bentuk kekerasan</Badge>
          </div>
        </Section>

        {/* BUTTON */}
        <Section title="Button">
          <div className="flex flex-wrap items-center gap-3">
            {buttonVariantList.map((v) => (
              <Button key={v} variant={v}>
                {v}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {buttonSizeList.map((s) => (
              <Button key={s} size={s}>
                size {s}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {iconSizeList.map((s) => (
              <Button key={s} variant="outline" size={s} aria-label={s}>
                <Plus />
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button disabled>Disabled</Button>
            <Button onClick={() => setClicks((c) => c + 1)}>Diklik {clicks}x</Button>
          </div>
        </Section>

        {/* TABS */}
        <Section title="Tab Pills">
          <div className="space-y-4">
            {["teal", "coral", "lavender"].map((v) => (
              <div key={v}>
                <Tabs tabs={tabItems} activeTab={activeTab} onChange={setActiveTab} variant={v} />
              </div>
            ))}
            <div className="rounded-xl border bg-white p-6 text-svarati-teal">
              {activeTab === "tab1" && <p>Isi tab Cek Kondisi.</p>}
              {activeTab === "tab2" && <p>Isi tab Svarati AI.</p>}
              {activeTab === "tab3" && <p>Isi tab Cari Bantuan.</p>}
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}