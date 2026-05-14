"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useCart } from "@/hooks/useCart";

export default function CartPageActions() {
  const { items, loaded } = useCart();

  if (!loaded) {
    return null;
  }

  const hasItems = items.length > 0;

  return (
    <div className="mt-6 flex flex-col gap-3 border-t border-neutral-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
      <Link
        href="/shop"
        className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-6 py-3 text-xs font-black uppercase tracking-[0.16em] text-red-900 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-red-900/20 hover:bg-red-50"
      >
        Add More Items
        <ArrowRight className="h-4 w-4" />
      </Link>

      {hasItems ? (
        <Link
          href="/checkout"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-red-900 px-7 py-3 text-xs font-black uppercase tracking-[0.16em] text-white shadow-[0_16px_42px_rgba(127,29,29,0.24)] transition duration-300 hover:-translate-y-0.5 hover:bg-red-800"
        >
          Proceed to Checkout
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}