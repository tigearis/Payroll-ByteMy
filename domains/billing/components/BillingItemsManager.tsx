"use client";

import { useMutation } from "@apollo/client";
import { useUser } from "@clerk/nextjs";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Eye,
  Edit,
  Check,
  X,
  Clock,
  DollarSign,
  User,
  Building2,
  Filter,
  Download,
  RefreshCw,
  Plus,
  Search,
  Calendar,
  CheckSquare
} from "lucide-react";
import Link from "next/link";
import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  UpdateBillingItemAdvancedDocument, 
  ApproveBillingItemAdvancedDocument,
  BulkUpdateBillingItemsStatusAdvancedDocument 
} from "../graphql/generated/graphql";
import type { BillingItemsManagerProps, BillingItem, BillingStatus } from "../types/billing.types";

export function BillingItemsManager({ 
  billingItems, 
  loading, 
  onRefetch,
  onStatusChange,
  onBulkAction 
}: BillingItemsManagerProps) {
  const { user } = useUser();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<BillingStatus | "all">("all");

  // Mutations
  const [approveBillingItem] = useMutation(ApproveBillingItemAdvancedDocument, {
    onCompleted: () => {
      toast.success("Billing item approved");
      onRefetch?.();
    },
    onError: (error) => {
      toast.error(`Failed to approve item: ${error.message}`);
    },
  });

  const [bulkUpdateStatus] = useMutation(BulkUpdateBillingItemsStatusAdvancedDocument, {
    onCompleted: (data) => {
      toast.success(`Updated ${data.updateBillingItemsMany?.[0]?.affectedRows || 0} items`);
      onRefetch?.();
      setRowSelection({});
    },
    onError: (error) => {
      toast.error(`Failed to bulk update: ${error.message}`);
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    }).format(amount);
  };

  // Filter data based on status and global filter
  const filteredData = useMemo(() => {
    let filtered = billingItems;
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(item => {
        if (statusFilter === "approved") return item.isApproved;
        return item.status?.toLowerCase() === statusFilter;
      });
    }
    
    if (globalFilter) {
      const searchTerm = globalFilter.toLowerCase();
      filtered = filtered.filter(item =>
        item.description?.toLowerCase().includes(searchTerm) ||
        item.client?.name?.toLowerCase().includes(searchTerm) ||
        item.staffUser?.firstName?.toLowerCase().includes(searchTerm) ||
        item.staffUser?.lastName?.toLowerCase().includes(searchTerm) ||
        item.service?.name?.toLowerCase().includes(searchTerm) ||
        item.serviceName?.toLowerCase().includes(searchTerm)
      );
    }
    
    return filtered;
  }, [billingItems, statusFilter, globalFilter]);

  const handleApprove = async (itemId: string) => {
    if (!user?.id) {
      toast.error("User not authenticated");
      return;
    }

    try {
      await approveBillingItem({
        variables: {
          id: itemId,
          approvedBy: user.id,
        },
      });
      onStatusChange?.(itemId, "approved");
    } catch (error) {
      console.error("Error approving billing item:", error);
    }
  };

  const handleBulkAction = async (action: string) => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedIds = selectedRows.map(row => row.original.id);
    
    if (selectedIds.length === 0) {
      toast.error("No items selected");
      return;
    }

    if (!user?.id && action === "approve") {
      toast.error("User not authenticated");
      return;
    }

    try {
      switch (action) {
        case "approve":
          await bulkUpdateStatus({
            variables: {
              ids: selectedIds,
              status: "approved",
              ...(user?.id && { approvedBy: user.id }),
            },
          });
          break;
        case "reject":
          await bulkUpdateStatus({
            variables: {
              ids: selectedIds,
              status: "rejected",
              ...(user?.id && { approvedBy: user.id }),
            },
          });
          break;
        default:
          onBulkAction?.(selectedIds, action);
      }
    } catch (error) {
      console.error("Error performing bulk action:", error);
    }
  };

  const getStatusBadge = (status: string | null | undefined, isApproved?: boolean | null) => {
    if (isApproved) {
      return (
        <Badge className="bg-green-100 text-green-800 gap-1">
          <Check className="w-3 h-3" />
          Approved
        </Badge>
      );
    }
    
    switch (status?.toLowerCase()) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 gap-1">
            <Clock className="w-3 h-3" />
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 gap-1">
            <X className="w-3 h-3" />
            Rejected
          </Badge>
        );
      case "draft":
        return (
          <Badge variant="outline" className="gap-1">
            <Edit className="w-3 h-3" />
            Draft
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status || "Unknown"}
          </Badge>
        );
    }
  };

  const columns: ColumnDef<BillingItem>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "service.name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 h-auto font-medium hover:bg-gray-100"
          >
            Service
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const service = row.original.service;
        const serviceName = service?.name || row.original.serviceName;
        return (
          <div className="flex flex-col min-w-0">
            <div className="font-medium truncate" title={serviceName || undefined}>
              {serviceName || "Unnamed Service"}
            </div>
            {service?.category && (
              <div className="text-sm text-gray-500 truncate">
                {service.category}
                {service.billingUnit && ` • ${service.billingUnit}`}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="max-w-48 truncate" title={row.getValue("description") || undefined}>
          {row.getValue("description") || "—"}
        </div>
      ),
    },
    {
      accessorKey: "client.name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 h-auto font-medium hover:bg-gray-100"
          >
            <Building2 className="mr-2 h-4 w-4" />
            Client
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const client = row.original.client;
        return (
          <div className="flex items-center min-w-0">
            <Building2 className="mr-2 h-4 w-4 text-gray-400 flex-shrink-0" />
            <span className="truncate" title={client?.name || undefined}>
              {client?.name || "Unknown Client"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "staffUser",
      header: "Staff",
      cell: ({ row }) => {
        const staff = row.original.staffUser;
        return staff ? (
          <div className="flex items-center min-w-0">
            <User className="mr-2 h-4 w-4 text-gray-400 flex-shrink-0" />
            <span className="truncate">
              {staff.firstName} {staff.lastName}
            </span>
          </div>
        ) : (
          <span className="text-gray-400">No staff assigned</span>
        );
      },
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 h-auto font-medium hover:bg-gray-100"
          >
            Qty
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const quantity = row.getValue("quantity") as number;
        const service = row.original.service;
        return (
          <div className="text-right">
            {quantity} {service?.billingUnit || "units"}
          </div>
        );
      },
    },
    {
      accessorKey: "unitPrice",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 h-auto font-medium hover:bg-gray-100"
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Rate
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const unitPrice = row.getValue("unitPrice") as number;
        return (
          <div className="text-right font-mono">
            {formatCurrency(unitPrice)}
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 h-auto font-medium hover:bg-gray-100"
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Total
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = row.getValue("amount") as number;
        const totalAmount = row.original.totalAmount;
        return (
          <div className="text-right font-mono font-medium">
            {formatCurrency(totalAmount || amount || 0)}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const isApproved = row.original.isApproved;
        return getStatusBadge(status, isApproved);
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 h-auto font-medium hover:bg-gray-100"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Created
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as string | null;
        return (
          <div className="text-sm">
            {date ? format(new Date(date), "MMM d, yyyy") : "—"}
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(item.id)}
              >
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/billing/items/${item.id}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <PermissionGuard action="update">
                <DropdownMenuItem asChild>
                  <Link href={`/billing/items/${item.id}/edit`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Item
                  </Link>
                </DropdownMenuItem>
              </PermissionGuard>
              {!item.isApproved && (
                <PermissionGuard action="approve">
                  <DropdownMenuItem onClick={() => handleApprove(item.id)}>
                    <Check className="w-4 h-4 mr-2" />
                    Approve
                  </DropdownMenuItem>
                </PermissionGuard>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-500">Loading billing items...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Billing Items Management</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              View, filter, and manage all billing items
            </p>
          </div>
          <div className="flex items-center gap-2">
            {onRefetch && (
              <Button variant="outline" size="sm" onClick={onRefetch}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            )}
            <PermissionGuard action="create">
              <Button asChild size="sm">
                <Link href="/billing/items/new">
                  <Plus className="h-4 w-4 mr-2" />
                  New Item
                </Link>
              </Button>
            </PermissionGuard>
          </div>
        </div>
        
        {/* Enhanced Filters */}
        <div className="flex items-center gap-4 pt-4">
          <div className="flex-1 max-w-sm">
            <Label htmlFor="global-search" className="sr-only">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="global-search"
                placeholder="Search items, clients, staff..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={statusFilter} onValueChange={(value: BillingStatus | "all") => setStatusFilter(value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Columns
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Bulk Actions */}
        {Object.keys(rowSelection).length > 0 && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg mb-4">
            <CheckSquare className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-900">
              {Object.keys(rowSelection).length} item(s) selected
            </span>
            <div className="flex items-center gap-2 ml-auto">
              <PermissionGuard action="approve">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("approve")}
                  className="text-green-600 hover:bg-green-50"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Approve
                </Button>
              </PermissionGuard>
              <PermissionGuard action="approve">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("reject")}
                  className="text-red-600 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </PermissionGuard>
            </div>
          </div>
        )}

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-gray-50">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="font-medium">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-gray-50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                      <DollarSign className="h-8 w-8 mb-2 opacity-50" />
                      <p>No billing items found</p>
                      <p className="text-sm">
                        {globalFilter || statusFilter !== "all" 
                          ? "Try adjusting your filters" 
                          : "Create your first billing item to get started"
                        }
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Enhanced Pagination */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected
            </span>
            <span>
              Showing {Math.min(
                table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1,
                table.getFilteredRowModel().rows.length
              )} to {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )} of {table.getFilteredRowModel().rows.length} entries
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}