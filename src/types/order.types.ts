export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';

export interface IOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface IOrder {
  _id: string;
  store: string;
  customer: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  shippingAddress?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IOrderResponse {
  success: boolean;
  data: IOrder;
  message?: string;
}

export interface IOrderListResponse {
  success: boolean;
  data: IOrder[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message?: string;
}

export interface IOrderAnalytics {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  totalItems: number;
}

export interface IOrderAnalyticsResponse {
  success: boolean;
  data: IOrderAnalytics;
  message?: string;
}

export type CreateOrderInput = Omit<
  IOrder,
  '_id' | 'status' | 'paymentStatus' | 'createdAt' | 'updatedAt'
> & {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
};

export type UpdateOrderInput = Partial<CreateOrderInput>;

export type OrderQueryParams = {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  customer?: string;
  search?: string;
};
