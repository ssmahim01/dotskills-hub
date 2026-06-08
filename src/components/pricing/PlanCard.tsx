"use client";

import React from "react";
import Link from "next/link";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IPlan } from "@/redux/features/Plan/plan.api";
import { cn } from "@/lib/utils";

interface PlanCardProps {
  plan: IPlan;
  onSelectPlan?: (plan: IPlan) => void;
  useCallback?: boolean;
  className?: string;
}

function formatRequests(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function PlanCard({
  plan,
  onSelectPlan,
  useCallback = false,
  className,
}: PlanCardProps) {
  const isPopular = plan.isPopular;

  const ctaHref = `/subscription/apply?planId=${plan._id}`;

  return (
    <div
      className={cn(
        "relative rounded-2xl border flex flex-col transition-all duration-300",
        isPopular
          ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 md:scale-105 z-10"
          : "border-border bg-card hover:border-primary/50 hover:shadow-md",
        className,
      )}
    >
      {/* Popular badge */}
      {isPopular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <Badge className="gap-1 px-3 py-1 text-xs font-semibold shadow-sm">
            <Zap className="w-3 h-3" />
            Most Popular
          </Badge>
        </div>
      )}

      <div className="p-8 flex flex-col h-full">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-foreground">
            {plan.displayName}
          </h3>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
            {plan.description}
          </p>
        </div>

        {/* Price */}
        <div className="mb-8">
          <div className="flex items-end gap-1">
            <span className="text-4xl font-extrabold text-foreground tracking-tight">
              {formatCurrency(plan.monthlyPrice)}
            </span>
            <span className="text-muted-foreground mb-1.5 text-sm">/month</span>
          </div>
          {plan.yearlyPrice && plan.yearlyPrice > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              or{" "}
              <span className="font-semibold text-foreground">
                {formatCurrency(plan.yearlyPrice)}
              </span>{" "}
              / year{" "}
              <span className="text-green-600 dark:text-green-400 font-medium">
                (save{" "}
                {Math.round(
                  ((plan.monthlyPrice * 12 - plan.yearlyPrice) /
                    (plan.monthlyPrice * 12)) *
                    100,
                )}
                %)
              </span>
            </p>
          )}
        </div>

        {/* CTA */}
        {useCallback ? (
          <Button
            onClick={() => onSelectPlan?.(plan)}
            variant={isPopular ? "default" : "outline"}
            size="lg"
            className="w-full mb-8 font-semibold"
          >
            Get Started
          </Button>
        ) : (
          <Link href={ctaHref} className="mb-8">
            <Button
              variant={isPopular ? "default" : "outline"}
              size="lg"
              className="w-full font-semibold"
            >
              Get Started
            </Button>
          </Link>
        )}

        {/* Features */}
        <div className="flex-1 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
            What&apos;s included
          </p>
          {plan.features.map((f, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <Check className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
              <span className="text-sm text-foreground leading-snug">
                {f.title}
              </span>
            </div>
          ))}
        </div>

        {/* Limits footer */}
        <div className="mt-8 pt-6 border-t border-border/60 space-y-2">
          <LimitRow
            label="Max Products"
            value={
              plan.maxProducts === 0 ? "Unlimited" : String(plan.maxProducts)
            }
          />
          <LimitRow label="Storage" value={`${plan.storageGB} GB`} />
          <LimitRow
            label="Monthly Requests"
            value={formatRequests(plan.monthlyRequests)}
          />
          <LimitRow
            label="Team Members"
            value={plan.maxUsers === 9999 ? "Unlimited" : String(plan.maxUsers)}
          />
        </div>
      </div>
    </div>
  );
}

function LimitRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}
