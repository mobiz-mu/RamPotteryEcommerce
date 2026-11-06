import "server-only";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type AdminSession = {
  userId: string;
  email: string;
  name: string;
  role: string;
};

/** Returns the signed-in, active admin (admin_profiles) or null. */
export async function getAdminSession(): Promise<AdminSession | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabaseAdmin
    .from("admin_profiles")
    .select("id, email, full_name, role, is_active")
    .eq("id", user.id)
    .eq("is_active", true)
    .maybeSingle();
  if (!profile) return null;

  return {
    userId: user.id,
    email: user.email ?? profile.email ?? "",
    name: String(profile.full_name || "").trim() || user.email || "Admin",
    role: String(profile.role || "admin"),
  };
}

/** For route handlers: returns the admin or a 401/403 response. */
export async function requireAdminApi(): Promise<
  { ok: true; admin: AdminSession } | { ok: false; response: NextResponse }
> {
  const admin = await getAdminSession();
  if (!admin) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Admin access required." }, { status: 403 }),
    };
  }
  return { ok: true, admin };
}

/** Best-effort audit trail; never blocks the admin action. */
export async function auditLog(
  admin: AdminSession,
  action: string,
  entityType: string,
  entityId: string | null,
  details: Record<string, unknown> = {},
) {
  const { error } = await supabaseAdmin.from("admin_audit_log").insert({
    actor_id: admin.userId,
    actor_email: admin.email,
    action,
    entity_type: entityType,
    entity_id: entityId,
    details,
  });
  if (error && error.code !== "42P01" && error.code !== "PGRST205") {
    console.error("audit log failed", error.message);
  }
}
