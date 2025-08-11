"use client";

import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Users,
  Target,
  Award,
  AlertTriangle,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { memo, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import type { PayrollData } from "@/domains/payrolls/hooks/usePayrollData";
import { cn } from "@/lib/utils";

export interface PayrollAnalyticsProps {
  data: PayrollData;
  loading?: boolean;
}

// Mock data for analytics - in real implementation, this would come from GraphQL
interface AnalyticsMetric {
  id: string;
  title: string;
  value: number;
  previousValue?: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendPercentage?: number;
  status: 'good' | 'warning' | 'critical';
  description: string;
  recommendation?: string;
}

interface Insight {
  id: string;
  type: 'optimization' | 'warning' | 'achievement' | 'recommendation';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  action?: string;
}

// Helper function to generate analytics data
function generateAnalyticsData(payroll: any): AnalyticsMetric[] {
  const employeeCount = payroll.employeeCount || 0;
  const processingDays = payroll.processingDaysBeforeEft || 0;
  
  return [
    {
      id: 'efficiency',
      title: 'Processing Efficiency',
      value: Math.max(85, 100 - (processingDays * 2)),
      previousValue: Math.max(80, 95 - (processingDays * 2)),
      unit: '%',
      trend: processingDays <= 3 ? 'up' : 'down',
      trendPercentage: Math.abs(5),
      status: processingDays <= 3 ? 'good' : processingDays <= 5 ? 'warning' : 'critical',
      description: 'How efficiently payroll is processed compared to industry standards',
      recommendation: processingDays > 3 ? 'Consider reducing processing lead time to improve efficiency' : undefined,
    },
    {
      id: 'cost-per-employee',
      title: 'Cost Per Employee',
      value: employeeCount > 0 ? Math.round(150 + (employeeCount * 2.5)) : 150,
      previousValue: employeeCount > 0 ? Math.round(160 + (employeeCount * 2.5)) : 160,
      unit: '$',
      trend: 'down',
      trendPercentage: 6.25,
      status: 'good',
      description: 'Average processing cost per employee per payroll cycle',
    },
    {
      id: 'accuracy-rate',
      title: 'Accuracy Rate',
      value: 98.5,
      previousValue: 97.2,
      unit: '%',
      trend: 'up',
      trendPercentage: 1.3,
      status: 'good',
      description: 'Percentage of payrolls processed without errors',
    },
    {
      id: 'time-to-complete',
      title: 'Avg. Completion Time',
      value: Math.max(2, 6 - (employeeCount * 0.1)),
      previousValue: Math.max(2.5, 6.5 - (employeeCount * 0.1)),
      unit: 'hours',
      trend: employeeCount > 20 ? 'down' : 'up',
      trendPercentage: 8.3,
      status: employeeCount > 50 ? 'warning' : 'good',
      description: 'Average time from initiation to completion',
      recommendation: employeeCount > 50 ? 'Consider workflow automation for large payrolls' : undefined,
    },
  ];
}

// Helper function to generate insights
function generateInsights(payroll: any, metrics: AnalyticsMetric[]): Insight[] {
  const insights: Insight[] = [];
  const employeeCount = payroll.employeeCount || 0;
  const processingDays = payroll.processingDaysBeforeEft || 0;

  // Processing efficiency insights
  if (processingDays > 5) {
    insights.push({
      id: 'processing-optimization',
      type: 'optimization',
      title: 'Optimize Processing Timeline',
      description: `Current ${processingDays}-day processing window could be reduced to improve cash flow and reduce administrative overhead.`,
      impact: 'high',
      actionable: true,
      action: 'Review and streamline processing steps',
    });
  }

  // Scale efficiency insights
  if (employeeCount > 100) {
    insights.push({
      id: 'scale-efficiency',
      type: 'achievement',
      title: 'Scale Efficiency Achievement',
      description: `Processing ${employeeCount} employees efficiently. Consider implementing advanced automation tools.`,
      impact: 'medium',
      actionable: true,
      action: 'Explore automation opportunities',
    });
  } else if (employeeCount > 50) {
    insights.push({
      id: 'scaling-recommendation',
      type: 'recommendation',
      title: 'Prepare for Scale',
      description: `With ${employeeCount} employees, consider preparing scalability measures for future growth.`,
      impact: 'medium',
      actionable: true,
      action: 'Plan scalability improvements',
    });
  }

  // Team assignment insights
  if (!payroll.primaryConsultant || !payroll.backupConsultant) {
    insights.push({
      id: 'assignment-warning',
      type: 'warning',
      title: 'Incomplete Team Assignment',
      description: 'Missing team assignments could create processing bottlenecks and compliance risks.',
      impact: 'high',
      actionable: true,
      action: 'Complete team assignments',
    });
  }

  // Client activity insights
  if (payroll.client?.active) {
    insights.push({
      id: 'client-health',
      type: 'achievement',
      title: 'Active Client Relationship',
      description: `Strong ongoing relationship with ${payroll.client.name}. Consider opportunities for service expansion.`,
      impact: 'medium',
      actionable: true,
      action: 'Review service expansion opportunities',
    });
  }

  return insights;
}

// Helper function to get trend icon and styling
function getTrendDisplay(trend: string, percentage?: number) {
  const isPositive = trend === 'up';
  const IconComponent = isPositive ? ArrowUpRight : ArrowDownRight;
  const colorClass = isPositive ? 'text-green-600' : 'text-red-600';
  const bgColorClass = isPositive ? 'bg-green-50' : 'bg-red-50';

  return {
    icon: IconComponent,
    colorClass,
    bgColorClass,
    percentage,
  };
}

// Helper function to get status styling
function getStatusStyling(status: string) {
  const styles = {
    good: 'border-green-200 bg-green-50 text-green-800',
    warning: 'border-amber-200 bg-amber-50 text-amber-800',
    critical: 'border-red-200 bg-red-50 text-red-800',
  };

  return styles[status as keyof typeof styles] || styles.good;
}

// Helper function to get insight styling
function getInsightStyling(type: string) {
  const styles = {
    optimization: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    warning: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
    achievement: { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
    recommendation: { color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  };

  return styles[type as keyof typeof styles] || styles.recommendation;
}

// Helper function to get insight icon
function getInsightIcon(type: string) {
  const icons = {
    optimization: TrendingUp,
    warning: AlertTriangle,
    achievement: Award,
    recommendation: Lightbulb,
  };

  return icons[type as keyof typeof icons] || Lightbulb;
}

// Metric card component
function MetricCard({ metric }: { metric: AnalyticsMetric }) {
  const trend = getTrendDisplay(metric.trend, metric.trendPercentage);
  const TrendIcon = trend.icon;

  return (
    <Card className={cn('hover:shadow-md transition-shadow', getStatusStyling(metric.status))}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">{metric.title}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {metric.unit === '$' && '$'}{metric.value.toLocaleString()}{metric.unit !== '$' && metric.unit}
              </span>
              {metric.trendPercentage && (
                <div className={cn('flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium', trend.bgColorClass)}>
                  <TrendIcon className={cn('w-3 h-3', trend.colorClass)} />
                  <span className={trend.colorClass}>
                    {metric.trendPercentage.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <Badge variant={metric.status === 'good' ? 'default' : 'destructive'} className="text-xs">
              {metric.status}
            </Badge>
          </div>
        </div>

        <p className="text-xs text-gray-600 mb-3">{metric.description}</p>

        {metric.previousValue && (
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Previous: {metric.unit === '$' && '$'}{metric.previousValue.toLocaleString()}{metric.unit !== '$' && metric.unit}</span>
            <span className={cn('font-medium', trend.colorClass)}>
              {metric.trend === 'up' ? '+' : '-'}{Math.abs(metric.value - metric.previousValue).toFixed(1)}
            </span>
          </div>
        )}

        {metric.recommendation && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-xs text-gray-600">{metric.recommendation}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Insight card component
function InsightCard({ insight }: { insight: Insight }) {
  const styling = getInsightStyling(insight.type);
  const IconComponent = getInsightIcon(insight.type);

  return (
    <Card className={cn('hover:shadow-sm transition-shadow', styling.bg, styling.border)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0', styling.bg)}>
            <IconComponent className={cn('w-4 h-4', styling.color)} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className={cn('font-semibold text-sm', styling.color)}>{insight.title}</h3>
              <Badge variant="outline" className="text-xs">
                {insight.impact} impact
              </Badge>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
            
            {insight.actionable && insight.action && (
              <Button variant="ghost" size="sm" className={cn('text-xs h-7 px-2', styling.color)}>
                {insight.action} →
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PayrollAnalyticsComponent({ data, loading = false }: PayrollAnalyticsProps) {
  const metrics = useMemo(() => {
    if (!data?.payroll) return [];
    return generateAnalyticsData(data.payroll);
  }, [data?.payroll]);

  const insights = useMemo(() => {
    if (!data?.payroll) return [];
    return generateInsights(data.payroll, metrics);
  }, [data?.payroll, metrics]);

  const overallScore = useMemo(() => {
    if (metrics.length === 0) return 0;
    const totalScore = metrics.reduce((acc, metric) => {
      const score = metric.status === 'good' ? 100 : metric.status === 'warning' ? 70 : 40;
      return acc + score;
    }, 0);
    return Math.round(totalScore / metrics.length);
  }, [metrics]);

  if (loading || !data) {
    return <PayrollAnalyticsSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Performance Analytics
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Real-time insights and performance metrics for this payroll
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{overallScore}%</div>
              <p className="text-xs text-gray-600">Overall Score</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="mb-4">
            <Progress value={overallScore} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Poor</span>
              <span>Excellent</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      {/* Insights Section */}
      {insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              AI-Powered Insights
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Recommendations and insights based on payroll performance data
            </p>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.map((insight) => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
            </div>

            {insights.some(i => i.actionable) && (
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    {insights.filter(i => i.actionable).length} actionable recommendations available
                  </p>
                  <Button variant="outline" size="sm">
                    View Action Plan
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Benchmarking Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Industry Benchmarks
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            How your payroll performance compares to industry standards
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {/* Processing Time Benchmark */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="font-medium text-sm">Processing Time</p>
                <p className="text-xs text-gray-600">Your performance vs industry average</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {metrics.find(m => m.id === 'time-to-complete')?.value || 0}h
                  </p>
                  <p className="text-xs text-gray-500">You</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">4.2h</p>
                  <p className="text-xs text-gray-500">Industry</p>
                </div>
                <div className="w-16">
                  <Badge variant="outline" className="text-xs">
                    {((4.2 - (metrics.find(m => m.id === 'time-to-complete')?.value || 4.2)) / 4.2 * 100).toFixed(0)}% better
                  </Badge>
                </div>
              </div>
            </div>

            {/* Accuracy Rate Benchmark */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="font-medium text-sm">Accuracy Rate</p>
                <p className="text-xs text-gray-600">Error-free processing rate</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium">98.5%</p>
                  <p className="text-xs text-gray-500">You</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">96.2%</p>
                  <p className="text-xs text-gray-500">Industry</p>
                </div>
                <div className="w-16">
                  <Badge variant="outline" className="text-xs text-green-600">
                    +2.3%
                  </Badge>
                </div>
              </div>
            </div>

            {/* Cost Efficiency Benchmark */}
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-sm">Cost Per Employee</p>
                <p className="text-xs text-gray-600">Processing cost efficiency</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium">
                    ${metrics.find(m => m.id === 'cost-per-employee')?.value || 150}
                  </p>
                  <p className="text-xs text-gray-500">You</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">$185</p>
                  <p className="text-xs text-gray-500">Industry</p>
                </div>
                <div className="w-16">
                  <Badge variant="outline" className="text-xs text-green-600">
                    19% better
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Loading skeleton
function PayrollAnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Performance Overview Skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="h-6 bg-gray-200 rounded w-48 animate-pulse mb-2" />
              <div className="h-4 bg-gray-200 rounded w-64 animate-pulse" />
            </div>
            <div className="text-right">
              <div className="h-8 bg-gray-200 rounded w-16 animate-pulse mb-1" />
              <div className="h-3 bg-gray-200 rounded w-20 animate-pulse" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-2 bg-gray-200 rounded animate-pulse" />
        </CardContent>
      </Card>

      {/* Metrics Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                <div className="h-8 bg-gray-200 rounded w-20 animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-40 animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-28 animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Insights Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-40 animate-pulse mb-2" />
          <div className="h-4 bg-gray-200 rounded w-56 animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                      <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
                      <div className="h-3 bg-gray-200 rounded w-24 animate-pulse" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export const PayrollAnalytics = memo(PayrollAnalyticsComponent);
export default PayrollAnalytics;