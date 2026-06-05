import { PricingPlan } from "./subscription.types";

export type StoreStatus = "active" | "suspended" | "inactive" | "pending";

export interface Store {
  id: string;
  storeName: string;
  subdomain: string;
  customDomain?: string;
  ownerName: string;
  ownerEmail: string;
  phone: string;
  package: PricingPlan;
  status: StoreStatus;
  createdAt: string;
  updatedAt: string;
  subscriptionId?: string;
  totalProducts?: number;
  totalOrders?: number;
  totalRevenue?: number;
  lastActivityAt?: string;
}

export interface StoreStatistics {
  storeId: string;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  activeCustomers: number;
  lastOrderDate?: string;
}

export interface CreateStorePayload {
  storeName: string;
  subdomain: string;
  ownerName: string;
  ownerEmail: string;
  phone: string;
  package: PricingPlan;
}

export interface UpdateStorePayload {
  storeName?: string;
  customDomain?: string;
  phone?: string;
  stats?: Partial<
    Pick<
      Store,
      "totalProducts" | "totalOrders" | "totalRevenue" | "lastActivityAt"
    >
  >;
  subscriptionId?: string;
  status?: StoreStatus;
  totalProducts?: number;
  totalOrders?: number;
  totalRevenue?: number;
  lastActivityAt?: string;
}
