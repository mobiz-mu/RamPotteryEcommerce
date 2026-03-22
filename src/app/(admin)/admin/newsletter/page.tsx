import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import NewsletterSubscribersTable from "@/components/admin/NewsletterSubscribersTable";

export default async function AdminNewsletterPage() {
  const supabase = await createClient();

  const [{ data: subscribers }, { data: campaigns }] = await Promise.all([
    supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("subscribed_at", { ascending: false }),
    supabase
      .from("newsletter_campaigns")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const activeSubscribers =
    subscribers?.filter((item) => item.is_active).length ?? 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-600">
            Audience
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
            Newsletter
          </h1>
          <p className="mt-3 text-sm leading-7 text-neutral-500">
            Manage subscribers, copy selected emails, and prepare premium email campaigns.
          </p>
        </div>

        <Link
          href="/admin/newsletter/campaigns/new"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Create Campaign
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-[1.6rem] border border-neutral-200 bg-white p-5 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
          <p className="text-sm text-neutral-500">Total Subscribers</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
            {subscribers?.length ?? 0}
          </h2>
        </div>

        <div className="rounded-[1.6rem] border border-neutral-200 bg-white p-5 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
          <p className="text-sm text-neutral-500">Active Subscribers</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
            {activeSubscribers}
          </h2>
        </div>

        <div className="rounded-[1.6rem] border border-neutral-200 bg-white p-5 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
          <p className="text-sm text-neutral-500">Recent Campaigns</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
            {campaigns?.length ?? 0}
          </h2>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[1.8rem] border border-neutral-200 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
          <NewsletterSubscribersTable subscribers={subscribers ?? []} />
        </div>

        <div className="space-y-6">
          <div className="rounded-[1.8rem] border border-neutral-200 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
            <h2 className="text-xl font-semibold text-neutral-950">Campaign Notes</h2>
            <div className="mt-5 space-y-3 text-sm leading-7 text-neutral-600">
              <p>• Select all or specific subscribers for marketing campaigns.</p>
              <p>• Copy selected emails instantly for manual email tools if needed.</p>
              <p>• Use the campaign page to save subject, preview text, and content.</p>
              <p>• Later, connect Resend, Brevo, or Mailgun for actual bulk sending.</p>
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-neutral-200 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
            <h2 className="text-xl font-semibold text-neutral-950">Recent Campaigns</h2>
            <div className="mt-5 space-y-3">
              {!campaigns || campaigns.length === 0 ? (
                <p className="text-sm text-neutral-500">No campaigns created yet.</p>
              ) : (
                campaigns.map((campaign: any) => (
                  <div
                    key={campaign.id}
                    className="rounded-2xl border border-neutral-200 p-4"
                  >
                    <div className="font-medium text-neutral-950">{campaign.subject}</div>
                    <div className="mt-1 text-sm text-neutral-500">
                      {campaign.status} • Sent: {campaign.sent_count}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}