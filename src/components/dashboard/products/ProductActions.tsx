'use client';

import { MoreHorizontal, Edit2, Trash2, Archive, CheckCircle } from 'lucide-react';
import type { Product } from '@/types/product.types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface ProductActionsProps {
  product: Product;
  onEdit: () => void;
  onActivate: () => void;
  onArchive: () => void;
  onDelete: () => void;
  isLoading?: boolean;
}

export function ProductActions({
  product,
  onEdit,
  onActivate,
  onArchive,
  onDelete,
  isLoading = false,
}: ProductActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="icon" disabled={isLoading}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit} disabled={isLoading}>
          <Edit2 className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>

        {product.status === 'DRAFT' && (
          <DropdownMenuItem onClick={onActivate} disabled={isLoading}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Publish
          </DropdownMenuItem>
        )}

        {product.status === 'ACTIVE' && (
          <DropdownMenuItem onClick={onArchive} disabled={isLoading}>
            <Archive className="mr-2 h-4 w-4" />
            Archive
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onDelete} disabled={isLoading} className="text-red-600 dark:text-red-400">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
