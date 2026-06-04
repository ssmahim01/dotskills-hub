/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/useAuth';
import { registerSchema } from '@/lib/utils/validators';
import { ROUTES } from '@/lib/utils/constants';
import { Mail, Lock, User, UserCheck, Circle } from 'lucide-react';

export default function Register() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'store-owner',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    setApiError('');
    setErrors({});

    try {
      registerSchema.parse(formData);
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

    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.role as 'super-admin' | 'store-owner'
    );

    if (result.success) {
      router.push(ROUTES.DASHBOARD);
    } else {
      setApiError(result.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-background to-muted flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-lg p-8 space-y-6">
          {/* Logo */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-lg mb-4">
              <span className="text-primary-foreground font-bold text-xl">D</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
            <p className="text-sm text-muted-foreground mt-1">Join DotSkillsHub today</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {apiError && (
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg text-sm">
                {apiError}
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Full Name
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <User className="w-4 h-4" />
                </span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="role" className="text-sm font-medium text-foreground">
                Account Type
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-input bg-background py-2 px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="store-owner">Store Owner</option>
                <option value="super-admin">Super Admin</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <p className="text-xs text-muted-foreground">At least 6 characters</p>
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                Confirm Password
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <UserCheck className="w-4 h-4" />
                </span>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? <Circle size="sm" /> : 'Create Account'}
            </Button>
          </form>

          {/* Links */}
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href={ROUTES.LOGIN} className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
