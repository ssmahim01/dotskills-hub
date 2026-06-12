"use client";

import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import type { IProduct } from "@/redux/features/Product/product.api";
import type { POSCartItem, OrderSummary } from "@/types/pos.types";

export function usePOSCart() {
  const [items, setItems] = useState<POSCartItem[]>([]);

  const addToCart = useCallback((product: IProduct) => {
    if (product.stock <= 0) {
      toast.error(`"${product.name}" is out of stock`);
      return;
    }

    setItems((prev) => {
      const existing = prev.find((i) => i.product._id === product._id);

      if (existing) {
        if (existing.quantity >= product.stock) {
          toast.error(`Only ${product.stock} units available`);
          return prev;
        }
        toast.success(`${product.name} qty updated`);
        return prev.map((i) =>
          i.product._id === product._id
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        );
      }

      toast.success(`${product.name} added to cart`);
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product._id !== productId));
    toast.success("Item removed");
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }

      setItems((prev) => {
        const item = prev.find((i) => i.product._id === productId);
        if (!item) return prev;

        if (quantity > item.product.stock) {
          toast.error(`Only ${item.product.stock} units available`);
          return prev;
        }

        return prev.map((i) =>
          i.product._id === productId ? { ...i, quantity } : i,
        );
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, i) =>
          sum +
          ((i.product.discountPrice ?? 0) > 0
            ? i.product.discountPrice
            : i.product.price) *
            i.quantity,
        0,
      ),
    [items],
  );

  function calcSummary(
    discount: number,
    deliveryCharge: number,
    advanceAmount: number,
    taxRate = 0,
  ): OrderSummary {
    const discountCapped = Math.min(discount, subtotal);
    const taxAmount = (subtotal - discountCapped) * (taxRate / 100);
    const totalAmount = Math.max(
      0,
      subtotal - discountCapped + deliveryCharge + taxAmount,
    );
    const dueAmount = Math.max(0, totalAmount - advanceAmount);

    return {
      subtotal,
      discountAmount: discountCapped,
      deliveryCharge,
      advanceAmount,
      taxAmount,
      totalAmount,
      dueAmount,
    };
  }

  return {
    items,
    totalItems,
    subtotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    calcSummary,
  };
}
