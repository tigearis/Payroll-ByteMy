// app/(dashboard)/dashboard/page.tsx
"use client";

import { useQuery } from "@apollo/client";
import { format } from "date-fns";
import { CalendarDays, Users, Calculator } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UrgentAlerts } from "@/components/urgent-alerts";
import { GetDashboardStatsOptimizedDocument } from "@/shared/types/generated/graphql";

interface DashboardStatsData {
  clientsAggregate: { aggregate: { count: number } };
  totalPayrolls: { aggregate: { count: number } };
  activePayrolls: { aggregate: { count: number } };
  processingPayrolls: { aggregate: { count: number } };
  upcomingPayrolls: Array<{
    id: string;
    name: string;
    status: string;
    client: { id: string; name: string };
  }>;
}

export default function DashboardPage() {
  // Fetch all dashboard statistics with single optimized query
  const {
    data: dashboardData,
    loading: dashboardLoading,
    error: dashboardError,
  } = useQuery<DashboardStatsData>(GetDashboardStatsOptimizedDocument, {
    variables: { limit: 5 },
    errorPolicy: "all",
  });

  // Extract stats with fallbacks
  const totalClients = dashboardData?.clientsAggregate?.aggregate?.count ?? 0;
  const totalPayrolls = dashboardData?.totalPayrolls?.aggregate?.count ?? 0;
  const activePayrolls = dashboardData?.activePayrolls?.aggregate?.count ?? 0;
  const processingPayrolls = dashboardData?.processingPayrolls?.aggregate?.count ?? 0;
  const upcomingPayrolls = dashboardData?.upcomingPayrolls ?? [];

  // Get next payroll - using the first upcoming payroll as an approximation
  const nextPayroll = upcomingPayrolls[0];
  
  // Calculate loading and error states
  const isLoading = dashboardLoading;
  const hasError = dashboardError;

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
            {dashboardLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{totalClients}</div>
            )}
            <p className="text-xs text-gray-600">
              {hasError ? "Error loading data" : "Active clients"}
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
            {dashboardLoading ? (
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
            {dashboardLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{upcomingPayrolls.length}</div>
            )}
            <p className="text-xs text-gray-600">
              {nextPayroll
                ? `Next: ${nextPayroll.client.name} (${nextPayroll.name})`
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
