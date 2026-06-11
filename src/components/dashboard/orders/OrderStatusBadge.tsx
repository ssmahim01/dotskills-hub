'use client';

import { ORDER_STATUS_COLORS } from '@/lib/constants/order.constants';
import type { OrderStatus } from '@/types/order.types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const statusIcons: Record<OrderStatus, string> = {
    pending: '⏳',
    confirmed: '✓',
    processing: '⚙️',
    shipped: '📦',
    delivered: '✅',
    cancelled: '✕',
    returned: '↩️',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium border ${ORDER_STATUS_COLORS[status]}`}
    >
      <span>{statusIcons[status]}</span>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
