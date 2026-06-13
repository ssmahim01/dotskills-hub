import type { IProduct } from "@/redux/features/Product/product.api";
import type { ICustomer } from "./customer.types";

export interface POSCartItem {
  product: IProduct;
  quantity: number;
}

export interface CartSummaryType {
  subtotal: number;
  discountAmount: number;
  deliveryCharge: number;
  taxAmount: number;
  advanceAmount: number;
  totalAmount: number;
  dueAmount: number;
}

export type OrderType = "PICKUP" | "DELIVERY";

export type ScheduleType = "INSTANT" | "SCHEDULED" | "HOLD";

export interface ScheduleConfig {
  type: ScheduleType;
  scheduledAt?: string;
}

export interface CustomerFormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  city?: string;
  zipCode?: string;
}

export type PaymentMethod =
  | "CASH"
  | "BKASH"
  | "NAGAD"
  | "ROCKET"
  | "UPAY"
  | "BANK_TRANSFER"
  | "CARD"
  | "COD";

export interface AdvancePayment {
  method?: PaymentMethod;
  amount: number;
}

export interface OrderSummary {
  subtotal: number;
  discountAmount: number;
  deliveryCharge: number;
  advanceAmount: number;
  taxAmount: number;
  totalAmount: number;
  dueAmount: number;
}

export interface CheckoutPayload {
  customer: CustomerFormData;
  selectedCustomer: ICustomer | null;
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  advance: AdvancePayment;
  discount: number;
  deliveryCharge: number;
  notes: string;
  
  summary: OrderSummary;
}