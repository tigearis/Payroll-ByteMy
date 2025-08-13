"use client";

import { useQuery } from "@apollo/client";
import {
  DollarSign,
  Clock,
  Timer,
  TrendingUp,
  AlertCircle,
  Target,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  RefreshCw,
} from "lucide-react";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetPayrollBillingStatsDocument } from "../../graphql/generated/graphql";
import {
  formatCurrency,
  formatHours,
  formatPercentage,
  getBillingMetricStatus,
  getBillingTrend,
} from "../../utils/status-config";

// EnhancedMetricCard component - EXACT copy from existing payroll and client detail pages
function EnhancedMetricCard({
  title,
  value,
  subtitle,
  icon: IconComponent,
  trend,
  trendValue,
  status = "neutral",
  onClick,
  children,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  status?: "good" | "warning" | "critical" | "neutral";
  onClick?: () => void;
  children?: React.ReactNode;
}) {
  const statusStyles = {
    good: "bg-green-50 border-green-200 hover:bg-green-100",
    warning: "bg-amber-50 border-amber-200 hover:bg-amber-100",
    critical: "bg-red-50 border-red-200 hover:bg-red-100",
    neutral: "bg-white border-gray-200 hover:bg-gray-50",
  };

  const trendStyles = {
    up: "text-green-600 bg-green-100",
    down: "text-red-600 bg-red-100",
    stable: "text-gray-600 bg-gray-100",
  };

  return (
    <Card
      className={`group cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${statusStyles[status]} ${onClick && "hover:border-blue-300"}`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
          {title}
        </CardTitle>
        <div className="relative">
          <IconComponent className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 transition-colors" />
          {status === "critical" && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-gray-900 group-hover:text-blue-900 transition-colors">
              {value}
            </div>
            {trend && trendValue && (
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${trendStyles[trend]}`}
                title="Trend from previous period"
              >
                {trend === "up" && <ArrowUp className="w-3 h-3" />}
                {trend === "down" && <ArrowDown className="w-3 h-3" />}
                {trend === "stable" && <Minus className="w-3 h-3" />}
                <span>{trendValue}</span>
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground group-hover:text-gray-600 transition-colors">
            {subtitle}
          </p>

          {children}
        </div>
      </CardContent>
    </Card>
  );
}

interface PayrollBillingOverviewProps {
  payrollId: string;
}

export function PayrollBillingOverview({
  payrollId,
}: PayrollBillingOverviewProps) {
  // Use same GraphQL query pattern as existing components
  const { data, loading, error } = useQuery(GetPayrollBillingStatsDocument, {
    variables: { payrollId },
    fetchPolicy: "cache-and-network",
    skip: !payrollId,
  });

  // Calculate metrics using same pattern as existing overview cards
  const billingMetrics = useMemo(() => {
    if (!data?.payrolls?.[0]) {
      return {
        totalRevenue: 0,
        pendingItems: 0,
        approvedItems: 0,
        hoursSpent: 0,
        estimatedHours: 0,
        profitMargin: 0,
        billingEfficiency: 0,
      };
    }

    const payroll = data.payrolls[0];
    const billingSum =
      payroll.billingItemsAggregate?.aggregate?.sum?.totalAmount || 0;
    const billingCount = payroll.billingItemsAggregate?.aggregate?.count || 0;

    return {
      totalRevenue: billingSum,
      pendingItems: Math.round(billingCount * 0.3), // 30% pending estimate
      approvedItems: Math.round(billingCount * 0.7), // 70% approved estimate
      hoursSpent: billingSum / 150, // Estimate based on average rate
      estimatedHours: billingSum / 120, // Estimate based on lower rate
      profitMargin: billingSum * 0.25, // 25% margin estimate
      billingEfficiency: billingCount > 0 ? 85 : 0, // Placeholder efficiency
    };
  }, [data?.payrolls?.[0]]);

  // Calculate trends using same pattern as existing cards
  const trends = useMemo(() => {
    // Placeholder trends - will be replaced with actual comparison data
    return {
      revenue: getBillingTrend(
        billingMetrics.totalRevenue,
        billingMetrics.totalRevenue * 0.85
      ),
      hours: getBillingTrend(
        billingMetrics.hoursSpent,
        billingMetrics.hoursSpent * 0.9
      ),
      profit: getBillingTrend(
        billingMetrics.profitMargin,
        billingMetrics.profitMargin * 0.8
      ),
      efficiency: getBillingTrend(billingMetrics.billingEfficiency, 80),
    };
  }, [billingMetrics]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 w-4 bg-gray-200 rounded"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="col-span-4">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Unable to load billing data: {error.message}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Total Revenue Card - EXACT EnhancedMetricCard pattern */}
      <EnhancedMetricCard
        title="Total Revenue"
        value={formatCurrency(billingMetrics.totalRevenue)}
        subtitle="From this payroll"
        icon={DollarSign}
        status={getBillingMetricStatus("revenue", billingMetrics.totalRevenue)}
        trend={trends.revenue.trend}
        trendValue={trends.revenue.value}
        onClick={() => (window.location.href = `/billing/items`)}
      >
        <div className="flex items-center gap-1 text-xs text-gray-600 mt-2">
          <Target className="h-3 w-3" />
          <span>{billingMetrics.approvedItems} approved items</span>
        </div>
      </EnhancedMetricCard>

      {/* Billing Status Card */}
      <EnhancedMetricCard
        title="Billing Status"
        value={billingMetrics.pendingItems.toString()}
        subtitle="Items pending approval"
        icon={Clock}
        status={billingMetrics.pendingItems > 0 ? "warning" : "good"}
        onClick={() => (window.location.href = `/billing/approval-queue`)}
      >
        {billingMetrics.pendingItems > 0 ? (
          <div className="flex items-center gap-1 text-xs text-amber-600 mt-2">
            <AlertCircle className="h-3 w-3" />
            <span>Requires manager approval</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-xs text-green-600 mt-2">
            <CheckCircle className="h-3 w-3" />
            <span>All items approved</span>
          </div>
        )}
      </EnhancedMetricCard>

      {/* Time Tracked Card */}
      <EnhancedMetricCard
        title="Time Tracked"
        value={formatHours(billingMetrics.hoursSpent)}
        subtitle={`${formatHours(billingMetrics.estimatedHours)} estimated`}
        icon={Timer}
        status={
          billingMetrics.hoursSpent > billingMetrics.estimatedHours * 1.2
            ? "warning"
            : billingMetrics.hoursSpent < billingMetrics.estimatedHours * 0.8
              ? "warning"
              : "good"
        }
        trend={trends.hours.trend}
        trendValue={trends.hours.value}
        onClick={() => (window.location.href = `/billing/time-tracking`)}
      >
        <div className="flex items-center gap-1 text-xs text-gray-600 mt-2">
          <RefreshCw className="h-3 w-3" />
          <span>
            {billingMetrics.hoursSpent > billingMetrics.estimatedHours * 1.1
              ? "Over estimate"
              : billingMetrics.hoursSpent < billingMetrics.estimatedHours * 0.9
                ? "Under estimate"
                : "On track"}
          </span>
        </div>
      </EnhancedMetricCard>

      {/* Profitability Card */}
      <EnhancedMetricCard
        title="Profitability"
        value={formatPercentage(billingMetrics.profitMargin)}
        subtitle="Revenue vs. cost"
        icon={TrendingUp}
        status={getBillingMetricStatus(
          "profitability",
          billingMetrics.profitMargin
        )}
        trend={trends.profit.trend}
        trendValue={trends.profit.value}
        onClick={() => (window.location.href = `/billing/profitability`)}
      >
        <div className="flex items-center gap-1 text-xs text-gray-600 mt-2">
          <Target className="h-3 w-3" />
          <span>
            {billingMetrics.profitMargin > 30
              ? "Excellent margin"
              : billingMetrics.profitMargin > 15
                ? "Good margin"
                : billingMetrics.profitMargin >= 0
                  ? "Break even"
                  : "Loss"}
          </span>
        </div>
      </EnhancedMetricCard>
    </div>
  );
}
