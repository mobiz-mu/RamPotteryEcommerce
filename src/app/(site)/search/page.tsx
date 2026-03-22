"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/common/ProductCard";
import type { Product } from "@/types";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    const run = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResults(data.results || []);
    };

    const t = setTimeout(run, 250);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <section className="container-padded section-space">
      <div className="mb-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-red-600">
          Search
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-950">
          Search Products
        </h1>
        <p className="mt-4 max-w-2xl text-neutral-600">
          Search Ram Pottery collections by product name.
        </p>
      </div>

      <div className="max-w-xl">
        <Input
          placeholder="Search pottery products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="mt-10">
        {query && !results.length ? (
          <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-10 text-center text-neutral-600">
            No products found for “{query}”
          </div>
        ) : null}

        {!!results.length ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}