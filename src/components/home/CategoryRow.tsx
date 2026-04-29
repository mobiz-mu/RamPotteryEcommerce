import { createClient } from "@/lib/supabase/server";
import CategoryRowClient from "@/components/home/CategoryRowClient";

type Category = {
  id: string;
  name: string;
  slug: string;
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
  price: number | null;
  compare_at_price: number | null;
  stock_qty: number | null;
  is_active: boolean;
  is_in_stock: boolean;
  category_id: string | null;
  product_images: ProductImage[] | null;
};

export default async function CategoryRow() {
  const supabase = await createClient();

  const [
    { data: categories, error: categoriesError },
    { data: products, error: productsError },
  ] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name, slug, is_active, sort_order")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true })
      .limit(14),

    supabase
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
        category_id,
        product_images (
          image_url,
          is_primary,
          sort_order
        )
      `)
      .eq("is_active", true)
      .order("created_at", { ascending: false }),
  ]);

  const safeCategories: Category[] = categories ?? [];
  const safeProducts: Product[] = products ?? [];

  const groupedProducts = new Map<string, Product[]>();

  for (const product of safeProducts) {
    if (!product.category_id) continue;

    if (!groupedProducts.has(product.category_id)) {
      groupedProducts.set(product.category_id, []);
    }

    groupedProducts.get(product.category_id)!.push(product);
  }

  const rows = safeCategories
    .map((category) => {
      const categoryProducts = (groupedProducts.get(category.id) ?? []).slice(0, 4);
      return { category, products: categoryProducts };
    })
    .filter((row) => row.products.length > 0);

  if (categoriesError || productsError) {
    return (
      <section className="section-space bg-white">
        <div className="container-padded">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            CategoryRow query error:
            <div className="mt-2">categories: {categoriesError?.message ?? "none"}</div>
            <div>products: {productsError?.message ?? "none"}</div>
          </div>
        </div>
      </section>
    );
  }

  if (rows.length === 0) {
    return (
      <section className="section-space bg-white">
        <div className="container-padded">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
            CategoryRow found no rows.
            <div className="mt-2">Active categories: {safeCategories.length}</div>
            <div>Active products: {safeProducts.length}</div>
            <div>
              Products linked to categories: {
                safeProducts.filter((product) => product.category_id).length
              }
            </div>
          </div>
        </div>
      </section>
    );
  }

  return <CategoryRowClient rows={rows} />;
}