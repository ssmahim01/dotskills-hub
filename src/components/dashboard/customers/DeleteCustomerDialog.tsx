'use client';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useDeleteCustomerMutation } from '@/redux/features/Customer/customer.api';
import type { ICustomer } from '@/types/customer.types';

interface DeleteCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: ICustomer | null;
}

export function DeleteCustomerDialog({ open, onOpenChange, customer }: DeleteCustomerDialogProps) {
  const [deleteCustomer, { isLoading, isError, error }] = useDeleteCustomerMutation();

  const handleDelete = async () => {
    if (!customer) return;
    try {
      await deleteCustomer(customer._id).unwrap();
      onOpenChange(false);
    } catch (err) {
      console.error('Failed to delete customer:', err);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Customer</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Are you sure you want to delete <span className="font-semibold text-foreground">{customer?.name}</span>?
            </p>
            <p className="text-xs text-muted-foreground">This action cannot be undone. All customer data will be permanently deleted.</p>
            {isError && (
              <p className="text-xs text-red-600 dark:text-red-400">
                {error instanceof Error ? error.message : 'Failed to delete customer'}
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
