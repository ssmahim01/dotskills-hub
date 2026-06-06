"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/lib/utils/constants";
import {
  Mail,
  Lock,
  User,
  UserCheck,
  Phone,
  MapPin,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Star,
  Zap,
  Shield,
  HeadphonesIcon,
} from "lucide-react";
import { registerUser } from "@/utils/registerUser";
import { toast } from "sonner";
import { loginUser } from "@/utils/loginUser";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";

const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Full name is required")
      .min(2, "Name must be at least 2 characters")
      .max(60, "Name is too long"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^[\d\s\+\-\(\)]{7,15}$/, "Enter a valid phone number"),
    address: z.string().optional(),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const benefits = [
  {
    icon: Zap,
    title: "Up and running in minutes",
    desc: "No complex setup. Connect your store and start selling immediately.",
  },
  {
    icon: Shield,
    title: "Secure by default",
    desc: "Role-based access control keeps your data safe at every level.",
  },
  {
    icon: Star,
    title: "Built for Bangladesh",
    desc: "Steadfast, Pathao, RedX and more courier integrations out of the box.",
  },
  {
    icon: HeadphonesIcon,
    title: "Dedicated support",
    desc: "Our team is here to help you grow — whenever you need us.",
  },
];

const perks = [
  "Free 14-day trial, no credit card",
  "Cancel anytime, no lock-in",
  "All courier integrations included",
  "Unlimited orders on Pro plan",
];

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

export default function Register() {
  const router = useRouter();
  const { login } = useUser();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        password: data.password,
      }),
    );

    const res = await registerUser(formData);

    if (res.success) {
      toast.success("Account created! Signing you in…");
      reset();

      const loggedIn = await loginUser({
        email: data.email,
        password: data.password,
      });

      login(loggedIn.user.user);

      if (loggedIn.user.user.role === "CUSTOMER") {
        router.push("/dashboard");
      } else if (loggedIn.user.user.role === "ADMIN") {
        router.push("/dashboard/admin");
      } else {
        router.push("/");
      }
    } else {
      setError("root", {
        message: res.message || "Registration failed. Please try again.",
      });
      toast.error(res.message || "Registration failed");
    }
  };

  const inputClass = (hasError?: boolean) =>
    cn(
      "h-10 rounded-lg text-sm transition-colors",
      hasError
        ? "border-red-400 focus-visible:ring-red-400 dark:border-red-600"
        : "border-gray-200 focus-visible:ring-indigo-400 dark:border-gray-700",
    );

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-950">
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 lg:px-14 lg:py-12 order-1">
        {/* Mobile logo */}
        <div className="mb-6 flex items-center gap-2.5 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 shadow-sm shadow-indigo-200">
            <span className="text-white font-black text-base">D</span>
          </div>
          <span className="font-bold text-gray-900 dark:text-white text-base">
            DotSkillsHub
          </span>
        </div>

        <div className="w-full max-w-110 space-y-6">
          {/* Heading */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Create your account
            </h1>
            <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
              Join thousands of store owners — free for 14 days
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
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

            {/* Name + Phone — 2 col */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Full name" error={errors.fullName?.message}>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    autoComplete="name"
                    placeholder="John Doe"
                    {...register("fullName")}
                    className={cn(inputClass(!!errors.fullName), "pl-9")}
                  />
                </div>
              </Field>

              <Field label="Phone" error={errors.phone?.message}>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="tel"
                    autoComplete="tel"
                    placeholder="01XXXXXXXXX"
                    {...register("phone")}
                    className={cn(inputClass(!!errors.phone), "pl-9")}
                  />
                </div>
              </Field>
            </div>

            {/* Email */}
            <Field label="Email address" error={errors.email?.message}>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className={cn(inputClass(!!errors.email), "pl-9")}
                />
              </div>
            </Field>

            {/* Address (optional) */}
            <Field label="Address (optional)" error={errors.address?.message}>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  autoComplete="street-address"
                  placeholder="Dhaka, Bangladesh"
                  {...register("address")}
                  className={cn(inputClass(!!errors.address), "pl-9")}
                />
              </div>
            </Field>

            {/* Password + Confirm — 2 col */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Password" error={errors.password?.message}>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="password"
                    autoComplete="new-password"
                    placeholder="Min. 6 characters"
                    {...register("password")}
                    className={cn(inputClass(!!errors.password), "pl-9")}
                  />
                </div>
              </Field>

              <Field
                label="Confirm password"
                error={errors.confirmPassword?.message}
              >
                <div className="relative">
                  <UserCheck className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="password"
                    autoComplete="new-password"
                    placeholder="Repeat password"
                    {...register("confirmPassword")}
                    className={cn(inputClass(!!errors.confirmPassword), "pl-9")}
                  />
                </div>
              </Field>
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
                  Creating your account…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Create free account
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href={ROUTES.LOGIN}
              className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-[48%] flex-col justify-between relative overflow-hidden bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 px-14 py-12 order-2">
        {/* indigo accent line */}
        <div className="absolute inset-y-0 left-0 w-1 bg-linear-to-b from-indigo-400 via-indigo-500 to-indigo-300" />
        {/* Background dots */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Glow */}
        <div className="absolute top-1/3 right-0 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 shadow-lg shadow-indigo-900/50">
            <span className="text-white font-black text-lg">D</span>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            DotSkillsHub
          </span>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-4xl font-black text-white leading-tight tracking-tight">
              Everything you need
              <br />
              <span className="text-indigo-400">to scale.</span>
            </h2>
            <p className="mt-4 text-gray-400 text-base leading-relaxed max-w-sm">
              From your first order to your ten-thousandth — DotSkillsHub grows
              with your business every step of the way.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-5">
            {benefits.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-start gap-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 border border-indigo-500/20">
                    <Icon className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Perks checklist */}
          <div className="rounded-xl border border-gray-700/60 bg-gray-800/50 backdrop-blur-sm p-5 space-y-2.5">
            {perks.map((perk) => (
              <div key={perk} className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-indigo-400" />
                <span className="text-sm text-gray-300">{perk}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-gray-600">
          © 2025 DotSkillsHub · Trusted by 500+ stores
        </p>
      </div>
    </div>
  );
}
