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
}: {
  children: React.ReactNode;
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
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Navbar */}
          <Navbar />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-4 py-6 md:px-6 md:py-8">
              {children}
            </div>
          </main>
        </div>
      </ReduxProvider>
  );
}
