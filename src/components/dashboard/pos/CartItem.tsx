"use client";

import React from "react";
import Image from "next/image";
import { X, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { POSCartItem } from "@/types/pos.types";

interface CartItemProps {
  item: POSCartItem;
  onQuantityChange: (qty: number) => void;
  onRemove: () => void;
}

export function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
  const { product, quantity } = item;
  const unitPrice =
    product.discountPrice > 0 ? product.discountPrice : product.price;
  const lineTotal = unitPrice * quantity;
  const isMaxStock = quantity >= product.stock;

  return (
    <div className="flex gap-3 rounded-xl border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 p-3">
      {/* Thumbnail */}
      {product.images?.[0] && (
        <div className="relative w-14 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="56px"
            className="object-cover"
            priority
            quality={80}
          />
        </div>
      )}

      <div className="flex flex-1 min-w-0 flex-col gap-1.5">
        {/* Name + remove */}
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-semibold leading-snug text-gray-900 dark:text-gray-100 line-clamp-2">
            {product.name}
          </p>
          <Button
            size="icon"
            variant="ghost"
            className="h-5 w-5 shrink-0 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            onClick={onRemove}
            aria-label="Remove"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>

        {/* Unit price */}
        <p className="text-[11px] tabular-nums text-gray-400 dark:text-gray-500">
          ৳{unitPrice.toLocaleString()} each
        </p>

        {/* Qty controls + line total */}
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <div className="flex items-center gap-1 rounded-lg bg-gray-100 dark:bg-gray-800 p-0.5">
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              onClick={() => onQuantityChange(quantity - 1)}
              aria-label="Decrease"
            >
              <Minus className="w-3 h-3" />
            </Button>
            <span className="w-7 text-center text-xs font-bold tabular-nums text-gray-900 dark:text-gray-100">
              {quantity}
            </span>
            <Button
              size="icon"
              variant="ghost"
              disabled={isMaxStock}
              className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-40"
              onClick={() => onQuantityChange(quantity + 1)}
              aria-label="Increase"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
          <span className="text-sm font-bold tabular-nums text-gray-900 dark:text-gray-100">
            ৳{lineTotal.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
