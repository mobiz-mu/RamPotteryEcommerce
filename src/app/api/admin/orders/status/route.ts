import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const allowedStatuses = ["pending", "confirmed", "delivered"];

export async function PATCH(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Not authenticated." },
        { status: 401 },
      );
    }

    const { data: adminProfile } = await supabaseAdmin
      .from("admin_profiles")
      .select("id, role, is_active")
      .eq("id", user.id)
      .eq("is_active", true)
      .maybeSingle();

    if (!adminProfile) {
      return NextResponse.json(
        { error: "Admin access required." },
        { status: 403 },
      );
    }

    const body = await req.json();

    const orderId = String(body?.orderId || "").trim();
    const status = String(body?.status || "").trim().toLowerCase();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required." },
        { status: 400 },
      );
    }

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid order status." },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({
        status,
      })
      .eq("id", orderId)
      .select("id, status")
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Order status updated.",
      order: data,
    });
  } catch {
    return NextResponse.json(
      { error: "Could not update order status." },
      { status: 500 },
    );
  }
}