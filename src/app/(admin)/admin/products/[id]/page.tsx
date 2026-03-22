import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ProductForm from "@/components/admin/ProductForm";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditProductPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");

  const { data: product } = await supabase
    .from("products")
    .select(`
      *,
      product_images (
        id,
        image_path,
        image_url,
        alt_text,
        sort_order,
        is_primary
      )
    `)
    .eq("id", id)
    .single();

  if (!product) notFound();

  return (
    <div>
      <AdminPageHeader
        eyebrow="Catalog"
        title={`Edit Product`}
        description="Update product information, media, stock, category, badge, and SEO settings."
      />
      <ProductForm categories={categories ?? []} initialData={product} />
    </div>
  );
}