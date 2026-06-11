'use client';

import { CUSTOMER_STATUS_COLORS } from '@/lib/constants/customer.constants';
import type { CustomerStatus } from '@/types/customer.types';

interface CustomerStatusBadgeProps {
  status: CustomerStatus;
  isVIP?: boolean;
}

export function CustomerStatusBadge({ status, isVIP }: CustomerStatusBadgeProps) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium border ${CUSTOMER_STATUS_COLORS[status]}`}
      >
        <span
          className={`inline-block size-2 rounded-full ${
            status === 'ACTIVE' ? 'bg-emerald-500' : status === 'BLOCKED' ? 'bg-red-500' : 'bg-slate-500'
          }`}
        />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
      {isVIP && (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800">
          ⭐ VIP
        </span>
      )}
    </div>
  );
}
