import React from "react";
import {cn} from "@/lib/utils";

export default function Badge({children, variant = "teal", className}) {
    const variants ={
        teal: "bg-[#e8f3f1] text-[#0f4c5c]",
        coral: "bg-[#fff5f2] text-[#b14a25]",
        lavender: "bg-[#d8d1f3] text-[#5a4a9e]",
    };

    //Jika variant yang dimasukkan salah/kosong akan default ke teal
    const selectedVariant = variants[variant] || variants.teal;

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

//Contoh penggunaan
/*import Badge from "@/components/Badge";

export default function ContohPenggunaan() {
  return (
    <div className="flex gap-4 p-8">
      {/* Badge warna Dark Teal */
     /*<Badge variant="teal">Preventif</Badge>

      {/* Badge warna Coral */
      /*<Badge variant="coral">Kuratif</Badge>

      {/* Badge warna Lavender */
      /*<Badge variant="lavender">Rehabilitatif</Badge>
    </div>
  );
}*/