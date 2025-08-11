"use client";

import {
  Calendar,
  Clock,
  Users,
  FileText,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Building2,
  Timer,
  BarChart3,
  Zap,
  Target,
  Sparkles,
} from "lucide-react";
import { memo, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
// Note: Using simple hover effects instead of complex tooltip system for now
import type { PayrollData } from "@/domains/payrolls/hooks/usePayrollData";
import { getScheduleSummary } from "@/domains/payrolls/utils/schedule-helpers";
import { cn } from "@/lib/utils";

export interface PayrollOverviewProps {
  data: PayrollData;
  loading?: boolean;
}

// Helper function to format date
function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "Not scheduled";

  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Helper function to format relative date
function formatRelativeDate(date: string | Date | null | undefined): string {
  if (!date) return "Not scheduled";

  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffTime = d.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
  if (diffDays < 0 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;

  return formatDate(d);
}

// Helper function to get processing status progress
function getProcessingProgress(status: string): number {
  const statusProgress = {
    Draft: 10,
    Implementation: 20,
    "Data Entry": 40,
    Review: 60,
    Processing: 80,
    "Manager Review": 90,
    Approved: 95,
    Active: 100,
    Completed: 100,
  };

  return statusProgress[status as keyof typeof statusProgress] || 0;
}

// Helper function to get status color
function getStatusColor(status: string): string {
  const statusColors = {
    Draft: "text-gray-600",
    Implementation: "text-blue-600",
    Active: "text-green-600",
    Inactive: "text-gray-500",
    "On Hold": "text-red-600",
    Completed: "text-green-700",
  };

  return statusColors[status as keyof typeof statusColors] || "text-gray-600";
}

// Enhanced metric card component with hover effects and animations
function EnhancedMetricCard({
  title,
  value,
  subtitle,
  icon: IconComponent,
  trend,
  trendValue,
  status = 'neutral',
  onClick,
  children,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  status?: 'good' | 'warning' | 'critical' | 'neutral';
  onClick?: () => void;
  children?: React.ReactNode;
}) {
  const statusStyles = {
    good: 'bg-green-50 border-green-200 hover:bg-green-100',
    warning: 'bg-amber-50 border-amber-200 hover:bg-amber-100',
    critical: 'bg-red-50 border-red-200 hover:bg-red-100',
    neutral: 'bg-white border-gray-200 hover:bg-gray-50',
  };

  const trendStyles = {
    up: 'text-green-600 bg-green-100',
    down: 'text-red-600 bg-red-100',
    stable: 'text-gray-600 bg-gray-100',
  };

  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]",
        statusStyles[status],
        onClick && "hover:border-blue-300"
      )}
      onClick={onClick}
    >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
            {title}
          </CardTitle>
          <div className="relative">
            <IconComponent className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 transition-colors" />
            {status === 'critical' && (
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
                  className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1',
                    trendStyles[trend]
                  )}
                  title="Trend from previous period"
                >
                  {trend === 'up' && <TrendingUp className="w-3 h-3" />}
                  {trend === 'down' && <Activity className="w-3 h-3 rotate-180" />}
                  {trend === 'stable' && <Activity className="w-3 h-3" />}
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

// Smart badge component with status-based styling
function SmartBadge({ 
  status, 
  children 
}: { 
  status: string; 
  children: React.ReactNode;
}) {
  const getVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'completed':
      case 'good':
        return 'default';
      case 'warning':
      case 'implementation':
      case 'draft':
        return 'secondary';
      case 'critical':
      case 'overdue':
      case 'inactive':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Badge variant={getVariant(status)} className="transition-colors hover:opacity-80">
      {children}
    </Badge>
  );
}

