"use client";

import { Search, Filter, MoreHorizontal, X } from "lucide-react";
import { ReactNode, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ColumnDef, RowAction, FilterDef } from "./modern-data-table";

interface DataCardViewProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  rowActions?: RowAction<T>[];
  filters?: FilterDef[];
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  onRowClick?: (row: T) => void;
  renderCard?: (row: T, columns: ColumnDef<T>[]) => ReactNode;
  emptyState?: ReactNode;
  className?: string;
}

// Default card renderer that displays all essential columns
function DefaultCardRenderer<T>({ 
  row, 
  columns, 
  rowActions = [],
  onRowClick 
}: {
  row: T;
  columns: ColumnDef<T>[];
  rowActions?: RowAction<T>[];
  onRowClick?: (row: T) => void;
}) {
  const essentialColumns = columns.filter(col => col.essential && !col.hidden);
  const primaryColumn = essentialColumns[0];
  const secondaryColumns = essentialColumns.slice(1);

  return (
    <Card 
      className={cn(
        "transition-all duration-200 hover:shadow-md",
        onRowClick && "cursor-pointer"
      )}
      onClick={() => onRowClick?.(row)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {primaryColumn && (
              <CardTitle className="text-base font-medium truncate">
                {primaryColumn.render ? 
                  primaryColumn.render(row[primaryColumn.key], row) : 
                  String(row[primaryColumn.key])
                }
              </CardTitle>
            )}
          </div>
          {rowActions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 ml-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {rowActions.map(action => (
                  <DropdownMenuItem
                    key={action.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      action.onClick(row);
                    }}
                    disabled={action.disabled?.(row)}
                    className={action.variant === 'destructive' ? 'text-red-600' : ''}
                  >
                    {action.icon && <action.icon className="h-4 w-4 mr-2" />}
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {secondaryColumns.map(column => (
            <div key={column.id} className="flex justify-between items-center">
              <span className="text-sm text-neutral-600 dark:text-neutral-400 flex-shrink-0">
                {column.label}:
              </span>
              <span className="font-medium text-right ml-2">
                {column.render ? 
                  column.render(row[column.key], row) : 
                  String(row[column.key])
                }
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * DataCardView Component
 * 
 * Mobile-first card-based data display that works as an alternative
 * to traditional tables. Optimized for touch interfaces and small screens.
 */
export function DataCardView<T extends Record<string, any>>({
  data,
  columns,
  rowActions = [],
  filters = [],
  loading = false,
  searchable = true,
  searchPlaceholder = "Search...",
  onRowClick,
  renderCard,
  emptyState,
  className,
}: DataCardViewProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterState, setFilterState] = useState<Record<string, any>>({});
  const [showFilters, setShowFilters] = useState(false);

  // Filter and search data
  const filteredData = data
    .filter(row => {
      // Apply search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchMatch = Object.values(row).some(value =>
          String(value).toLowerCase().includes(query)
        );
        if (!searchMatch) return false;
      }

      // Apply filters
      for (const [filterId, filterValue] of Object.entries(filterState)) {
        if (filterValue !== undefined && filterValue !== null && filterValue !== '') {
          const rowValue = row[filterId as keyof T];
          if (Array.isArray(filterValue)) {
            if (!filterValue.includes(rowValue)) return false;
          } else {
            if (rowValue !== filterValue) return false;
          }
        }
      }

      return true;
    });

  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="h-10 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse"></div>
        <div className="grid gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search and Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4">
        {searchable && (
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        {filters.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {Object.keys(filterState).length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {Object.keys(filterState).length}
              </Badge>
            )}
          </Button>
        )}
      </div>

      {/* Simple Filters */}
      {showFilters && filters.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
          {filters.map(filter => (
            <div key={filter.id}>
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {filter.label}
              </label>
              <Input
                placeholder={`Filter by ${filter.label.toLowerCase()}`}
                value={filterState[filter.id] || ''}
                onChange={(e) => setFilterState(prev => ({ 
                  ...prev, 
                  [filter.id]: e.target.value 
                }))}
                className="mt-1"
              />
            </div>
          ))}
          <div className="flex items-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilterState({})}
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Cards Grid */}
      {filteredData.length === 0 ? (
        <div className="text-center py-12">
          {emptyState || (
            <div className="text-neutral-500 dark:text-neutral-400">
              No items to display
              {searchQuery && (
                <div className="mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear search
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredData.map((row, index) => (
            <div key={row.id || index}>
              {renderCard ? 
                renderCard(row, columns) : 
                <DefaultCardRenderer
                  row={row}
                  columns={columns}
                  rowActions={rowActions}
                  onRowClick={onRowClick}
                />
              }
            </div>
          ))}
        </div>
      )}

      {/* Results Summary */}
      {filteredData.length > 0 && (
        <div className="text-sm text-neutral-600 dark:text-neutral-400 text-center pt-4 border-t">
          Showing {filteredData.length} of {data.length} items
        </div>
      )}
    </div>
  );
}