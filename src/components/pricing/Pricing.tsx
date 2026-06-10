"use client";

import { PricingGrid } from "./PricingGrid";
import { IPlan } from "@/redux/features/Plan/plan.api";

const FAQ_ITEMS = [
  {
    q: "Can I change my plan later?",
    a: "Yes! You can upgrade or downgrade your plan anytime. Changes take effect at the next billing cycle.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept bKash, Nagad, Rocket, Bank Transfer, and Manual payment options. Flexible payment terms are available for enterprise plans.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes! All new accounts get a 14-day free trial. No credit card required to get started.",
  },
  {
    q: "What if I need more resources?",
    a: "Contact our sales team for custom enterprise plans tailored to your specific needs.",
  },
  {
    q: "Do you offer discounts for annual billing?",
    a: "Yes! Save up to 20% when you choose annual billing instead of monthly.",
  },
  {
    q: "What's included in support?",
    a: "All plans include email support. Starter includes community support; Business and Enterprise get priority support with faster response times.",
  },
];

export default function Pricing({ plans }: { plans: IPlan[] }) {
  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose the perfect plan for your business. Upgrade or downgrade
            anytime.
          </p>
        </div>
      </section>

      {/* Pricing Cards — fully dynamic */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <PricingGrid plans={plans} />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {FAQ_ITEMS.map((item, idx) => (
              <div key={idx} className="border border-border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-2">{item.q}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
