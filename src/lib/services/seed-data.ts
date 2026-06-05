import { User } from '../../types/auth.types';
import { Subscription } from '../../types/subscription.types';
import { Store } from '../../types/store.types';
import { UserManagement } from '../../types/user.types';
import { PlatformSettings } from '../../types/settings.types';

export const seedUsers: User[] = [
  {
    id: 'user-1',
    name: 'Admin User',
    email: 'admin@dotskills.com',
    password: 'admin123',
    role: 'super-admin',
    status: 'active',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  },
  {
    id: 'user-2',
    name: 'Demo Store Owner',
    email: 'owner@dotskills.com',
    password: 'owner123',
    role: 'store-owner',
    status: 'active',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner',
  },
];

export const seedSubscriptions: Subscription[] = [
  {
    id: 'sub-1',
    name: 'Farin Fusion',
    email: 'farin@example.com',
    plan: 'business',
    amount: 99,
    transactionId: 'TXN-2024-001',
    screenshot: 'https://images.unsplash.com/photo-1611632622046-f686de0ad657?w=500&h=300&fit=crop',
    status: 'approved',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    approvedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    approvedBy: 'user-1',
  },
  {
    id: 'sub-2',
    name: 'Tech Store Pro',
    email: 'techstore@example.com',
    plan: 'enterprise',
    amount: 299,
    transactionId: 'TXN-2024-002',
    screenshot: 'https://images.unsplash.com/photo-1611632621406-8d4d3328e113?w=500&h=300&fit=crop',
    status: 'approved',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    approvedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    approvedBy: 'user-1',
  },
  {
    id: 'sub-3',
    name: 'Fashion Plus',
    email: 'fashion@example.com',
    plan: 'starter',
    amount: 29,
    transactionId: 'TXN-2024-003',
    screenshot: 'https://images.unsplash.com/photo-1611632621061-e70db03b04cf?w=500&h=300&fit=crop',
    status: 'pending',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sub-4',
    name: 'Electronics Hub',
    email: 'electronics@example.com',
    plan: 'business',
    amount: 99,
    transactionId: 'TXN-2024-004',
    screenshot: 'https://images.unsplash.com/photo-1611632621063-2b56b2a40129?w=500&h=300&fit=crop',
    status: 'pending',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sub-5',
    name: 'Beauty Center',
    email: 'beauty@example.com',
    plan: 'starter',
    amount: 29,
    transactionId: 'TXN-2024-005',
    screenshot: 'https://images.unsplash.com/photo-1611632621055-eae44e8f2f1f?w=500&h=300&fit=crop',
    status: 'rejected',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    rejectionReason: 'Invalid payment proof',
  },
  {
    id: 'sub-6',
    name: 'Home Decor Plus',
    email: 'homedecor@example.com',
    plan: 'business',
    amount: 99,
    transactionId: 'TXN-2024-006',
    screenshot: 'https://images.unsplash.com/photo-1611632621059-e50e7f5a7d79?w=500&h=300&fit=crop',
    status: 'pending',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const seedStores: Store[] = [
  {
    id: 'store-1',
    storeName: 'Farin Fusion',
    subdomain: 'farin-fusion',
    customDomain: 'farinfusion.com',
    ownerName: 'Farin Hossain',
    ownerEmail: 'farin@example.com',
    phone: '+880123456789',
    package: 'business',
    status: 'active',
    subscriptionId: 'sub-1',
    createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    totalProducts: 245,
    totalOrders: 1240,
    totalRevenue: 45320,
    lastActivityAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'store-2',
    storeName: 'Tech Store Pro',
    subdomain: 'techstore-pro',
    customDomain: 'techstorepro.com',
    ownerName: 'John Tech',
    ownerEmail: 'techstore@example.com',
    phone: '+880987654321',
    package: 'enterprise',
    status: 'active',
    subscriptionId: 'sub-2',
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    totalProducts: 1200,
    totalOrders: 3450,
    totalRevenue: 125400,
    lastActivityAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'store-3',
    storeName: 'Fashion Plus',
    subdomain: 'fashion-plus',
    ownerName: 'Sara Fashion',
    ownerEmail: 'fashion@example.com',
    phone: '+880111222333',
    package: 'starter',
    status: 'pending',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  },
];

export const seedUserManagement: UserManagement[] = [
  {
    id: 'user-1',
    name: 'Admin User',
    email: 'admin@dotskills.com',
    role: 'super-admin',
    status: 'active',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    lastLoginAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'user-2',
    name: 'Demo Store Owner',
    email: 'owner@dotskills.com',
    role: 'store-owner',
    status: 'active',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    lastLoginAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    storeId: 'store-1',
  },
  {
    id: 'user-3',
    name: 'John Tech',
    email: 'john@example.com',
    role: 'store-owner',
    status: 'active',
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    lastLoginAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    storeId: 'store-2',
  },
  {
    id: 'user-4',
    name: 'Sarah Finance',
    email: 'sarah@dotskills.com',
    role: 'super-admin',
    status: 'active',
    createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
    lastLoginAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
];

export const seedSettings: PlatformSettings = {
  id: 'settings-1',
  companyName: 'DotSkillsHub',
  companyEmail: 'support@dotskills.com',
  companyPhone: '+880170123456',
  companyAddress: '123 Business Street',
  companyCity: 'Dhaka',
  companyCountry: 'Bangladesh',
  contactEmail: 'contact@dotskills.com',
  contactPhone: '+880170123456',
  paymentMethods: [
    {
      method: 'bkash',
      accountNumber: '01812345678',
      accountHolder: 'DotSkillsHub Ltd',
      instructions: 'Send payment to this bKash account',
      isEnabled: true,
    },
    {
      method: 'nagad',
      accountNumber: '88612345678',
      accountHolder: 'DotSkillsHub Ltd',
      instructions: 'Send payment to this Nagad account',
      isEnabled: true,
    },
    {
      method: 'bank-transfer',
      bankName: 'Example Bank',
      accountNumber: '123456789',
      accountHolder: 'DotSkillsHub Ltd',
      swiftCode: 'EXAMPLEBDXX',
      instructions: 'Use Swift code for international transfers',
      isEnabled: true,
    },
  ],
  updatedAt: new Date().toISOString(),
};

export function initializeStorageWithSeedData(): void {
  const STORAGE_KEYS = {
    AUTH_SESSION: 'dotskills_auth_session',
    USERS: 'dotskills_users',
    SUBSCRIPTIONS: 'dotskills_subscriptions',
    STORES: 'dotskills_stores',
    SETTINGS: 'dotskills_settings',
  };

  if (typeof window === 'undefined') return;

  // Initialize users
  if (!window.localStorage.getItem(STORAGE_KEYS.USERS)) {
    window.localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(seedUsers));
  }

  // Initialize subscriptions
  if (!window.localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS)) {
    window.localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(seedSubscriptions));
  }

  // Initialize stores
  if (!window.localStorage.getItem(STORAGE_KEYS.STORES)) {
    window.localStorage.setItem(STORAGE_KEYS.STORES, JSON.stringify(seedStores));
  }

  // Initialize users management
  if (!window.localStorage.getItem('dotskills_users_management')) {
    window.localStorage.setItem('dotskills_users_management', JSON.stringify(seedUserManagement));
  }

  // Initialize settings
  if (!window.localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    window.localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(seedSettings));
  }
}
