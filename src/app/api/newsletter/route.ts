import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const cleanEmail = String(body?.email || "").toLowerCase().trim();

    if (!cleanEmail) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 },
      );
    }

    if (!isValidEmail(cleanEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    const { data: existingSubscriber, error: existingError } =
      await supabaseAdmin
        .from("newsletter_subscribers")
        .select("id, email, is_active")
        .eq("email", cleanEmail)
        .maybeSingle();

    if (existingError) {
      return NextResponse.json(
        { error: existingError.message },
        { status: 500 },
      );
    }

    if (existingSubscriber) {
      if (!existingSubscriber.is_active) {
        const { error: reactivateError } = await supabaseAdmin
          .from("newsletter_subscribers")
          .update({
            is_active: true,
            source: "website",
            subscribed_at: new Date().toISOString(),
          })
          .eq("id", existingSubscriber.id);

        if (reactivateError) {
          return NextResponse.json(
            { error: reactivateError.message },
            { status: 500 },
          );
        }

        return NextResponse.json(
          {
            message: "Thank you for subscribing to Ram Pottery.",
            alreadySubscribed: false,
          },
          { status: 200 },
        );
      }

      return NextResponse.json(
        {
          message: "You’re already subscribed to Ram Pottery.",
          alreadySubscribed: true,
        },
        { status: 200 },
      );
    }

    const { error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .insert({
        email: cleanEmail,
        source: "website",
        is_active: true,
      });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          {
            message: "You’re already subscribed to Ram Pottery.",
            alreadySubscribed: true,
          },
          { status: 200 },
        );
      }

      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: "Thank you for subscribing to Ram Pottery.",
        alreadySubscribed: false,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);

    return NextResponse.json(
      { error: "Something went wrong while subscribing." },
      { status: 500 },
    );
  }
}