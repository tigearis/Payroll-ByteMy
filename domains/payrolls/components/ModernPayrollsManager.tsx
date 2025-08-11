"use client";

import { addDays } from "date-fns";
import {
  FileText,
  Building2,
  User,
  CheckCircle,
  Calendar,
  Users,
  UserCheck,
  Eye,
  Edit,
  CalendarDays,
  Plus,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import {
  ModernDataTable,
  type ColumnDef,
  type RowAction,
} from "@/components/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  SuccessStatus,
  WarningStatus,
  ErrorStatus,
  PendingStatus,
  InfoStatus,
} from "@/components/ui/status-indicator";
import { getEnhancedScheduleSummary } from "@/domains/payrolls/utils/schedule-helpers";
import { calculatePayrollDates, safeFormatDate } from "@/lib/utils/date-utils";

// Payroll interface (compatible with PayrollListItem fragment)
interface Payroll {
  id: string;
  name: string;
  status?: string;
  employeeCount?: number;
  client?: {
    id: string;
    name: string;
    active?: boolean;
  };
  payrollCycle?: {
    id: string;
    name: string;
    description?: string;
  };
  payrollDateType?: {
    id: string;
    name: string;
    description?: string;
  };
  dateValue?: number;
  primaryConsultant?: {
    id: string;
    firstName?: string;
    lastName?: string;
    computedName?: string;
    email?: string;
  };
  backupConsultant?: {
    id: string;
    firstName?: string;
    lastName?: string;
    computedName?: string;
    email?: string;
  };
  assignedManager?: {
    id: string;
    firstName?: string;
    lastName?: string;
    computedName?: string;
    email?: string;
  };
  nextPayrollDate?: Array<{
    originalEftDate?: string;
    adjustedEftDate?: string;
    processingDate?: string;
  }>;
  nextEftDate?: Array<{
    originalEftDate?: string;
    adjustedEftDate?: string;
    processingDate?: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
  processingDaysBeforeEft?: number;
}

interface PayrollsManagerProps {
  payrolls: Payroll[];
  loading?: boolean;
  onRefetch?: () => void;
  showHeader?: boolean;
  showLocalActions?: boolean;
}

// Status configuration for consistent visual language
const getStatusConfig = (status: string) => {
  const configs = {
    Implementation: {
      component: PendingStatus,
      label: "Implementation",
      progress: 15,
    },
    Active: { component: SuccessStatus, label: "Active", progress: 100 },
    Inactive: { component: ErrorStatus, label: "Inactive", progress: 0 },
    draft: { component: InfoStatus, label: "Draft", progress: 10 },
    "data-entry": {
      component: WarningStatus,
      label: "Data Entry",
      progress: 30,
    },
    review: { component: WarningStatus, label: "Under Review", progress: 50 },
    processing: { component: PendingStatus, label: "Processing", progress: 70 },
    "manager-review": {
      component: WarningStatus,
      label: "Manager Review",
      progress: 85,
    },
    approved: { component: SuccessStatus, label: "Approved", progress: 95 },
    submitted: { component: SuccessStatus, label: "Submitted", progress: 100 },
    paid: { component: SuccessStatus, label: "Paid", progress: 100 },
    "on-hold": { component: ErrorStatus, label: "On Hold", progress: 60 },
    cancelled: { component: ErrorStatus, label: "Cancelled", progress: 0 },
  };

  return configs[status as keyof typeof configs] || configs["Implementation"];
};

// Use existing schedule summary function from utils
const formatPayrollSchedule = (payroll: Payroll): string => {
  // Enhanced debug logging to understand the data variations
  console.log(`Schedule formatting for "${payroll.name}":`, {
    cycleName: payroll.payrollCycle?.name,
    dateTypeName: payroll.payrollDateType?.name,
    dateValue: payroll.dateValue,
    payrollCycle: payroll.payrollCycle,
    payrollDateType: payroll.payrollDateType,
  });

  return getEnhancedScheduleSummary(payroll);
};

// Get next EFT date (handles both nextEftDate and nextPayrollDate field names)
const getNextEftDate = (payroll: Payroll): string => {
  // Prefer API-provided next date if present - check both possible field names
  const provided =
    payroll.nextPayrollDate?.[0] ||
    payroll.nextEftDate?.[0] ||
    (payroll as any).nextEftDate?.[0] ||
    (payroll as any).nextPayrollDate?.[0];

  // Debug logging when no date is found
  if (!provided) {
    console.log("No EFT date found for payroll:", {
      id: payroll.id,
      name: payroll.name,
      nextPayrollDate: payroll.nextPayrollDate,
      nextEftDate: payroll.nextEftDate,
    });
  }

  if (provided) {
    const raw = provided.adjustedEftDate || provided.originalEftDate;
    if (raw) return safeFormatDate(raw, "dd MMM yyyy");
  }

  // As a fallback, compute a reasonable approximation from config
  const cycleType = payroll.payrollCycle?.name as any;
  const dateType = payroll.payrollDateType?.name as any;
  const dateValue = payroll.dateValue;
  const processingDays = (payroll as any).processingDaysBeforeEft ?? 0;
  if (!cycleType || !dateType) return "—";
  try {
    const base = new Date();
    const { adjustedEftDate } = calculatePayrollDates(
      base,
      cycleType,
      dateType,
      dateValue,
      processingDays
    );
    // Guard: if computed date ended up in the past, bump by cycle minimal unit
    const today = new Date();
    let next = new Date(adjustedEftDate);
    if (next < today) {
      // Nudge forward one week; downstream schedule will correct on server side
      next = addDays(today, 7);
    }
    return safeFormatDate(next, "dd MMM yyyy");
  } catch {
    return "—";
  }
};

// Get consultant name
const getConsultantName = (
  consultant?: Payroll["primaryConsultant"]
): string => {
  if (!consultant) return "Unassigned";
  return (
    consultant.computedName ||
    `${consultant.firstName || ""} ${consultant.lastName || ""}`.trim() ||
    "Unassigned"
  );
};

// Progressive disclosure details component
function PayrollDetails({ payroll }: { payroll: Payroll }) {
  const statusConfig = getStatusConfig(payroll.status || "Implementation");

  return (
    <div className="space-y-6">
      <h4 className="font-semibold text-foreground text-base border-b border-border pb-2">
        Payroll Information
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Team & Responsibility */}
        <div className="space-y-4">
          <h5 className="font-medium text-foreground flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Team & Responsibility
          </h5>
          <div className="space-y-3">
            <div className="space-y-1">
              <span className="text-sm font-medium text-foreground">
                Primary Consultant:
              </span>
              <p className="text-sm text-muted-foreground">
                {getConsultantName(payroll.primaryConsultant)}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-foreground">
                Backup Consultant:
              </span>
              <p className="text-sm text-muted-foreground">
                {getConsultantName(payroll.backupConsultant)}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-foreground">
                Manager:
              </span>
              <p className="text-sm text-muted-foreground">
                {getConsultantName(payroll.assignedManager)}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-foreground">
                Employee Count:
              </span>
              <p className="text-sm text-muted-foreground">
                {payroll.employeeCount || 0} employees
              </p>
            </div>
          </div>
        </div>

        {/* Schedule & Timing */}
        <div className="space-y-4">
          <h5 className="font-medium text-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule & Timing
          </h5>
          <div className="space-y-3">
            <div className="space-y-1">
              <span className="text-sm font-medium text-foreground">
                Payroll Cycle:
              </span>
              <p className="text-sm text-muted-foreground">
                {formatPayrollSchedule(payroll)}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-foreground">
                Date Type:
              </span>
              <p className="text-sm text-muted-foreground">
                {payroll.payrollDateType?.name || "Not specified"}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-foreground">
                Next EFT Date:
              </span>
              <p className="text-sm text-muted-foreground">
                {getNextEftDate(payroll)}
              </p>
            </div>
            {payroll.nextEftDate?.[0]?.processingDate && (
              <div className="space-y-1">
                <span className="text-sm font-medium text-foreground">
                  Processing Date:
                </span>
                <p className="text-sm text-muted-foreground">
                  {safeFormatDate(
                    payroll.nextEftDate[0].processingDate,
                    "dd MMM yyyy"
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Status & Progress */}
        <div className="space-y-4">
          <h5 className="font-medium text-foreground flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Status & Progress
          </h5>
          <div className="space-y-3">
            <div className="space-y-1">
              <span className="text-sm font-medium text-foreground">
                Current Status:
              </span>
              <div className="mt-1">
                {(() => {
                  const Component = statusConfig.component;
                  return <Component size="sm">{statusConfig.label}</Component>;
                })()}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-foreground">
                Progress:
              </span>
              <div className="mt-1">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${statusConfig.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">
                    {statusConfig.progress}%
                  </span>
                </div>
              </div>
            </div>
            {payroll.client && (
              <div className="space-y-1">
                <span className="text-sm font-medium text-foreground">
                  Client:
                </span>
                <p className="text-sm text-muted-foreground">
                  {payroll.client.name}
                </p>
              </div>
            )}
            {payroll.updatedAt && (
              <div className="space-y-1">
                <span className="text-sm font-medium text-foreground">
                  Last Updated:
                </span>
                <p className="text-sm text-muted-foreground">
                  {safeFormatDate(payroll.updatedAt, "dd MMM yyyy 'at' HH:mm")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ModernPayrollsManager({
  payrolls,
  loading,
  onRefetch,
  showHeader = true,
  showLocalActions = true,
}: PayrollsManagerProps) {
  // Debug logging
  useEffect(() => {
    if (payrolls?.length > 0) {
      console.log("PayrollsManager received payrolls:", payrolls[0]);
    }
  }, [payrolls]);

  const getStatusComponent = (status?: string) => {
    const config = getStatusConfig(status || "Implementation");
    const Component = config.component;
    return <Component size="sm">{config.label}</Component>;
  };

  // Define essential columns only (4 columns instead of 7+)
  const columns: ColumnDef<Payroll>[] = [
    {
      id: "payroll",
      key: "name",
      label: "Payroll",
      essential: true,
      sortable: true,
      render: (_, payroll) => (
        <div className="min-w-0">
          <Link
            href={`/payrolls/${payroll.id}`}
            className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 truncate block"
          >
            {payroll.name}
          </Link>
          {payroll.client && (
            <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-1 flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              {payroll.client.name}
            </div>
          )}
        </div>
      ),
    },
    {
      id: "status",
      key: "status",
      label: "Status",
      essential: true,
      sortable: true,
      render: (_, payroll) => getStatusComponent(payroll.status),
    },
    {
      id: "schedule",
      key: "payrollCycle",
      label: "Schedule",
      essential: true,
      sortable: false,
      render: (_, payroll) => (
        <div className="min-w-0">
          <div className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
            {formatPayrollSchedule(payroll)}
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-1 flex items-center gap-1">
            <CalendarDays className="h-3 w-3 flex-shrink-0" />
            <span>Next: {getNextEftDate(payroll)}</span>
          </div>
        </div>
      ),
    },
    {
      id: "team",
      key: "primaryConsultant",
      label: "Team & Size",
      essential: true,
      sortable: false,
      render: (_, payroll) => (
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <User className="h-4 w-4 text-neutral-500 flex-shrink-0" />
            <span className="truncate font-medium text-neutral-900 dark:text-neutral-100">
              {getConsultantName(payroll.primaryConsultant)}
            </span>
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 flex-shrink-0" />
              <span className="font-mono font-semibold">
                {payroll.employeeCount || 0}
              </span>
              <span>employees</span>
            </div>
            {payroll.backupConsultant && (
              <div className="flex items-center gap-1 truncate">
                <UserCheck className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">
                  {getConsultantName(payroll.backupConsultant)}
                </span>
              </div>
            )}
          </div>
        </div>
      ),
    },
  ];

  // Row actions (contextual, not bulk)
  const rowActions: RowAction<Payroll>[] = [
    {
      id: "view",
      label: "View Details",
      icon: Eye,
      onClick: payroll => {
        window.open(`/payrolls/${payroll.id}`, "_blank");
      },
    },
    {
      id: "edit",
      label: "Edit Payroll",
      icon: Edit,
      onClick: payroll => {
        window.open(`/payrolls/${payroll.id}/edit`, "_blank");
      },
    },
    {
      id: "schedule",
      label: "Manage Schedule",
      icon: Calendar,
      onClick: payroll => {
        window.open(`/payrolls/${payroll.id}/schedule`, "_blank");
      },
    },
    {
      id: "employees",
      label: "Manage Employees",
      icon: Users,
      onClick: payroll => {
        window.open(`/payrolls/${payroll.id}/employees`, "_blank");
      },
      disabled: payroll => (payroll.employeeCount || 0) === 0,
    },
  ];

  // Card view renderer (similar to clients page template)
  const renderPayrollCard = (payroll: Payroll) => {
    const statusConfig = getStatusConfig(payroll.status || "Implementation");
    const StatusComponent = statusConfig.component;
    const employeeCount = payroll.employeeCount || 0;

    return (
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link
                href={`/payrolls/${payroll.id}`}
                className="font-semibold text-primary hover:text-primary/90 block truncate"
              >
                {payroll.name}
              </Link>
              {payroll.client && (
                <div className="text-xs text-muted-foreground truncate mt-0.5 flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {payroll.client.name}
                </div>
              )}
            </div>
            <div className="shrink-0">
              <StatusComponent size="sm">{statusConfig.label}</StatusComponent>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-xs text-muted-foreground">Schedule</span>
              <div className="text-sm font-medium truncate">
                {formatPayrollSchedule(payroll)}
              </div>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Next EFT</span>
              <div className="text-sm font-medium flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                {getNextEftDate(payroll)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-xs text-muted-foreground">Consultant</span>
              <div className="text-sm font-medium flex items-center gap-1 truncate">
                <User className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <span className="truncate">
                  {getConsultantName(payroll.primaryConsultant)}
                </span>
              </div>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Employees</span>
              <div className="text-sm font-medium flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-mono font-semibold">{employeeCount}</span>
              </div>
            </div>
          </div>

          {payroll.backupConsultant && (
            <div className="pt-2 border-t">
              <span className="text-xs text-muted-foreground">
                Backup Consultant
              </span>
              <div className="text-sm font-medium flex items-center gap-1 mt-0.5 truncate">
                <UserCheck className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <span className="truncate">
                  {getConsultantName(payroll.backupConsultant)}
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2 border-t">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/payrolls/${payroll.id}`}>
                <Eye className="h-3.5 w-3.5 mr-1" /> View Details
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/payrolls/${payroll.id}/edit`}>
                <Edit className="h-3.5 w-3.5 mr-1" /> Edit Payroll
              </Link>
            </Button>
            {employeeCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open(`/payrolls/${payroll.id}/process`, "_blank")
                }
              >
                <CheckCircle className="h-3.5 w-3.5 mr-1" /> Process
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <ExportPayrollsListener rows={payrolls} />
      {showHeader && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Payrolls
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              Manage payroll schedules and processing with smart workflow
              tracking
            </p>
          </div>
          {showLocalActions && (
            <div className="flex items-center gap-2">
              {onRefetch && (
                <Button variant="outline" size="sm" onClick={onRefetch}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              )}
              <PermissionGuard action="create">
                <Button asChild>
                  <Link href="/payrolls/new">
                    <Plus className="h-4 w-4 mr-2" />
                    New Payroll
                  </Link>
                </Button>
              </PermissionGuard>
            </div>
          )}
        </div>
      )}

      <ModernDataTable
        data={payrolls}
        columns={columns}
        loading={!!loading}
        searchPlaceholder="Search payrolls, clients, consultants..."
        expandableRows
        renderExpandedRow={payroll => <PayrollDetails payroll={payroll} />}
        rowActions={rowActions}
        viewToggle
        showRowActionsInCardView={false}
        renderCardItem={row => renderPayrollCard(row as Payroll)}
        emptyState={
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
              No payrolls found
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Create your first payroll to start managing employee payments and
              schedules
            </p>
            {showLocalActions && (
              <PermissionGuard action="create">
                <Button asChild>
                  <Link href="/payrolls/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Payroll
                  </Link>
                </Button>
              </PermissionGuard>
            )}
          </div>
        }
      />
    </div>
  );
}

// Listener to export payrolls as CSV when PageHeader dispatches payrolls:export
const ExportPayrollsListener: React.FC<{ rows: Payroll[] }> = ({ rows }) => {
  useEffect(() => {
    const handleExport = () => {
      const headers = [
        "Payroll",
        "Client",
        "Status",
        "Cycle",
        "Consultant",
        "Next EFT",
        "Employees",
        "Updated",
      ];
      const escape = (val: unknown) => {
        const s = String(val ?? "");
        const escaped = s.replace(/"/g, '""');
        return `"${escaped}"`;
      };
      const csvRows = (rows || []).map(p => [
        escape(p.name),
        escape(p.client?.name ?? ""),
        escape(p.status ?? ""),
        escape(p.payrollCycle?.name ?? ""),
        escape(p.primaryConsultant?.computedName ?? ""),
        escape(
          safeFormatDate(
            (p as any).nextEftDate?.[0]?.adjustedEftDate ||
              (p as any).nextEftDate?.[0]?.originalEftDate ||
              "",
            "dd MMM yyyy"
          )
        ),
        escape(p.employeeCount ?? 0),
        escape(safeFormatDate(p.updatedAt ?? "", "dd MMM yyyy")),
      ]);
      const csv = [
        headers.map(escape).join(","),
        ...csvRows.map(r => r.join(",")),
      ].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payrolls-export-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };
    window.addEventListener("payrolls:export", handleExport);
    return () => window.removeEventListener("payrolls:export", handleExport);
  }, [rows]);
  return null;
};