"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

type GalleryScrollerProps = {
  label: string;
  children: React.ReactNode;
};

export default function GalleryScroller({
  label,
  children,
}: GalleryScrollerProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  function scroll(direction: "left" | "right") {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    scroller.scrollBy({
      left: direction === "left" ? -680 : 680,
      behavior: "smooth",
    });
  }

  return (
    <div className="relative">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-neutral-400">
          {label}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label={`Scroll ${label} left`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-red-900 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-red-900/20 hover:bg-red-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label={`Scroll ${label} right`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-900 text-white shadow-[0_12px_28px_rgba(127,29,29,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-red-800"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
    </div>
  );
}