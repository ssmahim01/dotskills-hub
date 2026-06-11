'use client';

import { PAYMENT_STATUS_COLORS } from '@/lib/constants/order.constants';
import type { PaymentStatus } from '@/types/order.types';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const statusIcons: Record<PaymentStatus, string> = {
    pending: '⏳',
    paid: '✓',
    refunded: '↩️',
    failed: '✕',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium border ${PAYMENT_STATUS_COLORS[status]}`}
    >
      <span>{statusIcons[status]}</span>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
