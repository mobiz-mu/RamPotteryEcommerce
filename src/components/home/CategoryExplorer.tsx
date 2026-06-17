"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const ROTATE_INTERVAL = 180000; // 3 minutes

const categoryItems = [
  {
    name: "Ceramic Tulsi Pot",
    slug: "ceramic-tulsi-pot",
    image: "/images/categories/ceramic-tulsi-pot.jpg",
  },
  {
    name: "Ceramic Vase",
    slug: "ceramic-vase",
    image: "/images/categories/ceramic-vase.jpg",
  },
  {
    name: "Clay Cookingware",
    slug: "clay-cookingware",
    image: "/images/categories/clay-cookingware.jpg",
  },
  {
    name: "Clay Flower Pot",
    slug: "clay-flower-pot",
    image: "/images/categories/clay-flower-pot.jpg",
  },
  {
    name: "Clay Matka",
    slug: "clay-matka",
    image: "/images/categories/clay-matka.jpg",
  },
  {
    name: "Clay Murti",
    slug: "clay-murti",
    image: "/images/categories/clay-murti.jpg",
  },
  {
    name: "Clay Pooja Products",
    slug: "clay-pooja-products",
    image: "/images/categories/clay-pooja-products.jpg",
  },
  {
    name: "Clay Souvenir",
    slug: "clay-souvenir",
    image: "/images/categories/clay-souvenir.jpg",
  },
  {
    name: "Clay Wind Chime",
    slug: "clay-wind-chime",
    image: "/images/categories/clay-wind-chime.jpg",
  },
  {
    name: "Earthen Clay Lamp",
    slug: "earthen-clay-lamp",
    image: "/images/categories/earthen-clay-lamp.jpg",
  },
  {
    name: "Other Category",
    slug: "other-category",
    image: "/images/categories/other-category.jpg",
  },
  {
    name: "Painting & Wax Lamp",
    slug: "painting-wax-lamp",
    image: "/images/categories/painting-wax-lamp.jpg",
  },
  {
    name: "Tableware",
    slug: "tableware",
    image: "/images/categories/tableware.jpg",
  },
  {
    name: "Terracotta Home Decor",
    slug: "terracotta-home-decor",
    image: "/images/categories/terracotta-home-decor.jpg",
  },
];

function rotateItems<T>(items: T[], startIndex: number) {
  return [...items.slice(startIndex), ...items.slice(0, startIndex)];
}

export default function CategoryExplorer() {
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setStartIndex((current) => (current + 2) % categoryItems.length);
    }, ROTATE_INTERVAL);

    return () => window.clearInterval(timer);
  }, []);

  const rotatedItems = useMemo(() => {
    return rotateItems(categoryItems, startIndex);
  }, [startIndex]);

  const featuredItems = rotatedItems.slice(0, 2);
  const gridItems = rotatedItems.slice(2, 14);

  return (
    <section className="overflow-hidden bg-white py-5 sm:py-6 lg:py-7">
      <div className="container-padded">
        <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black leading-tight tracking-[-0.05em] text-neutral-950 sm:text-3xl">
              Shop by handcrafted collections
            </h2>

            <p className="mt-1.5 max-w-xl text-sm leading-6 text-neutral-600">
              Discover pottery, tableware, pooja items, décor and terracotta
              collections crafted with tradition.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-red-900 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.16em] text-white shadow-[0_12px_30px_rgba(127,29,29,0.22)] transition hover:-translate-y-0.5 hover:bg-red-800"
          >
            View All
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid gap-3 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[235px_minmax(0,1fr)] 2xl:grid-cols-[250px_minmax(0,1fr)]">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            {featuredItems.map((item, index) => (
              <CategoryCard
                key={`${item.slug}-${startIndex}-featured-${index}`}
                item={item}
                variant="featured"
                priority={index < 2}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {gridItems.map((item, index) => (
              <CategoryCard
                key={`${item.slug}-${startIndex}-grid-${index}`}
                item={item}
                variant="compact"
                priority={index < 4}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryCard({
  item,
  variant,
  priority = false,
}: {
  item: {
    name: string;
    slug: string;
    image: string;
  };
  variant: "featured" | "compact";
  priority?: boolean;
}) {
  const isFeatured = variant === "featured";

  return (
    <Link
      href={`/categories/${item.slug}`}
      prefetch={false}
      className={`group relative block aspect-square overflow-hidden border border-red-950/10 bg-white shadow-[0_12px_34px_rgba(70,20,10,0.07)] transition duration-500 hover:-translate-y-1 hover:border-red-900/20 hover:shadow-[0_20px_55px_rgba(70,20,10,0.13)] ${
        isFeatured ? "rounded-[24px]" : "rounded-[20px]"
      }`}
    >
      <Image
        src={item.image}
        alt={`${item.name} - Ram Pottery Mauritius`}
        fill
        priority={priority}
        sizes={
          isFeatured
            ? "(max-width: 1024px) 50vw, 250px"
            : "(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
        }
        className="object-cover object-center transition duration-700 ease-out group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/76 via-black/22 to-transparent" />

      <div className={isFeatured ? "absolute inset-x-0 bottom-0 p-4" : "absolute inset-x-0 bottom-0 p-3"}>
        <p
          className={`text-balance font-semibold leading-tight tracking-[-0.03em] text-white drop-shadow ${
            isFeatured ? "text-lg sm:text-xl" : "text-xs sm:text-sm"
          }`}
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          {item.name}
        </p>

        <div
          className={`mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/92 font-black uppercase tracking-[0.14em] text-red-900 shadow-sm backdrop-blur transition group-hover:bg-red-900 group-hover:text-white ${
            isFeatured ? "px-3 py-1.5 text-[9px]" : "px-2.5 py-1 text-[8px]"
          }`}
        >
          Shop
          <ArrowRight className={isFeatured ? "h-3 w-3" : "h-2.5 w-2.5"} />
        </div>
      </div>
    </Link>
  );
}