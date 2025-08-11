"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import {
  Search,
  Filter,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Grid,
  List,
  SortAsc,
  SortDesc,
  X,
} from "lucide-react";
import { useState, useMemo, useRef, ReactNode, Fragment } from "react";
import { CardView } from "@/components/layout/responsive-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// Core column definition
export interface ColumnDef<T> {
  id: string;
  key: keyof T;
  label: string;
  essential?: boolean; // Show by default
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: T) => ReactNode;
  hidden?: boolean;
}

// Filter definition for simple filtering
export interface FilterOption {
  id: string;
  label: string;
  value: any;
  count?: number;
}

export interface FilterDef {
  id: string;
  label: string;
  type: "select" | "multiselect" | "boolean" | "date-range";
  options?: FilterOption[];
}

// Row action definition
export interface RowAction<T> {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: (row: T) => void;
  disabled?: (row: T) => boolean;
  variant?: "default" | "destructive";
}

// Props interface
interface ModernDataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  filters?: FilterDef[];
  rowActions?: RowAction<T>[];
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  viewToggle?: boolean;
  expandableRows?: boolean;
  renderExpandedRow?: (row: T) => ReactNode;
  onRowClick?: (row: T) => void;
  emptyState?: ReactNode;
  pageSize?: number;
  className?: string;
  enableVirtualization?: boolean;
  virtualizationThreshold?: number; // number of rows to enable virtualization
  rowEstimateHeightPx?: number; // estimated row height for virtualization
  // UI controls
  showViewToggleInToolbar?: boolean; // optionally hide view toggle if page provides a separate control
  showRowActionsInCardView?: boolean; // show row actions as buttons in card view
  // Custom renderers
  renderCardItem?: (row: T, index: number) => ReactNode; // override default card layout
}

// Sort state
type SortState<T> = {
  column: keyof T | null;
  direction: "asc" | "desc";
};

// Filter state
type FilterState = Record<string, any>;

// View state
type ViewMode = "table" | "card";

/**
 * Modern DataTable Component
 *
 * Features:
 * - Progressive disclosure (only essential columns shown by default)
 * - Smart search instead of complex filtering
 * - Mobile-first responsive design
 * - Expandable rows for additional details
 * - Card view alternative for mobile
 */
