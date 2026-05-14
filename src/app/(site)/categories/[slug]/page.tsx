import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Filter, ShoppingBag, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";
import CategorySidebarFilters from "@/components/categories/CategorySidebarFilters";
import { createClient } from "@/lib/supabase/server";

const siteUrl = "https://rampottery.mu";
const MIN_PRICE = 1;
const MAX_PRICE = 10000;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    maxPrice?: string;
    minPrice?: string;
  }>;
};

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  seo_title: string | null;
  seo_description: string | null;
  is_active: boolean;
  sort_order: number | null;
};

type ProductImage = {
  image_url: string | null;
  alt_text?: string | null;
  is_primary: boolean;
  sort_order: number | null;
};

type Product = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  price: number | null;
  compare_at_price: number | null;
  stock_qty: number | null;
  is_in_stock: boolean;
  is_active: boolean;
  category_id: string | null;
  product_images: ProductImage[] | null;
};

function formatCurrency(price: number | null | undefined) {
  const value = Number(price ?? 0);
  return `Rs ${value.toLocaleString("en-MU")}`;
}

function getPrimaryImage(product: Product) {
  const images = [...(product.product_images ?? [])].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0);
  });

  return (
    images.find((img) => img.is_primary)?.image_url ||
    images[0]?.image_url ||
    "/images/placeholder-product.jpg"
  );
}

function getPrimaryAlt(product: Product) {
  const images = [...(product.product_images ?? [])].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0);
  });

  return (
    images.find((img) => img.is_primary)?.alt_text ||
    images[0]?.alt_text ||
    `${product.title} - Ram Pottery Mauritius`
  );
}

