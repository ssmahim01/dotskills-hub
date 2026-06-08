/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import { Bell, Moon, Sun, LogOut, User, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/lib/providers/ThemeProvider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useUser();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      logout();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "US";

  const getRoleDisplay = () => {
    switch (user?.role) {
      case "ADMIN":
        return "Super Admin";
      case "OWNER":
        return "Store Owner";
      default:
        return "User";
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/60">
      <div className="px-4 md:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="hidden md:flex flex-1 max-w-md">
            <Input placeholder="Search..." className="bg-muted/50 h-9" />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 md:gap-4 ml-auto">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 rounded-lg transition-all duration-200 active:scale-95"
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full animate-pulse" />
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 rounded-lg transition-all duration-200 active:scale-95"
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>

            {/* Divider - Hidden on mobile */}
            <div className="hidden md:block h-6 w-px bg-border" />

            {/* User Menu */}
            <DropdownMenu
              open={mobileMenuOpen}
              onOpenChange={setMobileMenuOpen}
            >
              <DropdownMenuTrigger>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 md:gap-3 px-2 md:px-3 h-9 rounded-lg hover:bg-accent transition-all"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {userInitials}
                  </div>
                  <div className="hidden md:block text-left text-sm">
                    <p className="font-medium text-foreground leading-none">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground leading-none">
                      {getRoleDisplay()}
                    </p>
                  </div>
                  <ChevronDown className="hidden md:block h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 md:w-64">
                {/* User Info Section */}
                <div className="px-4 py-3 md:hidden">
                  <p className="font-medium text-foreground">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email || "No email"}
                  </p>
                  <p className="text-xs text-primary font-medium mt-1">
                    {getRoleDisplay()}
                  </p>
                </div>
                <DropdownMenuSeparator className="md:hidden" />

                {/* Desktop User Info */}
                <div className="hidden md:block px-4 py-3 border-b border-border">
                  <p className="font-medium text-foreground text-sm">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email || "No email"}
                  </p>
                  <p className="text-xs text-primary font-medium mt-2">
                    {getRoleDisplay()}
                  </p>
                </div>

                {/* Menu Items */}
                <DropdownMenuItem
                  onClick={() => router.push("/profile")}
                  className="cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
              
                <DropdownMenuSeparator />

                {/* Logout */}
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Search - Visible only on small screens */}
        <div className="md:hidden pb-3">
          <Input placeholder="Search..." className="bg-muted/50 h-8 text-sm" />
        </div>
      </div>
    </nav>
  );
}
