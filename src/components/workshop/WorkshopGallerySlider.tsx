"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

const workshopImages = [
  {
    src: "/images/Our%20Workshop/12.png",
    alt: "Ram Pottery workshop handcrafted clay process image 12",
  },
  {
    src: "/images/Our%20Workshop/13.png",
    alt: "Ram Pottery workshop handcrafted clay process image 13",
  },
  {
    src: "/images/Our%20Workshop/14.png",
    alt: "Ram Pottery workshop handcrafted clay process image 14",
  },
  {
    src: "/images/Our%20Workshop/1.png",
    alt: "Ram Pottery workshop handcrafted clay process image 1",
  },
  {
    src: "/images/Our%20Workshop/2.png",
    alt: "Ram Pottery workshop handcrafted clay process image 2",
  },
  {
    src: "/images/Our%20Workshop/3.png",
    alt: "Ram Pottery workshop handcrafted clay process image 3",
  },
  {
    src: "/images/Our%20Workshop/4.png",
    alt: "Ram Pottery workshop handcrafted clay process image 4",
  },
  {
    src: "/images/Our%20Workshop/5.png",
    alt: "Ram Pottery workshop handcrafted clay process image 5",
  },
  {
    src: "/images/Our%20Workshop/6.png",
    alt: "Ram Pottery workshop handcrafted clay process image 6",
  },
  {
    src: "/images/Our%20Workshop/7.png",
    alt: "Ram Pottery workshop handcrafted clay process image 7",
  },
  {
    src: "/images/Our%20Workshop/8.png",
    alt: "Ram Pottery workshop handcrafted clay process image 8",
  },
  {
    src: "/images/Our%20Workshop/9.png",
    alt: "Ram Pottery workshop handcrafted clay process image 9",
  },
  {
    src: "/images/Our%20Workshop/10.png",
    alt: "Ram Pottery workshop handcrafted clay process image 10",
  },
  {
    src: "/images/Our%20Workshop/11.png",
    alt: "Ram Pottery workshop handcrafted clay process image 11",
  },
];

export default function WorkshopGallerySlider() {
  const sliderRef = useRef<HTMLDivElement | null>(null);

  function scrollGallery(direction: "left" | "right") {
    const slider = sliderRef.current;
    if (!slider) return;

    slider.scrollBy({
      left: direction === "left" ? -620 : 620,
      behavior: "smooth",
    });
  }

  return (
    <section className="bg-white px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.32em] text-red-900">
              Workshop Gallery
            </p>

            <h2 className="mt-4 max-w-3xl text-3xl font-black tracking-[-0.05em] text-neutral-950 sm:text-4xl lg:text-5xl">
              A Closer Look at Our Clay, Hands and Craft
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
              Explore real workshop moments from Ram Pottery — shaping,
              refining, detailing and preparing handcrafted pieces with care.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => scrollGallery("left")}
              aria-label="Previous workshop images"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-neutral-200 bg-white text-red-900 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-red-900/20 hover:bg-red-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => scrollGallery("right")}
              aria-label="Next workshop images"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-900 text-white shadow-[0_14px_34px_rgba(127,29,29,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-red-800"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={sliderRef}
          className="grid auto-cols-[76vw] grid-flow-col grid-rows-2 gap-4 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] sm:auto-cols-[360px] lg:auto-cols-[420px] [&::-webkit-scrollbar]:hidden"
        >
          {workshopImages.map((image, index) => (
            <div
              key={image.src}
              className="group relative aspect-[4/3] overflow-hidden rounded-[28px] border border-neutral-200 bg-[#faf6ef] shadow-[0_14px_45px_rgba(15,10,5,0.06)]"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 76vw, (max-width: 1024px) 360px, 420px"
                priority={index < 2}
                loading={index < 2 ? "eager" : "lazy"}
                className="object-cover transition duration-700 group-hover:scale-110"
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/18 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}