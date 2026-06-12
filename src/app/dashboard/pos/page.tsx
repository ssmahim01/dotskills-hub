import type { Metadata } from "next";
import { POSLayout } from "@/components/dashboard/pos/PosLayout";

export const metadata: Metadata = {
  title: "Point of Sale | Dashboard",
  description: "Create and manage in-store orders",
};

export default function POSPage() {
  return <POSLayout />;
}