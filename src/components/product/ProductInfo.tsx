"use client";

import Link from "next/link";
import {
  Check,
  Heart,
  MessageCircle,
  Minus,
  PackageCheck,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
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

  const isOutOfStock =
    !product.is_in_stock || Number(product.stock_qty ?? 0) <= 0;

  const stockQty = Number(product.stock_qty ?? 0);
  const productImage = getPrimaryImage(product);

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
      productTitle: product.title,
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
        toast.error("This product is currently out of stock.");
        return;
      }

      const existing = readCart();
      const existingIndex = existing.findIndex((item) => item.id === product.id);

      let next: CartItem[];

      if (existingIndex >= 0) {
        next = existing.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: Number(item.quantity || 0) + qty,
              }
            : item,
        );
      } else {
        next = [
          ...existing,
          {
            id: product.id,
            title: product.title,
            slug: product.slug,
            image: productImage,
            price,
            quantity: qty,
          },
        ];
      }

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
    <div className="rounded-[34px] border border-neutral-200 bg-white p-5 shadow-[0_18px_70px_rgba(15,10,5,0.07)] sm:p-7">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-2 rounded-full border border-red-900/10 bg-red-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-red-900">
          <Sparkles className="h-3.5 w-3.5" />
          {product.badge || "Handmade Selection"}
        </span>

        {product.categories?.name ? (
          <Link
            href={`/categories/${product.categories.slug}`}
            className="inline-flex rounded-full border border-neutral-200 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-neutral-500 transition hover:border-red-900/20 hover:bg-red-50 hover:text-red-900"
          >
            {product.categories.name}
          </Link>
        ) : null}
      </div>

      <h1 className="text-3xl font-black leading-tight tracking-[-0.05em] text-neutral-950 sm:text-4xl lg:text-5xl">
        {product.title}
      </h1>

      {product.short_description ? (
        <p className="mt-4 text-sm leading-7 text-neutral-600 sm:text-base">
          {product.short_description}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-end gap-3">
        <p className="text-3xl font-black tracking-[-0.05em] text-red-950 sm:text-4xl">
          {formatCurrency(price)}
        </p>

        {hasComparePrice ? (
          <p className="pb-1 text-lg font-semibold text-neutral-400 line-through">
            {formatCurrency(compareAtPrice)}
          </p>
        ) : null}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <span
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.14em] ${
            isOutOfStock
              ? "bg-neutral-100 text-neutral-500"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              isOutOfStock ? "bg-neutral-400" : "bg-emerald-500"
            }`}
          />
          {isOutOfStock ? "Out of stock" : "In stock"}
        </span>

        {!isOutOfStock && stockQty > 0 ? (
          <span className="inline-flex rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-neutral-500">
            {stockQty.toLocaleString("en-MU")} available
          </span>
        ) : null}
      </div>

      <div className="mt-8 rounded-[28px] border border-neutral-200 bg-[#faf8f4] p-4 sm:p-5">
        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-neutral-400">
          Quantity
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="grid h-12 w-full grid-cols-[48px_1fr_48px] overflow-hidden rounded-2xl border border-neutral-200 bg-white sm:w-[170px]">
            <button
              type="button"
              onClick={decreaseQty}
              className="inline-flex items-center justify-center text-red-900 transition hover:bg-red-50"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>

            <div className="flex items-center justify-center border-x border-neutral-100 text-sm font-black text-neutral-950">
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
            className={`inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl px-6 text-xs font-black uppercase tracking-[0.16em] shadow-[0_14px_34px_rgba(127,29,29,0.22)] transition duration-300 sm:flex-1 ${
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
            {added ? "Added" : "Add to Cart"}
          </button>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
          <a
            href={mounted && !isOutOfStock ? whatsappUrl : "#"}
            target="_blank"
            rel="noreferrer"
            aria-disabled={!mounted || isOutOfStock}
            className={`inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-6 text-xs font-black uppercase tracking-[0.16em] transition duration-300 ${
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
            className={`inline-flex h-12 items-center justify-center gap-2 rounded-2xl border px-6 text-xs font-black uppercase tracking-[0.16em] transition duration-300 hover:-translate-y-0.5 ${
              wishlisted
                ? "border-red-900 bg-red-50 text-red-900"
                : "border-neutral-200 bg-white text-red-900 hover:border-red-900/20 hover:bg-red-50"
            }`}
          >
            <Heart className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`} />
            {wishlisted ? "Saved" : "Wishlist"}
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <TrustCard
          icon={<ShieldCheck className="h-5 w-5" />}
          title="Secure"
          desc="Safe checkout flow"
        />
        <TrustCard
          icon={<PackageCheck className="h-5 w-5" />}
          title="Prepared"
          desc="Packed with care"
        />
        <TrustCard
          icon={<Truck className="h-5 w-5" />}
          title="Delivery"
          desc="Mauritius follow-up"
        />
      </div>

      {product.description ? (
        <div className="mt-8 border-t border-neutral-200 pt-7">
          <h2 className="text-2xl font-black tracking-[-0.04em] text-neutral-950">
            Product Details
          </h2>

          <div className="mt-4 whitespace-pre-line text-sm leading-7 text-neutral-600 sm:text-base">
            {product.description}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function TrustCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-[22px] border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-900">
        {icon}
      </div>

      <h3 className="text-sm font-black text-neutral-950">{title}</h3>
      <p className="mt-1 text-xs font-semibold leading-5 text-neutral-500">
        {desc}
      </p>
    </div>
  );
}