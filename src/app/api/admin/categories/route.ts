import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();

    const {
      name,
      slug,
      description,
      seo_title,
      seo_description,
      image_url,
      image_path,
      is_active,
      sort_order,
    } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("categories")
      .insert({
        name,
        slug,
        description,
        seo_title,
        seo_description,
        image_url,
        image_path,
        is_active,
        sort_order,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong while creating the category." },
      { status: 500 }
    );
  }
}