"use client";

import { useQuery } from "@apollo/client";
import { 
  Package, 
  Users, 
  Building2, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Filter,
  Search,
  Settings,
  Eye,
  BarChart3,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Plus,
  FileText
} from "lucide-react";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GetServiceAssignmentAnalyticsDocument,
  GetBillingWorkflowOverviewDocument,
  type GetServiceAssignmentAnalyticsQuery,
  type GetBillingWorkflowOverviewQuery,
} from "../../graphql/generated/graphql";
import { PayrollServiceAssignmentModal } from "../payroll-integration/payroll-service-assignment-modal";
import { formatAUD, formatAustralianDate } from "@/lib/utils/australian-formatting";

// Types
type ServiceAssignment = NonNullable<GetServiceAssignmentAnalyticsQuery['clientServiceAgreements']>[0];
type PayrollAssignment = NonNullable<GetServiceAssignmentAnalyticsQuery['payrollServiceAgreements']>[0];
type BillingActivity = NonNullable<GetBillingWorkflowOverviewQuery['recentActivity']>[0];

interface ServiceItemsViewerProps {
  className?: string;
}

const STATUS_CONFIG = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-800", icon: FileText },
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  approved: { label: "Approved", color: "bg-green-100 text-green-800", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800", icon: XCircle },
  invoiced: { label: "Invoiced", color: "bg-blue-100 text-blue-800", icon: FileText },
} as const;

const CATEGORY_COLORS = {
  standard: "bg-blue-100 text-blue-800",
  complex: "bg-orange-100 text-orange-800", 
  statutory: "bg-green-100 text-green-800",
  recurring: "bg-purple-100 text-purple-800",
  premium: "bg-yellow-100 text-yellow-800",
  consultation: "bg-indigo-100 text-indigo-800",
  implementation: "bg-pink-100 text-pink-800",
  emergency: "bg-red-100 text-red-800",
  audit: "bg-gray-100 text-gray-800",
} as const;

