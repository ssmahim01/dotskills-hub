export type CustomerStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED';

export interface ICustomer {
  _id: string;
  store: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  totalOrders: number;
  totalSpent: number;
  isVIP: boolean;
  status: CustomerStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ICustomerResponse {
  success: boolean;
  data: ICustomer;
  message?: string;
}

export interface ICustomerListResponse {
  success: boolean;
  data: ICustomer[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message?: string;
}

export interface ICustomerAnalytics {
  totalCustomers: number;
  activeCustomers: number;
  blockedCustomers: number;
  vipCustomers: number;
  totalSpent: number;
  averageOrderValue: number;
}

export interface ICustomerAnalyticsResponse {
  success: boolean;
  data: ICustomerAnalytics;
  message?: string;
}

export type CreateCustomerInput = Omit<
  ICustomer,
  '_id' | 'totalOrders' | 'totalSpent' | 'status' | 'createdAt' | 'updatedAt'
> & {
  status?: CustomerStatus;
};

export type UpdateCustomerInput = Partial<CreateCustomerInput>;
