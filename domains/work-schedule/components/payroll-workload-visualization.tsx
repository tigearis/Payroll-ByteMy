"use client";

import {
  format,
  startOfWeek,
  addDays,
  addWeeks,
  startOfMonth,
  addMonths,
  parseISO,
  isSameDay,
  isSameWeek,
  isSameMonth,
} from "date-fns";
import {
  Calendar as CalendarIcon,
  BarChart3,
  Clock,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  AlertTriangle,
  Info,
} from "lucide-react";
import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from "recharts";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import the new dashboard
import PayrollWorkloadDashboard from "./payroll-workload-dashboard";

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface PayrollAssignment {
  id: string;
  name: string;
  clientName: string;
  processingTime: number; // hours
  processingDaysBeforeEft: number;
  eftDate: string;
  status: "active" | "pending" | "completed";
  priority: "high" | "medium" | "low";
}

interface WorkScheduleDay {
  date: string;
  workHours: number;
  adminTimeHours: number;
  payrollCapacityHours: number;
  assignments: PayrollAssignment[];
}

interface TeamMember {
  userId: string;
  userName: string;
  userRole: string;
  workSchedule: WorkScheduleDay[];
  isActive: boolean;
}

interface PayrollWorkloadVisualizationProps {
  // New format - array of team members
  teamMembers?: TeamMember[];
  
  // Legacy format - single user (for backward compatibility)
  userId?: string;
  userName?: string;
  userRole?: string;
  workSchedule?: WorkScheduleDay[];
  
  // Common props
  viewMode?: "consultant" | "manager";
  showCapacityComparison?: boolean;
  onAssignmentClick?: (assignment: PayrollAssignment) => void;
}

interface SingleMemberVisualizationProps {
  userId: string;
  userName: string;
  userRole: string;
  workSchedule: WorkScheduleDay[];
  viewPeriod: ViewPeriod;
  currentDate: Date;
  selectedView: "chart" | "calendar";
  onAssignmentClick?: (assignment: PayrollAssignment) => void;
}

type ViewPeriod = "day" | "week" | "month";

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "#22c55e";
    case "pending":
      return "#f59e0b";
    case "completed":
      return "#6b7280";
    default:
      return "#8b5cf6";
  }
};

// Note: Time distribution is handled by the usePayrollWorkload hook
// which already distributes processing time across working days properly

