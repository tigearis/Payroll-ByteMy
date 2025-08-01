"use client";

import { format, addDays, startOfWeek, isSameDay, isSameMonth, parseISO } from "date-fns";
import React, { useMemo, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { WorkloadCalendarProps, CalendarDay, WorkScheduleDay } from "../types/workload";
import AssignmentCard from "./assignment-card";

// Utility function to determine utilization level
function getUtilizationLevel(utilization: number) {
  if (utilization < 70) return "underutilized" as const;
  if (utilization <= 85) return "optimal" as const;
  if (utilization <= 100) return "high" as const;
  return "overallocated" as const;
}

const WorkloadCalendar: React.FC<WorkloadCalendarProps> = ({
  userId,
  workSchedule,
  viewPeriod,
  currentDate,
  onDayClick,
  onAssignmentClick,
  showWeekends = true,
  highlightDeadlines = true,
  className,
}) => {
  // Process work schedule data into calendar days
  const calendarData = useMemo(() => {
    return workSchedule.map((day): CalendarDay => {
      const date = parseISO(day.date);
      const totalAssignedHours = day.assignments.reduce(
        (sum, assignment) => sum + assignment.processingTime,
        0
      );
      const utilization = day.payrollCapacityHours 
        ? Math.round((totalAssignedHours / day.payrollCapacityHours) * 100)
        : 0;

      // Check for deadlines
      const hasDeadlines = highlightDeadlines && day.assignments.some(assignment => {
        const eftDate = parseISO(assignment.eftDate);
        const daysUntilDeadline = Math.ceil(
          (eftDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysUntilDeadline <= 3 && daysUntilDeadline >= 0;
      });

      return {
        date: day.date,
        workHours: day.workHours,
        adminTimeHours: day.adminTimeHours,
        payrollCapacityHours: day.payrollCapacityHours,
        assignments: day.assignments,
        totalAssignedHours,
        utilization,
        utilizationLevel: getUtilizationLevel(utilization),
        isOverallocated: utilization > 100,
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        isHoliday: false, // TODO: Integrate holiday data
        dayOfWeek: date.getDay(),
        hasDeadlines,
      };
    });
  }, [workSchedule, highlightDeadlines]);

  const getUtilizationColor = useCallback((level: string) => {
    switch (level) {
      case "underutilized":
        return "bg-gray-50 border-gray-200";
      case "optimal":
        return "bg-green-50 border-green-200";
      case "high":
        return "bg-yellow-50 border-yellow-200";
      case "overallocated":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  }, []);

  const handleDayClick = useCallback((day: CalendarDay) => {
    onDayClick?.(day);
  }, [onDayClick]);

  // Render day view
  if (viewPeriod === "day") {
    const dayData = calendarData.find(day => 
      isSameDay(parseISO(day.date), currentDate)
    );

    if (!dayData) {
      return (
        <Card className={cn("w-full", className)}>
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground">
              No data available for {format(currentDate, "EEEE, MMMM d, yyyy")}
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{format(currentDate, "EEEE, MMMM d, yyyy")}</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getUtilizationColor(dayData.utilizationLevel)}>
                {dayData.utilization}% utilized
              </Badge>
              {dayData.hasDeadlines && (
                <Badge variant="destructive">Deadlines</Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Day Summary */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {dayData.payrollCapacityHours}h
              </div>
              <div className="text-muted-foreground">Capacity</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {dayData.totalAssignedHours.toFixed(1)}h
              </div>
              <div className="text-muted-foreground">Assigned</div>
            </div>
            <div className="text-center">
              <div className={cn(
                "text-lg font-bold",
                dayData.isOverallocated ? "text-red-600" : "text-green-600"
              )}>
                {dayData.utilization}%
              </div>
              <div className="text-muted-foreground">Utilization</div>
            </div>
          </div>

          {/* Assignments */}
          <div className="space-y-2">
            <h4 className="font-medium">Assignments ({dayData.assignments.length})</h4>
            {dayData.assignments.length > 0 ? (
              dayData.assignments.map((assignment, idx) => (
                <AssignmentCard
                  key={`${assignment.id}-${idx}`}
                  assignment={assignment}
                  onClick={onAssignmentClick || (() => {})}
                  variant="default"
                />
              ))
            ) : (
              <div className="text-center text-muted-foreground py-4">
                No assignments for today
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render week view
  if (viewPeriod === "week") {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle>
            Week of {format(weekStart, "MMMM d, yyyy")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {weekDays.map((date, i) => {
              if (!showWeekends && (date.getDay() === 0 || date.getDay() === 6)) {
                return null;
              }

              const dayData = calendarData.find(day => 
                isSameDay(parseISO(day.date), date)
              );

              return (
                <div
                  key={i}
                  className={cn(
                    "min-h-[160px] p-3 border rounded-lg transition-colors",
                    dayData ? getUtilizationColor(dayData.utilizationLevel) : "bg-muted/20",
                    onDayClick && "cursor-pointer hover:shadow-sm"
                  )}
                  onClick={() => dayData && handleDayClick(dayData)}
                >
                  {/* Day Header */}
                  <div className="text-center mb-2">
                    <div className="text-sm font-medium">
                      {format(date, "EEE")}
                    </div>
                    <div className="text-lg font-bold">
                      {format(date, "d")}
                    </div>
                    {dayData && (
                      <div className="text-xs text-muted-foreground">
                        {dayData.utilization}%
                      </div>
                    )}
                  </div>

                  {/* Assignments */}
                  <div className="space-y-1">
                    {dayData?.assignments.map((assignment, idx) => (
                      <AssignmentCard
                        key={`week-${i}-${assignment.id}-${idx}`}
                        assignment={assignment}
                        onClick={onAssignmentClick || (() => {})}
                        variant="compact"
                        showClient={false}
                      />
                    )) || (
                      <div className="text-xs text-muted-foreground text-center italic">
                        No assignments
                      </div>
                    )}
                  </div>

                  {/* Deadline indicator */}
                  {dayData?.hasDeadlines && (
                    <div className="mt-2">
                      <Badge variant="destructive" className="text-xs">
                        Deadline
                      </Badge>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render month view (summary)
  const monthData = calendarData.filter(day => 
    isSameMonth(parseISO(day.date), currentDate)
  );

  const monthStats = useMemo(() => {
    const totalAssignments = monthData.reduce((sum, day) => sum + day.assignments.length, 0);
    const totalHours = monthData.reduce((sum, day) => sum + day.totalAssignedHours, 0);
    const avgDailyHours = monthData.length > 0 ? totalHours / monthData.length : 0;
    const overallocatedDays = monthData.filter(day => day.isOverallocated).length;

    // Group by client
    const clientSummary = monthData.reduce((acc, day) => {
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

    return {
      totalAssignments,
      totalHours,
      avgDailyHours,
      overallocatedDays,
      clientSummary,
    };
  }, [monthData]);

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>
          {format(currentDate, "MMMM yyyy")} Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Month Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {monthStats.totalAssignments}
            </div>
            <div className="text-sm text-muted-foreground">Assignments</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {monthStats.totalHours.toFixed(0)}h
            </div>
            <div className="text-sm text-muted-foreground">Total Hours</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {monthStats.avgDailyHours.toFixed(1)}h
            </div>
            <div className="text-sm text-muted-foreground">Daily Average</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {monthStats.overallocatedDays}
            </div>
            <div className="text-sm text-muted-foreground">Overallocated</div>
          </div>
        </div>

        {/* Client Breakdown */}
        {Object.keys(monthStats.clientSummary).length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Client Breakdown</h4>
            <div className="space-y-2">
              {Object.entries(monthStats.clientSummary)
                .sort(([, a], [, b]) => b.hours - a.hours)
                .map(([client, summary]) => (
                  <div
                    key={client}
                    className="flex justify-between items-center p-3 bg-muted/30 rounded"
                  >
                    <div>
                      <div className="font-medium">{client}</div>
                      <div className="text-sm text-muted-foreground">
                        {summary.count} assignments
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

        {monthData.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No assignments scheduled for {format(currentDate, "MMMM yyyy")}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default React.memo(WorkloadCalendar);