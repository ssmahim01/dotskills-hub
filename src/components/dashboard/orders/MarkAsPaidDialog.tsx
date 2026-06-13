"use client";

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
  const [markAsPaid, { isLoading, isError, error }] = useMarkAsPaidMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    try {
      await markAsPaid({
        id: order._id,
        data: {
          paymentMethod: order.paymentMethod,
          transactionId: order.transactionId,
          amount: order.dueAmount,
        },
      }).unwrap();
      onOpenChange(false);
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
            Record the payment for order #{order?.orderNumber ?? ""}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-foreground">
              Payment Method *
            </label>
            <Input
              placeholder="e.g., Bkash"
              value={order?.paymentMethod}
              readOnly
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-foreground">
              Transaction ID
            </label>
            <Input
              placeholder="e.g., TXN123456789"
              value={order?.transactionId}
              readOnly
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
            <Button
              type="submit"
              className="bg-violet-600 hover:bg-violet-700 dark:bg-violet-700 dark:hover:bg-violet-600 hover:cursor-pointer text-white"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Mark as Paid"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
