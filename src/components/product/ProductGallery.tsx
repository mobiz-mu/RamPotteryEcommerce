"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

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

    return sorted.map((img) => ({
      ...img,
      image_url: img.image_url || "/images/placeholder-product.jpg",
      alt_text: img.alt_text || product.title,
    }));
  }, [product]);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex];

  return (
    <div className="space-y-4">
      <div className="relative aspect-[1/1] overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-[0_15px_40px_rgba(0,0,0,0.04)]">
        <Image
          src={activeImage.image_url!}
          alt={activeImage.alt_text || product.title}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition duration-500"
        />
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-square overflow-hidden rounded-2xl border transition ${
                activeIndex === index
                  ? "border-red-500 ring-2 ring-red-100"
                  : "border-neutral-200 hover:border-red-300"
              }`}
            >
              <Image
                src={image.image_url!}
                alt={image.alt_text || product.title}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}