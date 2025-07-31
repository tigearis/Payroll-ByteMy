"use client";

/*
 * Work Schedule Management Page
 *
 * PERMISSION GUARDS SETUP:
 * 1. Uncomment the ManagerOnly import (search for "permission-guard")
 * 2. Wrap sections as follows:
 *    - HeaderSection: <ManagerOnly fallback={<ConsultantHeaderView />}>
 *    - StatsSection: <ManagerOnly fallback={<PersonalStatsView />}>
 *    - MainContentSection: <ManagerOnly fallback={<PersonalScheduleView />}>
 *
 * GENERATED QUERIES:
 * All inline GraphQL queries have been replaced with generated types:
 * - TestWorkScheduleBasicQuery
 * - TestAllUsersQuery
 * - GetAllStaffCapacityDashboardQuery
 * - GetAllStaffWorkloadQuery
 * - GetAvailableConsultantsQuery (already using generated)
 *
 * DATA STRUCTURE NOTES:
 * - workSchedules field access: data.workSchedules (plural, root query)
 * - userWorkSchedules field access: user.workSchedules (relationship)
 * - workScheduleUser field access: schedule.workScheduleUser (relationship)
 */

import { useQuery, useMutation } from "@apollo/client";
import { useUser } from "@clerk/nextjs";
import {
  Calendar,
  Users,
  Clock,
  TrendingUp,
  Zap,
  AlertTriangle,
  Info,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ManagerOnly, PermissionGuard } from "@/components/auth/permission-guard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GetPayrollsForBulkAssignmentDocument,
  type GetPayrollsForBulkAssignmentQuery,
} from "@/domains/payrolls/graphql/generated/graphql";
import { AssignmentWizard } from "@/domains/work-schedule/components/assignment-wizard";
import { CapacityDashboard } from "@/domains/work-schedule/components/capacity-dashboard";
import { CompactWorkloadCard } from "@/domains/work-schedule/components/compact-workload-card";
import { IndividualWorkloadCard } from "@/domains/work-schedule/components/individual-workload-card";
import {
  GetAvailableConsultantsDocument,
  UpsertWorkScheduleDocument,
  UpdateUserDefaultAdminTimeDocument,
  GetAllStaffWorkloadDocument,
  AssignPayrollToConsultantDocument,
  BulkAssignPayrollsDocument,
  type GetAvailableConsultantsQuery,
  type UpsertWorkScheduleMutation,
  type UpdateUserDefaultAdminTimeMutation,
  type GetAllStaffWorkloadQuery,
  type AssignPayrollToConsultantMutation,
  type BulkAssignPayrollsMutation,
} from "@/domains/work-schedule/graphql/generated/graphql";
import { usePayrollWorkload } from "@/domains/work-schedule/hooks/use-payroll-workload";

// Helper components for clean permission guard boundaries
const HeaderSection = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">{children}</div>
);

const StatsSection = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-6">{children}</div>
);

const MainContentSection = ({ children }: { children: React.ReactNode }) => (
  <div className="space-y-6">{children}</div>
);

// Enhanced workload visualization component with real data for work schedule page
const EnhancedWorkloadVisualization = ({
  member,
  onAssignmentClick,
}: {
  member: any;
  onAssignmentClick: (assignment: any) => void;
}) => {
  // Use the real payroll workload hook for this member
  const { workSchedule, loading, error } = usePayrollWorkload({
    userId: member.id,
    dateRange: {
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days ahead
    },
    enabled: true,
  });

  // Debug logging to see what the hook returns
  if (typeof window !== 'undefined' && workSchedule) {
    console.log('EnhancedWorkloadVisualization - Hook data:', {
      userId: member.id,
      userName: member.computedName || `${member.firstName || ''} ${member.lastName || ''}`.trim() || 'Unknown User',
      workScheduleLength: workSchedule.length,
      workScheduleSample: workSchedule.slice(0, 5),
      hasAssignments: workSchedule.some(day => day.assignments.length > 0),
      totalAssignments: workSchedule.reduce((sum, day) => sum + day.assignments.length, 0),
      sampleAssignments: workSchedule.filter(day => day.assignments.length > 0).slice(0, 2)
    });
  }

  if (loading) {
    return (
      <CompactWorkloadCard
        member={member}
        workSchedule={[]}
        loading={true}
        onAssignmentClick={onAssignmentClick}
      />
    );
  }

  if (error) {
    return (
      <CompactWorkloadCard
        member={member}
        workSchedule={[]}
        error={error.toString()}
        onAssignmentClick={onAssignmentClick}
      />
    );
  }

  // Use the individual workload card component to get all views with controls
  return (
    <IndividualWorkloadCard
      userId={member.id}
      userName={member.computedName || `${member.firstName || ''} ${member.lastName || ''}`.trim() || 'Unknown User'}
      userRole={member.position}
      workSchedule={workSchedule}
      onAssignmentClick={onAssignmentClick}
    />
  );
};

