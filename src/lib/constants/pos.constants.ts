import type { PaymentMethod } from "@/types/pos.types";

export const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "CASH", label: "Cash" },
  { value: "BKASH", label: "bKash" },
  { value: "NAGAD", label: "Nagad" },
  { value: "ROCKET", label: "Rocket" },
  { value: "UPAY", label: "Upay" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "CARD", label: "Card" },
  { value: "COD", label: "Cash on Delivery" },
];

export const ADVANCE_PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "BKASH", label: "bKash" },
  { value: "NAGAD", label: "Nagad" },
  { value: "ROCKET", label: "Rocket" },
  { value: "UPAY", label: "Upay" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "CARD", label: "Card" },
];

export const DEFAULT_ORDER_NOTES =
  "কাস্টমার পেমেন্ট ছাড়া পার্সেল খুলবেন না। খুললে ভিডিও বাধ্যতামূলক।";

export const LOW_STOCK_THRESHOLD = 5;

export const DEBOUNCE_MS = 400;