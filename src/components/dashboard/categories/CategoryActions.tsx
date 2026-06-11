'use client';

import { MoreHorizontal, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import type { Category } from '@/types/category.types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface CategoryActionsProps {
  category: Category;
  onEdit: () => void;
  onActivate: () => void;
  onInactivate: () => void;
  onDelete: () => void;
  isLoading?: boolean;
}

export function CategoryActions({
  category,
  onEdit,
  onActivate,
  onInactivate,
  onDelete,
  isLoading = false,
}: CategoryActionsProps) {
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

        {category.status === 'ACTIVE' ? (
          <DropdownMenuItem onClick={onInactivate} disabled={isLoading}>
            <XCircle className="mr-2 h-4 w-4" />
            Inactivate
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={onActivate} disabled={isLoading}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Activate
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
