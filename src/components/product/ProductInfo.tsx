"use client";

import Link from "next/link";
import { getProductTitleMeta } from "@/lib/product-title";
import {
  Check,
  Heart,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type Category = {
  name: string;
  slug: string;
};

type ProductImage = {
  image_url?: string | null;
  alt_text?: string | null;
  is_primary?: boolean | null;
  sort_order?: number | null;
};

type Product = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  price: number | null;
  compare_at_price: number | null;
  badge: string | null;
  stock_qty: number | null;
  is_in_stock: boolean;
  categories?: Category | null;
  product_images?: ProductImage[] | null;
};

type Props = {
  product: Product;
};

type CartItem = {
  id: string;
  title: string;
  slug: string;
  price: number;
  quantity: number;
  image?: string;
};

const WHATSAPP_NUMBER = "23057788884";
const CART_KEY = "ram-pottery-cart";
const WISHLIST_KEY = "ram-pottery-wishlist";
const CART_UPDATED_EVENT = "ram-pottery-cart-updated";
const WISHLIST_UPDATED_EVENT = "ram-pottery-wishlist-updated";

function formatCurrency(price: number | null | undefined) {
  const value = Number(price ?? 0);
  return `Rs ${value.toLocaleString("en-MU")}`;
}

function getPrimaryImage(product: Product) {
  const images = [...(product.product_images ?? [])].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;

    return Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0);
  });

  return (
    images.find((image) => image.is_primary)?.image_url ||
    images[0]?.image_url ||
    "/images/placeholder-product.jpg"
  );
}

function buildWhatsAppLink({
  productTitle,
  quantity,
  price,
  productUrl,
}: {
  productTitle: string;
  quantity: number;
  price: number;
  productUrl: string;
}) {
  const message = `Hello Ram Pottery, I want to order this product:

Product: ${productTitle}
Quantity: ${quantity}
Price: ${formatCurrency(price)}
Product Link: ${productUrl}

Please confirm availability and delivery details.`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function readCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  if (items.length > 0) {
    window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  } else {
    window.localStorage.removeItem(CART_KEY);
  }

  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
}

