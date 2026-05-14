import { redirect } from "next/navigation";
import CustomerDashboard from "@/components/account/CustomerDashboard";
import { createClient } from "@/lib/supabase/server";

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <CustomerDashboard
      user={{
        id: user.id,
        email: user.email || "",
        fullName:
          String(user.user_metadata?.full_name || "").trim() ||
          user.email ||
          "Customer",
      }}
    />
  );
}