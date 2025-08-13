"use client";

import { useQuery, useMutation } from "@apollo/client";
import { useUser } from "@clerk/nextjs";
import {
  Calendar,
  Users,
  Settings,
  RefreshCw,
  Clock,
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, Suspense } from "react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { PageHeader } from "@/components/patterns/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModernWorkScheduleManager } from "@/domains/work-schedule/components/ModernWorkScheduleManager";
import {
  UpsertWorkScheduleDocument,
  InsertWorkScheduleDocument,
  UpdateUserDefaultAdminTimeDocument,
  GetAllStaffWorkloadDocument,
  type UpsertWorkScheduleMutation,
  type InsertWorkScheduleMutation,
  type UpdateUserDefaultAdminTimeMutation,
  type GetAllStaffWorkloadQuery,
} from "@/domains/work-schedule/graphql/generated/graphql";
import { cn } from "@/lib/utils";

// Team member interface for work schedule management
interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  computedName: string;
  email: string;
  position: string;
  capacity: {
    utilizationPercentage: number;
    totalWorkHours: number;
    totalPayrollCapacity: number;
    availableCapacityHours: number;
    processingWindowDays: number;
  };
  assignedPayrolls: Array<{
    id: string;
    name: string;
    role: "primary" | "backup";
    processingTime: number;
  }>;
  workSchedules: Array<{
    id: string;
    workDay: string;
    workHours: number;
    adminTimeHours: number;
    payrollCapacityHours: number;
  }>;
}

// Enhanced metric card component with hover effects and animations
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
                className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1",
                  trendStyles[trend]
                )}
                title="Trend from previous period"
              >
                {trend === "up" && <TrendingUp className="w-3 h-3" />}
                {trend === "down" && (
                  <Activity className="w-3 h-3 rotate-180" />
                )}
                {trend === "stable" && <Activity className="w-3 h-3" />}
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

