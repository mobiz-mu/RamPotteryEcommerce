"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";

function formatCurrency(value: number) {
  return `Rs ${value.toLocaleString("en-MU")}`;
}

export default function CartItems() {
  const { items, loaded, updateQuantity, removeItem } = useCart();

  if (!loaded) {
    return (
      <div className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
        <p className="text-sm text-neutral-500">Loading cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-[2rem] border border-neutral-200 bg-white p-8 text-center shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
        <h2 className="text-2xl font-semibold text-neutral-950">Your cart is empty</h2>
        <p className="mt-3 text-sm leading-7 text-neutral-500">
          Add your favorite handcrafted pottery pieces to continue.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-red-600 px-6 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-neutral-200 bg-white p-4 shadow-[0_12px_35px_rgba(0,0,0,0.04)] sm:p-6">
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-4 rounded-[1.5rem] border border-neutral-200 p-4 sm:flex-row"
          >
            <Link
              href={`/products/${item.slug}`}
              className="relative h-28 w-full overflow-hidden rounded-2xl bg-neutral-100 sm:h-28 sm:w-28"
            >
              <Image
                src={item.image || "/images/placeholder-product.jpg"}
                alt={item.title}
                fill
                sizes="112px"
                className="object-cover"
              />
            </Link>

            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <Link
                    href={`/products/${item.slug}`}
                    className="text-lg font-semibold text-neutral-950 transition hover:text-red-600"
                  >
                    {item.title}
                  </Link>
                  <p className="mt-2 text-sm text-neutral-500">
                    {formatCurrency(item.price)} each
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="inline-flex items-center gap-2 self-start rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                <div className="inline-flex items-center overflow-hidden rounded-full border border-neutral-200 bg-white">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="h-10 w-10 text-lg text-neutral-700 transition hover:bg-neutral-50"
                  >
                    −
                  </button>
                  <div className="flex h-10 min-w-[44px] items-center justify-center text-sm font-medium text-neutral-950">
                    {item.quantity}
                  </div>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="h-10 w-10 text-lg text-neutral-700 transition hover:bg-neutral-50"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-xs uppercase tracking-[0.15em] text-neutral-500">
                    Subtotal
                  </p>
                  <p className="mt-1 text-lg font-semibold text-neutral-950">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}