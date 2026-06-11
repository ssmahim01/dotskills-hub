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
import type { CategoryStatus } from '@/types/category.types';
import { CATEGORY_STATUS_OPTIONS } from '@/lib/constants/category.constants';

interface CategoryFiltersProps {
  searchTerm: string;
  status: CategoryStatus | 'all';
  onSearchChange: (value: string) => void;
  onStatusChange: (value: CategoryStatus | 'all') => void;
  onReset: () => void;
}

export function CategoryFilters({
  searchTerm,
  status,
  onSearchChange,
  onStatusChange,
  onReset,
}: CategoryFiltersProps) {
  const hasActiveFilters = searchTerm || status !== 'all';

  return (
    <div className="space-y-4 border-b border-border px-8 py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={status} onValueChange={(value) => onStatusChange(value as CategoryStatus | 'all')}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {CATEGORY_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
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