// Summary metrics component with enhanced styling
function WorkScheduleSummaryCards({
  teamMembers,
}: {
  teamMembers: TeamMember[];
}) {
  const metrics = useMemo(() => {
    if (!teamMembers.length) {
      return {
        totalMembers: 0,
        averageUtilization: 0,
        totalCapacity: 0,
        overutilized: 0,
        teamHealth: "neutral" as "good" | "warning" | "critical" | "neutral",
        capacityTrend: "stable" as "up" | "down" | "stable",
        utilizationHealth: "neutral" as
          | "good"
          | "warning"
          | "critical"
          | "neutral",
      };
    }

    const totalMembers = teamMembers.length;
    const averageUtilization = Math.round(
      teamMembers.reduce(
        (sum, member) => sum + member.capacity.utilizationPercentage,
        0
      ) / totalMembers
    );
    const totalCapacity = Math.round(
      teamMembers.reduce(
        (sum, member) => sum + member.capacity.availableCapacityHours,
        0
      )
    );
    const overutilized = teamMembers.filter(
      member => member.capacity.utilizationPercentage > 100
    ).length;

    // Calculate health indicators
    const teamHealth: "good" | "warning" | "critical" | "neutral" =
      totalMembers >= 5 ? "good" : totalMembers >= 3 ? "warning" : "critical";
    const utilizationHealth: "good" | "warning" | "critical" | "neutral" =
      averageUtilization <= 85
        ? "good"
        : averageUtilization <= 100
          ? "warning"
          : "critical";
    const capacityTrend: "up" | "down" | "stable" =
      totalCapacity > 40 ? "up" : totalCapacity > 20 ? "stable" : "down";
    const overutilizedHealth: "good" | "warning" | "critical" | "neutral" =
      overutilized === 0 ? "good" : overutilized <= 2 ? "warning" : "critical";

    return {
      totalMembers,
      averageUtilization,
      totalCapacity,
      overutilized,
      teamHealth,
      utilizationHealth,
      capacityTrend,
      overutilizedHealth,
    };
  }, [teamMembers]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Team Members Card */}
      <EnhancedMetricCard
        title="Team Members"
        value={metrics.totalMembers.toString()}
        subtitle="Active team members"
        icon={Users}
        status={metrics.teamHealth}
        trend={metrics.totalMembers >= 5 ? "up" : "stable"}
        trendValue={metrics.totalMembers >= 5 ? "Well staffed" : "Growing"}
        onClick={() => router.push("/staff")}
      >
        <div className="flex items-center gap-1 text-xs text-gray-600 mt-2">
          <CheckCircle2
            className={cn(
              "h-3 w-3",
              metrics.teamHealth === "good"
                ? "text-green-600"
                : metrics.teamHealth === "warning"
                  ? "text-amber-600"
                  : "text-red-600"
            )}
          />
          <span>
            {metrics.teamHealth === "good"
              ? "Optimal team size"
              : metrics.teamHealth === "warning"
                ? "Could use more staff"
                : "Understaffed"}
          </span>
        </div>
      </EnhancedMetricCard>

      {/* Average Utilization Card */}
      <EnhancedMetricCard
        title="Avg. Utilization"
        value={`${metrics.averageUtilization}%`}
        subtitle="Team capacity usage"
        icon={TrendingUp}
        status={metrics.utilizationHealth}
        trend={metrics.averageUtilization <= 85 ? "stable" : "up"}
        trendValue={metrics.utilizationHealth === "good" ? "Optimal" : "High"}
        onClick={() => router.push("/work-schedule")}
      >
        <div className="flex items-center gap-1 text-xs mt-2">
          {metrics.utilizationHealth === "good" && (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle2 className="h-3 w-3" />
              <span>Healthy utilization</span>
            </div>
          )}
          {metrics.utilizationHealth === "warning" && (
            <div className="flex items-center gap-1 text-amber-600">
              <AlertCircle className="h-3 w-3" />
              <span>High utilization</span>
            </div>
          )}
          {metrics.utilizationHealth === "critical" && (
            <div className="flex items-center gap-1 text-red-600">
              <AlertCircle className="h-3 w-3" />
              <span>Over capacity</span>
            </div>
          )}
        </div>
      </EnhancedMetricCard>

      {/* Available Capacity Card */}
      <EnhancedMetricCard
        title="Available Capacity"
        value={`${metrics.totalCapacity}h`}
        subtitle="Hours available weekly"
        icon={Clock}
        status={
          metrics.totalCapacity > 40
            ? "good"
            : metrics.totalCapacity > 20
              ? "warning"
              : "critical"
        }
        trend={metrics.capacityTrend}
        trendValue={
          metrics.capacityTrend === "up"
            ? "High capacity"
            : metrics.capacityTrend === "stable"
              ? "Stable"
              : "Limited"
        }
        onClick={() => router.push("/work-schedule")}
      >
        <div className="flex items-center gap-1 text-xs text-gray-600 mt-2">
          <Activity className="h-3 w-3" />
          <span>
            {metrics.totalCapacity > 40
              ? "Excellent availability"
              : metrics.totalCapacity > 20
                ? "Moderate capacity"
                : "Capacity constrained"}
          </span>
        </div>
      </EnhancedMetricCard>

      {/* Overutilized Members Card */}
      <EnhancedMetricCard
        title="Overutilized"
        value={metrics.overutilized.toString()}
        subtitle="Members over capacity"
        icon={Activity}
        status={metrics.overutilizedHealth}
        trend={metrics.overutilized === 0 ? "stable" : "up"}
        trendValue={metrics.overutilized === 0 ? "All good" : "Needs attention"}
        onClick={() => router.push("/work-schedule")}
      >
        <div className="flex items-center gap-1 text-xs mt-2">
          {metrics.overutilized === 0 ? (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle2 className="h-3 w-3" />
              <span>All within capacity</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-red-600">
              <AlertCircle className="h-3 w-3" />
              <span>Requires rebalancing</span>
            </div>
          )}
        </div>
      </EnhancedMetricCard>
    </div>
  );
}