function cleanMaxPrice(value: string | undefined) {
  const parsed = Number(value || MAX_PRICE);

  if (!Number.isFinite(parsed)) return MAX_PRICE;

  return Math.min(Math.max(parsed, MIN_PRICE), MAX_PRICE);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("name, slug, seo_title, seo_description")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!category) {
    return {
      title: "Category Not Found | Ram Pottery",
    };
  }

  return {
    title: category.seo_title || `${category.name} | Ram Pottery Mauritius`,
    description:
      category.seo_description ||
      `Explore ${category.name} at Ram Pottery Mauritius. Discover handcrafted pottery with premium design and timeless elegance.`,
    alternates: {
      canonical: `${siteUrl}/categories/${category.slug}`,
    },
    openGraph: {
      title: category.seo_title || `${category.name} | Ram Pottery Mauritius`,
      description:
        category.seo_description ||
        `Explore ${category.name} at Ram Pottery Mauritius.`,
      url: `${siteUrl}/categories/${category.slug}`,
      siteName: "Ram Pottery",
      type: "website",
      locale: "en_MU",
    },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const query = await searchParams;

  const maxPrice = cleanMaxPrice(query.maxPrice);

  const supabase = await createClient();

  const [{ data: currentCategory }, { data: categories }] = await Promise.all([
    supabase
      .from("categories")
      .select(
        "id, name, slug, description, seo_title, seo_description, is_active, sort_order",
      )
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle<Category>(),
    supabase
      .from("categories")
      .select(
        "id, name, slug, description, seo_title, seo_description, is_active, sort_order",
      )
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true }),
  ]);

  if (!currentCategory) notFound();

  const productsQuery = supabase
    .from("products")
    .select(
      `
      id,
      title,
      slug,
      short_description,
      price,
      compare_at_price,
      stock_qty,
      is_in_stock,
      is_active,
      category_id,
      product_images (
        image_url,
        alt_text,
        is_primary,
        sort_order
      )
    `,
    )
    .eq("is_active", true)
    .eq("category_id", currentCategory.id)
    .gte("price", MIN_PRICE)
    .lte("price", maxPrice)
    .order("created_at", { ascending: false });

  const { data: products } = await productsQuery;

  const safeCategories = categories ?? [];
  const safeProducts = (products ?? []) as Product[];

  const categoryJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${currentCategory.name} | Ram Pottery Mauritius`,
    url: `${siteUrl}/categories/${currentCategory.slug}`,
    description:
      currentCategory.description ||
      `Explore ${currentCategory.name} at Ram Pottery Mauritius.`,
    numberOfItems: safeProducts.length,
    publisher: {
      "@type": "Organization",
      name: "Ram Pottery",
      url: siteUrl,
    },
  };

  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(categoryJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="mx-auto max-w-[1920px] px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-10">
        <div className="mb-6 overflow-hidden rounded-[34px] border border-neutral-200 bg-white px-5 py-7 shadow-[0_18px_70px_rgba(15,10,5,0.07)] sm:px-8 lg:px-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-neutral-400">
                <Link href="/" className="transition hover:text-red-900">
                  Home
                </Link>
                <span>/</span>
                <Link href="/shop" className="transition hover:text-red-900">
                  Shop
                </Link>
                <span>/</span>
                <span className="text-red-900">{currentCategory.name}</span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-red-900/10 bg-red-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-red-900">
                <Sparkles className="h-3.5 w-3.5" />
                Premium Collection
              </div>

              <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[0.98] tracking-[-0.06em] text-neutral-950 sm:text-5xl lg:text-6xl">
                {currentCategory.name}
              </h1>

              <p className="mt-5 max-w-3xl text-sm leading-7 text-neutral-600 sm:text-base lg:text-lg lg:leading-8">
                {currentCategory.description ||
                  `Explore our handcrafted ${currentCategory.name.toLowerCase()} collection, thoughtfully made for elegant homes, meaningful gifting and timeless everyday living.`}
              </p>
            </div>

            <div className="grid grid-cols-3 overflow-hidden rounded-[24px] border border-neutral-200 bg-[#faf8f4] shadow-sm">
              <MiniStat value={safeProducts.length.toString()} label="Products" />
              <MiniStat value={`Rs ${MIN_PRICE}`} label="From" />
              <MiniStat value="10k" label="Range" />
            </div>
          </div>
        </div>

        <div className="mb-5 lg:hidden">
          <details className="group overflow-hidden rounded-[30px] border border-neutral-200 bg-white shadow-[0_18px_60px_rgba(15,10,5,0.07)]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-red-900">
                  Filters
                </p>
                <p className="mt-1 text-sm font-bold text-neutral-500">
                  Category and price range
                </p>
              </div>

              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-900 text-white transition group-open:rotate-180">
                <Filter className="h-5 w-5" />
              </span>
            </summary>

            <div className="border-t border-neutral-100 p-4">
              <CategorySidebarFilters
                categories={safeCategories}
                currentSlug={currentCategory.slug}
                currentName={currentCategory.name}
                maxPrice={maxPrice}
              />
            </div>
          </details>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="hidden lg:block lg:sticky lg:top-[118px] lg:self-start">
            <CategorySidebarFilters
              categories={safeCategories}
              currentSlug={currentCategory.slug}
              currentName={currentCategory.name}
              maxPrice={maxPrice}
            />
          </aside>

          <section className="min-w-0">
            <div className="mb-5 flex flex-col gap-3 rounded-[26px] border border-neutral-200 bg-white px-5 py-4 shadow-[0_14px_45px_rgba(15,10,5,0.055)] sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-bold text-neutral-500">
                Showing{" "}
                <span className="font-black text-neutral-950">
                  {safeProducts.length}
                </span>{" "}
                product{safeProducts.length === 1 ? "" : "s"}
              </p>

              <p className="text-sm font-bold text-neutral-500">
                Price:{" "}
                <span className="font-black text-red-900">
                  Rs {MIN_PRICE.toLocaleString("en-MU")} -{" "}
                  {formatCurrency(maxPrice)}
                </span>
              </p>
            </div>

            {safeProducts.length === 0 ? (
              <div className="rounded-[34px] border border-dashed border-neutral-300 bg-white p-10 text-center shadow-[0_18px_70px_rgba(15,10,5,0.07)]">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-900">
                  <ShoppingBag className="h-6 w-6" />
                </div>

                <h2 className="mt-5 text-3xl font-black tracking-[-0.05em] text-neutral-950">
                  No products found
                </h2>

                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-neutral-600">
                  Try another category or increase the price range to see more
                  handcrafted pieces.
                </p>

                <Link
                  href={`/categories/${currentCategory.slug}`}
                  className="mt-7 inline-flex rounded-full bg-red-900 px-7 py-3.5 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-red-800"
                >
                  Reset Filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 2xl:grid-cols-4">
                {safeProducts.map((product, index) => (
                  <ProductTile
                    key={product.id}
                    product={product}
                    priority={index < 8}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

function ProductTile({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const imageUrl = getPrimaryImage(product);
  const imageAlt = getPrimaryAlt(product);
  const isOutOfStock =
    !product.is_in_stock || Number(product.stock_qty ?? 0) <= 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group overflow-hidden rounded-[22px] border border-neutral-200 bg-white shadow-[0_12px_38px_rgba(15,10,5,0.055)] transition duration-500 hover:-translate-y-1 hover:border-red-900/20 hover:shadow-[0_24px_80px_rgba(80,0,0,0.12)] sm:rounded-[30px]"
    >
      <div className="relative aspect-square overflow-hidden bg-[#faf6ef]">
        {isOutOfStock ? (
          <div className="absolute left-3 top-3 z-10 rounded-full bg-white/95 px-3 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-neutral-950 shadow-sm backdrop-blur">
            Out of stock
          </div>
        ) : null}

        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          className="object-cover transition duration-700 ease-out group-hover:scale-110"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/16 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
      </div>

      <div className="p-3 sm:p-5">
        <h3 className="line-clamp-2 min-h-[40px] text-[13px] font-black leading-snug tracking-[-0.02em] text-neutral-950 transition group-hover:text-red-950 sm:text-base">
          {product.title}
        </h3>

        {product.short_description ? (
          <p className="mt-2 line-clamp-2 hidden text-sm leading-6 text-neutral-500 sm:block">
            {product.short_description}
          </p>
        ) : null}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <p className="text-[17px] font-black tracking-[-0.04em] text-red-950 sm:text-lg">
            {formatCurrency(product.price)}
          </p>

          {product.compare_at_price ? (
            <p className="text-sm font-semibold text-neutral-400 line-through">
              {formatCurrency(product.compare_at_price)}
            </p>
          ) : null}
        </div>

        <div className="mt-4 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-red-900">
          View Product
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-r border-neutral-200 px-4 py-4 text-center last:border-r-0">
      <p className="text-lg font-black text-red-900">{value}</p>
      <p className="mt-1 text-[9px] font-black uppercase tracking-[0.16em] text-neutral-400">
        {label}
      </p>
    </div>
  );
}