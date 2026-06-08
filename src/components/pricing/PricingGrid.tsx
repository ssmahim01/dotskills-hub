"use client";

import React from "react";
import { PackageOpen } from "lucide-react";
import { IPlan } from "@/redux/features/Plan/plan.api";
import { PlanCard } from "./PlanCard";
import { PlanCardSkeleton } from "./PlanCardSkeleton";

interface PricingGridProps {
  plans: IPlan[];
  onSelectPlan?: (plan: IPlan) => void;
}

export function PricingGrid({ plans, onSelectPlan }: PricingGridProps) {
  if (!plans.length) {
    return (
      <div className="grid md:grid-cols-3 gap-8 items-start">
        <PlanCardSkeleton />
        <PlanCardSkeleton highlight />
        <PlanCardSkeleton />
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <PackageOpen className="w-10 h-10 text-muted-foreground" />
        <div>
          <p className="font-semibold text-foreground">No plans available</p>
          <p className="text-sm text-muted-foreground mt-1">
            Check back soon — plans are being configured.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-8 items-start">
      {plans.map((plan) => (
        <PlanCard
          key={plan._id}
          plan={plan}
          onSelectPlan={onSelectPlan}
          useCallback={!!onSelectPlan}
        />
      ))}
    </div>
  );
}
