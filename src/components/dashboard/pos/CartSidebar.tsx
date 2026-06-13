"use client";

import React, { useState, useMemo } from "react";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type {
  POSCartItem,
  OrderType,
  PaymentMethod,
  AdvancePayment,
  CustomerFormData,
  CheckoutPayload,
  CartSummaryType,
} from "@/types/pos.types";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { CustomerSection } from "./CustomerSection";
import { PaymentSection } from "./PaymentSection";
import { OrderReviewModal } from "./OrderReviewModal";
import { usePOSCheckout } from "@/lib/hooks/usePosCheckout";
import { ICustomer } from "@/types/customer.types";

interface CartSidebarProps {
  items: POSCartItem[];
  onQuantityChange: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onClearCart: () => void;
  calcSummary: (
    discount: number,
    deliveryCharge: number,
    advanceAmount: number,
    taxRate?: number,
  ) => CartSummaryType;
  totalItems: number;
}

const DEFAULT_CUSTOMER: CustomerFormData = {
  name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  zipCode: "",
};

export function CartSidebar({
  items,
  onQuantityChange,
  onRemove,
  onClearCart,
  calcSummary,
  totalItems,
}: CartSidebarProps) {
  const [orderType, setOrderType] = useState<OrderType>("PICKUP");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [advance, setAdvance] = useState<AdvancePayment>({ amount: 0 });
  const [discount, setDiscount] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [deliveryCharge, setDeliveryCharge] = useState("");
  const [notes, setNotes] = useState("");
  const [customer, setCustomer] = useState<CustomerFormData>(DEFAULT_CUSTOMER);
  const [selectedCustomer, setSelectedCustomer] = useState<ICustomer | null>(
    null,
  );
  const [reviewOpen, setReviewOpen] = useState(false);

  const discountNum = Math.max(0, parseFloat(discount || "0") || 0);
  const deliveryNum = Math.max(0, parseFloat(deliveryCharge || "0") || 0);
  const advanceNum = advance.amount ?? 0;
  const summary = useMemo(
    () => calcSummary(discountNum, deliveryNum, advanceNum),
    [calcSummary, discountNum, deliveryNum, advanceNum],
  );

  const handleDiscountChange = (val: string) => {
    setDiscount(val);
    const n = parseFloat(val);
    if (val && (isNaN(n) || n < 0)) {
      setDiscountError("Enter a valid amount");
    } else if (!isNaN(n) && n > summary.subtotal) {
      setDiscountError("Discount exceeds subtotal");
    } else {
      setDiscountError("");
    }
  };

  const isCustomerValid =
    customer.name.trim() &&
    customer.phone.trim() &&
    (orderType === "PICKUP" || customer.address.trim());

  const canCheckout = items.length > 0 && isCustomerValid && !discountError;

  const { placeOrder, isLoading } = usePOSCheckout(() => {
    setReviewOpen(false);
    onClearCart();
    setCustomer(DEFAULT_CUSTOMER);
    setSelectedCustomer(null);
    setDiscount("");
    setDeliveryCharge("");
    setAdvance({ amount: 0 });
    setNotes("");
  });

  const buildPayload = (): CheckoutPayload => ({
    customer,
    selectedCustomer,
    orderType,
    paymentMethod,
    advance,
    discount: discountNum,
    deliveryCharge: deliveryNum,
    notes,
    summary,
  });

  const handleConfirmOrder = () => placeOrder(items, buildPayload());

  return (
    <>
      <div className="flex h-full flex-col bg-white dark:bg-gray-900 overflow-hidden">
        {/* ── Header ── */}
        <div className="shrink-0 border-b border-gray-200 dark:border-gray-700 px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-50">
              Order
              {totalItems > 0 && (
                <span className="ml-1.5 rounded-full bg-violet-100 dark:bg-violet-900/40 px-2 py-0.5 text-xs font-bold text-violet-700 dark:text-violet-400">
                  {totalItems}
                </span>
              )}
            </h2>
          </div>
          {items.length > 0 && (
            <button
              onClick={onClearCart}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
              aria-label="Clear cart"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>

        {/* ── Scrollable body ── */}
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="px-4 py-3 space-y-3">
            {/* Empty cart */}
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                <ShoppingCart className="w-10 h-10 text-gray-200 dark:text-gray-700" />
                <div>
                  <p className="text-sm font-semibold text-gray-400 dark:text-gray-500">
                    Cart is empty
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">
                    Click a product to add it
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                {items.map((item) => (
                  <CartItem
                    key={item.product._id}
                    item={item}
                    onQuantityChange={(qty) =>
                      onQuantityChange(item.product._id, qty)
                    }
                    onRemove={() => onRemove(item.product._id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Cart summary */}
          {items.length > 0 && (
            <div className="mx-4 mb-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 px-4 py-3">
              <CartSummary summary={summary} />
            </div>
          )}

          <div
            className={cn(
              "px-4 space-y-5 pb-4",
              items.length === 0 && "opacity-50 pointer-events-none",
            )}
          >
            <Separator />

            {/* Customer */}
            <CustomerSection
              form={customer}
              onChange={(partial) =>
                setCustomer((prev) => ({ ...prev, ...partial }))
              }
            />

            <Separator />

            {/* Payment */}
            <PaymentSection
              orderType={orderType}
              onOrderTypeChange={setOrderType}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              advance={advance}
              onAdvanceChange={(partial) =>
                setAdvance((prev) => ({ ...prev, ...partial }))
              }
              discount={discount}
              onDiscountChange={handleDiscountChange}
              discountError={discountError}
              deliveryCharge={deliveryCharge}
              onDeliveryChargeChange={setDeliveryCharge}
              notes={notes}
              onNotesChange={setNotes}
            />
          </div>
        </ScrollArea>

        {/* ── Checkout button ── */}
        <div className="shrink-0 border-t border-gray-200 dark:border-gray-700 p-4">
          <Button
            onClick={() => setReviewOpen(true)}
            disabled={!canCheckout}
            className={cn(
              "w-full rounded-xl py-5 text-sm font-bold transition-all duration-200",
              "bg-violet-600 hover:bg-violet-700 dark:bg-violet-700 dark:hover:bg-violet-600 text-white",
              "active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
            )}
          >
            <span className="flex items-center justify-center gap-2">
              Review & Place Order
              {/* {summary.totalAmount > 0 && (
                <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-bold tabular-nums">
                  ৳{summary.totalAmount.toFixed(2)}
                </span>
              )} */}
            </span>
          </Button>

          {!isCustomerValid && items.length > 0 && (
            <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-2">
              Fill in customer details to continue
            </p>
          )}
        </div>
      </div>

      {/* ── Review Modal ── */}
      <OrderReviewModal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        onConfirm={handleConfirmOrder}
        items={items}
        payload={buildPayload()}
        isLoading={isLoading}
      />
    </>
  );
}
