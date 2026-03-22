import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdminUser } from "@/lib/admin/require-admin";

export async function GET() {
  const authCheck = await requireAdminUser();
  if (!authCheck.ok) return authCheck.response;

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("store_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { error: "Unable to load settings." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  const authCheck = await requireAdminUser();
  if (!authCheck.ok) return authCheck.response;

  try {
    const supabase = await createClient();
    const body = await req.json();

    const { data: existing } = await supabase
      .from("store_settings")
      .select("id")
      .limit(1)
      .maybeSingle();

    if (!existing?.id) {
      const { data, error } = await supabase
        .from("store_settings")
        .insert(body)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ data });
    }

    const { data, error } = await supabase
      .from("store_settings")
      .update(body)
      .eq("id", existing.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { error: "Unable to save settings." },
      { status: 500 }
    );
  }
}