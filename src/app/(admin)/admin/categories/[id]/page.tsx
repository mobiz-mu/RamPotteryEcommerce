import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import CategoryForm from "@/components/admin/CategoryForm";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditCategoryPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  if (!category) notFound();

  return (
    <div>
      <AdminPageHeader
        eyebrow="Catalog"
        title="Edit Category"
        description="Update category information, SEO, image, and storefront visibility."
      />
      <CategoryForm initialData={category} />
    </div>
  );
}