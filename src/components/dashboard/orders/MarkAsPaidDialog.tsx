"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PAYMENT_METHODS } from "@/lib/constants/order.constants";
import { useMarkAsPaidMutation } from "@/redux/features/Order/order.api";
import type { IOrder } from "@/types/order.types";

interface MarkAsPaidDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: IOrder | null;
}

export function MarkAsPaidDialog({
  open,
  onOpenChange,
  order,
}: MarkAsPaidDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [markAsPaid, { isLoading, isError, error }] = useMarkAsPaidMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || !paymentMethod) return;

    try {
      await markAsPaid({
        id: order._id,
        data: {
          paymentMethod,
          transactionId,
        },
      }).unwrap();
      onOpenChange(false);
      setPaymentMethod("");
      setTransactionId("");
    } catch (err) {
      console.error("Failed to mark as paid:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mark Order as Paid</DialogTitle>
          <DialogDescription>
            Record the payment for order #{order?._id.slice(-8).toUpperCase()}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-foreground">
              Payment Method *
            </label>
            <Select
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value ?? "")}
            >
              <SelectTrigger disabled={isLoading}>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-foreground">
              Transaction ID
            </label>
            <Input
              placeholder="e.g., TXN123456789"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {isError && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
              {error instanceof Error
                ? error.message
                : "Failed to mark as paid"}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !paymentMethod}>
              {isLoading ? "Processing..." : "Mark as Paid"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
