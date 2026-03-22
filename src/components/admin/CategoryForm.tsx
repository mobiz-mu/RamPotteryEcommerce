"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Trash2, Upload } from "lucide-react";

type CategoryData = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  seo_title: string | null;
  seo_description: string | null;
  image_url: string | null;
  image_path: string | null;
  is_active: boolean;
  sort_order: number;
};

type Props = {
  initialData?: CategoryData;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function CategoryForm({ initialData }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState(initialData?.name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [seoTitle, setSeoTitle] = useState(initialData?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(initialData?.seo_description ?? "");
  const [imageUrl, setImageUrl] = useState(initialData?.image_url ?? "");
  const [imagePath, setImagePath] = useState(initialData?.image_path ?? "");
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);
  const [sortOrder, setSortOrder] = useState(String(initialData?.sort_order ?? 0));

  const mode = initialData ? "edit" : "create";
  const canAutoSlug = useMemo(() => !initialData, [initialData]);

  async function handleImageUpload(file: File | null) {
    if (!file) return;

    setError("");

    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `categories/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("category-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      setError(uploadError.message);
      return;
    }

    const { data } = supabase.storage.from("category-images").getPublicUrl(filePath);

    setImagePath(filePath);
    setImageUrl(data.publicUrl);
  }

  async function removeImage() {
    if (imagePath) {
      await supabase.storage.from("category-images").remove([imagePath]);
    }
    setImagePath("");
    setImageUrl("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      name,
      slug,
      description,
      seo_title: seoTitle,
      seo_description: seoDescription,
      image_url: imageUrl || null,
      image_path: imagePath || null,
      is_active: isActive,
      sort_order: Number(sortOrder || 0),
    };

    const url =
      mode === "create"
        ? "/api/admin/categories"
        : `/api/admin/categories/${initialData?.id}`;

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

    router.push("/admin/categories");
    router.refresh();
  }

  async function handleDelete() {
    if (!initialData) return;
    const ok = window.confirm("Delete this category?");
    if (!ok) return;

    setLoading(true);
    setError("");

    const res = await fetch(`/api/admin/categories/${initialData.id}`, {
      method: "DELETE",
    });

    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(json.error || "Unable to delete category.");
      return;
    }

    router.push("/admin/categories");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-8">
      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
            <h2 className="text-xl font-semibold text-neutral-950">Basic Details</h2>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  Category Name
                </label>
                <Input
                  placeholder="Enter category name"
                  value={name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setName(val);
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
                  placeholder="category-slug"
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  Description
                </label>
                <Textarea
                  placeholder="Category description"
                  className="min-h-32"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
            <h2 className="text-xl font-semibold text-neutral-950">SEO</h2>

            <div className="mt-6 grid gap-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  SEO Title
                </label>
                <Input
                  placeholder="SEO category title"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  SEO Description
                </label>
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
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-neutral-950">Category Image</h2>

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700">
                <Upload className="h-4 w-4" />
                Upload
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>

            <div className="mt-6">
              {imageUrl ? (
                <div className="rounded-2xl border border-neutral-200 p-4">
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-100">
                    <Image
                      src={imageUrl}
                      alt={name || "Category image"}
                      fill
                      sizes="300px"
                      className="object-cover"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={removeImage}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove Image
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center text-sm text-neutral-500">
                  No category image uploaded yet
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
            <h2 className="text-xl font-semibold text-neutral-950">Visibility</h2>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  Sort Order
                </label>
                <Input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                />
              </div>

              <label className="inline-flex items-center gap-2 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                Active category
              </label>
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
            <h2 className="text-xl font-semibold text-neutral-950">Publishing Notes</h2>
            <div className="mt-5 space-y-3 text-sm leading-7 text-neutral-600">
              <p>• Use a clean readable name and slug.</p>
              <p>• Add an image for better storefront and menu presentation.</p>
              <p>• Keep category SEO title concise and useful.</p>
              <p>• Use sort order to control storefront display order.</p>
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
              {loading ? "Saving..." : mode === "create" ? "Save Category" : "Update Category"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-xl px-8"
              onClick={() => router.push("/admin/categories")}
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
                Delete Category
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </form>
  );
}