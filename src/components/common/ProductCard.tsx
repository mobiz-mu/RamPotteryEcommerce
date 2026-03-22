"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMUR } from "@/lib/utils/currency";
import type { Product } from "@/types";
import WishlistButton from "@/components/common/WishlistButton";
import QuantitySelector from "@/components/product/QuantitySelector";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

export default function ProductCard({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();

  const finalPrice = product.salePrice ?? product.price;

  function handleAddToCart() {
    addItem({
      productId: product.id,
      title: product.title,
      slug: product.slug,
      image: product.images[0]?.imageUrl || "",
      price: finalPrice,
      quantity: qty,
    });

    toast.success(`${product.title} added to cart`);
  }

  return (
    <div className="group">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
          {product.badge ? (
            <div className="absolute left-3 top-3 z-10 rounded bg-[#d97845] px-2 py-1 text-xs font-semibold text-white">
              {product.badge === "sale"
                ? "- Sale"
                : product.badge === "new"
                ? "New"
                : "Best Seller"}
            </div>
          ) : null}

          <div className="flex h-full items-center justify-center text-sm text-neutral-400">
            Product Image
          </div>

          <div className="absolute right-3 top-3 z-10">
            <WishlistButton productId={product.id} />
          </div>
        </div>
      </Link>

      <div className="pt-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 text-lg font-medium uppercase leading-snug text-neutral-950">
            {product.title}
          </h3>
        </Link>

        <div className="mt-2 text-sm text-neutral-500">
          {product.category?.name || "Ram Pottery"}
        </div>

        <div className="mt-3 flex items-center gap-3 text-lg">
          {product.salePrice ? (
            <>
              <span className="text-sm text-neutral-400 line-through">
                {formatMUR(product.price)}
              </span>
              <span className="font-semibold text-neutral-950">
                {formatMUR(product.salePrice)}
              </span>
            </>
          ) : (
            <span className="font-semibold text-neutral-950">
              {formatMUR(product.price)}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <QuantitySelector value={qty} onChange={setQty} />

          <Button
            size="icon"
            className="rounded-full"
            aria-label="Add to cart"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}