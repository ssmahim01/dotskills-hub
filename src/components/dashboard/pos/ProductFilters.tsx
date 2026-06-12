"use client";

import React, { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ICategory } from "@/redux/features/Category/category.api";
import { DEBOUNCE_MS } from "@/lib/constants/pos.constants";

interface ProductFiltersProps {
  categories: ICategory[];
  onSearchChange: (q: string) => void;
  onCategoryChange: (id: string) => void;
  onStatusChange: (status: string) => void;
  selectedCategory: string;
  selectedStatus: string;
  resultCount: number;
  totalCount: number;
}

export function ProductFilters({
  categories,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  selectedCategory,
  selectedStatus,
  resultCount,
  totalCount,
}: ProductFiltersProps) {
  const [raw, setRaw] = useState("");

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => onSearchChange(raw), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [raw, onSearchChange]);

  const hasFilters = raw || selectedCategory || selectedStatus;

  const clearAll = () => {
    setRaw("");
    onSearchChange("");
    onCategoryChange("");
    onStatusChange("");
  };

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <Input
          placeholder="Search products by name or SKU…"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          className="pl-9 pr-9 text-sm bg-white dark:bg-gray-900"
        />
        {raw && (
          <button
            onClick={() => setRaw("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Category + Status */}
      <div className="flex gap-2">
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className={cn(
            "flex-1 h-9 px-3 rounded-md text-sm border border-input",
            "bg-white dark:bg-gray-900 text-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring",
            "transition-colors",
          )}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className={cn(
            "w-36 h-9 px-3 rounded-md text-sm border border-input",
            "bg-white dark:bg-gray-900 text-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring",
            "transition-colors",
          )}
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      {/* Active filter summary */}
      {hasFilters && (
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-muted-foreground">
            {resultCount} of {totalCount} products
          </span>
          <button
            onClick={clearAll}
            className="inline-flex items-center gap-1 rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-3 h-3" />
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}