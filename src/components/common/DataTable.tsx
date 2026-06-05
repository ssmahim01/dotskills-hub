/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Search, MoreHorizontal } from 'lucide-react';

export interface ActionItem {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'destructive';
}

export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  searchable?: boolean;
  searchFields?: (keyof T)[];
  actions?: (row: T) => ActionItem[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  isLoading = false,
  searchable = true,
  searchFields,
  actions,
  onRowClick,
  emptyMessage = 'No data available',
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter data
  const filteredData = useMemo(() => {
    if (!searchQuery || !searchFields) return data;
    const lowerQuery = searchQuery.toLowerCase();
    return data.filter((row) =>
      searchFields.some((field) => {
        const value = row[field];
        return String(value).toLowerCase().includes(lowerQuery);
      })
    );
  }, [data, searchQuery, searchFields]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal === bVal) return 0;
      const comparison = aVal < bVal ? -1 : 1;
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortKey, sortOrder]);

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {searchable && searchFields && <Skeleton className="h-10 w-full rounded-md" />}
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                {columns.map((column) => (
                  <th key={String(column.key)} className="px-4 py-3">
                    <Skeleton className="h-4 w-full rounded" />
                  </th>
                ))}
                {actions && <th className="px-4 py-3" />}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-border">
                  {columns.map((column) => (
                    <td key={String(column.key)} className="px-4 py-3">
                      <Skeleton className="h-4 w-full rounded" />
                    </td>
                  ))}
                  {actions && <td className="px-4 py-3" />}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      {searchable && searchFields && (
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-4 py-3 text-left text-sm font-semibold text-foreground ${column.width || ''}`}
                  onClick={() => column.sortable && handleSort(column.key)}
                  style={{ cursor: column.sortable ? 'pointer' : 'default' }}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && sortKey === column.key && (
                      <span className="text-xs">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions && <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className="px-4 py-3 text-sm text-foreground"
                      onClick={(e) => {
                        if (actions) {
                          e.stopPropagation();
                        }
                      }}
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : String(row[column.key])}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {actions(row).map((action, index) => (
                            <DropdownMenuItem
                              key={index}
                              onClick={action.onClick}
                              className={action.variant === 'destructive' ? 'text-destructive' : ''}
                            >
                              {action.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Info */}
      {searchQuery && (
        <p className="text-sm text-muted-foreground">
          Showing {sortedData.length} of {data.length} results
        </p>
      )}
    </div>
  );
}
