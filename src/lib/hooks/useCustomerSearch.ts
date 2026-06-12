"use client";

import { useState, useEffect, useCallback } from "react";
import { useGetAllCustomersQuery } from "@/redux/features/Customer/customer.api";
import type { ICustomer } from "@/types/customer.types";
import { DEBOUNCE_MS } from "../constants/pos.constants";

export function useCustomerSearch() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<ICustomer | null>(null);

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [query]);

  const skip = debouncedQuery.trim().length < 3;

  const { data, isFetching } = useGetAllCustomersQuery(
    { search: debouncedQuery, limit: 8 },
    { skip },
  );

  const customers: ICustomer[] = data?.data ?? [];

  const selectCustomer = useCallback((customer: ICustomer) => {
    setSelectedCustomer(customer);
    setQuery(customer.name);
  }, []);

  const clearCustomer = useCallback(() => {
    setSelectedCustomer(null);
    setQuery("");
  }, []);

  return {
    query,
    setQuery,
    customers,
    isFetching,
    selectedCustomer,
    selectCustomer,
    clearCustomer,
    showDropdown: !skip && !selectedCustomer,
  };
}