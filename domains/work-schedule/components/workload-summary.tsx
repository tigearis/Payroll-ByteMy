"use client";

import { format, isSameDay, isSameWeek, isSameMonth, parseISO, startOfWeek, addDays } from "date-fns";
import React, { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import AssignmentCard from "./assignment-card";
import { AssignmentStatus, AssignmentPriority } from "../types/workload";

interface WorkloadDay {
  date: string;
  workHours: number;
  adminTimeHours: number;
  payrollCapacityHours: number;
  assignments: Array<{
    id: string;
    name: string;
    clientName: string;
    processingTime: number;
    processingDaysBeforeEft: number;
    eftDate: string;
    status: string;
    priority: string;
  }>;
}

interface WorkloadSummaryProps {
  workSchedule: WorkloadDay[];
  viewPeriod: "day" | "week" | "month";
  currentDate: Date;
  onAssignmentClick?: (assignment: any) => void;
  className?: string;
}

export const WorkloadSummary: React.FC<WorkloadSummaryProps> = ({
  workSchedule,
  viewPeriod,
  currentDate,
  onAssignmentClick,
  className
}) => {
  // Filter data based on view period
  const periodData = useMemo(() => {
    return workSchedule.filter(day => {
      const dayDate = parseISO(day.date);
      
      switch (viewPeriod) {
        case "day":
          return isSameDay(dayDate, currentDate);
        case "week":
          return isSameWeek(dayDate, currentDate, { weekStartsOn: 1 });
        case "month":
          return isSameMonth(dayDate, currentDate);
        default:
          return false;
      }
    });
  }, [workSchedule, viewPeriod, currentDate]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalAssignments = periodData.reduce((sum, day) => sum + day.assignments.length, 0);
    const totalAssignedHours = periodData.reduce((sum, day) => 
      sum + day.assignments.reduce((daySum, assignment) => daySum + assignment.processingTime, 0), 0
    );
    const totalCapacity = periodData.reduce((sum, day) => sum + day.payrollCapacityHours, 0);
    const avgUtilization = totalCapacity > 0 ? Math.round((totalAssignedHours / totalCapacity) * 100) : 0;
    
    const overallocatedDays = periodData.filter(day => {
      const dayAssignedHours = day.assignments.reduce((sum, assignment) => sum + assignment.processingTime, 0);
      return day.payrollCapacityHours > 0 && (dayAssignedHours / day.payrollCapacityHours) > 1;
    }).length;

    const avgDailyHours = periodData.length > 0 ? totalAssignedHours / periodData.length : 0;

    // Group by client
    const clientSummary = periodData.reduce((acc, day) => {
      day.assignments.forEach(assignment => {
        const client = assignment.clientName;
        if (!acc[client]) {
          acc[client] = { count: 0, hours: 0 };
        }
        acc[client].count++;
        acc[client].hours += assignment.processingTime;
      });
      return acc;
    }, {} as Record<string, { count: number; hours: number }>);

    // Group by status
    const statusSummary = periodData.reduce((acc, day) => {
      day.assignments.forEach(assignment => {
        const status = assignment.status;
        if (!acc[status]) {
          acc[status] = { count: 0, hours: 0 };
        }
        acc[status].count++;
        acc[status].hours += assignment.processingTime;
      });
      return acc;
    }, {} as Record<string, { count: number; hours: number }>);

    // All assignments for the period (for detailed view)
    const allAssignments = periodData.flatMap(day => 
      day.assignments.map(assignment => ({
        ...assignment,
        date: day.date,
        status: assignment.status as AssignmentStatus,
        priority: assignment.priority as AssignmentPriority
      }))
    );

    return {
      totalAssignments,
      totalAssignedHours,
      totalCapacity,
      avgUtilization,
      overallocatedDays,
      avgDailyHours,
      clientSummary,
      statusSummary,
      allAssignments,
      periodsWithData: periodData.length
    };
  }, [periodData]);

  const getPeriodLabel = () => {
    switch (viewPeriod) {
      case "day":
        return format(currentDate, "EEEE, MMMM d, yyyy");
      case "week":
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
        return `Week of ${format(weekStart, "MMMM d, yyyy")}`;
      case "month":
        return format(currentDate, "MMMM yyyy");
      default:
        return "";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  if (periodData.length === 0) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-8 text-center">
          <div className="text-muted-foreground">
            No data available for {getPeriodLabel()}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{getPeriodLabel()} Summary</span>
          <Badge variant="outline" className={cn(
            stats.avgUtilization > 100 ? "bg-red-100 text-red-800" :
            stats.avgUtilization > 85 ? "bg-yellow-100 text-yellow-800" :
            "bg-green-100 text-green-800"
          )}>
            {stats.avgUtilization}% utilized
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Main Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalAssignments}
            </div>
            <div className="text-sm text-muted-foreground">
              Assignment{stats.totalAssignments !== 1 ? 's' : ''}
            </div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {stats.totalAssignedHours.toFixed(1)}h
            </div>
            <div className="text-sm text-muted-foreground">
              Total Hours
            </div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(stats.totalCapacity)}h
            </div>
            <div className="text-sm text-muted-foreground">
              Capacity
            </div>
          </div>
          
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {stats.overallocatedDays}
            </div>
            <div className="text-sm text-muted-foreground">
              Over{viewPeriod === "day" ? "" : " Days"}
            </div>
          </div>
        </div>

        {/* Additional Stats for Week/Month */}
        {viewPeriod !== "day" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-3 bg-indigo-50 rounded-lg">
              <div className="text-xl font-bold text-indigo-600">
                {stats.avgDailyHours.toFixed(1)}h
              </div>
              <div className="text-sm text-muted-foreground">
                Daily Average
              </div>
            </div>
            <div className="text-center p-3 bg-teal-50 rounded-lg">
              <div className="text-xl font-bold text-teal-600">
                {stats.periodsWithData}
              </div>
              <div className="text-sm text-muted-foreground">
                {viewPeriod === "week" ? "Work Days" : "Active Days"}
              </div>
            </div>
          </div>
        )}

        {/* Client Breakdown */}
        {Object.keys(stats.clientSummary).length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Client Breakdown</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {Object.entries(stats.clientSummary)
                .sort(([, a], [, b]) => b.hours - a.hours)
                .map(([client, summary]) => (
                  <div
                    key={client}
                    className="flex justify-between items-center p-3 bg-muted/30 rounded"
                  >
                    <div>
                      <div className="font-medium">{client}</div>
                      <div className="text-sm text-muted-foreground">
                        {summary.count} assignment{summary.count !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <div className="text-lg font-bold text-blue-600">
                      {summary.hours.toFixed(1)}h
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Status Breakdown */}
        {Object.keys(stats.statusSummary).length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Status Breakdown</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.statusSummary).map(([status, summary]) => (
                <Badge
                  key={status}
                  variant="secondary"
                  className={cn("text-sm", getStatusBadgeColor(status))}
                >
                  {status}: {summary.count} ({summary.hours.toFixed(1)}h)
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Assignments Detail for Day View */}
        {viewPeriod === "day" && stats.allAssignments.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Today's Assignments ({stats.allAssignments.length})</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {stats.allAssignments.map((assignment, idx) => (
                <AssignmentCard
                  key={`${assignment.id}-${idx}`}
                  assignment={assignment}
                  {...(onAssignmentClick && { onClick: onAssignmentClick })}
                  variant="default"
                />
              ))}
            </div>
          </div>
        )}

        {/* Weekly Assignment Summary */}
        {viewPeriod === "week" && stats.allAssignments.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Week's Assignments ({stats.allAssignments.length})</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {stats.allAssignments.slice(0, 5).map((assignment, idx) => (
                <AssignmentCard
                  key={`${assignment.id}-${idx}`}
                  assignment={assignment}
                  {...(onAssignmentClick && { onClick: onAssignmentClick })}
                  variant="compact"
                />
              ))}
              {stats.allAssignments.length > 5 && (
                <div className="text-sm text-muted-foreground text-center py-2">
                  ... and {stats.allAssignments.length - 5} more assignments
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkloadSummary;