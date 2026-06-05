import Home from "@/components/layout/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | Dotskills Hub",
  description:
    "Welcome to Dotskills Hub, your all-in-one platform for managing your online store, users, and settings with ease.",
};

export default function HomePage() {
  return <Home />;
}
