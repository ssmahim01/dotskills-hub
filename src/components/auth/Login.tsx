/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/useAuth";
import { loginSchema } from "@/lib/utils/validators";
import { ROUTES } from "@/lib/utils/constants";
import { Circle } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    setErrors({});

    // Validate
    try {
      loginSchema.parse(formData);
    } catch (error: any) {
      const fieldErrors: Record<string, string> = {};
      if (error.errors) {
        error.errors.forEach((err: any) => {
          fieldErrors[err.path[0]] = err.message;
        });
      }
      setErrors(fieldErrors);
      return;
    }

    // Login
    const result = await login(formData.email, formData.password);
    if (result.success) {
      router.push(ROUTES.DASHBOARD);
    } else {
      setApiError(result.error || "Login failed");
    }
  };

  // Demo credentials hint
  const demoCredentials = [
    { email: "admin@dotskills.com", password: "admin123", role: "Super Admin" },
    { email: "owner@dotskills.com", password: "owner123", role: "Store Owner" },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-background to-muted flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-lg p-8 space-y-6">
          {/* Logo */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-lg mb-4">
              <span className="text-primary-foreground font-bold text-xl">
                D
              </span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">DotSkillsHub</h1>
            <p className="text-sm text-muted-foreground mt-1">
              E-Commerce SaaS Platform
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {apiError && (
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg text-sm">
                {apiError}
              </div>
            )}

            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground"
              >
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full"
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground"
              >
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full"
              />
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">{errors.password}</p>
              )}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? <Circle size="sm" /> : "Sign In"}
            </Button>
          </form>

          {/* Demo Info */}
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-xs font-semibold text-blue-900 dark:text-blue-200 mb-2">
              Demo Credentials:
            </p>
            <div className="space-y-1 text-xs text-blue-800 dark:text-blue-300">
              {demoCredentials.map((cred, idx) => (
                <div key={idx}>
                  <p className="font-medium">{cred.role}:</p>
                  <p>Email: {cred.email}</p>
                  <p>Password: {cred.password}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="space-y-2 text-center text-sm">
            <Link
              href={ROUTES.FORGOT_PASSWORD}
              className="text-primary hover:underline block"
            >
              Forgot password?
            </Link>
            <p className="text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href={ROUTES.REGISTER}
                className="text-primary hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
