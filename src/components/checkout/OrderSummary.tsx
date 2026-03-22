"use client";

import { useCart } from "@/hooks/useCart";
import { formatMUR } from "@/lib/utils/currency";

export default function OrderSummary() {
  const { items, subtotal } = useCart();
  const deliveryFee = items.length ? 200 : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6">
      <h2 className="text-2xl font-semibold text-neutral-950">Your Order</h2>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div key={item.productId} className="flex items-start justify-between gap-4">
            <div>
              <div className="font-medium text-neutral-950">{item.title}</div>
              <div className="text-sm text-neutral-500">Qty: {item.quantity}</div>
            </div>
            <div className="font-medium text-neutral-950">
              {formatMUR(item.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3 border-t border-neutral-200 pt-5 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-neutral-600">Subtotal</span>
          <span className="font-medium text-neutral-950">{formatMUR(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-neutral-600">Delivery</span>
          <span className="font-medium text-neutral-950">
            {formatMUR(deliveryFee)}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-neutral-200 pt-4">
          <span className="text-base font-semibold text-neutral-950">Total</span>
          <span className="text-lg font-semibold text-neutral-950">
            {formatMUR(total)}
          </span>
        </div>
      </div>
    </div>
  );
}