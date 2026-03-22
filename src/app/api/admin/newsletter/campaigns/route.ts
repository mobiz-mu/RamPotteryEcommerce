import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();

    const { subject, preview_text, content, subscriber_ids } = body;

    if (!subject || !content) {
      return NextResponse.json(
        { error: "Subject and content are required." },
        { status: 400 }
      );
    }

    const { data: campaign, error: campaignError } = await supabase
      .from("newsletter_campaigns")
      .insert({
        subject,
        preview_text,
        content,
        status: "draft",
        sent_count: 0,
      })
      .select()
      .single();

    if (campaignError) {
      return NextResponse.json({ error: campaignError.message }, { status: 500 });
    }

    if (subscriber_ids?.length) {
      const { data: subscribers, error: subscriberError } = await supabase
        .from("newsletter_subscribers")
        .select("id, email")
        .in("id", subscriber_ids);

      if (subscriberError) {
        return NextResponse.json({ error: subscriberError.message }, { status: 500 });
      }

      const recipients =
        subscribers?.map((subscriber) => ({
          campaign_id: campaign.id,
          subscriber_id: subscriber.id,
          email: subscriber.email,
        })) ?? [];

      if (recipients.length) {
        const { error: recipientsError } = await supabase
          .from("newsletter_campaign_recipients")
          .insert(recipients);

        if (recipientsError) {
          return NextResponse.json(
            { error: recipientsError.message },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json({ data: campaign });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong while creating the campaign." },
      { status: 500 }
    );
  }
}