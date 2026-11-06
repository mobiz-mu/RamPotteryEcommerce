import { requireAdminApi } from "@/lib/admin/session";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;
  const { data, error } = await supabaseAdmin
    .from("blogs")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch blogs." }, { status: 500 });
  }

  return NextResponse.json({ blogs: data || [] });
}

export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;
  try {
    const body = await req.json();

    const { data, error } = await supabaseAdmin
      .from("blogs")
      .insert({
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt || null,
        content: body.content || null,
        featured_image_url: body.featuredImageUrl || null,
        author: body.author || "Ram Pottery",
        published_at: body.publishedAt || new Date().toISOString(),
        active: body.active !== false,
        seo_title: body.seoTitle || null,
        seo_description: body.seoDescription || null,
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to create blog." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, blog: data });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}