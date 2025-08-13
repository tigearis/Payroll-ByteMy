"use client";

// Optimized icon imports - only what we actually use
import {
  AlertTriangle,
  RefreshCw,
  Edit,
  Calendar,
  Users,
  FileText,
  Clock,
  CheckCircle,
  Building2,
  UserCheck,
  Upload,
  Eye,
  Mail,
  Settings,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  Target,
  Timer,
  Receipt,
  FileBarChart,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useMemo, Suspense } from "react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import {
  ModernDataTable,
  type ColumnDef,
  type RowAction,
} from "@/components/data";
import { DocumentList } from "@/components/documents";
import { PageHeader } from "@/components/patterns/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmailComposeDialog } from "@/components/ui/email-compose-dialog";
import { ExportDataDialog } from "@/components/ui/export-data-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DynamicPayrollCompletionForm } from "@/domains/billing/components/payroll-completion/dynamic-payroll-completion-form";
import { PayrollBillingItemsTable } from "@/domains/billing/components/payroll-integration/payroll-billing-items-table";
import { PayrollBillingOverview } from "@/domains/billing/components/payroll-integration/payroll-billing-overview";
import { NotesListWithAdd } from "@/domains/notes/components/notes-list";

// Payroll components for notes and completion
import { NotesListModal } from "@/domains/payrolls/components/notes-list-modal";

// Domain imports
import { PayrollAssignments } from "@/domains/payrolls/components/PayrollAssignments";
import { PayrollErrorBoundary } from "@/domains/payrolls/components/PayrollErrorBoundary";

// Billing components

// Modern Data Table
import { usePayrollData } from "@/domains/payrolls/hooks/usePayrollData";
import { getEnhancedScheduleSummary } from "@/domains/payrolls/utils/schedule-helpers";

// Utility imports
import { safeFormatDate } from "@/lib/utils/date-utils";

// Status configuration for payroll statuses
const getStatusConfig = (status: string) => {
  const configs = {
    Implementation: {
      color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      icon: Settings,
      progress: 0,
    },
    draft: {
      color: "bg-warning-500/10 text-warning-600 border-warning-500/20",
      icon: FileText,
      progress: 10,
    },
    "data-entry": {
      color: "bg-primary/10 text-primary border-primary/20",
      icon: Edit,
      progress: 30,
    },
    review: {
      color: "bg-accent text-accent-foreground border-border",
      icon: UserCheck,
      progress: 50,
    },
    processing: {
      color: "bg-primary/10 text-primary border-primary/20",
      icon: RefreshCw,
      progress: 70,
    },
    "manager-review": {
      color: "bg-warning-500/10 text-warning-600 border-warning-500/20",
      icon: UserCheck,
      progress: 85,
    },
    approved: {
      color: "bg-success-500/10 text-success-600 border-success-500/20",
      icon: CheckCircle,
      progress: 95,
    },
    submitted: {
      color: "bg-primary/10 text-primary border-primary/20",
      icon: Upload,
      progress: 100,
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
    cancelled: {
      color: "bg-destructive/10 text-destructive border-destructive/20",
      icon: AlertTriangle,
      progress: 0,
    },
  } as const;

  return configs[status as keyof typeof configs] || configs["Implementation"];
};

// Main loading component - Matching Clients Page Pattern
function PayrollDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header skeleton */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <Skeleton className="h-4 w-32" />
          </div>

          <div className="pb-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-4">
                  <Skeleton className="w-16 h-16 rounded-xl" />
                  <div className="flex-1 min-w-0">
                    <Skeleton className="h-8 w-64 mb-4" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-4 w-36" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-10" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Overview cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-4" />
                    </div>
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Other sections skeleton */}
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-64" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper functions from original PayrollOverview
function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "Not scheduled";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

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

// EnhancedMetricCard component - EXACT copy from PayrollOverview
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

