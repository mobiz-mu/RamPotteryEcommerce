import Link from "next/link";
import ProductCard from "@/components/common/ProductCard";
import { getShopCategories, getShopProducts } from "@/lib/server-data";

const PAGE_SIZE = 30;

export default async function ShopPage({
  searchParams,
}: {
  searchParams?: Promise<{
    page?: string;
    category?: string;
    min?: string;
    max?: string;
    q?: string;
  }>;
}) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([
  getShopProducts(),
  getShopCategories(),
]);

  const page = Math.max(Number(params?.page || 1), 1);
  const selectedCategory = params?.category || "";
  const search = (params?.q || "").toLowerCase();
  const min = Number(params?.min || 0);
  const max = Number(params?.max || 999999999);

  const filteredProducts = products.filter((product: any) => {
    const title = String(product.title || product.name || "").toLowerCase();
    const price = Number(product.price || 0);
    const productCategory =
      product.categories?.slug ||
      product.category?.slug ||
      product.category_id ||
   "";

    const matchesSearch = !search || title.includes(search);
    const matchesCategory =
      !selectedCategory || productCategory === selectedCategory;
    const matchesPrice = price >= min && price <= max;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const totalPages = Math.max(Math.ceil(filteredProducts.length / PAGE_SIZE), 1);
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginatedProducts = filteredProducts.slice(start, start + PAGE_SIZE);

  const makePageHref = (nextPage: number) => {
    const query = new URLSearchParams();

    if (selectedCategory) query.set("category", selectedCategory);
    if (params?.q) query.set("q", params.q);
    if (params?.min) query.set("min", params.min);
    if (params?.max) query.set("max", params.max);
    query.set("page", String(nextPage));

    return `/shop?${query.toString()}`;
  };

  return (
    <section className="bg-[#f7f5f0]">
      <div className="mx-auto max-w-[1800px] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.35em] text-red-700">
            Ram Pottery Mauritius
          </p>

          <h1 className="text-4xl font-extrabold tracking-tight text-neutral-950 sm:text-5xl">
            Shop All Products
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-neutral-600">
            Discover premium handcrafted pottery, clay décor, tableware,
            garden pieces and artisan collections made for elegant Mauritian
            homes.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[290px_1fr]">
          <aside className="h-fit rounded-[28px] border border-neutral-200 bg-white p-5 shadow-[0_18px_50px_rgba(0,0,0,0.06)] lg:sticky lg:top-32">
            <div className="mb-5">
              <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-red-700">
                Refine Selection
              </p>
              <h2 className="mt-2 text-xl font-extrabold text-neutral-950">
                Filter Products
              </h2>
            </div>

            <form action="/shop" className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-neutral-800">
                  Search
                </label>
                <input
                  name="q"
                  defaultValue={params?.q || ""}
                  placeholder="Search pottery..."
                  className="w-full rounded-xl border border-neutral-200 bg-[#fafafa] px-4 py-3 text-sm outline-none transition focus:border-red-300 focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-neutral-800">
                  Category
                </label>
                <select
                  name="category"
                  defaultValue={selectedCategory}
                  className="w-full rounded-xl border border-neutral-200 bg-[#fafafa] px-4 py-3 text-sm outline-none transition focus:border-red-300 focus:bg-white"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-neutral-800">
                  Price Range
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    name="min"
                    defaultValue={params?.min || ""}
                    placeholder="Min"
                    type="number"
                    className="w-full rounded-xl border border-neutral-200 bg-[#fafafa] px-4 py-3 text-sm outline-none transition focus:border-red-300 focus:bg-white"
                  />
                  <input
                    name="max"
                    defaultValue={params?.max || ""}
                    placeholder="Max"
                    type="number"
                    className="w-full rounded-xl border border-neutral-200 bg-[#fafafa] px-4 py-3 text-sm outline-none transition focus:border-red-300 focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-red-700 px-5 py-3 text-sm font-extrabold uppercase tracking-[0.14em] text-white shadow-lg transition hover:bg-red-800"
              >
                Apply Filters
              </button>

              <Link
                href="/shop"
                className="block text-center text-sm font-bold text-neutral-500 transition hover:text-red-700"
              >
                Clear Filters
              </Link>
            </form>
          </aside>

          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-white px-5 py-4 shadow-sm">
              <p className="text-sm font-semibold text-neutral-600">
                Showing{" "}
                <span className="font-extrabold text-neutral-950">
                  {paginatedProducts.length}
                </span>{" "}
                of{" "}
                <span className="font-extrabold text-neutral-950">
                  {filteredProducts.length}
                </span>{" "}
                products
              </p>

              <p className="text-sm font-semibold text-neutral-500">
                Page {currentPage} of {totalPages}
              </p>
            </div>

            {paginatedProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {paginatedProducts.map((product: any) => (
                  <ProductCard
                     key={product.id}
                     product={{
                      ...product,
                      image:
                        product.product_images?.find((img: any) => img.is_primary)?.image_url ||
                        product.product_images?.sort(
                        (a: any, b: any) => Number(a.sort_order) - Number(b.sort_order)
                        )?.[0]?.image_url ||
                        "/brand/logo.png",
                   }}
                 />
                ))}
              </div>
            ) : (
              <div className="rounded-[28px] border border-neutral-200 bg-white p-10 text-center shadow-sm">
                <h3 className="text-2xl font-extrabold text-neutral-950">
                  No products found
                </h3>
                <p className="mt-3 text-neutral-600">
                  Try another category, search term or price range.
                </p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                {currentPage > 1 && (
                  <Link
                    href={makePageHref(currentPage - 1)}
                    className="rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-bold text-neutral-700 shadow-sm transition hover:bg-red-700 hover:text-white"
                  >
                    Previous
                  </Link>
                )}

                {Array.from({ length: totalPages }).map((_, index) => {
                  const pageNumber = index + 1;

                  return (
                    <Link
                      key={pageNumber}
                      href={makePageHref(pageNumber)}
                      className={`rounded-xl px-4 py-3 text-sm font-bold shadow-sm transition ${
                        pageNumber === currentPage
                          ? "bg-red-700 text-white"
                          : "border border-neutral-200 bg-white text-neutral-700 hover:bg-red-700 hover:text-white"
                      }`}
                    >
                      {pageNumber}
                    </Link>
                  );
                })}

                {currentPage < totalPages && (
                  <Link
                    href={makePageHref(currentPage + 1)}
                    className="rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-bold text-neutral-700 shadow-sm transition hover:bg-red-700 hover:text-white"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}