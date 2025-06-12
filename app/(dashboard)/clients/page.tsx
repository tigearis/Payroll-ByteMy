// app/(dashboard)/clients/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client";
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

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ClientsTable } from "@/components/clients-table";
import { useSmartPolling } from "@/hooks/usePolling";
import { useUserRole } from "@/hooks/useUserRole";
import { GET_CLIENTS } from "@/graphql/queries/clients/getClientsList";

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
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    onSelectionChange(newSelected);
  };

  const selectedLabels = options
    .filter((option) => selected.includes(option.value))
    .map((option) => option.label);

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
          {options.map((option) => (
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

export default function ClientsPage() {
  const { canManageClients, userRole, isLoading } = useUserRole();
  const canCreateClient = canManageClients;

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [payrollCountFilter, setPayrollCountFilter] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [showFilters, setShowFilters] = useState(false);

  // Sorting state
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // GraphQL operations
  const { loading, error, data, refetch, startPolling, stopPolling } = useQuery(
    GET_CLIENTS,
    {
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
      pollInterval: 60000,
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
    new Set(clients.map((c: any) => c.payrolls?.length || 0))
  ) as number[];
  uniquePayrollCounts.sort((a, b) => a - b);

  // Filter clients based on search, status, and payroll count
  const filteredClients = clients.filter((client: any) => {
    const matchesSearch =
      searchTerm === "" ||
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contact_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contact_phone?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter.length === 0 ||
      (statusFilter.includes("active") && client.active) ||
      (statusFilter.includes("inactive") && !client.active);

    const payrollCount = client.payrolls?.length || 0;
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
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle specific sort fields
    if (sortField === "payrollCount") {
      aValue = a.payrolls?.length || 0;
      bValue = b.payrolls?.length || 0;
    } else if (sortField === "activePayrolls") {
      aValue =
        a.payrolls?.filter(
          (p: any) =>
            p.status !== "Inactive" &&
            p.status !== "cancelled" &&
            p.status !== "on-hold"
        ).length || 0;
      bValue =
        b.payrolls?.filter(
          (p: any) =>
            p.status !== "Inactive" &&
            p.status !== "cancelled" &&
            p.status !== "on-hold"
        ).length || 0;
    } else if (sortField === "lastUpdated") {
      aValue = new Date(a.updated_at || a.created_at);
      bValue = new Date(b.updated_at || b.created_at);
    } else if (sortField === "contact_person") {
      aValue = a.contact_person || "";
      bValue = b.contact_person || "";
    } else if (sortField === "contact_email") {
      aValue = a.contact_email || "";
      bValue = b.contact_email || "";
    } else if (sortField === "status") {
      aValue = a.active ? "Active" : "Inactive";
      bValue = b.active ? "Active" : "Inactive";
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
    (sum: number, c: any) => sum + (c.payrolls?.length || 0),
    0
  );
  const totalEmployees = clients.reduce(
    (sum: number, c: any) =>
      sum +
      (c.payrolls?.reduce(
        (pSum: number, p: any) => pSum + (p.employee_count || 0),
        0
      ) || 0),
    0
  );

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
                  {client.contact_person || "No contact"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  {client.payrolls?.length || 0} payrolls
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
                    {client.contact_person || "No contact person"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right text-sm">
                  <p className="font-medium text-gray-900">
                    {client.payrolls?.filter(
                      (p: any) =>
                        p.status !== "Inactive" &&
                        p.status !== "cancelled" &&
                        p.status !== "on-hold"
                    ).length || 0}{" "}
                    active payrolls
                  </p>
                  <p className="text-gray-500">
                    {client.payrolls?.length || 0} total
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
                  {totalEmployees}
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
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                onValueChange={(value) => {
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
              clients={sortedClients}
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
