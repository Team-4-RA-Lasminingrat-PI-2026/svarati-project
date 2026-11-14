"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ScrollRow({ children }) {
  const ref = useRef(null);
  const [edge, setEdge] = useState({ left: false, right: false });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdge({
      left: el.scrollLeft > 4,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => ro.disconnect();
  }, [update]);

  const scrollBy = (dir) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: "smooth" });
  };

  const arrow =
    "absolute top-1/2 hidden size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-svarati-lavender-dark shadow-md transition hover:bg-svarati-lavender-light md:flex";

  return (
    <div className="relative">
      <div
        ref={ref}
        onScroll={update}
        className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>*]:w-max [&>*]:flex-nowrap [&_button]:shrink-0 [&_button]:whitespace-nowrap"
      >
        {children}
      </div>

      {edge.left && (
        <button type="button" onClick={() => scrollBy(-1)} aria-label="Geser kategori ke kiri" className={`${arrow} left-0`}>
          <ChevronLeft className="size-4" aria-hidden="true" />
        </button>
      )}
      {edge.right && (
        <button type="button" onClick={() => scrollBy(1)} aria-label="Geser kategori ke kanan" className={`${arrow} right-0`}>
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}