import {
  Truck,
  Package,
  Clock,
  Shield,
  MapPinned,
  Building2,
} from "lucide-react";

export const COURIER_PROVIDERS = [
  {
    value: "STEADFAST",
    name: "Steadfast",
    description: "Reliable nationwide courier service",
    badge: "Popular",
    features: [
      {
        icon: Truck,
        title: "Express Delivery",
      },
      {
        icon: Package,
        title: "Live Tracking",
      },
      {
        icon: Clock,
        title: "Quick Pickup",
      },
      {
        icon: Shield,
        title: "Secure Delivery",
      },
    ],
  },

  {
    value: "PATHAO",
    name: "Pathao Courier",
    description: "Fast urban & nationwide delivery",
    badge: "Fast",
    features: [
      {
        icon: Truck,
        title: "Same Day Coverage",
      },
      {
        icon: Package,
        title: "Tracking Support",
      },
      {
        icon: Clock,
        title: "Fast Pickup",
      },
      {
        icon: MapPinned,
        title: "Wide Network",
      },
    ],
  },
  {
    value: "PAPERFLY",
    name: "Paperfly Courier",
    description:
      "Trusted e-commerce delivery partner with nationwide coverage and COD support",
    badge: "Trusted",
    features: [
      {
        icon: Building2,
        title: "Nationwide Coverage",
      },
      {
        icon: Package,
        title: "Order Tracking",
      },
      {
        icon: Shield,
        title: "COD Support",
      },
      {
        icon: Clock,
        title: "Merchant Pickup",
      },
    ],
  },
];
