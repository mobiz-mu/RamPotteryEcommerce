"use client";

import { useEffect, useMemo, useState } from "react";

export type CartItem = {
  id: string;
  title: string;
  slug: string;
  price: number;
  quantity: number;
  image?: string;
};

const CART_KEY = "ram-pottery-cart";
const CART_UPDATED_EVENT = "ram-pottery-cart-updated";

function notifyCartUpdated() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
}

function readCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCartToStorage(next: CartItem[]) {
  if (typeof window === "undefined") return;

  if (next.length > 0) {
    window.localStorage.setItem(CART_KEY, JSON.stringify(next));
  } else {
    window.localStorage.removeItem(CART_KEY);
  }

  notifyCartUpdated();
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setItems(readCartFromStorage());
    setLoaded(true);

    function syncCart() {
      setItems(readCartFromStorage());
    }

    window.addEventListener(CART_UPDATED_EVENT, syncCart);
    window.addEventListener("storage", syncCart);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, []);

  function persist(next: CartItem[]) {
    setItems(next);
    writeCartToStorage(next);
  }

  function addItem(item: CartItem) {
    const cleanQuantity = Math.max(1, Number(item.quantity || 1));

    const found = items.find((existing) => existing.id === item.id);

    let next: CartItem[];

    if (found) {
      next = items.map((existing) =>
        existing.id === item.id
          ? {
              ...existing,
              quantity: Number(existing.quantity || 0) + cleanQuantity,
            }
          : existing,
      );
    } else {
      next = [
        ...items,
        {
          ...item,
          quantity: cleanQuantity,
        },
      ];
    }

    persist(next);
  }

  function updateQuantity(id: string, quantity: number) {
    const nextQty = Number(quantity || 0);

    if (nextQty <= 0) {
      removeItem(id);
      return;
    }

    const next = items.map((item) =>
      item.id === id ? { ...item, quantity: nextQty } : item,
    );

    persist(next);
  }

  function removeItem(id: string) {
    const next = items.filter((item) => item.id !== id);
    persist(next);
  }

  function clearCart() {
    persist([]);
  }

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + Number(item.price || 0) * Number(item.quantity || 0),
        0,
      ),
    [items],
  );

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    [items],
  );

  return {
    items,
    loaded,
    subtotal,
    totalItems,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };
}