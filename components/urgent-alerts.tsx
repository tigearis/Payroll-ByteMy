// components/urgent-alerts.tsx
"use client";

import { useQuery } from "@apollo/client";
import { format } from "date-fns";
import { CalendarDays, User } from "lucide-react";
import Link from "next/link";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { GetUserUpcomingPayrollsDocument } from "@/domains/payrolls/graphql/generated/graphql";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  UserUpcomingPayroll,
  UserUpcomingPayrollsData,
  StatusVariant,
} from "@/shared/types/dashboard";

function getStatusVariant(status: string): StatusVariant {
  switch (status?.toLowerCase()) {
    case "active":
      return "default";
    case "implementation":
      return "secondary";
    case "processing":
      return "outline";
    case "draft":
    case "data-entry":
    case "review":
      return "secondary";
    case "manager-review":
    case "approved":
      return "default";
    case "submitted":
    case "paid":
      return "default";
    case "on-hold":
      return "destructive";
    case "cancelled":
    case "inactive":
      return "destructive";
    default:
      return "outline";
  }
}

function getUserRole(
  payroll: UserUpcomingPayroll,
  currentUserId: string
): string {
  if (payroll.primaryConsultant?.id === currentUserId) {
    return "Primary Consultant";
  }
  if (payroll.backupConsultant?.id === currentUserId) {
    return "Backup Consultant";
  }
  if (payroll.assignedManager?.id === currentUserId) {
    return "Manager";
  }
  // If user is assigned but not in a specific role, check for any assignment
  // This handles cases where the user might be assigned through other means
  return "Assigned Staff";
}

export function UrgentAlerts() {
  return (
    <PermissionGuard resource="payrolls" action="read">
      <UrgentAlertsInner />
    </PermissionGuard>
  );
}

function UrgentAlertsInner() {
  const { currentUserId, loading: userLoading } = useCurrentUser();
  const today = new Date().toISOString().split("T")[0];

  const { data, loading, error } = useQuery<UserUpcomingPayrollsData>(
    GetUserUpcomingPayrollsDocument,
    {
      variables: {
        userId: currentUserId,
        from_date: today,
        limit: 5,
      },
      skip: !currentUserId,
      errorPolicy: "all",
    }
  );

  if (userLoading || loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="border border-blue-200 bg-blue-50 p-4 rounded-lg"
          >
            <div className="flex gap-3">
              <Skeleton className="h-4 w-4 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        <CalendarDays className="h-8 w-8 mx-auto mb-2 text-red-500" />
        <p>Unable to load your upcoming payrolls</p>
        <p className="text-sm mt-1">Error: {error.message}</p>
      </div>
    );
  }

  if (!currentUserId) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        <User className="h-8 w-8 mx-auto mb-2" />
        <p>Please sign in to view your upcoming payrolls</p>
      </div>
    );
  }

  const payrolls = data?.payrolls || [];

  if (payrolls.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <CalendarDays className="h-8 w-8 mx-auto mb-2 text-green-600" />
        <p>No upcoming payrolls assigned to you</p>
        <p className="text-sm mt-1">All caught up! 🎉</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {payrolls.map(payroll => {
        // Get the next upcoming payroll date - handle both data structures
        const nextDate = payroll.payrollDates?.[0] || payroll.nextEftDate?.[0] || payroll.nextPayDate?.[0];
        const userRole = getUserRole(payroll, currentUserId);
        const effectiveDate = nextDate?.adjustedEftDate || nextDate?.originalEftDate;
        const daysUntil = effectiveDate
          ? Math.ceil(
              (new Date(effectiveDate).getTime() - Date.now()) /
                (1000 * 60 * 60 * 24)
            )
          : null;

        return (
          <Link
            key={payroll.id}
            href={`/payrolls/${payroll.id}`}
            className="block"
          >
            <div className="border border-blue-200 bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
              <div className="flex items-start gap-3">
                <CalendarDays className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-blue-900 truncate">
                      {payroll.client?.name} - {payroll.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getStatusVariant(payroll.status)}>
                        {payroll.status}
                      </Badge>
                      {effectiveDate && (
                        <Badge variant="outline" className="text-xs">
                          {format(new Date(effectiveDate), "MMM dd, yyyy")}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="text-sm text-blue-700 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>
                        Due:{" "}
                        {effectiveDate
                          ? format(
                              new Date(effectiveDate),
                              "MMM dd, yyyy"
                            )
                          : "Not scheduled"}
                        {nextDate?.adjustedEftDate && nextDate.adjustedEftDate !== nextDate.originalEftDate && (
                          <span className="text-xs text-orange-600 ml-1">(Adjusted)</span>
                        )}
                      </span>
                      {daysUntil !== null && (
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            daysUntil <= 1
                              ? "bg-red-100 text-red-700"
                              : daysUntil <= 3
                                ? "bg-orange-100 text-orange-700"
                                : "bg-green-100 text-green-700"
                          }`}
                        >
                          {daysUntil === 0
                            ? "Today"
                            : daysUntil === 1
                              ? "Tomorrow"
                              : `${daysUntil} days`}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Role: {userRole}</span>
                      {nextDate?.processingDate && (
                        <span className="text-xs">
                          Process:{" "}
                          {format(new Date(nextDate.processingDate), "MMM dd")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
