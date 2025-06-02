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
  Trash2,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useSmartPolling } from "@/hooks/usePolling";
import { useUserRole } from "@/hooks/useUserRole";
import { ClientsTable } from "@/components/clients-table";
import { GET_CLIENTS } from "@/graphql/queries/clients/getClientsList";

type ViewMode = "cards" | "table" | "list";

export default function ClientsPage() {
  const { canManageClients, userRole, isLoading } = useUserRole();
  const canCreateClient = canManageClients;

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("cards");

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

  // Filter clients based on search and status
  const filteredClients = clients.filter((client: any) => {
    const matchesSearch =
      searchTerm === "" ||
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contact_email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && client.active) ||
      (statusFilter === "inactive" && !client.active);

    return matchesSearch && matchesStatus;
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

  // Calculate summary statistics
  const activeClients = filteredClients.filter((c: any) => c.active).length;
  const totalPayrolls = filteredClients.reduce(
    (sum: number, c: any) => sum + (c.payrolls?.length || 0),
    0
  );
  const totalEmployees = filteredClients.reduce(
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
      {filteredClients.map((client: any) => (
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
                  <DropdownMenuItem>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Client
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Client
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
      {filteredClients.map((client: any) => (
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
                    {client.payrolls?.length || 0} payrolls
                  </p>
                  <p className="text-gray-500">
                    {client.payrolls?.filter((p: any) => p.active).length || 0}{" "}
                    active
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
          <Button
            variant="outline"
            onClick={() => refetch()}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>

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
                  {filteredClients.length}
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
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-[300px]"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
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
      ) : filteredClients.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || statusFilter !== "all"
                  ? "No clients found"
                  : "No clients yet"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search criteria or filters"
                  : "Get started by adding your first client"}
              </p>
              {canCreateClient && !searchTerm && statusFilter === "all" && (
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
            <Card>
              <CardHeader>
                <CardTitle>Client List ({filteredClients.length})</CardTitle>
                <CardDescription>
                  View and manage all your clients in table format
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClientsTable clients={filteredClients} isLoading={loading} />
              </CardContent>
            </Card>
          )}

          {viewMode === "cards" && renderCardView()}

          {viewMode === "list" && renderListView()}
        </div>
      )}
    </div>
  );
}