function readWishlist(): string[] {
  try {
    const raw = window.localStorage.getItem(WISHLIST_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function writeWishlist(items: string[]) {
  const uniqueItems = Array.from(new Set(items.map(String)));

  if (uniqueItems.length > 0) {
    window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(uniqueItems));
  } else {
    window.localStorage.removeItem(WISHLIST_KEY);
  }

  window.dispatchEvent(new CustomEvent(WISHLIST_UPDATED_EVENT));
}

export default function ProductInfo({ product }: Props) {
  const [qty, setQty] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [productUrl, setProductUrl] = useState("");
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const price = Number(product.price ?? 0);
  const compareAtPrice = Number(product.compare_at_price ?? 0);
  const hasComparePrice = compareAtPrice > price && price > 0;
  const isOutOfStock = !product.is_in_stock;
  const productImage = getPrimaryImage(product);
  const { cleanTitle, sku } = getProductTitleMeta(product.title);
  const displayTitle = cleanTitle || product.title;

  useEffect(() => {
    setMounted(true);
    setProductUrl(window.location.href);
    setWishlisted(readWishlist().includes(String(product.id)));

    function syncWishlist() {
      setWishlisted(readWishlist().includes(String(product.id)));
    }

    window.addEventListener(WISHLIST_UPDATED_EVENT, syncWishlist);
    window.addEventListener("storage", syncWishlist);

    return () => {
      window.removeEventListener(WISHLIST_UPDATED_EVENT, syncWishlist);
      window.removeEventListener("storage", syncWishlist);
    };
  }, [product.id]);

  const whatsappUrl = useMemo(() => {
    return buildWhatsAppLink({
      productTitle: displayTitle,
      quantity: qty,
      price,
      productUrl,
    });
  }, [product.title, qty, price, productUrl]);

  function decreaseQty() {
    setQty((current) => Math.max(1, current - 1));
  }

  function increaseQty() {
    setQty((current) => Math.min(99, current + 1));
  }

  function handleAddToCart() {
    try {
      if (isOutOfStock) {
        toast.error("This product is currently unavailable.");
        return;
      }

      const existing = readCart();
      const existingIndex = existing.findIndex((item) => item.id === product.id);

      const next =
        existingIndex >= 0
          ? existing.map((item) =>
              item.id === product.id
                ? {
                    ...item,
                    quantity: Number(item.quantity || 0) + qty,
                  }
                : item,
            )
          : [
              ...existing,
              {
                id: product.id,
                title: displayTitle,
                slug: product.slug,
                image: productImage,
                price,
                quantity: qty,
              },
            ];

      writeCart(next);

      setAdded(true);
      toast.success("Product added to cart.");

      window.setTimeout(() => {
        setAdded(false);
      }, 1200);
    } catch (error) {
      console.error("Add to cart failed:", error);
      toast.error("Could not add product to cart.");
    }
  }

  function handleWishlist() {
    try {
      const current = readWishlist();
      const exists = current.includes(String(product.id));

      const next = exists
        ? current.filter((id) => id !== String(product.id))
        : [...current, String(product.id)];

      writeWishlist(next);
      setWishlisted(!exists);

      toast.success(exists ? "Removed from wishlist." : "Added to wishlist.");
    } catch (error) {
      console.error("Wishlist update failed:", error);
      toast.error("Could not update wishlist.");
    }
  }

  return (
    <div>
      {product.categories?.name ? (
        <Link
          href={`/categories/${product.categories.slug}`}
          className="mb-5 inline-flex rounded-full border border-red-950/10 bg-[#fff8f1] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-900 transition hover:border-red-900/25 hover:bg-red-50"
        >
          {product.categories.name}
        </Link>
      ) : null}

      <h1 className="text-balance text-3xl font-semibold leading-tight tracking-[-0.05em] text-neutral-950 sm:text-4xl lg:text-5xl">
         {displayTitle}
      </h1>

     {sku ? (
        <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-red-900">
          SKU: {sku}
        </p>
     ) : null}

      {product.short_description ? (
        <p className="mt-4 text-sm leading-7 text-neutral-600 sm:text-[15px]">
          {product.short_description}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-end gap-3">
        <p className="text-3xl font-semibold tracking-[-0.04em] text-red-950 sm:text-4xl">
          {formatCurrency(price)}
        </p>

        {hasComparePrice ? (
          <p className="pb-1 text-base font-medium text-neutral-400 line-through">
            {formatCurrency(compareAtPrice)}
          </p>
        ) : null}
      </div>

      <div className="mt-7 rounded-[26px] border border-red-950/10 bg-[#fffaf4] p-4 sm:p-5">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
          Quantity
        </p>

        <div className="grid gap-3 sm:grid-cols-[150px_1fr]">
          <div className="grid h-12 grid-cols-[48px_1fr_48px] overflow-hidden rounded-full border border-red-950/10 bg-white">
            <button
              type="button"
              onClick={decreaseQty}
              className="inline-flex items-center justify-center text-red-900 transition hover:bg-red-50"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>

            <div className="flex items-center justify-center border-x border-red-950/10 text-sm font-semibold text-neutral-950">
              {qty}
            </div>

            <button
              type="button"
              onClick={increaseQty}
              className="inline-flex items-center justify-center text-red-900 transition hover:bg-red-50"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-xs font-semibold uppercase tracking-[0.16em] shadow-[0_14px_34px_rgba(127,29,29,0.22)] transition duration-300 ${
              added
                ? "bg-green-600 text-white"
                : "bg-red-900 text-white hover:-translate-y-0.5 hover:bg-red-800"
            } disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500 disabled:shadow-none`}
          >
            {added ? (
              <Check className="h-4 w-4" />
            ) : (
              <ShoppingBag className="h-4 w-4" />
            )}
            {added ? "Added" : isOutOfStock ? "Unavailable" : "Add to Cart"}
          </button>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_150px]">
          <a
            href={mounted && !isOutOfStock ? whatsappUrl : "#"}
            target="_blank"
            rel="noreferrer"
            aria-disabled={!mounted || isOutOfStock}
            className={`inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-xs font-semibold uppercase tracking-[0.14em] transition duration-300 ${
              isOutOfStock
                ? "pointer-events-none bg-neutral-200 text-neutral-400"
                : "bg-neutral-950 text-white shadow-[0_14px_34px_rgba(15,10,5,0.18)] hover:-translate-y-0.5 hover:bg-red-950"
            }`}
          >
            <MessageCircle className="h-4 w-4" />
            Order on WhatsApp
          </a>

          <button
            type="button"
            onClick={handleWishlist}
            className={`inline-flex h-12 items-center justify-center gap-2 rounded-full border px-5 text-xs font-semibold uppercase tracking-[0.14em] transition duration-300 hover:-translate-y-0.5 ${
              wishlisted
                ? "border-red-900 bg-red-50 text-red-900"
                : "border-red-950/10 bg-white text-red-900 hover:border-red-900/20 hover:bg-red-50"
            }`}
          >
            <Heart className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`} />
            {wishlisted ? "Saved" : "Wishlist"}
          </button>
        </div>
      </div>
    </div>
  );
}