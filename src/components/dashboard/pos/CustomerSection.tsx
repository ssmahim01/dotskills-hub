"use client";

import React from "react";
import { Search, UserCheck, UserX, X, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { ICustomer } from "@/types/customer.types";
import type { CustomerFormData, OrderType } from "@/types/pos.types";
import { useCustomerSearch } from "@/lib/hooks/useCustomerSearch";

interface CustomerSectionProps {
  form: CustomerFormData;
  onChange: (data: Partial<CustomerFormData>) => void;
  orderType: OrderType;
}

const fieldCls =
  "text-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:border-violet-400 dark:focus:border-violet-500 transition-colors rounded-lg";

export function CustomerSection({
  form,
  onChange,
  orderType,
}: CustomerSectionProps) {
  const {
    query,
    setQuery,
    customers,
    isFetching,
    selectedCustomer,
    selectCustomer,
    clearCustomer,
    showDropdown,
  } = useCustomerSearch();

  // When a customer is selected, auto-fill form fields
  const handleSelectCustomer = (customer: ICustomer) => {
    selectCustomer(customer);
    onChange({
      name: customer.name,
      phone: customer.phone,
      email: customer.email ?? "",
      address: customer.address ?? "",
    });
  };

  const handleClearCustomer = () => {
    clearCustomer();
    onChange({ name: "", phone: "", email: "", address: "", city: "", zipCode: "" });
  };

  return (
    <div className="space-y-3">
      {/* Customer search */}
      <div className="relative">
        <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2 block">
          Customer
        </Label>

        {selectedCustomer ? (
          /* Selected customer chip */
          <div className="flex items-center gap-3 rounded-xl border border-violet-200 dark:border-violet-800/60 bg-violet-50 dark:bg-violet-900/20 px-3 py-2.5">
            <UserCheck className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                {selectedCustomer.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {selectedCustomer.phone}
                {selectedCustomer.totalOrders > 0
                  ? ` · ${selectedCustomer.totalOrders} orders`
                  : ""}
              </p>
            </div>
            {selectedCustomer.isVIP && (
              <Star className="w-3.5 h-3.5 text-amber-500 shrink-0 fill-amber-500" />
            )}
            <button
              onClick={handleClearCustomer}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Remove customer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          /* Search input */
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            <Input
              placeholder="Search by name, phone or email (3+ chars)…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={cn("pl-8 text-sm", fieldCls)}
            />

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl overflow-hidden">
                {isFetching ? (
                  <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    Searching…
                  </div>
                ) : customers.length === 0 ? (
                  <div className="px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <UserX className="w-4 h-4" />
                      No customers found — continuing as guest
                    </div>
                  </div>
                ) : (
                  customers.map((c) => (
                    <CustomerDropdownItem
                      key={c._id}
                      customer={c}
                      onClick={() => handleSelectCustomer(c)}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Guest / manual form */}
      <div className="space-y-2.5">
        <div className="grid grid-cols-2 gap-2.5">
          <div className="space-y-1">
            <Label htmlFor="cs-name" className="text-xs text-gray-500">
              Full Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="cs-name"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => onChange({ name: e.target.value })}
              className={fieldCls}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="cs-phone" className="text-xs text-gray-500">
              Phone <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="cs-phone"
              type="tel"
              placeholder="01XXXXXXXXX"
              value={form.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              className={fieldCls}
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="cs-email" className="text-xs text-gray-500">
            Email
          </Label>
          <Input
            id="cs-email"
            type="email"
            placeholder="customer@email.com"
            value={form.email}
            onChange={(e) => onChange({ email: e.target.value })}
            className={fieldCls}
          />
        </div>

        {orderType === "DELIVERY" && (
          <>
            <div className="space-y-1">
              <Label htmlFor="cs-address" className="text-xs text-gray-500">
                Address <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="cs-address"
                placeholder="Street address…"
                value={form.address}
                onChange={(e) => onChange({ address: e.target.value })}
                className={fieldCls}
              />
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <Label htmlFor="cs-city" className="text-xs text-gray-500">City</Label>
                <Input
                  id="cs-city"
                  placeholder="Dhaka"
                  value={form.city ?? ""}
                  onChange={(e) => onChange({ city: e.target.value })}
                  className={fieldCls}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="cs-zip" className="text-xs text-gray-500">ZIP</Label>
                <Input
                  id="cs-zip"
                  placeholder="1200"
                  value={form.zipCode ?? ""}
                  onChange={(e) => onChange({ zipCode: e.target.value })}
                  className={fieldCls}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CustomerDropdownItem({
  customer,
  onClick,
}: {
  customer: ICustomer;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/40 shrink-0">
        <span className="text-sm font-bold text-violet-700 dark:text-violet-400">
          {customer.name.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
          {customer.name}
          {customer.isVIP && (
            <Star className="inline w-3 h-3 ml-1 text-amber-500 fill-amber-500" />
          )}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {customer.phone}
          {customer.email ? ` · ${customer.email}` : ""}
        </p>
      </div>
      {customer.totalOrders > 0 && (
        <span className="text-[10px] text-gray-400 whitespace-nowrap">
          {customer.totalOrders} orders
        </span>
      )}
    </button>
  );
}