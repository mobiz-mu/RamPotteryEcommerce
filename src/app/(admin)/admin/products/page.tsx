import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

function formatCurrency(value: number | null) {
  return `Rs ${Number(value ?? 0).toLocaleString("en-MU")}`;
}

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select(`
      id,
      title,
      slug,
      price,
      compare_at_price,
      stock_qty,
      is_active,
      is_in_stock,
      badge,
      categories (
        name
      )
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-600">
            Catalog
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
            Products
          </h1>
          <p className="mt-3 text-sm leading-7 text-neutral-500">
            Manage your premium product catalog, pricing, SEO, stock, and images.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Add Product
        </Link>
      </div>

      <div className="rounded-[1.8rem] border border-neutral-200 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            Could not load products. Check your products table and categories relation.
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-neutral-200 text-neutral-500">
              <tr>
                <th className="px-3 py-3 font-medium">Product</th>
                <th className="px-3 py-3 font-medium">Category</th>
                <th className="px-3 py-3 font-medium">Price</th>
                <th className="px-3 py-3 font-medium">Compare</th>
                <th className="px-3 py-3 font-medium">Badge</th>
                <th className="px-3 py-3 font-medium">Stock</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {!products || products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-3 py-10 text-center text-neutral-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product: any) => (
                  <tr key={product.id} className="border-b border-neutral-100">
                    <td className="px-3 py-4">
                      <div className="font-medium text-neutral-950">{product.title}</div>
                      <div className="mt-1 text-xs text-neutral-500">{product.slug}</div>
                    </td>
                    <td className="px-3 py-4 text-neutral-600">
                      {product.categories?.name ?? "-"}
                    </td>
                    <td className="px-3 py-4 text-neutral-600">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-3 py-4 text-neutral-600">
                      {product.compare_at_price ? formatCurrency(product.compare_at_price) : "-"}
                    </td>
                    <td className="px-3 py-4 text-neutral-600">
                      {product.badge || "-"}
                    </td>
                    <td className="px-3 py-4 text-neutral-600">
                      {product.stock_qty}
                    </td>
                    <td className="px-3 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          product.is_active
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-neutral-100 text-neutral-600"
                        }`}
                      >
                        {product.is_active ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="font-medium text-red-600 hover:text-red-700"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}