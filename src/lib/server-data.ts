import {
  blogPosts as mockBlogs,
  categories as mockCategories,
  heroSlides as mockHeroSlides,
  products as mockProducts,
} from "@/data/mock";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

function hasRealSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) return false;
  if (url.includes("your_supabase_url")) return false;
  if (key.includes("your_service_role_key")) return false;

  return true;
}

export async function getAnnouncementBar() {
  if (!hasRealSupabaseEnv()) {
    return {
      text: "Handcrafted Pottery Made with Passion in Mauritius",
    };
  }

  try {
    const { data } = await supabaseAdmin
      .from("announcement_bars")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .limit(1)
      .maybeSingle();

    return (
      data || {
        text: "Handcrafted Pottery Made with Passion in Mauritius",
      }
    );
  } catch {
    return {
      text: "Handcrafted Pottery Made with Passion in Mauritius",
    };
  }
}

export async function getHeroBanners() {
  if (!hasRealSupabaseEnv()) return mockHeroSlides;

  try {
    const { data, error } = await supabaseAdmin
      .from("hero_banners")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true });

    if (error || !data?.length) return mockHeroSlides;

    return data.map((item) => ({
      id: item.id,
      title: item.title || "",
      subtitle: item.subtitle || "",
      desktopImage: item.desktop_image_url || "",
      mobileImage: item.mobile_image_url || "",
      ctaLabel: item.cta_label || "",
      ctaLink: item.cta_link || "",
    }));
  } catch {
    return mockHeroSlides;
  }
}

export async function getFeaturedCategories() {
  if (!hasRealSupabaseEnv()) return mockCategories;

  try {
    const { data, error } = await supabaseAdmin
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data?.length) return mockCategories;

    return data.map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      description: item.description || "",
      imageUrl: item.image_url || "",
      featured: item.featured || false,
    }));
  } catch {
    return mockCategories;
  }
}

export async function getProducts(opts?: {
  bestSeller?: boolean;
  newArrival?: boolean;
  limit?: number;
}) {
  if (!hasRealSupabaseEnv()) {
    let items = [...mockProducts];
    if (opts?.bestSeller) {
      items = items.filter((p) => p.badge === "best-seller");
    }
    if (opts?.newArrival) {
      items = items.filter((p) => p.badge === "new");
    }
    return opts?.limit ? items.slice(0, opts.limit) : items;
  }

  try {
    let query = supabaseAdmin
      .from("products")
      .select(`
        *,
        categories:category_id (
          id,
          name,
          slug,
          description,
          image_url,
          featured
        ),
        product_images (
          id,
          image_url,
          alt_text,
          sort_order,
          is_primary
        )
      `)
      .eq("active", true)
      .order("created_at", { ascending: false });

    if (opts?.bestSeller) query = query.eq("best_seller", true);
    if (opts?.newArrival) query = query.eq("new_arrival", true);
    if (opts?.limit) query = query.limit(opts.limit);

    const { data, error } = await query;

    if (error || !data?.length) {
      let items = [...mockProducts];
      if (opts?.bestSeller) items = items.filter((p) => p.badge === "best-seller");
      if (opts?.newArrival) items = items.filter((p) => p.badge === "new");
      return opts?.limit ? items.slice(0, opts.limit) : items;
    }

    return data.map((item) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      shortDescription: item.short_description || "",
      description: item.description || "",
      price: Number(item.price || 0),
      salePrice: item.sale_price ? Number(item.sale_price) : null,
      sku: item.sku || "",
      stockQty: item.stock_qty || 0,
      images:
        item.product_images?.map((img: any) => ({
          id: img.id,
          imageUrl: img.image_url,
          alt: img.alt_text || item.title,
          isPrimary: img.is_primary || false,
        })) || [],
      category: item.categories
        ? {
            id: item.categories.id,
            name: item.categories.name,
            slug: item.categories.slug,
            description: item.categories.description || "",
            imageUrl: item.categories.image_url || "",
            featured: item.categories.featured || false,
          }
        : undefined,
    }));
  } catch {
    let items = [...mockProducts];
    if (opts?.bestSeller) items = items.filter((p) => p.badge === "best-seller");
    if (opts?.newArrival) items = items.filter((p) => p.badge === "new");
    return opts?.limit ? items.slice(0, opts.limit) : items;
  }
}

export async function getLatestBlogs(limit = 3) {
  if (!hasRealSupabaseEnv()) return mockBlogs.slice(0, limit);

  try {
    const { data, error } = await supabaseAdmin
      .from("blogs")
      .select("*")
      .eq("active", true)
      .order("published_at", { ascending: false })
      .limit(limit);

    if (error || !data?.length) return mockBlogs.slice(0, limit);

    return data.map((item) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt || "",
      featuredImage: item.featured_image_url || "",
      publishedAt: item.published_at || new Date().toISOString(),
    }));
  } catch {
    return mockBlogs.slice(0, limit);
  }
}

export async function getShopProducts() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      title,
      slug,
      short_description,
      description,
      price,
      compare_at_price,
      badge,
      category_id,
      stock_qty,
      is_active,
      is_in_stock,
      created_at,
      categories:category_id (
        id,
        name,
        slug
      ),
      product_images (
        id,
        image_url,
        alt_text,
        sort_order,
        is_primary
      )
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    console.error("getShopProducts error:", error.message);
    return [];
  }

  return (data ?? []).map((item: any) => {
    const sortedImages = [...(item.product_images ?? [])].sort((a, b) => {
      if (a.is_primary && !b.is_primary) return -1;
      if (!a.is_primary && b.is_primary) return 1;
      return Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0);
    });

    const primaryImage =
      sortedImages.find((img: any) => img.is_primary)?.image_url ||
      sortedImages[0]?.image_url ||
      "/images/placeholder-product.jpg";

    return {
      id: item.id,
      title: item.title,
      slug: item.slug,
      short_description: item.short_description || "",
      shortDescription: item.short_description || "",
      description: item.description || "",
      price: Number(item.price || 0),
      compare_at_price: item.compare_at_price
        ? Number(item.compare_at_price)
        : null,
      compareAtPrice: item.compare_at_price
        ? Number(item.compare_at_price)
        : null,
      badge: item.badge || "",
      category_id: item.category_id,
      stock_qty: item.stock_qty || 0,
      stockQty: item.stock_qty || 0,
      is_active: item.is_active,
      is_in_stock: item.is_in_stock,
      image: primaryImage,
      imageUrl: primaryImage,
      product_images: sortedImages,
      images: sortedImages.map((img: any) => ({
        id: img.id,
        imageUrl: img.image_url,
        image_url: img.image_url,
        alt: img.alt_text || item.title,
        alt_text: img.alt_text || item.title,
        isPrimary: img.is_primary || false,
        is_primary: img.is_primary || false,
      })),
      category: item.categories
        ? {
            id: item.categories.id,
            name: item.categories.name,
            slug: item.categories.slug,
          }
        : undefined,
      categories: item.categories,
    };
  });
}

export async function getShopCategories() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name", { ascending: true });

  if (error) {
    console.error("getShopCategories error:", error.message);
    return [];
  }

  return data ?? [];
}