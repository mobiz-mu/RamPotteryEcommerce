"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Trash2, Upload, Star } from "lucide-react";

type Category = {
  id: string;
  name: string;
};

type ProductImage = {
  id?: string;
  image_path: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
};

type ProductData = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  seo_title: string | null;
  seo_description: string | null;
  price: number;
  compare_at_price: number | null;
  badge: string | null;
  category_id: string | null;
  stock_qty: number;
  is_active: boolean;
  is_in_stock: boolean;
  product_images?: ProductImage[];
};

type Props = {
  categories?: Category[];
  initialData?: ProductData;
};

const badgeOptions = [
  "",
  "Hot Seller",
  "New Arrival",
  "Best Deal",
  "Limited Edition",
  "Trending",
  "Featured",
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ProductForm({
  categories = [],
  initialData,
}: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [shortDescription, setShortDescription] = useState(
    initialData?.short_description ?? ""
  );
  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );
  const [seoTitle, setSeoTitle] = useState(initialData?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(
    initialData?.seo_description ?? ""
  );
  const [price, setPrice] = useState(String(initialData?.price ?? ""));
  const [compareAtPrice, setCompareAtPrice] = useState(
    initialData?.compare_at_price ? String(initialData.compare_at_price) : ""
  );
  const [badge, setBadge] = useState(initialData?.badge ?? "");
  const [categoryId, setCategoryId] = useState(initialData?.category_id ?? "");
  const [stockQty, setStockQty] = useState(
    String(initialData?.stock_qty ?? 0)
  );
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);
  const [isInStock, setIsInStock] = useState(
    initialData?.is_in_stock ?? true
  );
  const [images, setImages] = useState<ProductImage[]>(
    initialData?.product_images ?? []
  );

  const mode = initialData ? "edit" : "create";
  const seoTitleCount = seoTitle.length;
  const seoDescriptionCount = seoDescription.length;
  const canAutoSlug = useMemo(() => !initialData, [initialData]);

  async function handleImageUpload(files: FileList | null) {
    if (!files || files.length === 0) return;

    setError("");

    const uploaded: ProductImage[] = [];

    for (const file of Array.from(files)) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        setError(uploadError.message);
        return;
      }

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      uploaded.push({
        image_path: filePath,
        image_url: data.publicUrl,
        alt_text: title || file.name,
        sort_order: images.length + uploaded.length,
        is_primary: images.length === 0 && uploaded.length === 0,
      });
    }

    setImages((prev) => [...prev, ...uploaded]);
  }

  async function removeImage(index: number) {
    const image = images[index];
    if (!image) return;

    if (image.image_path) {
      await supabase.storage.from("product-images").remove([image.image_path]);
    }

    const next = images
      .filter((_, i) => i !== index)
      .map((img, idx) => ({
        ...img,
        sort_order: idx,
      }));

    if (next.length > 0 && !next.some((img) => img.is_primary)) {
      next[0].is_primary = true;
    }

    setImages(next);
  }

  function setPrimaryImage(index: number) {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        is_primary: i === index,
      }))
    );
  }

  function updateImageAlt(index: number, value: string) {
    setImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, alt_text: value } : img))
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      title,
      slug,
      short_description: shortDescription,
      description,
      seo_title: seoTitle,
      seo_description: seoDescription,
      price: Number(price || 0),
      compare_at_price: compareAtPrice ? Number(compareAtPrice) : null,
      badge: badge || null,
      category_id: categoryId || null,
      stock_qty: Number(stockQty || 0),
      is_active: isActive,
      is_in_stock: isInStock,
      images,
    };

    const url =
      mode === "create"
        ? "/api/admin/products"
        : `/api/admin/products/${initialData?.id}`;

    const method = mode === "create" ? "POST" : "PATCH";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(json.error || "Something went wrong.");
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  async function handleDelete() {
    if (!initialData) return;
    const ok = window.confirm("Delete this product?");
    if (!ok) return;

    setLoading(true);
    setError("");

    const res = await fetch(`/api/admin/products/${initialData.id}`, {
      method: "DELETE",
    });

    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(json.error || "Unable to delete product.");
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-8">
      <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-8">
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
            <h2 className="text-xl font-semibold text-neutral-950">
              Basic Details
            </h2>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  Product Title
                </label>
                <Input
                  placeholder="Enter product title"
                  value={title}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTitle(val);
                    if (canAutoSlug) setSlug(slugify(val));
                  }}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  Slug
                </label>
                <Input
                  placeholder="product-slug"
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  Short Description
                </label>
                <Textarea
                  placeholder="Short premium description"
                  className="min-h-24"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  Full Description
                </label>
                <Textarea
                  placeholder="Detailed product description"
                  className="min-h-40"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
            <h2 className="text-xl font-semibold text-neutral-950">
              Pricing, Category & Inventory
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  Price
                </label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  Compare At Price
                </label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={compareAtPrice}
                  onChange={(e) => setCompareAtPrice(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  Stock Qty
                </label>
                <Input
                  type="number"
                  placeholder="10"
                  value={stockQty}
                  onChange={(e) => setStockQty(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  Badge
                </label>
                <select
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background outline-none"
                >
                  {badgeOptions.map((option) => (
                    <option key={option || "none"} value={option}>
                      {option || "No badge"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background outline-none"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2 flex flex-wrap items-center gap-5 pt-2">
                <label className="inline-flex items-center gap-2 text-sm text-neutral-700">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                  Active
                </label>

                <label className="inline-flex items-center gap-2 text-sm text-neutral-700">
                  <input
                    type="checkbox"
                    checked={isInStock}
                    onChange={(e) => setIsInStock(e.target.checked)}
                  />
                  In Stock
                </label>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-neutral-950">Media</h2>

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700">
                <Upload className="h-4 w-4" />
                Upload Images
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleImageUpload(e.target.files)}
                />
              </label>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {images.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center text-sm text-neutral-500">
                  No product images uploaded yet
                </div>
              ) : (
                images.map((image, index) => (
                  <div
                    key={`${image.image_path}-${index}`}
                    className="rounded-2xl border border-neutral-200 p-4"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-100">
                      <Image
                        src={image.image_url}
                        alt={image.alt_text || title || "Product image"}
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        className="object-cover"
                      />
                    </div>

                    <div className="mt-4 space-y-3">
                      <Input
                        placeholder="Alt text for SEO"
                        value={image.alt_text || ""}
                        onChange={(e) => updateImageAlt(index, e.target.value)}
                      />

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPrimaryImage(index)}
                          className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition ${
                            image.is_primary
                              ? "bg-amber-50 text-amber-700"
                              : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                          }`}
                        >
                          <Star className="h-3.5 w-3.5" />
                          {image.is_primary ? "Primary" : "Set Primary"}
                        </button>

                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
            <h2 className="text-xl font-semibold text-neutral-950">SEO</h2>

            <div className="mt-6 grid gap-5">
              <div>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <label className="block text-sm font-medium text-neutral-900">
                    SEO Title
                  </label>
                  <span className="text-xs text-neutral-500">
                    {seoTitleCount}/60
                  </span>
                </div>
                <Input
                  placeholder="SEO optimized title"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <label className="block text-sm font-medium text-neutral-900">
                    SEO Description
                  </label>
                  <span className="text-xs text-neutral-500">
                    {seoDescriptionCount}/160
                  </span>
                </div>
                <Textarea
                  placeholder="SEO meta description"
                  className="min-h-28"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
            <h2 className="text-xl font-semibold text-neutral-950">Publishing Notes</h2>

            <div className="mt-5 space-y-3 text-sm leading-7 text-neutral-600">
              <p>• Use a clean product title and readable slug.</p>
              <p>• Add compare-at price for sales and promotions.</p>
              <p>• Always upload at least one primary image.</p>
              <p>• Write alt text for SEO and accessibility.</p>
              <p>• Keep SEO title under 60 characters and meta description near 160.</p>
            </div>
          </div>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              disabled={loading}
              className="h-12 rounded-xl bg-red-600 px-8 text-sm font-semibold text-white hover:bg-red-700"
            >
              {loading ? "Saving..." : mode === "create" ? "Save Product" : "Update Product"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-xl px-8"
              onClick={() => router.push("/admin/products")}
            >
              Cancel
            </Button>

            {initialData ? (
              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-xl border-red-200 px-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={handleDelete}
                disabled={loading}
              >
                Delete Product
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </form>
  );
}