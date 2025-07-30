"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { useQuery } from "@apollo/client";
import {
  DollarSign,
  FileText,
  CreditCard,
  TrendingUp,
  Users,
  BarChart3,
  Plus,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { BillingDashboard } from "@/domains/billing/components/dashboard";
import { GetAllBillingItemsDocument } from "@/domains/billing/graphql/generated/graphql";

export default function BillingPage() {
  // Fetch real billing data
  const { data: allItemsData, loading: allItemsLoading } = useQuery(GetAllBillingItemsDocument, {
    variables: { searchTerm: null, isApproved: null, limit: 100, offset: 0 },
    fetchPolicy: 'cache-and-network'
  });

  const billingItems = allItemsData?.billingItems || [];

  // Calculate real stats
  const totalRevenue = billingItems.reduce((sum, item) => sum + (item.totalAmount || item.amount || 0), 0);
  const pendingItems = billingItems.filter(item => !item.isApproved);
  const uniqueClients = new Set(billingItems.map(item => item.clientId)).size;
  const avgItemValue = billingItems.length > 0 ? totalRevenue / billingItems.length : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  const stats = [
    {
      title: "Total Revenue",
      value: allItemsLoading ? "Loading..." : formatCurrency(totalRevenue),
      change: `${billingItems.length} items`,
      icon: DollarSign,
      positive: true,
    },
    {
      title: "Pending Approval",
      value: allItemsLoading ? "..." : pendingItems.length.toString(),
      change: formatCurrency(pendingItems.reduce((sum, item) => sum + (item.totalAmount || item.amount || 0), 0)),
      icon: FileText,
      positive: true,
    },
    {
      title: "Active Clients",
      value: allItemsLoading ? "..." : uniqueClients.toString(),
      change: "with billing items",
      icon: Users,
      positive: true,
    },
    {
      title: "Avg. Item Value",
      value: allItemsLoading ? "..." : formatCurrency(avgItemValue),
      change: "per billing item",
      icon: TrendingUp,
      positive: true,
    },
  ];

  const quickActions = [
    {
      title: "View All Items",
      description: "Browse and manage billing items",
      href: "/billing/items",
      icon: FileText,
      permission: "billing.read",
    },
    {
      title: "Create New Item",
      description: "Add a new billing item",
      href: "/billing/items/new",
      icon: Plus,
      permission: "billing.create",
    },
    {
      title: "View Invoices",
      description: "Manage invoices and payments",
      href: "/billing/invoices",
      icon: CreditCard,
      permission: "billing.read",
    },
    {
      title: "Financial Reports",
      description: "View billing analytics and reports",
      href: "/billing/reports",
      icon: BarChart3,
      permission: "billing.read",
    },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
          <p className="text-muted-foreground">
            Manage billing items, invoices, and financial reporting
          </p>
        </div>
        <PermissionGuard permission="billing.create">
          <Button asChild>
            <Link href="/billing/items/new">
              <Plus className="w-4 h-4 mr-2" />
              New Billing Item
            </Link>
          </Button>
        </PermissionGuard>
      </div>

      {/* Stats Grid */}
      <PermissionGuard permission="billing.read">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </PermissionGuard>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common billing tasks and navigation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <PermissionGuard key={index} permission={action.permission}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-2">
                      <action.icon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-sm">{action.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-xs mb-3">
                      {action.description}
                    </CardDescription>
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <Link href={action.href}>
                        <Eye className="w-3 h-3 mr-1" />
                        Open
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </PermissionGuard>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Dashboard Component */}
      <PermissionGuard permission="billing.read">
        <BillingDashboard />
      </PermissionGuard>
    </div>
  );
}