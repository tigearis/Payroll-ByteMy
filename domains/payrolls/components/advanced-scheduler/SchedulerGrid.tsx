"use client";

import { format, addDays, isSameDay, isWeekend } from "date-fns";
import { FileText, Users, Clock, Calendar } from "lucide-react";
import React, { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useScheduler } from "./SchedulerProvider";
import type { SchedulerGridProps, PayrollAssignment, ConsultantSummary, Holiday } from "./types";

// Role mapping utility
const getRoleDisplayName = (role: string): string => {
  const roleMap: Record<string, string> = {
    'org_admin': 'Admin',
    'manager': 'Manager', 
    'consultant': 'Consultant',
    'viewer': 'Viewer',
    'developer': 'Developer',
  };
  return roleMap[role] || role.charAt(0).toUpperCase() + role.slice(1);
};

// Consultant statistics calculation
const calculateConsultantStats = (
  consultant: ConsultantSummary, 
  assignments: PayrollAssignment[], 
  dates: Date[],
  isPreviewMode: boolean = false
) => {
  // Filter assignments for this consultant within the date range
  const consultantAssignments = assignments.filter(assignment => 
    assignment.consultantId === consultant.id &&
    dates.some(date => new Date(assignment.adjustedEftDate).toDateString() === date.toDateString())
  );

  // Calculate unique payroll IDs
  const uniquePayrollIds = new Set(consultantAssignments.map(a => a.payrollId));
  const payrollCount = uniquePayrollIds.size;

  // Calculate total employees (sum by unique payroll ID)
  const totalEmployees = Array.from(uniquePayrollIds).reduce((sum, payrollId) => {
    const payrollAssignment = consultantAssignments.find(a => a.payrollId === payrollId);
    return sum + (payrollAssignment?.employeeCount || 0);
  }, 0);

  // Calculate total processing hours (processing time * number of dates for each payroll)
  const totalProcessingHours = Array.from(uniquePayrollIds).reduce((sum, payrollId) => {
    const payrollAssignments = consultantAssignments.filter(a => a.payrollId === payrollId);
    const processingTime = payrollAssignments[0]?.processingTime || 0;
    return sum + (processingTime * payrollAssignments.length);
  }, 0);

  // Estimated capacity (assuming 40 hours per week, scaled to current period)
  const weekCount = Math.ceil(dates.length / 7);
  const maxCapacity = weekCount * 40;
  const capacityLeft = Math.max(0, maxCapacity - totalProcessingHours);

  return {
    payrollCount,
    totalEmployees,
    totalProcessingHours,
    capacityLeft,
    maxCapacity,
    utilizationPercent: Math.round((totalProcessingHours / maxCapacity) * 100)
  };
};

interface GridCellProps {
  consultant: ConsultantSummary;
  date: Date;
  assignments: PayrollAssignment[];
  holidays: Holiday[];
  isOnLeave: boolean;
  onAssignmentClick?: (assignment: PayrollAssignment) => void;
  onCellClick?: (consultant: ConsultantSummary, date: Date) => void;
  isPreviewMode?: boolean;
  selectedAssignment?: PayrollAssignment | null;
}

