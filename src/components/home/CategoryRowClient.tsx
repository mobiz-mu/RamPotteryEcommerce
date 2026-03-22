"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag, Star, X } from "lucide-react";
import { useMemo, useState } from "react";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type ProductImage = {
  image_url: string | null;
  is_primary: boolean;
  sort_order: number | null;
};

type Product = {
  id: string;
  title: string;
  slug: string;
  price: number | null;
  compare_at_price: number | null;
  stock_qty: number | null;
  is_in_stock: boolean;
  product_images: ProductImage[] | null;
};

type Row = {
  category: Category;
  products: Product[];
};

type Props = {
  rows?: Row[];
};

type CartDrawerItem = {
  id: string;
  title: string;
  slug: string;
  price: number;
  quantity: number;
  image: string;
};

function formatCurrency(price: number | null | undefined) {
  const value = Number(price ?? 0);
  return `Rs ${value.toLocaleString("en-MU")}`;
}

function getPrimaryImage(product: Product) {
  const sortedImages = [...(product.product_images ?? [])].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0);
  });

  return (
    sortedImages.find((img) => img.is_primary)?.image_url ||
    sortedImages[0]?.image_url ||
    "/images/placeholder-product.jpg"
  );
}

function ProductCard({
  product,
  priority = false,
  onAddToCart,
}: {
  product: Product;
  priority?: boolean;
  onAddToCart: (item: CartDrawerItem) => void;
}) {
  const [quantity, setQuantity] = useState(1);

  const imageUrl = getPrimaryImage(product);
  const isOutOfStock =
    !product.is_in_stock || Number(product.stock_qty ?? 0) <= 0;

  const rating = Number(product.price ?? 0) > 1500 ? 5 : 4.5;

  function handleAddToCart() {
    const item = {
      id: product.id,
      title: product.title,
      slug: product.slug,
      price: Number(product.price ?? 0),
      quantity,
      image: imageUrl,
    };

    const key = "ram-pottery-cart";
    const existing =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem(key) || "[]")
        : [];

    const found = existing.find((cartItem: any) => cartItem.id === product.id);

    let next;
    if (found) {
      next = existing.map((cartItem: any) =>
        cartItem.id === product.id
          ? { ...cartItem, quantity: cartItem.quantity + quantity }
          : cartItem
      );
    } else {
      next = [...existing, item];
    }

    localStorage.setItem(key, JSON.stringify(next));
    onAddToCart(item);
  }

  return (
    <div className="group block">
      <Link href={`/products/${product.slug}`}>
        <div className="overflow-hidden rounded-[1.75rem] border border-[#eee5e1] bg-white shadow-[0_10px_32px_rgba(0,0,0,0.045)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(0,0,0,0.08)]">
          <div className="relative aspect-[1/1] overflow-hidden bg-[#fbf8f7]">
            {isOutOfStock ? (
              <div className="absolute left-4 top-4 z-10 rounded-full bg-white px-3 py-1.5 text-[12px] font-medium text-neutral-950 shadow-sm">
                Out of stock
              </div>
            ) : null}

            <Image
              src={imageUrl}
              alt={product.title}
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
          </div>
        </div>
      </Link>

      <div className="px-1 pb-1 pt-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 text-[17px] font-medium leading-6 tracking-[-0.02em] text-neutral-950 transition-colors duration-300 group-hover:text-[#9f1d1d]">
            {product.title}
          </h3>
        </Link>

        <div className="mt-2 flex items-center gap-1.5 text-[#b91c1c]">
          {[1, 2, 3, 4].map((star) => (
            <Star key={star} className="h-4 w-4 fill-current" />
          ))}
          <div className="relative">
            <Star className="h-4 w-4 text-[#b91c1c]" />
            {rating === 4.5 ? (
              <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: "50%" }}>
                <Star className="h-4 w-4 fill-current text-[#b91c1c]" />
              </div>
            ) : (
              <Star className="absolute inset-0 h-4 w-4 fill-current text-[#b91c1c]" />
            )}
          </div>
          <span className="ml-1 text-[13px] font-medium text-neutral-600">
            {rating.toFixed(1)}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <p className="text-[17px] font-semibold text-neutral-900">
            {formatCurrency(product.price)}
          </p>

          {product.compare_at_price ? (
            <div className="relative">
              <p className="text-sm text-[#b91c1c]/80">
                {formatCurrency(product.compare_at_price)}
              </p>
              <span className="pointer-events-none absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 rotate-[-8deg] bg-[#b91c1c]" />
            </div>
          ) : null}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="inline-flex items-center overflow-hidden rounded-full border border-[#ead8d2] bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="h-9 w-9 text-sm text-neutral-700 transition hover:bg-[#faf4f2]"
            >
              −
            </button>
            <div className="flex h-9 min-w-[34px] items-center justify-center text-sm font-medium text-neutral-900">
              {quantity}
            </div>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="h-9 w-9 text-sm text-neutral-700 transition hover:bg-[#faf4f2]"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#9f1d1d] text-white shadow-[0_10px_25px_rgba(159,29,29,0.18)] transition hover:scale-[1.05] hover:bg-[#861515] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`Add ${product.title} to cart`}
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CategoryRowClient({ rows = [] }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<CartDrawerItem | null>(null);

  const cartItems = useMemo(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("ram-pottery-cart") || "[]");
    } catch {
      return [];
    }
  }, [drawerOpen]);

  const cartTotal = cartItems.reduce(
    (sum: number, item: any) => sum + Number(item.price ?? 0) * Number(item.quantity ?? 0),
    0
  );

  function handleAddToCart(item: CartDrawerItem) {
    setLastAdded(item);
    setDrawerOpen(true);
  }

  return (
    <>
      <section className="section-space bg-white">
        <div className="container-padded space-y-14 sm:space-y-16">
          {rows.map(({ category, products }, rowIndex) => (
            <div key={category.id} className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <Link
                  href={`/categories/${category.slug}`}
                  className="group inline-flex items-center gap-3"
                >
                  <h2
                    className="text-[1.75rem] font-normal text-[#7f1d1d] sm:text-[2rem] lg:text-[2.35rem]"
                    style={{ fontFamily: '"Times New Roman", Times, serif' }}
                  >
                    {category.name}
                  </h2>
                  <ArrowRight className="h-6 w-6 text-[#7f1d1d] transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <Link
                  href={`/categories/${category.slug}`}
                  className="hidden text-sm font-medium text-neutral-600 transition hover:text-[#9f1d1d] md:inline-block"
                >
                  View All
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {products.map((product, productIndex) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    priority={rowIndex === 0 && productIndex < 4}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div
        className={`fixed inset-y-0 right-0 z-[120] w-full max-w-md transform bg-white shadow-[-10px_0_40px_rgba(0,0,0,0.12)] transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
            <h3 className="text-xl font-semibold text-neutral-950">Cart</h3>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 transition hover:bg-neutral-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            {lastAdded ? (
              <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                Added <span className="font-medium">{lastAdded.title}</span> to cart.
              </div>
            ) : null}

            {cartItems.length === 0 ? (
              <p className="text-sm text-neutral-500">Your cart is empty.</p>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item: any) => (
                  <div key={item.id} className="flex gap-4 rounded-2xl border border-neutral-200 p-4">
                    <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-neutral-100">
                      <Image
                        src={item.image || "/images/placeholder-product.jpg"}
                        alt={item.title}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-neutral-950">{item.title}</div>
                      <div className="mt-1 text-sm text-neutral-500">
                        Qty: {item.quantity}
                      </div>
                      <div className="mt-2 text-sm font-semibold text-neutral-900">
                        {formatCurrency(item.price)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-neutral-200 px-6 py-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-neutral-600">Subtotal</span>
              <span className="text-lg font-semibold text-neutral-950">
                {formatCurrency(cartTotal)}
              </span>
            </div>

            <Link
              href="/cart"
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#9f1d1d] px-5 text-sm font-semibold text-white transition hover:bg-[#861515]"
            >
              View Cart
            </Link>
          </div>
        </div>
      </div>

      {drawerOpen ? (
        <button
          type="button"
          onClick={() => setDrawerOpen(false)}
          className="fixed inset-0 z-[110] bg-black/30"
          aria-label="Close cart drawer"
        />
      ) : null}
    </>
  );
}