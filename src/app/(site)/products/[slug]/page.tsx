import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  ChevronRight,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import RelatedProducts from "@/components/product/RelatedProducts";
import RecentProductViews from "@/components/product/RecentProductViews";

const siteUrl = "https://rampottery.mu";

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

function formatCurrency(value: number | null | undefined) {
  return `Rs ${Number(value || 0).toLocaleString("en-MU")}`;
}

function getSortedImages(product: Product) {
  return [...(product.product_images ?? [])].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;

    return Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0);
  });
}

function getPrimaryImage(product: Product) {
  const images = getSortedImages(product);

  return (
    images.find((image) => image.is_primary)?.image_url ||
    images[0]?.image_url ||
    "/images/placeholder-product.jpg"
  );
}

function getPrimaryAlt(product: Product) {
  const images = getSortedImages(product);

  return (
    images.find((image) => image.is_primary)?.alt_text ||
    images[0]?.alt_text ||
    `${product.title} - Ram Pottery Mauritius`
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select(
      `
      title,
      slug,
      seo_title,
      seo_description,
      product_images (
        image_url,
        is_primary,
        sort_order
      )
    `,
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!product) {
    return {
      title: "Product Not Found | Ram Pottery",
    };
  }

  const images = [...(product.product_images ?? [])].sort((a: any, b: any) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;

    return Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0);
  });

  const ogImage =
    images.find((image: any) => image.is_primary)?.image_url ||
    images[0]?.image_url;

  return {
    title: product.seo_title || `${product.title} | Ram Pottery Mauritius`,
    description:
      product.seo_description ||
      `Buy ${product.title} from Ram Pottery Mauritius. Premium handcrafted pottery with timeless design and elegant finish.`,
    alternates: {
      canonical: `${siteUrl}/products/${product.slug}`,
    },
    openGraph: {
      title: product.seo_title || `${product.title} | Ram Pottery Mauritius`,
      description:
        product.seo_description ||
        `Buy ${product.title} from Ram Pottery Mauritius.`,
      url: `${siteUrl}/products/${product.slug}`,
      siteName: "Ram Pottery",
      type: "website",
      locale: "en_MU",
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 1200,
              alt: product.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.seo_title || `${product.title} | Ram Pottery Mauritius`,
      description:
        product.seo_description ||
        `Buy ${product.title} from Ram Pottery Mauritius.`,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: rawProduct } = await supabase
    .from("products")
    .select(
      `
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
    `,
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!rawProduct) return notFound();

  const product = normalizeProduct(rawProduct as RawProduct);
  const primaryImage = getPrimaryImage(product);
  const primaryAlt = getPrimaryAlt(product);

  let relatedProducts: Product[] = [];

  if (product.category_id) {
    const { data } = await supabase
      .from("products")
      .select(
        `
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
      `,
      )
      .eq("is_active", true)
      .eq("category_id", product.category_id)
      .neq("id", product.id)
      .order("created_at", { ascending: false })
      .limit(4);

    relatedProducts = ((data ?? []) as RawProduct[]).map(normalizeProduct);
  }

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: primaryImage,
    description:
      product.seo_description ||
      product.short_description ||
      product.description ||
      `${product.title} from Ram Pottery Mauritius.`,
    sku: product.slug,
    brand: {
      "@type": "Brand",
      name: "Ram Pottery",
    },
    category: product.categories?.name,
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/products/${product.slug}`,
      priceCurrency: "MUR",
      price: Number(product.price || 0),
      availability:
        product.is_in_stock && Number(product.stock_qty || 0) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="mx-auto max-w-[1920px] px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pb-14 lg:pt-10">
        <div className="mb-6 overflow-hidden rounded-[34px] border border-neutral-200 bg-white px-5 py-5 shadow-[0_18px_70px_rgba(15,10,5,0.07)] sm:px-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-neutral-400">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1 transition hover:text-red-900"
                >
                  Home
                </Link>

                <ChevronRight className="h-3.5 w-3.5" />

                <Link
                  href="/shop"
                  className="transition hover:text-red-900"
                >
                  Shop
                </Link>

                {product.categories?.slug ? (
                  <>
                    <ChevronRight className="h-3.5 w-3.5" />

                    <Link
                      href={`/categories/${product.categories.slug}`}
                      className="transition hover:text-red-900"
                    >
                      {product.categories.name}
                    </Link>
                  </>
                ) : null}

                <ChevronRight className="h-3.5 w-3.5" />

                <span className="line-clamp-1 text-red-900">
                  {product.title}
                </span>
              </div>

              <Link
                href={product.categories?.slug ? `/categories/${product.categories.slug}` : "/shop"}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-red-900 transition hover:border-red-900/20 hover:bg-red-50"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Collection
              </Link>
            </div>

            <div className="grid grid-cols-3 overflow-hidden rounded-[22px] border border-neutral-200 bg-[#faf8f4] shadow-sm">
              <MiniTrust icon={<ShieldCheck className="h-4 w-4" />} label="Secure" />
              <MiniTrust icon={<PackageCheck className="h-4 w-4" />} label="Packed" />
              <MiniTrust icon={<Truck className="h-4 w-4" />} label="Delivery" />
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] xl:grid-cols-[1.12fr_0.88fr]">
          <section className="rounded-[34px] border border-neutral-200 bg-white p-3 shadow-[0_18px_70px_rgba(15,10,5,0.07)] sm:p-5">
            <ProductGallery product={product} />
          </section>

          <aside className="lg:sticky lg:top-[118px] lg:self-start">
            <div className="rounded-[34px] border border-neutral-200 bg-white p-5 shadow-[0_18px_70px_rgba(15,10,5,0.07)] sm:p-7">
              {product.badge ? (
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-900/10 bg-red-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-red-900">
                  <Sparkles className="h-3.5 w-3.5" />
                  {product.badge}
                </div>
              ) : (
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-900/10 bg-red-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-red-900">
                  <Sparkles className="h-3.5 w-3.5" />
                  Handmade Selection
                </div>
              )}

              <ProductInfo product={product} />

              <div className="mt-6 grid gap-3 border-t border-neutral-200 pt-5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                <PromiseCard
                  icon={<BadgeCheck className="h-5 w-5" />}
                  title="Authentic"
                  desc="Handcrafted character"
                />

                <PromiseCard
                  icon={<PackageCheck className="h-5 w-5" />}
                  title="Prepared"
                  desc="Packed with care"
                />

                <PromiseCard
                  icon={<Truck className="h-5 w-5" />}
                  title="Mauritius"
                  desc="Local follow-up"
                />
              </div>
            </div>
          </aside>
        </div>
      </section>

      <RecentProductViews
        currentProduct={{
          id: product.id,
          title: product.title,
          slug: product.slug,
          price: Number(product.price || 0),
          image: primaryImage,
          categoryName: product.categories?.name || "Ram Pottery",
        }}
      />

      <RelatedProducts
        currentProductId={product.id}
        categoryName={product.categories?.name || "Related Products"}
        products={relatedProducts}
      />
    </main>
  );
}

function MiniTrust({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex min-w-[84px] flex-col items-center justify-center border-r border-neutral-200 px-4 py-3 text-center last:border-r-0">
      <div className="text-red-900">{icon}</div>
      <p className="mt-2 text-[9px] font-black uppercase tracking-[0.16em] text-neutral-400">
        {label}
      </p>
    </div>
  );
}

function PromiseCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-[22px] border border-neutral-200 bg-[#faf8f4] p-4">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-900 shadow-sm">
        {icon}
      </div>

      <h3 className="text-sm font-black text-neutral-950">{title}</h3>
      <p className="mt-1 text-xs font-semibold leading-5 text-neutral-500">
        {desc}
      </p>
    </div>
  );
}