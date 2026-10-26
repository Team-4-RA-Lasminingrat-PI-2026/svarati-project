import React from "react";
import { cn } from "@/lib/utils";

export default function Badge({ children, variant = "teal", styleType = "soft", className }) {
    // Memisahkan variant berdasarkan 2 versi (soft dan white)
    const variants = {
        soft: {
            teal: "bg-svarati-teal/20 text-svarati-teal",
            coral: "bg-svarati-coral/25 text-svarati-coral-dark",
            lavender: "bg-svarati-lavender-light text-svarati-lavender-dark",
        },
        white: {
            teal: "bg-white text-svarati-teal",
            coral: "bg-white text-svarati-coral-dark",
            lavender: "bg-white text-svarati-lavender-dark",
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