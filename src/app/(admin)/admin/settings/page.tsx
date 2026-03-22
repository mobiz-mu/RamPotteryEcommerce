import AdminSettingsClient from "@/components/admin/AdminSettingsClient";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const admin = createAdminClient();

  const [{ data: settings }, usersResponse] = await Promise.all([
    supabase.from("store_settings").select("*").limit(1).maybeSingle(),
    admin.auth.admin.listUsers(),
  ]);

  const users =
    usersResponse.data?.users?.map((user) => ({
      id: user.id,
      email: user.email ?? "",
      created_at: user.created_at ?? "",
      last_sign_in_at: user.last_sign_in_at ?? "",
      email_confirmed_at: user.email_confirmed_at ?? "",
      banned_until: user.banned_until ?? null,
      is_disabled: !!user.banned_until,
    })) ?? [];

  return (
    <AdminSettingsClient
      initialSettings={settings}
      initialUsers={users}
    />
  );
}