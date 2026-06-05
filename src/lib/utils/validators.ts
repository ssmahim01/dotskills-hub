import { z } from 'zod';

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['super-admin', 'store-owner']),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }
);

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine(
  (data) => data.newPassword === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }
);

// Store Schemas
export const createStoreSchema = z.object({
  storeName: z.string().min(2, 'Store name must be at least 2 characters'),
  subdomain: z.string()
    .min(3, 'Subdomain must be at least 3 characters')
    .regex(/^[a-z0-9-]+$/, 'Subdomain can only contain lowercase letters, numbers, and hyphens'),
  ownerName: z.string().min(2, 'Owner name must be at least 2 characters'),
  ownerEmail: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  package: z.enum(['starter', 'business', 'enterprise']),
});

export const updateStoreSchema = z.object({
  storeName: z.string().min(2, 'Store name must be at least 2 characters').optional(),
  customDomain: z.string().url('Invalid domain URL').optional(),
  phone: z.string().min(10, 'Invalid phone number').optional(),
  status: z.enum(['active', 'suspended', 'inactive', 'pending']).optional(),
});

// User Schemas
export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['super-admin', 'store-owner']),
});

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  role: z.enum(['super-admin', 'store-owner']).optional(),
  status: z.enum(['active', 'inactive', 'suspended']).optional(),
});

// Settings Schemas
export const updateSettingsSchema = z.object({
  companyName: z.string().min(2, 'Company name required').optional(),
  companyEmail: z.string().email('Invalid email').optional(),
  companyPhone: z.string().min(10, 'Invalid phone').optional(),
  companyAddress: z.string().optional(),
  companyCity: z.string().optional(),
  companyCountry: z.string().optional(),
  contactEmail: z.string().email('Invalid email').optional(),
  contactPhone: z.string().min(10, 'Invalid phone').optional(),
});

// Subscription Schemas
export const approveSubscriptionSchema = z.object({
  storeName: z.string().min(2, 'Store name required'),
  subdomain: z.string()
    .min(3, 'Subdomain must be at least 3 characters')
    .regex(/^[a-z0-9-]+$/, 'Subdomain can only contain lowercase letters, numbers, and hyphens'),
  package: z.enum(['starter', 'business', 'enterprise']),
});

export const rejectSubscriptionSchema = z.object({
  reason: z.string().min(10, 'Rejection reason must be at least 10 characters'),
});

// Type exports for form usage
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type CreateStoreInput = z.infer<typeof createStoreSchema>;
export type UpdateStoreInput = z.infer<typeof updateStoreSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
export type ApproveSubscriptionInput = z.infer<typeof approveSubscriptionSchema>;
export type RejectSubscriptionInput = z.infer<typeof rejectSubscriptionSchema>;
