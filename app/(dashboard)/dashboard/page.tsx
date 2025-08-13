// app/(dashboard)/dashboard/page.tsx
"use client";

import { useQuery } from "@apollo/client";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { ModernDashboard } from "@/components/dashboard";
import { PageHeader } from "@/components/patterns/page-header";
import { GetDashboardStatsOptimizedDocument } from "@/shared/types/generated/graphql";

interface DashboardStatsData {
  clientsAggregate: { aggregate: { count: number } };
  totalPayrolls: { aggregate: { count: number } };
  activePayrolls: { aggregate: { count: number } };
  upcomingPayrolls: Array<{
    id: string;
    name: string;
    status: string;
    client: { id: string; name: string };
    nextEftDate: Array<{
      originalEftDate: string;
      adjustedEftDate: string;
      processingDate: string;
    }>;
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
  const upcomingPayrolls = dashboardData?.upcomingPayrolls ?? [];

  // Get next payroll with proper date information
  const nextPayroll = upcomingPayrolls[0];
  const nextEftDate = nextPayroll?.nextEftDate?.[0];
  const effectiveDate =
    nextEftDate?.adjustedEftDate || nextEftDate?.originalEftDate;

  // Transform data for modern dashboard
  const insights = [
    {
      id: "client-metrics",
      type: "client-metrics" as const,
      title: "Client Portfolio",
      priority: "medium" as const,
      metrics: [
        {
          label: "Total Clients",
          value: totalClients,
          change:
            totalClients > 100
              ? { value: 5.2, type: "increase" as const, period: "this month" }
              : undefined,
        },
      ],
      actions: [
        { label: "View All Clients", href: "/clients" },
        { label: "Add Client", href: "/clients/new" },
      ],
    },
    {
      id: "payroll-overview",
      type: "billing-status" as const,
      title: "Payroll Operations",
      priority: "high" as const,
      metrics: [
        {
          label: "Active Payrolls",
          value: activePayrolls,
          format: "number" as const,
        },
        {
          label: "Total Managed",
          value: totalPayrolls,
          format: "number" as const,
        },
      ],
      actions: [{ label: "Manage Payrolls", href: "/payrolls" }],
    },
    {
      id: "upcoming-deadlines",
      type: "upcoming-deadlines" as const,
      title: "Upcoming Payrolls",
      priority:
        upcomingPayrolls.length > 10 ? ("high" as const) : ("medium" as const),
      items: upcomingPayrolls.slice(0, 5).map(payroll => ({
        label: `${payroll.client.name} - ${payroll.name}`,
        value: effectiveDate
          ? new Date(effectiveDate).toLocaleDateString("en-AU")
          : "Date TBD",
        status:
          payroll.status === "active"
            ? ("success" as const)
            : ("pending" as const),
        href: `/payrolls/${payroll.id}`,
      })),
      actions: [
        { label: "View Schedule", href: "/payroll-schedule" },
        { label: "New Payroll", href: "/payrolls/new" },
      ],
    },
  ];

  // Generate workflow suggestions
  const suggestions = [
    {
      id: "payroll-automation",
      type: "automation" as const,
      title: "Automate Payroll Scheduling",
      description:
        "Set up automatic payroll date generation for recurring clients",
      reasoning: `You have ${activePayrolls} active payrolls that could benefit from automated scheduling`,
      impact: "medium" as const,
      effort: "low" as const,
      estimatedSavings: { time: "2 hours/week" },
      actions: [
        {
          label: "Set up automation",
          href: "/payroll-schedule/automation",
          primary: true,
        },
        { label: "Learn more", href: "/help/automation" },
      ],
    },
    ...(upcomingPayrolls.length > 15
      ? [
          {
            id: "bulk-processing",
            type: "optimization" as const,
            title: "Optimize Payroll Processing",
            description:
              "Process multiple payrolls simultaneously to save time",
            reasoning: `With ${upcomingPayrolls.length} upcoming payrolls, bulk processing could significantly improve efficiency`,
            impact: "high" as const,
            effort: "low" as const,
            estimatedSavings: { time: "4 hours/week" },
            actions: [
              {
                label: "Enable bulk processing",
                href: "/payrolls/bulk",
                primary: true,
              },
            ],
          },
        ]
      : []),
  ];

  // System alerts
  const alerts = dashboardError
    ? [
        {
          id: "data-error",
          type: "error" as const,
          title: "Data Loading Error",
          message: dashboardError.message || "Failed to load dashboard data",
          actionLabel: "Retry",
          dismissible: true,
        },
      ]
    : [];

  return (
    <PermissionGuard action="read">
      <div className="container mx-auto py-6 space-y-6">
        <PageHeader
          title="Dashboard"
          description="Actionable insights and system status"
        />
        <ModernDashboard
          systemHealth={dashboardError ? "degraded" : "operational"}
          alerts={alerts}
          insights={insights}
          suggestions={suggestions}
          pendingTasks={upcomingPayrolls.length}
          lastUpdate={new Date()}
          loading={dashboardLoading}
          onActionClick={actionId => {
            // Simple router mapping for known actions
            const map: Record<string, string> = {
              "Manage Payrolls": "/payrolls",
              "View All Clients": "/clients",
              "Add Client": "/clients/new",
            };
            const href = map[actionId] || "/dashboard";
            if (typeof window !== "undefined") window.location.href = href;
          }}
          onSuggestionDismiss={() => {}}
          onSuggestionAction={(_, actionLabel) => {
            if (actionLabel?.toLowerCase().includes("automation")) {
              window.location.href = "/payroll-schedule";
            }
          }}
        />
      </div>
    </PermissionGuard>
  );
}
