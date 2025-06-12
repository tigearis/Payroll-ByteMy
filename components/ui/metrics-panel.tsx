"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./design-system";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

function MetricCard({
  title,
  value,
  description,
  icon,
  trend,
}: MetricCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="w-4 h-4 text-neutral-500">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-neutral-500 mt-1">{description}</p>
        )}
        {trend && (
          <div className="flex items-center mt-1">
            <span
              className={`text-xs ${
                trend.isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-neutral-500 ml-1">
              from last period
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface MetricsPanelProps {
  title?: string;
  metrics?: MetricCardProps[];
}

/**
 * A panel displaying multiple metric cards in a responsive grid
 */
export default function MetricsPanel({
  title = "Overview",
  metrics = defaultMetrics,
}: MetricsPanelProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
    </div>
  );
}

// Default metrics for demo
const defaultMetrics: MetricCardProps[] = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    description: "Monthly revenue across all channels",
    trend: {
      value: 20.1,
      isPositive: true,
    },
  },
  {
    title: "New Clients",
    value: "12",
    description: "New clients this month",
    trend: {
      value: 10,
      isPositive: true,
    },
  },
  {
    title: "Active Payrolls",
    value: "147",
    description: "Currently active payrolls",
    trend: {
      value: 5.3,
      isPositive: true,
    },
  },
  {
    title: "Processing Time",
    value: "1.2 days",
    description: "Average payroll processing time",
    trend: {
      value: 8,
      isPositive: false,
    },
  },
];
