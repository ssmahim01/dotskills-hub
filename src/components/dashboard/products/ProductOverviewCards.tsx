'use client';

import { Package, CheckCircle, FileText, AlertCircle, Star } from 'lucide-react';
import type { ProductOverviewStats } from '@/types/product.types';
import { OverviewCard } from '@/components/dashboard/shared/OverviewCard';

interface ProductOverviewCardsProps {
  stats?: ProductOverviewStats;
  isLoading?: boolean;
}

export function ProductOverviewCards({ stats }: ProductOverviewCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 px-8 sm:grid-cols-2 lg:grid-cols-5">
      <OverviewCard
        label="Total Products"
        value={stats?.totalProducts ?? 0}
        icon={Package}
      />
      <OverviewCard
        label="Active Products"
        value={stats?.activeProducts ?? 0}
        icon={CheckCircle}
      />
      <OverviewCard
        label="Draft Products"
        value={stats?.draftProducts ?? 0}
        icon={FileText}
      />
      <OverviewCard
        label="Out of Stock"
        value={stats?.outOfStockProducts ?? 0}
        icon={AlertCircle}
      />
      <OverviewCard
        label="Featured Products"
        value={stats?.featuredProducts ?? 0}
        icon={Star}
      />
    </div>
  );
}
