import type { OrderStatus, PaymentStatus } from '@/types/order.types';

export const ORDER_STATUS_OPTIONS: {
  value: OrderStatus;
  label: string;
  description: string;
}[] = [
  { value: 'pending', label: 'Pending', description: 'Order is pending' },
  { value: 'confirmed', label: 'Confirmed', description: 'Order is confirmed' },
  { value: 'processing', label: 'Processing', description: 'Order is being processed' },
  { value: 'shipped', label: 'Shipped', description: 'Order has been shipped' },
  { value: 'delivered', label: 'Delivered', description: 'Order has been delivered' },
  { value: 'cancelled', label: 'Cancelled', description: 'Order has been cancelled' },
  { value: 'returned', label: 'Returned', description: 'Order has been returned' },
];

export const PAYMENT_STATUS_OPTIONS: {
  value: PaymentStatus;
  label: string;
  description: string;
}[] = [
  { value: 'pending', label: 'Pending', description: 'Payment is pending' },
  { value: 'paid', label: 'Paid', description: 'Payment has been received' },
  { value: 'refunded', label: 'Refunded', description: 'Payment has been refunded' },
  { value: 'failed', label: 'Failed', description: 'Payment has failed' },
];

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending:
    'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-800',
  confirmed:
    'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800',
  processing:
    'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-400 dark:border-indigo-800',
  shipped:
    'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-800',
  delivered:
    'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800',
  cancelled:
    'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800',
  returned:
    'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-800',
};

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  pending:
    'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-800',
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800',
  refunded:
    'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950 dark:text-slate-400 dark:border-slate-800',
  failed:
    'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800',
};

export const ORDER_SORT_OPTIONS = [
  { value: 'createdAt', label: 'Newest First' },
  { value: '-createdAt', label: 'Oldest First' },
  { value: '-total', label: 'Highest Value' },
  { value: 'total', label: 'Lowest Value' },
  { value: 'customerName', label: 'Customer (A-Z)' },
  { value: '-customerName', label: 'Customer (Z-A)' },
];

export const ORDER_PAGINATION_LIMIT = 15;

export const PAYMENT_METHODS = [
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'debit_card', label: 'Debit Card' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'cash', label: 'Cash on Delivery' },
];
