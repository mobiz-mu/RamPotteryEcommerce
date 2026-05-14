import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import ShopProductActions from "@/components/shop/ShopProductActions";
import { getShopCategories, getShopProducts } from "@/lib/server-data";

const PAGE_SIZE = 28;
const MIN_PRICE = 1;
const MAX_PRICE = 10000;

type ShopSearchParams = {
  page?: string;
  category?: string;
  min?: string;
  max?: string;
  q?: string;
};

function money(value: unknown) {
  const amount = Number(value || 0);

  return new Intl.NumberFormat("en-MU", {
    style: "currency",
    currency: "MUR",
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace("MUR", "Rs");
}

function getProductTitle(product: any) {
  return String(product.title || product.name || "Ram Pottery Product");
}

function getProductSlug(product: any) {
  return String(product.slug || product.id || "");
}

function getProductImage(product: any) {
  const images = Array.isArray(product.product_images)
    ? product.product_images
    : [];

  const primaryImage =
    images.find((img: any) => img.is_primary)?.image_url ||
    images
      .slice()
      .sort((a: any, b: any) => Number(a.sort_order) - Number(b.sort_order))?.[0]
      ?.image_url;

  return (
    primaryImage ||
    product.image_url ||
    product.image ||
    product.thumbnail ||
    "/brand/logo.png"
  );
}

function getProductImageAlt(product: any) {
  const images = Array.isArray(product.product_images)
    ? product.product_images
    : [];

  return (
    images.find((img: any) => img.is_primary)?.alt_text ||
    product.alt_text ||
    `${getProductTitle(product)} - Ram Pottery Mauritius`
  );
}

function getProductCategorySlug(product: any) {
  return (
    product.categories?.slug ||
    product.category?.slug ||
    product.category_slug ||
    product.category_id ||
    ""
  );
}

function getProductCategoryName(product: any) {
  return (
    product.categories?.name ||
    product.category?.name ||
    product.category_name ||
    "Ram Pottery"
  );
}

function makeShopHref({
  page,
  selectedCategory,
  search,
  min,
  max,
}: {
  page: number;
  selectedCategory: string;
  search: string;
  min: number;
  max: number;
}) {
  const query = new URLSearchParams();

  if (selectedCategory) query.set("category", selectedCategory);
  if (search) query.set("q", search);
  if (min !== MIN_PRICE) query.set("min", String(min));
  if (max !== MAX_PRICE) query.set("max", String(max));
  query.set("page", String(page));

  return `/shop?${query.toString()}`;
}

function buildPageNumbers(currentPage: number, totalPages: number) {
  const pages = new Set<number>();

  pages.add(1);
  pages.add(totalPages);

  for (let page = currentPage - 2; page <= currentPage + 2; page += 1) {
    if (page >= 1 && page <= totalPages) {
      pages.add(page);
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}

function ProductTile({
  product,
  priority = false,
}: {
  product: any;
  priority?: boolean;
}) {
  const title = getProductTitle(product);
  const slug = getProductSlug(product);
  const image = getProductImage(product);
  const alt = getProductImageAlt(product);
  const categoryName = getProductCategoryName(product);
  const price = Number(product.price || 0);
  const href = slug ? `/products/${slug}` : "#";

  return (
    <article className="group relative overflow-hidden rounded-[20px] border border-neutral-200/90 bg-white shadow-[0_10px_28px_rgba(15,10,5,0.055)] transition duration-500 hover:-translate-y-1 hover:border-red-900/20 hover:shadow-[0_22px_70px_rgba(80,0,0,0.12)] sm:rounded-[26px]">
      <div className="relative aspect-square overflow-hidden bg-[#faf4ec]">
        <Link href={href} aria-label={`View ${title}`} className="block h-full">
          <Image
            src={image}
            alt={alt}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1536px) 25vw, 18vw"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            className="object-cover transition duration-700 ease-out group-hover:scale-110"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/16 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

          {product.badge ? (
            <div className="absolute left-2 top-2 rounded-full bg-white/95 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-red-900 shadow-sm backdrop-blur sm:left-3 sm:top-3 sm:text-[10px]">
              {product.badge}
            </div>
          ) : null}
        </Link>
      </div>

      <div className="p-3 sm:p-4">
        <Link href={href} className="block">
          <p className="line-clamp-2 min-h-[26px] text-[8px] font-black uppercase leading-[1.55] tracking-[0.18em] text-red-900/70 sm:text-[10px]">
            {categoryName}
          </p>

          <h2 className="mt-1.5 line-clamp-2 min-h-[40px] text-[13px] font-black leading-snug tracking-[-0.02em] text-neutral-950 transition group-hover:text-red-950 sm:mt-2 sm:text-[15px]">
            {title}
          </h2>

          <p className="mt-2 text-[17px] font-black tracking-[-0.04em] text-red-950 sm:mt-3 sm:text-lg">
            {money(price)}
          </p>
        </Link>

        <ShopProductActions
          product={{
            id: String(product.id),
            slug,
            title,
            price,
            image,
          }}
        />
      </div>
    </article>
  );
}

function FilterForm({
  categories,
  params,
  selectedCategory,
  min,
  max,
  paginatedCount,
  filteredCount,
  mobile = false,
}: {
  categories: any[];
  params?: ShopSearchParams;
  selectedCategory: string;
  min: number;
  max: number;
  paginatedCount: number;
  filteredCount: number;
  mobile?: boolean;
}) {
  return (
    <form action="/shop" className="space-y-4">
      <input type="hidden" name="min" value={MIN_PRICE} />

      <div className="flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-3 transition focus-within:border-red-900/35 focus-within:shadow-[0_0_0_4px_rgba(127,29,29,0.08)]">
        <Search className="h-4 w-4 shrink-0 text-red-900" />
        <input
          name="q"
          defaultValue={params?.q || ""}
          placeholder="Search products..."
          className="w-full bg-transparent text-sm font-semibold text-neutral-900 outline-none placeholder:text-neutral-400"
        />
      </div>

      <div>
        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-neutral-400">
          Categories
        </p>

        <div className={`${mobile ? "max-h-[260px]" : "max-h-[360px]"} space-y-2 overflow-y-auto pr-1`}>
          <label className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-3 py-2.5 transition hover:border-red-900/20 hover:bg-red-50/50">
            <input
              type="radio"
              name="category"
              value=""
              defaultChecked={!selectedCategory}
              className="peer sr-only"
            />
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-white transition peer-checked:border-red-900 peer-checked:bg-red-900">
              <span className="h-2 w-2 rounded-full bg-white opacity-0 transition peer-checked:opacity-100" />
            </span>
            <span className="text-sm font-extrabold text-neutral-800 transition group-hover:text-red-900">
              All Categories
            </span>
          </label>

          {categories.map((category: any) => (
            <label
              key={category.id}
              className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-3 py-2.5 transition hover:border-red-900/20 hover:bg-red-50/50"
            >
              <input
                type="radio"
                name="category"
                value={category.slug}
                defaultChecked={selectedCategory === category.slug}
                className="peer sr-only"
              />
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-white transition peer-checked:border-red-900 peer-checked:bg-red-900">
                <span className="h-2 w-2 rounded-full bg-white opacity-0 transition peer-checked:opacity-100" />
              </span>
              <span className="text-sm font-extrabold text-neutral-800 transition group-hover:text-red-900">
                {category.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-[22px] border border-neutral-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-neutral-400">
            Price Range
          </p>
          <p className="text-xs font-black text-red-900">
            Rs {MIN_PRICE.toLocaleString("en-MU")} - Rs{" "}
            {max.toLocaleString("en-MU")}
          </p>
        </div>

        <input
          type="range"
          name="max"
          min={MIN_PRICE}
          max={MAX_PRICE}
          step="50"
          defaultValue={max}
          className="h-2 w-full cursor-pointer accent-red-900"
          aria-label="Maximum price"
        />

        <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-neutral-400">
          <span>Rs 1</span>
          <span>Rs 10,000</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="submit"
          className="rounded-2xl bg-red-900 px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-white shadow-[0_14px_34px_rgba(127,29,29,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-red-800 hover:shadow-[0_18px_44px_rgba(127,29,29,0.28)]"
        >
          Refine
        </button>

        <Link
          href="/shop"
          className="inline-flex items-center justify-center rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-red-900 transition duration-300 hover:-translate-y-0.5 hover:border-red-900/20 hover:bg-red-50"
        >
          Clear
        </Link>
      </div>

      <div className="rounded-2xl bg-red-50/70 px-4 py-3">
        <p className="text-xs font-bold text-neutral-600">
          Showing{" "}
          <span className="font-black text-neutral-950">{paginatedCount}</span>{" "}
          of{" "}
          <span className="font-black text-neutral-950">{filteredCount}</span>{" "}
          products
        </p>

        <p className="mt-1 text-xs font-bold text-neutral-600">
          Price:{" "}
          <span className="font-black text-red-900">
            Rs {MIN_PRICE.toLocaleString("en-MU")} - Rs{" "}
            {max.toLocaleString("en-MU")}
          </span>
        </p>
      </div>
    </form>
  );
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams?: Promise<ShopSearchParams>;
}) {
  const params = await searchParams;

  const [products, categories] = await Promise.all([
    getShopProducts(),
    getShopCategories(),
  ]);

  const page = Math.max(Number(params?.page || 1), 1);
  const selectedCategory = params?.category || "";
  const search = String(params?.q || "").toLowerCase().trim();

  const min = MIN_PRICE;
  const max = Math.min(
    Math.max(Number(params?.max || MAX_PRICE), MIN_PRICE),
    MAX_PRICE,
  );

  const filteredProducts = products.filter((product: any) => {
    const title = getProductTitle(product).toLowerCase();
    const description = String(
      product.short_description || product.description || "",
    ).toLowerCase();
    const price = Number(product.price || 0);
    const productCategory = getProductCategorySlug(product);

    const matchesSearch =
      !search || title.includes(search) || description.includes(search);

    const matchesCategory =
      !selectedCategory || productCategory === selectedCategory;

    const matchesPrice = price >= min && price <= max;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const totalPages = Math.max(Math.ceil(filteredProducts.length / PAGE_SIZE), 1);
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginatedProducts = filteredProducts.slice(start, start + PAGE_SIZE);
  const pageNumbers = buildPageNumbers(currentPage, totalPages);

  const previousHref = makeShopHref({
    page: Math.max(currentPage - 1, 1),
    selectedCategory,
    search,
    min,
    max,
  });

  const nextHref = makeShopHref({
    page: Math.min(currentPage + 1, totalPages),
    selectedCategory,
    search,
    min,
    max,
  });

  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <section className="mx-auto max-w-[1920px] px-3 pb-14 pt-3 sm:px-5 lg:px-8">
        <div className="mb-4 xl:hidden">
          <details className="group overflow-hidden rounded-[26px] border border-neutral-200/90 bg-white shadow-[0_18px_60px_rgba(15,10,5,0.08)]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-red-900">
                  Refine Selection
                </p>
                <p className="mt-1 text-sm font-bold text-neutral-500">
                  Tap to open filters
                </p>
              </div>

              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-red-900 text-white transition group-open:rotate-180">
                <ChevronDown className="h-5 w-5" />
              </span>
            </summary>

            <div className="border-t border-neutral-100 p-4">
              <FilterForm
                categories={categories}
                params={params}
                selectedCategory={selectedCategory}
                min={min}
                max={max}
                paginatedCount={paginatedProducts.length}
                filteredCount={filteredProducts.length}
                mobile
              />
            </div>
          </details>
        </div>

        <div className="grid gap-5 xl:grid-cols-[310px_1fr] 2xl:grid-cols-[330px_1fr]">
          <aside className="hidden xl:block xl:sticky xl:top-[118px] xl:self-start">
            <div className="rounded-[30px] border border-neutral-200/90 bg-white/96 p-5 shadow-[0_18px_60px_rgba(15,10,5,0.08)] backdrop-blur-xl">
              <div className="mb-5">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-red-900">
                  Refine Selection
                </p>
                <h1 className="mt-2 text-2xl font-black tracking-[-0.04em] text-neutral-950">
                  Products
                </h1>
                <p className="mt-1 text-xs font-semibold leading-5 text-neutral-500">
                  Choose category and price range.
                </p>
              </div>

              <FilterForm
                categories={categories}
                params={params}
                selectedCategory={selectedCategory}
                min={min}
                max={max}
                paginatedCount={paginatedProducts.length}
                filteredCount={filteredProducts.length}
              />
            </div>
          </aside>

          <div className="min-w-0">
            {paginatedProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 min-[1700px]:grid-cols-5">
                {paginatedProducts.map((product: any, index: number) => (
                  <ProductTile
                    key={product.id}
                    product={product}
                    priority={currentPage === 1 && index < 6}
                  />
                ))}
              </div>
            ) : (
              <div className="mx-auto mt-8 max-w-2xl rounded-[30px] border border-neutral-200 bg-white p-10 text-center shadow-[0_18px_60px_rgba(15,10,5,0.08)]">
                <h2 className="text-3xl font-black tracking-[-0.04em] text-neutral-950">
                  No products found
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-neutral-600">
                  Try another category, search term or price range.
                </p>

                <Link
                  href="/shop"
                  className="mt-6 inline-flex rounded-full bg-red-900 px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-red-800"
                >
                  Clear Filters
                </Link>
              </div>
            )}

            {filteredProducts.length > PAGE_SIZE ? (
              <nav
                aria-label="Product pagination"
                className="mt-10 flex flex-col items-center justify-between gap-4 rounded-[26px] border border-neutral-200 bg-white px-4 py-4 shadow-[0_14px_40px_rgba(15,10,5,0.055)] sm:flex-row sm:px-5"
              >
                <p className="text-sm font-bold text-neutral-500">
                  Page{" "}
                  <span className="font-black text-neutral-950">
                    {currentPage}
                  </span>{" "}
                  of{" "}
                  <span className="font-black text-neutral-950">
                    {totalPages}
                  </span>
                </p>

                <div className="flex max-w-full flex-wrap items-center justify-center gap-2">
                  {currentPage > 1 ? (
                    <Link
                      href={previousHref}
                      className="rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.14em] text-red-900 transition hover:border-red-900/20 hover:bg-red-50"
                    >
                      Previous
                    </Link>
                  ) : (
                    <span className="rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.14em] text-neutral-300">
                      Previous
                    </span>
                  )}

                  {pageNumbers.map((pageNumber, index) => {
                    const previousPageNumber = pageNumbers[index - 1];
                    const showDots =
                      previousPageNumber && pageNumber - previousPageNumber > 1;

                    const href = makeShopHref({
                      page: pageNumber,
                      selectedCategory,
                      search,
                      min,
                      max,
                    });

                    return (
                      <span key={pageNumber} className="flex items-center gap-2">
                        {showDots ? (
                          <span className="px-1 text-sm font-black text-neutral-300">
                            ...
                          </span>
                        ) : null}

                        {pageNumber === currentPage ? (
                          <span className="inline-flex h-10 min-w-10 items-center justify-center rounded-full bg-red-900 px-3 text-sm font-black text-white shadow-[0_12px_26px_rgba(127,29,29,0.24)]">
                            {pageNumber}
                          </span>
                        ) : (
                          <Link
                            href={href}
                            className="inline-flex h-10 min-w-10 items-center justify-center rounded-full border border-neutral-200 bg-white px-3 text-sm font-black text-red-900 transition hover:border-red-900/20 hover:bg-red-50"
                          >
                            {pageNumber}
                          </Link>
                        )}
                      </span>
                    );
                  })}

                  {currentPage < totalPages ? (
                    <Link
                      href={nextHref}
                      className="rounded-full bg-red-900 px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.14em] text-white transition hover:bg-red-800"
                    >
                      Next
                    </Link>
                  ) : (
                    <span className="rounded-full bg-neutral-100 px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.14em] text-neutral-300">
                      Next
                    </span>
                  )}
                </div>
              </nav>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}