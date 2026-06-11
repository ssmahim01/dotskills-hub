import type { CategoryStatus } from '@/types/category.types';
import { StatusBadge } from '@/components/dashboard/shared/StatusBadge';
import { CATEGORY_STATUS_MAP } from '@/lib/constants/category.constants';

interface CategoryStatusBadgeProps {
  status: CategoryStatus;
}

export function CategoryStatusBadge({ status }: CategoryStatusBadgeProps) {
  const config = CATEGORY_STATUS_MAP[status];
  return <StatusBadge status={status} label={config.label} color={config.color} />;
}
