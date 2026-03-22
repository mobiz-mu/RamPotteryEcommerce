import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ProductForm from "@/components/admin/ProductForm";
import { createClient } from "@/lib/supabase/server";

export default async function AdminNewProductPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");

  return (
    <div>
      <AdminPageHeader
        eyebrow="Catalog"
        title="Add New Product"
        description="Create a premium product with pricing, SEO, category, badge, and real images."
      />
      <ProductForm categories={categories ?? []} />
    </div>
  );
}