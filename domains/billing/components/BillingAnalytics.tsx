"use client";

import { format, subDays } from "date-fns";
import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, DollarSign, Clock, Users, BarChart3, PieChartIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { 
  BillingAnalyticsProps, 
  RevenueData, 
  ServicePerformanceData, 
  StaffPerformanceData 
} from "../types/billing.types";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function BillingAnalytics({ 
  timeEntries, 
  billingItems, 
  staffUsers, 
  metrics, 
  loading 
}: BillingAnalyticsProps) {
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Memoized revenue data by day for the last 14 days
  const revenueData: RevenueData[] = useMemo(() => {
    const data: { [key: string]: RevenueData } = {};
    
    // Initialize all days with zero values
    for (let i = 13; i >= 0; i--) {
      const date = format(subDays(new Date(), i), "yyyy-MM-dd");
      data[date] = {
        date,
        revenue: 0,
        approved: 0,
        pending: 0,
        count: 0,
      };
    }
    
    // Aggregate billing items by date
    billingItems.forEach((item) => {
      if (!item.createdAt) return;
      
      const date = format(new Date(item.createdAt), "yyyy-MM-dd");
      const amount = item.amount || item.totalAmount || 0;
      
      if (data[date]) {
        data[date].revenue += amount;
        data[date].count += 1;
        
        if (item.isApproved) {
          data[date].approved += amount;
        } else {
          data[date].pending += amount;
        }
      }
    });
    
    return Object.values(data).map(day => ({
      ...day,
      displayDate: format(new Date(day.date), "MMM d"),
    }));
  }, [billingItems]);

  // Memoized service performance data
  const servicePerformanceData: ServicePerformanceData[] = useMemo(() => {
    const serviceMap: { [key: string]: ServicePerformanceData } = {};
    
    billingItems.forEach((item) => {
      if (!item.isApproved) return; // Only count approved items
      
      const serviceName = item.service?.name || item.serviceName || "Unknown Service";
      const amount = item.amount || item.totalAmount || 0;
      
      if (!serviceMap[serviceName]) {
        serviceMap[serviceName] = {
          serviceName,
          revenue: 0,
          count: 0,
          averageValue: 0,
        };
      }
      
      serviceMap[serviceName].revenue += amount;
      serviceMap[serviceName].count += 1;
    });
    
    // Calculate average values and sort by revenue
    const services = Object.values(serviceMap).map(service => ({
      ...service,
      averageValue: service.count > 0 ? service.revenue / service.count : 0,
    }));
    
    return services
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8); // Top 8 services
  }, [billingItems]);

  // Memoized staff performance data
  const staffPerformanceData: StaffPerformanceData[] = useMemo(() => {
    const staffMap: { [key: string]: StaffPerformanceData } = {};
    
    // Aggregate billing data by staff
    billingItems.forEach((item) => {
      if (!item.staffUser || !item.isApproved) return; // Only approved items
      
      const staffKey = item.staffUser.id;
      const staffName = `${item.staffUser.firstName || ''} ${item.staffUser.lastName || ''}`.trim();
      const amount = item.amount || item.totalAmount || 0;
      
      if (!staffMap[staffKey]) {
        staffMap[staffKey] = {
          staffName: staffName || "Unknown Staff",
          revenue: 0,
          count: 0,
          hoursSpent: 0,
          efficiency: 0,
        };
      }
      
      staffMap[staffKey].revenue += amount;
      staffMap[staffKey].count += 1;
    });
    
    // Add time entry data
    timeEntries.forEach((entry) => {
      if (!entry.hoursSpent || !entry.staffUser) return;
      
      const staffKey = entry.staffUser.id;
      const staffName = `${entry.staffUser.firstName || ''} ${entry.staffUser.lastName || ''}`.trim();
      
      if (!staffMap[staffKey]) {
        staffMap[staffKey] = {
          staffName: staffName || "Unknown Staff",
          revenue: 0,
          count: 0,
          hoursSpent: 0,
          efficiency: 0,
        };
      }
      
      staffMap[staffKey].hoursSpent += entry.hoursSpent;
    });
    
    // Calculate efficiency (revenue per hour) and sort
    const staff = Object.values(staffMap).map(member => ({
      ...member,
      efficiency: member.hoursSpent > 0 ? member.revenue / member.hoursSpent : 0,
    }));
    
    return staff
      .filter(member => member.revenue > 0 || member.hoursSpent > 0)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10); // Top 10 staff members
  }, [billingItems, timeEntries]);

  // Status distribution data for pie chart
  const statusDistribution = useMemo(() => {
    const distribution = {
      approved: { value: metrics.approvedCount, color: '#00C49F' },
      pending: { value: metrics.pendingCount, color: '#FFBB28' },
      draft: { value: metrics.draftCount, color: '#8884D8' },
    };
    
    return Object.entries(distribution)
      .map(([status, data]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: data.value,
        color: data.color,
      }))
      .filter(item => item.value > 0);
  }, [metrics]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-50">
                <DollarSign className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-xl font-bold">{formatCurrency(metrics.totalRevenue)}</p>
                <p className="text-xs text-gray-500">{metrics.totalItems} items</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-50">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Item Value</p>
                <p className="text-xl font-bold">{formatCurrency(metrics.averageItemValue)}</p>
                <p className="text-xs text-gray-500">Per billing item</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-purple-50">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active Clients</p>
                <p className="text-xl font-bold">{metrics.activeClientsCount}</p>
                <p className="text-xs text-gray-500">Billing activity</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-orange-50">
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-xl font-bold">{metrics.completionRate.toFixed(1)}%</p>
                <p className="text-xs text-gray-500">Approval efficiency</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Revenue Trends
          </TabsTrigger>
          <TabsTrigger value="services" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Service Performance
          </TabsTrigger>
          <TabsTrigger value="staff" className="gap-2">
            <Users className="h-4 w-4" />
            Staff Performance
          </TabsTrigger>
          <TabsTrigger value="distribution" className="gap-2">
            <PieChartIcon className="h-4 w-4" />
            Status Distribution
          </TabsTrigger>
        </TabsList>

        {/* Revenue Trends Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>14-Day Revenue Trend</CardTitle>
              <p className="text-sm text-gray-600">
                Daily revenue breakdown showing approved vs pending items
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="displayDate"
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }} 
                    tickFormatter={formatCurrency}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      formatCurrency(value),
                      name === "approved" ? "Approved" : name === "pending" ? "Pending" : "Total Revenue",
                    ]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="approved"
                    stroke="#00C49F"
                    strokeWidth={3}
                    dot={{ fill: "#00C49F", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="pending"
                    stroke="#FFBB28"
                    strokeWidth={2}
                    dot={{ fill: "#FFBB28", strokeWidth: 2, r: 3 }}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Service Performance Tab */}
        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Services</CardTitle>
              <p className="text-sm text-gray-600">
                Services ranked by total approved revenue
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={servicePerformanceData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    type="number" 
                    tickFormatter={formatCurrency}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    dataKey="serviceName" 
                    type="category" 
                    width={120}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), "Revenue"]}
                  />
                  <Bar dataKey="revenue" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Service Details Table */}
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {servicePerformanceData.map((service, index) => (
                  <div key={service.serviceName} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <div>
                        <div className="font-medium">{service.serviceName}</div>
                        <div className="text-sm text-gray-500">
                          {service.count} items • Avg: {formatCurrency(service.averageValue)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{formatCurrency(service.revenue)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Staff Performance Tab */}
        <TabsContent value="staff" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Staff Performance Overview</CardTitle>
              <p className="text-sm text-gray-600">
                Revenue and efficiency metrics by team member
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {staffPerformanceData.map((staff, index) => (
                  <div key={staff.staffName} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <div>
                        <div className="font-medium">{staff.staffName}</div>
                        <div className="text-sm text-gray-500">
                          {staff.count} items • {staff.hoursSpent.toFixed(1)} hours
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{formatCurrency(staff.revenue)}</div>
                      <div className="text-sm text-gray-500">
                        {staff.efficiency > 0 ? formatCurrency(staff.efficiency) : "$0"}/hr
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Status Distribution Tab */}
        <TabsContent value="distribution" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Item Status Distribution</CardTitle>
                <p className="text-sm text-gray-600">
                  Breakdown of billing items by approval status
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) => 
                        `${name}: ${value} (${((percent || 0) * 100).toFixed(0)}%)`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Distribution</CardTitle>
                <p className="text-sm text-gray-600">
                  Revenue breakdown by status
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-green-800">Approved</span>
                    </div>
                    <div className="text-green-900 font-bold">
                      {formatCurrency(metrics.approvedRevenue)}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="font-medium text-yellow-800">Pending</span>
                    </div>
                    <div className="text-yellow-900 font-bold">
                      {formatCurrency(metrics.pendingRevenue)}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                      <span className="font-medium text-gray-800">Draft</span>
                    </div>
                    <div className="text-gray-900 font-bold">
                      {formatCurrency(metrics.draftRevenue)}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total Revenue</span>
                    <span className="text-xl font-bold">
                      {formatCurrency(metrics.totalRevenue)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}