"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "ram-pottery-wishlist";

function readWishlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeWishlist(items: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("ram-pottery-wishlist-updated"));
}

export function useWishlist() {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    setItems(readWishlist());

    const sync = () => setItems(readWishlist());
    window.addEventListener("storage", sync);
    window.addEventListener("ram-pottery-wishlist-updated", sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("ram-pottery-wishlist-updated", sync);
    };
  }, []);

  function toggle(productId: string) {
    const current = readWishlist();
    const exists = current.includes(productId);
    const next = exists
      ? current.filter((id) => id !== productId)
      : [...current, productId];

    writeWishlist(next);
    setItems(next);
  }

  function isWishlisted(productId: string) {
    return items.includes(productId);
  }

  return {
    items,
    toggle,
    isWishlisted,
  };
}