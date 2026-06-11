import type { ProductStatus } from '@/types/product.types';

export const PRODUCT_STATUS_MAP: Record<ProductStatus, { label: string; color: string }> = {
  DRAFT: {
    label: 'Draft',
    color: 'bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-300',
  },
  ACTIVE: {
    label: 'Active',
    color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  },
  ARCHIVED: {
    label: 'Archived',
    color: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  },
};

export const PRODUCT_STATUS_OPTIONS = Object.entries(PRODUCT_STATUS_MAP).map(([value, { label }]) => ({
  value: value as ProductStatus,
  label,
}));

export const PRODUCT_DEFAULT_PAGE_SIZE = 10;
export const PRODUCT_MAX_NAME_LENGTH = 200;
export const PRODUCT_MAX_DESCRIPTION_LENGTH = 2000;
export const PRODUCT_MAX_SKU_LENGTH = 50;

export const PRODUCT_SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'price', label: 'Price' },
  { value: 'sold', label: 'Total Sold' },
  { value: 'created', label: 'Created Date' },
] as const;

export const PRODUCT_ORDER_OPTIONS = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' },
] as const;

export const LOW_STOCK_THRESHOLD_MIN = 1;
export const LOW_STOCK_THRESHOLD_DEFAULT = 10;
export const LOW_STOCK_THRESHOLD_MAX = 1000;

export const PRICE_DECIMALS = 2;
export const RATING_PRECISION = 1;
export const RATING_MAX = 5;
export const RATING_MIN = 0;
