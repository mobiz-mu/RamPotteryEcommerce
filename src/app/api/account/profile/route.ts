import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

function clean(value: unknown) {
  return String(value || "").trim();
}

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const { data: existingProfile, error: profileError } = await supabase
      .from("customer_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 },
      );
    }

    if (existingProfile) {
      return NextResponse.json({ profile: existingProfile });
    }

    const { data: createdProfile, error: createError } = await supabase
      .from("customer_profiles")
      .insert({
        user_id: user.id,
        full_name: user.user_metadata?.full_name || "",
        email: user.email || "",
        shipping_country: "Mauritius",
      })
      .select("*")
      .single();

    if (createError) {
      return NextResponse.json(
        { error: createError.message },
        { status: 400 },
      );
    }

    return NextResponse.json({ profile: createdProfile });
  } catch {
    return NextResponse.json(
      { error: "Could not load profile." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const body = await request.json();

    const payload = {
      user_id: user.id,
      full_name:
        clean(body.full_name) ||
        user.user_metadata?.full_name ||
        user.email ||
        "Customer",
      email: user.email || clean(body.email),
      phone: clean(body.phone),
      shipping_full_name: clean(body.shipping_full_name),
      shipping_phone: clean(body.shipping_phone),
      shipping_address_line_1: clean(body.shipping_address_line_1),
      shipping_address_line_2: clean(body.shipping_address_line_2),
      shipping_city: clean(body.shipping_city),
      shipping_postcode: clean(body.shipping_postcode),
      shipping_country: clean(body.shipping_country) || "Mauritius",
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("customer_profiles")
      .upsert(payload, { onConflict: "user_id" })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ profile: data });
  } catch {
    return NextResponse.json(
      { error: "Could not update profile." },
      { status: 500 },
    );
  }
}