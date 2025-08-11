"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  ArrowUp,
  ArrowDown,
  Target,
  Calendar,
  DollarSign,
  Users,
  Activity
} from "lucide-react";
import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const metricsVariants = cva("", {
  variants: {
    variant: {
      "large-number": "text-center",
      trend: "flex items-center justify-between",
      comparison: "grid grid-cols-2 gap-4",
      gauge: "space-y-3",
    },
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
    }
  },
  defaultVariants: {
    variant: "large-number",
    size: "md"
  }
});

interface BaseMetricsProps {
  label: string;
  value: number | string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

// Large Number Display
interface LargeNumberProps extends BaseMetricsProps {
  subtitle?: string;
  format?: 'number' | 'currency' | 'percentage';
  prefix?: string;
  suffix?: string;
  highlight?: boolean;
}

export function LargeNumberDisplay({
  label,
  value,
  subtitle,
  format = 'number',
  prefix,
  suffix,
  icon: Icon,
  highlight = false,
  className
}: LargeNumberProps) {
  const formatValue = (val: number | string) => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-AU', { 
          style: 'currency', 
          currency: 'AUD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(val);
      case 'percentage':
        return `${val}%`;
      default:
        return val.toLocaleString();
    }
  };

  return (
    <div className={cn("text-center space-y-2", className)}>
      {Icon && (
        <div className={cn(
          "mx-auto w-fit p-2 rounded-lg",
          highlight ? "bg-primary-100 text-primary-600" : "bg-neutral-100 text-neutral-600"
        )}>
          <Icon className="h-5 w-5" />
        </div>
      )}
      <div className="space-y-1">
        <div className={cn(
          "font-bold",
          highlight ? "text-primary-900 dark:text-primary-100" : "text-neutral-900 dark:text-neutral-100",
          "text-2xl sm:text-3xl"
        )}>
          {prefix}{formatValue(value)}{suffix}
        </div>
        <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
          {label}
        </div>
        {subtitle && (
          <div className="text-xs text-neutral-600 dark:text-neutral-400">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}

// Trend Display with Change Indicators
interface TrendDisplayProps extends BaseMetricsProps {
  previousValue: number;
  period: string;
  format?: 'number' | 'currency' | 'percentage';
  showPercentageChange?: boolean;
}

export function TrendDisplay({
  label,
  value,
  previousValue,
  period,
  format = 'number',
  showPercentageChange = true,
  icon: Icon,
  className
}: TrendDisplayProps) {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const change = numValue - previousValue;
  const percentageChange = previousValue !== 0 ? (change / previousValue) * 100 : 0;
  const isPositive = change > 0;
  const isNeutral = change === 0;

  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-AU', { 
          style: 'currency', 
          currency: 'AUD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(val);
      case 'percentage':
        return `${val}%`;
      default:
        return val.toLocaleString();
    }
  };

  const TrendIcon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;
  
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="p-2 rounded-lg bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {formatValue(numValue)}
          </div>
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            {label}
          </div>
        </div>
      </div>
      
      <div className="text-right">
        <div className={cn(
          "flex items-center gap-1 text-sm font-medium",
          isPositive && "text-success-600",
          !isPositive && !isNeutral && "text-error-600",
          isNeutral && "text-neutral-500"
        )}>
          <TrendIcon className="h-3 w-3" />
          {showPercentageChange ? 
            `${Math.abs(percentageChange).toFixed(1)}%` : 
            formatValue(Math.abs(change))
          }
        </div>
        <div className="text-xs text-neutral-500 dark:text-neutral-400">
          vs {period}
        </div>
      </div>
    </div>
  );
}

// Comparison Display for Multiple Values
interface ComparisonDisplayProps {
  items: Array<{
    label: string;
    value: number | string;
    subtitle?: string;
    format?: 'number' | 'currency' | 'percentage';
    highlight?: boolean;
  }>;
  className?: string;
}

export function ComparisonDisplay({ items, className }: ComparisonDisplayProps) {
  const formatValue = (val: number | string, format: string = 'number') => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-AU', { 
          style: 'currency', 
          currency: 'AUD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(val);
      case 'percentage':
        return `${val}%`;
      default:
        return val.toLocaleString();
    }
  };

  return (
    <div className={cn("grid gap-4", 
      items.length === 2 ? "grid-cols-2" : 
      items.length === 3 ? "grid-cols-3" :
      "grid-cols-2 sm:grid-cols-4", 
      className
    )}>
      {items.map((item, index) => (
        <div 
          key={index}
          className={cn(
            "text-center p-3 rounded-lg border",
            item.highlight ? "bg-primary-50 border-primary-200 dark:bg-primary-950/20 dark:border-primary-800" : "bg-neutral-50 border-neutral-200 dark:bg-neutral-900 dark:border-neutral-700"
          )}
        >
          <div className={cn(
            "text-lg font-semibold",
            item.highlight ? "text-primary-900 dark:text-primary-100" : "text-neutral-900 dark:text-neutral-100"
          )}>
            {formatValue(item.value, item.format)}
          </div>
          <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {item.label}
          </div>
          {item.subtitle && (
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {item.subtitle}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Gauge Display with Progress Indicator
interface GaugeDisplayProps extends BaseMetricsProps {
  target: number;
  format?: 'number' | 'currency' | 'percentage';
  size?: 'sm' | 'md' | 'lg';
  showTarget?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'error';
}

export function GaugeDisplay({
  label,
  value,
  target,
  format = 'number',
  size = 'md',
  showTarget = true,
  color,
  icon: Icon,
  className
}: GaugeDisplayProps) {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const percentage = Math.min((numValue / target) * 100, 100);
  
  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-AU', { 
          style: 'currency', 
          currency: 'AUD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(val);
      case 'percentage':
        return `${val}%`;
      default:
        return val.toLocaleString();
    }
  };

  const getProgressColor = () => {
    if (color) return color;
    if (percentage >= 100) return 'success';
    if (percentage >= 75) return 'primary';
    if (percentage >= 50) return 'warning'; 
    return 'error';
  };

  const progressColor = getProgressColor();
  
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />}
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            {label}
          </span>
        </div>
        <Badge variant="outline" className="text-xs">
          {percentage.toFixed(1)}%
        </Badge>
      </div>
      
      <Progress 
        value={percentage} 
        className={cn(
          size === 'sm' && "h-2",
          size === 'lg' && "h-4"
        )}
      />
      
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-neutral-900 dark:text-neutral-100">
          {formatValue(numValue)}
        </span>
        {showTarget && (
          <span className="text-neutral-600 dark:text-neutral-400">
            of {formatValue(target)}
          </span>
        )}
      </div>
    </div>
  );
}

// Composite Metrics Card
interface MetricsCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function MetricsCard({
  title,
  description, 
  children,
  actions,
  className
}: MetricsCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className={cn("pb-3", actions && "pb-2")}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-medium">{title}</CardTitle>
            {description && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                {description}
              </p>
            )}
          </div>
          {actions && <div>{actions}</div>}
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}