"use client";

import { Users, Clock, FileText, UserX, Calendar, TrendingUp, AlertTriangle } from "lucide-react";
import React, { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useScheduler } from "./SchedulerProvider";
import type { SchedulerSidebarProps, ConsultantSummary } from "./types";

interface ConsultantSummaryCardProps {
  consultant: ConsultantSummary;
  maxWorkload: number;
  isOnLeave: boolean;
  className?: string;
}

function ConsultantSummaryCard({ consultant, maxWorkload, isOnLeave, className }: ConsultantSummaryCardProps) {
  const workloadPercentage = maxWorkload > 0 ? (consultant.totalProcessingTime / maxWorkload) * 100 : 0;
  
  const getWorkloadColor = (percentage: number) => {
    if (percentage >= 80) return "text-red-600";
    if (percentage >= 60) return "text-orange-600";
    return "text-green-600";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className={cn("transition-all hover:shadow-md", className)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" alt={consultant.name} />
            <AvatarFallback className="text-xs">
              {getInitials(consultant.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium truncate" title={consultant.name}>
                {consultant.name}
              </h4>
              {isOnLeave && (
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                  <UserX className="w-3 h-3 mr-1" />
                  Leave
                </Badge>
              )}
            </div>
            
            {consultant.role && (
              <p className="text-sm text-muted-foreground mb-2">
                {consultant.role}
              </p>
            )}

            {/* Workload Stats */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  Payrolls
                </span>
                <span className="font-medium">{consultant.totalPayrolls}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Employees
                </span>
                <span className="font-medium">{consultant.totalEmployees}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Time
                </span>
                <span className={cn("font-medium", getWorkloadColor(workloadPercentage))}>
                  {consultant.totalProcessingTime}h
                </span>
              </div>

              {/* Workload Progress Bar */}
              {maxWorkload > 0 && (
                <div className="space-y-1">
                  <Progress 
                    value={workloadPercentage} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Workload</span>
                    <span>{Math.round(workloadPercentage)}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SchedulerSidebar({ className }: SchedulerSidebarProps) {
  const { state, actions } = useScheduler();

  // Calculate consultant summaries with current period data
  const consultantSummaries = useMemo(() => {
    return state.consultants.map(consultant => {
      // Filter assignments to only those within the current date range
      const consultantAssignments = state.assignments.filter(a => {
        if (a.consultantId !== consultant.id || a.isGhost) return false;

        // Check if assignment date is within the current viewing period
        const assignmentDate = new Date(a.adjustedEftDate);
        return (
          assignmentDate >= state.dateRange.start && assignmentDate <= state.dateRange.end
        );
      });

      // Check if consultant has leave in the current period
      const dates: Date[] = [];
      let current = state.dateRange.start;
      while (current <= state.dateRange.end) {
        dates.push(new Date(current));
        current = new Date(current);
        current.setDate(current.getDate() + 1);
      }

      const hasLeaveInPeriod = dates.some(date =>
        actions.isConsultantOnLeave(consultant.id, date)
      );

      return {
        ...consultant,
        totalPayrolls: consultantAssignments.length,
        totalEmployees: consultantAssignments.reduce((sum, a) => sum + a.employeeCount, 0),
        totalProcessingTime: consultantAssignments.reduce((sum, a) => sum + a.processingTime, 0),
        isOnLeave: hasLeaveInPeriod,
      };
    });
  }, [state.consultants, state.assignments, state.dateRange, actions]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalPayrolls = consultantSummaries.reduce((sum, c) => sum + c.totalPayrolls, 0);
    const totalEmployees = consultantSummaries.reduce((sum, c) => sum + c.totalEmployees, 0);
    const totalProcessingTime = consultantSummaries.reduce((sum, c) => sum + c.totalProcessingTime, 0);
    const consultantsOnLeave = consultantSummaries.filter(c => c.isOnLeave).length;
    const activeConsultants = consultantSummaries.length - consultantsOnLeave;
    const averageWorkload = activeConsultants > 0 ? totalProcessingTime / activeConsultants : 0;
    const maxWorkload = Math.max(...consultantSummaries.map(c => c.totalProcessingTime));

    return {
      totalPayrolls,
      totalEmployees,
      totalProcessingTime,
      consultantsOnLeave,
      activeConsultants,
      averageWorkload,
      maxWorkload,
    };
  }, [consultantSummaries]);

  // Sort consultants by workload (descending)
  const sortedConsultants = useMemo(() => {
    return [...consultantSummaries].sort((a, b) => {
      // On leave consultants at the end
      if (a.isOnLeave && !b.isOnLeave) return 1;
      if (!a.isOnLeave && b.isOnLeave) return -1;
      // Then by total processing time
      return b.totalProcessingTime - a.totalProcessingTime;
    });
  }, [consultantSummaries]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Period Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{summaryStats.totalPayrolls}</div>
              <div className="text-sm text-muted-foreground">Total Payrolls</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{summaryStats.totalEmployees}</div>
              <div className="text-sm text-muted-foreground">Total Employees</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{summaryStats.totalProcessingTime}h</div>
              <div className="text-sm text-muted-foreground">Processing Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{summaryStats.activeConsultants}</div>
              <div className="text-sm text-muted-foreground">Active Staff</div>
            </div>
          </div>

          {summaryStats.consultantsOnLeave > 0 && (
            <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {summaryStats.consultantsOnLeave} consultant{summaryStats.consultantsOnLeave !== 1 ? 's' : ''} on leave
                </span>
              </div>
            </div>
          )}

          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Average Workload:</span>
              <span className="font-medium">{Math.round(summaryStats.averageWorkload)}h</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Period:</span>
              <span className="font-medium">{actions.formatPeriodDisplay()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Consultant List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5" />
            Consultant Workload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {sortedConsultants.map((consultant) => (
              <ConsultantSummaryCard
                key={consultant.id}
                consultant={consultant}
                maxWorkload={summaryStats.maxWorkload}
                isOnLeave={consultant.isOnLeave || false}
                className={consultant.isOnLeave ? "opacity-75" : ""}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preview Changes Summary */}
      {state.isPreviewMode && state.pendingChanges.length > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-orange-800 dark:text-orange-200">
              <Calendar className="w-5 h-5" />
              Pending Changes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {state.pendingChanges.map((change, index) => (
                <div key={index} className="text-sm p-2 bg-white dark:bg-slate-800 rounded border">
                  <div className="font-medium truncate">{change.payrollName}</div>
                  <div className="text-muted-foreground text-xs">
                    {change.fromConsultantName} → {change.toConsultantName}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {change.affectedDates.length} date{change.affectedDates.length !== 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}