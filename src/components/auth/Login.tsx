"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/utils/constants";
import { loginUser } from "@/utils/loginUser";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import {
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  ShoppingBag,
  TrendingUp,
  Package,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthRedirect } from "@/lib/hooks/useAuthRedirect";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const highlights = [
  {
    icon: ShoppingBag,
    title: "Order Management",
    desc: "Track and manage every order in real time",
  },
  {
    icon: TrendingUp,
    title: "Analytics & Reports",
    desc: "Data-driven insights to grow your business",
  },
  {
    icon: Package,
    title: "Inventory Control",
    desc: "Smart stock tracking across all products",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    desc: "Role-based access for your entire team",
  },
];

export default function Login() {
  const router = useRouter();
  const { login } = useUser();
  const { redirectAfterAuth } = useAuthRedirect();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    const res = await loginUser(data);

    if (res.success) {
      login(res.user.user);
      toast.success("Welcome back!");
      if (res.user.user.role === "CUSTOMER") {
        router.push("/dashboard");
        redirectAfterAuth();

      } else if (res.user.user.role === "ADMIN") {
        router.push("/dashboard/admin");
        redirectAfterAuth();

      } else {
        router.push("/");
        redirectAfterAuth();
      }
    } else {
      setError("root", {
        message: res.message || "Invalid email or password. Please try again.",
      });
      toast.error(res.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <div
        className="
        hidden lg:flex lg:w-[52%]
        flex-col justify-between
        relative overflow-hidden
        px-14 py-12
        bg-linear-to-br
        from-primary
        via-primary/90
        to-indigo-700
        dark:from-slate-900
        dark:via-indigo-950
        dark:to-slate-950
      "
      >
        {/* Background texture */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 80%, #000 1px, transparent 1px), radial-gradient(circle at 80% 20%, #000 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-indigo-600/30 blur-3xl" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm shadow-sm">
            <span className="text-white font-black text-lg tracking-tight">
              D
            </span>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            DotSkillsHub
          </span>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 space-y-6">
          <div>
            <h2 className="text-4xl font-black text-white leading-tight tracking-tight">
              Run your store
              <br />
              <span className="text-white/70">smarter, faster.</span>
            </h2>
            <p className="mt-4 text-white/80 text-base leading-relaxed max-w-sm">
              The all-in-one e-commerce operations platform built for modern
              businesses in Bangladesh and beyond.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-4">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-start gap-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                    <Icon className="h-4.5 w-4.5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {item.title}
                    </p>
                    <p className="text-xs text-white/65 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom tagline */}
        <p className="relative z-10 text-xs text-white/50 tracking-wide">
          © 2025 DotSkillsHub · E-Commerce SaaS Platform
        </p>
      </div>

      <div className="lg:border-l-4 lg:border-indigo-400 flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-16">
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-2.5 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 shadow-sm shadow-indigo-200">
            <span className="text-white font-black text-base">D</span>
          </div>
          <span className="font-bold text-gray-900 dark:text-white text-base">
            DotSkillsHub
          </span>
        </div>

        <div className="w-full max-w-100 space-y-7">
          {/* Heading */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Sign in to your account
            </h1>
            <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
              Welcome back — enter your details below
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
          >
            {/* Root / API error */}
            {errors.root && (
              <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 dark:border-red-800/50 dark:bg-red-950/40 px-4 py-3">
                <div className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-red-500 flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">!</span>
                </div>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {errors.root.message}
                </p>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className={cn(
                    "h-11 pl-10 rounded-lg text-sm transition-colors",
                    errors.email
                      ? "border-red-400 focus-visible:ring-red-400 dark:border-red-600"
                      : "border-gray-200 focus-visible:ring-indigo-400 dark:border-gray-700",
                  )}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>
                <Link
                  href={ROUTES.FORGOT_PASSWORD}
                  className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-500 dark:hover:text-indigo-400 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  {...register("password")}
                  className={cn(
                    "h-11 pl-10 rounded-lg text-sm transition-colors",
                    errors.password
                      ? "border-red-400 focus-visible:ring-red-400 dark:border-red-600"
                      : "border-gray-200 focus-visible:ring-indigo-400 dark:border-gray-700",
                  )}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 dark:text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "hover:cursor-pointer w-full h-11 rounded-lg font-semibold text-sm tracking-wide border-0 mt-1",
                "bg-linear-to-b from-indigo-400 to-indigo-500 hover:from-indigo-300 hover:to-indigo-400",
                "text-white shadow-sm hover:shadow-md transition-all duration-150",
                "disabled:opacity-60 disabled:cursor-not-allowed",
              )}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              href={ROUTES.REGISTER}
              className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
            >
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
