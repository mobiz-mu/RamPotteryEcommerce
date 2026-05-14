"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Loader2,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useWishlist } from "@/hooks/useWishlist";

type WishlistProduct = {
  id: string;
  title: string;
  slug: string;
  price: number;
  badge?: string | null;
  image: string;
  alt: string;
  categoryName: string;
};

type CartItem = {
  id: string;
  slug: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
};

const CART_KEY = "ram-pottery-cart";

function money(value: unknown) {
  const amount = Number(value || 0);

  return new Intl.NumberFormat("en-MU", {
    style: "currency",
    currency: "MUR",
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace("MUR", "Rs");
}

function getProductImage(product: any) {
  const images = Array.isArray(product.product_images)
    ? product.product_images
    : [];

  const primaryImage =
    images.find((img: any) => img.is_primary)?.image_url ||
    images
      .slice()
      .sort((a: any, b: any) => Number(a.sort_order) - Number(b.sort_order))?.[0]
      ?.image_url;

  return (
    primaryImage ||
    product.image_url ||
    product.image ||
    product.thumbnail ||
    "/brand/logo.png"
  );
}

function getProductAlt(product: any) {
  const images = Array.isArray(product.product_images)
    ? product.product_images
    : [];

  return (
    images.find((img: any) => img.is_primary)?.alt_text ||
    product.alt_text ||
    `${product.title || product.name || "Ram Pottery Product"} - Ram Pottery Mauritius`
  );
}

function normalizeProduct(product: any): WishlistProduct {
  return {
    id: String(product.id),
    title: String(product.title || product.name || "Ram Pottery Product"),
    slug: String(product.slug || product.id),
    price: Number(product.price || 0),
    badge: product.badge || null,
    image: getProductImage(product),
    alt: getProductAlt(product),
    categoryName:
      product.categories?.name ||
      product.category?.name ||
      product.category_name ||
      "Ram Pottery",
  };
}

function addToCart(product: WishlistProduct) {
  try {
    const existingRaw = window.localStorage.getItem(CART_KEY);
    const existing: CartItem[] = existingRaw ? JSON.parse(existingRaw) : [];

    const itemIndex = existing.findIndex((item) => item.id === product.id);

    if (itemIndex >= 0) {
      existing[itemIndex] = {
        ...existing[itemIndex],
        quantity: Number(existing[itemIndex].quantity || 0) + 1,
      };
    } else {
      existing.push({
        id: product.id,
        slug: product.slug,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
    }

    window.localStorage.setItem(CART_KEY, JSON.stringify(existing));
    window.dispatchEvent(new CustomEvent("ram-pottery-cart-updated"));
  } catch {
    // Keep silent for UI stability.
  }
}

export default function WishlistPage() {
  const { items, loaded, removeItem, clearWishlist } = useWishlist();

  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      if (!loaded) return;

      if (items.length === 0) {
        setProducts([]);
        setLoadingProducts(false);
        return;
      }

      setLoadingProducts(true);

      try {
        const response = await fetch("/api/products", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          setProducts([]);
          return;
        }

        const allProducts = Array.isArray(data.products)
          ? data.products
          : Array.isArray(data)
            ? data
            : [];

        const wishlistProducts = allProducts
          .filter((product: any) => items.includes(String(product.id)))
          .map(normalizeProduct);

        setProducts(wishlistProducts);
      } catch {
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    }

    loadProducts();
  }, [items, loaded]);

  const totalValue = useMemo(
    () => products.reduce((sum, product) => sum + Number(product.price || 0), 0),
    [products],
  );

  function handleAddToCart(product: WishlistProduct) {
    setAddingId(product.id);
    addToCart(product);

    window.setTimeout(() => {
      setAddingId(null);
    }, 900);
  }

  if (!loaded || loadingProducts) {
    return (
      <main className="min-h-screen bg-white px-4 py-10 text-neutral-950 sm:px-6 lg:px-8">
        <section className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center">
          <div className="rounded-[30px] border border-neutral-200 bg-white p-8 text-center shadow-[0_18px_70px_rgba(15,10,5,0.07)]">
            <Loader2 className="mx-auto h-7 w-7 animate-spin text-red-900" />
            <p className="mt-4 text-sm font-bold text-neutral-500">
              Loading your wishlist...
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pt-12">
        <div className="mb-7 overflow-hidden rounded-[34px] border border-neutral-200 bg-white px-5 py-7 shadow-[0_18px_70px_rgba(15,10,5,0.07)] sm:px-8 lg:px-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-red-900/10 bg-red-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-red-900">
                <Heart className="h-3.5 w-3.5 fill-red-900" />
                Wishlist
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-[-0.06em] text-neutral-950 sm:text-4xl lg:text-5xl">
                Your Saved Pieces
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
                Keep your favourite Ram Pottery pieces in one place and return
                anytime to continue shopping.
              </p>
            </div>

            <div className="grid grid-cols-2 overflow-hidden rounded-[24px] border border-neutral-200 bg-[#faf8f4] shadow-sm">
              <div className="border-r border-neutral-200 px-5 py-4 text-center">
                <p className="text-lg font-black text-red-900">
                  {products.length}
                </p>
                <p className="mt-1 text-[9px] font-black uppercase tracking-[0.16em] text-neutral-400">
                  Saved
                </p>
              </div>

              <div className="px-5 py-4 text-center">
                <p className="text-lg font-black text-red-900">
                  {money(totalValue)}
                </p>
                <p className="mt-1 text-[9px] font-black uppercase tracking-[0.16em] text-neutral-400">
                  Value
                </p>
              </div>
            </div>
          </div>
        </div>

        {products.length > 0 ? (
          <>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-bold text-neutral-500">
                Showing{" "}
                <span className="font-black text-neutral-950">
                  {products.length}
                </span>{" "}
                saved item{products.length > 1 ? "s" : ""}
              </p>

              <button
                type="button"
                onClick={clearWishlist}
                className="inline-flex w-fit items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-red-900 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-red-900/20 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Clear Wishlist
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
              {products.map((product, index) => (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-[22px] border border-neutral-200 bg-white shadow-[0_12px_38px_rgba(15,10,5,0.055)] transition duration-500 hover:-translate-y-1 hover:border-red-900/20 hover:shadow-[0_24px_80px_rgba(80,0,0,0.12)] sm:rounded-[30px]"
                >
                  <div className="relative aspect-square overflow-hidden bg-[#faf6ef]">
                    <Link
                      href={`/products/${product.slug}`}
                      aria-label={`View ${product.title}`}
                      className="block h-full"
                    >
                      <Image
                        src={product.image}
                        alt={product.alt}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        priority={index < 4}
                        loading={index < 4 ? "eager" : "lazy"}
                        className="object-cover transition duration-700 group-hover:scale-110"
                      />
                    </Link>

                    <button
                      type="button"
                      onClick={() => removeItem(product.id)}
                      aria-label={`Remove ${product.title} from wishlist`}
                      className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-red-900 shadow-[0_10px_26px_rgba(15,10,5,0.12)] backdrop-blur transition hover:scale-105 hover:bg-red-900 hover:text-white"
                    >
                      <Heart className="h-4 w-4 fill-current" />
                    </button>

                    {product.badge ? (
                      <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-red-900 shadow-sm backdrop-blur">
                        {product.badge}
                      </div>
                    ) : null}
                  </div>

                  <div className="p-3 sm:p-5">
                    <Link href={`/products/${product.slug}`} className="block">
                      <p className="line-clamp-1 text-[9px] font-black uppercase tracking-[0.18em] text-red-900/70 sm:text-[10px]">
                        {product.categoryName}
                      </p>

                      <h2 className="mt-2 line-clamp-2 min-h-[40px] text-[13px] font-black leading-snug tracking-[-0.02em] text-neutral-950 sm:text-base">
                        {product.title}
                      </h2>

                      <p className="mt-3 text-[17px] font-black tracking-[-0.04em] text-red-950 sm:text-lg">
                        {money(product.price)}
                      </p>
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-red-900 px-4 text-[11px] font-black uppercase tracking-[0.14em] text-white shadow-[0_14px_34px_rgba(127,29,29,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-red-800"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      {addingId === product.id ? "Added" : "Add to Cart"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="mx-auto max-w-3xl rounded-[34px] border border-dashed border-neutral-300 bg-white p-8 text-center shadow-[0_18px_70px_rgba(15,10,5,0.07)] sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-900">
              <Heart className="h-7 w-7" />
            </div>

            <h2 className="mt-5 text-3xl font-black tracking-[-0.05em] text-neutral-950">
              Your wishlist is empty
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-neutral-600 sm:text-base">
              Start browsing our premium collections and save your favourite
              handcrafted pottery pieces.
            </p>

            <Link
              href="/shop"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-red-900 px-7 py-3.5 text-xs font-black uppercase tracking-[0.18em] text-white shadow-[0_16px_42px_rgba(127,29,29,0.24)] transition duration-300 hover:-translate-y-0.5 hover:bg-red-800"
            >
              Explore Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}