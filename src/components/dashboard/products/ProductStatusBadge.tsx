import type { ProductStatus } from '@/types/product.types';
import { StatusBadge } from '@/components/dashboard/shared/StatusBadge';
import { PRODUCT_STATUS_MAP } from '@/lib/constants/product.constants';

interface ProductStatusBadgeProps {
  status: ProductStatus;
}

export function ProductStatusBadge({ status }: ProductStatusBadgeProps) {
  const config = PRODUCT_STATUS_MAP[status];
  return <StatusBadge status={status} label={config.label} color={config.color} />;
}
