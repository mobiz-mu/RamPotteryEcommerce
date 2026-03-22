import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const cleanEmail = String(email).toLowerCase().trim();

    const { data: existingSubscriber } = await supabase
      .from("newsletter_subscribers")
      .select("id, email")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (existingSubscriber) {
      return NextResponse.json(
        { message: "You’re already subscribed to Ram Pottery.", alreadySubscribed: true },
        { status: 200 }
      );
    }

    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .insert({
        email: cleanEmail,
        source: "website",
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      data,
      message: "Thank you for subscribing to Ram Pottery.",
      alreadySubscribed: false,
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong while subscribing." },
      { status: 500 }
    );
  }
}