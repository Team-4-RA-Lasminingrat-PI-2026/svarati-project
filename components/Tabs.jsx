import React from "react";
import { cn } from "@/lib/utils";

export default function Tabs({
  tabs = [],
  activeTab,
  onChange,
  variant = "teal",
  boxed = true,
  className,
}) {
  const activeVariants = {
    teal: "bg-svarati-teal text-white shadow-sm",
    coral: "bg-svarati-coral-dark text-white shadow-sm",
    lavender: "bg-svarati-lavender-dark text-white shadow-sm",
  };

  // Pil aktif: warna sama di kedua mode. Pil tidak aktif: beda tergantung mode
  const selectedActiveVariant = activeVariants[variant] || activeVariants.teal;

  const inactiveStyle = boxed
    ? "bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-800"
    : "border border-svarati-lavender-border/40 bg-white text-svarati-lavender-dark hover:bg-svarati-lavender-light";

  return (
    <div
      role="tablist"
      className={cn(
        boxed
          ? "inline-flex flex-wrap items-center gap-4 rounded-full border border-svarati-lavender-light bg-white p-2 shadow-sm"
          : "flex flex-wrap items-center gap-2",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange && onChange(tab.id)}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300",
              !boxed && "border border-transparent",
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