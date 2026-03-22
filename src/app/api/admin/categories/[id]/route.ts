import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function PATCH(req: Request, { params }: Props) {
  try {
    const { id } = await params;
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

    const { data, error } = await supabase
      .from("categories")
      .update({
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
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong while updating the category." },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: Props) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: category } = await supabase
      .from("categories")
      .select("image_path")
      .eq("id", id)
      .single();

    if (category?.image_path) {
      await supabase.storage.from("category-images").remove([category.image_path]);
    }

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong while deleting the category." },
      { status: 500 }
    );
  }
}