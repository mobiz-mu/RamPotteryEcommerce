import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();

    const { id, status, whatsapp_sent } = body;

    if (!id) {
      return NextResponse.json({ error: "Order id is required." }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};

    if (status !== undefined) updateData.status = status;
    if (whatsapp_sent !== undefined) updateData.whatsapp_sent = whatsapp_sent;

    const { data, error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong while updating the order." },
      { status: 500 }
    );
  }
}