"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, ChevronRight } from "lucide-react";
import { ROUTES } from "@/lib/utils/constants";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";
import { sidebarConfig } from "@/lib/config/sidebar.config";

// interface NavItem {
//   href: string;
//   label: string;
//   icon: React.ReactNode;
//   badge?: number;
// }

// const dashboardItems: NavItem[] = [
//   {
//     href: ROUTES.DASHBOARD,
//     label: "Dashboard",
//     icon: <LayoutDashboard className="w-5 h-5" />,
//   },
//   {
//     href: ROUTES.SUBSCRIPTIONS,
//     label: "Subscriptions",
//     icon: <Zap className="w-5 h-5" />,
//     badge: 2,
//   },
//   {
//     href: ROUTES.PLANS,
//     label: "Pricing Plans",
//     icon: <Brain className="w-5 h-5" />,
//   },
//   {
//     href: ROUTES.STORES,
//     label: "Stores",
//     icon: <ShoppingCart className="w-5 h-5" />,
//   },
//   { href: ROUTES.USERS, label: "Users", icon: <Users className="w-5 h-5" /> },
//   {
//     href: ROUTES.SETTINGS,
//     label: "Settings",
//     icon: <Settings className="w-5 h-5" />,
//   },
// ];

export function Sidebar({ storeSlug }: { storeSlug?: string }) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user } = useUser();
  const { logout } = useUser();
  const router = useRouter();
  const navigationItems =
    user?.role === "ADMIN"
      ? sidebarConfig.ADMIN
      : user?.role === "OWNER"
        ? sidebarConfig.OWNER
        : [];

  const handleLogout = async () => {
    await logout();
    toast.success("Logout successful");
    router.push("/");
  };
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { value: savedExpanded, setValue: setSavedExpanded } = useLocalStorage(
    "dotskills_sidebar_collapsed",
    false,
  );

  // Initialize from localStorage
  useEffect(() => {
    if (savedExpanded !== null) {
      setTimeout(() => {
        setIsExpanded(!savedExpanded);
      }, 100);
    }
  }, [savedExpanded]);

  const toggleExpanded = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    setSavedExpanded(!newExpanded);
  };

  const getPath = (href: string) =>
    user?.role === "OWNER" ? `/${storeSlug}${href}` : href;

  const isActive = (href: string) => {
    const path = getPath(href);

    return pathname === path || pathname.startsWith(path + "/");
  };

  const sidebarContent = (
    <>
      {/* Header */}
      <div className="h-16 border-b border-border flex items-center justify-between px-4">
        {isExpanded && (
          <Link
            href={
              user?.role === "OWNER"
                ? `/${storeSlug}/dashboard`
                : ROUTES.DASHBOARD
            }
            className="flex items-center gap-2 font-bold text-lg"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              D
            </div>
            <span className="text-foreground">DotSkills</span>
          </Link>
        )}
        <button
          onClick={toggleExpanded}
          className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-accent transition-all"
        >
          {isExpanded ? (
            <ChevronRight className="w-5 h-5 rotate-180" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navigationItems.map((item) => (
          <div key={item.href} className="relative group">
            <Link
              href={
                user?.role === "OWNER" ? `/${storeSlug}${item.href}` : item.href
              }
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg
                transition-all duration-200 relative
                ${
                  isActive(item.href)
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent"
                }
              `}
              onMouseEnter={() => !isExpanded && setHoveredItem(item.href)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <span className="shrink-0 flex items-center justify-center">
                {item.icon}
              </span>
              {isExpanded && (
                <>
                  <span className="flex-1 text-sm font-medium">
                    {item.label}
                  </span>
                  {/* {item.badge && (
                    <span className="bg-destructive text-destructive-foreground text-xs font-semibold px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )} */}
                </>
              )}
            </Link>

            {/* Tooltip for collapsed state */}
            {!isExpanded && hoveredItem === item.href && (
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-popover border border-border rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap z-50 animate-in fade-in zoom-in-95 duration-200">
                {item.label}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <button
          onClick={handleLogout}
          className={`
            flex items-center gap-3 px-3 py-2.5 rounded-lg
            w-full text-foreground hover:bg-accent
            transition-all duration-200
          `}
        >
          <LogOut className="w-5 h-5" />
          {isExpanded && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`
          hidden md:flex flex-col bg-sidebar border-r border-border
          h-screen transition-all duration-300 fixed left-0 top-0 z-40
          ${isExpanded ? "w-64" : "w-20"}
        `}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden h-16 bg-card border-b border-border flex items-center justify-between px-4 fixed top-0 right-0 left-0 z-30">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="text-foreground p-2 rounded-lg hover:bg-accent"
        >
          {isMobileOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
        <span className="font-bold text-lg">DotSkills</span>
        <div className="w-10" /> {/* Spacer for alignment */}
      </div>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="fixed left-0 top-16 w-64 h-screen bg-sidebar border-r border-border z-30 md:hidden overflow-y-auto">
            <nav className="p-4 space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={
                    user?.role === "OWNER"
                      ? `/${storeSlug}${item.href}`
                      : item.href
                  }
                  onClick={() => setIsMobileOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg
                    transition-all duration-200
                    ${
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-accent"
                    }
                  `}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                  {/* {item.badge && (
                    <span className="ml-auto bg-destructive text-destructive-foreground text-xs font-semibold px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )} */}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}

      {/* Spacer for desktop */}
      <div
        className={`hidden md:block transition-all duration-300 ${isExpanded ? "w-64" : "w-20"}`}
      />

      {/* Spacer for mobile */}
      <div className="h-16 md:hidden" />
    </>
  );
}
