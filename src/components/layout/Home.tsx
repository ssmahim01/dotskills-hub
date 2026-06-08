"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/utils/constants";
import {
  ArrowRight,
  Check,
  Zap,
  ShoppingCart,
  BarChart3,
  Users,
  Cloud,
} from "lucide-react";
import { HomePricingSection } from "../common/Pricing";
import { IPlan } from "@/redux/features/Plan/plan.api";

export default function Home({ plans }: { plans: IPlan[] }) {
  return (
    <div className="bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
              D
            </div>
            <span className="font-bold text-lg text-foreground">
              DotSkillsHub
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href={ROUTES.PRICING}
              className="text-foreground hover:text-primary transition-colors"
            >
              Pricing
            </Link>
            <Link
              href={ROUTES.LOGIN}
              className="text-foreground hover:text-primary transition-colors"
            >
              Sign In
            </Link>
            <Link href={ROUTES.REGISTER}>
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 rounded-full text-sm font-semibold">
            ✨ Multi-Tenant E-Commerce SaaS Platform
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-foreground">
            Empower Your E-Commerce Business
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Launch and manage multiple online stores with our comprehensive SaaS
            platform. Built for growth, designed for simplicity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href={ROUTES.REGISTER}>
              <Button size="lg" className="w-full sm:w-auto">
                Start Free Trial <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href={ROUTES.PRICING}>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                View Pricing
              </Button>
            </Link>
          </div>

          {/* Demo Credentials */}
          {/* <div className="mt-8 bg-card border border-border rounded-lg p-6 inline-block text-left">
            <p className="text-sm font-semibold text-muted-foreground mb-3">Demo Login:</p>
            <div className="space-y-2 text-sm">
              <p>Email: <code className="bg-muted px-2 py-1 rounded">admin@dotskills.com</code></p>
              <p>Password: <code className="bg-muted px-2 py-1 rounded">admin123</code></p>
            </div>
          </div> */}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-16">
            Powerful Features for Your Success
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <ShoppingCart className="w-6 h-6" />,
                title: "Multi-Store Management",
                description:
                  "Create and manage unlimited e-commerce stores from a single dashboard",
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Lightning Fast",
                description:
                  "Optimized performance for maximum conversions and user satisfaction",
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Team Collaboration",
                description:
                  "Invite team members with custom roles and permissions",
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: "Advanced Analytics",
                description:
                  "Real-time insights into your store performance and customer behavior",
              },
              {
                icon: <Cloud className="w-6 h-6" />,
                title: "Cloud Hosted",
                description:
                  "Secure, scalable infrastructure with automatic backups",
              },
              {
                icon: <Check className="w-6 h-6" />,
                title: "24/7 Support",
                description: "Dedicated support team ready to help you succeed",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-background border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <HomePricingSection plans={plans} />

      {/* CTA Section */}
      {/* <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold text-foreground">Ready to Transform Your Business?</h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of successful merchants already using DotSkillsHub
          </p>
          <Link href={ROUTES.REGISTER}>
            <Button size="lg" className="px-8">
              Get Started Today <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-foreground mb-4">DotSkillsHub</h4>
              <p className="text-muted-foreground text-sm">
                The all-in-one platform for multi-tenant e-commerce
              </p>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 DotSkillsHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
