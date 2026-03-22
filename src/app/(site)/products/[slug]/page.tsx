import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import RelatedProducts from "@/components/product/RelatedProducts";

type Props = {
  params: Promise<{ slug: string }>;
};

type ProductImage = {
  id: string;
  image_url: string | null;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number | null;
};

type ProductCategory = {
  id: string;
  name: string;
  slug: string;
};

type Product = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  seo_title: string | null;
  seo_description: string | null;
  price: number | null;
  compare_at_price: number | null;
  badge: string | null;
  stock_qty: number | null;
  is_active: boolean;
  is_in_stock: boolean;
  category_id: string | null;
  categories?: ProductCategory | null;
  product_images: ProductImage[] | null;
};

type RawProduct = Omit<Product, "categories"> & {
  categories?: ProductCategory | ProductCategory[] | null;
};

function normalizeProduct(raw: RawProduct): Product {
  const normalizedCategory = Array.isArray(raw.categories)
    ? raw.categories[0] ?? null
    : raw.categories ?? null;

  return {
    ...raw,
    categories: normalizedCategory,
  };
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("title, seo_title, seo_description")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!product) {
    return {
      title: "Product Not Found | Ram Pottery",
    };
  }

  return {
    title: product.seo_title || `${product.title} | Ram Pottery Mauritius`,
    description:
      product.seo_description ||
      `Buy ${product.title} from Ram Pottery Mauritius. Premium handcrafted pottery with timeless design and elegant finish.`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: rawProduct } = await supabase
    .from("products")
    .select(`
      id,
      title,
      slug,
      short_description,
      description,
      seo_title,
      seo_description,
      price,
      compare_at_price,
      badge,
      stock_qty,
      is_active,
      is_in_stock,
      category_id,
      categories:category_id (
        id,
        name,
        slug
      ),
      product_images (
        id,
        image_url,
        alt_text,
        is_primary,
        sort_order
      )
    `)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!rawProduct) return notFound();

  const product = normalizeProduct(rawProduct as RawProduct);

  let relatedProducts: Product[] = [];

  if (product.category_id) {
    const { data } = await supabase
      .from("products")
      .select(`
        id,
        title,
        slug,
        short_description,
        description,
        seo_title,
        seo_description,
        price,
        compare_at_price,
        badge,
        stock_qty,
        is_active,
        is_in_stock,
        category_id,
        categories:category_id (
          id,
          name,
          slug
        ),
        product_images (
          id,
          image_url,
          alt_text,
          is_primary,
          sort_order
        )
      `)
      .eq("is_active", true)
      .eq("category_id", product.category_id)
      .neq("id", product.id)
      .order("created_at", { ascending: false })
      .limit(4);

    relatedProducts = ((data ?? []) as RawProduct[]).map(normalizeProduct);
  }

  return (
    <>
      <section className="bg-[#f7f5f2] py-10 sm:py-12 lg:py-14">
        <div className="container-padded">
          <div className="mb-8 text-sm text-neutral-500">
            <span>Home</span>
            <span className="mx-2">/</span>
            {product.categories?.slug ? (
              <>
                <a
                  href={`/categories/${product.categories.slug}`}
                  className="transition hover:text-red-600"
                >
                  {product.categories.name}
                </a>
                <span className="mx-2">/</span>
              </>
            ) : null}
            <span className="text-neutral-800">{product.title}</span>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr]">
            <ProductGallery product={product} />
            <ProductInfo product={product} />
          </div>
        </div>
      </section>

      <RelatedProducts
        currentProductId={product.id}
        categoryName={product.categories?.name || "Related Products"}
        products={relatedProducts}
      />
    </>
  );
}