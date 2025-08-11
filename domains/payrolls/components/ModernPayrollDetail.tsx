"use client";

import { useQuery, useMutation } from "@apollo/client";
import { useUser } from "@clerk/nextjs";
import {
  Building2,
  User,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Edit,
  Save,
  RefreshCw,
  Users,
  FileText,
  Upload,
  Eye,
  CalendarDays,
  UserCheck,
  Plus,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useMemo, Suspense } from "react";

// Modern UI Components
import { PermissionGuard, CanUpdate } from "@/components/auth/permission-guard";
import {
  ModernDataTable,
  type ColumnDef,
  type RowAction,
} from "@/components/data";
import { PageHeader } from "@/components/patterns/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SuccessStatus,
  WarningStatus,
  ErrorStatus,
  PendingStatus,
  InfoStatus,
} from "@/components/ui/status-indicator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

// Domain utilities
import { UpdatePayrollDateNotesDocument } from "@/domains/payrolls/graphql/generated/graphql";
import { usePayrollData } from "@/domains/payrolls/hooks/usePayrollData";
import { getEnhancedScheduleSummary } from "@/domains/payrolls/utils/schedule-helpers";
import { safeFormatDate } from "@/lib/utils/date-utils";

interface PayrollDetailProps {
  payrollId?: string;
  showActions?: boolean;
  embedded?: boolean;
}

// Modern status configuration using status indicators
const getPayrollStatus = (status: string) => {
  const configs = {
    draft: { component: WarningStatus, label: "Draft", icon: FileText },
    "data-entry": { component: InfoStatus, label: "Data Entry", icon: Edit },
    review: { component: PendingStatus, label: "Review", icon: Eye },
    processing: { component: InfoStatus, label: "Processing", icon: RefreshCw },
    "manager-review": {
      component: WarningStatus,
      label: "Manager Review",
      icon: UserCheck,
    },
    approved: {
      component: SuccessStatus,
      label: "Approved",
      icon: CheckCircle,
    },
    submitted: { component: SuccessStatus, label: "Submitted", icon: Upload },
    paid: { component: SuccessStatus, label: "Paid", icon: CheckCircle },
    "on-hold": {
      component: WarningStatus,
      label: "On Hold",
      icon: AlertTriangle,
    },
    cancelled: {
      component: ErrorStatus,
      label: "Cancelled",
      icon: AlertTriangle,
    },
  } as const;

  return configs[status as keyof typeof configs] || configs.draft;
};

