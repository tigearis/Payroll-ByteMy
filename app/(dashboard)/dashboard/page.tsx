// app/(dashboard)/dashboard/page.tsx
"use client";

import { useQuery } from "@apollo/client";
import { format } from "date-fns";
import { CalendarDays, Users, Calculator } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UrgentAlerts } from "@/components/urgent-alerts";
import {
  GetDashboardStatsDocument,
  GetUpcomingPayrollsDocument,
} from "@/shared/types/generated/graphql";

interface DashboardStatsData {
  clients_aggregate: { aggregate: { count: number } };
  payrolls_aggregate: { aggregate: { count: number } };
  active_payrolls: { aggregate: { count: number } };
  processing_queue: { aggregate: { count: number } };
}

interface PayrollDate {
  id: string;
  adjustedEftDate: string;
  processingDate: string;
}

interface UpcomingPayroll {
  id: string;
  name: string;
  status: string;
  client: { name: string };
  payrollDates: PayrollDate[];
}

interface UpcomingPayrollsData {
  payrolls: UpcomingPayroll[];
}

export default function DashboardPage() {
  const today = new Date().toISOString().split("T")[0];

  // Fetch dashboard statistics
  const {
    data: statsData,
    loading: statsLoading,
    error: statsError,
  } = useQuery<DashboardStatsData>(GetDashboardStatsDocument, {
    errorPolicy: "all",
  });

  // Fetch upcoming payrolls for the count and next payroll date
  const { data: upcomingData, loading: upcomingLoading } =
    useQuery<UpcomingPayrollsData>(GetUpcomingPayrollsDocument, {
      variables: { from_date: today, limit: 1 },
      errorPolicy: "all",
    });

  // Extract stats with fallbacks
  const totalClients = statsData?.clients_aggregate?.aggregate?.count ?? 0;
  const totalPayrolls = statsData?.payrolls_aggregate?.aggregate?.count ?? 0;
  const activePayrolls = statsData?.active_payrolls?.aggregate?.count ?? 0;
  const urgentAlerts = statsData?.processing_queue?.aggregate?.count ?? 0;

  // Get next payroll date
  const nextPayroll = upcomingData?.payrolls?.[0];
  const nextPayrollDate = nextPayroll?.payrollDates?.[0]?.adjustedEftDate;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back! Here&apos;s an overview of your payroll operations.
          </p>
        </div>
      </div>
      <div className="mb-6"></div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{totalClients}</div>
            )}
            <p className="text-xs text-gray-600">
              {statsError ? "Error loading data" : "Active clients"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Payrolls
            </CardTitle>
            <Calculator className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{totalPayrolls}</div>
            )}
            <p className="text-xs text-gray-600">
              {activePayrolls} currently active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Payrolls
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            {upcomingLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{activePayrolls}</div>
            )}
            <p className="text-xs text-gray-600">
              {nextPayrollDate
                ? `Next: ${format(new Date(nextPayrollDate), "MMM dd, yyyy")}`
                : "No upcoming payrolls"}
            </p>
          </CardContent>
        </Card>
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Processing Queue
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{urgentAlerts}</div>
            )}
            <p className="text-xs text-gray-600">
              {urgentAlerts > 0 ? "Requires attention" : "All up to date"}
            </p>
          </CardContent>
        </Card> */}
      </div>
      {/* 
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/clients/new">Add New Client</Link>
            </Button>
            <Button asChild className="w-full">
              <Link href="/payrolls/new">Create New Payroll</Link>
            </Button>
            <Button asChild className="w-full">
              <Link href="/calendar">View Calendar</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>My Upcoming Payrolls</CardTitle>
          </CardHeader>
          <CardContent>
            <UpcomingPayrolls />
          </CardContent>
        </Card>
      </div> */}

      <Card>
        <CardHeader>
          <CardTitle>My Upcoming Payrolls</CardTitle>
        </CardHeader>
        <CardContent>
          <UrgentAlerts />
        </CardContent>
      </Card>
    </div>
  );
}
