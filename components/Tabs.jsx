import React from "react";
import { cn } from "@/lib/utils";

export default function Tabs({ 
  tabs = [], 
  activeTab, 
  onChange, 
  variant = "teal", 
  className 
}) {

  const activeVariants = {
    teal: "bg-svarati-teal text-white shadow-sm",
    coral: "bg-svarati-coral-dark text-white shadow-sm", 
    lavender: "bg-svarati-lavender-dark text-white shadow-sm",
  };

  // Default ke teal jika variant tidak diisi
  const selectedActiveVariant = activeVariants[variant] || activeVariants.teal;
  
  // Style untuk tab yang tidak aktif (abu-abu)
  const inactiveStyle = "bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-800";

  return (
    <div 
      className={cn(
        "inline-flex flex-wrap items-center gap-4 rounded-full border border-svarati-lavender-light bg-white p-2 shadow-sm", 
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange && onChange(tab.id)}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300",
              isActive ? selectedActiveVariant : inactiveStyle
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}



/*=======================================
CONTOH PENGGUNAAN
=========================================
"use client"; // Wajib di Next.js App Router jika menggunakan useState

import React, { useState } from "react";
import Tabs from "@/components/Tabs";

export default function ContohHalaman() {
  // 1. Definisikan array tabs sesuai format {id, label}
  const myTabs = [
    { id: "tab1", label: "Cek Kondisi" },
    { id: "tab2", label: "Svarati AI" },
    { id: "tab3", label: "Cari Bantuan" },
  ];

  // 2. Buat state untuk menyimpan ID tab yang sedang aktif
  // Set nilai awalnya ke ID tab pertama (misal: "tab1")
  const [currentTab, setCurrentTab] = useState(myTabs[0].id);

  return (
    <div className="p-8">
      <h2 className="mb-4 text-xl font-bold">Uji Coba Tab Pills</h2>
      
      {/* Memanggil Komponen Tabs 
      <Tabs 
        tabs={myTabs}
        activeTab={currentTab}
        onChange={(id) => setCurrentTab(id)} // Mengubah state saat tab diklik
        variant="lavender" //Bisa diganti sesuai variant yang tersedia: teal, coral, lavender
      />

      {/* Konten di bawah tab yang berubah sesuai activeTab 
      <div className="mt-8 rounded-xl border p-6 text-gray-600 bg-white">
        {currentTab === "tab1" && <p>Ini adalah isi dari tab Cek Kondisi...</p>}
        {currentTab === "tab2" && <p>Ini adalah halaman untuk Svarati AI...</p>}
        {currentTab === "tab3" && <p>Daftar bantuan terdekat...</p>}
      </div>
    </div>
  );
}*/