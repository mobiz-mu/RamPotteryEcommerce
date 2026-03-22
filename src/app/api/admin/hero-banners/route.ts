import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("hero_banners")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch hero banners." }, { status: 500 });
  }

  return NextResponse.json({ banners: data || [] });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { data, error } = await supabaseAdmin
      .from("hero_banners")
      .insert({
        title: body.title || null,
        subtitle: body.subtitle || null,
        cta_label: body.ctaLabel || null,
        cta_link: body.ctaLink || null,
        secondary_cta_label: body.secondaryCtaLabel || null,
        secondary_cta_link: body.secondaryCtaLink || null,
        desktop_image_url: body.desktopImageUrl || null,
        mobile_image_url: body.mobileImageUrl || null,
        text_align: body.textAlign || "left",
        overlay_opacity: Number(body.overlayOpacity || 25),
        active: body.active !== false,
        sort_order: Number(body.sortOrder || 0),
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to create hero banner." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, banner: data });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}