const aggregateDataByPeriod = (
  workSchedule: WorkScheduleDay[],
  period: ViewPeriod,
  currentDate: Date,
  holidays: string[] = []
) => {
  const data: any[] = [];

  if (period === "day") {
    // Show just today
    const date = currentDate;
    const dayData = workSchedule.find(ws => isSameDay(parseISO(ws.date), date));

    // Use the assignments as-is since the hook already distributed the processing time
    const totalAssignedHours =
      dayData?.assignments?.reduce(
        (sum, assignment) => sum + assignment.processingTime,
        0
      ) || 0;

    const capacity = dayData?.payrollCapacityHours || 0;
    const utilization = capacity
      ? Math.round((totalAssignedHours / capacity) * 100)
      : 0;

    data.push({
      period: format(date, "EEEE, MMM dd"),
      fullDate: format(date, "yyyy-MM-dd"),
      workHours: dayData?.workHours || 0,
      adminTimeHours: dayData?.adminTimeHours || 0,
      payrollCapacityHours: capacity,
      assignedHours: totalAssignedHours,
      assignments: dayData?.assignments || [],
      utilization: utilization,
      // Stacked chart data
      capacityBase: capacity,
      utilizationHours: Math.min(totalAssignedHours, capacity), // Cap at capacity for visual
      overflowHours: Math.max(0, totalAssignedHours - capacity), // For overallocation
    });
  } else if (period === "week") {
    // Show 7 days of the current week
    const startWeek = startOfWeek(currentDate, { weekStartsOn: 1 });

    for (let i = 0; i < 7; i++) {
      const date = addDays(startWeek, i);
      const dayData = workSchedule.find(ws =>
        isSameDay(parseISO(ws.date), date)
      );

      // Use the assignments as-is since the hook already distributed the processing time
      const totalAssignedHours =
        dayData?.assignments?.reduce(
          (sum, assignment) => sum + assignment.processingTime,
          0
        ) || 0;

      const capacity = dayData?.payrollCapacityHours || 0;
      const utilization = capacity
        ? Math.round((totalAssignedHours / capacity) * 100)
        : 0;

      data.push({
        period: format(date, "EEE dd"),
        fullDate: format(date, "yyyy-MM-dd"),
        workHours: dayData?.workHours || 0,
        adminTimeHours: dayData?.adminTimeHours || 0,
        payrollCapacityHours: capacity,
        assignedHours: totalAssignedHours,
        assignments: dayData?.assignments || [],
        utilization: utilization,
        // Stacked chart data
        capacityBase: capacity,
        utilizationHours: Math.min(totalAssignedHours, capacity), // Cap at capacity for visual
        overflowHours: Math.max(0, totalAssignedHours - capacity), // For overallocation
      });
    }
  } else if (period === "month") {
    // Show weeks of the current month
    const monthStart = startOfMonth(currentDate);
    const monthEnd = new Date(
      monthStart.getFullYear(),
      monthStart.getMonth() + 1,
      0
    );

    // Get all weeks that intersect with this month
    let currentWeek = startOfWeek(monthStart, { weekStartsOn: 1 });

    while (currentWeek <= monthEnd) {
      const weekEnd = addDays(currentWeek, 6);

      // Get days in this week that are within the current month
      const weekData = workSchedule.filter(ws => {
        const wsDate = parseISO(ws.date);
        return (
          isSameWeek(wsDate, currentWeek, { weekStartsOn: 1 }) &&
          isSameMonth(wsDate, currentDate)
        );
      });

      const totalWorkHours = weekData.reduce(
        (sum, day) => sum + day.workHours,
        0
      );
      const totalAdminHours = weekData.reduce(
        (sum, day) => sum + day.adminTimeHours,
        0
      );
      const totalCapacityHours = weekData.reduce(
        (sum, day) => sum + day.payrollCapacityHours,
        0
      );
      const allAssignments = weekData.flatMap(day => day.assignments || []);
      const totalAssignedHours = allAssignments.reduce(
        (sum, assignment) => sum + assignment.processingTime,
        0
      );

      // Format week label to show dates within the month
      const weekStartInMonth =
        currentWeek < monthStart ? monthStart : currentWeek;
      const weekEndInMonth = weekEnd > monthEnd ? monthEnd : weekEnd;
      const startFormatted = format(weekStartInMonth, "d");
      const endFormatted = format(weekEndInMonth, "d");

      const utilization = totalCapacityHours
        ? Math.round((totalAssignedHours / totalCapacityHours) * 100)
        : 0;

      data.push({
        period: `${startFormatted}-${endFormatted}`,
        fullDate: format(currentWeek, "yyyy-MM-dd"),
        workHours: totalWorkHours,
        adminTimeHours: totalAdminHours,
        payrollCapacityHours: totalCapacityHours,
        assignedHours: totalAssignedHours,
        assignments: allAssignments,
        utilization: utilization,
        // Stacked chart data
        capacityBase: totalCapacityHours,
        utilizationHours: Math.min(totalAssignedHours, totalCapacityHours), // Cap at capacity for visual
        overflowHours: Math.max(0, totalAssignedHours - totalCapacityHours), // For overallocation
      });

      currentWeek = addWeeks(currentWeek, 1);
    }
  }

  return data;
};

// =============================================================================
// SINGLE MEMBER COMPONENT
// =============================================================================

