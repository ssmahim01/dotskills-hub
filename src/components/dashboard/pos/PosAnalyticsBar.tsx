"use client";

import React from "react";
import { ShoppingBag, TrendingUp, Users, Package } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetOrderAnalyticsQuery } from "@/redux/features/Order/order.api";

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 px-4 py-3">
      <div className={`rounded-lg p-2 ${color}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
          {label}
        </p>
        <p className="text-lg font-bold tabular-nums text-gray-900 dark:text-gray-100">
          {value}
        </p>
      </div>
    </div>
  );
}

export function POSAnalyticsBar() {
  const { data, isLoading } = useGetOrderAnalyticsQuery({});
  const analytics = data?.data;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard
        label="Today's Orders"
        value={analytics?.todayOrders ?? 0}
        icon={ShoppingBag}
        color="bg-violet-500"
      />
      <StatCard
        label="Today's Revenue"
        value={`৳${(analytics?.todayRevenue ?? 0).toLocaleString()}`}
        icon={TrendingUp}
        color="bg-emerald-500"
      />
      <StatCard
        label="Total Orders"
        value={analytics?.totalOrders ?? 0}
        icon={Package}
        color="bg-blue-500"
      />
      <StatCard
        label="Total Revenue"
        value={`৳${(analytics?.totalRevenue ?? 0).toLocaleString()}`}
        icon={Users}
        color="bg-amber-500"
      />
    </div>
  );
}