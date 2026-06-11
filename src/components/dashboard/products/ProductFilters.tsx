'use client';

import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import type { ProductStatus } from '@/types/product.types';
import { PRODUCT_STATUS_OPTIONS } from '@/lib/constants/product.constants';

interface ProductFiltersProps {
  searchTerm: string;
  status: ProductStatus | 'all';
  featured: boolean | 'all';
  onSearchChange: (value: string) => void;
  onStatusChange: (value: ProductStatus | 'all') => void;
  onFeaturedChange: (value: boolean | 'all') => void;
  onReset: () => void;
}

export function ProductFilters({
  searchTerm,
  status,
  featured,
  onSearchChange,
  onStatusChange,
  onFeaturedChange,
  onReset,
}: ProductFiltersProps) {
  const hasActiveFilters = searchTerm || status !== 'all' || featured !== 'all';

  return (
    <div className="space-y-4 border-b border-border px-8 py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={status} onValueChange={(value) => onStatusChange(value as ProductStatus | 'all')}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {PRODUCT_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={String(featured)} onValueChange={(value) => onFeaturedChange(value === 'all' ? 'all' : value === 'true')}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Items" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="true">Featured Only</SelectItem>
              <SelectItem value="false">Not Featured</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={onReset}>
            Reset Filters
          </Button>
        )}
      </div>
    </div>
  );
}