// Overview cards component
function PayrollOverviewCards({ data }: { data: any }) {
  const payroll = data?.payroll;
  const payrollDates = data?.payroll?.detailPayrollDates || [];

  const scheduleInfo = useMemo(() => {
    if (!payroll?.payrollCycle?.name || !payroll?.payrollDateType?.name) {
      return null;
    }
    return getEnhancedScheduleSummary(payroll);
  }, [payroll]);

  // Get next EFT date - exactly as in original
  const nextPayDate = useMemo(() => {
    const today = new Date();
    const upcomingDates = payrollDates
      .filter((d: any) => {
        const eftDate = new Date(d.adjustedEftDate || d.originalEftDate);
        return eftDate >= today && !d.completed;
      })
      .sort((a: any, b: any) => {
        const dateA = new Date(a.adjustedEftDate || a.originalEftDate);
        const dateB = new Date(b.adjustedEftDate || b.originalEftDate);
        return dateA.getTime() - dateB.getTime();
      });

    return upcomingDates[0] ? upcomingDates[0] : null;
  }, [payrollDates]);

  if (!payroll) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* EXACT Next Pay Date from original PayrollOverview */}
      <EnhancedMetricCard
        title="Next Pay Date"
        value={formatDate(
          nextPayDate?.adjustedEftDate || nextPayDate?.originalEftDate
        )}
        subtitle={formatRelativeDate(
          nextPayDate?.adjustedEftDate || nextPayDate?.originalEftDate
        )}
        icon={Calendar}
        status={nextPayDate ? "good" : "warning"}
        onClick={() => (window.location.href = "/payroll-schedule")}
      >
        {nextPayDate?.notes && (
          <div className="flex items-center gap-1 text-xs text-amber-600 mt-2">
            <AlertCircle className="h-3 w-3" />
            Holiday adjusted
          </div>
        )}
      </EnhancedMetricCard>

      {/* Processing Schedule - Enhanced style */}
      <EnhancedMetricCard
        title="Processing Schedule"
        value={
          typeof scheduleInfo === "string"
            ? scheduleInfo.split(" ")[0]
            : "Custom"
        }
        subtitle={
          typeof scheduleInfo === "string" ? scheduleInfo : "Custom schedule"
        }
        icon={Clock}
        status="good"
        onClick={() => (window.location.href = "/payroll-schedule")}
      >
        <div className="flex items-center gap-1 text-xs text-gray-600 mt-2">
          <RefreshCw className="h-3 w-3" />
          <span>Automated processing</span>
        </div>
      </EnhancedMetricCard>

      {/* EXACT Team Size from original PayrollOverview */}
      <EnhancedMetricCard
        title="Employees"
        value={(payroll.employeeCount || 0).toString()}
        subtitle={`${payroll.employeeCount === 1 ? "employee" : "employees"} on payroll`}
        icon={Users}
        trend={payroll.employeeCount > 20 ? "up" : "stable"}
        trendValue={payroll.employeeCount > 20 ? "Growing" : "Stable"}
        status={payroll.employeeCount > 0 ? "good" : "critical"}
        onClick={() => (window.location.href = "/staff")}
      >
        <div className="flex items-center gap-1 text-xs text-gray-600 mt-2">
          <Target className="h-3 w-3" />
          <span>
            {payroll.employeeCount > 50
              ? "Large payroll"
              : payroll.employeeCount > 10
                ? "Medium payroll"
                : "Small payroll"}
          </span>
        </div>
      </EnhancedMetricCard>

      {/* Lead Time - New enhanced card */}
      <EnhancedMetricCard
        title="Lead Time"
        value="1 days"
        subtitle="Processing"
        icon={Timer}
        status="good"
        onClick={() => (window.location.href = `/payrolls/${payroll.id}/edit`)}
      >
        <div className="flex items-center gap-1 text-xs text-gray-600 mt-2">
          <Clock className="h-3 w-3" />
          <span>1h processing time</span>
        </div>
      </EnhancedMetricCard>
    </div>
  );
}

