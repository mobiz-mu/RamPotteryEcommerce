import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        categories (
          id,
          name,
          slug
        ),
        product_images (
          id,
          image_url,
          alt_text,
          sort_order,
          is_primary
        )
      `,
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ products: data || [] });
  } catch {
    return NextResponse.json(
      { error: "Could not load products." },
      { status: 500 },
    );
  }
}