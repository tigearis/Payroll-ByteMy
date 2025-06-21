// components/upcoming-payrolls.tsx
"use client";

import { useQuery } from "@apollo/client";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCurrentUser } from "@/hooks/use-current-user";

import { GET_USER_UPCOMING_PAYROLLS } from "@/graphql/queries/dashboard/getAlerts";
import { 
  PayrollDate, 
  Client, 
  Consultant, 
  UserUpcomingPayroll as UpcomingPayroll, 
  UserUpcomingPayrollsData as UpcomingPayrollsData, 
  StatusVariant 
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

function getUserRole(payroll: UpcomingPayroll, currentUserId: string): string {
  if (payroll.primaryConsultant?.id === currentUserId) {
    return "Primary Consultant";
  }
  if (payroll.backupConsultant?.id === currentUserId) {
    return "Backup Consultant";
  }
  if (payroll.manager?.id === currentUserId) {
    return "Manager";
  }
  return "Assigned";
}

export function UpcomingPayrolls() {
  const { currentUserId, loading: userLoading } = useCurrentUser();
  const today = new Date().toISOString().split("T")[0];

  const { data, loading, error } = useQuery<UpcomingPayrollsData>(
    GET_USER_UPCOMING_PAYROLLS,
    {
      variables: {
        userId: currentUserId,
        from_date: today,
        limit: 10,
      },
      skip: !currentUserId,
      errorPolicy: "all",
    }
  );

  if (userLoading || loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex space-x-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        <p>Unable to load your upcoming payrolls</p>
        <p className="text-sm mt-1">Error: {error.message}</p>
      </div>
    );
  }

  if (!currentUserId) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        <p>Please sign in to view your upcoming payrolls</p>
      </div>
    );
  }

  const payrolls = data?.payrolls || [];

  if (payrolls.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No upcoming payrolls assigned to you</p>
        <p className="text-sm mt-1">All caught up! 🎉</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Payroll</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Processing Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Your Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payrolls.map((payroll) => {
          const nextDate = payroll.payrollDates?.[0];
          return (
            <TableRow key={payroll.id}>
              <TableCell className="font-medium">{payroll.name}</TableCell>
              <TableCell>{payroll.client?.name || "Unknown Client"}</TableCell>
              <TableCell>
                {nextDate?.adjustedEftDate
                  ? format(new Date(nextDate.adjustedEftDate), "MMM dd, yyyy")
                  : "Not scheduled"}
              </TableCell>
              <TableCell>
                {nextDate?.processingDate
                  ? format(new Date(nextDate.processingDate), "MMM dd, yyyy")
                  : "Not set"}
              </TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(payroll.status)}>
                  {payroll.status}
                </Badge>
              </TableCell>
              <TableCell>{getUserRole(payroll, currentUserId)}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
