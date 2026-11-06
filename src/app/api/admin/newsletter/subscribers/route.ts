import { requireAdminApi } from "@/lib/admin/session";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("subscribed_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;
  try {
    const supabase = await createClient();
    const body = await req.json();
    const { email, source } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .upsert(
        {
          email: String(email).toLowerCase().trim(),
          source: source || "website",
          is_active: true,
        },
        { onConflict: "email" }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong while saving the subscriber." },
      { status: 500 }
    );
  }
}