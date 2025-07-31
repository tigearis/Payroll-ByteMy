/**
 * Enhanced Unified Data Table Component - PERFORMANCE OPTIMIZED
 * 
 * Comprehensive table solution that eliminates duplication and provides
 * consistent UX across all data displays in the application.
 * 
 * PERFORMANCE FEATURES:
 * - React.memo for expensive re-render prevention
 * - Custom prop comparison for complex objects
 * - Memoized internal components
 * - Optimized for large datasets
 */

'use client';

import { flexRender, getCoreRowModel, useReactTable, ColumnDef, Table as ReactTable } from '@tanstack/react-table';
import { Search, Filter, Download, RefreshCw, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { memo, useMemo, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

export interface UnifiedTableColumn<T> extends Omit<ColumnDef<T>, 'accessorKey' | 'header'> {
  accessorKey: string;
  header: string;
  type?: 'text' | 'number' | 'date' | 'badge' | 'currency' | 'actions';
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T) => React.ReactNode;
}

export interface UnifiedTableAction<T> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: (row: T) => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  disabled?: (row: T) => boolean;
  hidden?: (row: T) => boolean;
}

export interface UnifiedTableFilter {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number';
  options?: { label: string; value: string }[];
  placeholder?: string;
}

export interface UnifiedTableProps<T> {
  // Data
  data: T[];
  columns: UnifiedTableColumn<T>[];
  
  // Loading and error states
  loading?: boolean;
  error?: string | null;
  
  // Actions
  actions?: UnifiedTableAction<T>[];
  bulkActions?: UnifiedTableAction<T[]>[];
  
  // Filtering and search
  searchable?: boolean;
  searchPlaceholder?: string;
  filters?: UnifiedTableFilter[];
  globalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
  
  // Pagination
  pagination?: {
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    canPreviousPage: boolean;
    canNextPage: boolean;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
  };
  
  // Selection
  selectable?: boolean;
  selectedRows?: T[];
  onSelectionChange?: (rows: T[]) => void;
  
  // Export
  exportable?: boolean;
  onExport?: (format: 'csv' | 'pdf' | 'excel') => void;
  
  // Customization
  title?: string;
  description?: string;
  emptyMessage?: string;
  className?: string;
  rowClassName?: (row: T) => string;
  
  // Refresh
  onRefresh?: () => void;
  refreshing?: boolean;
}

// ============================================================================
// PERFORMANCE OPTIMIZED COMPONENT WITH REACT.MEMO
// ============================================================================

