import { redirect } from "next/navigation";
import PageHero from "@/components/common/PageHero";
import { createClient } from "@/lib/supabase/server";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <>
      <PageHero
        eyebrow="My Account"
        title="Customer Dashboard"
        description="Manage your account details, wishlist, and future order history."
      />

      <section className="section-space bg-white">
        <div className="container-padded">
          <div className="rounded-3xl border border-neutral-200 bg-white p-8">
            <h2 className="text-2xl font-semibold text-neutral-950">
              Welcome, {user.user_metadata?.full_name || user.email}
            </h2>
            <p className="mt-4 text-neutral-600">
              Logged in as: {user.email}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}