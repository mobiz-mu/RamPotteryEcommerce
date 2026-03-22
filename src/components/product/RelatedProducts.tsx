import Link from "next/link";
import Image from "next/image";

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
  is_in_stock: boolean;
  stock_qty: number | null;
  product_images: ProductImage[] | null;
};

type Props = {
  currentProductId: string;
  categoryName: string;
  products: Product[];
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

export default function RelatedProducts({ categoryName, products }: Props) {
  if (!products.length) return null;

  return (
    <section className="bg-white py-12 sm:py-14 lg:py-16">
      <div className="container-padded">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-600">
            More to Explore
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-neutral-950">
            Related in {categoryName}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => {
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
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-medium tracking-[-0.02em] text-neutral-950 transition-colors duration-300 group-hover:text-red-600">
                    {product.title}
                  </h3>

                  <div className="mt-3 flex items-center gap-3">
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
      </div>
    </section>
  );
}