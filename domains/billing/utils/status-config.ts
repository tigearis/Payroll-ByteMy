// Billing status configuration utilities
// Follows EXACT pattern from payroll detail page status configs

import {
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Upload,
  RefreshCw,
  Eye,
  UserCheck,
  AlertCircle,
  TrendingUp,
  Timer,
  Target,
} from "lucide-react";

// Billing item status configuration - matches existing status pattern
export const getBillingStatusConfig = (status: string) => {
  const configs = {
    draft: {
      color: "bg-muted text-muted-foreground border-border",
      icon: FileText,
      progress: 10,
    },
    pending: {
      color: "bg-warning-500/10 text-warning-600 border-warning-500/20",
      icon: Clock,
      progress: 50,
    },
    approved: {
      color: "bg-success-500/10 text-success-600 border-success-500/20",
      icon: CheckCircle,
      progress: 80,
    },
    rejected: {
      color: "bg-destructive/10 text-destructive border-destructive/20",
      icon: AlertTriangle,
      progress: 25,
    },
    invoiced: {
      color: "bg-primary/10 text-primary border-primary/20",
      icon: Upload,
      progress: 90,
    },
    paid: {
      color: "bg-success-500/10 text-success-600 border-success-500/20", 
      icon: CheckCircle,
      progress: 100,
    },
    "on-hold": {
      color: "bg-warning-500/10 text-warning-600 border-warning-500/20",
      icon: AlertTriangle,
      progress: 60,
    },
    processing: {
      color: "bg-primary/10 text-primary border-primary/20",
      icon: RefreshCw,
      progress: 70,
    },
    cancelled: {
      color: "bg-destructive/10 text-destructive border-destructive/20",
      icon: AlertTriangle,
      progress: 0,
    },
  } as const;

  return configs[status as keyof typeof configs] || configs["draft"];
};

// Invoice status configuration
export const getInvoiceStatusConfig = (status: string) => {
  const configs = {
    draft: {
      color: "bg-muted text-muted-foreground border-border",
      icon: FileText,
      progress: 10,
    },
    pending: {
      color: "bg-warning-500/10 text-warning-600 border-warning-500/20",
      icon: Clock,
      progress: 30,
    },
    approved: {
      color: "bg-primary/10 text-primary border-primary/20",
      icon: UserCheck,
      progress: 50,
    },
    sent: {
      color: "bg-primary/10 text-primary border-primary/20",
      icon: Upload,
      progress: 70,
    },
    "partially-paid": {
      color: "bg-warning-500/10 text-warning-600 border-warning-500/20",
      icon: DollarSign,
      progress: 85,
    },
    paid: {
      color: "bg-success-500/10 text-success-600 border-success-500/20",
      icon: CheckCircle,
      progress: 100,
    },
    overdue: {
      color: "bg-destructive/10 text-destructive border-destructive/20",
      icon: AlertCircle,
      progress: 75,
    },
    cancelled: {
      color: "bg-destructive/10 text-destructive border-destructive/20",
      icon: AlertTriangle,
      progress: 0,
    },
  } as const;

  return configs[status as keyof typeof configs] || configs["draft"];
};

// Billing metric status helpers - matches EnhancedMetricCard pattern
export const getBillingMetricStatus = (
  type: 'revenue' | 'outstanding' | 'efficiency' | 'profitability',
  value: number
): 'good' | 'warning' | 'critical' | 'neutral' => {
  switch (type) {
    case 'revenue':
      return value > 5000 ? 'good' : value > 1000 ? 'neutral' : 'warning';
    
    case 'outstanding':
      return value === 0 ? 'good' : value > 10000 ? 'critical' : 'warning';
    
    case 'efficiency':
      return value > 85 ? 'good' : value > 70 ? 'neutral' : 'warning';
    
    case 'profitability':
      return value > 30 ? 'good' : value > 15 ? 'neutral' : value >= 0 ? 'warning' : 'critical';
    
    default:
      return 'neutral';
  }
};

// Service billing category icons
export const getServiceCategoryIcon = (category: string) => {
  const icons = {
    payroll: Timer,
    compliance: CheckCircle,
    consulting: UserCheck,
    reporting: FileText,
    audit: Eye,
    setup: RefreshCw,
    training: Target,
    support: AlertCircle,
    default: FileText,
  };

  return icons[category as keyof typeof icons] || icons.default;
};

// Billing priority configuration
export const getBillingPriorityConfig = (priority: string) => {
  const configs = {
    low: {
      color: "text-success-600",
      bgColor: "bg-success-50",
      label: "Low Priority",
    },
    medium: {
      color: "text-warning-600", 
      bgColor: "bg-warning-50",
      label: "Medium Priority",
    },
    high: {
      color: "text-destructive",
      bgColor: "bg-red-50",
      label: "High Priority",
    },
    urgent: {
      color: "text-destructive",
      bgColor: "bg-red-100",
      label: "Urgent",
    },
  } as const;

  return configs[priority as keyof typeof configs] || configs["medium"];
};

// Billing trend helpers for metric cards
export const getBillingTrend = (
  current: number,
  previous: number
): { trend: 'up' | 'down' | 'stable'; value: string } => {
  if (previous === 0) {
    return { trend: 'stable', value: 'No data' };
  }

  const change = ((current - previous) / previous) * 100;
  const absChange = Math.abs(change);

  if (absChange < 2) {
    return { trend: 'stable', value: 'Stable' };
  }

  return {
    trend: change > 0 ? 'up' : 'down',
    value: `${absChange.toFixed(1)}%`,
  };
};

// Currency formatting utility
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount || 0);
};

// Hours formatting utility
export const formatHours = (hours: number): string => {
  if (hours === 0) return "0h";
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  if (hours % 1 === 0) return `${hours}h`;
  
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours % 1) * 60);
  
  if (minutes === 0) return `${wholeHours}h`;
  return `${wholeHours}h ${minutes}m`;
};

// Percentage formatting utility  
export const formatPercentage = (value: number): string => {
  return `${Math.round(value || 0)}%`;
};