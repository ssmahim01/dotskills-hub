"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { ROUTES } from "@/lib/utils/constants";
import ReduxProvider from "@/providers/ReduxProvider";
import { useUser } from "@/context/UserContext";

export default function DashboardLayout({
  children,
  storeSlug,
}: {
  children: React.ReactNode;
  storeSlug?: string;
}) {
  const router = useRouter();
  const { user } = useUser();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push(ROUTES.LOGIN);
    }
  }, [user, router]);

  return (
    <ReduxProvider>
      {/* Sidebar */}
      <Sidebar storeSlug={storeSlug} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto">{children}</div>
        </main>
      </div>
    </ReduxProvider>
  );
}