export default function WorkSchedulePage() {
  const [activeTab, setActiveTab] = useState("capacity");
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
  const [updateUserAdminTime] = useMutation<UpdateUserDefaultAdminTimeMutation>(
    UpdateUserDefaultAdminTimeDocument
  );

  // GraphQL mutations for payroll assignment
  const [assignPayrollToConsultant] =
    useMutation<AssignPayrollToConsultantMutation>(
      AssignPayrollToConsultantDocument
    );
  const [bulkAssignPayrolls] = useMutation<BulkAssignPayrollsMutation>(
    BulkAssignPayrollsDocument
  );

  // Debug: Check if user authentication is working
  console.log("Auth debug:", {
    currentUserId,
    userRole: user?.publicMetadata?.role,
    isAuthenticated: !!user,
  });

  const {
    data: consultantsData,
    loading: consultantsLoading,
    error: consultantsError,
    refetch: refetchConsultants,
  } = useQuery<GetAvailableConsultantsQuery>(GetAvailableConsultantsDocument, {
    errorPolicy: "all",
    onError: error => {
      console.error("GetAvailableConsultants error details:", {
        message: error.message,
        graphQLErrors: error.graphQLErrors,
        networkError: error.networkError,
      });
    },
  });

  // Query for team workload including payroll assignments - show all staff for now
  const {
    data: teamWorkloadData,
    loading: workloadLoading,
    error: workloadError,
    refetch: refetchWorkload,
  } = useQuery<GetAllStaffWorkloadQuery>(GetAllStaffWorkloadDocument, {
    errorPolicy: "all",
  });

  // Query for available payrolls for assignment
  const {
    data: payrollsData,
    loading: payrollsLoading,
    error: payrollsError,
    refetch: refetchPayrolls,
  } = useQuery<GetPayrollsForBulkAssignmentQuery>(
    GetPayrollsForBulkAssignmentDocument,
    {
      variables: {
        where: {
          supersededDate: { _isNull: true },
        },
      },
      errorPolicy: "all",
    }
  );

  const isLoading = consultantsLoading || workloadLoading || payrollsLoading;
  const error =
    consultantsError?.message ||
    workloadError?.message ||
    payrollsError?.message ||
    null;

  const handleRefresh = () => {
    refetchConsultants();
    refetchWorkload();
    refetchPayrolls();
  };

  // Transform GraphQL data to component format with real payroll assignments
  // Debug logging to see what data we're getting
  console.log("Debug - Raw query data:", {
    teamWorkloadData: teamWorkloadData?.users?.length || 0,
    consultantsData: consultantsData?.users?.length || 0,
    payrollsData: payrollsData?.payrolls?.length || 0,
    currentUserId,
    userRole: user?.publicMetadata?.role,
  });

  // Enhanced debug logging for work schedule data
  if (teamWorkloadData?.users && teamWorkloadData.users.length > 0) {
    console.log("Debug - First user work schedules:", {
      userName: teamWorkloadData.users[0].computedName || `${teamWorkloadData.users[0].firstName} ${teamWorkloadData.users[0].lastName}`.trim(),
      userWorkSchedules: teamWorkloadData.users[0].workSchedules,
      workScheduleCount:
        teamWorkloadData.users[0].workSchedules?.length || 0,
      primaryPayrolls:
        teamWorkloadData.users[0].primaryPayrollAssignments?.length || 0,
      backupPayrolls:
        teamWorkloadData.users[0].backupPayrollAssignments?.length || 0,
    });
  }

  // Debug empty data issues and provide detailed error information
  if (consultantsData?.users?.length === 0) {
    console.warn(
      "GetAvailableConsultants returned empty array - Check user authentication and database connectivity"
    );
  }
  if (teamWorkloadData?.users?.length === 0) {
    console.warn(
      "GetAllStaffWorkload returned empty array - Check if users have isStaff=true and isActive=true"
    );
  }

  // Enhanced error state detection
  const hasDataIssues =
    (!consultantsData?.users || consultantsData.users.length === 0) &&
    (!teamWorkloadData?.users || teamWorkloadData.users.length === 0) &&
    (!payrollsData?.payrolls || payrollsData.payrolls.length === 0);

  const hasPartialData =
    (consultantsData?.users?.length || 0) > 0 ||
    (teamWorkloadData?.users?.length || 0) > 0 ||
    (payrollsData?.payrolls?.length || 0) > 0;

  const teamMembers = teamWorkloadData?.users
    ? transformTeamWorkloadToMembers(teamWorkloadData.users)
    : [];

  const consultants = consultantsData?.users
    ? transformUsersToConsultants(consultantsData.users)
    : [];

  const payrolls = payrollsData?.payrolls
    ? transformPayrollsForAssignment(payrollsData.payrolls)
    : [];

  // Handler functions for work schedule updates
  const handleUpdateWorkSchedule = async (scheduleId: string, updates: any) => {
    try {
      // Calculate payroll capacity hours (work hours - admin hours)
      const workHours = updates.workHours ?? 8;
      const adminTimeHours = updates.usesDefaultAdminTime
        ? (workHours * (updates.defaultAdminTimePercentage || 12.5)) / 100
        : (updates.adminTimeHours ?? 1);
      const payrollCapacityHours = Math.max(0, workHours - adminTimeHours);

      // Extract user ID and work day from the schedule
      // For new schedules, scheduleId format is "new-{dayIndex}"
      const isNewSchedule = scheduleId.startsWith("new-");
      const dayIndex = isNewSchedule
        ? scheduleId.split("-")[1]
        : updates.workDay || "0";

      // Convert day index to day name for database storage
      const daysOfWeek = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];
      const workDay = isNewSchedule
        ? daysOfWeek[parseInt(dayIndex)]
        : updates.workDay || "Monday";

      // Find the user ID from the team member being edited
      const userId = updates.userId || currentUserId; // Fallback to current user for now

      await upsertWorkSchedule({
        variables: {
          userId,
          workDay,
          workHours,
          adminTimeHours,
          payrollCapacityHours,
          usesDefaultAdminTime: updates.usesDefaultAdminTime ?? true,
        },
      });

      // Refresh all data to show updated capacity
      refetchWorkload();
      refetchConsultants();

      setOperationStatus({
        type: "success",
        message: "Work schedule updated successfully",
      });
      setTimeout(() => setOperationStatus({ type: null, message: "" }), 3000);
    } catch (error) {
      console.error("Failed to update work schedule:", error);
      setOperationStatus({
        type: "error",
        message: "Failed to update work schedule",
      });
      setTimeout(() => setOperationStatus({ type: null, message: "" }), 5000);
    }
  };

  const handleUpdateAdminTime = async (userId: string, percentage: number) => {
    try {
      await updateUserAdminTime({
        variables: {
          userId,
          defaultAdminTimePercentage: percentage,
        },
      });

      // Refresh all data to show updated capacity
      refetchWorkload();
      refetchConsultants();

      setOperationStatus({
        type: "success",
        message: "Default admin time updated successfully",
      });
      setTimeout(() => setOperationStatus({ type: null, message: "" }), 3000);
    } catch (error) {
      console.error("Failed to update admin time:", error);
      setOperationStatus({
        type: "error",
        message: "Failed to update admin time",
      });
      setTimeout(() => setOperationStatus({ type: null, message: "" }), 5000);
    }
  };

  // Handler for clicking on payroll assignments to navigate to payroll page
  const handlePayrollClick = (assignment: any) => {
    console.log("PayrollClick - Assignment received:", {
      type: typeof assignment,
      value: assignment,
      isString: typeof assignment === "string",
      hasId: assignment?.id,
      id: assignment?.id,
    });

    // Handle different assignment object formats
    let payrollId: string;

    if (typeof assignment === "string") {
      // If assignment is passed as a string ID directly
      payrollId = assignment;
      console.log("Using assignment as string ID:", payrollId);
    } else if (assignment && assignment.id) {
      // If assignment is an object with id property
      payrollId = assignment.id;
      console.log("Using assignment.id:", payrollId);
    } else {
      console.error(
        "PayrollClick - Could not determine payroll ID from assignment:",
        assignment
      );
      return;
    }

    console.log("Final payrollId for navigation:", payrollId);
    router.push(`/payrolls/${payrollId}`);
  };

  // Handler for single payroll assignment
  const handleAssignPayroll = async (
    payrollId: string,
    consultantId: string,
    startDate: string
  ) => {
    try {
      console.log("Assigning payroll:", { payrollId, consultantId, startDate });

      await assignPayrollToConsultant({
        variables: {
          payrollId,
          primaryConsultantUserId: consultantId,
          // Set manager as current user if they have manager+ role
          managerUserId: currentUserId,
        },
      });

      // Refresh data to show updated assignments
      refetchWorkload();
      refetchConsultants();
      refetchPayrolls();

      setOperationStatus({
        type: "success",
        message: "Payroll assigned successfully",
      });
      setTimeout(() => setOperationStatus({ type: null, message: "" }), 3000);
    } catch (error) {
      console.error("Failed to assign payroll:", error);
      setOperationStatus({
        type: "error",
        message: "Failed to assign payroll",
      });
      setTimeout(() => setOperationStatus({ type: null, message: "" }), 5000);
    }
  };

  // Handler for bulk payroll assignments
  const handleBulkAssign = async (
    assignments: Array<{
      payrollId: string;
      consultantId: string;
      startDate: string;
    }>
  ) => {
    try {
      console.log("Bulk assigning payrolls:", assignments);

      // Group assignments by consultant to optimize mutations
      const assignmentsByConsultant = assignments.reduce(
        (acc, assignment) => {
          if (!acc[assignment.consultantId]) {
            acc[assignment.consultantId] = [];
          }
          acc[assignment.consultantId].push(assignment.payrollId);
          return acc;
        },
        {} as Record<string, string[]>
      );

      // Execute bulk assignments for each consultant
      for (const [consultantId, payrollIds] of Object.entries(
        assignmentsByConsultant
      )) {
        await bulkAssignPayrolls({
          variables: {
            payrollIds,
            primaryConsultantUserId: consultantId,
            managerUserId: currentUserId,
          },
        });
      }

      // Refresh data to show updated assignments
      refetchWorkload();
      refetchConsultants();
      refetchPayrolls();

      setOperationStatus({
        type: "success",
        message: `Bulk assignment completed: ${assignments.length} payrolls assigned`,
      });
      setTimeout(() => setOperationStatus({ type: null, message: "" }), 3000);
    } catch (error) {
      console.error("Failed to bulk assign payrolls:", error);
      setOperationStatus({
        type: "error",
        message: "Failed to complete bulk assignment",
      });
      setTimeout(() => setOperationStatus({ type: null, message: "" }), 5000);
    }
  };

  // Enhanced data transformation functions with real payroll assignments
  function transformTeamWorkloadToMembers(
    users: GetAllStaffWorkloadQuery["users"]
  ) {
    return users.map(user => {
      // Calculate assigned hours from payroll assignments
      const primaryPayrollHours = user.primaryPayrollAssignments.reduce(
        (total: number, payroll: any) => {
          return total + (payroll.processingTime || 0);
        },
        0
      );

      const backupPayrollHours = user.backupPayrollAssignments.reduce(
        (total: number, payroll: any) => {
          // Backup consultants typically handle 25% of processing time
          return total + (payroll.processingTime || 0) * 0.25;
        },
        0
      );

      const totalAssignedHours = primaryPayrollHours + backupPayrollHours;

      // Calculate total capacity from work schedules - use userWorkSchedules with null safety
      const workSchedules = user.workSchedules || [];
      const totalWorkHours = workSchedules.reduce(
        (sum, s) => sum + (s.workHours || 0),
        0
      );
      const totalAdminHours = workSchedules.reduce(
        (sum, s) => sum + (s.adminTimeHours || 0),
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
        computedName: user.computedName || `${user.firstName} ${user.lastName}`.trim(),
        email: user.email,
        position: user.role,
        defaultAdminTimePercentage: user.defaultAdminTimePercentage || 12.5,
        isStaff: true, // All users in team workload query are staff
        skills:
          user.skills?.map(skill => ({
            name: skill.skillName || "",
            proficiency: skill.proficiencyLevel || "",
          })) || [],
        workSchedules: workSchedules.map(schedule => ({
          id: schedule.id,
          workDay: schedule.workDay,
          workHours: schedule.workHours || 0,
          adminTimeHours: schedule.adminTimeHours || 0,
          payrollCapacityHours: schedule.payrollCapacityHours || 0,
          usesDefaultAdminTime: schedule.usesDefaultAdminTime || false,
        })),
        assignedPayrolls: [
          ...(user.primaryPayrollAssignments || []).map(payroll => ({
            id: payroll.id,
            name: payroll.name,
            processingTime: payroll.processingTime || 0,
            processingDaysBeforeEft: payroll.processingDaysBeforeEft || 0,
            status: payroll.status,
            role: "primary" as const,
            nextEftDate:
              (payroll.payrollDates &&
                payroll.payrollDates[0]?.adjustedEftDate) ||
              null,
            requiredSkills:
              payroll.requiredSkills?.map((skill: any) => ({
                name: skill.skillName || "",
                requiredLevel: skill.requiredLevel || "",
              })) || [],
          })),
          ...(user.backupPayrollAssignments || []).map(payroll => ({
            id: payroll.id,
            name: payroll.name,
            processingTime: (payroll.processingTime || 0) * 0.25, // 25% for backup
            processingDaysBeforeEft: payroll.processingDaysBeforeEft || 0,
            status: payroll.status,
            role: "backup" as const,
            nextEftDate:
              (payroll.payrollDates &&
                payroll.payrollDates[0]?.adjustedEftDate) ||
              null,
            requiredSkills:
              payroll.requiredSkills?.map((skill: any) => ({
                name: skill.skillName || "",
                requiredLevel: skill.requiredLevel || "",
              })) || [],
          })),
        ],
        capacity: {
          consultantId: user.id,
          totalWorkHours,
          totalAdminHours,
          totalPayrollCapacity,
          currentlyAssignedHours: totalAssignedHours,
          availableCapacityHours: Math.max(
            0,
            totalPayrollCapacity - totalAssignedHours
          ),
          utilizationPercentage,
          adminTimePercentage: user.defaultAdminTimePercentage || 12.5,
          processingWindowDays: workSchedules.filter(
            s => (s.workHours || 0) > 0
          ).length,
        },
      };
    });
  }

  function transformUsersToConsultants(
    users: GetAvailableConsultantsQuery["users"]
  ) {
    if (!users || users.length === 0) {
      console.warn("transformUsersToConsultants: No users provided");
      return [];
    }

    return users.map(user => {
      const workSchedules = user.workSchedules || [];
      const totalWorkHours = workSchedules.reduce(
        (sum, s) => sum + (s.workHours || 0),
        0
      );
      const totalAdminHours = workSchedules.reduce(
        (sum, s) => sum + (s.adminTimeHours || 0),
        0
      );
      const totalPayrollCapacity = workSchedules.reduce(
        (sum, s) => sum + (s.payrollCapacityHours || 0),
        0
      );

      return {
        id: user.id,
        name: user.computedName || `${user.firstName} ${user.lastName}`.trim(),
        email: user.email,
        position: user.role,
        defaultAdminTimePercentage: user.defaultAdminTimePercentage || 12.5,
        isStaff: true,
        skills:
          user.skills?.map(skill => ({
            name: skill.skillName || "",
            proficiency: skill.proficiencyLevel || "",
          })) || [],
        workSchedules: workSchedules.map(schedule => ({
          workDay: schedule.workDay,
          workHours: schedule.workHours || 0,
          adminTimeHours: schedule.adminTimeHours || 0,
          payrollCapacityHours: schedule.payrollCapacityHours || 0,
        })),
        assignedPayrolls: [], // Default empty - would be populated from workload data
        capacity: {
          consultantId: user.id,
          totalWorkHours,
          totalAdminHours,
          totalPayrollCapacity,
          currentlyAssignedHours: 0, // Will be calculated from team workload data
          availableCapacityHours: totalPayrollCapacity,
          utilizationPercentage: 0, // Will be calculated from team workload data
          adminTimePercentage: user.defaultAdminTimePercentage || 12.5,
          processingWindowDays: workSchedules.filter(
            s => (s.workHours || 0) > 0
          ).length,
        },
        conflicts: [], // Default empty conflicts
      };
    });
  }

  function transformPayrollsForAssignment(
    payrolls: GetPayrollsForBulkAssignmentQuery["payrolls"]
  ) {
    if (!payrolls || payrolls.length === 0) {
      console.warn("transformPayrollsForAssignment: No payrolls provided");
      return [];
    }

    return payrolls.map((payroll: any) => ({
      id: payroll.id,
      name: payroll.name,
      clientName: payroll.client?.name || "Unknown Client",
      processingTime: payroll.processingTime || 0,
      processingDaysBeforeEft: payroll.processingDaysBeforeEft || 0,
      complexity: (payroll.employeeCount > 50
        ? "high"
        : payroll.employeeCount > 20
          ? "medium"
          : "low") as "low" | "medium" | "high",
      requiredSkills:
        payroll.requiredSkills?.map((skill: any) => ({
          name: skill.skillName || "",
          requiredLevel: skill.requiredLevel || "",
        })) || [],
      payrollDates:
        payroll.payrollDates?.map((date: any) => ({
          adjustedEftDate: date.adjustedEftDate,
          originalEftDate: date.originalEftDate,
        })) || [],
    }));
  }

  // Enhanced error and loading states
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Loading Work Schedule Data
          </h3>
          <p className="text-gray-600">
            Fetching team capacity and assignment information...
          </p>
        </div>
      </div>
    );
  }

  if (error && !hasPartialData) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="space-y-2">
              <p className="font-medium">Failed to load work schedule data</p>
              <p className="text-sm">{error}</p>
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className="mt-2 text-red-700 border-red-200 hover:bg-red-100"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (hasDataIssues && !isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <HeaderSection>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Work Schedule Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage consultant capacity, workload distribution, and assignment
              optimization
            </p>
          </div>
        </HeaderSection>

        <Card>
          <CardContent className="p-12">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  No Work Schedule Data Available
                </h3>
                <p className="text-gray-600 mt-1 max-w-md mx-auto">
                  It looks like there are no active staff members or work
                  schedules configured yet.
                </p>
              </div>
              <div className="space-y-2 text-sm text-gray-500">
                <p>Possible causes:</p>
                <ul className="list-disc list-inside space-y-1 text-left max-w-md mx-auto">
                  <li>
                    No staff members marked as active (isStaff=true,
                    isActive=true)
                  </li>
                  <li>No work schedules configured for team members</li>
                  <li>Authentication or database connectivity issues</li>
                </ul>
              </div>
              <div className="flex gap-3 justify-center">
                <Button onClick={handleRefresh} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Data
                </Button>
                <Button variant="default" onClick={() => router.push("/staff")}>
                  <Users className="w-4 h-4 mr-2" />
                  Manage Staff
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
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

      {/* Page Header with permission guard */}
      <HeaderSection>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Work Schedule Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage consultant capacity, workload distribution, and assignment
            optimization
          </p>
        </div>

        <PermissionGuard permission="workschedule.manage" fallback={
          <Badge variant="outline" className="text-gray-600">
            <Users className="w-4 h-4 mr-1" />
            View Only
          </Badge>
        }>
          <Badge
            variant="default"
            className="bg-green-100 text-green-800 border-green-200"
          >
            <Users className="w-4 h-4 mr-1" />
            Full Management Access
          </Badge>
        </PermissionGuard>
      </HeaderSection>

      {/* Quick Stats Summary - Manager Dashboard */}
      <StatsSection>
        <ManagerOnly fallback={
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Personal Schedule View
                </h3>
                <p className="text-sm text-gray-600">
                  Contact your manager for full team overview access.
                </p>
              </div>
            </CardContent>
          </Card>
        }>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Consultants
                  </p>
                  <p className="text-2xl font-bold">
                    {teamMembers?.length || 0}
                    {teamMembers?.length === 0 && (
                      <span className="text-sm text-gray-400 ml-1">
                        No data
                      </span>
                    )}
                  </p>
                </div>
                <Users
                  className={`h-8 w-8 ${teamMembers?.length > 0 ? "text-blue-600" : "text-gray-400"}`}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Average Utilization
                  </p>
                  <p className="text-2xl font-bold">
                    {teamMembers?.length > 0 ? (
                      `${Math.round(teamMembers.reduce((sum, member) => sum + (member.capacity?.utilizationPercentage || 0), 0) / teamMembers.length)}%`
                    ) : (
                      <span className="text-sm text-gray-400">N/A</span>
                    )}
                  </p>
                </div>
                <TrendingUp
                  className={`h-8 w-8 ${teamMembers?.length > 0 ? "text-green-600" : "text-gray-400"}`}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Available Capacity
                  </p>
                  <p className="text-2xl font-bold">
                    {teamMembers?.length > 0 ? (
                      `${Math.round(teamMembers.reduce((sum, member) => sum + (member.capacity?.availableCapacityHours || 0), 0))}h`
                    ) : (
                      <span className="text-sm text-gray-400">N/A</span>
                    )}
                  </p>
                </div>
                <Clock
                  className={`h-8 w-8 ${teamMembers?.length > 0 ? "text-purple-600" : "text-gray-400"}`}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Overutilized
                  </p>
                  <p className="text-2xl font-bold">
                    {teamMembers?.length > 0 ? (
                      teamMembers.filter(
                        member =>
                          (member.capacity?.utilizationPercentage || 0) > 100
                      ).length
                    ) : (
                      <span className="text-sm text-gray-400">N/A</span>
                    )}
                  </p>
                </div>
                <AlertTriangle
                  className={`h-8 w-8 ${teamMembers?.length > 0 ? "text-red-600" : "text-gray-400"}`}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        </ManagerOnly>
      </StatsSection>

      {/* Main Content Tabs - Manager Functions */}
      <MainContentSection>
        <ManagerOnly fallback={
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Personal Work Schedule
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  You can view your personal work schedule and assignments here.
                </p>
                <Button variant="outline" onClick={() => router.push("/schedule")}>
                  <Calendar className="w-4 h-4 mr-2" />
                  View My Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        }>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList
            className={`grid w-full ${process.env.NODE_ENV === "development" ? "grid-cols-3" : "grid-cols-2"}`}
          >
            <TabsTrigger value="capacity" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Capacity Dashboard
            </TabsTrigger>
            {/* Only show Assignment Wizard in development */}
            {process.env.NODE_ENV === "development" && (
              <TabsTrigger
                value="assignment"
                className="flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Assignment Wizard (Dev)
              </TabsTrigger>
            )}
            <TabsTrigger value="workload" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Workload Visualization
            </TabsTrigger>
          </TabsList>

          <TabsContent value="capacity" className="mt-6">
            <CapacityDashboard
              teamMembers={teamMembers}
              managerId=""
              dateRange={{
                startDate: "2025-01-01",
                endDate: "2025-01-31",
              }}
              isLoading={isLoading}
              error={error}
              onRefresh={handleRefresh}
              onUpdateWorkSchedule={handleUpdateWorkSchedule}
              onUpdateAdminTime={handleUpdateAdminTime}
              onPayrollClick={handlePayrollClick}
            />
          </TabsContent>

          {/* Assignment Wizard - Development Only */}
          {process.env.NODE_ENV === "development" && (
            <TabsContent value="assignment" className="mt-6">
              <AssignmentWizard
                payrolls={payrolls}
                consultants={consultants}
                isLoading={isLoading}
                error={error}
                onRefresh={handleRefresh}
                onAssignPayroll={handleAssignPayroll}
                onBulkAssign={handleBulkAssign}
              />
            </TabsContent>
          )}

          <TabsContent value="workload" className="mt-6">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Team Workload Visualization
                </h3>
                <p className="text-sm text-gray-600">
                  Weekly workload distribution and capacity utilization for each
                  team member. Processing time is automatically distributed across
                  working days (excluding weekends and holidays).
                </p>
              </div>

              {/* Chart Legend */}
              <Card className="bg-gray-50/50 border-gray-200">
                <CardContent className="p-3">
                  <div className="flex flex-wrap justify-center items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-gray-200 border border-gray-300"></div>
                      <span className="text-gray-700">Available</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-green-500"></div>
                      <span className="text-gray-700">Optimal (&lt;85%)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-yellow-500"></div>
                      <span className="text-gray-700">High (85-100%)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-red-500"></div>
                      <span className="text-gray-700">At Capacity</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-red-700"></div>
                      <span className="text-gray-700">Overallocated</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {teamMembers && teamMembers.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 auto-rows-fr">
                  {teamMembers.map(member => (
                    <div key={member.id} className="w-full">
                      <EnhancedWorkloadVisualization
                        member={member}
                        onAssignmentClick={handlePayrollClick}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Card className="max-w-md mx-auto">
                    <CardContent className="p-8 text-center">
                      <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        No Team Members Found
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Add consultants to see their workload visualization
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => router.push("/staff")}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Manage Staff
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        </ManagerOnly>
      </MainContentSection>
      {/* End of permission-protected content */}
    </div>
  );
}
