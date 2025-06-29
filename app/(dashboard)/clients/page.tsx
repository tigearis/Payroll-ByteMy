// app/(dashboard)/clients/page.tsx
"use client";

import { useQuery } from "@apollo/client";
import { useUser } from "@clerk/nextjs";
import {
  PlusCircle,
  Search,
  Filter,
  Grid3X3,
  List,
  TableIcon,
  RefreshCw,
  Building2,
  Users,
  Eye,
  Edit,
  MoreHorizontal,
  X,
  Download,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { GraphQLErrorBoundary } from "@/components/graphql-error-boundary";
import { PermissionGuard } from "@/components/auth/permission-guard";
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
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClientsTable } from "@/domains/clients/components/clients-table";
import { GetClientsListDocument, GetClientsDashboardStatsDocument } from "@/domains/clients/graphql/generated/graphql";
import { useSmartPolling } from "@/hooks/use-polling";
import { useStrategicQuery } from "@/hooks/use-strategic-query";
import { useUserRole } from "@/hooks/use-user-role";

type ViewMode = "cards" | "table" | "list";

// Custom MultiSelect Component
interface MultiSelectProps {
  options: Array<{ value: string; label: string }>;
  selected: string[];
  onSelectionChange: (selected: string[]) => void;
  placeholder: string;
  label?: string;
}

