/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { formatCurrency, formatNumber } from "@/lib/utils/formatters";
import { subscriptionService } from "@/lib/services/subscription.service";
import { storeService } from "@/lib/services/store.service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Store,
  TrendingUp,
  Clock,
  BarChart3,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; direction: "up" | "down" };
}

export default function DashboardOverview({storeSlug}: {storeSlug?: string}) {

  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<StatCard[]>([]);
  const [recentStores, setRecentStores] = useState<any[]>([]);

  useEffect(() => {
    subscriptionService.initialize();
    storeService.initialize();

    const totalStores = storeService.getTotalCount();
    const activeStores = storeService.getActiveCount();
    const pendingSubscriptions =
      subscriptionService.getCountByStatus("pending");
    const monthlyRevenue = subscriptionService.getMonthlyRevenue();
    const recentData = storeService.getRecent(5);

    setStats([
      {
        title: "Total Stores",
        value: formatNumber(totalStores),
        icon: <Store className="w-6 h-6" />,
        trend: { value: 12, direction: "up" },
      },
      {
        title: "Active Stores",
        value: formatNumber(activeStores),
        icon: <TrendingUp className="w-6 h-6" />,
        trend: { value: 8, direction: "up" },
      },
      {
        title: "Pending Subscriptions",
        value: formatNumber(pendingSubscriptions),
        icon: <Clock className="w-6 h-6" />,
        trend: { value: 2, direction: "down" },
      },
      {
        title: "Monthly Revenue",
        value: formatCurrency(monthlyRevenue),
        icon: <BarChart3 className="w-6 h-6" />,
        trend: { value: 23, direction: "up" },
      },
    ]);

    setRecentStores(recentData);
    setIsLoading(false);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s what&apos;s happening with your business
          today.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading
          ? // Loading skeleton
            [...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton className="h-full w-full" />
                </CardContent>
              </Card>
            ))
          : // Stats cards
            stats.map((stat, index) => (
              <Card key={index} className="group relative overflow-hidden">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {stat.value}
                      </p>
                      {stat.trend && (
                        <div className="flex items-center gap-1">
                          {stat.trend.direction === "up" ? (
                            <ArrowUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                          ) : (
                            <ArrowDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                          )}
                          <span
                            className={`text-sm font-semibold ${
                              stat.trend.direction === "up"
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {stat.trend.value}%
                          </span>
                          <span className="text-xs text-muted-foreground">
                            from last month
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-3 bg-primary/10 rounded-lg text-primary group-hover:bg-primary/20 transition-colors duration-200">
                      {stat.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Recent Stores Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Stores</CardTitle>
          <CardDescription>
            The latest stores created on your platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : recentStores.length > 0 ? (
            <div className="space-y-4">
              {recentStores.map((store) => (
                <div
                  key={store.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors duration-200"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">
                      {store.storeName}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {store.subdomain}.dotskills.shop
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground capitalize">
                        {store.package}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {store.ownerName}
                      </p>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-semibold capitalize">
                      {store.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Store className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">
                No stores yet. Create your first store to get started.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest events and updates from your platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-4 p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors duration-200">
                <div className="w-3 h-3 rounded-full bg-blue-500 mt-2 shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    New subscription received
                  </p>
                  <p className="text-sm text-muted-foreground">
                    A customer has registered for the Business plan
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    2 hours ago
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors duration-200">
                <div className="w-3 h-3 rounded-full bg-green-500 mt-2 shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    Store created successfully
                  </p>
                  <p className="text-sm text-muted-foreground">
                    &quot;Fashion Fusion&quot; store has been activated
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    1 day ago
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors duration-200">
                <div className="w-3 h-3 rounded-full bg-purple-500 mt-2 shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    Payment verified
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Transaction from Ahmed Hassan has been confirmed
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    3 days ago
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Revenue */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Revenue (YTD)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-foreground">$28,450</p>
            <p className="text-sm text-muted-foreground mt-2">
              <span className="text-green-600 dark:text-green-400">+18.5%</span>{" "}
              compared to last year
            </p>
          </CardContent>
        </Card>

        {/* Total Customers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-foreground">342</p>
            <p className="text-sm text-muted-foreground mt-2">
              <span className="text-green-600 dark:text-green-400">+24.3%</span>{" "}
              new customers this month
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
