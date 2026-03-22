import { NextResponse } from "next/server";
import { products } from "@/data/mock";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").toLowerCase().trim();

  const results = products.filter((product) =>
    product.title.toLowerCase().includes(q)
  );

  return NextResponse.json({
    results,
  });
}