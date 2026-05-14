"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";

type ProductImage = {
  id: string;
  image_url: string | null;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number | null;
};

type Product = {
  title: string;
  product_images: ProductImage[] | null;
};

type Props = {
  product: Product;
};

export default function ProductGallery({ product }: Props) {
  const images = useMemo(() => {
    const sorted = [...(product.product_images ?? [])].sort((a, b) => {
      if (a.is_primary && !b.is_primary) return -1;
      if (!a.is_primary && b.is_primary) return 1;
      return Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0);
    });

    if (sorted.length === 0) {
      return [
        {
          id: "placeholder",
          image_url: "/images/placeholder-product.jpg",
          alt_text: product.title,
          is_primary: true,
          sort_order: 0,
        },
      ];
    }

    return sorted.map((img, index) => ({
      ...img,
      id: img.id || `product-image-${index}`,
      image_url: img.image_url || "/images/placeholder-product.jpg",
      alt_text: img.alt_text || `${product.title} - Ram Pottery Mauritius`,
    }));
  }, [product]);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex];

  function goPrevious() {
    setActiveIndex((current) =>
      current === 0 ? images.length - 1 : current - 1,
    );
  }

  function goNext() {
    setActiveIndex((current) =>
      current === images.length - 1 ? 0 : current + 1,
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-[32px] border border-neutral-200 bg-white p-2 shadow-[0_18px_70px_rgba(15,10,5,0.07)] sm:p-3">
        <div className="relative aspect-square overflow-hidden rounded-[26px] bg-[#faf6ef]">
          <Image
            src={activeImage.image_url!}
            alt={activeImage.alt_text || product.title}
            fill
            priority
            loading="eager"
            fetchPriority="high"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 58vw, 52vw"
            className="object-cover transition duration-700 ease-out hover:scale-[1.035]"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/12 via-transparent to-transparent" />

          <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-red-900 shadow-sm backdrop-blur">
            <ImageIcon className="h-3.5 w-3.5" />
            {activeIndex + 1} / {images.length}
          </div>

          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={goPrevious}
                aria-label="Previous product image"
                className="absolute left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-red-900 shadow-[0_12px_34px_rgba(15,10,5,0.12)] backdrop-blur transition hover:scale-105 hover:bg-red-900 hover:text-white sm:inline-flex"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={goNext}
                aria-label="Next product image"
                className="absolute right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-red-900 shadow-[0_12px_34px_rgba(15,10,5,0.12)] backdrop-blur transition hover:scale-105 hover:bg-red-900 hover:text-white sm:inline-flex"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          ) : null}
        </div>
      </div>

      {images.length > 1 ? (
        <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((image, index) => (
            <button
              key={`${image.id}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View product image ${index + 1}`}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border bg-[#faf6ef] transition duration-300 sm:h-24 sm:w-24 ${
                activeIndex === index
                  ? "border-red-900 ring-4 ring-red-900/10"
                  : "border-neutral-200 hover:border-red-900/30"
              }`}
            >
              <Image
                src={image.image_url!}
                alt={image.alt_text || product.title}
                fill
                sizes="96px"
                loading="lazy"
                className="object-cover transition duration-500 hover:scale-110"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}