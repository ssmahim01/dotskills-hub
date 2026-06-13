"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/dashboard/shared/Skeleton";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import type { IOrder } from "@/types/order.types";

interface OrderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: IOrder | null;
  isLoading: boolean;
}

export function OrderDetailsDialog({
  open,
  onOpenChange,
  order,
  isLoading,
}: OrderDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            View detailed information about this order
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10" />
            ))}
          </div>
        ) : order ? (
          <div className="space-y-6">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Order #{order?.orderNumber ?? ""}
                </h3>
                <div className="flex gap-2">
                  <OrderStatusBadge status={order.status} />
                  <PaymentStatusBadge status={order.paymentStatus} />
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 border-t pt-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Customer
                </p>
                <p className="text-sm font-medium">{order.customerName}</p>
                {order.customerEmail && (
                  <p className="text-xs text-muted-foreground">
                    {order.customerEmail}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {order.customerPhone}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Payment Method
                </p>
                <p className="text-sm font-medium">
                  {order.paymentMethod || "Not specified"}
                </p>
              </div>

              {order.customerAddress && (
                <div className="space-y-1 sm:col-span-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase">
                    Shipping Address
                  </p>
                  <p className="text-sm font-medium">{order.customerAddress}</p>
                </div>
              )}

              {order.trackingId && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase">
                    Tracking Number
                  </p>
                  <p className="text-sm font-medium">{order.trackingId}</p>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <h4 className="mb-4 font-semibold text-sm">Order Items</h4>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between border-b pb-2 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium">${item.total}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>৳{order.subtotalAmount}</span>
              </div>

              <div className="flex justify-between">
                <span>Discount</span>
                <span>-৳{order.discountAmount}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>৳{order.deliveryCharge}</span>
              </div>

              <div className="flex justify-between">
                <span>Paid</span>
                <span className="text-green-600">৳{order.paidAmount}</span>
              </div>

              <div className="flex justify-between">
                <span>Due</span>
                <span className="text-red-600">৳{order.dueAmount}</span>
              </div>

              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span>৳{order.totalAmount}</span>
              </div>
            </div>

            {order.notes && (
              <div className="border-t pt-4 space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Notes
                </p>
                <p className="text-sm">{order.notes}</p>
              </div>
            )}

            <div className="border-t pt-4 space-y-2 text-xs text-muted-foreground">
              <p>
                <span className="font-medium">Created:</span>{" "}
                {new Date(order?.createdAt ?? "").toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p>
                <span className="font-medium">Last Updated:</span>{" "}
                {new Date(order?.updatedAt ?? "").toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
