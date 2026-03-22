import AdminPageHeader from "@/components/admin/AdminPageHeader";
import NewsletterCampaignForm from "@/components/admin/NewsletterCampaignForm";
import { createClient } from "@/lib/supabase/server";

type Props = {
  searchParams: Promise<{ ids?: string }>;
};

export default async function AdminNewsletterCampaignNewPage({
  searchParams,
}: Props) {
  const { ids } = await searchParams;
  const supabase = await createClient();

  const selectedIds = ids ? ids.split(",").filter(Boolean) : [];

  const { data: subscribers } = selectedIds.length
    ? await supabase
        .from("newsletter_subscribers")
        .select("id, email")
        .in("id", selectedIds)
    : { data: [] };

  return (
    <div>
      <AdminPageHeader
        eyebrow="Audience"
        title="Create Campaign"
        description="Prepare a premium email marketing campaign for selected subscribers."
      />
      <NewsletterCampaignForm subscribers={subscribers ?? []} />
    </div>
  );
}