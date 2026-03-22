"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { cn } from "@/lib/utils/cn";

export default function WishlistButton({ productId }: { productId: string }) {
  const { toggle, isWishlisted } = useWishlist();
  const active = isWishlisted(productId);

  return (
    <button
      type="button"
      onClick={() => toggle(productId)}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "rounded-full border p-2 transition",
        active
          ? "border-red-600 bg-red-50 text-red-600"
          : "border-neutral-200 bg-white text-neutral-900"
      )}
    >
      <Heart className={cn("h-4 w-4", active && "fill-current")} />
    </button>
  );
}