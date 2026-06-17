import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

function clean(value: unknown) {
  return String(value || "").trim();
}

function numberValue(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

async function verifyAdmin() {
  const supabase = await createClient();
  const admin = createAdminClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { error: "Not authenticated.", status: 401 };
  }

  const { data: adminProfile } = await admin
    .from("admin_profiles")
    .select("id, is_active")
    .eq("id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (!adminProfile) {
    return { error: "Admin access required.", status: 403 };
  }

  return { user, admin };
}

export async function PATCH(req: Request) {
  try {
    const verified = await verifyAdmin();

    if ("error" in verified) {
      return NextResponse.json(
        { error: verified.error },
        { status: verified.status },
      );
    }

    const body = await req.json();

    const payload = {
      store_name: clean(body.store_name) || "Ram Pottery Ltd",
      support_email: clean(body.support_email),
      support_phone: clean(body.support_phone),
      whatsapp_number: clean(body.whatsapp_number),
      address: clean(body.address),
      free_delivery_minimum: numberValue(body.free_delivery_minimum, 3000),
      standard_delivery_fee: numberValue(body.standard_delivery_fee, 150),
      updated_at: new Date().toISOString(),
    };

    const settingId = clean(body.id);

    if (settingId) {
      const { data, error } = await verified.admin
        .from("store_settings")
        .update(payload)
        .eq("id", settingId)
        .select("*")
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ settings: data });
    }

    const { data: existing } = await verified.admin
      .from("store_settings")
      .select("id")
      .limit(1)
      .maybeSingle();

    if (existing?.id) {
      const { data, error } = await verified.admin
        .from("store_settings")
        .update(payload)
        .eq("id", existing.id)
        .select("*")
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ settings: data });
    }

    const { data, error } = await verified.admin
      .from("store_settings")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ settings: data });
  } catch {
    return NextResponse.json(
      { error: "Could not save store settings." },
      { status: 500 },
    );
  }
}