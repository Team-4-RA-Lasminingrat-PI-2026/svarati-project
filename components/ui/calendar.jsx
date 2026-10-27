"use client";
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

function Calendar({
  className,
  classNames,
  showOutsideDays = false,
  moodData = {},
  ...props
}) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      weekStartsOn={0} // Minggu di kolom pertama, sama seperti mockup
      className={cn("w-full p-2 sm:p-4", className)}
      classNames={{
        root: "w-full",
        months: "relative w-full",
        month: "w-full",
        month_caption: "flex h-10 items-center justify-center mb-2",
        caption_label: "text-base font-bold text-svarati-teal",
        nav: "absolute inset-x-0 top-0 z-10 flex h-10 items-center justify-between",
        button_previous:
          "flex size-8 items-center justify-center rounded-full text-svarati-teal hover:bg-gray-100",
        button_next:
          "flex size-8 items-center justify-center rounded-full text-svarati-teal hover:bg-gray-100",
        month_grid: "w-full table-fixed border-separate border-spacing-1.5",
        weekdays: "",
        weekday: "pb-2 text-center text-sm font-semibold text-svarati-teal/60",
        weeks: "",
        week: "",
        day: "p-0 text-center align-middle",
        outside: "opacity-40",
        disabled: "opacity-30",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronLeft className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          ),

        // v9: DayContent diganti DayButton
        DayButton: ({ day, modifiers, className: _ignored, ...buttonProps }) => {
          const emoji = moodData[format(day.date, "yyyy-MM-dd")];
          return (
            <button
              {...buttonProps}
              className={cn(
                "flex aspect-square w-full flex-col items-center justify-center rounded-xl text-sm transition-colors",
                emoji ? "bg-svarati-cream" : "hover:bg-gray-100",
                modifiers.today && "font-bold text-svarati-coral",
                modifiers.selected && "ring-2 ring-svarati-teal",
                modifiers.outside && "pointer-events-none"
              )}
            >
              {emoji && <span className="text-xl leading-none">{emoji}</span>}
              <span
                className={cn(
                  "leading-none",
                  emoji ? "mt-1 text-[10px] text-gray-400" : "text-sm text-svarati-teal"
                )}
              >
                {format(day.date, "d")}
              </span>
            </button>
          );
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };