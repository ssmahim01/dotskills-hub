/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/utils/constants";
import { useUser } from "@/context/UserContext";
import ThemeToggle from "./ThemeToggle";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useGetMyStoreQuery } from "@/redux/features/Store/store.api";

export default function Navbar() {
  const { user, logout } = useUser();
  const router = useRouter();
  const { data: myStore } = useGetMyStoreQuery();
  // console.log(myStore);

  const handleLogout = async () => {
    try {
      logout();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
              D
            </div>

            <span className="font-bold text-lg">DotSkillsHub</span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link href={ROUTES.PRICING}>Pricing</Link>

          <ThemeToggle />

          {user ? (
            <>
              <Link
                href={
                  user?.role === "OWNER"
                    ? `/${myStore?.data?.slug}/dashboard`
                    : user?.role === "ADMIN"
                      ? "/admin"
                      : "/dashboard"
                }
              >
                <Button>Dashboard</Button>
              </Link>

              <Button
                onClick={handleLogout}
                variant={"ghost"}
                className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Link href={ROUTES.LOGIN}>Sign In</Link>

              <Link href={ROUTES.REGISTER}>
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
