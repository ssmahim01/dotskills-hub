'use client';

import { useState } from 'react';
import { MoreVertical, Eye, Edit, Trash2, Ban, Crown, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import type { ICustomer } from '@/types/customer.types';

interface CustomerActionsProps {
  customer: ICustomer;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onActivate?: () => void;
  onBlock?: () => void;
  onToggleVIP?: () => void;
  isLoading?: boolean;
}

export function CustomerActions({
  customer,
  onView,
  onEdit,
  onDelete,
  onActivate,
  onBlock,
  onToggleVIP,
  isLoading = false,
}: CustomerActionsProps) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => { onView(); setOpen(false); }} disabled={isLoading}>
          <Eye className="mr-2 h-4 w-4" />
          <span>View Details</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => { onEdit(); setOpen(false); }} disabled={isLoading}>
          <Edit className="mr-2 h-4 w-4" />
          <span>Edit Customer</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {customer.status !== 'ACTIVE' && onActivate && (
          <DropdownMenuItem onClick={() => { onActivate(); setOpen(false); }} disabled={isLoading}>
            <Check className="mr-2 h-4 w-4" />
            <span>Activate</span>
          </DropdownMenuItem>
        )}

        {customer.status === 'ACTIVE' && onBlock && (
          <DropdownMenuItem onClick={() => { onBlock(); setOpen(false); }} disabled={isLoading}>
            <Ban className="mr-2 h-4 w-4" />
            <span>Block Customer</span>
          </DropdownMenuItem>
        )}

        {onToggleVIP && (
          <DropdownMenuItem onClick={() => { onToggleVIP(); setOpen(false); }} disabled={isLoading}>
            <Crown className="mr-2 h-4 w-4" />
            <span>{customer.isVIP ? 'Remove VIP Status' : 'Mark as VIP'}</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => { onDelete(); setOpen(false); }} disabled={isLoading} className="text-red-600 dark:text-red-400">
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