function SingleMemberVisualization({
  userId,
  userName,
  userRole,
  workSchedule = [],
  viewPeriod,
  currentDate,
  selectedView,
  onAssignmentClick,
}: SingleMemberVisualizationProps) {

  // Calculate aggregated data based on current period
  const chartData = useMemo(() => {
    // Debug logging to see what data we're getting
    if (typeof window !== 'undefined') {
      const result = aggregateDataByPeriod(workSchedule || [], viewPeriod, currentDate, []);
      console.log('SingleMemberVisualization - Debug data:', {
        userId,
        userName,
        workScheduleLength: workSchedule?.length || 0,
        workScheduleSample: workSchedule?.slice(0, 3),
        viewPeriod,
        currentDate: currentDate.toISOString(),
        hasAssignments: workSchedule?.some(day => day.assignments?.length > 0) || false,
        chartDataLength: result.length,
        chartDataSample: result.slice(0, 3),
        totalAssignedInChart: result.reduce((sum, item) => sum + (item.assignedHours || 0), 0),
        capacityInChart: result.reduce((sum, item) => sum + (item.payrollCapacityHours || 0), 0)
      });
    }
    
    const result = aggregateDataByPeriod(workSchedule || [], viewPeriod, currentDate, []);
    
    // Add test data if no assignments exist to verify bar chart is working
    if (typeof window !== 'undefined' && result.length > 0 && result.every(item => (item.assignedHours || 0) === 0)) {
      console.log('No assignments found, adding test data for debugging...');
      result[0] = { 
        ...result[0], 
        assignedHours: 2.5, 
        utilizationHours: 2.5,
        utilization: result[0].payrollCapacityHours > 0 ? Math.round((2.5 / result[0].payrollCapacityHours) * 100) : 0,
        assignments: [{
          id: 'test-1',
          name: 'Test Payroll',
          clientName: 'Test Client',
          processingTime: 2.5,
          processingDaysBeforeEft: 3,
          eftDate: '2025-01-10',
          status: 'active' as const,
          priority: 'medium' as const
        }]
      };
    }
    
    return result;
  }, [workSchedule, viewPeriod, currentDate, userId, userName]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalCapacity = Math.round(
      chartData.reduce((sum, item) => sum + item.payrollCapacityHours, 0)
    );
    const totalAssigned =
      Math.round(
        chartData.reduce((sum, item) => sum + item.assignedHours, 0) * 10
      ) / 10;
    const avgUtilization =
      chartData.length > 0
        ? Math.round(
            chartData.reduce((sum, item) => sum + item.utilization, 0) /
              chartData.length
          )
        : 0;
    const overallocatedPeriods = chartData.filter(
      item => item.utilization > 100
    ).length;

    return {
      totalCapacity,
      totalAssigned,
      avgUtilization,
      overallocatedPeriods,
      periodsShown: chartData.length,
    };
  }, [chartData]);

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;

    const data = payload[0].payload;
    const assignments = data.assignments || [];

    return (
      <div className="bg-background p-4 border rounded-lg shadow-lg min-w-64">
        <div className="font-medium mb-2">{label}</div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Capacity:</span>
            <span className="font-medium">{data.payrollCapacityHours}h</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Assigned Hours:</span>
            <span className="font-medium">
              {data.assignedHours.toFixed(1)}h
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Utilization:</span>
            <span
              className={`font-medium ${data.utilization > 100 ? "text-red-600" : data.utilization > 80 ? "text-yellow-600" : "text-green-600"}`}
            >
              {data.utilization}%
            </span>
          </div>

          {assignments.length > 0 && (
            <div className="mt-3 pt-2 border-t">
              <div className="font-medium text-foreground mb-1">Assignments:</div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {assignments.map(
                  (assignment: PayrollAssignment, idx: number) => (
                    <div
                      key={`tooltip-${assignment.id}-${idx}`}
                      className="flex justify-between text-xs cursor-pointer hover:bg-muted p-1 rounded"
                      onClick={e => {
                        e.stopPropagation();
                        onAssignmentClick?.(assignment);
                      }}
                    >
                      <span className="truncate mr-2 text-blue-600 hover:text-blue-800">
                        {assignment.name}
                      </span>
                      <div className="text-muted-foreground text-right">
                        <div>{assignment.processingTime.toFixed(1)}h</div>
                        {assignment.processingDaysBeforeEft > 1 && (
                          <div className="text-xs opacity-75">
                            ({assignment.processingDaysBeforeEft} days)
                          </div>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="h-full">
      {/* Team Member Header */}
      <CardHeader className="pb-4">
        <CardTitle className="text-base md:text-lg flex items-center justify-between">
          <div>
            <div className="font-semibold">{userName}</div>
            <div className="text-sm text-muted-foreground capitalize font-normal">{userRole}</div>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {selectedView === "chart" ? (
              <>
                <BarChart3 className="w-3 h-3" />
                {viewPeriod.charAt(0).toUpperCase() + viewPeriod.slice(1)}
              </>
            ) : (
              <>
                <CalendarIcon className="w-3 h-3" />
                Calendar
              </>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary Statistics - Compact Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-blue-50 border border-blue-100 rounded p-2">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-blue-600" />
              <div>
                <div className="text-lg font-bold text-blue-600">
                  {summaryStats.totalCapacity}h
                </div>
                <div className="text-xs text-muted-foreground">Capacity</div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-100 rounded p-2">
            <div className="flex items-center gap-1">
              <Briefcase className="w-3 h-3 text-green-600" />
              <div>
                <div className="text-lg font-bold text-green-600">
                  {summaryStats.totalAssigned.toFixed(1)}h
                </div>
                <div className="text-xs text-muted-foreground">Assigned</div>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-100 rounded p-2">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-purple-600" />
              <div>
                <div className="text-lg font-bold text-purple-600">
                  {summaryStats.avgUtilization}%
                </div>
                <div className="text-xs text-muted-foreground">Utilization</div>
              </div>
            </div>
          </div>

          <div
            className={`${summaryStats.overallocatedPeriods > 0 ? "bg-red-50 border-red-100" : "bg-muted/50 border-border"} border rounded p-2`}
          >
            <div className="flex items-center gap-1">
              <AlertTriangle
                className={`w-3 h-3 ${summaryStats.overallocatedPeriods > 0 ? "text-red-600" : "text-muted-foreground"}`}
              />
              <div>
                <div
                  className={`text-lg font-bold ${summaryStats.overallocatedPeriods > 0 ? "text-red-600" : "text-muted-foreground"}`}
                >
                  {summaryStats.overallocatedPeriods}
                </div>
                <div className="text-xs text-muted-foreground">Overallocated</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Visualization Content */}
          {selectedView === "chart" ? (
            <div className="space-y-4">
              <div className="w-full h-[250px] bg-muted/50 rounded-lg p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{
                      top: 5,
                      right: 10,
                      left: 10,
                      bottom: viewPeriod === "day" ? 20 : 40,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="period"
                      fontSize={8}
                      angle={viewPeriod === "day" ? 0 : -45}
                      textAnchor={viewPeriod === "day" ? "middle" : "end"}
                      height={viewPeriod === "day" ? 20 : 40}
                      interval={0}
                      tick={{ fontSize: 8, fill: "#666" }}
                      tickLine={{ stroke: "#e0e0e0" }}
                      axisLine={{ stroke: "#e0e0e0" }}
                    />
                    <YAxis
                      fontSize={8}
                      tick={{ fontSize: 8, fill: "#666" }}
                      axisLine={{ stroke: "#e0e0e0" }}
                      tickLine={{ stroke: "#e0e0e0" }}
                      tickFormatter={value => `${value}h`}
                      domain={[0, "dataMax"]}
                    />
                    <Tooltip content={<CustomTooltip />} />

                    {/* Capacity background bar (always 100%) */}
                    <Bar
                      dataKey="capacityBase"
                      fill="rgba(229, 231, 235, 0.8)"
                      name="Total Capacity"
                      radius={[2, 2, 0, 0]}
                      stackId="capacity"
                    />
                    {/* Utilization foreground bar */}
                    <Bar
                      dataKey="utilizationHours"
                      name="Utilized Hours"
                      radius={[2, 2, 0, 0]}
                      stackId="capacity"
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.utilization > 100
                              ? "#ef4444"
                              : entry.utilization > 80
                                ? "#f59e0b"
                                : "#10b981"
                          }
                        />
                      ))}
                    </Bar>
                    {/* Overflow bar for overallocation */}
                    <Bar
                      dataKey="overflowHours"
                      name="Overallocated Hours"
                      radius={[2, 2, 0, 0]}
                      stackId="capacity"
                      fill="#dc2626"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Custom Legend - Compact */}
              <div className="flex flex-wrap justify-center items-center gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded border"
                    style={{
                      backgroundColor: "rgba(229, 231, 235, 0.8)",
                      borderColor: "#d1d5db",
                    }}
                  ></div>
                  <span className="text-muted-foreground">Available</span>
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: "#10b981" }}
                  ></div>
                  <span className="text-muted-foreground">Optimal</span>
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: "#f59e0b" }}
                  ></div>
                  <span className="text-muted-foreground">High</span>
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: "#ef4444" }}
                  ></div>
                  <span className="text-muted-foreground">At Capacity</span>
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: "#dc2626" }}
                  ></div>
                  <span className="text-muted-foreground">Over</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-center text-muted-foreground">
                  Calendar view will be implemented with the new dashboard
                </div>
              </div>
            </div>
          )}
      </CardContent>
    </Card>
  );
}

// =============================================================================
// MAIN RESPONSIVE COMPONENT
// =============================================================================

export default function PayrollWorkloadVisualization({
  teamMembers,
  // Legacy props
  userId,
  userName,
  userRole,
  workSchedule,
  // Common props
  viewMode = "consultant",
  onAssignmentClick,
}: PayrollWorkloadVisualizationProps) {
  // For backward compatibility, use the new dashboard
  return (
    <PayrollWorkloadDashboard
      {...(teamMembers && { teamMembers })}
      {...(userId && { userId })}
      {...(userName && { userName })}
      {...(userRole && { userRole })}
      {...(workSchedule && { workSchedule })}
      viewMode={viewMode}
      {...(onAssignmentClick && { onAssignmentClick })}
    />
  );
}