// Main content component
function WorkSchedulePageContent() {
  const { user } = useUser();
  const router = useRouter();

  // Get current user's ID from Clerk metadata
  const currentUserId = user?.publicMetadata?.databaseId as string;

  // GraphQL mutations for work schedule management
  const [upsertWorkSchedule] = useMutation<UpsertWorkScheduleMutation>(
    UpsertWorkScheduleDocument
  );
  const [insertWorkSchedule] = useMutation<InsertWorkScheduleMutation>(
    InsertWorkScheduleDocument
  );
  const [updateUserAdminTime] = useMutation<UpdateUserDefaultAdminTimeMutation>(
    UpdateUserDefaultAdminTimeDocument
  );

  // Query for team workload including payroll assignments
  const {
    data: teamWorkloadData,
    loading,
    error,
    refetch,
  } = useQuery<GetAllStaffWorkloadQuery>(GetAllStaffWorkloadDocument, {
    errorPolicy: "all",
  });

  // Handler functions for work schedule management
  const handleViewMember = (member: any) => {
    console.log("Viewing member details:", member.computedName);
  };

  const handleEditSchedule = (member: any) => {
    console.log("Editing schedule for:", member.computedName);
    router.push(`/work-schedule/${member.id}/edit`);
  };

  const handleManageSettings = () => {
    router.push("/work-schedule/settings");
  };

  // Transform GraphQL data to component format
  function transformTeamWorkloadToMembers(
    users: GetAllStaffWorkloadQuery["users"]
  ): TeamMember[] {
    return users.map(user => {
      // Calculate assigned hours from payroll assignments
      const primaryPayrollHours =
        user.primaryPayrollAssignments?.reduce(
          (total: number, payroll: any) =>
            total + (payroll.processingTime || 0),
          0
        ) || 0;

      const backupPayrollHours =
        user.backupPayrollAssignments?.reduce(
          (total: number, payroll: any) =>
            total + (payroll.processingTime || 0) * 0.25,
          0
        ) || 0;

      const totalAssignedHours = primaryPayrollHours + backupPayrollHours;

      // Calculate capacity from work schedules
      const workSchedules = user.workSchedules || [];
      const totalWorkHours = workSchedules.reduce(
        (sum, s) => sum + (s.workHours || 0),
        0
      );
      const totalPayrollCapacity = workSchedules.reduce(
        (sum, s) => sum + (s.payrollCapacityHours || 0),
        0
      );

      // Calculate utilization percentage
      const utilizationPercentage =
        totalPayrollCapacity > 0
          ? Math.round((totalAssignedHours / totalPayrollCapacity) * 100)
          : 0;

      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        computedName:
          user.computedName || `${user.firstName} ${user.lastName}`.trim(),
        email: user.email,
        position: user.role,
        workSchedules: workSchedules.map(schedule => ({
          id: schedule.id,
          workDay: schedule.workDay,
          workHours: schedule.workHours || 0,
          adminTimeHours: schedule.adminTimeHours || 0,
          payrollCapacityHours: schedule.payrollCapacityHours || 0,
        })),
        assignedPayrolls: [
          ...(user.primaryPayrollAssignments || []).map(payroll => ({
            id: payroll.id,
            name: payroll.name,
            role: "primary" as const,
            processingTime: payroll.processingTime || 0,
          })),
          ...(user.backupPayrollAssignments || []).map(payroll => ({
            id: payroll.id,
            name: payroll.name,
            role: "backup" as const,
            processingTime: (payroll.processingTime || 0) * 0.25,
          })),
        ],
        capacity: {
          utilizationPercentage,
          totalWorkHours,
          totalPayrollCapacity,
          availableCapacityHours: Math.max(
            0,
            totalPayrollCapacity - totalAssignedHours
          ),
          processingWindowDays: workSchedules.filter(
            s => (s.workHours || 0) > 0
          ).length,
        },
      };
    });
  }

  const teamMembers = teamWorkloadData?.users
    ? transformTeamWorkloadToMembers(teamWorkloadData.users)
    : [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Work Schedule Management"
        description="Team capacity planning and schedule optimization"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Work Schedule" },
        ]}
        actions={[
          { label: "Refresh", icon: RefreshCw, onClick: () => refetch() },
          {
            label: "Manage Settings",
            icon: Settings,
            onClick: handleManageSettings,
            primary: false,
          },
        ]}
        overflowActions={[
          {
            label: "Add Team Member",
            onClick: () => router.push("/staff/new"),
          },
          {
            label: "Export Schedule",
            onClick: () =>
              window.dispatchEvent(new CustomEvent("schedule:export")),
          },
        ]}
      />

      {/* Summary Cards */}
      <WorkScheduleSummaryCards teamMembers={teamMembers} />

      {/* Modern Work Schedule Manager */}
      <ModernWorkScheduleManager
        teamMembers={teamMembers}
        loading={loading}
        onViewMember={handleViewMember}
        onEditSchedule={handleEditSchedule}
      />
    </div>
  );
}

// Loading component
function WorkScheduleLoading() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-24"></div>
          </div>
        ))}
      </div>
      <div className="animate-pulse bg-gray-200 rounded-lg h-96"></div>
    </div>
  );
}

// Main page component with error boundary
export default function WorkSchedulePage() {
  return (
    <PermissionGuard
      minRole="manager"
      fallback={
        <div className="space-y-6">
          <PageHeader
            title="Work Schedule Management"
            description="Team capacity planning and schedule optimization"
            breadcrumbs={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Work Schedule" },
            ]}
          />
          <Card>
            <CardContent className="p-12">
              <div className="text-center space-y-4">
                <Calendar className="w-16 h-16 text-foreground opacity-40 mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Personal Schedule View
                  </h3>
                  <p className="text-foreground opacity-75 max-w-md mx-auto">
                    Contact your manager for full team overview and management
                    access.
                  </p>
                </div>
                <button
                  onClick={() => (window.location.href = "/schedule")}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  View My Schedule
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      }
    >
      <Suspense fallback={<WorkScheduleLoading />}>
        <WorkSchedulePageContent />
      </Suspense>
    </PermissionGuard>
  );
}
