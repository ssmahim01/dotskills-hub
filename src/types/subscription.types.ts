export type SubscriptionStatus = 'pending' | 'approved' | 'rejected' | 'active' | 'cancelled';

export type PricingPlan = 'starter' | 'business' | 'enterprise';

export interface Subscription {
  id: string;
  name: string;
  email: string;
  plan: PricingPlan;
  amount: number;
  transactionId: string;
  screenshot: string;
  status: SubscriptionStatus;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string; 
  rejectionReason?: string;
}

export interface PricingTier {
  id: PricingPlan;
  name: string;
  displayName: string;
  price: number;
  currency: string;
  description: string;
  features: string[];
  storageGB: number;
  monthlyRequests: number;
  users: number;
}
