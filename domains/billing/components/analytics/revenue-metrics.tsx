"use client";

import { useQuery } from "@apollo/client";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { GetBillingItemsAdvancedDocument } from "../../graphql/generated/graphql";

export function RevenueMetrics() {
  const { data, loading } = useQuery(GetBillingItemsAdvancedDocument, {
    variables: {
      limit: 200,
      offset: 0,
      orderBy: [{ createdAt: "DESC" }],
      where: {
        createdAt: {
          _gte: subDays(new Date(), 30).toISOString(),
        },
      },
    },
    fetchPolicy: "cache-first",
    nextFetchPolicy: "cache-first",
  });

  const billingItems = data?.billingItems || [];

  // Process data for revenue trend over last 30 days
  const revenueByDay = billingItems.reduce((acc: any, item: any) => {
    const date = format(new Date(item.createdAt), "yyyy-MM-dd");
    const amount = item.amount || 0;

    if (!acc[date]) {
      acc[date] = {
        date,
        revenue: 0,
        count: 0,
        approved: 0,
        pending: 0,
      };
    }

    acc[date].revenue += amount;
    acc[date].count += 1;

    if (item.isApproved) {
      acc[date].approved += amount;
    } else {
      acc[date].pending += amount;
    }

    return acc;
  }, {});

  // Create array of last 14 days with data
  const chartData = [];
  for (let i = 13; i >= 0; i--) {
    const date = format(subDays(new Date(), i), "yyyy-MM-dd");
    const dayData = revenueByDay[date] || {
      date,
      revenue: 0,
      count: 0,
      approved: 0,
      pending: 0,
    };
    
    chartData.push({
      ...dayData,
      displayDate: format(subDays(new Date(), i), "MMM d"),
    });
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Calculate summary metrics
  const totalRevenue = billingItems.reduce((sum, item) => sum + (item.amount || 0), 0);
  const approvedRevenue = billingItems
    .filter(item => item.isApproved)
    .reduce((sum, item) => sum + (item.amount || 0), 0);
  const pendingRevenue = totalRevenue - approvedRevenue;
  const approvalRate = totalRevenue > 0 ? (approvedRevenue / totalRevenue) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Loading revenue data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-sm font-medium text-green-800">Approved</div>
          <div className="text-2xl font-bold text-green-900">
            {formatCurrency(approvedRevenue)}
          </div>
          <div className="text-sm text-green-600">
            {approvalRate.toFixed(1)}% approval rate
          </div>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="text-sm font-medium text-yellow-800">Pending</div>
          <div className="text-2xl font-bold text-yellow-900">
            {formatCurrency(pendingRevenue)}
          </div>
          <div className="text-sm text-yellow-600">
            {billingItems.filter(item => !item.isApproved).length} items
          </div>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-4">
          14-Day Revenue Trend
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="displayDate"
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fontSize: 12 }} />
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
              stroke="#10B981"
              strokeWidth={2}
              dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="pending"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={{ fill: "#F59E0B", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-sm text-gray-500">Total Items</div>
          <div className="text-xl font-bold">{billingItems.length}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Avg. Item Value</div>
          <div className="text-xl font-bold">
            {billingItems.length > 0
              ? formatCurrency(totalRevenue / billingItems.length)
              : formatCurrency(0)
            }
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Active Days</div>
          <div className="text-xl font-bold">
            {Object.keys(revenueByDay).length}
          </div>
        </div>
      </div>
    </div>
  );
}