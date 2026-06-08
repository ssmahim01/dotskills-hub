import Pricing from "@/components/pricing/Pricing";
import { getPublicPlans } from "@/lib/services/plan.service";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing Plans | DotSkillsHub",
  description:
    "Choose the perfect DotSkillsHub subscription plan for your e-commerce business. Compare Starter, Business, and Enterprise plans.",

  keywords: [
    "pricing",
    "subscription plans",
    "ecommerce saas",
    "store management",
    "courier management",
    "inventory management",
    "DotSkillsHub",
  ],

  openGraph: {
    title: "Pricing Plans | DotSkillsHub",
    description:
      "Flexible pricing plans designed for growing online businesses.",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default async function PricingPage() {
  const plans = await getPublicPlans();
  return <Pricing plans={plans} />;
}
