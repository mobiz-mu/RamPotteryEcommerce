"use client";

import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";

type ShopProductActionsProps = {
  product: {
    id: string;
    slug: string;
    title: string;
    price: number;
    image: string;
  };
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

export default function ShopProductActions({ product }: ShopProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function decreaseQuantity() {
    setQuantity((current) => Math.max(current - 1, 1));
  }

  function increaseQuantity() {
    setQuantity((current) => Math.min(current + 1, 99));
  }

  function addToCart() {
    try {
      const existingRaw = window.localStorage.getItem(CART_KEY);
      const existing: CartItem[] = existingRaw ? JSON.parse(existingRaw) : [];

      const itemIndex = existing.findIndex((item) => item.id === product.id);

      if (itemIndex >= 0) {
        existing[itemIndex] = {
          ...existing[itemIndex],
          quantity: existing[itemIndex].quantity + quantity,
        };
      } else {
        existing.push({
          ...product,
          quantity,
        });
      }

      window.localStorage.setItem(CART_KEY, JSON.stringify(existing));
      window.dispatchEvent(new CustomEvent("ram-pottery-cart-updated"));

      setAdded(true);

      window.setTimeout(() => {
        setAdded(false);
      }, 1200);
    } catch {
      setAdded(false);
    }
  }

  return (
    <div className="mt-3 flex items-center gap-2">
      <div className="grid h-10 flex-1 grid-cols-[32px_1fr_32px] overflow-hidden rounded-full border border-neutral-200 bg-white shadow-sm">
        <button
          type="button"
          onClick={decreaseQuantity}
          className="inline-flex items-center justify-center text-red-900 transition hover:bg-red-50"
          aria-label="Decrease quantity"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>

        <span className="inline-flex items-center justify-center border-x border-neutral-100 text-sm font-black text-neutral-950">
          {quantity}
        </span>

        <button
          type="button"
          onClick={increaseQuantity}
          className="inline-flex items-center justify-center text-red-900 transition hover:bg-red-50"
          aria-label="Increase quantity"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      <button
        type="button"
        onClick={addToCart}
        className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-[0_12px_26px_rgba(127,29,29,0.22)] transition duration-300 hover:-translate-y-0.5 ${
          added ? "bg-green-600" : "bg-red-900 hover:bg-red-800"
        }`}
        aria-label={`Add ${product.title} to cart`}
        title={added ? "Added" : "Add to cart"}
      >
        <ShoppingCart className="h-4 w-4" />
      </button>
    </div>
  );
}