import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      product_images (
        id,
        image_path,
        image_url,
        alt_text,
        sort_order,
        is_primary
      )
    `)
    .order("created_at", { ascending: false });

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
      title,
      slug,
      short_description,
      description,
      seo_title,
      seo_description,
      price,
      compare_at_price,
      badge,
      category_id,
      stock_qty,
      is_active,
      is_in_stock,
      images,
    } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { error: "Title and slug are required." },
        { status: 400 }
      );
    }

    const { data: product, error: productError } = await supabase
      .from("products")
      .insert({
        title,
        slug,
        short_description,
        description,
        seo_title,
        seo_description,
        price,
        compare_at_price,
        badge,
        category_id,
        stock_qty,
        is_active,
        is_in_stock,
      })
      .select()
      .single();

    if (productError) {
      return NextResponse.json({ error: productError.message }, { status: 500 });
    }

    if (images?.length) {
      const imageRows = images.map((img: any, index: number) => ({
        product_id: product.id,
        image_path: img.image_path,
        image_url: img.image_url,
        alt_text: img.alt_text,
        sort_order: img.sort_order ?? index,
        is_primary: !!img.is_primary,
      }));

      const { error: imageError } = await supabase
        .from("product_images")
        .insert(imageRows);

      if (imageError) {
        return NextResponse.json({ error: imageError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ data: product });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong while creating the product." },
      { status: 500 }
    );
  }
}