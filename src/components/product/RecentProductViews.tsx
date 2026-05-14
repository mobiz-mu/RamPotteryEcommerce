"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock3, Eye, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

type RecentProduct = {
  id: string;
  title: string;
  slug: string;
  price: number;
  image: string;
  categoryName?: string;
};

type RecentProductViewsProps = {
  currentProduct: RecentProduct;
};

const RECENT_KEY = "ram-pottery-recent-product-views";

function formatCurrency(value: number) {
  return `Rs ${Number(value || 0).toLocaleString("en-MU")}`;
}

function readRecentProducts(): RecentProduct[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item) => item?.id && item?.title && item?.slug && item?.image,
    );
  } catch {
    return [];
  }
}

function writeRecentProducts(products: RecentProduct[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(RECENT_KEY, JSON.stringify(products.slice(0, 8)));
}

export default function RecentProductViews({
  currentProduct,
}: RecentProductViewsProps) {
  const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([]);

  useEffect(() => {
    const existing = readRecentProducts();

    const withoutCurrent = existing.filter(
      (item) => item.id !== currentProduct.id,
    );

    const next = [currentProduct, ...withoutCurrent].slice(0, 8);

    writeRecentProducts(next);

    setRecentProducts(withoutCurrent.slice(0, 6));
  }, [currentProduct]);

  if (recentProducts.length === 0) {
    return null;
  }

  return (
    <section className="bg-white px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-red-900/10 bg-red-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-red-900">
              <Clock3 className="h-3.5 w-3.5" />
              Recently Viewed
            </div>

            <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-neutral-950 sm:text-4xl">
              Continue Exploring
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-600">
              Products you recently viewed while browsing Ram Pottery.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex w-fit items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-red-900 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-red-900/20 hover:bg-red-50"
          >
            Shop More
            <ShoppingBag className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {recentProducts.map((product, index) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-[0_12px_38px_rgba(15,10,5,0.055)] transition duration-500 hover:-translate-y-1 hover:border-red-900/20 hover:shadow-[0_24px_80px_rgba(80,0,0,0.12)]"
            >
              <div className="relative aspect-square overflow-hidden bg-[#faf6ef]">
                <Image
                  src={product.image}
                  alt={`${product.title} - Ram Pottery Mauritius`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  loading={index < 2 ? "eager" : "lazy"}
                  className="object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-red-900 shadow-sm backdrop-blur">
                  <Eye className="h-4 w-4" />
                </div>
              </div>

              <div className="p-3 sm:p-4">
                <p className="line-clamp-1 text-[9px] font-black uppercase tracking-[0.18em] text-red-900/70">
                  {product.categoryName || "Ram Pottery"}
                </p>

                <h3 className="mt-2 line-clamp-2 min-h-[38px] text-[13px] font-black leading-snug tracking-[-0.02em] text-neutral-950 sm:text-sm">
                  {product.title}
                </h3>

                <p className="mt-3 text-sm font-black text-red-950 sm:text-base">
                  {formatCurrency(product.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}