// Modern PayrollDates component using ModernDataTable with Card wrapper (matching payrolls page pattern)
function ModernPayrollDatesTable({
  data,
  payrollId,
}: {
  data: any;
  payrollId: string;
}) {
  const [filterType, setFilterType] = useState<"all" | "upcoming" | "past">(
    "upcoming"
  );
  const [showAdvancedCompletion, setShowAdvancedCompletion] = useState(false);
  const [selectedPayrollDateId, setSelectedPayrollDateId] = useState<
    string | null
  >(null);

  const payrollDates = data?.payroll?.detailPayrollDates || [];

  // Filter dates based on selected type
  const filteredDates = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (filterType) {
      case "upcoming":
        return payrollDates.filter((d: any) => {
          const eftDate = new Date(d.adjustedEftDate || d.originalEftDate);
          return eftDate >= today;
        });
      case "past":
        return payrollDates.filter((d: any) => {
          const eftDate = new Date(d.adjustedEftDate || d.originalEftDate);
          return eftDate < today;
        });
      default:
        return payrollDates;
    }
  }, [payrollDates, filterType]);

  const columns: ColumnDef<any>[] = [
    {
      id: "eftDate",
      key: "adjustedEftDate",
      label: "EFT Date",
      essential: true,
      sortable: true,
      render: (_, row) => {
        // Follow ModernPayrollsManager pattern: adjustedEftDate || originalEftDate
        const eftDate = row.adjustedEftDate || row.originalEftDate;
        const isAdjusted = row.originalEftDate !== row.adjustedEftDate;

        return (
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="font-medium text-neutral-900 dark:text-neutral-100">
                {safeFormatDate(eftDate, "dd MMM yyyy")}
              </div>
              <NotesListModal
                payrollDateId={row.id}
                existingNotes={row.notes ?? null}
                {...((row.adjustedEftDate || row.originalEftDate) && {
                  payrollDate: row.adjustedEftDate || row.originalEftDate,
                })}
                refetchNotes={() => {
                  // TODO: Add refetch functionality
                  // Trigger a synthetic event others can listen to
                  window.dispatchEvent(new CustomEvent("payroll:notes:refetch", { detail: { payrollId } }));
                }}
              />
            </div>
            {isAdjusted && (
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Adjusted from{" "}
                {safeFormatDate(row.originalEftDate, "dd MMM yyyy")}
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: "processingDate",
      key: "processingDate",
      label: "Processing Date",
      essential: true,
      sortable: true,
      render: date => (
        <div className="text-neutral-500 dark:text-neutral-400">
          {safeFormatDate(date, "dd MMM yyyy")}
        </div>
      ),
    },
    {
      id: "status",
      key: "completed",
      label: "Status",
      essential: true,
      sortable: true,
      render: (completed, row) => {
        const eftDate = row.adjustedEftDate || row.originalEftDate;
        const today = new Date();
        const dateObj = new Date(eftDate);
        const isToday = dateObj.toDateString() === today.toDateString();
        const isPast = dateObj < today && !isToday;

        if (completed) {
          return (
            <Badge
              variant="default"
              className="bg-green-100 text-green-800 border-green-200"
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Completed
            </Badge>
          );
        } else if (isToday) {
          return (
            <Badge
              variant="default"
              className="bg-blue-100 text-blue-800 border-blue-200"
            >
              <Clock className="h-3 w-3 mr-1" />
              Today
            </Badge>
          );
        } else if (isPast) {
          return (
            <Badge variant="destructive">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Overdue
            </Badge>
          );
        } else {
          return (
            <Badge
              variant="secondary"
              className="bg-neutral-100 text-neutral-600 border-neutral-200"
            >
              <Clock className="h-3 w-3 mr-1" />
              Upcoming
            </Badge>
          );
        }
      },
    },
  ];

  // Completion handlers
  const openAdvancedCompletion = (payrollDateId: string) => {
    setSelectedPayrollDateId(payrollDateId);
    setShowAdvancedCompletion(true);
  };

  const handleAdvancedCompletionComplete = (data: any) => {
    console.log("Payroll completion finished:", data);
    setShowAdvancedCompletion(false);
    setSelectedPayrollDateId(null);
    // TODO: Refetch data to update the table
  };

  const handleAdvancedCompletionCancel = () => {
    setShowAdvancedCompletion(false);
    setSelectedPayrollDateId(null);
  };

  const rowActions: RowAction<any>[] = [
    {
      id: "complete",
      label: "Complete Payroll",
      icon: CheckCircle,
      onClick: (row: any) => {
        openAdvancedCompletion(row.id);
      },
      variant: "default",
      // Only show for non-completed rows
      disabled: (row: any) => row.completed,
    },
    {
      id: "viewDetails",
      label: "View Details",
      icon: Eye,
      onClick: (row: any) => {
        console.log("View details for:", row);
      },
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
              <Calendar className="h-5 w-5 text-neutral-500" />
              Payroll Dates
            </CardTitle>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Scheduled EFT and processing dates with adjustment tracking
            </p>
          </div>

          {/* Filter buttons matching ModernPayrollsManager pattern */}
          <div className="flex items-center gap-2">
            <Button
              variant={filterType === "upcoming" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("upcoming")}
            >
              Upcoming
            </Button>
            <Button
              variant={filterType === "past" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("past")}
            >
              Past Dates
            </Button>
            <Button
              variant={filterType === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("all")}
            >
              All Dates
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ModernDataTable
          data={filteredDates}
          columns={columns}
          loading={false}
          searchable
          searchPlaceholder="Search payroll dates..."
          rowActions={rowActions}
          emptyState={
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                No payroll dates found
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                {filterType !== "all"
                  ? `No ${filterType} dates available for this payroll`
                  : "No payroll dates have been generated yet"}
              </p>
            </div>
          }
        />
      </CardContent>

      {/* Advanced Payroll Completion Form */}
      {showAdvancedCompletion && selectedPayrollDateId && (
        <Dialog
          open={showAdvancedCompletion}
          onOpenChange={setShowAdvancedCompletion}
        >
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>
                Complete Payroll Date - Advanced Service Billing
              </DialogTitle>
            </DialogHeader>
            <div className="max-h-[80vh] overflow-y-auto">
              <DynamicPayrollCompletionForm
                payrollDateId={selectedPayrollDateId}
                onComplete={handleAdvancedCompletionComplete}
                onCancel={handleAdvancedCompletionCancel}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}

// Main component - Using Modern PayrollDetail Component
export default function PayrollDetailPage() {
  const [showEmail, setShowEmail] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const params = useParams();
  const payrollId = params?.id as string;

  // State management
  const [activeTab, setActiveTab] = useState(() => {
    // Initialize from URL hash if available, default to "overview"
    if (typeof window !== "undefined") {
      const hash = window.location.hash.slice(1);
      return ["overview", "dates", "billing", "docs-notes"].includes(hash)
        ? hash
        : "overview";
    }
    return "overview";
  });

  const { data, loading, error, refetch } = usePayrollData(payrollId);

  if (loading) {
    return <PayrollDetailLoading />;
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <AlertTriangle className="w-12 h-12 mx-auto text-destructive" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Failed to Load Payroll
            </h1>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <Button onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const payroll = data?.payroll;

  if (!payroll) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-12 h-12 text-gray-400" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Payroll Not Found
            </h1>
            <p className="text-gray-600">
              The payroll you're looking for doesn't exist or you don't have
              permission to view it.
            </p>
          </div>

          <Button asChild>
            <Link href="/payrolls">← Back to Payrolls</Link>
          </Button>
        </div>
      </div>
    );
  }

  const scheduleInfo = getEnhancedScheduleSummary(payroll);

  return (
    <PayrollErrorBoundary>
      <PermissionGuard action="read">
        <div className="container mx-auto py-6 space-y-6">
          <PageHeader
            title={payroll?.name || "Payroll Details"}
            breadcrumbs={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Payrolls", href: "/payrolls" },
              { label: payroll?.name || "Payroll" },
            ]}
            status={{
              type:
                payroll?.status === "paid" || payroll?.status === "approved"
                  ? "success"
                  : payroll?.status === "cancelled" ||
                      payroll?.status === "on-hold"
                    ? "error"
                    : "warning",
              message:
                payroll?.status
                  ?.replace("-", " ")
                  .replace(/\b\w/g, (l: string) => l.toUpperCase()) || "Draft",
            }}
            actions={[
              {
                label: "Edit Payroll",
                icon: Edit,
                onClick: () =>
                  (window.location.href = `/payrolls/${payrollId}/edit`),
                primary: true,
              },
              {
                label: "Upload Document",
                icon: Upload,
                onClick: () =>
                  document
                    .getElementById("document-upload-button")
                    ?.dispatchEvent(new Event("click", { bubbles: true })),
              },
            ]}
            overflowActions={[
              {
                label: "Email Client",
                icon: Mail,
                onClick: () => setShowEmail(true),
              },
              {
                label: "Export Dates",
                onClick: () => setShowExport(true),
              },
              {
                label: "Generate Invoice",
                icon: Receipt,
                onClick: () => {
                  // Navigate to billing tab and trigger invoice generation
                  setActiveTab("billing");
                  console.log("Generate invoice for payroll:", payrollId);
                },
              },
              {
                label: "View Billing Report",
                icon: FileBarChart,
                onClick: () => {
                  // Navigate to billing tab
                  setActiveTab("billing");
                  console.log("View billing report for payroll:", payrollId);
                },
              },
            ]}
          />

          {/* Additional Header Info - Matching Clients Page Pattern */}
          <div className="bg-white border-b border-gray-200 -mt-6 pt-4 pb-4">
            <div className="container mx-auto">
              <div className="flex flex-col space-y-4">
                {/* Client and Schedule Info Row */}
                <div className="flex flex-wrap items-center justify-between">
                  <div className="flex flex-wrap items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Client:</span>
                      <Link
                        href={`/clients/${payroll.client?.id}`}
                        className="text-foreground font-medium"
                      >
                        {payroll.client?.name}
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Dates Row */}
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  {payroll.createdAt && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Created:</span>
                      <span className="text-foreground font-medium">
                        {safeFormatDate(payroll.createdAt)}
                      </span>
                    </div>
                  )}

                  {payroll.updatedAt && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Updated:</span>
                      <span className="text-foreground font-medium">
                        {safeFormatDate(payroll.updatedAt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Overview Cards - Using ModernPayrollDetail's cards */}
          <PayrollOverviewCards data={data} />

          {/* Main Content Tabs - Following Clients Pattern */}
          <Tabs
            value={activeTab}
            onValueChange={value => {
              setActiveTab(value);
              // Update URL hash
              if (typeof window !== "undefined") {
                window.location.hash = value;
              }
            }}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-4 bg-muted shadow-md rounded-lg">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-card data-[state=active]:text-foreground hover:bg-accent transition-all text-foreground"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="dates"
                className="data-[state=active]:bg-card data-[state=active]:text-foreground hover:bg-accent transition-all text-foreground"
              >
                Payroll Dates
              </TabsTrigger>
              <TabsTrigger
                value="billing"
                className="data-[state=active]:bg-card data-[state=active]:text-foreground hover:bg-accent transition-all text-foreground"
              >
                Billing & Revenue
              </TabsTrigger>
              <TabsTrigger
                value="docs-notes"
                className="data-[state=active]:bg-card data-[state=active]:text-foreground hover:bg-accent transition-all text-foreground"
              >
                Documents & Notes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Staff Assignments section */}
              <PayrollAssignments
                data={data}
                loading={loading}
                onUpdateAssignments={async assignments => {
                  // TODO: Implement assignment update mutation
                  console.log("Update assignments:", assignments);
                }}
              />
            </TabsContent>

            <TabsContent value="dates" className="space-y-6">
              {/* Use ModernDataTable with comprehensive filtering and notes */}
              <ModernPayrollDatesTable data={data} payrollId={payrollId} />
            </TabsContent>

            <TabsContent value="billing" className="space-y-6">
              {/* Billing Overview Cards */}
              <PayrollBillingOverview payrollId={payrollId} />

              {/* Billing Items Table */}
              <PayrollBillingItemsTable payrollId={payrollId} />
            </TabsContent>

            <TabsContent value="docs-notes" className="space-y-6">
              {/* Notes Section - First */}
              <NotesListWithAdd
                entityType="payroll"
                entityId={payrollId}
                title="Payroll Notes"
                description={`Notes and comments about ${payroll?.name}`}
              />

              {/* Documents Section - Without Card wrapper or header */}
              <Suspense fallback={<div>Loading documents...</div>}>
                <DocumentList payrollId={payrollId} showUploadButton={true} />
              </Suspense>
            </TabsContent>
          </Tabs>

          {/* Reusable dialogs */}
          <EmailComposeDialog
            open={showEmail}
            onOpenChange={setShowEmail}
            to={[payroll?.client?.contactEmail || ""].filter(Boolean)}
            subject={`Regarding payroll: ${payroll?.name}`}
            onSend={() => Promise.resolve()}
          />
          <ExportDataDialog
            open={showExport}
            onOpenChange={setShowExport}
            filename={`payroll-${payroll?.name || payrollId}-dates.csv`}
            onExport={() => {
              setShowExport(false);
              window.dispatchEvent(new CustomEvent("payroll-dates:export"));
            }}
          />
        </div>
      </PermissionGuard>
    </PayrollErrorBoundary>
  );
}
