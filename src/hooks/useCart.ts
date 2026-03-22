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

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      setItems(Array.isArray(parsed) ? parsed : []);
    } catch {
      setItems([]);
    } finally {
      setLoaded(true);
    }
  }, []);

  function persist(next: CartItem[]) {
    setItems(next);
    localStorage.setItem(CART_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("cart-updated"));
  }

  function addItem(item: CartItem) {
    const found = items.find((existing) => existing.id === item.id);

    let next: CartItem[];

    if (found) {
      next = items.map((existing) =>
        existing.id === item.id
          ? { ...existing, quantity: existing.quantity + item.quantity }
          : existing
      );
    } else {
      next = [...items, item];
    }

    persist(next);
  }

  function updateQuantity(id: string, quantity: number) {
    const nextQty = Math.max(1, quantity);
    const next = items.map((item) =>
      item.id === id ? { ...item, quantity: nextQty } : item
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
        (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
        0
      ),
    [items]
  );

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    [items]
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