function PayrollOverviewComponent({
  data,
  loading = false,
}: PayrollOverviewProps) {
  if (loading || !data) {
    return <PayrollOverviewSkeleton />;
  }

  const { payroll } = data;

  // Calculate key metrics with smart analysis
  const metrics = useMemo(() => {
    const nextPayDate = payroll.detailPayrollDates?.find(date => {
      const dateToCheck = new Date(date.adjustedEftDate || date.originalEftDate);
      return dateToCheck >= new Date();
    });

    const processingProgress = getProcessingProgress(payroll.status || "Implementation");
    const scheduleInfo = getScheduleSummary(payroll);
    const employeeCount = payroll.employeeCount || 0;
    const fileCount = data.fileCount || 0;

    // Calculate health scores and trends (mock data - in production this would come from analytics)
    const statusHealth = payroll.status === 'Active' ? 'good' : 
                        payroll.status === 'Implementation' ? 'warning' : 'neutral';
    
    const employeeGrowth = employeeCount > 50 ? 'up' : employeeCount > 20 ? 'stable' : 'down';
    const fileHealth = fileCount > 5 ? 'good' : fileCount > 2 ? 'warning' : 'critical';
    
    return {
      nextPayDate,
      processingProgress,
      scheduleInfo,
      employeeCount,
      fileCount,
      statusHealth,
      employeeGrowth,
      fileHealth,
    };
  }, [payroll, data.fileCount]);

  // Upcoming dates for timeline (limited for overview)
  const upcomingDates = useMemo(() =>
    payroll.detailPayrollDates
      ?.filter(date => {
        const dateToCheck = new Date(
          date.adjustedEftDate || date.originalEftDate
        );
        return dateToCheck >= new Date();
      })
      .slice(0, 3) || []
  , [payroll.detailPayrollDates]);

  // Smart recommendations based on data
  const recommendations = useMemo(() => {
    const recs = [];
    if (!payroll.primaryConsultant) recs.push("Assign primary consultant");
    if (!payroll.backupConsultant) recs.push("Assign backup consultant");
    if (metrics.fileCount < 3) recs.push("Upload required documents");
    if (metrics.employeeCount === 0) recs.push("Add employees to payroll");
    return recs;
  }, [payroll, metrics]);

  return (
    <div className="space-y-6">
      {/* Quick Actions Bar */}
      {recommendations.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-1">Action Items</h3>
                <p className="text-sm text-blue-700 mb-3">
                  {recommendations.length} recommended action{recommendations.length !== 1 ? 's' : ''} to improve this payroll
                </p>
                <div className="flex flex-wrap gap-2">
                  {recommendations.slice(0, 3).map((rec, index) => (
                    <Button key={index} variant="outline" size="sm" className="text-xs">
                      {rec}
                    </Button>
                  ))}
                  {recommendations.length > 3 && (
                    <Button variant="ghost" size="sm" className="text-xs text-blue-600">
                      +{recommendations.length - 3} more
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status & Progress Card */}
        <EnhancedMetricCard
          title="Status & Progress"
          value={payroll.status || "Implementation"}
          subtitle={payroll.status === "Active" ? "Payroll is operational" : "Setup in progress"}
          icon={Activity}
          status={metrics.statusHealth as 'good' | 'warning' | 'critical' | 'neutral'}
          trend={metrics.processingProgress > 80 ? 'up' : 'stable'}
          trendValue={`${metrics.processingProgress}%`}
          onClick={() => console.log('Navigate to status details')}
        >
          <Progress value={metrics.processingProgress} className="h-2 mt-2" />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Setup</span>
            <span>Active</span>
          </div>
        </EnhancedMetricCard>

        {/* Next Pay Date Card */}
        <EnhancedMetricCard
          title="Next Pay Date"
          value={formatDate(metrics.nextPayDate?.adjustedEftDate || metrics.nextPayDate?.originalEftDate)}
          subtitle={formatRelativeDate(metrics.nextPayDate?.adjustedEftDate || metrics.nextPayDate?.originalEftDate)}
          icon={Calendar}
          status={metrics.nextPayDate ? 'good' : 'warning'}
          onClick={() => console.log('Navigate to schedule')}
        >
          {metrics.nextPayDate?.notes && (
            <div className="flex items-center gap-1 text-xs text-amber-600 mt-2">
              <AlertCircle className="h-3 w-3" />
              Holiday adjusted
            </div>
          )}
        </EnhancedMetricCard>

        {/* Employee Count Card */}
        <EnhancedMetricCard
          title="Team Size"
          value={metrics.employeeCount.toString()}
          subtitle={`${metrics.employeeCount === 1 ? "employee" : "employees"} on payroll`}
          icon={Users}
          trend={metrics.employeeGrowth as 'up' | 'down' | 'stable'}
          trendValue={metrics.employeeCount > 20 ? "Growing" : "Stable"}
          status={metrics.employeeCount > 0 ? 'good' : 'critical'}
          onClick={() => console.log('Navigate to employees')}
        >
          <div className="flex items-center gap-1 text-xs text-gray-600 mt-2">
            <Target className="h-3 w-3" />
            <span>
              {metrics.employeeCount > 50 ? 'Large payroll' : 
               metrics.employeeCount > 10 ? 'Medium payroll' : 'Small payroll'}
            </span>
          </div>
        </EnhancedMetricCard>

        {/* Files & Documents Card */}
        <EnhancedMetricCard
          title="Documents"
          value={metrics.fileCount.toString()}
          subtitle="files attached"
          icon={FileText}
          status={metrics.fileHealth as 'good' | 'warning' | 'critical' | 'neutral'}
          trend={metrics.fileCount > 3 ? 'up' : 'stable'}
          trendValue={metrics.fileCount > 5 ? "Complete" : "Needs files"}
          onClick={() => console.log('Navigate to documents')}
        >
          <div className="flex items-center gap-1 text-xs mt-2">
            <CheckCircle2 className={cn('h-3 w-3', 
              metrics.fileHealth === 'good' ? 'text-green-600' : 
              metrics.fileHealth === 'warning' ? 'text-amber-600' : 'text-red-600'
            )} />
            <span className="text-gray-600">
              {metrics.fileHealth === 'good' ? 'Complete documentation' :
               metrics.fileHealth === 'warning' ? 'Missing some files' : 'Needs documentation'}
            </span>
          </div>
        </EnhancedMetricCard>
      </div>

      {/* Enhanced Information Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Information Card */}
        <Card className="group hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              Client Information
            </CardTitle>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <BarChart3 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {payroll.client?.name || "No client assigned"}
                </h3>
                {payroll.client?.contactEmail && (
                  <p className="text-sm text-gray-600 mb-1">
                    📧 {payroll.client.contactEmail}
                  </p>
                )}
                {payroll.client?.contactPerson && (
                  <p className="text-sm text-gray-600 mb-3">
                    👤 {payroll.client.contactPerson}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <SmartBadge status={payroll.client?.active ? "active" : "inactive"}>
                  {payroll.client?.active ? "Active Client" : "Inactive Client"}
                </SmartBadge>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Relationship</div>
                  <div className="text-sm font-medium">
                    {payroll.client?.active ? '🟢 Strong' : '🔴 At Risk'}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Information Card */}
        <Card className="group hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-600" />
              Processing Schedule
            </CardTitle>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Zap className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-1">
                  {metrics.scheduleInfo}
                </h3>
                <p className="text-sm text-gray-600">
                  {payroll.payrollCycle?.description || "Standard payroll cycle"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Timer className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Lead Time</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {payroll.processingDaysBeforeEft || 0} days
                  </div>
                </div>

                {payroll.processingTime && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Processing</span>
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {payroll.processingTime}h
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Dates Preview */}
      {upcomingDates.length > 0 && (
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                Upcoming Pay Dates
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Next {upcomingDates.length} scheduled payments
              </p>
            </div>
            <Button variant="outline" size="sm">
              View Timeline →
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {upcomingDates.map((date, index) => (
                <div
                  key={date.id}
                  className="group relative bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 rounded-xl p-4 transition-all duration-200 hover:shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 mb-1">
                        {formatDate(date.adjustedEftDate || date.originalEftDate)}
                      </p>
                      <p className="text-xs text-gray-500 mb-2">
                        Processing: {formatDate(date.processingDate)}
                      </p>
                      <div className="text-xs font-medium text-blue-600">
                        {formatRelativeDate(date.adjustedEftDate || date.originalEftDate)}
                      </div>
                      {date.notes && (
                        <div className="flex items-center gap-1 text-xs text-amber-600 mt-2">
                          <AlertCircle className="h-3 w-3" />
                          <span className="truncate">{date.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Progress indicator */}
                  <div className="absolute bottom-2 left-4 right-4">
                    <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${Math.max(10, 100 - (index * 30))}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {upcomingDates.length >= 3 && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-center">
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                    View Complete Timeline →
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Loading skeleton component
function PayrollOverviewSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Four main metric cards */}
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-20 animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-24 animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Two wide cards */}
      {Array.from({ length: 2 }).map((_, i) => (
        <Card key={`wide-${i}`} className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-28 animate-pulse" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export const PayrollOverview = memo(PayrollOverviewComponent);
export default PayrollOverview;
