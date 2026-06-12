"use client";

import React from "react";
import { Tag, X, Truck, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type {
  OrderType,
  PaymentMethod,
  AdvancePayment,
  ScheduleConfig,
} from "@/types/pos.types";
import {
  PAYMENT_METHODS,
  ADVANCE_PAYMENT_METHODS,
  DEFAULT_ORDER_NOTES,
} from "@/lib/constants/pos.constants"

interface PaymentSectionProps {
  orderType: OrderType;
  onOrderTypeChange: (t: OrderType) => void;
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (m: PaymentMethod) => void;
  advance: AdvancePayment;
  onAdvanceChange: (a: Partial<AdvancePayment>) => void;
  discount: string;
  onDiscountChange: (v: string) => void;
  discountError: string;
  deliveryCharge: string;
  onDeliveryChargeChange: (v: string) => void;
  notes: string;
  onNotesChange: (v: string) => void;
  schedule: ScheduleConfig;
  onScheduleChange: (s: ScheduleConfig) => void;
}

const inputCls =
  "text-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:border-violet-400 dark:focus:border-violet-500 transition-colors rounded-lg";

export function PaymentSection({
  orderType,
  onOrderTypeChange,
  paymentMethod,
  onPaymentMethodChange,
  advance,
  onAdvanceChange,
  discount,
  onDiscountChange,
  discountError,
  deliveryCharge,
  onDeliveryChargeChange,
  notes,
  onNotesChange,
  schedule,
  onScheduleChange,
}: PaymentSectionProps) {
  return (
    <div className="space-y-5">

      {/* ── Order Type ── */}
      <div className="space-y-2">
        <SectionLabel>Order Type</SectionLabel>
        <div className="grid grid-cols-2 gap-2">
          {(["PICKUP", "DELIVERY"] as const).map((t) => (
            <button
              key={t}
              onClick={() => onOrderTypeChange(t)}
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-sm font-semibold transition-all duration-200 border",
                orderType === t
                  ? "bg-violet-600 text-white border-violet-600 shadow-sm dark:bg-violet-700 dark:border-violet-700"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-transparent hover:border-gray-300 dark:hover:border-gray-600",
              )}
            >
              {t === "PICKUP" ? (
                <Package className="w-3.5 h-3.5" />
              ) : (
                <Truck className="w-3.5 h-3.5" />
              )}
              {t === "PICKUP" ? "Pickup" : "Delivery"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Payment Method ── */}
      <div className="space-y-2">
        <SectionLabel>Payment Method</SectionLabel>
        <Select
          value={paymentMethod}
          onValueChange={(v) => onPaymentMethodChange(v as PaymentMethod)}
        >
          <SelectTrigger className={inputCls}>
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            {PAYMENT_METHODS.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ── Discount ── */}
      <div className="space-y-2">
        <SectionLabel>
          <Tag className="w-3 h-3" />
          Discount
        </SectionLabel>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400 pointer-events-none">
            ৳
          </span>
          <Input
            type="number"
            min="0"
            step="1"
            placeholder="0"
            value={discount}
            onChange={(e) => onDiscountChange(e.target.value)}
            className={cn("pl-7 pr-8", inputCls, discountError && "border-rose-400")}
          />
          {discount && (
            <button
              onClick={() => onDiscountChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              aria-label="Clear"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        {discountError && (
          <p className="text-xs text-rose-500">{discountError}</p>
        )}
      </div>

      {/* ── Delivery charge (DELIVERY only) ── */}
      {orderType === "DELIVERY" && (
        <div className="space-y-2">
          <SectionLabel>Delivery Charge</SectionLabel>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400 pointer-events-none">
              ৳
            </span>
            <Input
              type="number"
              min="0"
              step="1"
              placeholder="0"
              value={deliveryCharge}
              onChange={(e) => onDeliveryChargeChange(e.target.value)}
              className={cn("pl-7", inputCls)}
            />
          </div>
        </div>
      )}

      {/* ── Advance Payment ── */}
      <div className="space-y-2">
        <SectionLabel>Advance Payment</SectionLabel>
        <div className="grid grid-cols-2 gap-2">
          <Select
            value={advance.method ?? "NONE"}
            onValueChange={(v) =>
              onAdvanceChange({ method: v === "NONE" ? undefined : (v as PaymentMethod) })
            }
          >
            <SelectTrigger className={inputCls}>
              <SelectValue placeholder="Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NONE">None</SelectItem>
              {ADVANCE_PAYMENT_METHODS.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400 pointer-events-none">
              ৳
            </span>
            <Input
              type="number"
              min="0"
              step="1"
              placeholder="0"
              value={advance.amount || ""}
              onChange={(e) =>
                onAdvanceChange({ amount: Number(e.target.value) || 0 })
              }
              disabled={!advance.method}
              className={cn("pl-7", inputCls, !advance.method && "opacity-50")}
            />
          </div>
        </div>
      </div>

      {/* ── Schedule ── */}
      <div className="space-y-2">
        <SectionLabel>Schedule</SectionLabel>
        <div className="grid grid-cols-3 gap-1.5">
          {(["INSTANT", "SCHEDULED", "HOLD"] as const).map((t) => (
            <button
              key={t}
              onClick={() => onScheduleChange({ ...schedule, type: t })}
              className={cn(
                "rounded-lg py-2 px-2 text-xs font-semibold transition-all duration-200 border",
                schedule.type === t
                  ? "bg-violet-600 text-white border-violet-600 dark:bg-violet-700"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-transparent",
              )}
            >
              {t === "INSTANT" ? "Instant" : t === "SCHEDULED" ? "Scheduled" : "Hold"}
            </button>
          ))}
        </div>

        {schedule.type === "SCHEDULED" && (
          <Input
            type="datetime-local"
            value={schedule.scheduledAt ?? ""}
            onChange={(e) =>
              onScheduleChange({ ...schedule, scheduledAt: e.target.value })
            }
            className={cn("text-xs", inputCls)}
          />
        )}
      </div>

      {/* ── Notes ── */}
      <div className="space-y-2">
        <SectionLabel>Order Notes</SectionLabel>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder={DEFAULT_ORDER_NOTES}
          rows={3}
          className={cn(
            "w-full rounded-lg border px-3 py-2 text-xs leading-relaxed resize-none",
            "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900",
            "text-gray-700 dark:text-gray-300 placeholder:text-gray-400",
            "focus:outline-none focus:border-violet-400 dark:focus:border-violet-500 transition-colors",
          )}
        />
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
      {children}
    </p>
  );
}