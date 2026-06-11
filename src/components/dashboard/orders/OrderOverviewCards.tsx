'use client';

import { ShoppingCart, Truck, CheckCircle, DollarSign } from 'lucide-react';
import { OverviewCard } from '@/components/dashboard/shared/OverviewCard';
import { Skeleton } from '@/components/dashboard/shared/Skeleton';
import type { IOrderAnalytics } from '@/types/order.types';

interface OrderOverviewCardsProps {
  analytics: IOrderAnalytics | null;
  isLoading: boolean;
}

export function OrderOverviewCards({ analytics, isLoading }: OrderOverviewCardsProps) {
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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <OverviewCard
        icon={ShoppingCart}
        label="Total Orders"
        value={analytics.totalOrders.toLocaleString()}
        description={`${analytics.totalItems} items total`}
      />
      <OverviewCard
        icon={DollarSign}
        label="Total Revenue"
        value={`$${analytics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        description={`Avg: $${analytics.averageOrderValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
      />
      <OverviewCard
        icon={Truck}
        label="Shipped Orders"
        value={analytics.shippedOrders.toLocaleString()}
        description={`${((analytics.shippedOrders / analytics.totalOrders) * 100).toFixed(1)}% of total`}
      />
      <OverviewCard
        icon={CheckCircle}
        label="Delivered Orders"
        value={analytics.deliveredOrders.toLocaleString()}
        description={`${((analytics.deliveredOrders / analytics.totalOrders) * 100).toFixed(1)}% of total`}
      />
    </div>
  );
}
