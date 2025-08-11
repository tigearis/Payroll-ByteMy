"use client";

import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  AlertTriangle, 
  Activity,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Metric {
  label: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  format?: 'currency' | 'percentage' | 'number';
}

interface InsightCardData {
  id: string;
  type: 'revenue-trends' | 'upcoming-deadlines' | 'system-health' | 'recent-activity' | 'client-metrics' | 'billing-status';
  title: string;
  priority: 'high' | 'medium' | 'low';
  metrics?: Metric[];
  items?: Array<{
    label: string;
    value: string;
    status?: 'success' | 'warning' | 'error' | 'pending';
    href?: string;
  }>;
  actions?: Array<{
    label: string;
    href: string;
    variant?: 'default' | 'secondary';
  }>;
}

interface InsightsGridProps {
  insights: InsightCardData[];
  loading?: boolean;
}

function MetricDisplay({ metric }: { metric: Metric }) {
  const formatValue = (value: string | number, format?: string) => {
    if (format === 'currency' && typeof value === 'number') {
      return new Intl.NumberFormat('en-AU', { 
        style: 'currency', 
        currency: 'AUD' 
      }).format(value);
    }
    if (format === 'percentage' && typeof value === 'number') {
      return `${value}%`;
    }
    return value;
  };

  return (
    <div className="space-y-1">
      <div className="text-2xl font-bold text-foreground">
        {formatValue(metric.value, metric.format)}
      </div>
      <div className="text-sm text-muted-foreground">
        {metric.label}
      </div>
      {metric.change && (
        <div className="flex items-center gap-1">
          {metric.change.type === 'increase' ? (
            <TrendingUp className="h-3 w-3 text-green-600" />
          ) : (
            <TrendingDown className="h-3 w-3 text-error-600" />
          )}
          <span className={cn(
            "text-xs font-medium",
            metric.change.type === 'increase' ? "text-green-600" : "text-error-600"
          )}>
            {metric.change.value}% {metric.change.period}
          </span>
        </div>
      )}
    </div>
  );
}

const cardIcons = {
  'revenue-trends': DollarSign,
  'upcoming-deadlines': Calendar,
  'system-health': Activity,
  'recent-activity': Clock,
  'client-metrics': Users,
  'billing-status': BarChart3,
};

const statusColors = {
  success: "text-green-600 bg-green-100",
  warning: "text-warning-600 bg-warning-100", 
  error: "text-error-600 bg-error-100",
  pending: "text-muted-foreground bg-muted",
};

function InsightCard({ insight }: { insight: InsightCardData }) {
  const Icon = cardIcons[insight.type];
  
  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      insight.priority === 'high' && "ring-2 ring-warning-200 bg-warning-50/30"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" />
            <CardTitle className="text-base font-medium">
              {insight.title}
            </CardTitle>
          </div>
          {insight.priority === 'high' && (
            <Badge variant="outline" className="text-warning-700 border-warning-300">
              High Priority
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Metrics Display */}
        {insight.metrics && (
          <div className="grid gap-4">
            {insight.metrics.map((metric, index) => (
              <MetricDisplay key={index} metric={metric} />
            ))}
          </div>
        )}
        
        {/* Items List */}
        {insight.items && (
          <div className="space-y-2">
            {insight.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex-1">
                  {item.href ? (
                    <Link href={item.href} className="text-sm font-medium text-primary hover:underline">
                      {item.label}
                    </Link>
                  ) : (
                    <div className="text-sm font-medium text-foreground">
                      {item.label}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {item.status && (
                    <div className={cn("w-2 h-2 rounded-full", statusColors[item.status])} />
                  )}
                  <div className="text-sm text-muted-foreground">
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Actions */}
        {insight.actions && (
          <div className="flex gap-2 pt-2 border-t">
            {insight.actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || "secondary"}
                size="sm"
                asChild
                className="flex-1"
              >
                <Link href={action.href}>
                  {action.label}
                </Link>
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * InsightsGrid Component
 * 
 * Displays key business insights, metrics, and actionable information
 * in a responsive grid layout
 */
export function InsightsGrid({ insights, loading }: InsightsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="h-8 bg-muted rounded w-1/2"></div>
              <div className="h-3 bg-muted rounded w-full"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          No insights available
        </h3>
        <p className="text-muted-foreground">
          Insights will appear here as data becomes available.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Business Insights
        </h2>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/insights">
            View All
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>
    </div>
  );
}