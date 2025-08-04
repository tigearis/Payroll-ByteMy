"use client";

import { useQuery } from "@apollo/client";
import {
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Users,
  FileText,
  Plus,
  ArrowUpRight,
  Activity,
  CreditCard,
  Calendar,
  Settings,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { type PermissionAction } from "@/components/auth/resource-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GetBillingItemsAdvancedDocument, GetBillingItemsStatsAdvancedDocument } from "../../graphql/generated/graphql";
import { RevenueMetrics } from "../analytics/revenue-metrics";
import { ServicePerformanceChart } from "../analytics/service-performance-chart";
import { BillingItemsTable } from "../items/billing-items-table";
import { PayrollCompletionTracker } from "../payroll-integration/payroll-completion-tracker";

export function ModernBillingDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d");

  // Fetch billing data
  const { data: billingItemsData, loading: itemsLoading, refetch } = useQuery(
    GetBillingItemsAdvancedDocument,
    {
      variables: {
        limit: 50,
        offset: 0,
        orderBy: [{ createdAt: "DESC" }],
      },
      fetchPolicy: "cache-and-network",
    }
  );

  const { data: statsData, loading: statsLoading } = useQuery(
    GetBillingItemsStatsAdvancedDocument,
    {
      variables: { where: {} },
      fetchPolicy: "cache-and-network",
    }
  );

  const billingItems = billingItemsData?.billingItems || [];
  const stats = statsData?.billingItemsAggregate?.aggregate;
  const pendingStats = statsData?.pending?.aggregate;
  const approvedStats = statsData?.approved?.aggregate;

  // Calculate metrics
  const totalRevenue = stats?.sum?.amount || 0;
  const pendingRevenue = pendingStats?.sum?.amount || 0;
  const approvedRevenue = approvedStats?.sum?.amount || 0;
  const pendingCount = pendingStats?.count || 0;
  const approvedCount = approvedStats?.count || 0;
  const uniqueClients = new Set(billingItems.map(item => item.clientId)).size;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    }).format(amount);
  };

  const metricCards = [
    {
      title: "Total Revenue",
      value: itemsLoading ? "Loading..." : formatCurrency(totalRevenue),
      change: `${billingItems.length} total items`,
      icon: DollarSign,
      trend: "up",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Pending Approval",
      value: itemsLoading ? "..." : pendingCount.toString(),
      change: formatCurrency(pendingRevenue),
      icon: Clock,
      trend: "neutral",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Approved Items",
      value: itemsLoading ? "..." : approvedCount.toString(),
      change: formatCurrency(approvedRevenue),
      icon: CheckCircle,
      trend: "up",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Active Clients",
      value: itemsLoading ? "..." : uniqueClients.toString(),
      change: "with billing activity",
      icon: Users,
      trend: "up",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ];

  const quickActions = [
    {
      title: "Create Billing Item",
      description: "Add new billable work",
      href: "/billing/items/new",
      icon: Plus,
      action: "create",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Time Tracking",
      description: "6-minute precision tracking",
      href: "/billing/time-tracking",
      icon: Clock,
      action: "create",
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "Generate Invoices",
      description: "Create client invoices",
      href: "/billing/invoices/new",
      icon: FileText,
      action: "admin",
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      title: "Service Catalog",
      description: "Manage services & rates",
      href: "/billing/services",
      icon: Settings,
      action: "admin",
      color: "bg-gray-600 hover:bg-gray-700",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
              <div className="flex items-center mt-1">
                {metric.trend === "up" && (
                  <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                )}
                <p className="text-xs text-gray-500">{metric.change}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          <CardDescription>
            Common billing tasks and workflows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <PermissionGuard key={index} action={action.action as PermissionAction}>
                <Link href={action.href}>
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start space-y-2 hover:shadow-md transition-all"
                  >
                    <div className={`p-2 rounded-lg text-white ${action.color}`}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-sm">{action.title}</div>
                      <div className="text-xs text-gray-500">
                        {action.description}
                      </div>
                    </div>
                  </Button>
                </Link>
              </PermissionGuard>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="billing-items" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Billing Items
          </TabsTrigger>
          <TabsTrigger value="payroll-integration" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Payroll Integration
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="invoicing" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Invoicing
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <CardDescription>
                  Latest billing items and activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {billingItems.slice(0, 5).map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          {item.service?.name || item.description}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.client?.name} • {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={item.isApproved ? "default" : "secondary"}
                          className={
                            item.isApproved
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {item.isApproved ? "Approved" : "Pending"}
                        </Badge>
                        <span className="text-sm font-medium">
                          {formatCurrency(item.amount || 0)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Revenue Metrics</CardTitle>
                <CardDescription>
                  Current period performance overview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RevenueMetrics />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Billing Items Tab */}
        <TabsContent value="billing-items" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Billing Items Management</h3>
              <p className="text-sm text-gray-500">
                View and manage all billing items
              </p>
            </div>
            <PermissionGuard action="create">
              <Button asChild>
                <Link href="/billing/items/new">
                  <Plus className="h-4 w-4 mr-2" />
                  New Item
                </Link>
              </Button>
            </PermissionGuard>
          </div>
          <BillingItemsTable data={billingItems} loading={itemsLoading} refetch={refetch} />
        </TabsContent>

        {/* Payroll Integration Tab */}
        <TabsContent value="payroll-integration" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Payroll Integration</h3>
            <p className="text-sm text-gray-500">
              Track payroll completion and automatic billing generation
            </p>
          </div>
          <PayrollCompletionTracker />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Billing Analytics</h3>
            <p className="text-sm text-gray-500">
              Service performance and revenue insights
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ServicePerformanceChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  Revenue trend chart will be displayed here
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Invoicing Tab */}
        <TabsContent value="invoicing" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Invoice Management</h3>
              <p className="text-sm text-gray-500">
                Generate and manage client invoices
              </p>
            </div>
            <PermissionGuard action="admin">
              <Button asChild>
                <Link href="/billing/invoices/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Generate Invoice
                </Link>
              </Button>
            </PermissionGuard>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Invoice Generation
                </h3>
                <p className="text-gray-500 mb-6">
                  Generate invoices from approved billing items
                </p>
                <PermissionGuard action="admin">
                  <Button asChild>
                    <Link href="/billing/invoices/new">
                      Start Invoice Generation
                    </Link>
                  </Button>
                </PermissionGuard>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}