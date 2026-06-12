"use client";

import React from "react";
import Image from "next/image";
import { Plus, PackageX, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IProduct } from "@/redux/features/Product/product.api";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants/pos.constants";

interface ProductCardProps {
  product: IProduct;
  cartQty: number;
  onAdd: () => void;
}

export function ProductCard({ product, cartQty, onAdd }: ProductCardProps) {
  const isOutOfStock = product.stock <= 0;
  const isLowStock =
    !isOutOfStock && product.stock <= (product.lowStockThreshold ?? LOW_STOCK_THRESHOLD);
  const isMaxed = cartQty >= product.stock;

  const displayPrice =
    product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const disabled = isOutOfStock || isMaxed;

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={`Add ${product.name} to cart`}
      aria-disabled={disabled}
      onClick={() => !disabled && onAdd()}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !disabled) onAdd();
      }}
      className={cn(
        "group relative flex items-stretch rounded-xl border bg-white dark:bg-gray-900 overflow-hidden select-none transition-all duration-200",
        disabled
          ? "opacity-55 cursor-not-allowed border-gray-200 dark:border-gray-800"
          : [
              "cursor-pointer border-gray-200 dark:border-gray-700/60",
              "hover:border-violet-400 dark:hover:border-violet-500",
              "dark:hover:shadow-[0_0_0_1.5px_var(--color-violet-500)]",
              "active:scale-[0.993] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-1",
            ],
      )}
    >
      {/* Image */}
      <div className="relative w-20 sm:w-24 shrink-0 bg-gray-100 dark:bg-gray-800 rounded-l-xl overflow-hidden">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="96px"
            className={cn(
              "object-cover transition-transform duration-300",
              !disabled && "group-hover:scale-105",
            )}
            priority
            quality={80}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <PackageX className="w-6 h-6 text-gray-400 dark:text-gray-600" />
          </div>
        )}

        {/* Discount badge */}
        {hasDiscount && (
          <span className="absolute top-1 left-1 rounded-md bg-rose-500 px-1.5 py-0.5 text-[9px] font-bold text-white leading-none">
            -{discountPct}%
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 min-w-0 flex-col justify-center gap-1 px-3 py-2.5">
        <p className="text-sm font-semibold leading-snug text-gray-900 dark:text-gray-50 line-clamp-2">
          {product.name}
        </p>

        {product.sku && (
          <p className="text-[10px] font-mono text-gray-400 dark:text-gray-500">
            {product.sku}
          </p>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          {/* Stock indicator */}
          {isOutOfStock ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 dark:bg-red-900/30 px-2 py-0.5 text-[10px] font-semibold text-red-700 dark:text-red-400">
              Out of stock
            </span>
          ) : isLowStock ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-400">
              <AlertTriangle className="w-2.5 h-2.5" />
              {product.stock} left
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
              {product.stock} in stock
            </span>
          )}

          {cartQty > 0 && (
            <span className="inline-flex items-center rounded-full bg-violet-100 dark:bg-violet-900/30 px-2 py-0.5 text-[10px] font-semibold text-violet-700 dark:text-violet-400">
              {cartQty} in cart
            </span>
          )}
        </div>
      </div>

      {/* Price + Add button */}
      <div className="flex shrink-0 flex-col items-end justify-center gap-2 pr-3">
        <div className="text-right">
          <p className="text-sm font-bold tabular-nums text-gray-900 dark:text-gray-50">
            ৳{displayPrice.toLocaleString()}
          </p>
          {hasDiscount && (
            <p className="text-[10px] tabular-nums text-gray-400 line-through">
              ৳{product.price.toLocaleString()}
            </p>
          )}
        </div>

        {!disabled && (
          <div
            aria-hidden
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-full",
              "border border-violet-300 bg-violet-50 text-violet-600",
              "dark:border-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
              "opacity-0 scale-75 transition-all duration-200",
              "group-hover:opacity-100 group-hover:scale-100",
            )}
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
          </div>
        )}
      </div>
    </div>
  );
}