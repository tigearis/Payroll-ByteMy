// app/(dashboard)/clients/page.tsx
"use client";

import { GraphQLErrorBoundary } from "@/components/graphql-error-boundary";
import { useStrategicQuery } from "@/hooks/use-strategic-query";
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
import { useState } from "react";

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
import { GetAllClientsPaginatedDocument } from "@/domains/clients/graphql/generated/graphql";
import { useSmartPolling } from "@/hooks/use-polling";
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
  label,
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
  const canCreateClient = hasPermission("custom:client:write");

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [payrollCountFilter, setPayrollCountFilter] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [showFilters, setShowFilters] = useState(false);

  // Sorting state
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // GraphQL operations - only execute when user is loaded and authenticated
  const { loading, error, data, refetch, startPolling, stopPolling } = useStrategicQuery(
    GetAllClientsPaginatedDocument,
    "clients",
    {
      variables: {
        limit: 1000, // Fetch all clients for now
        offset: 0,
      },
      pollInterval: 60000,
      skip: !userLoaded || !user, // Skip query if user is not loaded or not authenticated
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

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          Error loading clients: {error.message}
        </div>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  const clients = data?.clients || [];

  // Debug: Log the data to see what we're getting
  console.log("Clients data:", {
    loading,
    error,
    clientsCount: clients.length,
    firstClient: clients[0],
    data: data?.clients?.slice(0, 2), // First 2 clients for debugging
  });

  // Get unique values for filters
  const uniquePayrollCounts = Array.from(
    new Set(clients.map((c: any) => c.payrollCount?.aggregate?.count || 0))
  ) as number[];
  uniquePayrollCounts.sort((a, b) => a - b);

  // Filter clients based on search, status, and payroll count
  const filteredClients = clients.filter((client: any) => {
    const matchesSearch =
      searchTerm === "" ||
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contactEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contactPhone?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter.length === 0 ||
      (statusFilter.includes("active") && client.active) ||
      (statusFilter.includes("inactive") && !client.active);

    const payrollCount = client.payrollCount?.aggregate?.count || 0;
    const matchesPayrollCount =
      payrollCountFilter.length === 0 ||
      (payrollCountFilter.includes("0") && payrollCount === 0) ||
      (payrollCountFilter.includes("1-5") &&
        payrollCount >= 1 &&
        payrollCount <= 5) ||
      (payrollCountFilter.includes("6-10") &&
        payrollCount >= 6 &&
        payrollCount <= 10) ||
      (payrollCountFilter.includes("10+") && payrollCount > 10);

    return matchesSearch && matchesStatus && matchesPayrollCount;
  });

  // Sort clients
  const sortedClients = [...filteredClients].sort((a, b) => {
    let aValue = (a as any)[sortField];
    let bValue = (b as any)[sortField];

    // Handle specific sort fields
    if (sortField === "payrollCount") {
      aValue = (a as any).payrollCount?.aggregate?.count || 0;
      bValue = (b as any).payrollCount?.aggregate?.count || 0;
    } else if (sortField === "activePayrolls") {
      // For now, use total count since we don't have active payroll count in this query
      aValue = (a as any).payrollCount?.aggregate?.count || 0;
      bValue = (b as any).payrollCount?.aggregate?.count || 0;
    } else if (sortField === "lastUpdated") {
      aValue = new Date((a as any).updatedAt || (a as any).createdAt);
      bValue = new Date((b as any).updatedAt || (b as any).createdAt);
    } else if (sortField === "contact_person") {
      aValue = (a as any).contactPerson || "";
      bValue = (b as any).contactPerson || "";
    } else if (sortField === "contact_email") {
      aValue = (a as any).contactEmail || "";
      bValue = (b as any).contactEmail || "";
    } else if (sortField === "status") {
      aValue = (a as any).active ? "Active" : "Inactive";
      bValue = (b as any).active ? "Active" : "Inactive";
    }

    // Handle different data types
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    if (aValue instanceof Date && bValue instanceof Date) {
      return sortDirection === "asc"
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    }

    // String comparison
    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();

    if (sortDirection === "asc") {
      return aStr.localeCompare(bStr);
    } else {
      return bStr.localeCompare(aStr);
    }
  });

  // Helper functions
  const formatCurrency = (amount: number) => {
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

  // Calculate summary statistics (based on all clients, not filtered)
  const totalClients = clients.length;
  const activeClients = clients.filter((c: any) => c.active).length;
  const totalPayrolls = clients.reduce(
    (sum: number, c: any) => sum + (c.payrollCount?.aggregate?.count || 0),
    0
  );
  // We don't have employee count in this query, so we'll set it to 0 for now
  const totalEmployees = 0;

  // Render card view
  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedClients.map((client: any) => (
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
                  {client.payrollCount?.aggregate?.count || 0} payrolls
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
      {sortedClients.map((client: any) => (
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
                    {client.payrollCount?.aggregate?.count || 0} payrolls
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
                  N/A
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
                  setSortDirection(direction as "asc" | "desc");
                }}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name A-Z</SelectItem>
                  <SelectItem value="name-desc">Name Z-A</SelectItem>
                  <SelectItem value="status-asc">Status A-Z</SelectItem>
                  <SelectItem value="status-desc">Status Z-A</SelectItem>
                  <SelectItem value="payrollCount-asc">Payrolls ↑</SelectItem>
                  <SelectItem value="payrollCount-desc">Payrolls ↓</SelectItem>
                  <SelectItem value="activePayrolls-asc">
                    Active Payrolls ↑
                  </SelectItem>
                  <SelectItem value="activePayrolls-desc">
                    Active Payrolls ↓
                  </SelectItem>
                  <SelectItem value="contact_person-asc">
                    Contact A-Z
                  </SelectItem>
                  <SelectItem value="contact_person-desc">
                    Contact Z-A
                  </SelectItem>
                  <SelectItem value="contact_email-asc">Email A-Z</SelectItem>
                  <SelectItem value="contact_email-desc">Email Z-A</SelectItem>
                  <SelectItem value="lastUpdated-asc">
                    Last Updated ↑
                  </SelectItem>
                  <SelectItem value="lastUpdated-desc">
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
      ) : sortedClients.length === 0 ? (
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
              clients={sortedClients as any}
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

// Export component wrapped with GraphQL error boundary
export default function ClientsPageWithErrorBoundary() {
  return (
    <GraphQLErrorBoundary>
      <ClientsPage />
    </GraphQLErrorBoundary>
  );
}
