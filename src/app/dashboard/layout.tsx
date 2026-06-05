'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/lib/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/lib/utils/constants';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading, logout } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <Skeleton />;
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push(ROUTES.LOGIN);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar onLogout={handleLogout} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-6 md:px-6 md:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
