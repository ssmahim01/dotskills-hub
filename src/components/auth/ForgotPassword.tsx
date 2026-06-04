/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { forgotPasswordSchema } from "@/lib/utils/validators";
import { ROUTES } from "@/lib/utils/constants";
import { Mail, ArrowLeft, Circle } from "lucide-react";
import { authService } from "@/lib/services/auth.service";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      forgotPasswordSchema.parse({ email });
    } catch (err: any) {
      if (err.errors?.[0]) {
        setError(err.errors[0].message);
      }
      return;
    }

    setIsLoading(true);
    try {
      const result = authService.forgotPassword(email);
      if (result.success) {
        setIsSubmitted(true);
      } else {
        setError(result.error || "Failed to process request");
      }
    } finally {
      setIsLoading(false);
    }
  };

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
            <h1 className="text-2xl font-bold text-foreground">
              Reset Password
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              We&apos;ll help you reset your password
            </p>
          </div>

          {isSubmitted ? (
            <div className="space-y-4 text-center">
              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-green-800 dark:text-green-200 text-sm">
                  Check your email for a password reset link. If you don&apos;t
                  see it, check your spam folder.
                </p>
              </div>
              <Button
                onClick={() => router.push(ROUTES.LOGIN)}
                variant="outline"
                className="w-full"
              >
                Back to Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <p className="text-sm text-muted-foreground">
                Enter your email address and we&apos;ll send you a link to reset
                your password.
              </p>

              <div>
                <label
                  htmlFor="forgot-email"
                  className="block text-sm font-medium text-muted-foreground mb-1"
                >
                  Email
                </label>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4" />
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    required
                  />
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Circle size="sm" /> : "Send Reset Link"}
              </Button>

              <Link
                href={ROUTES.LOGIN}
                className="flex items-center gap-2 justify-center text-sm text-primary hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
