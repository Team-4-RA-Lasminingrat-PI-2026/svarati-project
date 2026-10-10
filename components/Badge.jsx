import React from "react";
import { cn } from "@/lib/utils";

export default function Badge({ children, variant = "teal", styleType = "soft", className }) {
    // Memisahkan variant berdasarkan 2 versi (soft dan white)
    const variants = {
        soft: {
            teal: "bg-[#cdece7] text-[#0f4c5c]",
            coral: "bg-[#ffded4] text-[#b14a25]",
            lavender: "bg-[#d8d1f3] text-[#5a4a9e]",
        },
        white: {
            teal: "bg-white text-[#0f4c5c]",
            coral: "bg-white text-[#b14a25]",
            lavender: "bg-white text-[#5a4a9e]",
        }
    };

    // Jika styleType yang dimasukkan salah/kosong, akan default ke "soft"
    const selectedStyleType = variants[styleType] || variants.soft;
    
    // Jika variant yang dimasukkan salah/kosong, akan default ke "teal"
    const selectedVariant = selectedStyleType[variant] || selectedStyleType.teal;

    return (
        <span 
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider",
                selectedVariant,
                className
            )}
        >
            {children}
        </span>
    );
}

/*Contoh penggunaan badge untuk styleType "white"

<Badge variant="lavender" styleType="white">LANGKAH 1 • PAHAMI HAKMU</Badge>*/

/*Contoh penggunaan badge untuk styleType "soft"

<Badge variant="teal">Preventif</Badge>*/