// Payroll overview cards - modern design
function PayrollOverviewCards({
  payroll,
  payrollDates,
}: {
  payroll: any;
  payrollDates: any[];
}) {
  const scheduleInfo = useMemo(() => {
    if (!payroll?.payrollCycle?.name || !payroll?.payrollDateType?.name) {
      return null;
    }
    return getEnhancedScheduleSummary(payroll);
  }, [payroll]);

  const stats = useMemo(() => {
    const total = payrollDates.length;
    const completed = payrollDates.filter(d => d.completed).length;
    const upcoming = payrollDates.filter(
      d => !d.completed && new Date(d.adjustedEftDate) > new Date()
    ).length;

    return {
      total,
      completed,
      upcoming,
      pendingReview: total - completed - upcoming,
    };
  }, [payrollDates]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Pay Periods
              </p>
              <p className="text-2xl font-bold text-foreground">
                {stats.total}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Completed
              </p>
              <p className="text-2xl font-bold text-green-600">
                {stats.completed}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Upcoming
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {stats.upcoming}
              </p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Schedule Type
              </p>
              <p className="text-lg font-semibold text-foreground">
                {typeof scheduleInfo === "string"
                  ? scheduleInfo
                  : (scheduleInfo as any)?.displayName || "Custom"}
              </p>
            </div>
            <CalendarDays className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Payroll dates table using ModernDataTable
function PayrollDatesSection({ payrollDates }: { payrollDates: any[] }) {
  const columns: ColumnDef<any>[] = [
    {
      id: "originalDate",
      key: "originalEftDate",
      label: "Original Date",
      essential: true,
      render: (_, row) => (
        <div className="font-medium">
          {safeFormatDate(row.originalEftDate, "MMM dd, yyyy")}
        </div>
      ),
    },
    {
      id: "adjustedDate",
      key: "adjustedEftDate",
      label: "Adjusted Date",
      essential: true,
      render: (_, row) => {
        const isAdjusted = row.originalEftDate !== row.adjustedEftDate;
        return (
          <div
            className={`font-medium ${isAdjusted ? "text-orange-600" : "text-foreground"}`}
          >
            {safeFormatDate(row.adjustedEftDate, "MMM dd, yyyy")}
            {isAdjusted && (
              <Badge variant="outline" className="ml-2">
                Adjusted
              </Badge>
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
      render: (_, row) => (
        <div className="text-muted-foreground">
          {safeFormatDate(row.processingDate, "MMM dd, yyyy")}
        </div>
      ),
    },
    {
      id: "status",
      key: "completed",
      label: "Status",
      essential: true,
      render: (_, row) => {
        const completed = row.completed;
        const isPast = new Date(row.adjustedEftDate) < new Date();

        if (completed) {
          return <SuccessStatus>Completed</SuccessStatus>;
        } else if (isPast) {
          return <WarningStatus>Overdue</WarningStatus>;
        } else {
          return <PendingStatus>Pending</PendingStatus>;
        }
      },
    },
    {
      id: "notes",
      key: "notes",
      label: "Notes",
      essential: false,
      render: (_, row) => (
        <div className="max-w-xs truncate text-muted-foreground">
          {row.notes || "No notes"}
        </div>
      ),
    },
  ];

  const rowActions: RowAction<any>[] = [
    {
      id: "editNotes",
      label: "Edit Notes",
      icon: MessageCircle,
      onClick: () => {
        // TODO: Implement edit notes functionality
      },
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Payroll Dates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ModernDataTable
          data={payrollDates}
          columns={columns}
          rowActions={rowActions}
          searchPlaceholder="Search payroll dates..."
          emptyState={
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No payroll dates found</p>
            </div>
          }
        />
      </CardContent>
    </Card>
  );
}

// Main loading component
function PayrollDetailSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ModernPayrollDetail({
  payrollId: propPayrollId,
  showActions = true,
  embedded = false,
}: PayrollDetailProps) {
  const params = useParams();
  const payrollId = propPayrollId || (params?.id as string);

  // Real data fetching using modern hook
  const { data, loading, error, refetch } = usePayrollData(payrollId);
  const payroll = data?.payroll;
  const payrollDates = data?.payroll?.detailPayrollDates || [];

  if (loading) {
    return embedded ? (
      <PayrollDetailSkeleton />
    ) : (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PayrollDetailSkeleton />
      </div>
    );
  }

  if (error || !payroll) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Error Loading Payroll
            </h3>
            <p className="text-muted-foreground mb-4">
              {error?.message || "Payroll not found"}
            </p>
            <Button onClick={() => refetch?.()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusConfig = getPayrollStatus(payroll.status || "draft");
  const StatusComponent = statusConfig.component;

  const content = (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={`/api/avatar/${payroll.client?.name}`} />
            <AvatarFallback>
              <Building2 className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {payroll.name}
            </h1>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <Link
                  href={`/clients/${payroll.client?.id}`}
                  className="text-blue-600 hover:underline font-medium"
                >
                  {payroll.client?.name}
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <statusConfig.icon className="h-4 w-4 text-muted-foreground" />
                <StatusComponent>{statusConfig.label}</StatusComponent>
              </div>

              {payroll.employeeCount && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {payroll.employeeCount} employee
                    {payroll.employeeCount !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {showActions && (
          <div className="flex items-center gap-3">
            <PermissionGuard action="update">
              <Button variant="outline" asChild>
                <Link href={`/payrolls/${payrollId}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>
            </PermissionGuard>

            <Button onClick={() => refetch?.()} variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Overview Cards */}
      <PayrollOverviewCards payroll={payroll} payrollDates={payrollDates} />

      {/* Payroll Dates Table */}
      <PayrollDatesSection payrollDates={payrollDates} />

      {/* Staff Assignments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Staff Assignments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Primary Consultant */}
            <div>
              <Label className="text-sm font-medium">Primary Consultant</Label>
              <div className="mt-2 flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {payroll.primaryConsultant?.computedName || "Unassigned"}
                  </p>
                  <p className="text-xs text-muted-foreground">Primary</p>
                </div>
              </div>
            </div>

            {/* Backup Consultant */}
            <div>
              <Label className="text-sm font-medium">Backup Consultant</Label>
              <div className="mt-2 flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {payroll.backupConsultant?.computedName || "Unassigned"}
                  </p>
                  <p className="text-xs text-muted-foreground">Backup</p>
                </div>
              </div>
            </div>

            {/* Manager */}
            <div>
              <Label className="text-sm font-medium">Manager</Label>
              <div className="mt-2 flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    <UserCheck className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {payroll.assignedManager?.computedName || "Unassigned"}
                  </p>
                  <p className="text-xs text-muted-foreground">Manager</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return embedded ? (
    content
  ) : (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{content}</div>
  );
}

export default ModernPayrollDetail;