function GridCell({ consultant, date, assignments, holidays, isOnLeave, onAssignmentClick, onCellClick, isPreviewMode, selectedAssignment }: GridCellProps) {
  const { state, actions } = useScheduler();
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Get assignments for this consultant and date
  const cellAssignments = assignments.filter(assignment => 
    assignment.consultantId === consultant.id &&
    isSameDay(new Date(assignment.adjustedEftDate), date)
  );

  // Get holiday for this date
  const holiday = actions.getHolidayForDate(date);
  
  // Calculate cell styling
  const isWeekendDay = isWeekend(date);
  const hasAssignments = cellAssignments.length > 0;
  
  const getCellBackground = () => {
    if (isOnLeave) return "hsl(142, 77%, 73%)"; // Green for on leave
    if (hasAssignments) return "hsl(212, 96%, 78%)"; // Blue for has assignments
    return "hsl(32, 98%, 83%)"; // Orange for available
  };

  const getAssignmentColor = (assignment: PayrollAssignment) => {
    if (assignment.isGhost) return "hsla(215, 20%, 65%, 0.3)";
    
    const maxTime = Math.max(...assignments.map(a => a.processingTime), 1);
    const intensity = Math.min(assignment.processingTime / maxTime, 1);
    // Reduce alpha for better text readability
    const alpha = 0.15 + intensity * 0.4;

    // Check if this assignment has actually been moved (not just in preview mode)
    const originalAssignment = state.originalAssignments.find(orig => orig.id === assignment.id);
    const hasBeenMoved = originalAssignment && 
      (assignment.consultantId !== originalAssignment.consultantId);

    if (hasBeenMoved) return `hsla(25, 85%, 60%, ${alpha})`; // Lighter orange for moved assignments
    if (assignment.isBackup) return `hsla(0, 74%, 65%, ${alpha})`; // Lighter red for backup
    return `hsla(221, 73%, 60%, ${alpha})`; // Lighter blue for original positions
  };

  const getTextColor = (assignment: PayrollAssignment) => {
    const maxTime = Math.max(...assignments.map(a => a.processingTime), 1);
    const intensity = Math.min(assignment.processingTime / maxTime, 1);
    
    // Use darker text on lighter backgrounds, lighter text on darker backgrounds
    if (intensity > 0.6) {
      return "hsl(var(--background))"; // Light text for dark backgrounds
    }
    return "hsl(var(--foreground))"; // Dark text for light backgrounds
  };

  const handleCellClick = () => {
    if (isPreviewMode && selectedAssignment && cellAssignments.length === 0) {
      // Move the selected assignment to this cell
      actions.moveAssignment(selectedAssignment.id, consultant.id, consultant.name);
    } else if (onCellClick) {
      onCellClick(consultant, date);
    }
  };

  // Drag and drop handlers

  const handleDragOver = (e: React.DragEvent) => {
    if (isPreviewMode && !isOnLeave) {
      e.preventDefault(); // Allow drop on any cell (not just empty ones)
      setIsDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (isPreviewMode && !isOnLeave) {
      const assignmentData = e.dataTransfer.getData('text/plain');
      if (assignmentData) {
        const assignment = JSON.parse(assignmentData);
        actions.moveAssignment(assignment.id, consultant.id, consultant.name);
      }
    }
  };

  return (
    <div 
      className={cn(
        "relative min-h-[60px] p-1 border-b border-r border-border",
        "hover:bg-muted/50 transition-colors",
        isWeekendDay && "bg-muted/30",
        isPreviewMode && !isOnLeave && "cursor-pointer",
        isDragOver && "ring-2 ring-green-500 bg-green-50 dark:bg-green-950/20"
      )}
      style={{ backgroundColor: getCellBackground() + "20" }}
      onClick={handleCellClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >

      {/* Leave indicator */}
      {isOnLeave && (
        <div className="absolute top-1 right-1">
          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
            Leave
          </Badge>
        </div>
      )}

      {/* Assignments */}
      <div className="space-y-1">
        {cellAssignments.map((assignment, index) => {
          const handleDragStart = (e: React.DragEvent) => {
            if (isPreviewMode && !assignment.isGhost) {
              e.dataTransfer.setData('text/plain', JSON.stringify(assignment));
              e.dataTransfer.effectAllowed = 'move';
            } else {
              e.preventDefault();
            }
          };

          return (
            <div
              key={assignment.id}
              draggable={isPreviewMode && !assignment.isGhost}
              className={cn(
                "text-xs p-1 rounded border",
                "hover:shadow-sm transition-shadow",
                assignment.isGhost ? "border-dashed opacity-60" : "border-solid",
                isPreviewMode && !assignment.isGhost ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
              )}
              style={{ 
                backgroundColor: getAssignmentColor(assignment),
                color: getTextColor(assignment)
              }}
              onClick={(e) => {
                e.stopPropagation();
                onAssignmentClick?.(assignment);
              }}
              onDragStart={handleDragStart}
              title={`${assignment.payrollName} - ${assignment.clientName} (${assignment.employeeCount} employees)`}
            >
              <div className="font-medium truncate">{assignment.payrollName}</div>
              <div className="truncate opacity-80">{assignment.clientName}</div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" style={{ color: getTextColor(assignment) }} />
                  {assignment.employeeCount}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" style={{ color: getTextColor(assignment) }} />
                  {assignment.processingTime}h
                </span>
              </div>
              {assignment.isBackup && (
                <Badge variant="destructive" className="text-xs bg-red-600 text-white">
                  Backup
                </Badge>
              )}
              {assignment.isGhost && (
                <Badge 
                  variant="outline" 
                  className="text-xs"
                >
                  Moved to {assignment.ghostToConsultant || 'Unknown'}
                </Badge>
              )}
              {assignment.isMoved && (
                <Badge 
                  variant="secondary" 
                  className="text-xs"
                >
                  From {assignment.movedFromConsultant || 'Unknown'}
                </Badge>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty cell placeholder for drag and drop */}
      {cellAssignments.length === 0 && !isOnLeave && isPreviewMode && (
        <div className="flex items-center justify-center h-full">
          {isDragOver ? (
            <div className="text-green-600 text-xs font-medium">
              Drop assignment here
            </div>
          ) : (
            <div className="text-muted-foreground/40 text-xs">
              Drag assignments here
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Helper functions for holiday classification
const getHolidayDisplayInfo = (holiday: Holiday) => {
  const isNSWOrNational = 
    holiday.isGlobal || 
    holiday.region?.some(r => r.includes("NSW")) || 
    holiday.region?.some(r => r.includes("National"));
  
  let designation = "Regional";
  if (holiday.isGlobal) {
    designation = "National Holiday";
  } else if (holiday.region && holiday.region.length > 0) {
    if (holiday.region.includes("NSW")) {
      designation = "NSW Public Holiday";
    } else if (holiday.region.length === 1) {
      designation = `${holiday.region[0]} Holiday`;
    } else {
      designation = "Multi-State Holiday";
    }
  }

  return {
    name: holiday.localName || holiday.name,
    designation,
    isPrimary: Boolean(isNSWOrNational),
    backgroundColor: isNSWOrNational ? "#10b981" : "#f59e0b", // green for NSW/National, amber for others
    textColor: isNSWOrNational ? "#d1fae5" : "#fef3c7", // light green/amber text
  };
};

// Function to determine if a color is light or dark for proper text contrast
const isLightColor = (hslString: string): boolean => {
  if (hslString === "transparent") return false;
  
  // Extract lightness percentage from HSL string
  const lightnessMatch = hslString.match(/hsl\(\d+,\s*\d+%,\s*(\d+)%\)/);
  if (!lightnessMatch) return false;
  
  const lightness = parseInt(lightnessMatch[1]);
  return lightness > 70; // Consider colors above 70% lightness as "light"
};

const getRowBackgroundColor = (date: Date, holiday: Holiday | null) => {
  const isWeekendDay = isWeekend(date);
  
  if (holiday) {
    const holidayInfo = getHolidayDisplayInfo(holiday);
    return holidayInfo.isPrimary ? "hsl(150, 30%, 95%)" : "hsl(45, 40%, 94%)"; // More defined green or amber
  }
  
  if (isWeekendDay) {
    return "hsl(210, 60%, 92%)"; // More distinct blue for weekends
  }
  
  return "transparent";
};

// Get appropriate text color based on background
const getContrastTextColor = (backgroundColor: string): string => {
  if (backgroundColor === "transparent") {
    return "hsl(var(--foreground))"; // Use theme default
  }
  
  if (isLightColor(backgroundColor)) {
    return "hsl(220, 90%, 10%)"; // Dark text for light backgrounds
  }
  
  return "hsl(var(--background))"; // Light text for dark backgrounds
};

export function SchedulerGrid({ className }: SchedulerGridProps) {
  const { state, actions } = useScheduler();
  const [selectedAssignment, setSelectedAssignment] = useState<PayrollAssignment | null>(null);

  // Generate dates array for the current period
  const dates = useMemo(() => {
    const dateArray: Date[] = [];
    let current = state.dateRange.start;

    while (current <= state.dateRange.end) {
      dateArray.push(new Date(current));
      current = addDays(current, 1);
    }

    return dateArray;
  }, [state.dateRange]);

  // Filter consultants based on current filters
  const filteredConsultants = useMemo(() => {
    let consultants = state.consultants;

    if (state.filters.selectedConsultants.length > 0) {
      consultants = consultants.filter(c => 
        state.filters.selectedConsultants.includes(c.id)
      );
    }

    if (state.filters.showOnlyOnLeave) {
      consultants = consultants.filter(c => 
        dates.some(date => actions.isConsultantOnLeave(c.id, date))
      );
    }

    if (state.filters.searchTerm) {
      const term = state.filters.searchTerm.toLowerCase();
      consultants = consultants.filter(c => 
        c.name.toLowerCase().includes(term) ||
        c.email?.toLowerCase().includes(term)
      );
    }

    return consultants;
  }, [state.consultants, state.filters, dates, actions]);

  const handleAssignmentClick = (assignment: PayrollAssignment) => {
    if (state.isPreviewMode) {
      // In preview mode, select the assignment for moving
      setSelectedAssignment(selectedAssignment?.id === assignment.id ? null : assignment);
    } else {
      // In view mode, could open details modal
      setSelectedAssignment(assignment);
    }
  };

  const handleCellClick = (consultant: ConsultantSummary, date: Date) => {
    if (state.isPreviewMode && selectedAssignment) {
      // Move assignment to this cell
      actions.moveAssignment(selectedAssignment.id, consultant.id, consultant.name);
      setSelectedAssignment(null); // Clear selection after move
    }
  };

  if (state.isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading scheduler data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (state.assignments.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-12 text-center">
          <div className="text-muted-foreground mb-4">
            <FileText className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No payrolls found for this period
          </h3>
          <p className="text-muted-foreground mb-4">
            There are no payroll assignments for {actions.formatPeriodDisplay().toLowerCase()}.
          </p>
          <Button variant="outline" onClick={() => actions.setCurrentDate(new Date())}>
            <Calendar className="w-4 h-4 mr-2" />
            Go to Current Month
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Consultants as columns layout
  if (state.viewConfig.orientation === "consultants-as-columns") {
    return (
      <TooltipProvider>
        <Card className={className}>
          <CardContent className="p-0">
          <div className="overflow-auto max-h-[70vh] scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-600">
            <div className="min-w-fit">
              {/* Header Row */}
              <div 
                className="grid sticky top-0 z-10 bg-background border-b-2"
                style={{ 
                  gridTemplateColumns: `120px repeat(${filteredConsultants.length}, minmax(180px, 1fr))` 
                }}
              >
                <div className="p-3 font-medium border-r-2 bg-muted">
                  Date
                </div>
                {filteredConsultants.map((consultant) => {
                  const stats = calculateConsultantStats(consultant, state.assignments, dates, state.isPreviewMode);
                  return (
                    <div 
                      key={consultant.id}
                      className="p-3 font-medium border-r text-center bg-muted min-w-[180px] text-foreground"
                    >
                      <div className="truncate" title={consultant.name}>
                        {consultant.name}
                      </div>
                      <div className="text-xs opacity-75 mt-1">
                        {getRoleDisplayName(consultant.role || '')}
                      </div>
                      
                      {/* Statistics */}
                      <div className="space-y-1 mt-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="opacity-75">Payrolls:</span>
                          <Badge variant="secondary" className="text-xs px-1 bg-foreground/10 text-foreground border-foreground/20">
                            {stats.payrollCount}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="opacity-75">Employees:</span>
                          <span className="font-medium text-foreground">{stats.totalEmployees}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="opacity-75">Hours:</span>
                          <span className="font-medium text-foreground">{stats.totalProcessingHours}h</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="opacity-75">Capacity:</span>
                          <span className={`font-medium ${
                            stats.utilizationPercent > 90 ? 'text-foreground' : 
                            stats.utilizationPercent > 70 ? 'text-foreground' : 
                            'text-foreground'
                          }`}>
                            {stats.capacityLeft}h left
                          </span>
                        </div>
                        <div className="w-full bg-foreground/20 rounded-full h-1.5 mt-1">
                          <div 
                            className={`h-1.5 rounded-full ${stats.utilizationPercent > 90 ? 'bg-red-500 dark:bg-red-400' : stats.utilizationPercent > 70 ? 'bg-orange-500 dark:bg-orange-400' : 'bg-green-500 dark:bg-green-400'}`}
                            style={{ width: `${Math.min(stats.utilizationPercent, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Data Rows */}
              {dates.map((date) => {
                const holiday = actions.getHolidayForDate(date);
                const rowBackground = getRowBackgroundColor(date, holiday);
                const holidayInfo = holiday ? getHolidayDisplayInfo(holiday) : null;
                
                return (
                  <div
                    key={date.toISOString()}
                    className="grid"
                    style={{ 
                      gridTemplateColumns: `120px repeat(${filteredConsultants.length}, minmax(180px, 1fr))`,
                      backgroundColor: rowBackground,
                    }}
                  >
                    {/* Date Column */}
                    <div 
                      className="p-3 border-r-2 sticky left-0 z-5 text-center" 
                      style={{ 
                        backgroundColor: rowBackground || 'hsl(var(--muted) / 0.5)',
                        color: getContrastTextColor(rowBackground || 'transparent')
                      }}
                    >
                      <div className="font-medium">
                        {format(date, "EEE")}
                      </div>
                      <div className="text-sm opacity-75">
                        {format(date, "MMM d")}
                      </div>
                      {holidayInfo && (
                        <div className="text-xs mt-1">
                          <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                              <Badge 
                                variant="secondary" 
                                className="text-xs px-1 py-0.5 cursor-help"
                                style={{ 
                                  backgroundColor: holidayInfo.backgroundColor + "20", 
                                  color: holidayInfo.backgroundColor,
                                  border: `1px solid ${holidayInfo.backgroundColor}40`
                                }}
                              >
                                Public Holiday
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent 
                              side="top" 
                              className="bg-gray-900 text-white border-gray-700 shadow-lg"
                            >
                              <div className="text-center">
                                <div className="font-medium text-sm">{holidayInfo.name}</div>
                                <div className="text-xs text-gray-300 mt-1">{holidayInfo.designation}</div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      )}
                    </div>

                    {/* Consultant Columns */}
                    {filteredConsultants.map((consultant) => (
                      <GridCell
                        key={consultant.id}
                        consultant={consultant}
                        date={date}
                        assignments={state.assignments}
                        holidays={state.holidays}
                        isOnLeave={actions.isConsultantOnLeave(consultant.id, date)}
                        onAssignmentClick={handleAssignmentClick}
                        onCellClick={handleCellClick}
                        isPreviewMode={state.isPreviewMode}
                        selectedAssignment={selectedAssignment}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
      </TooltipProvider>
    );
  }

  // Consultants as rows layout
  return (
    <TooltipProvider>
      <Card className={className}>
      <CardContent className="p-0">
        <div className="overflow-auto max-h-[70vh] scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-600">
          <div className="min-w-fit">
            {/* Header Row */}
            <div 
              className="grid sticky top-0 z-10 bg-background border-b-2"
              style={{ 
                gridTemplateColumns: `180px repeat(${dates.length}, minmax(100px, 1fr))` 
              }}
            >
              <div className="p-3 font-medium border-r-2 bg-muted">
                Consultant
              </div>
              {dates.map((date) => {
                const holiday = actions.getHolidayForDate(date);
                const holidayInfo = holiday ? getHolidayDisplayInfo(holiday) : null;
                
                return (
                  <div 
                    key={date.toISOString()}
                    className="p-2 font-medium border-r text-center bg-muted"
                  >
                    <div className="font-medium">
                      {format(date, "EEE")}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(date, "MMM d")}
                    </div>
                    {holidayInfo && (
                      <div className="text-xs mt-1">
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <Badge 
                              variant="secondary" 
                              className="text-xs px-1 py-0.5 cursor-help"
                              style={{ 
                                backgroundColor: holidayInfo.backgroundColor + "20", 
                                color: holidayInfo.backgroundColor,
                                border: `1px solid ${holidayInfo.backgroundColor}40`
                              }}
                            >
                              Public Holiday
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent 
                            side="top" 
                            className="bg-gray-900 text-white border-gray-700 shadow-lg"
                          >
                            <div className="text-center">
                              <div className="font-medium text-sm">{holidayInfo.name}</div>
                              <div className="text-xs text-gray-300 mt-1">{holidayInfo.designation}</div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Consultant Rows */}
            {filteredConsultants.map((consultant) => {
              const stats = calculateConsultantStats(consultant, state.assignments, dates, state.isPreviewMode);
              return (
                <div
                  key={consultant.id}
                  className="grid"
                  style={{ 
                    gridTemplateColumns: `220px repeat(${dates.length}, minmax(100px, 1fr))` 
                  }}
                >
                  {/* Consultant Column */}
                  <div className="p-3 border-r-2 sticky left-0 z-5 text-foreground" style={{ backgroundColor: 'hsl(var(--muted) / 0.5)' }}>
                    <div className="font-medium truncate" title={consultant.name}>
                      {consultant.name}
                    </div>
                    <div className="text-sm opacity-75">
                      {getRoleDisplayName(consultant.role || '')}
                    </div>
                    
                    {/* Enhanced Statistics */}
                    <div className="space-y-1 mt-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="opacity-75">Payrolls:</span>
                        <Badge variant="secondary" className="text-xs px-1 bg-foreground/10 text-foreground border-foreground/20">
                          {stats.payrollCount}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="opacity-75">Employees:</span>
                        <span className="font-medium text-foreground">{stats.totalEmployees}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="opacity-75">Hours:</span>
                        <span className="font-medium text-foreground">{stats.totalProcessingHours}h</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="opacity-75">Capacity:</span>
                        <span className={`font-medium text-xs ${
                          stats.utilizationPercent > 90 ? 'text-foreground' : 
                          stats.utilizationPercent > 70 ? 'text-foreground' : 
                          'text-foreground'
                        }`}>
                          {stats.capacityLeft}h left
                        </span>
                      </div>
                      <div className="w-full bg-foreground/20 rounded-full h-1 mt-1">
                        <div 
                          className={`h-1 rounded-full ${stats.utilizationPercent > 90 ? 'bg-red-500 dark:bg-red-400' : stats.utilizationPercent > 70 ? 'bg-orange-500 dark:bg-orange-400' : 'bg-green-500 dark:bg-green-400'}`}
                          style={{ width: `${Math.min(stats.utilizationPercent, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Date Columns - each cell gets its own background */}
                  {dates.map((date) => {
                    const holiday = actions.getHolidayForDate(date);
                    const cellBackground = getRowBackgroundColor(date, holiday);
                    
                    return (
                      <div key={date.toISOString()} style={{ backgroundColor: cellBackground }}>
                        <GridCell
                          consultant={consultant}
                          date={date}
                          assignments={state.assignments}
                          holidays={state.holidays}
                          isOnLeave={actions.isConsultantOnLeave(consultant.id, date)}
                          onAssignmentClick={handleAssignmentClick}
                          onCellClick={handleCellClick}
                          isPreviewMode={state.isPreviewMode}
                          selectedAssignment={selectedAssignment}
                        />
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
    </TooltipProvider>
  );
}