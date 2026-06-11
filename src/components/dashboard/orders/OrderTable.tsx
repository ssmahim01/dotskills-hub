/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/dashboard/shared/Skeleton";
import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { OrderActions } from "./OrderActions";
import type { IOrder } from "@/types/order.types";
import { Box } from "lucide-react";

interface OrderTableProps {
  orders: IOrder[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onView: (order: IOrder) => void;
  onEdit: (order: IOrder) => void;
  onDelete: (order: IOrder) => void;
  onConfirm: (order: IOrder) => void;
  onProcess: (order: IOrder) => void;
  onShip: (order: IOrder) => void;
  onDeliver: (order: IOrder) => void;
  onCancel: (order: IOrder) => void;
  onReturn: (order: IOrder) => void;
  onMarkAsPaid: (order: IOrder) => void;
  onRefund: (order: IOrder) => void;
  actionLoading?: Record<string, boolean>;
}

export function OrderTable({
  orders,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  onConfirm,
  onProcess,
  onShip,
  onDeliver,
  onCancel,
  onReturn,
  onMarkAsPaid,
  onRefund,
  actionLoading = {},
}: OrderTableProps) {
  if (isLoading && orders.length === 0) {
    return (
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-6 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-28" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-8" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={Box}
        title="No orders found"
        description="Start by creating your first order or adjusting your filters."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const isLoading = actionLoading[order._id];
              return (
                <TableRow
                  key={order._id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="font-mono text-sm font-medium">
                    #{order._id.slice(-8).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">
                        {order.customerName}
                      </p>
                      {order.customerEmail && (
                        <p className="text-xs text-muted-foreground">
                          {order.customerEmail}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    $
                    {order.total.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell>
                    <PaymentStatusBadge status={order.paymentStatus} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "2-digit",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <OrderActions
                      order={order}
                      onView={() => onView(order)}
                      onEdit={() => onEdit(order)}
                      onDelete={() => onDelete(order)}
                      onConfirm={() => onConfirm(order)}
                      onProcess={() => onProcess(order)}
                      onShip={() => onShip(order)}
                      onDeliver={() => onDeliver(order)}
                      onCancel={() => onCancel(order)}
                      onReturn={() => onReturn(order)}
                      onMarkAsPaid={() => onMarkAsPaid(order)}
                      onRefund={() => onRefund(order)}
                      isLoading={isLoading}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination {...({ currentPage, totalPages, onPageChange } as any)} />
        </div>
      )}
    </div>
  );
}
