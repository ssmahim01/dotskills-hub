'use client';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useDeleteOrderMutation } from '@/redux/features/Order/order.api';
import type { IOrder } from '@/types/order.types';

interface DeleteOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: IOrder | null;
}

export function DeleteOrderDialog({ open, onOpenChange, order }: DeleteOrderDialogProps) {
  const [deleteOrder, { isLoading, isError, error }] = useDeleteOrderMutation();

  const handleDelete = async () => {
    if (!order) return;
    try {
      await deleteOrder(order._id).unwrap();
      onOpenChange(false);
    } catch (err) {
      console.error('Failed to delete order:', err);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Order</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Are you sure you want to delete order <span className="font-semibold text-foreground">#{order?.orderNumber}</span>?
            </p>
            <p className="text-xs text-muted-foreground">This action cannot be undone. All order data will be permanently deleted.</p>
            {isError && (
              <p className="text-xs text-red-600 dark:text-red-400">
                {error instanceof Error ? error.message : 'Failed to delete order'}
              </p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isLoading} className="bg-red-600 hover:bg-red-700">
            {isLoading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
