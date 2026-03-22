import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-600">
            Catalog
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
            Categories
          </h1>
          <p className="mt-3 text-sm leading-7 text-neutral-500">
            Organize your collections for easier storefront browsing.
          </p>
        </div>

        <Link
          href="/admin/categories/new"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Add Category
        </Link>
      </div>

      <div className="rounded-[1.8rem] border border-neutral-200 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            Could not load categories.
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {!categories || categories.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500">
              No categories found.
            </div>
          ) : (
            categories.map((category: any) => (
              <div
                key={category.id}
                className="rounded-[1.5rem] border border-neutral-200 bg-white p-5 shadow-[0_12px_35px_rgba(0,0,0,0.04)]"
              >
                <div className="flex items-start gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-neutral-100">
                    {category.image_url ? (
                      <Image
                        src={category.image_url}
                        alt={category.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-neutral-950">
                          {category.name}
                        </h3>
                        <p className="mt-1 text-xs text-neutral-500">
                          {category.slug}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          category.is_active
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-neutral-100 text-neutral-600"
                        }`}
                      >
                        {category.is_active ? "Active" : "Hidden"}
                      </span>
                    </div>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-neutral-500">
                      {category.description || "Category ready for product assignment and display."}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-neutral-500">
                        Sort: {category.sort_order ?? 0}
                      </span>

                      <Link
                        href={`/admin/categories/${category.id}`}
                        className="text-sm font-medium text-red-600 transition hover:text-red-700"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}