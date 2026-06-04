import { PricingTier } from '../types/subscription.types';

export const APP_NAME = 'DotSkillsHub';
export const APP_DESCRIPTION = 'Multi-tenant E-Commerce SaaS Platform';

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_SESSION: 'dotskills_auth_session',
  USERS: 'dotskills_users',
  SUBSCRIPTIONS: 'dotskills_subscriptions',
  STORES: 'dotskills_stores',
  SETTINGS: 'dotskills_settings',
  THEME: 'dotskills_theme',
  SIDEBAR_COLLAPSED: 'dotskills_sidebar_collapsed',
};

// User Roles
export const USER_ROLES = {
  SUPER_ADMIN: 'super-admin',
  STORE_OWNER: 'store-owner',
} as const;

// User Status
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
} as const;

// Subscription Status
export const SUBSCRIPTION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ACTIVE: 'active',
  CANCELLED: 'cancelled',
} as const;

// Store Status
export const STORE_STATUS = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  INACTIVE: 'inactive',
  PENDING: 'pending',
} as const;

// Pricing Plans
export const PRICING_PLANS = {
  STARTER: 'starter',
  BUSINESS: 'business',
  ENTERPRISE: 'enterprise',
} as const;

// Pricing Tiers
export const PRICING_TIERS: Record<string, PricingTier> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    displayName: 'Starter Plan',
    price: 29,
    currency: 'USD',
    description: 'Perfect for small businesses just starting out',
    features: [
      'Up to 100 products',
      '5GB storage',
      '100k monthly requests',
      'Basic analytics',
      'Email support',
      'Standard checkout',
    ],
    storageGB: 5,
    monthlyRequests: 100000,
    users: 1,
  },
  business: {
    id: 'business',
    name: 'Business',
    displayName: 'Business Plan',
    price: 99,
    currency: 'USD',
    description: 'For growing businesses with higher demand',
    features: [
      'Unlimited products',
      '100GB storage',
      '1M monthly requests',
      'Advanced analytics',
      'Priority support',
      'Custom domain',
      'Team collaboration (up to 5)',
      'API access',
      'Abandoned cart recovery',
    ],
    storageGB: 100,
    monthlyRequests: 1000000,
    users: 5,
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    displayName: 'Enterprise Plan',
    price: 299,
    currency: 'USD',
    description: 'For large-scale operations and enterprises',
    features: [
      'Unlimited products',
      '500GB storage',
      '10M monthly requests',
      'Custom analytics',
      'Dedicated support',
      'Multiple custom domains',
      'Unlimited team members',
      'Full API access',
      'Advanced integrations',
      'Custom development',
      'SLA guarantee',
      'White-label options',
    ],
    storageGB: 500,
    monthlyRequests: 10000000,
    users: 9999,
  },
};

// Payment Methods
export const PAYMENT_METHODS = {
  BKASH: 'bkash',
  NAGAD: 'nagad',
  BANK_TRANSFER: 'bank-transfer',
} as const;

// Routes
export const ROUTES = {
  // Public
  HOME: '/',
  PRICING: '/pricing',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',

  // Protected
  DASHBOARD: '/dashboard',
  SUBSCRIPTIONS: '/dashboard/subscriptions',
  STORES: '/dashboard/stores',
  USERS: '/dashboard/users',
  SETTINGS: '/dashboard/settings',
} as const;

// Validation Rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  SUBDOMAIN_PATTERN: /^[a-z0-9-]+$/,
  PHONE_MIN_LENGTH: 10,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// Table Actions
export const TABLE_ACTIONS = {
  VIEW: 'view',
  EDIT: 'edit',
  DELETE: 'delete',
  APPROVE: 'approve',
  REJECT: 'reject',
  ACTIVATE: 'activate',
  SUSPEND: 'suspend',
} as const;

// Mock Data Limits
export const MOCK_DATA_LIMITS = {
  MIN_SUBSCRIPTIONS: 5,
  MIN_STORES: 3,
  MIN_USERS: 4,
};

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#3b82f6',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  SECONDARY: '#8b5cf6',
} as const;

// Animation Durations (ms)
export const ANIMATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;
