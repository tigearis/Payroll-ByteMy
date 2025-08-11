"use client";

import { format } from "date-fns";
import { 
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Building2,
  TrendingUp,
  Calendar,
  DollarSign,
  ArrowRight,
  Activity
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import type { BillingOverviewProps } from "../types/billing.types";

export function BillingOverview({ 
  billingItems, 
  recentBillingItems, 
  metrics, 
  loading 
}: BillingOverviewProps) {
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    }).format(amount);
  };

  const getStatusBadge = (status: string | null | undefined, isApproved?: boolean | null) => {
    if (isApproved) {
      return (
        <Badge className="bg-green-100 text-green-800 gap-1">
          <CheckCircle className="w-3 h-3" />
          Approved
        </Badge>
      );
    }
    
    switch (status?.toLowerCase()) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 gap-1">
            <Clock className="w-3 h-3" />
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 gap-1">
            <AlertTriangle className="w-3 h-3" />
            Rejected
          </Badge>
        );
      case "draft":
        return (
          <Badge variant="outline" className="gap-1">
            <Activity className="w-3 h-3" />
            Draft
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status || "Unknown"}
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                <div className="space-y-2">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-500">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">Approved Revenue</p>
                <p className="text-xl font-bold text-green-900">
                  {formatCurrency(metrics.approvedRevenue)}
                </p>
                <p className="text-xs text-green-600">
                  {metrics.approvedCount} items
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-yellow-500">
                <Clock className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-800">Pending Revenue</p>
                <p className="text-xl font-bold text-yellow-900">
                  {formatCurrency(metrics.pendingRevenue)}
                </p>
                <p className="text-xs text-yellow-600">
                  {metrics.pendingCount} items
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gray-500">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Draft Revenue</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(metrics.draftRevenue)}
                </p>
                <p className="text-xs text-gray-600">
                  {metrics.draftCount} items
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-500">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">Avg Item Value</p>
                <p className="text-xl font-bold text-blue-900">
                  {formatCurrency(metrics.averageItemValue)}
                </p>
                <p className="text-xs text-blue-600">
                  Per billing item
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Latest billing items and activities
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/billing?tab=billing-items">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBillingItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No recent billing items</p>
                  <p className="text-sm">Create your first billing item to get started</p>
                </div>
              ) : (
                recentBillingItems.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded px-2 -mx-2 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium truncate">
                          {item.service?.name || item.description || "Unnamed Item"}
                        </p>
                        {getStatusBadge(item.status, item.isApproved)}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        {item.client && (
                          <>
                            <Building2 className="h-3 w-3" />
                            <span className="truncate">{item.client.name}</span>
                            <Separator orientation="vertical" className="h-3" />
                          </>
                        )}
                        {item.staffUser && (
                          <>
                            <User className="h-3 w-3" />
                            <span className="truncate">
                              {item.staffUser.firstName} {item.staffUser.lastName}
                            </span>
                            <Separator orientation="vertical" className="h-3" />
                          </>
                        )}
                        <span>
                          {item.createdAt 
                            ? format(new Date(item.createdAt), "MMM d, HH:mm")
                            : "Unknown date"
                          }
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {formatCurrency(item.amount || 0)}
                        </div>
                        {item.quantity && item.quantity > 1 && (
                          <div className="text-xs text-gray-500">
                            {item.quantity}x {formatCurrency(item.unitPrice || 0)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Overview
            </CardTitle>
            <p className="text-sm text-gray-600">
              Billing efficiency and completion rates
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Completion Rate */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Approval Rate</span>
                <span className="text-sm text-gray-600">
                  {metrics.completionRate.toFixed(1)}%
                </span>
              </div>
              <Progress 
                value={metrics.completionRate} 
                className="h-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                {metrics.approvedCount} of {metrics.totalItems} items approved
              </p>
            </div>

            {/* Revenue Distribution */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Revenue Distribution</h4>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Approved</span>
                </div>
                <div className="text-sm font-medium">
                  {formatCurrency(metrics.approvedRevenue)}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Pending</span>
                </div>
                <div className="text-sm font-medium">
                  {formatCurrency(metrics.pendingRevenue)}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-sm">Draft</span>
                </div>
                <div className="text-sm font-medium">
                  {formatCurrency(metrics.draftRevenue)}
                </div>
              </div>
            </div>

            {/* Key Statistics */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">
                  {metrics.activeClientsCount}
                </div>
                <div className="text-xs text-gray-500">Active Clients</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">
                  {formatCurrency(metrics.averageItemValue)}
                </div>
                <div className="text-xs text-gray-500">Avg Item Value</div>
              </div>
            </div>

            <div className="pt-2">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/billing?tab=analytics">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Detailed Analytics
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}