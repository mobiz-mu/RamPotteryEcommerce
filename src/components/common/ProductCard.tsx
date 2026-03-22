"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";

type ProductImage = {
  imageUrl: string;
};

type Product = {
  id: string;
  title: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  images: ProductImage[];
};

function formatCurrency(value: number) {
  return `Rs ${value.toLocaleString("en-MU")}`;
}

export default function ProductCard({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();

  const finalPrice = product.salePrice ?? product.price;
  const imageUrl = product.images?.[0]?.imageUrl || "/images/placeholder-product.jpg";

  function handleAddToCart() {
    addItem({
      id: product.id,
      title: product.title,
      slug: product.slug,
      image: imageUrl,
      price: finalPrice,
      quantity: qty,
    });

    alert("Product added to cart.");
  }

  return (
    <div className="group overflow-hidden rounded-[1.75rem] border border-neutral-200 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[1/1] overflow-hidden bg-neutral-100">
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          />
        </div>
      </Link>

      <div className="p-5">
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 text-lg font-semibold text-neutral-950 transition hover:text-red-600">
            {product.title}
          </h3>
        </Link>

        <div className="mt-3 flex items-center gap-3">
          <p className="text-base font-semibold text-neutral-950">
            {formatCurrency(finalPrice)}
          </p>

          {product.salePrice ? (
            <p className="text-sm text-neutral-400 line-through">
              {formatCurrency(product.price)}
            </p>
          ) : null}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="inline-flex items-center overflow-hidden rounded-full border border-neutral-200">
            <button
              type="button"
              onClick={() => setQty((prev) => Math.max(1, prev - 1))}
              className="h-9 w-9 text-sm text-neutral-700 transition hover:bg-neutral-50"
            >
              −
            </button>
            <div className="flex h-9 min-w-[34px] items-center justify-center text-sm font-medium text-neutral-900">
              {qty}
            </div>
            <button
              type="button"
              onClick={() => setQty((prev) => prev + 1)}
              className="h-9 w-9 text-sm text-neutral-700 transition hover:bg-neutral-50"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white transition hover:bg-red-700"
            aria-label={`Add ${product.title} to cart`}
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}