export function ModernDataTable<T extends Record<string, any>>({
  data,
  columns,
  filters = [],
  rowActions = [],
  loading = false,
  searchable = true,
  searchPlaceholder = "Search...",
  viewToggle = true,
  expandableRows = false,
  renderExpandedRow,
  onRowClick,
  emptyState,
  pageSize = 20,
  className,
  enableVirtualization = true,
  virtualizationThreshold = 150,
  rowEstimateHeightPx = 48,
  showViewToggleInToolbar = true,
  showRowActionsInCardView = false,
  renderCardItem,
}: ModernDataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortState, setSortState] = useState<SortState<T>>({
    column: null,
    direction: "asc",
  });
  const [filterState, setFilterState] = useState<FilterState>({});
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  // Filter and search data (must be computed before using its length)
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(query)
        )
      );
    }

    // Apply filters
    Object.entries(filterState).forEach(([filterId, filterValue]) => {
      if (
        filterValue !== undefined &&
        filterValue !== null &&
        filterValue !== ""
      ) {
        const filterDef = filters.find(f => f.id === filterId);
        if (filterDef) {
          // Simple filter implementation - can be extended
          result = result.filter(row => {
            const rowValue = row[filterId as keyof T];
            if (Array.isArray(filterValue)) {
              return filterValue.includes(rowValue);
            }
            return rowValue === filterValue;
          });
        }
      }
    });

    // Apply sorting
    if (sortState.column) {
      result.sort((a, b) => {
        const aVal = a[sortState.column!];
        const bVal = b[sortState.column!];

        if (aVal < bVal) return sortState.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortState.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchQuery, filterState, sortState, filters]);

  // Determine whether to enable virtualization
  // Auto-disable expansion when dataset is large so virtualization can activate
  const largeDataset = filteredData.length > virtualizationThreshold;
  const allowExpansion = expandableRows && !largeDataset;
  const virtualizationEnabled =
    enableVirtualization &&
    viewMode === "table" &&
    !allowExpansion &&
    filteredData.length > virtualizationThreshold;

  // Setup virtualization when enabled
  const scrollParentRef = useRef<HTMLDivElement | null>(null);
  const rowVirtualizer = useVirtualizer({
    count: virtualizationEnabled ? filteredData.length : 0,
    getScrollElement: () => scrollParentRef.current,
    estimateSize: () => rowEstimateHeightPx,
    overscan: 10,
  });

  // Get essential columns (shown by default)
  const essentialColumns = columns.filter(col => col.essential && !col.hidden);
  const nonEssentialColumns = columns.filter(
    col => !col.essential && !col.hidden
  );

  const handleSort = (column: keyof T) => {
    setSortState(prev => ({
      column,
      direction:
        prev.column === column && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const toggleRowExpanded = (rowId: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(rowId)) {
        next.delete(rowId);
      } else {
        next.add(rowId);
      }
      return next;
    });
  };

  const renderTableView = () => (
    <div className="progressive-table border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="table-row">
            {allowExpansion && <TableHead className="w-10"></TableHead>}
            {essentialColumns.map(column => (
              <TableHead
                key={column.id}
                data-column={column.id}
                data-essential={column.essential}
                data-priority={column.essential ? "high" : "medium"}
                className={cn(
                  "table-cell",
                  column.sortable && "cursor-pointer hover:bg-muted/50",
                  column.width,
                  !column.essential && "@md:table-cell hidden"
                )}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center gap-2">
                  {column.label}
                  {column.sortable &&
                    sortState.column === column.key &&
                    (sortState.direction === "asc" ? (
                      <SortAsc className="h-3 w-3" />
                    ) : (
                      <SortDesc className="h-3 w-3" />
                    ))}
                </div>
              </TableHead>
            ))}
            {rowActions.length > 0 && <TableHead className="w-10"></TableHead>}
          </TableRow>
        </TableHeader>
        {!virtualizationEnabled ? (
          <TableBody>
            {filteredData.map((row, index) => {
              const rowId = row.id || index;
              const isExpanded = expandedRows.has(String(rowId));

              return (
                <Fragment key={rowId}>
                  <TableRow
                    className={cn(
                      "table-row",
                      onRowClick && "cursor-pointer hover:bg-muted/50",
                      isExpanded && "bg-muted"
                    )}
                    onClick={() => onRowClick?.(row)}
                  >
                    {allowExpansion && (
                      <TableCell className="table-cell">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={e => {
                            e.stopPropagation();
                            toggleRowExpanded(String(rowId));
                          }}
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                        </Button>
                      </TableCell>
                    )}
                    {essentialColumns.map(column => (
                      <TableCell
                        key={column.id}
                        data-column={column.id}
                        data-essential={column.essential}
                        className={cn(
                          "table-cell",
                          !column.essential && "@md:table-cell hidden"
                        )}
                      >
                        {column.render
                          ? column.render(row[column.key], row)
                          : String(row[column.key])}
                      </TableCell>
                    ))}
                    {rowActions.length > 0 && (
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                            >
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {rowActions.map(action => (
                              <DropdownMenuItem
                                key={action.id}
                                onClick={() => action.onClick(row)}
                                disabled={action.disabled?.(row)}
                                className={
                                  action.variant === "destructive"
                                    ? "text-red-600"
                                    : ""
                                }
                              >
                                {action.icon && (
                                  <action.icon className="h-4 w-4 mr-2" />
                                )}
                                {action.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                  {allowExpansion && isExpanded && renderExpandedRow && (
                    <TableRow>
                      <TableCell
                        colSpan={
                          essentialColumns.length +
                          (rowActions.length > 0 ? 1 : 0) +
                          1
                        }
                        className="bg-muted/30 p-0"
                      >
                        <div className="expandable-content pl-8 pr-4 py-4">
                          {renderExpandedRow(row)}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })}
          </TableBody>
        ) : (
          // Virtualized body
          <TableBody>
            <tr>
              <td
                colSpan={
                  essentialColumns.length +
                  (rowActions.length > 0 ? 1 : 0) +
                  (allowExpansion ? 1 : 0)
                }
              >
                <div
                  ref={scrollParentRef}
                  className="max-h-[70vh] overflow-auto"
                >
                  <div
                    style={{
                      height: `${rowVirtualizer.getTotalSize()}px`,
                      position: "relative",
                    }}
                  >
                    {rowVirtualizer.getVirtualItems().map(virtualRow => {
                      const index = virtualRow.index;
                      const row = filteredData[index];
                      const rowId = row.id || index;
                      const isExpanded = false; // virtualization path disables expansion for stability

                      return (
                        <div
                          key={rowId}
                          data-index={index}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            transform: `translateY(${virtualRow.start}px)`,
                          }}
                        >
                          <TableRow
                            className={cn(
                              "table-row",
                              onRowClick && "cursor-pointer hover:bg-muted/50"
                            )}
                            onClick={() => onRowClick?.(row)}
                          >
                            {expandableRows && (
                              <TableCell className="table-cell"></TableCell>
                            )}
                            {essentialColumns.map(column => (
                              <TableCell
                                key={`${rowId}-${column.id}`}
                                data-column={column.id}
                                data-essential={column.essential}
                                className={cn(
                                  "table-cell",
                                  !column.essential && "@md:table-cell hidden"
                                )}
                              >
                                {column.render
                                  ? column.render(row[column.key], row)
                                  : String(row[column.key])}
                              </TableCell>
                            ))}
                            {rowActions.length > 0 && (
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                    >
                                      <MoreHorizontal className="h-3 w-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    {rowActions.map(action => (
                                      <DropdownMenuItem
                                        key={action.id}
                                        onClick={() => action.onClick(row)}
                                        disabled={action.disabled?.(row)}
                                        className={
                                          action.variant === "destructive"
                                            ? "text-red-600"
                                            : ""
                                        }
                                      >
                                        {action.icon && (
                                          <action.icon className="h-4 w-4 mr-2" />
                                        )}
                                        {action.label}
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            )}
                          </TableRow>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </td>
            </tr>
          </TableBody>
        )}
      </Table>
    </div>
  );

  const renderCardView = () => (
    <div className="card-container">
      <CardView
        items={filteredData}
        loading={loading}
        renderCard={(row, index) => {
          if (renderCardItem) {
            return renderCardItem(row, index);
          }
          const titleColumn = essentialColumns[0];
          const metaColumns = essentialColumns.slice(1);
          return (
            <Card
              key={row.id || index}
              className="smart-card cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onRowClick?.(row)}
            >
              <CardContent className="p-[--card-padding] space-y-2">
                {titleColumn && (
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold truncate">
                      {titleColumn.render
                        ? titleColumn.render(row[titleColumn.key], row)
                        : String(row[titleColumn.key])}
                    </h3>
                  </div>
                )}
                {metaColumns.length > 0 && (
                  <div className="space-y-1">
                    {metaColumns.map(column => (
                      <div
                        key={column.id}
                        className="flex justify-between items-center gap-4"
                      >
                        <span className="text-xs text-neutral-600 dark:text-neutral-400">
                          {column.label}
                        </span>
                        <div className="text-sm font-medium truncate max-w-[60%] text-right">
                          {column.render
                            ? column.render(row[column.key], row)
                            : String(row[column.key])}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {showRowActionsInCardView && rowActions.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t">
                    {rowActions.map(action => (
                      <Button
                        key={action.id}
                        variant="outline"
                        size="sm"
                        onClick={e => {
                          e.stopPropagation();
                          action.onClick(row);
                        }}
                        disabled={action.disabled?.(row)}
                      >
                        {action.icon && (
                          <action.icon className="h-3 w-3 mr-1" />
                        )}
                        {action.label}
                      </Button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        }}
      />
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse"></div>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-16 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("@container space-y-4 modern-data-table", className)}>
      {/* Toolbar with Container Queries */}
      <div className="flex flex-col @sm:flex-row gap-4">
        {/* Search with Responsive Width */}
        {searchable && (
          <div className="relative flex-1 @sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Filters */}
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

          {/* View Toggle */}
          {viewToggle && showViewToggleInToolbar && (
            <div className="flex items-center border rounded-md">
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="rounded-r-none"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "card" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("card")}
                className="rounded-l-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Simple Filters Panel */}
      <Collapsible open={showFilters}>
        <CollapsibleContent className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
            {filters.map(filter => (
              <div key={filter.id}>
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {filter.label}
                </label>
                {/* Simple filter implementation - extend as needed */}
                <Input
                  placeholder={`Filter by ${filter.label.toLowerCase()}`}
                  value={filterState[filter.id] || ""}
                  onChange={e =>
                    setFilterState(prev => ({
                      ...prev,
                      [filter.id]: e.target.value,
                    }))
                  }
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
        </CollapsibleContent>
      </Collapsible>

      {/* Data Display */}
      {filteredData.length === 0 ? (
        <div className="text-center py-12">
          {emptyState || (
            <div className="text-neutral-500 dark:text-neutral-400">
              No data to display
            </div>
          )}
        </div>
      ) : viewMode === "table" ? (
        renderTableView()
      ) : (
        renderCardView()
      )}

      {/* Results Summary */}
      <div className="text-sm text-neutral-600 dark:text-neutral-400 text-center">
        Showing {filteredData.length} of {data.length} items
      </div>
    </div>
  );
}
