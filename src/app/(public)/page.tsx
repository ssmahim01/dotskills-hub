import Home from "@/components/layout/Home";
import { getPublicPlans } from "@/lib/services/plan.service";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | Dotskills Hub",
  description:
    "Welcome to Dotskills Hub, your all-in-one platform for managing your online store, users, and settings with ease.",
};

export default async function HomePage() {
  const plans = await getPublicPlans();
  return <Home plans={plans} />;
}
