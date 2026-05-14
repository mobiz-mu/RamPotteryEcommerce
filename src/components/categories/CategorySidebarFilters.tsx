"use client";

import Link from "next/link";
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type CategorySidebarFiltersProps = {
  categories: Category[];
  currentSlug: string;
  currentName: string;
  maxPrice: number;
};

const MIN_PRICE = 1;
const MAX_PRICE = 10000;

function formatCurrency(value: number) {
  return `Rs ${value.toLocaleString("en-MU")}`;
}

export default function CategorySidebarFilters({
  categories,
  currentSlug,
  currentName,
  maxPrice,
}: CategorySidebarFiltersProps) {
  const [rangeValue, setRangeValue] = useState(maxPrice);

  return (
    <div className="space-y-5">
      <div className="rounded-[30px] border border-neutral-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,10,5,0.07)]">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-red-900">
              Refine
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-neutral-950">
              Selection
            </h2>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-900">
            <SlidersHorizontal className="h-5 w-5" />
          </div>
        </div>

        <div>
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-neutral-400">
            Categories
          </p>

          <div className="max-h-[360px] space-y-2 overflow-y-auto pr-1">
            {categories.map((category) => {
              const isActive = category.slug === currentSlug;

              return (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className={`group flex items-center gap-3 rounded-2xl border px-3 py-3 transition duration-300 ${
                    isActive
                      ? "border-red-900 bg-red-900 text-white shadow-[0_14px_34px_rgba(127,29,29,0.22)]"
                      : "border-neutral-200 bg-white text-neutral-800 hover:border-red-900/20 hover:bg-red-50/60 hover:text-red-900"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                      isActive
                        ? "border-white bg-white"
                        : "border-neutral-300 bg-white group-hover:border-red-900"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isActive ? "bg-red-900" : "bg-transparent"
                      }`}
                    />
                  </span>

                  <span className="text-sm font-black">{category.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <form
        action={`/categories/${currentSlug}`}
        className="rounded-[30px] border border-neutral-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,10,5,0.07)]"
      >
        <div className="mb-5">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-red-900">
            Price Range
          </p>

          <h3 className="mt-2 text-2xl font-black tracking-[-0.04em] text-neutral-950">
            {currentName}
          </h3>

          <p className="mt-2 text-sm leading-6 text-neutral-500">
            Filter products from{" "}
            <span className="font-black text-neutral-950">
              {formatCurrency(MIN_PRICE)}
            </span>{" "}
            to{" "}
            <span className="font-black text-red-900">
              {formatCurrency(rangeValue)}
            </span>
            .
          </p>
        </div>

        <input type="hidden" name="minPrice" value={MIN_PRICE} />

        <div className="rounded-[24px] border border-neutral-200 bg-[#faf8f4] p-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-black text-neutral-500">
              Rs 1
            </span>

            <span className="rounded-full bg-red-900 px-4 py-1.5 text-xs font-black text-white shadow-[0_10px_26px_rgba(127,29,29,0.22)]">
              {formatCurrency(rangeValue)}
            </span>

            <span className="text-xs font-black text-neutral-500">
              Rs 10,000
            </span>
          </div>

          <input
            type="range"
            name="maxPrice"
            min={MIN_PRICE}
            max={MAX_PRICE}
            step="50"
            value={rangeValue}
            onChange={(event) => setRangeValue(Number(event.target.value))}
            className="h-2 w-full cursor-pointer accent-red-900"
            aria-label="Maximum price"
          />

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-200">
            <div
              className="h-full rounded-full bg-red-900 transition-all"
              style={{
                width: `${Math.min(
                  100,
                  Math.max(0, (rangeValue / MAX_PRICE) * 100),
                )}%`,
              }}
            />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="submit"
            className="rounded-2xl bg-red-900 px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-white shadow-[0_14px_34px_rgba(127,29,29,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-red-800"
          >
            Apply
          </button>

          <Link
            href={`/categories/${currentSlug}`}
            className="inline-flex items-center justify-center rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-red-900 transition duration-300 hover:-translate-y-0.5 hover:border-red-900/20 hover:bg-red-50"
          >
            Reset
          </Link>
        </div>
      </form>
    </div>
  );
}