import type { Metadata } from "next";
import SubscriptionApply from "@/components/subscription/Subscription";

export const metadata: Metadata = {
  title: "Apply for Subscription | DotSkillsHub",
  description:
    "Apply for a DotSkillsHub subscription plan and start managing your online business with powerful tools and automation.",

  keywords: [
    "subscription",
    "apply subscription",
    "ecommerce saas",
    "store management",
    "online business",
    "DotSkillsHub",
  ],

  robots: {
    index: false,
    follow: false,
  },

  openGraph: {
    title: "Apply for Subscription | DotSkillsHub",
    description:
      "Submit your subscription request and get access to DotSkillsHub.",
    type: "website",
  },
};

export default function SubscriptionApplyPage() {
  return <SubscriptionApply />;
}
