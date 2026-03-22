"use client";

import Link from "next/link";
import { products } from "@/data/mock";
import ProductCard from "@/components/common/ProductCard";
import { useWishlist } from "@/hooks/useWishlist";

export default function WishlistPage() {
  const { items } = useWishlist();
  const wishlistProducts = products.filter((product) => items.includes(product.id));

  return (
    <section className="container-padded section-space">
      <div className="mb-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-red-600">
          Wishlist
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-950">
          Your Wishlist
        </h1>
        <p className="mt-4 max-w-2xl text-neutral-600">
          Save your favourite handcrafted pieces and come back to them anytime.
        </p>
      </div>

      {wishlistProducts.length ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {wishlistProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-10 text-center">
          <h2 className="text-2xl font-semibold text-neutral-950">
            Your wishlist is empty
          </h2>
          <p className="mt-3 text-neutral-600">
            Start browsing our premium collections and save your favourites.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex rounded-full bg-neutral-950 px-6 py-3 text-sm font-medium text-white"
          >
            Explore Products
          </Link>
        </div>
      )}
    </section>
  );
}