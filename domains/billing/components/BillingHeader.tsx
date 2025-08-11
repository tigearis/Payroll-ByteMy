"use client";

import { 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Plus, 
  RefreshCw,
  Settings,
  BarChart3,
  FileText,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BillingHeaderProps, MetricCard, QuickAction } from "../types/billing.types";

export function BillingHeader({ metrics, loading, onRefresh }: BillingHeaderProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const metricCards: MetricCard[] = [
    {
      title: "Total Revenue",
      value: loading ? "Loading..." : formatCurrency(metrics.totalRevenue),
      change: `${metrics.totalItems} total items`,
      icon: DollarSign,
      trend: "up",
      color: "text-green-600",
      bgColor: "bg-green-50",
      href: "/billing?tab=billing-items"
    },
    {
      title: "Pending Approval",
      value: loading ? "..." : metrics.pendingCount.toString(),
      change: formatCurrency(metrics.pendingRevenue),
      icon: Clock,
      trend: "neutral",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      href: "/billing?tab=billing-items&status=pending"
    },
    {
      title: "Approved Items",
      value: loading ? "..." : metrics.approvedCount.toString(),
      change: formatCurrency(metrics.approvedRevenue),
      icon: CheckCircle,
      trend: "up",
      color: "text-green-600",
      bgColor: "bg-green-50",
      href: "/billing?tab=billing-items&status=approved"
    },
    {
      title: "Active Clients",
      value: loading ? "..." : metrics.activeClientsCount.toString(),
      change: `${metrics.completionRate.toFixed(1)}% completion rate`,
      icon: Users,
      trend: "up",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      href: "/billing?tab=analytics"
    },
  ];

  const quickActions: QuickAction[] = [
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
      title: "Analytics Dashboard",
      description: "View performance metrics",
      href: "/billing?tab=analytics",
      icon: BarChart3,
      action: "read",
      color: "bg-gray-600 hover:bg-gray-700",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Billing Dashboard
          </h1>
          <p className="text-gray-600">
            Manage billing items, track revenue, and oversee client invoicing
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}
          
          <PermissionGuard action="admin">
            <Button asChild size="sm" variant="outline">
              <Link href="/billing/settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </Button>
          </PermissionGuard>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric, index) => (
          <Link key={index} href={metric.href || "#"}>
            <Card className="relative overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {metric.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <metric.icon className={`h-4 w-4 ${metric.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {metric.value}
                </div>
                <div className="flex items-center mt-1">
                  {metric.trend === "up" && (
                    <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                  )}
                  {metric.trend === "down" && (
                    <AlertTriangle className="h-3 w-3 text-red-600 mr-1" />
                  )}
                  <p className="text-xs text-gray-500">{metric.change}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Common billing tasks and workflows
              </p>
            </div>
            
            {/* Performance Indicator */}
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <TrendingUp className="h-3 w-3" />
                {metrics.averageItemValue > 0 
                  ? formatCurrency(metrics.averageItemValue) 
                  : "$0"} avg
              </Badge>
              <Badge 
                variant={metrics.completionRate > 80 ? "default" : "secondary"} 
                className={metrics.completionRate > 80 
                  ? "bg-green-100 text-green-800" 
                  : "bg-yellow-100 text-yellow-800"
                }
              >
                {metrics.completionRate.toFixed(0)}% completion
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <PermissionGuard key={index} action={action.action}>
                <Link href={action.href}>
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start space-y-2 hover:shadow-md transition-all w-full"
                    disabled={action.disabled}
                  >
                    <div className={`p-2 rounded-lg text-white ${action.color}`}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <div className="text-left w-full">
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

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-50">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">
                  Revenue Efficiency
                </div>
                <div className="text-lg font-bold">
                  {metrics.payrollCompletionRate.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500">
                  Payroll completion rate
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-50">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">
                  Draft Items
                </div>
                <div className="text-lg font-bold">
                  {metrics.draftCount}
                </div>
                <div className="text-xs text-gray-500">
                  {formatCurrency(metrics.draftRevenue)} pending
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-purple-50">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">
                  Client Activity
                </div>
                <div className="text-lg font-bold">
                  {metrics.activeClientsCount}
                </div>
                <div className="text-xs text-gray-500">
                  Active billing clients
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}