'use client';

import { Users, UserCheck, UserX, Crown } from 'lucide-react';
import { OverviewCard } from '@/components/dashboard/shared/OverviewCard';
import { Skeleton } from '@/components/dashboard/shared/Skeleton';
import type { ICustomerAnalytics } from '@/types/customer.types';

interface CustomerOverviewCardsProps {
  analytics: ICustomerAnalytics | null;
  isLoading: boolean;
}

export function CustomerOverviewCards({ analytics, isLoading }: CustomerOverviewCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <OverviewCard
        icon={Users}
        label="Total Customers"
        value={analytics.totalCustomers.toLocaleString()}
        description="All registered customers"
      />
      <OverviewCard
        icon={UserCheck}
        label="Active Customers"
        value={analytics.activeCustomers.toLocaleString()}
        description={`${((analytics.activeCustomers / analytics.totalCustomers) * 100).toFixed(1)}% of total`}
      />
      <OverviewCard
        icon={UserX}
        label="Blocked Customers"
        value={analytics.blockedCustomers.toLocaleString()}
        description={`${((analytics.blockedCustomers / analytics.totalCustomers) * 100).toFixed(1)}% of total`}
      />
      <OverviewCard
        icon={Crown}
        label="VIP Customers"
        value={analytics.vipCustomers.toLocaleString()}
        description={`${((analytics.vipCustomers / analytics.totalCustomers) * 100).toFixed(1)}% of total`}
      />
    </div>
  );
}
