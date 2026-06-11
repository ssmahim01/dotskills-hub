'use client';

import { useState } from 'react';
import type { Category } from '@/types/category.types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { CategoryImage } from './CategoryImage';
import { CategoryStatusBadge } from './CategoryStatusBadge';
import { CategoryActions } from './CategoryActions';
import { TableSkeleton } from '@/components/dashboard/shared/Skeleton';
import { EmptyState } from '@/components/dashboard/shared/EmptyState';
import { Package } from 'lucide-react';

interface CategoryTableProps {
  categories: Category[];
  isLoading?: boolean;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onActivate: (category: Category) => void;
  onInactivate: (category: Category) => void;
}

export function CategoryTable({
  categories,
  isLoading = false,
  onEdit,
  onDelete,
  onActivate,
  onInactivate,
}: CategoryTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(categories.map((c) => c.id)));
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

  if (categories.length === 0) {
    return <EmptyState icon={Package} title="No categories" description="Create your first category to get started" />;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedIds.size === categories.length && categories.length > 0}
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead className="text-right">Products</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-12 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id} className="hover:bg-muted/50 transition-colors">
              <TableCell>
                <Checkbox checked={selectedIds.has(category.id)} onCheckedChange={() => toggleSelect(category.id)} />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <CategoryImage src={category.image} alt={category.name} size="sm" />
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{category.name}</span>
                    <span className="text-xs text-muted-foreground line-clamp-1">{category.description}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-mono text-sm text-muted-foreground">{category.slug}</TableCell>
              <TableCell className="text-right font-medium">{category.totalProducts}</TableCell>
              <TableCell>
                <CategoryStatusBadge status={category.status} />
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(category.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <CategoryActions
                  category={category}
                  onEdit={() => onEdit(category)}
                  onDelete={() => onDelete(category)}
                  onActivate={() => onActivate(category)}
                  onInactivate={() => onInactivate(category)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
