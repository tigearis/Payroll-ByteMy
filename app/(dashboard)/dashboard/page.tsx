// app/(dashboard)/dashboard/page.tsx
"use client";

import { useQuery } from "@apollo/client";
import { format } from "date-fns";
import { CalendarDays, Users, Calculator } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UrgentAlerts } from "@/components/urgent-alerts";
import {
  GetPayrollDashboardStatsDocument,
  GetUpcomingPayrollsDocument,
} from "@/domains/payrolls/graphql/generated/graphql";
import { GetClientStatsDocument } from "@/domains/clients/graphql/generated/graphql";

interface PayrollStatsData {
  totalPayrolls: { aggregate: { count: number } };
  activePayrolls: { aggregate: { count: number } };
  processingPayrolls: { aggregate: { count: number } };
}

interface ClientStatsData {
  clientsAggregate: { aggregate: { count: number } };
}

interface NextPayDate {
  originalEftDate: string;
  adjustedEftDate: string;
  processingDate: string;
}

interface UpcomingPayroll {
  id: string;
  name: string;
  status: string;
  client: { name: string };
  nextPayDate: NextPayDate[];
}

interface UpcomingPayrollsData {
  payrolls: UpcomingPayroll[];
}

export default function DashboardPage() {
  const today = new Date().toISOString().split("T")[0];

  // Fetch client statistics
  const {
    data: clientData,
    loading: clientLoading,
    error: clientError,
  } = useQuery<ClientStatsData>(GetClientStatsDocument, {
    errorPolicy: "all",
  });

  // Fetch payroll statistics
  const {
    data: payrollData,
    loading: payrollLoading,
    error: payrollError,
  } = useQuery<PayrollStatsData>(GetPayrollDashboardStatsDocument, {
    errorPolicy: "all",
  });

  // Fetch upcoming payrolls for the count and next payroll date
  const { data: upcomingData, loading: upcomingLoading } =
    useQuery<UpcomingPayrollsData>(GetUpcomingPayrollsDocument, {
      variables: { limit: 1 },
      errorPolicy: "all",
    });

  // Extract stats with fallbacks
  const totalClients = clientData?.clientsAggregate?.aggregate?.count ?? 0;
  const totalPayrolls = payrollData?.totalPayrolls?.aggregate?.count ?? 0;
  const activePayrolls = payrollData?.activePayrolls?.aggregate?.count ?? 0;
  const processingPayrolls = payrollData?.processingPayrolls?.aggregate?.count ?? 0;

  // Get next payroll date
  const nextPayroll = upcomingData?.payrolls?.[0];
  const nextPayrollDate = nextPayroll?.nextPayDate?.[0]?.adjustedEftDate;
  
  // Calculate loading states
  const isLoading = clientLoading || payrollLoading || upcomingLoading;
  const hasError = clientError || payrollError;

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
            {clientLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{totalClients}</div>
            )}
            <p className="text-xs text-gray-600">
              {clientError ? "Error loading data" : "Active clients"}
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
            {payrollLoading ? (
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
              <div className="text-2xl font-bold">{upcomingData?.payrolls?.length ?? 0}</div>
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
