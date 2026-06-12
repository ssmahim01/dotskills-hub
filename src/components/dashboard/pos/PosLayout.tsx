"use client";

import React, { useState } from "react";
import { ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePOSCart } from "@/lib/hooks/usePOSCart";
import { ProductGrid } from "./ProductGrid";
import { CartSidebar } from "./CartSidebar";
import { POSAnalyticsBar } from "./PosAnalyticsBar";

export function POSLayout() {
  const [mobileCartOpen, setMobileCartOpen] = useState(false);

  const {
    items,
    totalItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    calcSummary,
  } = usePOSCart();

  const CartPanel = (
    <CartSidebar
      items={items}
      totalItems={totalItems}
      onQuantityChange={updateQuantity}
      onRemove={removeFromCart}
      onClearCart={clearCart}
      calcSummary={calcSummary}
    />
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <div className="shrink-0  px-5 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                Point of Sale
              </h1>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                Select products to build an order
              </p>
            </div>

            {/* Mobile cart toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMobileCartOpen(true)}
              className="relative gap-2 lg:hidden border-gray-200 dark:border-gray-700"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="text-sm font-medium">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Button>
          </div>

          {/* Analytics */}
          <POSAnalyticsBar />
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-hidden px-5 pt-4 pb-2">
          <ProductGrid cartItems={items} onAddToCart={addToCart} />
        </div>
      </div>

      <div className="hidden lg:flex w-95 xl:w-105 shrink-0 border-l border-gray-200 dark:border-gray-800 overflow-hidden">
        {CartPanel}
      </div>

      {mobileCartOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileCartOpen(false)}
          aria-hidden
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full max-w-sm flex flex-col",
          "bg-white dark:bg-gray-900 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden",
          mobileCartOpen ? "translate-x-0" : "translate-x-full",
        )}
        aria-label="Cart drawer"
      >
        {/* Drawer header */}
        <div className="shrink-0 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
            Cart
          </span>
          <button
            onClick={() => setMobileCartOpen(false)}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden">{CartPanel}</div>
      </div>
    </div>
  );
}
