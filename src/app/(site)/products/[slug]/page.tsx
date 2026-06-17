import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { getProductTitleMeta } from "@/lib/product-title";
import { notFound, permanentRedirect } from "next/navigation";
import { getCleanProductSlug } from "@/lib/product-title";
import {
  ArrowLeft,
  BadgeCheck,
  ChevronRight,
  PackageCheck,
  ShieldCheck,
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

  if (!rawProduct) {
  const cleanSlug = getCleanProductSlug(slug);

  if (cleanSlug && cleanSlug !== slug) {
    permanentRedirect(`/products/${cleanSlug}`);
  }

  return notFound();
}

  const product = normalizeProduct(rawProduct as RawProduct);
  const primaryImage = getPrimaryImage(product);
  const { cleanTitle, sku } = getProductTitleMeta(product.title);
  const displayTitle = cleanTitle || product.title;

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
    name: displayTitle,
    image: primaryImage,
    description:
      product.seo_description ||
      product.short_description ||
      product.description ||
      `${displayTitle} from Ram Pottery Mauritius.`,
    sku: sku || product.slug,
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
    <main className="min-h-screen bg-[#fffdfa] text-neutral-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="mx-auto max-w-[1480px] px-4 pb-10 pt-5 sm:px-6 lg:px-8 lg:pb-14 lg:pt-8">
        <div className="mb-5 overflow-hidden rounded-[28px] border border-red-950/10 bg-white/95 px-4 py-4 shadow-[0_18px_60px_rgba(70,20,10,0.06)] sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">
                <Link href="/" className="transition hover:text-red-900">
                  Home
                </Link>

                <ChevronRight className="h-3.5 w-3.5" />

                <Link href="/shop" className="transition hover:text-red-900">
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
                href={
                  product.categories?.slug
                    ? `/categories/${product.categories.slug}`
                    : "/shop"
                }
                className="inline-flex items-center gap-2 rounded-full border border-red-950/10 bg-[#fff8f1] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-red-900 transition hover:border-red-900/25 hover:bg-red-50"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Collection
              </Link>
            </div>

            <div className="grid grid-cols-3 overflow-hidden rounded-[20px] border border-red-950/10 bg-[#fff8f1] shadow-sm">
              <MiniTrust
                icon={<ShieldCheck className="h-4 w-4" />}
                label="Secure"
              />
              <MiniTrust
                icon={<PackageCheck className="h-4 w-4" />}
                label="Packed"
              />
              <MiniTrust icon={<Truck className="h-4 w-4" />} label="Delivery" />
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_440px] xl:grid-cols-[minmax(0,1fr)_470px]">
          <section className="rounded-[30px] border border-red-950/10 bg-white p-3 shadow-[0_18px_60px_rgba(70,20,10,0.06)] sm:p-4">
            <ProductGallery product={product} />
          </section>

          <aside className="lg:sticky lg:top-[118px] lg:self-start">
            <div className="rounded-[30px] border border-red-950/10 bg-white p-5 shadow-[0_18px_60px_rgba(70,20,10,0.07)] sm:p-6">
              <ProductInfo product={product} />

              <div className="mt-5 grid gap-3 border-t border-red-950/10 pt-5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                <PromiseCard
                  icon={<BadgeCheck className="h-5 w-5" />}
                  title="Authentic"
                  desc="Handcrafted finish"
                />

                <PromiseCard
                  icon={<PackageCheck className="h-5 w-5" />}
                  title="Prepared"
                  desc="Packed with care"
                />

                <PromiseCard
                  icon={<Truck className="h-5 w-5" />}
                  title="Mauritius"
                  desc="Local delivery"
                />
              </div>
            </div>
          </aside>
        </div>

        <ProductDetailsLandscape product={product} />
      </section>

      <RecentProductViews
        currentProduct={{
          id: product.id,
          title: displayTitle,
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

function ProductDetailsLandscape({ product }: { product: Product }) {
  const { cleanTitle } = getProductTitleMeta(product.title);
  const displayTitle = cleanTitle || product.title;
  const mainDescription =
    product.description?.trim() ||
    product.short_description?.trim() ||
    `${displayTitle} is a carefully handcrafted pottery piece from Ram Pottery Mauritius, created with attention to shape, finish and everyday usability. Each item reflects authentic local craftsmanship and is suitable for home décor, gifting, rituals, hospitality spaces and elegant table presentation.`;

  const categoryName = product.categories?.name || "handcrafted pottery";

  return (
    <section className="mt-6 overflow-hidden rounded-[30px] border border-red-950/10 bg-white shadow-[0_18px_60px_rgba(70,20,10,0.06)]">
      <div className="grid lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="flex flex-col justify-center border-b border-red-950/10 bg-[#fff8f1] p-6 sm:p-8 lg:border-b-0 lg:border-r lg:border-red-950/10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-red-900">
            Product Details
          </p>

          <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.04em] text-neutral-950 sm:text-3xl">
            Crafted with care by Ram Pottery Mauritius
          </h2>

          <p className="mt-4 text-sm leading-7 text-neutral-600">
            A refined handmade piece designed for beauty, durability and
            meaningful everyday use.
          </p>
        </div>

        <div className="p-6 sm:p-8 lg:p-9">
          <div className="max-w-5xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">
              About this piece
            </p>

            <div className="mt-4 whitespace-pre-line text-[15px] leading-8 text-neutral-600 sm:text-base">
              {mainDescription}
            </div>

            <div className="mt-6 border-t border-red-950/10 pt-5">
              <p className="text-[15px] leading-8 text-neutral-600 sm:text-base">
                This {categoryName.toLowerCase()} piece is prepared with a clean
                finish and packed carefully before delivery. Because every item
                is handmade, slight natural variations in tone, shape or texture
                may appear. These small differences make each piece unique,
                authentic and full of character.
              </p>
            </div>

            <div className="mt-6 rounded-[24px] border border-red-950/10 bg-[#fffaf4] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-900">
                Care & Use
              </p>

              <p className="mt-3 text-[15px] leading-8 text-neutral-600 sm:text-base">
                Handle gently, clean with care and keep the item in a safe place
                when not in use. For decorative, gifting, ritual or hospitality
                use, this piece brings a warm handmade touch while preserving the
                traditional identity of Ram Pottery Mauritius.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniTrust({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <div className="flex min-w-[82px] flex-col items-center justify-center border-r border-red-950/10 px-4 py-3 text-center last:border-r-0">
      <div className="text-red-900">{icon}</div>
      <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.16em] text-neutral-400">
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
  icon: ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-[20px] border border-red-950/10 bg-[#fff8f1] p-4">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-900 shadow-sm">
        {icon}
      </div>

      <h3 className="text-sm font-semibold text-neutral-950">{title}</h3>
      <p className="mt-1 text-xs font-medium leading-5 text-neutral-500">
        {desc}
      </p>
    </div>
  );
}