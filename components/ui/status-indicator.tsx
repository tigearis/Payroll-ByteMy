"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Info, 
  Clock,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";
import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusIndicatorVariants = cva(
  "inline-flex items-center gap-2 text-sm font-medium",
  {
    variants: {
      variant: {
        success: "text-success-700 dark:text-success-400",
        warning: "text-warning-700 dark:text-warning-400", 
        error: "text-error-700 dark:text-error-400",
        info: "text-info-700 dark:text-info-400",
        pending: "text-secondary-700 dark:text-secondary-400",
      },
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
      showIcon: {
        true: "",
        false: "",
      }
    },
    defaultVariants: {
      variant: "info",
      size: "md", 
      showIcon: true,
    }
  }
);

const statusIconMapping = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
  pending: Clock,
};

const statusBadgeVariants = {
  success: "bg-success-100 text-success-800 hover:bg-success-200 dark:bg-success-900/20 dark:text-success-300",
  warning: "bg-warning-100 text-warning-800 hover:bg-warning-200 dark:bg-warning-900/20 dark:text-warning-300",
  error: "bg-error-100 text-error-800 hover:bg-error-200 dark:bg-error-900/20 dark:text-error-300",
  info: "bg-info-100 text-info-800 hover:bg-info-200 dark:bg-info-900/20 dark:text-info-300",
  pending: "bg-secondary-100 text-secondary-800 hover:bg-secondary-200 dark:bg-secondary-900/20 dark:text-secondary-300",
};

export interface StatusIndicatorProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusIndicatorVariants> {
  children: ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: boolean;
  pulse?: boolean;
}

/**
 * StatusIndicator Component
 * 
 * Displays status information with consistent visual language
 * across success, warning, error, info, and pending states
 */
export function StatusIndicator({
  children,
  className,
  variant = "info",
  size = "md",
  showIcon = true,
  icon: CustomIcon,
  badge = false,
  pulse = false,
  ...props
}: StatusIndicatorProps) {
  const Icon = CustomIcon || statusIconMapping[variant!];
  
  const iconSize = size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4";

  if (badge) {
    return (
      <Badge
        variant="secondary"
        className={cn(statusBadgeVariants[variant!], className)}
        {...props}
      >
        {showIcon && Icon && (
          <Icon className={cn(iconSize, "mr-1.5", pulse && "animate-pulse")} />
        )}
        {children}
      </Badge>
    );
  }

  return (
    <div
      className={cn(statusIndicatorVariants({ variant, size }), className)}
      {...props}
    >
      {showIcon && Icon && (
        <Icon className={cn(iconSize, pulse && "animate-pulse")} />
      )}
      {children}
    </div>
  );
}

// Specific status components for common use cases
export function SuccessStatus({ children, ...props }: Omit<StatusIndicatorProps, 'variant'>) {
  return <StatusIndicator variant="success" {...props}>{children}</StatusIndicator>;
}

export function WarningStatus({ children, ...props }: Omit<StatusIndicatorProps, 'variant'>) {
  return <StatusIndicator variant="warning" {...props}>{children}</StatusIndicator>;
}

export function ErrorStatus({ children, ...props }: Omit<StatusIndicatorProps, 'variant'>) {
  return <StatusIndicator variant="error" {...props}>{children}</StatusIndicator>;
}

export function InfoStatus({ children, ...props }: Omit<StatusIndicatorProps, 'variant'>) {
  return <StatusIndicator variant="info" {...props}>{children}</StatusIndicator>;
}

export function PendingStatus({ children, ...props }: Omit<StatusIndicatorProps, 'variant'>) {
  return <StatusIndicator variant="pending" pulse {...props}>{children}</StatusIndicator>;
}

// System health indicator
export interface SystemHealthProps {
  status: 'operational' | 'degraded' | 'outage' | 'maintenance';
  message?: string;
  lastChecked?: Date;
  size?: 'sm' | 'md' | 'lg';
}

const healthStatusConfig = {
  operational: { variant: 'success' as const, label: 'Operational' },
  degraded: { variant: 'warning' as const, label: 'Degraded Performance' },
  outage: { variant: 'error' as const, label: 'Service Outage' },
  maintenance: { variant: 'pending' as const, label: 'Scheduled Maintenance' },
};

export function SystemHealth({ 
  status, 
  message, 
  lastChecked, 
  size = "md" 
}: SystemHealthProps) {
  const config = healthStatusConfig[status];
  
  return (
    <div className="space-y-1">
      <StatusIndicator 
        variant={config.variant}
        size={size}
        badge
        pulse={status === 'maintenance'}
      >
        {message || config.label}
      </StatusIndicator>
      {lastChecked && (
        <div className="text-xs text-neutral-500 dark:text-neutral-400">
          Last checked: {lastChecked.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}

// Connection status indicator
export interface ConnectionStatusProps {
  connected: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ConnectionStatus({ 
  connected, 
  label, 
  size = "sm" 
}: ConnectionStatusProps) {
  return (
    <StatusIndicator
      variant={connected ? "success" : "error"}
      size={size}
    >
      <div className={cn(
        "w-2 h-2 rounded-full",
        connected ? "bg-success-500" : "bg-error-500"
      )} />
      {label || (connected ? "Connected" : "Disconnected")}
    </StatusIndicator>
  );
}

// Progress status with trend
export interface ProgressStatusProps {
  value: number;
  target?: number;
  trend?: 'up' | 'down' | 'stable';
  label: string;
  format?: 'number' | 'percentage' | 'currency';
}

export function ProgressStatus({ 
  value, 
  target, 
  trend, 
  label,
  format = "number"
}: ProgressStatusProps) {
  const formatValue = (val: number) => {
    switch (format) {
      case 'percentage':
        return `${val}%`;
      case 'currency':
        return new Intl.NumberFormat('en-AU', { 
          style: 'currency', 
          currency: 'AUD' 
        }).format(val);
      default:
        return val.toLocaleString();
    }
  };

  const getStatusVariant = () => {
    if (!target) return 'info';
    const percentage = (value / target) * 100;
    if (percentage >= 100) return 'success';
    if (percentage >= 75) return 'warning';
    return 'error';
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  
  return (
    <div className="flex items-center justify-between">
      <StatusIndicator variant={getStatusVariant()} showIcon={false}>
        {label}: {formatValue(value)}
        {target && ` / ${formatValue(target)}`}
      </StatusIndicator>
      {trend && (
        <TrendIcon className={cn(
          "h-4 w-4",
          trend === 'up' && "text-success-600",
          trend === 'down' && "text-error-600", 
          trend === 'stable' && "text-neutral-500"
        )} />
      )}
    </div>
  );
}