"use client";

import React, { useState, useCallback, useMemo } from "react";
import { PackageX } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMyProductsQuery } from "@/redux/features/Product/product.api";
import { useGetMyCategoriesQuery } from "@/redux/features/Category/category.api";
import type { IProduct } from "@/redux/features/Product/product.api";
import type { POSCartItem } from "@/types/pos.types";
import { ProductCard } from "./ProductCard";
import { ProductFilters } from "./ProductFilters";

interface ProductGridProps {
  cartItems: POSCartItem[];
  onAddToCart: (product: IProduct) => void;
}

function ProductSkeleton() {
  return (
    <div className="flex gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden p-0">
      <Skeleton className="w-24 h-20 rounded-none rounded-l-xl shrink-0" />
      <div className="flex-1 py-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="pr-3 flex flex-col justify-center items-end gap-2">
        <Skeleton className="h-4 w-14" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>
    </div>
  );
}

export function ProductGrid({ cartItems, onAddToCart }: ProductGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const { data: productsData, isLoading: productsLoading } =
    useGetMyProductsQuery({ limit: 500 });

  const { data: categoriesData } = useGetMyCategoriesQuery({ limit: 100 });

  const allProducts = useMemo(
    () => productsData?.data ?? [],
    [productsData],
  );

  const categories = categoriesData?.data ?? [];

  const filtered = useMemo(() => {
    let list = allProducts;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p: IProduct) =>
          p.name?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.shortDescription?.toLowerCase().includes(q),
      );
    }

    if (selectedCategory) {
      list = list.filter((p: IProduct) => {
        if (typeof p.category === "string") return p.category === selectedCategory;
        return (p.category as unknown as { _id: string })?._id === selectedCategory;
      });
    }

    if (selectedStatus) {
      list = list.filter((p: IProduct) => p.status === selectedStatus);
    }

    return list;
  }, [allProducts, searchQuery, selectedCategory, selectedStatus]);

  const getCartQty = useCallback(
    (productId: string) =>
      cartItems.find((i) => i.product._id === productId)?.quantity ?? 0,
    [cartItems],
  );

  const handleSearchChange = useCallback((q: string) => setSearchQuery(q), []);
  const handleCategoryChange = useCallback((id: string) => setSelectedCategory(id), []);
  const handleStatusChange = useCallback((s: string) => setSelectedStatus(s), []);

  return (
    <div className="flex flex-col h-full min-h-0 gap-4">
      <ProductFilters
        categories={categories}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onStatusChange={handleStatusChange}
        selectedCategory={selectedCategory}
        selectedStatus={selectedStatus}
        resultCount={filtered.length}
        totalCount={allProducts.length}
      />

      {/* Grid */}
      <div className="flex-1 overflow-y-auto pr-0.5">
        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
            <PackageX className="w-10 h-10 text-gray-300 dark:text-gray-700" />
            <div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                No products found
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Try adjusting your filters
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4">
            {filtered.map((product: IProduct) => (
              <ProductCard
                key={product._id}
                product={product}
                cartQty={getCartQty(product._id)}
                onAdd={() => onAddToCart(product)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}