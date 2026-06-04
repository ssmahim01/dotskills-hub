"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES, PRICING_TIERS } from "@/lib/utils/constants";
import { formatCurrency } from "@/lib/utils/formatters";
import { Check, ArrowLeft } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Navigation */}
      <nav className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </nav>

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

      {/* Pricing Cards */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {Object.values(PRICING_TIERS).map((plan) => (
              <div
                key={plan.id}
                className={`rounded-lg border p-8 transition-all flex flex-col ${
                  plan.id === "business"
                    ? "border-primary bg-primary/5 transform md:scale-105"
                    : "border-border bg-card"
                }`}
              >
                {/* Popular Badge */}
                {plan.id === "business" && (
                  <div className="inline-block px-4 py-1 bg-primary text-primary-foreground rounded-full text-sm font-semibold mb-4 w-fit">
                    Most Popular
                  </div>
                )}

                {/* Title & Description */}
                <h3 className="text-2xl font-bold text-foreground">
                  {plan.displayName}
                </h3>
                <p className="text-muted-foreground mt-2 flex-1">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mt-6 mb-6">
                  <span className="text-5xl font-bold text-foreground">
                    {formatCurrency(plan.price)}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>

                {/* CTA Button */}
                <Link href={ROUTES.REGISTER} className="mb-8">
                  <Button
                    className="w-full"
                    variant={plan.id === "business" ? "default" : "outline"}
                    size="lg"
                  >
                    Get Started
                  </Button>
                </Link>

                {/* Features */}
                <div className="space-y-4 flex-1">
                  <p className="text-sm font-semibold text-foreground mb-4">
                    Includes:
                  </p>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                      <span className="text-foreground text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Plan Details */}
                <div className="mt-8 pt-8 border-t border-border space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Storage</span>
                    <span className="font-semibold text-foreground">
                      {plan.storageGB}GB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Requests</span>
                    <span className="font-semibold text-foreground">
                      {plan.monthlyRequests >= 1000000
                        ? `${(plan.monthlyRequests / 1000000).toFixed(0)}M`
                        : `${(plan.monthlyRequests / 1000).toFixed(0)}K`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Team Members</span>
                    <span className="font-semibold text-foreground">
                      {plan.users === 9999 ? "Unlimited" : plan.users}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-card/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: "Can I change my plan later?",
                a: "Yes! You can upgrade or downgrade your plan anytime. Changes take effect at the next billing cycle.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept bKash, Nagad, Bank Transfer, and all major credit cards. Flexible payment terms available for enterprise plans.",
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
                a: "Yes! Save 20% when you choose annual billing instead of monthly.",
              },
              {
                q: "What&apos;s included in support?",
                a: "All plans include email support. Starter includes community support, Business and Enterprise get priority support.",
              },
            ].map((item, idx) => (
              <div key={idx} className="border border-border rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-2">{item.q}</h3>
                <p className="text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold text-foreground">
            Ready to get started?
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of successful merchants using DotSkillsHub
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={ROUTES.REGISTER}>
              <Button size="lg">Create Your Free Account</Button>
            </Link>
            <a href="mailto:contact@dotskills.com">
              <Button size="lg" variant="outline">
                Contact Sales
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 DotSkillsHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
