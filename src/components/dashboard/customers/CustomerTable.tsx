/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/dashboard/shared/Skeleton";
import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import { CustomerStatusBadge } from "./CustomerStatusBadge";
import { CustomerActions } from "./CustomerActions";
import type { ICustomer } from "@/types/customer.types";
import { User } from "lucide-react";

interface CustomerTableProps {
  customers: ICustomer[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onView: (customer: ICustomer) => void;
  onEdit: (customer: ICustomer) => void;
  onDelete: (customer: ICustomer) => void;
  onActivate: (customer: ICustomer) => void;
  onBlock: (customer: ICustomer) => void;
  onToggleVIP: (customer: ICustomer) => void;
  actionLoading?: Record<string, boolean>;
}

export function CustomerTable({
  customers,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  onActivate,
  onBlock,
  onToggleVIP,
  actionLoading = {},
}: CustomerTableProps) {
  if (isLoading && customers.length === 0) {
    return (
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-6 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-12" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-8" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <EmptyState
        icon={User}
        title="No customers found"
        description="Start by creating your first customer or adjusting your filters."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="text-right">Orders</TableHead>
              <TableHead className="text-right">Total Spent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => {
              const isLoading = actionLoading[customer._id];
              return (
                <TableRow
                  key={customer._id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      {customer.email && (
                        <p className="text-sm text-muted-foreground break-all">
                          {customer.email}
                        </p>
                      )}
                      <p className="text-sm font-medium">{customer.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {customer.totalOrders}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    $
                    {customer.totalSpent.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell>
                    <CustomerStatusBadge
                      status={customer.status}
                      isVIP={customer.isVIP}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <CustomerActions
                      customer={customer}
                      onView={() => onView(customer)}
                      onEdit={() => onEdit(customer)}
                      onDelete={() => onDelete(customer)}
                      onActivate={() => onActivate(customer)}
                      onBlock={() => onBlock(customer)}
                      onToggleVIP={() => onToggleVIP(customer)}
                      isLoading={isLoading}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination {...({ currentPage, totalPages, onPageChange } as any)} />
        </div>
      )}
    </div>
  );
}
