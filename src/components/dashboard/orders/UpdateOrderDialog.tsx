"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { useUpdateOrderMutation } from "@/redux/features/Order/order.api";
import { PAYMENT_METHODS } from "@/lib/constants/order.constants";
import type { IOrder } from "@/types/order.types";

interface UpdateOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: IOrder | null;
}

export function UpdateOrderDialog({
  open,
  onOpenChange,
  order,
}: UpdateOrderDialogProps) {
  const [notes, setNotes] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [updateOrder, { isLoading, isError, error }] = useUpdateOrderMutation();

  useEffect(() => {
    if (open && order) {
      setTimeout(() => {
        setNotes(order.notes || "");
        setShippingAddress(order.shippingAddress || "");
        setPaymentMethod(order.paymentMethod || "");
      }, 100);
    }
  }, [open, order]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    try {
      await updateOrder({
        id: order._id,
        data: {
          notes: notes || undefined,
          shippingAddress: shippingAddress || undefined,
          paymentMethod: paymentMethod || undefined,
        },
      }).unwrap();
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to update order:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Order</DialogTitle>
          <DialogDescription>
            Update order information for #{order?._id.slice(-8).toUpperCase()}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-foreground">
              Shipping Address
            </label>
            <Input
              placeholder="123 Main Street, City, State"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-foreground">
              Payment Method
            </label>
            <Select
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value ?? "")}
            >
              <SelectTrigger disabled={isLoading}>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Not specified</SelectItem>
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
              Notes
            </label>
            <textarea
              placeholder="Add any notes about this order..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isLoading}
              rows={3}
              className="flex min-h-15 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            />
          </div>

          {isError && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
              {error instanceof Error
                ? error.message
                : "Failed to update order"}
            </div>
          )}

          <div className="flex gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
