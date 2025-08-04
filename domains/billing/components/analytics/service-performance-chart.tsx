"use client";

import React from "react";
import { useQuery } from "@apollo/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { GetBillingItemsAdvancedDocument } from "../../graphql/generated/graphql";

const COLORS = [
  "#3B82F6", // blue
  "#10B981", // green
  "#F59E0B", // yellow
  "#EF4444", // red
  "#8B5CF6", // purple
  "#F97316", // orange
  "#06B6D4", // cyan
  "#84CC16", // lime
];

export function ServicePerformanceChart() {
  const { data, loading } = useQuery(GetBillingItemsAdvancedDocument, {
    variables: {
      limit: 100,
      offset: 0,
      orderBy: [{ createdAt: "DESC" }],
    },
    fetchPolicy: "cache-first",
    nextFetchPolicy: "cache-first",
  });

  const billingItems = data?.billingItems || [];

  // Process data for service performance
  const serviceData = billingItems.reduce((acc: any, item: any) => {
    const serviceName = item.service?.name || "Unnamed Service";
    const category = item.service?.category || "Other";
    const amount = item.amount || 0;

    if (!acc[serviceName]) {
      acc[serviceName] = {
        name: serviceName,
        category,
        revenue: 0,
        count: 0,
      };
    }

    acc[serviceName].revenue += amount;
    acc[serviceName].count += 1;

    return acc;
  }, {});

  const servicePerformanceData = Object.values(serviceData)
    .sort((a: any, b: any) => b.revenue - a.revenue)
    .slice(0, 8);

  // Process data for category distribution
  const categoryData = billingItems.reduce((acc: any, item: any) => {
    const category = item.service?.category || "Other";
    const amount = item.amount || 0;

    if (!acc[category]) {
      acc[category] = {
        name: category,
        value: 0,
        count: 0,
      };
    }

    acc[category].value += amount;
    acc[category].count += 1;

    return acc;
  }, {});

  const categoryChartData = Object.values(categoryData);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (servicePerformanceData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-gray-400 mb-2">📊</div>
          <p className="text-gray-500">No service data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Service Revenue Performance */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-4">
          Service Revenue Performance
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={servicePerformanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value: number, name: string, props: any) => [
                name === "revenue" ? formatCurrency(value) : value,
                name === "revenue" ? "Revenue" : "Items"
              ]}
            />
            <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Distribution */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-4">
          Revenue by Service Category
        </h4>
        <div className="flex items-center">
          <ResponsiveContainer width="70%" height={200}>
            <PieChart>
              <Pie
                data={categoryChartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {categoryChartData.map((entry: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="flex-1 ml-4">
            <div className="space-y-2">
              {categoryChartData.map((category: any, index: number) => (
                <div key={category.name} className="flex items-center text-sm">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="flex-1">{category.name}</span>
                  <span className="font-medium">
                    {formatCurrency(category.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Services Summary */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-4">
          Top Performing Services
        </h4>
        <div className="space-y-3">
          {servicePerformanceData.slice(0, 5).map((service: any, index: number) => (
            <div
              key={service.name}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm font-medium text-blue-600">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-sm">{service.name}</div>
                  <div className="text-xs text-gray-500">{service.category}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-sm">
                  {formatCurrency(service.revenue)}
                </div>
                <div className="text-xs text-gray-500">
                  {service.count} items
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}