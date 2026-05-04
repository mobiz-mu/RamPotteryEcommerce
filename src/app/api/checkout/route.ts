import { NextResponse } from "next/server";
import { checkoutSchema } from "@/lib/utils/validation";
import { supabaseAdmin } from "@/lib/supabase/admin";

type CheckoutBody = {
  customerName: string;
  phone: string;
  email: string;
  address: string;
  area?: string;
  note?: string;
  deliveryMethod?: string;
  items: Array<{
    productId?: string;
    id?: string;
    title?: string;
    name?: string;
    slug?: string;
    image?: string;
    price: number;
    quantity: number;
  }>;
};

function createOrderNo() {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `RP-${new Date().getFullYear()}-${random}`;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CheckoutBody;

    const parsed = checkoutSchema.safeParse({
      customerName: body.customerName,
      phone: body.phone,
      email: body.email,
      address: body.address,
      area: body.area || "",
      note: body.note || "",
    });

    if (!parsed.success) {
      console.error("Checkout validation error:", parsed.error.flatten());

      return NextResponse.json(
        { error: "Invalid checkout details." },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty." },
        { status: 400 }
      );
    }

    const cleanItems = body.items.map((item) => {
      const price = Number(item.price || 0);
      const quantity = Number(item.quantity || 1);

      return {
        productId: item.productId || item.id || null,
        title: item.title || item.name || "Ram Pottery Product",
        price,
        quantity,
        lineTotal: price * quantity,
      };
    });

    const subtotal = cleanItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const deliveryFee = subtotal > 0 ? 200 : 0;
    const total = subtotal + deliveryFee;
    const orderNo = createOrderNo();

    const { data: order, error: orderError } = await supabaseAdmin
        .from("orders")
        .insert({
         order_number: orderNo,
         customer_name: parsed.data.customerName,
         customer_phone: parsed.data.phone,
         customer_email: parsed.data.email,
         address: parsed.data.address,
         area: parsed.data.area || null,
         subtotal,
         delivery_fee: deliveryFee,
         total_amount: total,
         status: "Pending",
         whatsapp_sent: false,
     })
        .select("id")
        .single();


    if (orderError || !order) {
      console.error("Supabase order insert error:", orderError);

      return NextResponse.json(
        { error: orderError?.message || "Failed to save order." },
        { status: 500 }
      );
    }

    const itemsPayload = cleanItems.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.title,
      quantity: item.quantity,
      unit_price: item.price,
      line_total: item.lineTotal,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(itemsPayload);

    if (itemsError) {
      console.error("Supabase order_items insert error:", itemsError);

      return NextResponse.json(
        { error: itemsError.message || "Failed to save order items." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orderNo,
      subtotal,
      deliveryFee,
      total,
      message: "Order created successfully.",
   });
  } catch (error) {
    console.error("Checkout route fatal error:", error);

    return NextResponse.json(
      { error: "Something went wrong while creating the order." },
      { status: 500 }
    );
  }
}