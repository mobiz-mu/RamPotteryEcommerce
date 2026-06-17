import AdminSettingsClient from "@/components/admin/AdminSettingsClient";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const admin = createAdminClient();

  const [{ data: settings }, { data: adminProfiles }, usersResponse] =
    await Promise.all([
      supabase.from("store_settings").select("*").limit(1).maybeSingle(),
      supabase
        .from("admin_profiles")
        .select("id, email, full_name, role, is_active, created_at, updated_at")
        .order("created_at", { ascending: false }),
      admin.auth.admin.listUsers(),
    ]);

  const profiles = adminProfiles ?? [];

  const users =
    usersResponse.data?.users?.map((user) => {
      const profile = profiles.find((item) => item.id === user.id);

      return {
        id: user.id,
        email: user.email ?? profile?.email ?? "",
        fullName:
          profile?.full_name ||
          String(user.user_metadata?.full_name || "").trim() ||
          "Admin User",
        role: profile?.role || String(user.app_metadata?.role || "admin"),
        isActive: profile?.is_active ?? !user.banned_until,
        createdAt: user.created_at ?? profile?.created_at ?? "",
        lastSignInAt: user.last_sign_in_at ?? "",
        emailConfirmedAt: user.email_confirmed_at ?? "",
      };
    }) ?? [];

  return <AdminSettingsClient initialSettings={settings} initialUsers={users} />;
}