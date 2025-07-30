"use client";

import { useQuery, useMutation } from "@apollo/client";
import {
  DollarSign,
  Clock,
  CheckCircle,
  FileText,
  TrendingUp,
  Filter,
  Download,
  Plus,
  Package,
} from "lucide-react";
import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  GetBillingItemsAdvancedDocument,
  GetNewServiceCatalogDocument,
  GetPayrollProfitabilityDocument,
  UpdateBillingItemAdvancedDocument,
  ConsolidateInvoicesDocument,
} from "../../graphql/generated/graphql";
import { GetClientsForDropdownDocument } from "../../../clients/graphql/generated/graphql";

interface BillingItem {
  id: string;
  clientId?: string | null;
  payrollId?: string | null;
  description?: string | null;
  serviceName?: string | null; // Legacy field - fallback only
  serviceId?: string | null; // New service relationship
  quantity: number;
  amount?: number | null;
  totalAmount?: number | null;
  hourlyRate?: number | null;
  isApproved?: boolean | null;
  approvalDate?: string | null;
  confirmedAt?: string | null;
  notes?: string | null;
  createdAt?: string;
  client?: {
    id: string;
    name: string;
  } | null;
  payroll?: {
    id: string;
    name: string;
  } | null;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    computedName?: string | null;
  } | null;
  approver?: {
    id: string;
    firstName: string;
    lastName: string;
    computedName?: string | null;
  } | null;
  service?: {
    id: string;
    name: string;
    description?: string | null;
    category: string;
    defaultRate?: number | null;
  } | null;
}

interface Service {
  id: string;
  name: string;
  description?: string | null;
  category: string;
  billingUnit: string;
  defaultRate: number;
  currency: string;
  serviceType: string;
  isActive?: boolean | null;
}

interface DashboardFilters {
  isApproved?: boolean | undefined;
  clientId: string;
  serviceId: string;
  serviceCategory: string;
  dateRange: string;
  approvalStatus: string;
}

interface BillingDashboardProps {
  onItemClick?: (item: BillingItem) => void;
  onBulkAction?: (action: string, items: BillingItem[]) => void;
}