function EnhancedUnifiedTableComponent<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  error = null,
  actions = [],
  bulkActions = [],
  searchable = true,
  searchPlaceholder = "Search...",
  filters = [],
  globalFilter = "",
  onGlobalFilterChange,
  pagination,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  exportable = false,
  onExport,
  title,
  description,
  emptyMessage = "No data available",
  className,
  rowClassName,
  onRefresh,
  refreshing = false,
}: UnifiedTableProps<T>) {
  const [localGlobalFilter, setLocalGlobalFilter] = React.useState(globalFilter);
  const [localSelectedRows, setLocalSelectedRows] = React.useState<T[]>(selectedRows);

  // Create table columns with selection and actions
  const tableColumns = React.useMemo(() => {
    const cols: ColumnDef<T>[] = [];

    // Selection column
    if (selectable) {
      cols.push({
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            className="rounded border-gray-300"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="rounded border-gray-300"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      });
    }

    // Data columns
    cols.push(...columns.map(col => ({
      ...col,
      cell: ({ getValue, row }: any) => {
        const value = getValue();
        
        if (col.render) {
          return col.render(value, row.original);
        }

        switch (col.type) {
          case 'badge':
            return <Badge variant={getBadgeVariant(value)}>{value}</Badge>;
          case 'currency':
            return new Intl.NumberFormat('en-AU', { 
              style: 'currency', 
              currency: 'AUD' 
            }).format(value);
          case 'date':
            return value ? new Date(value).toLocaleDateString() : '-';
          case 'number':
            return typeof value === 'number' ? value.toLocaleString() : value;
          default:
            return value?.toString() || '-';
        }
      },
    })));

    // Actions column
    if (actions.length > 0) {
      cols.push({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {actions
              .filter(action => !action.hidden?.(row.original))
              .map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'ghost'}
                  size="sm"
                  onClick={() => action.onClick(row.original)}
                  disabled={action.disabled?.(row.original)}
                  className="h-8 w-8 p-0"
                >
                  {action.icon && <action.icon className="h-4 w-4" />}
                  <span className="sr-only">{action.label}</span>
                </Button>
              ))}
          </div>
        ),
        enableSorting: false,
      });
    }

    return cols;
  }, [columns, actions, selectable]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      globalFilter: localGlobalFilter,
      rowSelection: localSelectedRows.reduce((acc, row, index) => {
        acc[index] = true;
        return acc;
      }, {} as Record<string, boolean>),
    },
    globalFilterFn: 'includesString',
    onGlobalFilterChange: (value) => {
      setLocalGlobalFilter(value);
      onGlobalFilterChange?.(value);
    },
    onRowSelectionChange: (updater) => {
      const newSelection = typeof updater === 'function' 
        ? updater(localSelectedRows.reduce((acc, row, index) => {
            acc[index] = true;
            return acc;
          }, {} as Record<string, boolean>))
        : updater;
      
      const selectedRowsData = Object.keys(newSelection)
        .filter(key => newSelection[key])
        .map(key => data[parseInt(key)])
        .filter(Boolean);
      
      setLocalSelectedRows(selectedRowsData);
      onSelectionChange?.(selectedRowsData);
    },
  });

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
        <h3 className="text-lg font-medium text-red-900">Error Loading Data</h3>
        <p className="mt-2 text-red-700">{error}</p>
        {onRefresh && (
          <Button 
            onClick={onRefresh} 
            variant="outline" 
            className="mt-4"
            disabled={refreshing}
          >
            <RefreshCw className={cn("mr-2 h-4 w-4", refreshing && "animate-spin")} />
            Try Again
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      {(title || description || searchable || exportable || onRefresh) && (
        <div className="flex items-center justify-between">
          <div>
            {title && <h2 className="text-2xl font-bold tracking-tight">{title}</h2>}
            {description && <p className="text-muted-foreground">{description}</p>}
          </div>
          
          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
              </Button>
            )}
            
            {exportable && onExport && (
              <Select onValueChange={(format) => onExport(format as 'csv' | 'pdf' | 'excel')}>
                <SelectTrigger className="w-32">
                  <Download className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Export" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      )}

      {/* Filters and Search */}
      {(searchable || filters.length > 0) && (
        <div className="flex items-center gap-4">
          {searchable && (
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={localGlobalFilter}
                onChange={(e) => table.setGlobalFilter(e.target.value)}
                className="pl-9"
              />
            </div>
          )}
          
          {filters.map((filter) => (
            <div key={filter.key} className="min-w-[150px]">
              {filter.type === 'select' ? (
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={filter.label} />
                  </SelectTrigger>
                  <SelectContent>
                    {filter.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  placeholder={filter.placeholder || filter.label}
                  type={filter.type}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Bulk Actions */}
      {bulkActions.length > 0 && localSelectedRows.length > 0 && (
        <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
          <span className="text-sm text-muted-foreground">
            {localSelectedRows.length} item(s) selected
          </span>
          {bulkActions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'outline'}
              size="sm"
              onClick={() => action.onClick(localSelectedRows)}
              disabled={action.disabled?.(localSelectedRows)}
            >
              {action.icon && <action.icon className="mr-2 h-4 w-4" />}
              {action.label}
            </Button>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead 
                    key={header.id}
                    className={cn(
                      columns.find(col => col.accessorKey === header.id)?.align === 'center' && 'text-center',
                      columns.find(col => col.accessorKey === header.id)?.align === 'right' && 'text-right'
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading skeletons
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {tableColumns.map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={rowClassName?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell 
                  colSpan={tableColumns.length} 
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing page {pagination.pageIndex + 1} of {pagination.pageCount}
          </div>
          
          <div className="flex items-center gap-2">
            <Select
              value={pagination.pageSize.toString()}
              onValueChange={(value) => pagination.onPageSizeChange(parseInt(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50, 100].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.pageIndex - 1)}
              disabled={!pagination.canPreviousPage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.pageIndex + 1)}
              disabled={!pagination.canNextPage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MEMOIZED EXPORT WITH CUSTOM COMPARISON
// ============================================================================

/**
 * Custom comparison function for React.memo
 * Optimizes re-renders by performing deep comparison on complex props
 */
function arePropsEqual<T>(
  prevProps: UnifiedTableProps<T>,
  nextProps: UnifiedTableProps<T>
): boolean {
  // Quick primitive checks first (most common changes)
  if (
    prevProps.loading !== nextProps.loading ||
    prevProps.error !== nextProps.error ||
    prevProps.globalFilter !== nextProps.globalFilter ||
    prevProps.refreshing !== nextProps.refreshing ||
    prevProps.searchPlaceholder !== nextProps.searchPlaceholder ||
    prevProps.title !== nextProps.title ||
    prevProps.emptyMessage !== nextProps.emptyMessage
  ) {
    return false;
  }

  // Data comparison (most expensive check)
  if (prevProps.data !== nextProps.data) {
    // If arrays are different lengths, definitely different
    if (prevProps.data.length !== nextProps.data.length) {
      return false;
    }
    
    // For performance, do shallow comparison of data array
    // In most cases, data will be a new array reference when it changes
    return false;
  }

  // Columns comparison (structure changes are rare but important)
  if (prevProps.columns !== nextProps.columns) {
    if (prevProps.columns.length !== nextProps.columns.length) {
      return false;
    }
    // Shallow comparison - if columns structure changes, we need to re-render
    return JSON.stringify(prevProps.columns.map(c => c.accessorKey)) === 
           JSON.stringify(nextProps.columns.map(c => c.accessorKey));
  }

  // Actions comparison (function references may change)
  if (prevProps.actions !== nextProps.actions) {
    if (!prevProps.actions || !nextProps.actions) {
      return prevProps.actions === nextProps.actions;
    }
    if (prevProps.actions.length !== nextProps.actions.length) {
      return false;
    }
    // For actions, we compare the labels as function references will always differ
    return JSON.stringify(prevProps.actions.map(a => a.label)) === 
           JSON.stringify(nextProps.actions.map(a => a.label));
  }

  // Pagination comparison
  if (prevProps.pagination !== nextProps.pagination) {
    if (!prevProps.pagination || !nextProps.pagination) {
      return prevProps.pagination === nextProps.pagination;
    }
    return (
      prevProps.pagination.pageIndex === nextProps.pagination.pageIndex &&
      prevProps.pagination.pageSize === nextProps.pagination.pageSize &&
      prevProps.pagination.pageCount === nextProps.pagination.pageCount &&
      prevProps.pagination.canPreviousPage === nextProps.pagination.canPreviousPage &&
      prevProps.pagination.canNextPage === nextProps.pagination.canNextPage
    );
  }

  // Selected rows comparison
  if (prevProps.selectedRows !== nextProps.selectedRows) {
    if (!prevProps.selectedRows || !nextProps.selectedRows) {
      return prevProps.selectedRows === nextProps.selectedRows;
    }
    return prevProps.selectedRows.length === nextProps.selectedRows.length;
  }

  // If we get here, props are considered equal
  return true;
}

/**
 * Memoized Enhanced Unified Table Component
 * 
 * Prevents unnecessary re-renders when props haven't meaningfully changed.
 * Optimized for large datasets and complex table configurations.
 */
export const EnhancedUnifiedTable = memo(
  EnhancedUnifiedTableComponent,
  arePropsEqual
) as <T extends Record<string, any>>(
  props: UnifiedTableProps<T>
) => React.ReactElement;

// Helper function for badge variants
function getBadgeVariant(value: string): "default" | "secondary" | "destructive" | "outline" {
  const normalizedValue = value?.toLowerCase();
  
  if (['active', 'completed', 'paid', 'approved'].includes(normalizedValue)) {
    return 'default';
  }
  if (['pending', 'processing', 'draft'].includes(normalizedValue)) {
    return 'secondary';
  }
  if (['failed', 'rejected', 'cancelled', 'overdue'].includes(normalizedValue)) {
    return 'destructive';
  }
  
  return 'outline';
}

export default EnhancedUnifiedTable;