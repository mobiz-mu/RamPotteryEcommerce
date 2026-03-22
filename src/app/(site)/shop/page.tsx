import ProductCard from "@/components/common/ProductCard";
import { getProducts } from "@/lib/server-data";

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <section className="container-padded section-space">
      <div className="mb-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-red-600">
          Shop
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-950">
          Shop All Products
        </h1>
        <p className="mt-4 max-w-2xl text-neutral-600">
          Discover premium handcrafted pottery, clay décor, incense holders,
          cookingware, vases, and elegant artisan creations.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}