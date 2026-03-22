"use client";

import { useMemo, useState } from "react";

type Category = {
  name: string;
  slug: string;
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
};

type Props = {
  product: Product;
};

function formatCurrency(price: number | null | undefined) {
  const value = Number(price ?? 0);
  return `Rs ${value.toLocaleString("en-MU")}`;
}

export default function ProductInfo({ product }: Props) {
  const [qty, setQty] = useState(1);

  const isOutOfStock = !product.is_in_stock || Number(product.stock_qty ?? 0) <= 0;

  const whatsappUrl = useMemo(() => {
    const message = encodeURIComponent(
      `Hello Ram Pottery, I want to order:\n\nProduct: ${product.title}\nQuantity: ${qty}\nPrice: ${formatCurrency(product.price)}\nProduct Link: ${typeof window !== "undefined" ? window.location.href : ""}`
    );

    return `https://wa.me/23057788884?text=${message}`;
  }, [product.title, product.price, qty]);

  function addToCart() {
    const key = "ram-pottery-cart";
    const existing = typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem(key) || "[]")
      : [];

    const found = existing.find((item: any) => item.id === product.id);

    let next;
    if (found) {
      next = existing.map((item: any) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + qty }
          : item
      );
    } else {
      next = [
        ...existing,
        {
          id: product.id,
          title: product.title,
          slug: product.slug,
          price: Number(product.price ?? 0),
          quantity: qty,
        },
      ];
    }

    localStorage.setItem(key, JSON.stringify(next));
    alert("Product added to cart.");
  }

  return (
    <div className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-[0_15px_40px_rgba(0,0,0,0.04)] sm:p-8">
      {product.badge ? (
        <div className="mb-4 inline-flex rounded-full bg-red-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
          {product.badge}
        </div>
      ) : null}

      <h1 className="text-3xl font-semibold tracking-[-0.03em] text-neutral-950 sm:text-4xl">
        {product.title}
      </h1>

      {product.categories?.name ? (
        <p className="mt-3 text-sm text-neutral-500">
          Category: <span className="text-neutral-800">{product.categories.name}</span>
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <p className="text-2xl font-semibold text-neutral-950">
          {formatCurrency(product.price)}
        </p>

        {product.compare_at_price ? (
          <p className="text-lg text-neutral-400 line-through">
            {formatCurrency(product.compare_at_price)}
          </p>
        ) : null}
      </div>

      {product.short_description ? (
        <p className="mt-6 text-sm leading-7 text-neutral-600 sm:text-base">
          {product.short_description}
        </p>
      ) : null}

      <div className="mt-6">
        <span
          className={`inline-flex rounded-full px-4 py-2 text-sm font-medium ${
            isOutOfStock
              ? "bg-neutral-100 text-neutral-600"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {isOutOfStock ? "Out of stock" : "In stock"}
        </span>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <div className="inline-flex items-center overflow-hidden rounded-xl border border-neutral-200">
          <button
            type="button"
            onClick={() => setQty((prev) => Math.max(1, prev - 1))}
            className="h-12 w-12 text-lg text-neutral-700 transition hover:bg-neutral-50"
          >
            -
          </button>
          <div className="flex h-12 min-w-[56px] items-center justify-center text-sm font-medium text-neutral-950">
            {qty}
          </div>
          <button
            type="button"
            onClick={() => setQty((prev) => prev + 1)}
            className="h-12 w-12 text-lg text-neutral-700 transition hover:bg-neutral-50"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={addToCart}
          disabled={isOutOfStock}
          className="inline-flex h-12 items-center justify-center rounded-xl border border-neutral-200 bg-white px-6 text-sm font-semibold text-neutral-900 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add to Cart
        </button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className={`inline-flex h-12 items-center justify-center rounded-xl px-6 text-sm font-semibold text-white transition ${
            isOutOfStock
              ? "cursor-not-allowed bg-neutral-400 pointer-events-none"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          Order on WhatsApp
        </a>
      </div>

      {product.description ? (
        <div className="mt-10 border-t border-neutral-200 pt-8">
          <h2 className="text-lg font-semibold text-neutral-950">Product Details</h2>
          <div className="mt-4 whitespace-pre-line text-sm leading-7 text-neutral-600 sm:text-base">
            {product.description}
          </div>
        </div>
      ) : null}
    </div>
  );
}