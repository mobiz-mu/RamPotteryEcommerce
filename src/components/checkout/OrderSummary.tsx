"use client";

import { useCart } from "@/hooks/useCart";

function formatCurrency(value: number) {
  return `Rs ${value.toLocaleString("en-MU")}`;
}

export default function OrderSummary() {
  const { items, subtotal, loaded } = useCart();

  if (!loaded) {
    return (
      <div className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
        <p className="text-sm text-neutral-500">Loading order summary...</p>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
      <h2 className="text-2xl font-semibold text-neutral-950">Order Summary</h2>

      <div className="mt-6 space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-neutral-500">No items in cart.</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-4 border-b border-neutral-100 pb-4"
            >
              <div>
                <div className="font-medium text-neutral-950">{item.title}</div>
                <div className="text-sm text-neutral-500">Qty: {item.quantity}</div>
              </div>

              <div className="text-right font-medium text-neutral-900">
                {formatCurrency(item.price * item.quantity)}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-neutral-200 pt-5">
        <span className="text-base font-medium text-neutral-700">Subtotal</span>
        <span className="text-xl font-semibold text-neutral-950">
          {formatCurrency(subtotal)}
        </span>
      </div>
    </div>
  );
}