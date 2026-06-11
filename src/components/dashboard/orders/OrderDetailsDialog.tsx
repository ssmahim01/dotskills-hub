'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/dashboard/shared/Skeleton';
import { OrderStatusBadge } from './OrderStatusBadge';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import type { IOrder } from '@/types/order.types';

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
          <DialogDescription>View detailed information about this order</DialogDescription>
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
                <h3 className="text-lg font-semibold">Order #{order._id.slice(-8).toUpperCase()}</h3>
                <div className="flex gap-2">
                  <OrderStatusBadge status={order.status} />
                  <PaymentStatusBadge status={order.paymentStatus} />
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 border-t pt-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase">Customer</p>
                <p className="text-sm font-medium">{order.customerName}</p>
                {order.customerEmail && (
                  <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                )}
                <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase">Payment Method</p>
                <p className="text-sm font-medium">{order.paymentMethod || 'Not specified'}</p>
              </div>

              {order.shippingAddress && (
                <div className="space-y-1 sm:col-span-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase">Shipping Address</p>
                  <p className="text-sm font-medium">{order.shippingAddress}</p>
                </div>
              )}

              {order.trackingNumber && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase">Tracking Number</p>
                  <p className="text-sm font-medium">{order.trackingNumber}</p>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <h4 className="mb-4 font-semibold text-sm">Order Items</h4>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div>
                      <p className="text-sm font-medium">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">
                      ${item.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${order.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              {order.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${order.tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              )}
              {order.shippingCost > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>${order.shippingCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>${order.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            {order.notes && (
              <div className="border-t pt-4 space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase">Notes</p>
                <p className="text-sm">{order.notes}</p>
              </div>
            )}

            <div className="border-t pt-4 space-y-2 text-xs text-muted-foreground">
              <p>
                <span className="font-medium">Created:</span>{' '}
                {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
              <p>
                <span className="font-medium">Last Updated:</span>{' '}
                {new Date(order.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
