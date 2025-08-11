"use client";

/*
 * Modern Work Schedule Management Page
 *
 * Features progressive disclosure pattern with:
 * - 4 essential columns: Team Member, Utilization, Capacity, Workload
 * - Expandable rows for detailed schedule and assignment information
 * - Smart search and contextual actions
 * - Mobile-first responsive design
 */

import { useQuery, useMutation } from "@apollo/client";
import { useUser } from "@clerk/nextjs";
import {
  Calendar,
  Users,
  Settings,
  AlertTriangle,
  Info,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { PageHeader } from "@/components/patterns/page-header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

// Helper components for clean permission guard boundaries
const HeaderSection = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
    {children}
  </div>
);

const StatsSection = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-6">{children}</div>
);

const MainContentSection = ({ children }: { children: React.ReactNode }) => (
  <div className="space-y-6">{children}</div>
);

// Removed unused EnhancedWorkloadVisualization to avoid missing imports and types

export default function WorkSchedulePage() {
  const [operationStatus, setOperationStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
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

  // Removed unused payroll assignment mutations to keep page focused and error-free

  // Debug: Check if user authentication is working
  console.log("Auth debug:", {
    currentUserId,
    userRole: user?.publicMetadata?.role,
    isAuthenticated: !!user,
  });

  // Query for team workload including payroll assignments
  const {
    data: teamWorkloadData,
    loading: workloadLoading,
    error: workloadError,
    refetch: refetchWorkload,
  } = useQuery<GetAllStaffWorkloadQuery>(GetAllStaffWorkloadDocument, {
    errorPolicy: "all",
  });

  const isLoading = workloadLoading;
  const error = workloadError?.message || null;

  const handleRefresh = () => {
    refetchWorkload();
  };

  // Transform GraphQL data to component format
  const hasDataIssues =
    !teamWorkloadData?.users || teamWorkloadData.users.length === 0;
  const hasPartialData = (teamWorkloadData?.users?.length || 0) > 0;

  const teamMembers = teamWorkloadData?.users
    ? transformTeamWorkloadToMembers(teamWorkloadData.users)
    : [];

  // Handler functions for work schedule management
  const handleViewMember = (member: any) => {
    // Member details will be shown in the sheet
    console.log("Viewing member details:", member.computedName);
  };

  const handleEditSchedule = (member: any) => {
    // Navigate to schedule editing or show modal
    console.log("Editing schedule for:", member.computedName);
    // Could navigate to a dedicated editing page or open a modal
    router.push(`/work-schedule/${member.id}/edit`);
  };

  // Transform GraphQL data to component format
  function transformTeamWorkloadToMembers(
    users: GetAllStaffWorkloadQuery["users"]
  ) {
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

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Operation status notifications */}
      {operationStatus.type && (
        <Alert
          className={
            operationStatus.type === "success"
              ? "border-green-200 bg-green-50"
              : "border-red-200 bg-red-50"
          }
        >
          {operationStatus.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription
            className={
              operationStatus.type === "success"
                ? "text-green-800"
                : "text-red-800"
            }
          >
            {operationStatus.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Partial data warning */}
      {error && hasPartialData && (
        <Alert className="border-amber-200 bg-amber-50">
          <Info className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Some data may be incomplete</p>
                <p className="text-sm">{error}</p>
              </div>
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className="text-amber-700 border-amber-200 hover:bg-amber-100"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Page Header */}
      <PageHeader
        title="Work Schedule Management"
        description="Modern work schedule management with progressive disclosure"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Work Schedule" },
        ]}
      />

      {/* Manage Settings Action (permission-protected) */}
      <PermissionGuard
        resource="workschedule"
        action="manage"
        fallback={
          <Badge variant="outline" className="text-gray-600">
            <Users className="w-4 h-4 mr-1" />
            View Only
          </Badge>
        }
      >
        <Button variant="default" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Manage Settings
        </Button>
      </PermissionGuard>

      {/* Permission-protected content */}
      <PermissionGuard
        minRole="manager"
        fallback={
          <Card>
            <CardContent className="p-12">
              <div className="text-center space-y-4">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Personal Schedule View
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Contact your manager for full team overview and management
                    access.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => router.push("/schedule")}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  View My Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        }
      >
        <ModernWorkScheduleManager
          teamMembers={teamMembers}
          loading={isLoading}
          onViewMember={handleViewMember}
          onEditSchedule={handleEditSchedule}
        />
      </PermissionGuard>
    </div>
  );
}
