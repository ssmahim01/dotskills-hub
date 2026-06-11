'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/dashboard/shared/Skeleton';
import { CustomerStatusBadge } from './CustomerStatusBadge';
import type { ICustomer } from '@/types/customer.types';

interface CustomerDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: ICustomer | null;
  isLoading: boolean;
}

export function CustomerDetailsDialog({
  open,
  onOpenChange,
  customer,
  isLoading,
}: CustomerDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
          <DialogDescription>View detailed information about this customer</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10" />
            ))}
          </div>
        ) : customer ? (
          <div className="space-y-6">
            <div>
              <h3 className="mb-4 text-lg font-semibold">{customer.name}</h3>
              <div className="mb-4">
                <CustomerStatusBadge status={customer.status} isVIP={customer.isVIP} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase">Email</p>
                <p className="text-sm font-medium break-all">
                  {customer.email || <span className="text-muted-foreground">Not provided</span>}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase">Phone</p>
                <p className="text-sm font-medium">{customer.phone}</p>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <p className="text-xs font-medium text-muted-foreground uppercase">Address</p>
                <p className="text-sm font-medium">
                  {customer.address || <span className="text-muted-foreground">Not provided</span>}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="mb-4 font-semibold text-sm">Order History</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase">Total Orders</p>
                  <p className="text-2xl font-bold">{customer.totalOrders}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase">Total Spent</p>
                  <p className="text-2xl font-bold">${customer.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>

                {customer.totalOrders > 0 && (
                  <div className="space-y-1 sm:col-span-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase">Average Order Value</p>
                    <p className="text-lg font-bold">
                      ${(customer.totalSpent / customer.totalOrders).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t pt-4 space-y-2 text-xs text-muted-foreground">
              <p>
                <span className="font-medium">Created:</span>{' '}
                {new Date(customer.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
              <p>
                <span className="font-medium">Last Updated:</span>{' '}
                {new Date(customer.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
