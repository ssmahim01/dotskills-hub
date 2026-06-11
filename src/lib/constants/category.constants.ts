import type { CategoryStatus } from '@/types/category.types';

export const CATEGORY_STATUS_MAP: Record<CategoryStatus, { label: string; color: string }> = {
  ACTIVE: {
    label: 'Active',
    color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  },
  INACTIVE: {
    label: 'Inactive',
    color: 'bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-300',
  },
};

export const CATEGORY_STATUS_OPTIONS = Object.entries(CATEGORY_STATUS_MAP).map(([value, { label }]) => ({
  value: value as CategoryStatus,
  label,
}));

export const CATEGORY_DEFAULT_PAGE_SIZE = 10;
export const CATEGORY_MAX_NAME_LENGTH = 100;
export const CATEGORY_MAX_DESCRIPTION_LENGTH = 500;

export const CATEGORY_SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'position', label: 'Position' },
  { value: 'created', label: 'Created Date' },
] as const;

export const CATEGORY_ORDER_OPTIONS = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' },
] as const;
