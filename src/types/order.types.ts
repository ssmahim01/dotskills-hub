export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

export type PaymentStatus = "pending" | "paid" | "refunded" | "failed";

export interface IOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface IOrder {
  _id?: string;
  store: string;

  orderNumber: string;

  customerName: string;
  customerPhone: string;

  customerEmail?: string;

  customerAddress?: string;
  source: string;
  cancelReason?: string;
  createdBy?: string;
  orderType: string;
  customer: string;

  notes?: string;

  items: IOrderItem[];

  subtotalAmount: number;

  deliveryCharge: number;

  discountAmount: number;

  totalAmount: number;

  paidAmount: number;

  dueAmount: number;

  paymentMethod: "CASH" | "COD" | "BKASH" | "NAGAD" | "ROCKET" | "BANK";

  status: OrderStatus;
  paymentStatus: PaymentStatus;

  advanceAmount?: number;
  transactionId?: string;

  trackingId?: string;

  deliveredAt?: Date;

  isDeleted: boolean;

  createdAt?: Date;

  updatedAt?: Date;
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
  "_id" | "status" | "paymentStatus" | "createdAt" | "updatedAt"
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
