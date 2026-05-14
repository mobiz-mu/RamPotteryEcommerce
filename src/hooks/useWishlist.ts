"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "ram-pottery-wishlist";
const WISHLIST_UPDATED_EVENT = "ram-pottery-wishlist-updated";

function notifyWishlistUpdated() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(WISHLIST_UPDATED_EVENT));
}

function readWishlist(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function writeWishlist(items: string[]) {
  if (typeof window === "undefined") return;

  const uniqueItems = Array.from(new Set(items.map(String)));

  if (uniqueItems.length > 0) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(uniqueItems));
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }

  notifyWishlistUpdated();
}

export function useWishlist() {
  const [items, setItems] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setItems(readWishlist());
    setLoaded(true);

    function syncWishlist() {
      setItems(readWishlist());
    }

    window.addEventListener("storage", syncWishlist);
    window.addEventListener(WISHLIST_UPDATED_EVENT, syncWishlist);

    return () => {
      window.removeEventListener("storage", syncWishlist);
      window.removeEventListener(WISHLIST_UPDATED_EVENT, syncWishlist);
    };
  }, []);

  function addItem(productId: string) {
    const current = readWishlist();
    const next = Array.from(new Set([...current, String(productId)]));

    setItems(next);
    writeWishlist(next);
  }

  function removeItem(productId: string) {
    const current = readWishlist();
    const next = current.filter((id) => id !== String(productId));

    setItems(next);
    writeWishlist(next);
  }

  function toggleItem(productId: string) {
    const current = readWishlist();

    if (current.includes(String(productId))) {
      removeItem(productId);
      return;
    }

    addItem(productId);
  }

  function clearWishlist() {
    setItems([]);
    writeWishlist([]);
  }

  function isWishlisted(productId: string) {
    return items.includes(String(productId));
  }

  return {
    items,
    loaded,

    // New names used by the premium wishlist page
    addItem,
    removeItem,
    toggleItem,
    clearWishlist,
    isWishlisted,

    // Backward-compatible name for existing ProductCard code
    toggle: toggleItem,
  };
}