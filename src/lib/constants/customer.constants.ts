import type { CustomerStatus } from '@/types/customer.types';

export const CUSTOMER_STATUS_OPTIONS: {
  value: CustomerStatus;
  label: string;
  description: string;
}[] = [
  { value: 'ACTIVE', label: 'Active', description: 'Customer is active' },
  { value: 'INACTIVE', label: 'Inactive', description: 'Customer is inactive' },
  { value: 'BLOCKED', label: 'Blocked', description: 'Customer is blocked' },
];

export const CUSTOMER_STATUS_COLORS: Record<CustomerStatus, string> = {
  ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800',
  INACTIVE:
    'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950 dark:text-slate-400 dark:border-slate-800',
  BLOCKED:
    'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800',
};

export const CUSTOMER_SORT_OPTIONS = [
  { value: 'createdAt', label: 'Newest First' },
  { value: '-createdAt', label: 'Oldest First' },
  { value: 'name', label: 'Name (A-Z)' },
  { value: '-name', label: 'Name (Z-A)' },
  { value: '-totalSpent', label: 'Highest Spender' },
  { value: 'totalSpent', label: 'Lowest Spender' },
  { value: '-totalOrders', label: 'Most Orders' },
  { value: 'totalOrders', label: 'Least Orders' },
];

export const CUSTOMER_PAGINATION_LIMIT = 10;
