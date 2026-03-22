import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  const { id } = await params;
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
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
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

    const { data: product, error: productError } = await supabase
      .from("products")
      .update({
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
      .eq("id", id)
      .select()
      .single();

    if (productError) {
      return NextResponse.json({ error: productError.message }, { status: 500 });
    }

    const { error: deleteOldImagesError } = await supabase
      .from("product_images")
      .delete()
      .eq("product_id", id);

    if (deleteOldImagesError) {
      return NextResponse.json(
        { error: deleteOldImagesError.message },
        { status: 500 }
      );
    }

    if (images?.length) {
      const imageRows = images.map((img: any, index: number) => ({
        product_id: id,
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
      { error: "Something went wrong while updating the product." },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: existingImages } = await supabase
      .from("product_images")
      .select("image_path")
      .eq("product_id", id);

    if (existingImages?.length) {
      const paths = existingImages
        .map((img) => img.image_path)
        .filter(Boolean) as string[];

      if (paths.length) {
        await supabase.storage.from("product-images").remove(paths);
      }
    }

    await supabase.from("product_images").delete().eq("product_id", id);

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong while deleting the product." },
      { status: 500 }
    );
  }
}