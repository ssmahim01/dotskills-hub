"use client";

import React from "react";
import { Tag } from "lucide-react";
import type { OrderSummary } from "@/types/pos.types";

interface CartSummaryProps {
  summary: OrderSummary;
}

export function CartSummary({ summary }: CartSummaryProps) {
  const fmt = (n: number) =>
    `৳${n.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="space-y-2 text-sm">
      <Row label="Subtotal" value={fmt(summary.subtotal)} />

      {summary.discountAmount > 0 && (
        <Row
          label={
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <Tag className="w-3 h-3" />
              Discount
            </span>
          }
          value={`-${fmt(summary.discountAmount)}`}
          valueClass="text-emerald-600 dark:text-emerald-400"
        />
      )}

      {summary.deliveryCharge > 0 && (
        <Row label="Delivery" value={fmt(summary.deliveryCharge)} />
      )}

      {summary.taxAmount > 0 && (
        <Row label="Tax" value={fmt(summary.taxAmount)} />
      )}

      <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-1">
        <Row
          label={
            <span className="font-bold text-gray-900 dark:text-gray-100">
              Total
            </span>
          }
          value={fmt(summary.totalAmount)}
          valueClass="text-base font-bold text-violet-600 dark:text-violet-400"
        />
      </div>

      {summary.advanceAmount > 0 && (
        <Row
          label="Advance paid"
          value={`-${fmt(summary.advanceAmount)}`}
          valueClass="text-blue-600 dark:text-blue-400"
        />
      )}

      {summary.advanceAmount > 0 && (
        <div className="border-t border-dashed border-gray-200 dark:border-gray-700 pt-2">
          <Row
            label={
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                Due amount
              </span>
            }
            value={fmt(summary.dueAmount)}
            valueClass="font-bold text-rose-600 dark:text-rose-400"
          />
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  valueClass,
}: {
  label: React.ReactNode;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span
        className={`tabular-nums font-medium text-gray-900 dark:text-gray-100 ${valueClass ?? ""}`}
      >
        {value}
      </span>
    </div>
  );
}
