"use client";

import { Info } from "lucide-react";
import React, { useMemo } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { useWorkloadState } from "../hooks";
import { useTeamWorkloadGraphQL } from "../hooks/use-team-workload-graphql";
import { PayrollWorkloadVisualizationProps, TeamMember } from "../types/workload";
import CapacityStats from "./capacity-stats";
import { EnhancedTimeNavigation } from "./time-navigation";
import WorkloadCalendar from "./workload-calendar";
import WorkloadChart from "./workload-chart";
import WorkloadSummary from "./workload-summary";

// Utility function to determine utilization level
function getUtilizationLevel(utilization: number) {
  if (utilization < 70) return "underutilized" as const;
  if (utilization <= 85) return "optimal" as const;
  if (utilization <= 100) return "high" as const;
  return "overallocated" as const;
}

// Single member visualization component
export interface SingleMemberVisualizationProps {
  member: TeamMember;
  viewPeriod: string;
  currentDate: Date;
  selectedView: string;
  onAssignmentClick?: (assignment: any) => void;
}

export const SingleMemberVisualization: React.FC<SingleMemberVisualizationProps> = ({
  member,
  viewPeriod,
  currentDate,
  selectedView,
  onAssignmentClick,
}) => {
  // Calculate summary data from member's work schedule based on view period
  const summaryData = useMemo(() => {
    if (!member.workSchedule.length) {
      return {
        periods: [],
        summary: {
          totalCapacity: 0,
          totalAssigned: 0,
          avgUtilization: 0,
          overallocatedPeriods: 0,
          underutilizedPeriods: 0,
          periodsShown: 0,
          utilizationTrend: "stable" as const,
          peakUtilization: 0,
          minUtilization: 0,
          capacityEfficiency: 0,
        },
      };
    }

    // Aggregate data based on view period to ensure chart matches toggle
    let periods: any[] = [];

    if (viewPeriod === "day") {
      // Show just today
      const dayData = member.workSchedule.find(ws => 
        new Date(ws.date).toDateString() === currentDate.toDateString()
      );

      if (dayData) {
        const totalAssignedHours = dayData.assignments.reduce(
          (sum, assignment) => sum + assignment.processingTime, 0
        );
        const utilization = dayData.payrollCapacityHours 
          ? Math.round((totalAssignedHours / dayData.payrollCapacityHours) * 100) : 0;

        periods = [{
          date: dayData.date,
          period: new Date(dayData.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          fullDate: dayData.date,
          workHours: dayData.workHours,
          adminTimeHours: dayData.adminTimeHours,
          payrollCapacityHours: dayData.payrollCapacityHours,
          assignedHours: totalAssignedHours,
          utilization,
          utilizationLevel: getUtilizationLevel(utilization),
          utilizationHours: Math.min(totalAssignedHours, dayData.payrollCapacityHours),
          overflowHours: Math.max(0, totalAssignedHours - dayData.payrollCapacityHours),
          assignments: dayData.assignments,
          isOverallocated: utilization > 100,
          isUnderutilized: utilization < 70,
        }];
      }
    } else if (viewPeriod === "week") {
      // Show 7 days of current week
      const startOfWeekDate = new Date(currentDate);
      const day = startOfWeekDate.getDay();
      const diff = startOfWeekDate.getDate() - day + (day === 0 ? -6 : 1); // Monday start
      startOfWeekDate.setDate(diff);

      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeekDate);
        date.setDate(startOfWeekDate.getDate() + i);
        
        const dayData = member.workSchedule.find(ws => 
          new Date(ws.date).toDateString() === date.toDateString()
        );

        const totalAssignedHours = dayData?.assignments.reduce(
          (sum, assignment) => sum + assignment.processingTime, 0
        ) || 0;
        const capacity = dayData?.payrollCapacityHours || 0;
        const utilization = capacity ? Math.round((totalAssignedHours / capacity) * 100) : 0;

        periods.push({
          date: date.toISOString().split('T')[0],
          period: date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
          fullDate: date.toISOString().split('T')[0],
          workHours: dayData?.workHours || 0,
          adminTimeHours: dayData?.adminTimeHours || 0,
          payrollCapacityHours: capacity,
          assignedHours: totalAssignedHours,
          utilization,
          utilizationLevel: getUtilizationLevel(utilization),
          utilizationHours: Math.min(totalAssignedHours, capacity),
          overflowHours: Math.max(0, totalAssignedHours - capacity),
          assignments: dayData?.assignments || [],
          isOverallocated: utilization > 100,
          isUnderutilized: utilization < 70,
        });
      }
    } else if (viewPeriod === "month") {
      // Show weeks of current month
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const weekStart = new Date(monthStart);
      const day = weekStart.getDay();
      const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
      weekStart.setDate(diff);

      let weekNumber = 1;
      while (weekStart <= monthEnd) {
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        // Get all days in this week that are in the current month
        const weekData = member.workSchedule.filter(ws => {
          const wsDate = new Date(ws.date);
          return wsDate >= weekStart && wsDate <= weekEnd && 
                 wsDate.getMonth() === currentDate.getMonth();
        });

        const totalCapacity = weekData.reduce((sum, day) => sum + day.payrollCapacityHours, 0);
        const totalAssigned = weekData.reduce((sum, day) => 
          sum + day.assignments.reduce((assignSum, assignment) => assignSum + assignment.processingTime, 0), 0
        );
        const utilization = totalCapacity ? Math.round((totalAssigned / totalCapacity) * 100) : 0;

        if (weekData.length > 0) { // Only include weeks with data
          periods.push({
            date: weekStart.toISOString().split('T')[0],
            period: `Week ${weekNumber}`,
            fullDate: weekStart.toISOString().split('T')[0],
            workHours: weekData.reduce((sum, day) => sum + day.workHours, 0),
            adminTimeHours: weekData.reduce((sum, day) => sum + day.adminTimeHours, 0),
            payrollCapacityHours: totalCapacity,
            assignedHours: totalAssigned,
            utilization,
            utilizationLevel: getUtilizationLevel(utilization),
            utilizationHours: Math.min(totalAssigned, totalCapacity),
            overflowHours: Math.max(0, totalAssigned - totalCapacity),
            assignments: weekData.flatMap(day => day.assignments),
            isOverallocated: utilization > 100,
            isUnderutilized: utilization < 70,
          });
        }

        weekStart.setDate(weekStart.getDate() + 7);
        weekNumber++;
      }
    }

    // Calculate summary
    const totalCapacity = periods.reduce((sum, p) => sum + p.payrollCapacityHours, 0);
    const totalAssigned = periods.reduce((sum, p) => sum + p.assignedHours, 0);
    const avgUtilization = periods.length > 0 
      ? Math.round(periods.reduce((sum, p) => sum + p.utilization, 0) / periods.length)
      : 0;
    const overallocatedPeriods = periods.filter(p => p.isOverallocated).length;
    const underutilizedPeriods = periods.filter(p => p.isUnderutilized).length;

    return {
      periods,
      summary: {
        totalCapacity: Math.round(totalCapacity),
        totalAssigned: Math.round(totalAssigned * 10) / 10,
        avgUtilization,
        overallocatedPeriods,
        underutilizedPeriods,
        periodsShown: periods.length,
        utilizationTrend: "stable" as const,
        peakUtilization: periods.length > 0 ? Math.max(...periods.map(p => p.utilization)) : 0,
        minUtilization: periods.length > 0 ? Math.min(...periods.map(p => p.utilization)) : 0,
        capacityEfficiency: Math.round(avgUtilization),
      },
    };
  }, [member.workSchedule, viewPeriod, currentDate]);

  return (
    <Card className="h-full flex flex-col border border-border/50 shadow-sm hover:shadow-md transition-shadow">
      {/* Member Header */}
      <div className="p-3 border-b flex-shrink-0 bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-base">{member.userName}</h3>
            <p className="text-xs text-muted-foreground capitalize">{member.userRole}</p>
          </div>
          <div className="text-xs text-muted-foreground px-2 py-1 bg-background/80 rounded-md">
            {selectedView === "chart" ? "Chart" : "Calendar"}
          </div>
        </div>
      </div>

      <CardContent className="p-3 space-y-4 flex-1 flex flex-col min-h-0">
        {/* Chart Visualization */}
        <div className="flex-shrink-0 h-64">
          <WorkloadChart
            data={summaryData.periods}
            viewPeriod={viewPeriod as any}
            height={250}
            onAssignmentClick={onAssignmentClick}
            showLegend={false}
          />
        </div>

        {/* Summary View */}
        <div className="flex-1 min-h-0">
          <WorkloadSummary
            workSchedule={member.workSchedule}
            viewPeriod={viewPeriod as any}
            currentDate={currentDate}
            onAssignmentClick={onAssignmentClick}
          />
        </div>
      </CardContent>
    </Card>
  );
};