export const BillingDashboard: React.FC<BillingDashboardProps> = ({
  onItemClick,
  onBulkAction,
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [filters, setFilters] = useState<DashboardFilters>({
    isApproved: undefined,
    clientId: "",
    serviceId: "",
    serviceCategory: "",
    dateRange: "30",
    approvalStatus: "",
  });

  // Calculate date range
  const dateRange = useMemo(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(filters.dateRange || "30"));
    return { startDate, endDate };
  }, [filters.dateRange]);

  // Get billing items with service relationships
  const {
    data: billingData,
    loading: billingLoading,
    refetch,
  } = useQuery(GetBillingItemsAdvancedDocument, {
    variables: {
      limit: 500,
      offset: 0,
      where: {
        // Apply client filter if specified
        ...(filters.clientId ? { clientId: { _eq: filters.clientId } } : {}),
        // Apply service filter if specified
        ...(filters.serviceId ? { serviceId: { _eq: filters.serviceId } } : {}),
        // Apply approval filter if specified
        ...(filters.isApproved !== undefined
          ? { isApproved: { _eq: filters.isApproved } }
          : {}),
        // Apply date range filter
        createdAt: {
          _gte: dateRange.startDate.toISOString(),
          _lte: dateRange.endDate.toISOString(),
        },
      },
      orderBy: [{ createdAt: "DESC" }],
    },
    fetchPolicy: "cache-and-network",
  });

  // Get service catalog for service name lookups
  const { data: servicesData, loading: servicesLoading } = useQuery(
    GetNewServiceCatalogDocument,
    {
      variables: {
        limit: 200,
        offset: 0,
        category: filters.serviceCategory || "",
      },
      fetchPolicy: "cache-and-network",
    }
  );

  // Get clients for dropdown
  const { data: clientsData, loading: clientsLoading } = useQuery(
    GetClientsForDropdownDocument,
    {
      fetchPolicy: "cache-and-network",
    }
  );

  // Get profitability data
  const { data: profitabilityData, loading: profitabilityLoading } = useQuery(
    GetPayrollProfitabilityDocument,
    {
      variables: {
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString(),
      },
    }
  );

  // Mutations
  const [updateBillingItem] = useMutation(UpdateBillingItemAdvancedDocument);
  const [consolidateInvoices] = useMutation(ConsolidateInvoicesDocument);

  const billingItems: BillingItem[] = billingData?.billingItems || [];
  const services: Service[] = servicesData?.services || [];
  const clients = clientsData?.clients || [];
  const profitabilityItems = profitabilityData?.payrolls || [];

  // Create a service lookup map for efficient service name resolution
  const serviceMap = useMemo(() => {
    const map = new Map();
    services.forEach(service => {
      map.set(service.id, service);
    });
    return map;
  }, [services]);

  // Get unique service categories for filter dropdown
  const serviceCategories = useMemo(() => {
    const categories = new Set<string>();
    services.forEach(service => {
      if (service.category) {
        categories.add(service.category);
      }
    });
    return Array.from(categories).sort();
  }, [services]);

  // Filter services by category for service dropdown
  const filteredServices = useMemo(() => {
    if (!filters.serviceCategory) return services;
    return services.filter(
      service => service.category === filters.serviceCategory
    );
  }, [services, filters.serviceCategory]);

  // Helper function to get service name with fallback
  const getServiceName = (item: BillingItem): string => {
    if (item.serviceId && serviceMap.has(item.serviceId)) {
      return serviceMap.get(item.serviceId).name;
    }
    return item.serviceName || "Unnamed Service";
  };

  // Helper function to get service description
  const getServiceDescription = (item: BillingItem): string => {
    if (item.serviceId && serviceMap.has(item.serviceId)) {
      const service = serviceMap.get(item.serviceId);
      return service.description || item.description || "No description";
    }
    return item.description || "No description";
  };

  // Apply additional client-side filtering for approval status
  const filteredItems = useMemo(() => {
    return billingItems.filter(item => {
      // Additional confirmation status filtering (client-side only)
      if (filters.approvalStatus === "confirmed" && !item.confirmedAt)
        return false;
      if (filters.approvalStatus === "unconfirmed" && item.confirmedAt)
        return false;
      return true;
    });
  }, [billingItems, filters.approvalStatus]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const total = filteredItems.reduce(
      (sum, item) => sum + (item.totalAmount ?? item.amount ?? 0),
      0
    );
    const pending = filteredItems.filter(item => !(item.isApproved ?? false));
    const approved = filteredItems.filter(item => item.isApproved ?? false);
    const confirmed = filteredItems.filter(item => item.confirmedAt);

    return {
      totalAmount: total,
      pendingCount: pending.length,
      pendingAmount: pending.reduce(
        (sum, item) => sum + (item.totalAmount ?? item.amount ?? 0),
        0
      ),
      approvedCount: approved.length,
      approvedAmount: approved.reduce(
        (sum, item) => sum + (item.totalAmount ?? item.amount ?? 0),
        0
      ),
      confirmedCount: confirmed.length,
      totalItems: filteredItems.length,
    };
  }, [filteredItems]);

  // Handle item selection
  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const selectAllItems = () => {
    setSelectedItems(filteredItems.map(item => item.id));
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  // Bulk approve items
  const bulkApprove = async () => {
    if (selectedItems.length === 0) {
      toast.error("Please select items to approve");
      return;
    }

    try {
      const updatePromises = selectedItems.map(itemId =>
        updateBillingItem({
          variables: {
            id: itemId,
            updates: {
              isApproved: true,
              approvalDate: new Date().toISOString(),
              status: "approved",
            },
          },
        })
      );

      await Promise.all(updatePromises);
      toast.success(`Approved ${selectedItems.length} billing items`);
      setSelectedItems([]);
      refetch();
      onBulkAction?.(
        "approve",
        filteredItems.filter(item => selectedItems.includes(item.id))
      );
    } catch (error) {
      toast.error("Failed to approve items");
      console.error("Bulk approve error:", error);
    }
  };

  // Generate invoice
  const generateInvoice = async (clientId: string) => {
    try {
      await consolidateInvoices({
        variables: {
          clientId: clientId,
          consolidationDate: new Date().toISOString().split("T")[0],
        },
      });
      toast.success("Invoice generated successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to generate invoice");
      console.error("Invoice generation error:", error);
    }
  };

  const getStatusColor = (
    isApproved: boolean | null,
    confirmedAt?: string | null
  ) => {
    if (isApproved) {
      return "bg-green-100 text-green-800";
    } else if (confirmedAt) {
      return "bg-blue-100 text-blue-800";
    } else {
      return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (
    isApproved: boolean | null,
    confirmedAt?: string | null
  ) => {
    if (isApproved) {
      return "Approved";
    } else if (confirmedAt) {
      return "Confirmed";
    } else {
      return "Draft";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    }).format(amount);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-AU");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Billing Dashboard</h1>
          <p className="text-gray-600">
            Manage billing items, approvals, and invoices
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Billing Item
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(metrics.totalAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.totalItems} items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Approval
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(metrics.pendingAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.pendingCount} items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(metrics.approvedAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.approvedCount} items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Confirmed Items
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.confirmedCount}</div>
            <p className="text-xs text-muted-foreground">Manager confirmed</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="services">Service Items</TabsTrigger>
          <TabsTrigger value="profitability">Profitability</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest billing items and activity across all clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              {billingLoading || servicesLoading ? (
                <div className="text-center py-8">
                  Loading billing data and services...
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredItems.slice(0, 10).map(item => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="font-medium">
                            {getServiceName(item)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {getServiceDescription(item)}
                          </div>
                          {item.serviceId && serviceMap.has(item.serviceId) && (
                            <div className="text-xs text-blue-600">
                              {serviceMap.get(item.serviceId).category} •{" "}
                              {serviceMap.get(item.serviceId).billingUnit}
                            </div>
                          )}
                        </div>
                        <Badge
                          className={getStatusColor(
                            item.isApproved ?? false,
                            item.confirmedAt ?? null
                          )}
                        >
                          {getStatusLabel(
                            item.isApproved ?? false,
                            item.confirmedAt ?? null
                          )}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {formatCurrency(item.amount ?? 0)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatDate(item.createdAt ?? "")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          {/* Enhanced Service Catalog Filters */}
          <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-blue-600" />
                Advanced Service Filters
              </CardTitle>
              <CardDescription>
                Filter and analyze billing items by service catalog, client relationships, and approval workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <Label htmlFor="client">Client</Label>
                  <Select
                    value={filters.clientId}
                    onValueChange={value =>
                      setFilters(prev => ({ ...prev, clientId: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Clients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Clients</SelectItem>
                      {clientsLoading ? (
                        <SelectItem value="" disabled>
                          Loading clients...
                        </SelectItem>
                      ) : (
                        clients.map(client => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="serviceCategory">Service Category</Label>
                  <Select
                    value={filters.serviceCategory}
                    onValueChange={value =>
                      setFilters(prev => ({ 
                        ...prev, 
                        serviceCategory: value,
                        serviceId: "", // Reset service when category changes
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {servicesLoading ? (
                        <SelectItem value="" disabled>
                          Loading categories...
                        </SelectItem>
                      ) : (
                        serviceCategories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="service">Specific Service</Label>
                  <Select
                    value={filters.serviceId}
                    onValueChange={value =>
                      setFilters(prev => ({ ...prev, serviceId: value }))
                    }
                    disabled={filteredServices.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Services" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Services</SelectItem>
                      {filteredServices.map(service => (
                        <SelectItem key={service.id} value={service.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{service.name}</span>
                            <span className="text-xs text-gray-500">
                              {formatCurrency(service.defaultRate || 0)} • {service.billingUnit}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="approval-filter">Approval Status</Label>
                  <Select
                    value={
                      filters.isApproved === undefined
                        ? "all"
                        : filters.isApproved
                          ? "approved"
                          : "pending"
                    }
                    onValueChange={value => {
                      let isApproved: boolean | undefined;
                      if (value === "approved") isApproved = true;
                      else if (value === "pending") isApproved = false;
                      else isApproved = undefined;
                      setFilters(prev => ({ ...prev, isApproved }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Items</SelectItem>
                      <SelectItem value="pending">Pending Approval</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="date-range">Date Range</Label>
                  <Select
                    value={filters.dateRange}
                    onValueChange={value =>
                      setFilters(prev => ({ ...prev, dateRange: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Last 30 days" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Last 7 days</SelectItem>
                      <SelectItem value="30">Last 30 days</SelectItem>
                      <SelectItem value="90">Last 3 months</SelectItem>
                      <SelectItem value="365">Last year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Service Analytics Cards */}
          {!billingLoading && !servicesLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-green-200 bg-green-50">
                <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium text-green-800">Service Categories</CardTitle>
                  <Package className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-900">{serviceCategories.length}</div>
                  <p className="text-xs text-green-600">Active categories</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {serviceCategories.slice(0, 3).map(category => (
                      <Badge key={category} variant="outline" className="text-xs border-green-300 text-green-700">
                        {category}
                      </Badge>
                    ))}
                    {serviceCategories.length > 3 && (
                      <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                        +{serviceCategories.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium text-blue-800">Active Services</CardTitle>
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-900">{services.length}</div>
                  <p className="text-xs text-blue-600">Available in catalog</p>
                  <div className="mt-2 text-xs text-blue-700">
                    Avg. rate: {services.length > 0 ? formatCurrency(services.reduce((sum, s) => sum + (s.defaultRate || 0), 0) / services.length) : '$0'}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-purple-200 bg-purple-50">
                <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium text-purple-800">Billing Items</CardTitle>
                  <FileText className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-900">{filteredItems.length}</div>
                  <p className="text-xs text-purple-600">Matching filters</p>
                  <div className="mt-2 text-xs text-purple-700">
                    Total: {formatCurrency(filteredItems.reduce((sum, item) => sum + (item.totalAmount ?? item.amount ?? 0), 0))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium text-orange-800">Service Usage</CardTitle>
                  <DollarSign className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-900">
                    {Math.round((filteredItems.length / Math.max(services.length, 1)) * 100)}%
                  </div>
                  <p className="text-xs text-orange-600">Catalog utilization</p>
                  <div className="mt-2 text-xs text-orange-700">
                    {filteredItems.filter(item => item.serviceId).length} linked to catalog
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Service Catalog Quick Access */}
          <Card className="border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-indigo-600" />
                Service Catalog Management
              </CardTitle>
              <CardDescription>
                Quick access to service catalog features and analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  View Full Catalog
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Service
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Service Analytics
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Services
                </Button>
              </div>
              
              {serviceCategories.length > 0 && (
                <div className="mt-4">
                  <Label className="text-sm font-medium text-indigo-800">Popular Service Categories</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {serviceCategories.slice(0, 6).map(category => {
                      const categoryServices = services.filter(s => s.category === category);
                      const categoryRevenue = filteredItems
                        .filter(item => item.serviceId && serviceMap.has(item.serviceId) && serviceMap.get(item.serviceId).category === category)
                        .reduce((sum, item) => sum + (item.totalAmount ?? item.amount ?? 0), 0);
                      
                      return (
                        <div key={category} className="bg-white rounded-lg border border-indigo-200 p-3 min-w-[120px]">
                          <div className="text-sm font-medium text-indigo-900 capitalize">
                            {category.replace('_', ' ')}
                          </div>
                          <div className="text-xs text-indigo-600 mt-1">
                            {categoryServices.length} services
                          </div>
                          {categoryRevenue > 0 && (
                            <div className="text-xs text-green-600 mt-1 font-medium">
                              {formatCurrency(categoryRevenue)}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="font-medium">
                      {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearSelection}
                    >
                      Clear Selection
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={bulkApprove} disabled={billingLoading}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Selected
                    </Button>
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Export Selected
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Service-focused Table */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Service Billing Items</CardTitle>
                  <CardDescription>
                    {(billingLoading || servicesLoading) ? (
                      "Loading billing items and services..."
                    ) : (
                      `${filteredItems.length} item${filteredItems.length !== 1 ? 's' : ''} found`
                    )}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={selectAllItems}
                    disabled={filteredItems.length === 0 || billingLoading}
                  >
                    Select All
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearSelection}
                    disabled={selectedItems.length === 0}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {(billingLoading || servicesLoading) ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center space-y-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="text-sm text-gray-500">Loading billing data...</p>
                  </div>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 space-y-2">
                    <FileText className="h-12 w-12 mx-auto text-gray-300" />
                    <p className="text-lg font-medium">No billing items found</p>
                    <p className="text-sm">Try adjusting your filters or check back later.</p>
                  </div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={
                            selectedItems.length === filteredItems.length &&
                            filteredItems.length > 0
                          }
                          onCheckedChange={checked =>
                            checked ? selectAllItems() : clearSelection()
                          }
                        />
                      </TableHead>
                      <TableHead>Service Details</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="w-24">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map(item => (
                      <TableRow
                        key={item.id}
                        className={cn(
                          "hover:bg-gray-50 transition-colors",
                          selectedItems.includes(item.id) && "bg-blue-50"
                        )}
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={() => toggleItemSelection(item.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div
                            className="cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                            onClick={() => onItemClick?.(item)}
                          >
                            <div className="font-medium text-gray-900 flex items-center gap-2">
                              {getServiceName(item)}
                              {item.serviceId && serviceMap.has(item.serviceId) ? (
                                <Badge variant="default" className="text-xs bg-green-100 text-green-800 border-green-200">
                                  Catalog Service
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs border-yellow-300 text-yellow-700">
                                  Custom/Legacy
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {getServiceDescription(item)}
                            </div>
                            {item.serviceId && serviceMap.has(item.serviceId) && (
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
                                  {serviceMap.get(item.serviceId).category}
                                </Badge>
                                <Badge variant="outline" className="text-xs bg-purple-50 border-purple-200 text-purple-700">
                                  {serviceMap.get(item.serviceId).billingUnit}
                                </Badge>
                                {serviceMap.get(item.serviceId).defaultRate && (
                                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    Std: {formatCurrency(serviceMap.get(item.serviceId).defaultRate)}
                                  </span>
                                )}
                                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                  {serviceMap.get(item.serviceId).serviceType}
                                </span>
                              </div>
                            )}
                            {!item.serviceId && item.serviceName && (
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs border-amber-300 text-amber-700">
                                  Legacy Service
                                </Badge>
                                <span className="text-xs text-amber-600">Consider migrating to catalog</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-gray-900">
                            {item.client?.name || "Unknown Client"}
                          </div>
                          {item.payroll && (
                            <div className="text-sm text-gray-600">
                              Payroll: {item.payroll.name}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-gray-900">
                            {formatCurrency(item.totalAmount ?? item.amount ?? 0)}
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-sm text-gray-600">
                              {item.quantity} × {formatCurrency((item.totalAmount ?? item.amount ?? 0) / item.quantity)}
                            </div>
                          )}
                          {item.hourlyRate && (
                            <div className="text-xs text-gray-500">
                              Rate: {formatCurrency(item.hourlyRate)}/hr
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge
                              variant={item.isApproved ? "default" : "secondary"}
                              className={cn(
                                item.isApproved 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-yellow-100 text-yellow-800"
                              )}
                            >
                              {item.isApproved ? "Approved" : "Pending"}
                            </Badge>
                            {item.confirmedAt && (
                              <Badge variant="outline" className="text-xs">
                                Confirmed
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600">
                            {formatDate(item.createdAt ?? "")}
                          </div>
                          {item.approvalDate && (
                            <div className="text-xs text-gray-500">
                              Approved: {formatDate(item.approvalDate)}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {!item.isApproved && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="h-8 w-8 p-0"
                                title="Approve item"
                              >
                                <CheckCircle className="h-3 w-3" />
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="h-8 w-8 p-0"
                              title="View details"
                              onClick={() => onItemClick?.(item)}
                            >
                              <FileText className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profitability" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Profitability Analysis
              </CardTitle>
              <CardDescription>
                Revenue and profit analysis by payroll
              </CardDescription>
            </CardHeader>
            <CardContent>
              {profitabilityLoading ? (
                <div className="text-center py-8">
                  Loading profitability data...
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payroll</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Rate/Hour</TableHead>
                      <TableHead>Billing Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profitabilityItems.map(item => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell>{item.client?.name}</TableCell>
                        <TableCell>
                          {formatCurrency(item.estimatedRevenue || 0)}
                        </TableCell>
                        <TableCell>{item.estimatedHours || 0}h</TableCell>
                        <TableCell>
                          {item.estimatedHours && item.estimatedRevenue
                            ? formatCurrency(
                                item.estimatedRevenue / item.estimatedHours
                              )
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(false, undefined)}>
                            {item.billingStatus || "Not Started"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
