import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        id,
        order_number,
        status,
        total_amount,
        created_at,
        order_items (
          id,
          product_name,
          quantity,
          unit_price,
          line_total
        )
      `,
      )
      .or(`user_id.eq.${user.id},customer_email.eq.${user.email}`)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ orders: data || [] });
  } catch {
    return NextResponse.json(
      { error: "Could not load orders." },
      { status: 500 },
    );
  }
}