// Main dashboard component
const PayrollWorkloadDashboard: React.FC<PayrollWorkloadVisualizationProps> = ({
  teamMembers,
  // Legacy props
  userId,
  userName,
  userRole,
  workSchedule,
  // Common props
  viewMode = "consultant",
  onAssignmentClick,
  className,
}) => {
  const { state, actions } = useWorkloadState({
    initialState: {
      selectedView: "chart",
      viewPeriod: "week",
      currentDate: new Date(),
    },
  });

  // Get team workload data from GraphQL
  const { teamMembers: graphqlTeamMembers, loading, error } = useTeamWorkloadGraphQL({
    includeAllStaff: true, // For now, show all staff
  });

  // Handle both new and legacy formats, with GraphQL data as fallback
  const resolvedTeamMembers: TeamMember[] = useMemo(() => {
    // If teamMembers array is provided, use it
    if (teamMembers && Array.isArray(teamMembers)) {
      return teamMembers;
    }
    
    // If legacy format is provided, convert to new format
    if (userId && userName && userRole && workSchedule) {
      return [{
        userId,
        userName,
        userRole,
        email: undefined,
        avatarUrl: undefined,
        isActive: true,
        workSchedule,
        skills: undefined,
        managerId: undefined,
      }];
    }
    
    // Use GraphQL data as fallback
    return graphqlTeamMembers || [];
  }, [teamMembers, userId, userName, userRole, workSchedule, graphqlTeamMembers]);

  return (
    <div className={`space-y-4 p-2 sm:p-4 ${className || ""}`}>
      {/* Global Controls */}
      <Card className="shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <EnhancedTimeNavigation
            viewPeriod={state.viewPeriod}
            currentDate={state.currentDate}
            selectedView={state.selectedView}
            onPeriodChange={actions.setViewPeriod}
            onDateChange={actions.setCurrentDate}
            onNavigate={actions.navigatePeriod}
            onViewChange={actions.setSelectedView}
            showViewToggle={true}
          />
        </CardContent>
      </Card>

      {/* Chart Legend */}
      <Card className="mx-2 sm:mx-0 bg-muted/30">
        <CardContent className="p-3">
          <div className="flex flex-wrap justify-center items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-gray-200 border border-gray-300"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-green-500"></div>
              <span>Optimal (&lt;85%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-yellow-500"></div>
              <span>High (85-100%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-red-500"></div>
              <span>At Capacity</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-red-700"></div>
              <span>Overallocated</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer Alert */}
      <Alert className="mx-2 sm:mx-0">
        <Info className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>Note:</strong> Processing time estimates based on available capacity. 
          Actual times may vary by payroll complexity.
        </AlertDescription>
      </Alert>

      {/* Team Members Grid */}
      {loading ? (
        <Card>
          <CardContent className="p-8 flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-muted-foreground">Loading team workload data...</span>
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-destructive">
              <div className="font-medium mb-2">Error loading workload data</div>
              <div className="text-sm text-muted-foreground">{error}</div>
            </div>
          </CardContent>
        </Card>
      ) : resolvedTeamMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 auto-rows-fr">
          {resolvedTeamMembers.map((member) => (
            <div key={member.userId} className="min-h-[480px] max-h-[520px]">
              <SingleMemberVisualization
                member={member}
                viewPeriod={state.viewPeriod}
                currentDate={state.currentDate}
                selectedView={state.selectedView}
                onAssignmentClick={onAssignmentClick}
              />
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground">
              No team members to display. Add team members to see their workload visualizations.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default React.memo(PayrollWorkloadDashboard);