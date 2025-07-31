"use client";

import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import React, { useMemo, memo, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Types
export interface DataTableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  defaultVisible?: boolean;
  cellRenderer?: (value: any, row: T) => React.ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
}

export interface DataTableAction<T> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: (row: T) => void;
  variant?: "default" | "destructive";
  disabled?: (row: T) => boolean;
  separator?: boolean;
  href?: (row: T) => string;
}

export interface StatusConfig {
  variant: "default" | "secondary" | "destructive" | "outline";
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

export interface DataTableProps<T> {
  // Data
  data: T[];
  columns: DataTableColumn<T>[];

  // Loading & States
  loading?: boolean;
  emptyMessage?: string;

  // Selection
  selectable?: boolean;
  selectedItems?: string[];
  onSelectItem?: (id: string, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;

  // Sorting
  sortField?: string;
  sortDirection?: "ASC" | "DESC";
  onSort?: (field: string) => void;

  // Visibility
  visibleColumns?: string[];

  // Actions
  actions?: DataTableAction<T>[];

  // Status Mapping
  statusConfig?: Record<string, StatusConfig>;

  // Header
  title?: string;
  onRefresh?: () => void;
  headerActions?: React.ReactNode;

  // Styling
  className?: string;

  // Row Configuration
  getRowId: (row: T) => string;
  getRowLink?: (row: T) => string;
}

// Built-in cell renderers
export const createCellRenderers = <T,>(
  statusConfig?: Record<string, StatusConfig>
) => ({
  badge: (value: string) => {
    const config = statusConfig?.[value] || { variant: "default" as const };
    const IconComponent = config.icon;

    return (
      <Badge variant={config.variant} className={config.className}>
        {IconComponent && <IconComponent className="w-3 h-3 mr-1" />}
        {value}
      </Badge>
    );
  },

  link: (value: string, href: string) => (
    <Link href={href} className="text-blue-600 hover:underline font-medium">
      {value}
    </Link>
  ),

  iconText: (
    value: string,
    IconComponent: React.ComponentType<{ className?: string }>
  ) => (
    <div className="flex items-center gap-2">
      <IconComponent className="w-4 h-4 text-gray-500" />
      <span>{value}</span>
    </div>
  ),

  avatar: (user: { name: string; imageUrl?: string; email?: string; computedName?: string; firstName?: string; lastName?: string }) => (
    <div className="flex items-center space-x-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={user.imageUrl} alt={user.computedName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User'} />
        <AvatarFallback>
          {(user.computedName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User')
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <div className="font-medium truncate">{user.computedName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User'}</div>
        {user.email && (
          <div className="text-sm text-muted-foreground truncate">
            {user.email}
          </div>
        )}
      </div>
    </div>
  ),

  date: (value: string | Date) => {
    const date = new Date(value);
    return (
      <div className="text-sm">
        <div>{date.toLocaleDateString()}</div>
        <div className="text-muted-foreground">{date.toLocaleTimeString()}</div>
      </div>
    );
  },

  simpleDate: (value: string | Date) => {
    return new Date(value).toLocaleDateString();
  },

  count: (value: number, singular: string, plural?: string) => (
    <div className="flex items-center gap-1 text-sm text-muted-foreground">
      <span className="font-medium text-foreground">{value}</span>
      {value === 1 ? singular : plural || `${singular}s`}
    </div>
  ),
});

function UnifiedDataTableComponent<T>({
  data,
  columns,
  loading = false,
  emptyMessage = "No data found",
  selectable = false,
  selectedItems = [],
  onSelectItem,
  onSelectAll,
  sortField,
  sortDirection,
  onSort,
  visibleColumns,
  actions = [],
  statusConfig,
  title,
  onRefresh,
  headerActions,
  className,
  getRowId,
  getRowLink,
}: DataTableProps<T>) {
  // Filter visible columns
  const displayColumns = useMemo(() => {
    if (!visibleColumns) return columns;
    return columns.filter(col => visibleColumns.includes(String(col.key)));
  }, [columns, visibleColumns]);

  // Selection logic
  const allSelected = useMemo(() => {
    return (
      data.length > 0 &&
      data.every(row => selectedItems.includes(getRowId(row)))
    );
  }, [data, selectedItems, getRowId]);

  const someSelected = useMemo(() => {
    return selectedItems.length > 0 && !allSelected;
  }, [selectedItems, allSelected]);

  // Cell renderers
  const cellRenderers = useMemo(
    () => createCellRenderers<T>(statusConfig),
    [statusConfig]
  );

  // Handle sorting
  const handleSort = (columnKey: string) => {
    if (!onSort) return;

    if (sortField === columnKey) {
      onSort(sortDirection === "ASC" ? "DESC" : "ASC");
    } else {
      onSort(columnKey);
    }
  };

  // Render sorting icon
  const renderSortIcon = (columnKey: string) => {
    if (sortField !== String(columnKey)) return null;

    return sortDirection === "ASC" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  // Render cell content
  const renderCell = (column: DataTableColumn<T>, row: T) => {
    const value = row[column.key];

    if (column.cellRenderer) {
      return column.cellRenderer(value, row);
    }

    // Default rendering based on value type
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground">—</span>;
    }

    return String(value);
  };

  // Render table content
  const renderTableContent = () => {
    if (loading) {
      return (
        <TableRow>
          <TableCell
            colSpan={
              displayColumns.length +
              (selectable ? 1 : 0) +
              (actions.length > 0 ? 1 : 0)
            }
            className="h-32 text-center"
          >
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Loading...
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (data.length === 0) {
      return (
        <TableRow>
          <TableCell
            colSpan={
              displayColumns.length +
              (selectable ? 1 : 0) +
              (actions.length > 0 ? 1 : 0)
            }
            className="h-32 text-center text-muted-foreground"
          >
            {emptyMessage}
          </TableCell>
        </TableRow>
      );
    }

    return data.map(row => {
      const rowId = getRowId(row);
      const isSelected = selectedItems.includes(rowId);
      const rowLink = getRowLink?.(row);

      return (
        <TableRow
          key={rowId}
          className={`hover:bg-muted/50 ${isSelected ? "bg-muted/25" : ""}`}
        >
          {selectable && (
            <TableCell className="w-12">
              <Checkbox
                checked={isSelected}
                onCheckedChange={checked =>
                  onSelectItem?.(rowId, checked as boolean)
                }
                aria-label={`Select row ${rowId}`}
              />
            </TableCell>
          )}

          {displayColumns.map(column => (
            <TableCell
              key={String(column.key)}
              className={column.align ? `text-${column.align}` : ""}
              style={{ width: column.width }}
            >
              {column.key === displayColumns[0].key && rowLink ? (
                <Link href={rowLink} className="block">
                  {renderCell(column, row)}
                </Link>
              ) : (
                renderCell(column, row)
              )}
            </TableCell>
          ))}

          {actions.length > 0 && (
            <TableCell className="w-12">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {actions.map((action, index) => {
                    const isDisabled = action.disabled?.(row) || false;
                    const IconComponent = action.icon;

                    if (action.separator && index > 0) {
                      return (
                        <React.Fragment key={`separator-${index}`}>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => !isDisabled && action.onClick(row)}
                            disabled={isDisabled}
                            className={
                              action.variant === "destructive"
                                ? "text-red-600"
                                : ""
                            }
                          >
                            {IconComponent && (
                              <IconComponent className="mr-2 h-4 w-4" />
                            )}
                            {action.label}
                          </DropdownMenuItem>
                        </React.Fragment>
                      );
                    }

                    return (
                      <DropdownMenuItem
                        key={action.label}
                        onClick={() => !isDisabled && action.onClick(row)}
                        disabled={isDisabled}
                        className={
                          action.variant === "destructive" ? "text-red-600" : ""
                        }
                      >
                        {IconComponent && (
                          <IconComponent className="mr-2 h-4 w-4" />
                        )}
                        {action.label}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          )}
        </TableRow>
      );
    });
  };

  return (
    <Card className={className}>
      {(title || onRefresh || headerActions) && (
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <div className="flex items-center space-x-2">
            {headerActions}
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={loading}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            )}
          </div>
        </CardHeader>
      )}

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {selectable && (
                  <TableHead className="w-12">
                    <Checkbox
                      checked={someSelected ? "indeterminate" : allSelected}
                      onCheckedChange={checked =>
                        onSelectAll?.(checked as boolean)
                      }
                      aria-label="Select all rows"
                    />
                  </TableHead>
                )}

                {displayColumns.map(column => (
                  <TableHead
                    key={String(column.key)}
                    className={`${column.sortable ? "cursor-pointer select-none hover:bg-muted/50" : ""} ${
                      column.align ? `text-${column.align}` : ""
                    }`}
                    style={{ width: column.width }}
                    onClick={() =>
                      column.sortable && handleSort(String(column.key))
                    }
                  >
                    <div className="flex items-center gap-2">
                      {column.label}
                      {column.sortable && renderSortIcon(String(column.key))}
                    </div>
                  </TableHead>
                ))}

                {actions.length > 0 && (
                  <TableHead className="w-12">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>{renderTableContent()}</TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// PERFORMANCE OPTIMIZED EXPORT WITH REACT.MEMO
// ============================================================================

/**
 * Memoized Unified Data Table Component
 * Prevents unnecessary re-renders of expensive table operations
 */
export const UnifiedDataTable = memo(UnifiedDataTableComponent) as <T>(
  props: DataTableProps<T>
) => React.ReactElement;

// Export default for easier imports
export default UnifiedDataTable;
