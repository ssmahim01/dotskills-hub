"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PricingGrid } from "../pricing/PricingGrid";
import { IPlan } from "@/redux/features/Plan/plan.api";

export function HomePricingSection({ plans }: { plans: IPlan[] }) {
  return (
    <section className="py-24 px-4 bg-background" id="pricing">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 space-y-4">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Pricing
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your business. No hidden fees. Upgrade
            or downgrade at any time.
          </p>
        </div>

        <PricingGrid plans={plans} />

        {/* Link to full pricing page */}
        <div className="mt-12 text-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View full pricing details
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
