"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import type { Product } from "@/types/product.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductImageGallery } from "./ProductImageGallery";
import { ProductStatusBadge } from "./ProductStatusBadge";
import { ProductActions } from "./ProductActions";
import { TableSkeleton } from "@/components/dashboard/shared/Skeleton";
import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import { Package } from "lucide-react";

interface ProductTableProps {
  products: Product[];
  isLoading?: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onActivate: (product: Product) => void;
  onArchive: (product: Product) => void;
}

export function ProductTable({
  products,
  isLoading = false,
  onEdit,
  onDelete,
  onActivate,
  onArchive,
}: ProductTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(products.map((p) => p.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const toggleSelect = (id: string) => {
    const newIds = new Set(selectedIds);
    if (newIds.has(id)) {
      newIds.delete(id);
    } else {
      newIds.add(id);
    }
    setSelectedIds(newIds);
  };

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No products"
        description="Create your first product to get started"
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={
                  selectedIds.size === products.length && products.length > 0
                }
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead className="text-right">Total Sold</TableHead>
            <TableHead className="text-center">Rating</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow
              key={product.id}
              className="hover:bg-muted/50 transition-colors"
            >
              <TableCell>
                <Checkbox
                  checked={selectedIds.has(product.id)}
                  onCheckedChange={() => toggleSelect(product.id)}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <ProductImageGallery
                    images={product.images}
                    productName={product.name}
                    size="sm"
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">
                        {product.name}
                      </span>
                      {product.isFeatured && (
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      )}
                    </div>
                    <span
                      className="text-xs text-muted-foreground line-clamp-1"
                      dangerouslySetInnerHTML={{
                        __html: product?.description || "",
                      }}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-mono text-sm text-muted-foreground">
                {product.sku}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col items-end">
                  <p className="text-sm font-bold tabular-nums text-gray-900 dark:text-gray-50">
                    ৳
                    {(product?.discountPrice ?? 0 > 0)
                      ? product.discountPrice
                      : product.price}
                  </p>
                  {product.discountPrice ??
                    (0 > 0 && product.discountPrice) ??
                    (0 < product.price && (
                      <p className="text-[10px] tabular-nums text-gray-400 line-through">
                        ৳{product.price.toLocaleString()}
                      </p>
                    ))}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col items-end">
                  <span className="font-medium">{product.stock}</span>
                  {product.stock <= product.lowStockThreshold && (
                    <span className="text-xs text-amber-600 dark:text-amber-400">
                      Low stock
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col items-end">
                  <span className="font-medium">{product.totalSold}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-xs text-muted-foreground">/5</span>
                </div>
              </TableCell>
              <TableCell>
                <ProductStatusBadge status={product.status} />
              </TableCell>
              <TableCell className="text-right">
                <ProductActions
                  product={product}
                  onEdit={() => onEdit(product)}
                  onDelete={() => onDelete(product)}
                  onActivate={() => onActivate(product)}
                  onArchive={() => onArchive(product)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
