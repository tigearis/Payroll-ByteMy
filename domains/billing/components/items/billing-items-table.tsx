"use client";

import React, { useState } from "react";
import { useMutation } from "@apollo/client";
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
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { UpdateBillingItemAdvancedDocument, ApproveBillingItemAdvancedDocument } from "../../graphql/generated/graphql";

interface BillingItem {
  id: string;
  description?: string | null;
  amount?: number | null;
  quantity: number;
  unitPrice: number;
  status?: string | null;
  isApproved?: boolean | null;
  createdAt?: string | null;
  client?: {
    id: string;
    name?: string | null;
  } | null;
  service?: {
    id: string;
    name?: string | null;
    category?: string | null;
    billingUnit?: string | null;
  } | null;
  staffUser?: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
  } | null;
  payroll?: {
    id: string;
    name?: string | null;
  } | null;
}

interface BillingItemsTableProps {
  data: BillingItem[];
  loading: boolean;
  refetch: () => void;
}

export function BillingItemsTable({ data, loading, refetch }: BillingItemsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // Mutations
  const [approveBillingItem] = useMutation(ApproveBillingItemAdvancedDocument, {
    onCompleted: () => {
      toast.success("Billing item approved");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to approve item: ${error.message}`);
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    }).format(amount);
  };

  const handleApprove = async (itemId: string) => {
    try {
      await approveBillingItem({
        variables: {
          id: itemId,
          approvedBy: "current-user-id", // TODO: Get from session
        },
      });
    } catch (error) {
      console.error("Error approving billing item:", error);
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
            className="p-0 h-auto font-medium"
          >
            Service
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const service = row.original.service;
        return (
          <div className="flex flex-col">
            <div className="font-medium">
              {service?.name || "Unnamed Service"}
            </div>
            <div className="text-sm text-gray-500">
              {service?.category} • {service?.billingUnit}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="max-w-48 truncate" title={row.getValue("description")}>
          {row.getValue("description")}
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
            className="p-0 h-auto font-medium"
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
          <div className="flex items-center">
            <Building2 className="mr-2 h-4 w-4 text-gray-400" />
            {client?.name || "Unknown Client"}
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
          <div className="flex items-center">
            <User className="mr-2 h-4 w-4 text-gray-400" />
            {staff.firstName} {staff.lastName}
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
            className="p-0 h-auto font-medium"
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
            className="p-0 h-auto font-medium"
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
            className="p-0 h-auto font-medium"
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Total
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = row.getValue("amount") as number;
        return (
          <div className="text-right font-mono font-medium">
            {formatCurrency(amount)}
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
        
        const getStatusBadge = () => {
          if (isApproved) {
            return (
              <Badge className="bg-green-100 text-green-800">
                <Check className="w-3 h-3 mr-1" />
                Approved
              </Badge>
            );
          }
          
          switch (status?.toLowerCase()) {
            case "pending":
              return (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  <Clock className="w-3 h-3 mr-1" />
                  Pending
                </Badge>
              );
            case "rejected":
              return (
                <Badge variant="destructive" className="bg-red-100 text-red-800">
                  <X className="w-3 h-3 mr-1" />
                  Rejected
                </Badge>
              );
            default:
              return (
                <Badge variant="outline">
                  {status || "Draft"}
                </Badge>
              );
          }
        };

        return getStatusBadge();
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 h-auto font-medium"
          >
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
              <Button variant="ghost" className="h-8 w-8 p-0">
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
              <DropdownMenuItem>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <PermissionGuard action="update">
                <DropdownMenuItem>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Item
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
    data,
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
        <CardTitle>Billing Items</CardTitle>
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter services..."
            value={(table.getColumn("service.name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("service.name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
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
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
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
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
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
                    No billing items found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
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