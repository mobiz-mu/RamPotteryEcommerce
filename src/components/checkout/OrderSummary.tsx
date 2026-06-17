"use client";

import Image from "next/image";
import Link from "next/link";
import { PackageCheck, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";

const FREE_DELIVERY_MINIMUM = 3000;
const STANDARD_DELIVERY_FEE = 150;

function formatCurrency(value: number) {
  return `Rs ${value.toLocaleString("en-MU")}`;
}

export default function OrderSummary() {
  const { items, subtotal, loaded } = useCart();

  const deliveryFee =
    items.length > 0 && subtotal > 0 && subtotal < FREE_DELIVERY_MINIMUM
      ? STANDARD_DELIVERY_FEE
      : 0;

  const total = subtotal + deliveryFee;
  const amountLeftForFreeDelivery = Math.max(
    FREE_DELIVERY_MINIMUM - subtotal,
    0,
  );

  if (!loaded) {
    return (
      <div className="rounded-[28px] border border-neutral-200 bg-white p-6">
        <p className="text-sm font-semibold text-neutral-500">
          Loading order summary...
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-900">
            Summary
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-neutral-950">
            Your Order
          </h2>
        </div>

        <ShoppingBag className="h-6 w-6 text-red-900" />
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-neutral-300 bg-[#faf8f4] p-6 text-center">
            <PackageCheck className="mx-auto h-7 w-7 text-red-900" />
            <p className="mt-3 text-sm font-black text-neutral-950">
              No items in cart
            </p>
            <p className="mt-1 text-sm leading-6 text-neutral-600">
              Add products before checkout.
            </p>

            <Link
              href="/shop"
              className="mt-4 inline-flex rounded-full bg-red-900 px-5 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-white"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[58px_1fr_auto] items-center gap-3 rounded-[22px] border border-neutral-200 bg-white p-3"
            >
              <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-[#faf6ef]">
                <Image
                  src={item.image || "/images/placeholder-product.jpg"}
                  alt={item.title}
                  fill
                  sizes="56px"
                  className="object-cover"
                />

                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-900 px-1 text-[10px] font-black text-white ring-2 ring-white">
                  {item.quantity}
                </span>
              </div>

              <div className="min-w-0">
                <p className="line-clamp-2 text-sm font-black leading-5 text-neutral-950">
                  {item.title}
                </p>
                <p className="mt-1 text-xs font-semibold text-neutral-500">
                  {formatCurrency(item.price)} each
                </p>
              </div>

              <p className="text-sm font-black text-red-950">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
          ))
        )}
      </div>

      {items.length > 0 ? (
        <div className="mt-5 rounded-[22px] border border-red-900/10 bg-red-50 px-4 py-3">
          {subtotal >= FREE_DELIVERY_MINIMUM ? (
            <p className="text-sm font-bold leading-6 text-red-900">
              You qualify for free delivery.
            </p>
          ) : (
            <p className="text-sm font-bold leading-6 text-red-900">
              Add {formatCurrency(amountLeftForFreeDelivery)} more to get free
              delivery.
            </p>
          )}

          <p className="mt-1 text-xs font-semibold leading-5 text-red-900/70">
            Delivery is Rs 150 below Rs 3,000 and free from Rs 3,000.
          </p>
        </div>
      ) : null}

      <div className="mt-5 space-y-3 rounded-[26px] border border-neutral-200 bg-[#faf8f4] p-4">
        <div className="flex items-center justify-between text-sm font-bold text-neutral-600">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex items-center justify-between text-sm font-bold text-neutral-600">
          <span>Delivery</span>
          <span>
            {!items.length
              ? "Rs 0"
              : deliveryFee === 0
                ? "Free"
                : formatCurrency(deliveryFee)}
          </span>
        </div>

        <div className="border-t border-neutral-200 pt-3">
          <div className="flex items-center justify-between">
            <span className="text-base font-black text-neutral-950">Total</span>
            <span className="text-2xl font-black tracking-[-0.04em] text-red-950">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}