export function ServiceItemsViewer({ className = "" }: ServiceItemsViewerProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "assignments" | "billing" | "analytics">("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [clientFilter, setClientFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<{ id: string; name: string; clientId: string; clientName: string } | null>(null);

  // GraphQL queries
  const { data: workflowData, loading: workflowLoading } = useQuery<GetBillingWorkflowOverviewQuery>(
    GetBillingWorkflowOverviewDocument,
    {
      pollInterval: 60000, // Poll every minute for real-time updates
    }
  );

  const { data: analyticsData, loading: analyticsLoading } = useQuery<GetServiceAssignmentAnalyticsQuery>(
    GetServiceAssignmentAnalyticsDocument,
    {
      variables: { clientId: clientFilter !== "all" ? clientFilter : undefined },
    }
  );

  const recentActivity = workflowData?.recentActivity || [];
  const serviceUtilization = workflowData?.serviceUtilization || [];
  const clientServiceAssignments = analyticsData?.clientServiceAgreements || [];
  const payrollServiceAssignments = analyticsData?.payrollServiceAgreements || [];

  // Calculate workflow statistics
  const workflowStats = useMemo(() => {
    if (!workflowData) return null;

    return {
      draftItems: workflowData.draftItems.aggregate?.count || 0,
      draftAmount: workflowData.draftItems.aggregate?.sum?.amount || 0,
      pendingItems: workflowData.pendingItems.aggregate?.count || 0,
      pendingAmount: workflowData.pendingItems.aggregate?.sum?.amount || 0,
      approvedItems: workflowData.approvedItems.aggregate?.count || 0,
      approvedAmount: workflowData.approvedItems.aggregate?.sum?.amount || 0,
    };
  }, [workflowData]);

  // Filter recent activity
  const filteredActivity = useMemo(() => {
    return recentActivity.filter(activity => {
      const matchesSearch = 
        activity.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.service?.name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || activity.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [recentActivity, searchTerm, statusFilter]);

  // Filter service assignments
  const filteredAssignments = useMemo(() => {
    return clientServiceAssignments.filter(assignment => {
      const matchesSearch = 
        assignment.service.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === "all" || assignment.service.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [clientServiceAssignments, searchTerm, categoryFilter]);

  const getCategoryColor = (category: string) => {
    return CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || "bg-gray-100 text-gray-800";
  };

  const getStatusConfig = (status: string) => {
    return STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.draft;
  };

  const handleOpenAssignmentModal = (payrollId: string, payrollName: string, clientId: string, clientName: string) => {
    setSelectedPayroll({ id: payrollId, name: payrollName, clientId, clientName });
    setIsAssignmentModalOpen(true);
  };

  if (workflowLoading && analyticsLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-foreground opacity-60">Loading service overview...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Service Items Overview</h2>
          <p className="text-foreground opacity-60">
            Monitor service assignments, billing workflow, and utilization across all clients
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Service Assignments
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Billing Activity
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Workflow Statistics */}
          {workflowStats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Draft Items</CardTitle>
                  <FileText className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-600">{workflowStats.draftItems}</div>
                  <p className="text-xs text-foreground opacity-60">
                    {formatAUD(workflowStats.draftAmount)} total value
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{workflowStats.pendingItems}</div>
                  <p className="text-xs text-foreground opacity-60">
                    {formatAUD(workflowStats.pendingAmount)} awaiting review
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ready to Invoice</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{workflowStats.approvedItems}</div>
                  <p className="text-xs text-foreground opacity-60">
                    {formatAUD(workflowStats.approvedAmount)} approved
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Billing Activity (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <div className="text-center py-8 text-foreground opacity-60">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No recent billing activity</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivity.slice(0, 5).map((activity) => {
                    const statusConfig = getStatusConfig(activity.status || "draft");
                    const StatusIcon = statusConfig.icon;

                    return (
                      <div key={activity.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{activity.service?.name || "Manual Item"}</h4>
                            <Badge variant="outline" className={getCategoryColor(activity.service?.category || "")}>
                              {activity.service?.category}
                            </Badge>
                          </div>
                          <div className="text-sm text-foreground opacity-60">
                            <span>{activity.client?.name}</span>
                            <span className="mx-2">•</span>
                            <span>{activity.description}</span>
                          </div>
                          <div className="text-xs text-foreground opacity-60 mt-1">
                            {activity.createdByUser?.computedName} • {formatAustralianDate(activity.createdAt, "business")}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-green-600 mb-1">
                            {formatAUD(activity.amount || 0)}
                          </div>
                          <Badge className={statusConfig.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig.label}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Service Assignments Tab */}
        <TabsContent value="assignments" className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground opacity-60" />
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="complex">Complex</SelectItem>
                <SelectItem value="statutory">Statutory</SelectItem>
                <SelectItem value="recurring">Recurring</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="consultation">Consultation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Service Assignments Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Payroll Usage</TableHead>
                    <TableHead>Recent Billing</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssignments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="text-foreground opacity-60">
                          <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No service assignments match your filters</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAssignments.map((assignment) => {
                        const service = assignment.service;
                        const payrollUsage = assignment.payrollServiceAgreementsAggregate.aggregate?.count || 0;
                        const recentBilling = assignment.service.billingItemsAggregate?.aggregate;

                        return (
                          <TableRow key={assignment.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{service.name}</div>
                                <div className="text-sm text-foreground opacity-60">{service.id}</div>
                              </div>
                            </TableCell>

                            <TableCell>
                              <Badge variant="outline" className={getCategoryColor(service.category)}>
                                {service.category}
                              </Badge>
                            </TableCell>

                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {formatAUD(assignment.customRate || service.baseRate || 0)}
                                </div>
                                <div className="text-xs text-foreground opacity-60">
                                  {assignment.customRate ? "Custom" : "Standard"} rate
                                </div>
                              </div>
                            </TableCell>

                            <TableCell>
                              <div>
                                <div className="font-medium">{payrollUsage}</div>
                                <div className="text-xs text-foreground opacity-60">
                                  payroll{payrollUsage !== 1 ? 's' : ''}
                                </div>
                              </div>
                            </TableCell>

                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {recentBilling?.count || 0} items
                                </div>
                                <div className="text-xs text-foreground opacity-60">
                                  {formatAUD(recentBilling?.sum?.amount || 0)} (30 days)
                                </div>
                              </div>
                            </TableCell>

                            <TableCell>
                              <Badge variant="outline" className={assignment.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                {assignment.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Activity Tab */}
        <TabsContent value="billing" className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground opacity-60" />
              <Input
                placeholder="Search billing activity..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="invoiced">Invoiced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Activity Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivity.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="text-foreground opacity-60">
                          <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No billing activity matches your filters</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredActivity.map((activity) => {
                        const statusConfig = getStatusConfig(activity.status || "draft");
                        const StatusIcon = statusConfig.icon;

                        return (
                          <TableRow key={activity.id}>
                            <TableCell>
                              <div className="font-medium">{activity.description}</div>
                            </TableCell>

                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-foreground opacity-60" />
                                <span>{activity.client?.name}</span>
                              </div>
                            </TableCell>

                            <TableCell>
                              <div>
                                <div className="font-medium">{activity.service?.name || "Manual"}</div>
                                {activity.service?.category && (
                                  <Badge variant="outline" className={getCategoryColor(activity.service.category)}>
                                    {activity.service.category}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="font-medium text-green-600">
                                {formatAUD(activity.amount || 0)}
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="text-sm">
                                {formatAustralianDate(activity.createdAt, "business")}
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-foreground opacity-60" />
                                <span className="text-sm">{activity.staffUser?.computedName}</span>
                              </div>
                            </TableCell>

                            <TableCell>
                              <Badge className={statusConfig.color}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {statusConfig.label}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Service Utilization This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              {serviceUtilization.length === 0 ? (
                <div className="text-center py-8 text-foreground opacity-60">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No service utilization data available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {serviceUtilization
                    .filter(service => service.billingItemsAggregate.aggregate?.count > 0)
                    .sort((a, b) => (b.billingItemsAggregate.aggregate?.sum?.amount || 0) - (a.billingItemsAggregate.aggregate?.sum?.amount || 0))
                    .slice(0, 10)
                    .map((service) => {
                      const usage = service.billingItemsAggregate.aggregate;
                      const count = usage?.count || 0;
                      const amount = usage?.sum?.amount || 0;

                      return (
                        <div key={service.id} className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="font-medium">{service.name}</div>
                              <Badge variant="outline" className={getCategoryColor(service.category)}>
                                {service.category}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-green-600">
                              {formatAUD(amount)}
                            </div>
                            <div className="text-sm text-foreground opacity-60">
                              {count} billing item{count !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payroll Service Assignment Modal */}
      {selectedPayroll && (
        <PayrollServiceAssignmentModal
          payrollId={selectedPayroll.id}
          payrollName={selectedPayroll.name}
          clientId={selectedPayroll.clientId}
          clientName={selectedPayroll.clientName}
          isOpen={isAssignmentModalOpen}
          onClose={() => {
            setIsAssignmentModalOpen(false);
            setSelectedPayroll(null);
          }}
          onAssignmentComplete={() => {
            // Refetch data if needed
          }}
        />
      )}
    </div>
  );
}