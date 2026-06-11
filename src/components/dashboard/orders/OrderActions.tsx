'use client';

import { useState } from 'react';
import { MoreVertical, Eye, Edit, Trash2, CheckCircle, Zap, Truck, Check, X, RotateCcw, RefreshCw } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import type { IOrder } from '@/types/order.types';

interface OrderActionsProps {
  order: IOrder;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onConfirm?: () => void;
  onProcess?: () => void;
  onShip?: () => void;
  onDeliver?: () => void;
  onCancel?: () => void;
  onReturn?: () => void;
  onMarkAsPaid?: () => void;
  onRefund?: () => void;
  isLoading?: boolean;
}

export function OrderActions({
  order,
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
  isLoading = false,
}: OrderActionsProps) {
  const [open, setOpen] = useState(false);

  const canConfirm = order.status === 'pending' && onConfirm;
  const canProcess = order.status === 'confirmed' && onProcess;
  const canShip = order.status === 'processing' && onShip;
  const canDeliver = order.status === 'shipped' && onDeliver;
  const canCancel = ['pending', 'confirmed', 'processing'].includes(order.status) && onCancel;
  const canReturn = order.status === 'delivered' && onReturn;
  const canMarkAsPaid = order.paymentStatus !== 'paid' && onMarkAsPaid;
  const canRefund = order.paymentStatus === 'paid' && onRefund;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => { onView(); setOpen(false); }} disabled={isLoading}>
          <Eye className="mr-2 h-4 w-4" />
          <span>View Details</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => { onEdit(); setOpen(false); }} disabled={isLoading}>
          <Edit className="mr-2 h-4 w-4" />
          <span>Edit Order</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {canConfirm && (
          <DropdownMenuItem onClick={() => { onConfirm(); setOpen(false); }} disabled={isLoading}>
            <CheckCircle className="mr-2 h-4 w-4" />
            <span>Confirm Order</span>
          </DropdownMenuItem>
        )}

        {canProcess && (
          <DropdownMenuItem onClick={() => { onProcess(); setOpen(false); }} disabled={isLoading}>
            <Zap className="mr-2 h-4 w-4" />
            <span>Process Order</span>
          </DropdownMenuItem>
        )}

        {canShip && (
          <DropdownMenuItem onClick={() => { onShip(); setOpen(false); }} disabled={isLoading}>
            <Truck className="mr-2 h-4 w-4" />
            <span>Ship Order</span>
          </DropdownMenuItem>
        )}

        {canDeliver && (
          <DropdownMenuItem onClick={() => { onDeliver(); setOpen(false); }} disabled={isLoading}>
            <Check className="mr-2 h-4 w-4" />
            <span>Mark as Delivered</span>
          </DropdownMenuItem>
        )}

        {(canMarkAsPaid || canRefund) && <DropdownMenuSeparator />}

        {canMarkAsPaid && (
          <DropdownMenuItem onClick={() => { onMarkAsPaid(); setOpen(false); }} disabled={isLoading}>
            <Check className="mr-2 h-4 w-4" />
            <span>Mark as Paid</span>
          </DropdownMenuItem>
        )}

        {canRefund && (
          <DropdownMenuItem onClick={() => { onRefund(); setOpen(false); }} disabled={isLoading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            <span>Refund</span>
          </DropdownMenuItem>
        )}

        {(canCancel || canReturn) && <DropdownMenuSeparator />}

        {canCancel && (
          <DropdownMenuItem onClick={() => { onCancel(); setOpen(false); }} disabled={isLoading} className="text-orange-600 dark:text-orange-400">
            <X className="mr-2 h-4 w-4" />
            <span>Cancel Order</span>
          </DropdownMenuItem>
        )}

        {canReturn && (
          <DropdownMenuItem onClick={() => { onReturn(); setOpen(false); }} disabled={isLoading}>
            <RotateCcw className="mr-2 h-4 w-4" />
            <span>Return Order</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => { onDelete(); setOpen(false); }} disabled={isLoading} className="text-red-600 dark:text-red-400">
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
