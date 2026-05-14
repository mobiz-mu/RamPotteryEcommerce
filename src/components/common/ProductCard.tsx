"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";

type ProductImage = {
  imageUrl?: string;
  image_url?: string;
  alt_text?: string | null;
  is_primary?: boolean | null;
  sort_order?: number | null;
};

type Product = {
  id: string;
  title: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  sale_price?: number | null;
  badge?: string | null;
  images?: ProductImage[];
  product_images?: ProductImage[];
  category_name?: string | null;
  categories?: {
    name?: string | null;
  } | null;
};

function formatCurrency(value: number) {
  return `Rs ${Number(value || 0).toLocaleString("en-MU")}`;
}

function getProductImages(product: Product) {
  const images = product.product_images?.length
    ? product.product_images
    : product.images || [];

  return images;
}

function getProductImage(product: Product) {
  const images = getProductImages(product);

  const primary =
    images.find((image) => image.is_primary)?.image_url ||
    images.find((image) => image.is_primary)?.imageUrl ||
    images
      .slice()
      .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))[0]
      ?.image_url ||
    images
      .slice()
      .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))[0]
      ?.imageUrl;

  return primary || "/images/placeholder-product.jpg";
}

function getProductAlt(product: Product) {
  const images = getProductImages(product);

  return (
    images.find((image) => image.is_primary)?.alt_text ||
    `${product.title} - Ram Pottery Mauritius`
  );
}

function getCategoryName(product: Product) {
  return (
    product.categories?.name ||
    product.category_name ||
    "Ram Pottery"
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const finalPrice = Number(product.salePrice ?? product.sale_price ?? product.price ?? 0);
  const originalPrice = Number(product.price || 0);
  const imageUrl = getProductImage(product);
  const imageAlt = getProductAlt(product);
  const categoryName = getCategoryName(product);

  function handleAddToCart() {
    addItem({
      id: String(product.id),
      title: product.title,
      slug: product.slug,
      image: imageUrl,
      price: finalPrice,
      quantity: qty,
    });

    setAdded(true);
    toast.success("Product added to cart.");

    window.setTimeout(() => {
      setAdded(false);
    }, 1200);
  }

  return (
    <article className="group overflow-hidden rounded-[24px] border border-neutral-200/90 bg-white shadow-[0_12px_34px_rgba(15,10,5,0.055)] transition duration-500 hover:-translate-y-1 hover:border-red-900/20 hover:shadow-[0_22px_70px_rgba(80,0,0,0.12)] sm:rounded-[30px]">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-[#faf6ef]">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading="lazy"
            className="object-cover transition duration-700 ease-out group-hover:scale-110"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/16 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

          {product.badge ? (
            <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-red-900 shadow-sm backdrop-blur">
              {product.badge}
            </div>
          ) : null}
        </div>
      </Link>

      <div className="p-3 sm:p-5">
        <Link href={`/products/${product.slug}`} className="block">
          <p className="line-clamp-1 text-[9px] font-black uppercase tracking-[0.18em] text-red-900/70 sm:text-[10px]">
            {categoryName}
          </p>

          <h3 className="mt-2 line-clamp-2 min-h-[40px] text-[13px] font-black leading-snug tracking-[-0.02em] text-neutral-950 transition group-hover:text-red-950 sm:text-base">
            {product.title}
          </h3>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <p className="text-[17px] font-black tracking-[-0.04em] text-red-950 sm:text-lg">
              {formatCurrency(finalPrice)}
            </p>

            {(product.salePrice || product.sale_price) && originalPrice > finalPrice ? (
              <p className="text-sm font-semibold text-neutral-400 line-through">
                {formatCurrency(originalPrice)}
              </p>
            ) : null}
          </div>
        </Link>

        <div className="mt-4 flex items-center gap-2">
          <div className="grid h-10 flex-1 grid-cols-[32px_1fr_32px] overflow-hidden rounded-full border border-neutral-200 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setQty((prev) => Math.max(1, prev - 1))}
              className="inline-flex items-center justify-center text-red-900 transition hover:bg-red-50"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>

            <div className="flex items-center justify-center border-x border-neutral-100 text-sm font-black text-neutral-950">
              {qty}
            </div>

            <button
              type="button"
              onClick={() => setQty((prev) => Math.min(99, prev + 1))}
              className="inline-flex items-center justify-center text-red-900 transition hover:bg-red-50"
              aria-label="Increase quantity"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-[0_12px_26px_rgba(127,29,29,0.22)] transition duration-300 hover:-translate-y-0.5 ${
              added ? "bg-green-600" : "bg-red-900 hover:bg-red-800"
            }`}
            aria-label={`Add ${product.title} to cart`}
          >
            {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </article>
  );
}