function MultiSelect({
  options,
  selected,
  onSelectionChange,
  placeholder,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const handleToggle = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter(item => item !== value)
      : [...selected, value];
    onSelectionChange(newSelected);
  };

  const selectedLabels = options
    .filter(option => selected.includes(option.value))
    .map(option => option.label);

  const displayText =
    selectedLabels.length > 0
      ? selectedLabels.length === 1
        ? selectedLabels[0]
        : `${selectedLabels.length} selected`
      : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {displayText}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <div className="max-h-60 overflow-auto">
          {options.map(option => (
            <div
              key={option.value}
              className="flex items-center space-x-2 p-2 hover:bg-accent cursor-pointer"
              onClick={() => handleToggle(option.value)}
            >
              <Checkbox
                checked={selected.includes(option.value)}
                onChange={() => handleToggle(option.value)}
              />
              <span className="text-sm">{option.label}</span>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function ClientsPage() {
  const { user, isLoaded: userLoaded } = useUser();
  const { hasPermission, userRole, isLoading } = useUserRole();
  const canCreateClient = hasPermission("client:write");
  const canViewClients = hasPermission("client:read");
  
  // Debug user and permissions
  console.log("User and permissions:", {
    userLoaded,
    user: user?.id,
    userRole,
    isLoading,
    canCreateClient,
    canViewClients,
  });

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [payrollCountFilter, setPayrollCountFilter] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Sorting state
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("ASC");

  // Build GraphQL where conditions for server-side filtering
  const buildWhereConditions = () => {
    const conditions: any[] = [];

    // Search term filter
    if (searchTerm) {
      conditions.push({
        _or: [
          { name: { _ilike: `%${searchTerm}%` } },
          { contactEmail: { _ilike: `%${searchTerm}%` } },
          { contactPerson: { _ilike: `%${searchTerm}%` } },
          { contactPhone: { _ilike: `%${searchTerm}%` } }
        ]
      });
    }

    // Status filter
    if (statusFilter.length > 0) {
      if (statusFilter.includes("active") && !statusFilter.includes("inactive")) {
        conditions.push({ active: { _eq: true } });
      } else if (statusFilter.includes("inactive") && !statusFilter.includes("active")) {
        conditions.push({ active: { _eq: false } });
      }
      // If both are selected, no filter needed
    }

    return conditions.length > 0 ? { _and: conditions } : {};
  };

  // Build GraphQL orderBy for server-side sorting
  const buildOrderBy = () => {
    const sortMap: Record<string, string> = {
      name: "name",
      contactEmail: "contactEmail",
      contactPerson: "contactPerson",
      createdAt: "createdAt"
    };

    const field = sortMap[sortField] || "name";
    return [{ [field]: sortDirection }];
  };

  // Calculate pagination offset
  const offset = (currentPage - 1) * pageSize;

  // Get dashboard stats efficiently
  const { loading: statsLoading, error: statsError, data: statsData } = useQuery(GetClientsDashboardStatsDocument, {
      skip: !userLoaded || !user || !canViewClients,
      errorPolicy: "all",
    }
  );

  // Main GraphQL operations with server-side filtering and pagination
  const { loading, error, data, refetch, startPolling, stopPolling } = useStrategicQuery(
    GetClientsListDocument,
    "clients",
    {
      variables: {
        limit: pageSize,
        offset: offset,
        where: buildWhereConditions(),
        orderBy: buildOrderBy()
      },
      pollInterval: 60000,
      skip: !userLoaded || !user || !canViewClients,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network"
    }
  );

  useSmartPolling(
    { startPolling, stopPolling, refetch },
    {
      defaultInterval: 60000,
      pauseOnHidden: true,
      refetchOnVisible: true,
    }
  );

  // Show loading while user authentication is loading
  if (!userLoaded || isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  // Show sign-in prompt if user is not authenticated
  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          Please sign in to access clients
        </div>
        <Link href="/sign-in">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Sign In
          </button>
        </Link>
      </div>
    );
  }

  // Show permission error if user doesn't have client read access
  if (!canViewClients) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          You don't have permission to view clients
        </div>
        <p className="text-sm text-gray-400">
          Current role: {userRole} | Required permission: client:read
        </p>
      </div>
    );
  }

  if (error || statsError) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          Error loading clients: {error?.message || statsError?.message}
        </div>
        {error?.graphQLErrors && (
          <div className="text-sm text-gray-600 mb-4">
            GraphQL Errors: {error.graphQLErrors.map(e => e.message).join(", ")}
          </div>
        )}
        {error?.networkError && (
          <div className="text-sm text-gray-600 mb-4">
            Network Error: {error.networkError.message}
          </div>
        )}
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  const clients = data?.clients || [];
  const totalCount = data?.clientsAggregate?.aggregate?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  // Minimal client-side processing for display purposes only
  const displayClients = clients.map((client: any) => ({
    ...client,
    payrollCount: client.payrollsAggregate?.aggregate?.count || 0,
    totalEmployees: 0 // Not available per client in current query
  }));

  // Client-side payroll count filtering (since it requires aggregation)
  const finalClients = payrollCountFilter.length > 0 
    ? displayClients.filter((client: any) => {
        const payrollCount = client.payrollCount;
        return (
          (payrollCountFilter.includes("0") && payrollCount === 0) ||
          (payrollCountFilter.includes("1-5") && payrollCount >= 1 && payrollCount <= 5) ||
          (payrollCountFilter.includes("6-10") && payrollCount >= 6 && payrollCount <= 10) ||
          (payrollCountFilter.includes("10+") && payrollCount > 10)
        );
      })
    : displayClients;

  // Get unique values for filters from current page data
  const uniquePayrollCounts = Array.from(
    new Set(clients.map((c: any) => c.payrollCount?.aggregate?.count || 0))
  ) as number[];
  uniquePayrollCounts.sort((a, b) => a - b);

  // Add event handlers for server-side filtering
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC");
    } else {
      setSortField(field);
      setSortDirection("ASC");
    }
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  // Reset to first page when filters change
  const resetToFirstPage = () => {
    setCurrentPage(1);
  };

  // Helper functions
  const _formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    }).format(amount || 0);
  };

  const getStatusColor = (active: boolean) => {
    return active
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  // Clear filters function
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter([]);
    setPayrollCountFilter([]);
  };

  // Check if any filters are active
  const hasActiveFilters =
    searchTerm || statusFilter.length > 0 || payrollCountFilter.length > 0;

  // Get summary statistics from dedicated stats query
  const totalClients = statsData?.activeClientsCount?.aggregate?.count || 0;
  const activeClients = totalClients; // This query already filters for active clients
  const totalPayrolls = statsData?.totalPayrollsCount?.aggregate?.count || 0;
  const totalEmployees = statsData?.totalEmployeesSum?.aggregate?.sum?.employeeCount || 0;


  // Use useEffect to reset page when filters change
  React.useEffect(() => {
    resetToFirstPage();
  }, [searchTerm, statusFilter, payrollCountFilter]);

  // Render card view
  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {finalClients.map((client: any) => (
        <Card
          key={client.id}
          className="hover:shadow-lg transition-shadow duration-200"
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{client.name}</CardTitle>
              <Badge className={getStatusColor(client.active)}>
                {client.active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  {client.contactPerson || "No contact"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  {client.payrollCount || 0} payrolls
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t">
              <Link href={`/clients/${client.id}`}>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/clients/${client.id}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Client
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Render list view
  const renderListView = () => (
    <div className="space-y-3">
      {finalClients.map((client: any) => (
        <Card
          key={client.id}
          className="hover:shadow-md transition-shadow duration-200"
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{client.name}</h3>
                  <p className="text-sm text-gray-500">
                    {client.contactPerson || "No contact person"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right text-sm">
                  <p className="font-medium text-gray-900">
                    {client.payrollCount || 0} payrolls
                  </p>
                  <p className="text-gray-500">
                    {client.active ? "Active" : "Inactive"} client
                  </p>
                </div>

                <Badge className={getStatusColor(client.active)}>
                  {client.active ? "Active" : "Inactive"}
                </Badge>

                <Link href={`/clients/${client.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/clients/${client.id}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/clients/${client.id}/edit`}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Client
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500">
            Manage your clients and their payroll information
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {canCreateClient && (
            <Link href="/clients/new">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Client
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Clients
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalClients}
                </p>
              </div>
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Clients
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {activeClients}
                </p>
              </div>
              <Building2 className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Payrolls
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalPayrolls}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Employees
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalEmployees.toLocaleString()}
                </p>
              </div>
              <Users className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search clients, contacts, emails, phone..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 w-[300px]"
                />
              </div>

              {/* Advanced Filters Button */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? "bg-primary/10" : ""}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {
                      [
                        searchTerm,
                        statusFilter.length > 0,
                        payrollCountFilter.length > 0,
                      ].filter(Boolean).length
                    }
                  </Badge>
                )}
              </Button>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}

              {/* Sort Dropdown */}
              <Select
                value={`${sortField}-${sortDirection}`}
                onValueChange={value => {
                  const [field, direction] = value.split("-");
                  setSortField(field);
                  setSortDirection(direction as "ASC" | "DESC");
                }}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-ASC">Name A-Z</SelectItem>
                  <SelectItem value="name-DESC">Name Z-A</SelectItem>
                  <SelectItem value="status-ASC">Status A-Z</SelectItem>
                  <SelectItem value="status-DESC">Status Z-A</SelectItem>
                  <SelectItem value="payrollCount-ASC">Payrolls ↑</SelectItem>
                  <SelectItem value="payrollCount-DESC">Payrolls ↓</SelectItem>
                  <SelectItem value="activePayrolls-ASC">
                    Active Payrolls ↑
                  </SelectItem>
                  <SelectItem value="activePayrolls-DESC">
                    Active Payrolls ↓
                  </SelectItem>
                  <SelectItem value="contact_person-ASC">
                    Contact A-Z
                  </SelectItem>
                  <SelectItem value="contact_person-DESC">
                    Contact Z-A
                  </SelectItem>
                  <SelectItem value="contact_email-ASC">Email A-Z</SelectItem>
                  <SelectItem value="contact_email-DESC">Email Z-A</SelectItem>
                  <SelectItem value="lastUpdated-ASC">
                    Last Updated ↑
                  </SelectItem>
                  <SelectItem value="lastUpdated-DESC">
                    Last Updated ↓
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "cards" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("cards")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
              >
                <TableIcon className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Advanced Filter Dropdowns */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t mt-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <MultiSelect
                  options={[
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                  ]}
                  selected={statusFilter}
                  onSelectionChange={setStatusFilter}
                  placeholder="All statuses"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Payroll Count
                </label>
                <MultiSelect
                  options={[
                    { value: "0", label: "No Payrolls (0)" },
                    { value: "1-5", label: "Small (1-5)" },
                    { value: "6-10", label: "Medium (6-10)" },
                    { value: "10+", label: "Large (10+)" },
                  ]}
                  selected={payrollCountFilter}
                  onSelectionChange={setPayrollCountFilter}
                  placeholder="All payroll counts"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content based on view mode */}
      {loading ? (
        <Card>
          <CardContent className="p-12">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </CardContent>
        </Card>
      ) : data?.clients?.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {hasActiveFilters ? "No clients found" : "No clients yet"}
              </h3>
              <p className="text-gray-500 mb-4">
                {hasActiveFilters
                  ? "Try adjusting your search criteria or filters"
                  : "Get started by adding your first client"}
              </p>
              {canCreateClient && !hasActiveFilters && (
                <Link href="/clients/new">
                  <Button>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add First Client
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div>
          {viewMode === "table" && (
            <ClientsTable
              clients={data?.clients || []}
              loading={loading}
              onRefresh={refetch}
            />
          )}

          {viewMode === "cards" && renderCardView()}

          {viewMode === "list" && renderListView()}
        </div>
      )}
    </div>
  );
}

// Export component wrapped with GraphQL error boundary and permission guard
export default function ClientsPageWithErrorBoundary() {
  return (
    <PermissionGuard 
      permission="client:read"
      fallback={
        <div className="container mx-auto p-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                You don't have permission to access client management.
                <br />
                This feature requires client read permissions.
              </div>
            </CardContent>
          </Card>
        </div>
      }
    >
      <GraphQLErrorBoundary>
        <ClientsPage />
      </GraphQLErrorBoundary>
    </PermissionGuard>
  );
}
