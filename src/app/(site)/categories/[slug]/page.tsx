import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    maxPrice?: string;
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

const priceOptions = [500, 1000, 1500, 2000, 3000, 5000];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("name, seo_title, seo_description")
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
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { maxPrice } = await searchParams;

  const supabase = await createClient();

  const [{ data: currentCategory }, { data: categories }] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name, slug, description, seo_title, seo_description, is_active, sort_order")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle<Category>(),
    supabase
      .from("categories")
      .select("id, name, slug, description, seo_title, seo_description, is_active, sort_order")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true }),
  ]);

  if (!currentCategory) notFound();

  let productsQuery = supabase
    .from("products")
    .select(`
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
        is_primary,
        sort_order
      )
    `)
    .eq("is_active", true)
    .eq("category_id", currentCategory.id)
    .order("created_at", { ascending: false });

  const parsedMaxPrice = maxPrice ? Number(maxPrice) : null;

  if (parsedMaxPrice && Number.isFinite(parsedMaxPrice)) {
    productsQuery = productsQuery.lte("price", parsedMaxPrice);
  }

  const { data: products } = await productsQuery;

  const safeCategories = categories ?? [];
  const safeProducts = (products ?? []) as Product[];

  return (
    <section className="bg-[#f6f5f2] py-10 sm:py-12 lg:py-14">
      <div className="container-padded">
        <div className="mb-8">
          <div className="text-sm text-neutral-500">
            <Link href="/" className="transition hover:text-red-600">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-neutral-800">{currentCategory.name}</span>
          </div>

          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-neutral-950 sm:text-4xl lg:text-[3.2rem]">
            {currentCategory.name}
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-neutral-600 sm:text-base">
            {currentCategory.description ||
              `Explore our handcrafted ${currentCategory.name.toLowerCase()} collection, thoughtfully made for elegant homes and timeless everyday living.`}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <div className="rounded-[1.8rem] border border-neutral-200 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <h2 className="text-lg font-semibold text-neutral-950">Categories</h2>

              <div className="mt-5 space-y-2">
                {safeCategories.map((category) => {
                  const isActive = category.slug === currentCategory.slug;

                  return (
                    <Link
                      key={category.id}
                      href={`/categories/${category.slug}`}
                      className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? "bg-red-600 text-white"
                          : "text-neutral-700 hover:bg-red-50 hover:text-red-600"
                      }`}
                    >
                      {category.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[1.8rem] border border-neutral-200 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <h2 className="text-lg font-semibold text-neutral-950">Filter by Price</h2>

              <div className="mt-5 space-y-2">
                <Link
                  href={`/categories/${currentCategory.slug}`}
                  className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                    !parsedMaxPrice
                      ? "bg-red-600 text-white"
                      : "text-neutral-700 hover:bg-red-50 hover:text-red-600"
                  }`}
                >
                  All Prices
                </Link>

                {priceOptions.map((price) => {
                  const active = parsedMaxPrice === price;

                  return (
                    <Link
                      key={price}
                      href={`/categories/${currentCategory.slug}?maxPrice=${price}`}
                      className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                        active
                          ? "bg-red-600 text-white"
                          : "text-neutral-700 hover:bg-red-50 hover:text-red-600"
                      }`}
                    >
                      Under {formatCurrency(price)}
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>

          <div>
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-neutral-600">
                {safeProducts.length} product{safeProducts.length === 1 ? "" : "s"} found
              </div>

              <div className="text-sm text-neutral-500">
                {parsedMaxPrice ? `Filtered under ${formatCurrency(parsedMaxPrice)}` : "Showing all products"}
              </div>
            </div>

            {safeProducts.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-neutral-300 bg-white p-10 text-center shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
                <h2 className="text-xl font-semibold text-neutral-950">No products found</h2>
                <p className="mt-3 text-sm leading-7 text-neutral-500">
                  Try another category or remove the price filter to see more products.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {safeProducts.map((product) => {
                  const imageUrl = getPrimaryImage(product);
                  const isOutOfStock =
                    !product.is_in_stock || Number(product.stock_qty ?? 0) <= 0;

                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className="group block overflow-hidden rounded-[1.8rem] border border-neutral-200 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)]"
                    >
                      <div className="relative aspect-[1/1] overflow-hidden bg-white">
                        {isOutOfStock ? (
                          <div className="absolute left-5 top-5 z-10 bg-white px-4 py-2 text-[13px] font-medium text-neutral-950 shadow-sm">
                            Out of stock
                          </div>
                        ) : null}

                        <Image
                          src={imageUrl}
                          alt={product.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                        />
                      </div>

                      <div className="p-5">
                        <h3 className="text-lg font-medium tracking-[-0.02em] text-neutral-950 transition-colors duration-300 group-hover:text-red-600">
                          {product.title}
                        </h3>

                        {product.short_description ? (
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-500">
                            {product.short_description}
                          </p>
                        ) : null}

                        <div className="mt-4 flex items-center gap-3">
                          <p className="text-base font-medium text-neutral-900">
                            {formatCurrency(product.price)}
                          </p>

                          {product.compare_at_price ? (
                            <p className="text-sm text-neutral-400 line-through">
                              {formatCurrency(product.compare_at_price)}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}