type CheckoutItem = {
  name: string;
  quantity: number;
  price: number;
};

type BuildWhatsAppOrderMessageArgs = {
  orderNo: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  area?: string;
  note?: string;
  items: CheckoutItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
};

export function buildWhatsAppOrderMessage({
  orderNo,
  customerName,
  phone,
  email,
  address,
  area,
  note,
  items,
  subtotal,
  deliveryFee,
  total,
}: BuildWhatsAppOrderMessageArgs) {
  const lines = [
    "Hello Ram Pottery,",
    "",
    "I would like to place this order:",
    "",
    `Order No: ${orderNo}`,
    `Name: ${customerName}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    `Address: ${address}`,
    area ? `Area: ${area}` : "",
    "",
    "Products:",
    ...items.map(
      (item, index) =>
        `${index + 1}. ${item.name} x ${item.quantity} - Rs. ${(
          item.price * item.quantity
        ).toFixed(2)}`
    ),
    "",
    `Subtotal: Rs. ${subtotal.toFixed(2)}`,
    `Delivery: Rs. ${deliveryFee.toFixed(2)}`,
    `Total: Rs. ${total.toFixed(2)}`,
    note ? `Additional Note: ${note}` : "",
  ].filter(Boolean);

  return lines.join("\n");
}

export function getWhatsAppCheckoutLink(message: string) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "23057788884";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}