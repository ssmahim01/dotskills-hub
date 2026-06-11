'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ORDER_STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS, ORDER_SORT_OPTIONS } from '@/lib/constants/order.constants';
import type { OrderStatus, PaymentStatus } from '@/types/order.types';

interface OrderFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  orderStatus: OrderStatus | '';
  onOrderStatusChange: (value: OrderStatus | '') => void;
  paymentStatus: PaymentStatus | '';
  onPaymentStatusChange: (value: PaymentStatus | '') => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  isLoading?: boolean;
}

export function OrderFilters({
  search,
  onSearchChange,
  orderStatus,
  onOrderStatusChange,
  paymentStatus,
  onPaymentStatusChange,
  sortBy,
  onSortChange,
  isLoading = false,
}: OrderFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search orders by ID, customer name, or email..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          disabled={isLoading}
          className="pl-10"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
        <Select value={orderStatus} onValueChange={(value) => onOrderStatusChange(value === '' ? '' : (value as OrderStatus))}>
          <SelectTrigger className="w-full sm:w-45" disabled={isLoading}>
            <SelectValue placeholder="Filter by order status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Order Status</SelectItem>
            {ORDER_STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={paymentStatus} onValueChange={(value) => onPaymentStatusChange(value === '' ? '' : (value as PaymentStatus))}>
          <SelectTrigger className="w-full sm:w-45" disabled={isLoading}>
            <SelectValue placeholder="Filter by payment status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Payment Status</SelectItem>
            {PAYMENT_STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(value) => onSortChange(value ?? '')}>
          <SelectTrigger className="w-full sm:w-45" disabled={isLoading}>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {ORDER_SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
