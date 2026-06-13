"use client";

import React from "react";
import { CheckCircle2, Loader2, ShoppingBag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { POSCartItem, CheckoutPayload } from "@/types/pos.types";
import { PAYMENT_METHODS } from "@/lib/constants/pos.constants";

interface OrderReviewModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  items: POSCartItem[];
  payload: CheckoutPayload;
  isLoading: boolean;
}

const fmt = (n: number) =>
  `৳${n.toLocaleString("en-BD", { minimumFractionDigits: 2 })}`;

export function OrderReviewModal({
  open,
  onClose,
  onConfirm,
  items,
  payload,
  isLoading,
}: OrderReviewModalProps) {
  const paymentLabel =
    PAYMENT_METHODS.find((m) => m.value === payload.paymentMethod)?.label ??
    payload.paymentMethod;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <ShoppingBag className="w-5 h-5 text-violet-600" />
            Review & Confirm Order
          </DialogTitle>
          <DialogDescription>
            Please review the order details before confirming.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Items */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
              Items ({items.length})
            </p>
            <div className="space-y-1.5">
              {items.map((item) => {
                const unitPrice =
                  item.product.discountPrice > 0
                    ? item.product.discountPrice
                    : item.product.price;
                return (
                  <div
                    key={item.product._id}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-gray-700 dark:text-gray-300 truncate max-w-50">
                      {item.product.name}
                      <span className="text-gray-400 ml-1">×{item.quantity}</span>
                    </span>
                    <span className="font-medium tabular-nums text-gray-900 dark:text-gray-100 shrink-0">
                      {fmt(unitPrice * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Customer */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
              Customer
            </p>
            <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <p className="font-semibold">{payload.customer.name}</p>
              <p>{payload.customer.phone}</p>
              {payload.customer.email && <p>{payload.customer.email}</p>}
              {payload.orderType === "DELIVERY" && payload.customer.address && (
                <p className="text-gray-500">{payload.customer.address}</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Summary */}
          <div className="space-y-1.5 text-sm">
            <SummaryRow label="Subtotal" value={fmt(payload.summary.subtotal)} />
            {payload.summary.discountAmount > 0 && (
              <SummaryRow
                label="Discount"
                value={`-${fmt(payload.summary.discountAmount)}`}
                valueClass="text-emerald-600 dark:text-emerald-400"
              />
            )}
            {payload.summary.deliveryCharge > 0 && (
              <SummaryRow label="Delivery" value={fmt(payload.summary.deliveryCharge)} />
            )}
            {payload.summary.taxAmount > 0 && (
              <SummaryRow label="Tax" value={fmt(payload.summary.taxAmount)} />
            )}
            <Separator />
            <SummaryRow
              label="Total"
              value={fmt(payload.summary.totalAmount)}
              labelClass="font-bold text-gray-900 dark:text-gray-100"
              valueClass="font-bold text-violet-600 dark:text-violet-400 text-base"
            />
            {payload.advance.amount > 0 && (
              <SummaryRow
                label="Advance"
                value={`-${fmt(payload.advance.amount)}`}
                valueClass="text-blue-600 dark:text-blue-400"
              />
            )}
            {payload.advance.amount > 0 && (
              <SummaryRow
                label="Due"
                value={fmt(payload.summary.dueAmount)}
                valueClass="font-bold text-rose-600 dark:text-rose-400"
              />
            )}
          </div>

          {/* Meta */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl px-4 py-3 space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
            <MetaRow label="Order Type" value={payload.orderType} />
            <MetaRow label="Payment" value={paymentLabel} />
            {/* <MetaRow label="Schedule" value={payload.schedule.type} />
            {payload.schedule.type === "SCHEDULED" && payload.schedule.scheduledAt && (
              <MetaRow
                label="Scheduled At"
                value={new Date(payload.schedule.scheduledAt).toLocaleString()}
              />
            )} */}
          </div>
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Back
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="gap-2 text-white bg-violet-600 hover:bg-violet-700 dark:bg-violet-700 dark:hover:bg-violet-600 min-w-36"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Placing…
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Place Order
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SummaryRow({
  label,
  value,
  labelClass,
  valueClass,
}: {
  label: string;
  value: string;
  labelClass?: string;
  valueClass?: string;
}) {
  return (
    <div className="flex justify-between">
      <span className={labelClass ?? "text-gray-500 dark:text-gray-400"}>{label}</span>
      <span className={`tabular-nums ${valueClass ?? "text-gray-900 dark:text-gray-100"}`}>
        {value}
      </span>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
        {value.toLowerCase()}
      </span>
    </div>
  );
}