"use client";

import { useQuery } from "@apollo/client";
import {
  format,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Clock,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GetPayrollsByMonthDocument } from "../graphql/generated/graphql";
import { useAuthContext } from "@/lib/auth";
import { PermissionGuard } from "@/components/auth/permission-guard";


// Import generated GraphQL operations from the payrolls domain

// Types
type PayrollEvent = {
  id: string;
  payrollId: string;
  date: Date;
  client: { id: string; name: string };
  type: "processing" | "eft" | "review" | "submission";
  consultant: { id: string; name: string };
  status: string;
  processingDate: Date;
  eftDate: Date;
};

type CalendarView = "month" | "week";
type WeekOrientation = "days-as-rows" | "days-as-columns";
type EventFilter = "all" | "processing" | "eft" | "review" | "submission";

interface SchedulePeriod {
  periodNumber: number;
  baseDate: string;
  processingDate: string;
  eftDate: string;
  payrollId?: string;
  payrollName?: string;
  clientName?: string;
}

interface DragPreviewData {
  payrollId: string;
  originalConsultantId: string;
  newConsultantId: string;
  originalConsultantName: string;
  newConsultantName: string;
  clientName: string;
  payrollName: string;
}

interface PendingChange {
  id: string;
  payrollId: string;
  originalConsultantId: string;
  newConsultantId: string;
  originalConsultantName: string;
  newConsultantName: string;
  clientName: string;
  payrollName: string;
  previewApplied: boolean;
}

// Temporarily use any to avoid fragment complexity - this will be resolved when fragments are properly typed
type Payroll = any;
type Holiday = any;

export function PayrollSchedule() {
  const { hasPermission } = useAuthContext();
  
  if (!hasPermission('payroll:read')) {
    return null;
  }

  const [currentView, setCurrentView] = useState<CalendarView>("month");
  const [weekOrientation, setWeekOrientation] =
    useState<WeekOrientation>("days-as-rows");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [clientFilter, setClientFilter] = useState("all");
  const [payrollFilter, setPayrollFilter] = useState<EventFilter>("all");
  const [staffFilter, setStaffFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("calendar");

  // Drag and Drop State
  const [draggedEvent, setDraggedEvent] = useState<PayrollEvent | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState<PendingChange[]>([]);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [currentPreview, setCurrentPreview] = useState<DragPreviewData | null>(
    null
  );

  // Schedule table state
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleData, setScheduleData] = useState<SchedulePeriod[]>([]);
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  // Calculate date range for data fetching
  const startDate = useMemo(() => {
    return currentView === "month"
      ? format(startOfMonth(currentDate), "yyyy-MM-dd")
      : format(startOfWeek(currentDate), "yyyy-MM-dd");
  }, [currentDate, currentView]);

  const endDate = useMemo(() => {
    return currentView === "month"
      ? format(endOfMonth(currentDate), "yyyy-MM-dd")
      : format(endOfWeek(currentDate), "yyyy-MM-dd");
  }, [currentDate, currentView]);

  // GraphQL Data Fetching using domain queries
  const {
    data: payrollsData,
    loading: payrollsLoading,
    error: payrollsError,
    refetch: refetchPayrolls,
  } = useQuery(GetPayrollsByMonthDocument, {
    variables: {
      startDate: startDate,
      endDate: endDate,
    },
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
  });

  // Use GetPayrollsByMonth for holidays data
  const { data: holidaysData, loading: holidaysLoading } = useQuery(
    GetPayrollsByMonthDocument,
    {
      variables: {
        startDate: startDate,
        endDate: endDate,
      },
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
    }
  );

  const loading = payrollsLoading || holidaysLoading;
  const error = payrollsError;
  const payrolls = payrollsData?.payrolls || [];
  const holidays: Holiday[] = [];

  // Update query when date range changes
  useEffect(() => {
    refetchPayrolls({
      startDate: startDate,
      endDate: endDate,
    });
  }, [startDate, endDate, refetchPayrolls]);

  // Transform payroll data to events
  const events = useMemo(() => {
    const eventList: PayrollEvent[] = [];

    payrolls.forEach((payroll: any) => {
      const payrollDates = payroll.payroll_dates || [];
      payrollDates.forEach((dateInfo: any) => {
        // Processing event
        eventList.push({
          id: `${payroll.id}-processing`,
          payrollId: payroll.id,
          date: new Date(dateInfo.processing_date),
          client: {
            id: payroll.client?.id || "",
            name: payroll.client?.name || "",
          },
          type: "processing",
          consultant: {
            id: payroll.userByPrimaryConsultantUserId?.id || "",
            name: payroll.userByPrimaryConsultantUserId?.name || "Unassigned",
          },
          status: payroll.status || "unknown",
          processingDate: new Date(dateInfo.processing_date),
          eftDate: new Date(dateInfo.adjusted_eft_date),
        });

        // EFT event
        eventList.push({
          id: `${payroll.id}-eft`,
          payrollId: payroll.id,
          date: new Date(dateInfo.adjusted_eft_date),
          client: {
            id: payroll.client?.id || "",
            name: payroll.client?.name || "",
          },
          type: "eft",
          consultant: {
            id: payroll.userByPrimaryConsultantUserId?.id || "",
            name: payroll.userByPrimaryConsultantUserId?.name || "Unassigned",
          },
          status: payroll.status || "unknown",
          processingDate: new Date(dateInfo.processing_date),
          eftDate: new Date(dateInfo.adjusted_eft_date),
        });
      });
    });

    return eventList;
  }, [payrolls]);

  // Extract unique clients and consultants
  const clients = useMemo(() => {
    const clientMap = new Map();
    clientMap.set("all", { id: "all", name: "All Clients" });

    payrolls.forEach((payroll: any) => {
      if (payroll.client && !clientMap.has(payroll.client.id)) {
        clientMap.set(payroll.client.id, payroll.client);
      }
    });

    return Array.from(clientMap.values());
  }, [payrolls]);

  const consultants = useMemo(() => {
    const consultantMap = new Map();
    consultantMap.set("all", { id: "all", name: "All Consultants" });

    payrolls.forEach((payroll: any) => {
      const consultant = payroll.userByPrimaryConsultantUserId;
      if (consultant && !consultantMap.has(consultant.id)) {
        consultantMap.set(consultant.id, consultant);
      }
    });

    return Array.from(consultantMap.values());
  }, [payrolls]);

  // Filter events based on selected filters
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      if (clientFilter !== "all" && event.client.id !== clientFilter)
        return false;
      if (payrollFilter !== "all" && event.type !== payrollFilter) return false;
      if (staffFilter !== "all" && event.consultant.id !== staffFilter)
        return false;
      return true;
    });
  }, [events, clientFilter, payrollFilter, staffFilter]);

  // Helper functions
  const isSameDay = (date1: string | Date, date2: string | Date): boolean => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.toDateString() === d2.toDateString();
  };

  const formatMonth = (date: Date) => {
    return format(date, "MMMM yyyy");
  };

  const formatWeek = (date: Date) => {
    const start = startOfWeek(date);
    const end = endOfWeek(date);
    return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
  };

  const navigatePrevious = () => {
    setCurrentDate(prev =>
      currentView === "month" ? subMonths(prev, 1) : subWeeks(prev, 1)
    );
  };

  const navigateNext = () => {
    setCurrentDate(prev =>
      currentView === "month" ? addMonths(prev, 1) : addWeeks(prev, 1)
    );
  };

  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter(event => isSameDay(event.date, date));
  };

  const getHolidayForDate = (date: Date) => {
    return holidays.find((holiday: any) => isSameDay(holiday.date, date));
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "processing":
        return "bg-blue-100 border-blue-200 text-blue-800";
      case "eft":
        return "bg-green-100 border-green-200 text-green-800";
      case "review":
        return "bg-purple-100 border-purple-200 text-purple-800";
      case "submission":
        return "bg-orange-100 border-orange-200 text-orange-800";
      default:
        return "bg-gray-100 border-gray-200 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "processing":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "overdue":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  // Drag and drop handlers (simplified for now)
  const handleDragStart = (e: React.DragEvent, event: PayrollEvent) => {
    setDraggedEvent(event);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedEvent(null);
    setDragOverTarget(null);
  };

  const handleDragOver = (e: React.DragEvent, targetConsultantId: string) => {
    e.preventDefault();
    setDragOverTarget(targetConsultantId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverTarget(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetConsultantId: string) => {
    e.preventDefault();
    // For now, just show an alert - full implementation would update the database
    alert(`Would reassign payroll to consultant ${targetConsultantId}`);
    setDraggedEvent(null);
    setDragOverTarget(null);
  };

  const renderMonthView = () => {
    // Get all days in the current month
    const startOfMonthDate = startOfMonth(currentDate);
    const endOfMonthDate = endOfMonth(currentDate);
    const days = [];

    for (
      let d = new Date(startOfMonthDate);
      d <= endOfMonthDate;
      d.setDate(d.getDate() + 1)
    ) {
      days.push(new Date(d));
    }

    return (
      <div className="grid grid-cols-7 gap-2">
        {/* Header row */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="text-center font-medium text-gray-600 p-2">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map(day => {
          const dayEvents = getEventsForDate(day);
          const holiday = getHolidayForDate(day);

          return (
            <div
              key={day.toISOString()}
              className={`min-h-[120px] border rounded-lg p-2 ${
                holiday ? "bg-red-50 border-red-200" : "bg-white"
              }`}
            >
              <div className="text-sm font-medium mb-1">{format(day, "d")}</div>

              {holiday && (
                <div className="text-xs text-red-600 mb-1">
                  {holiday.local_name}
                </div>
              )}

              <div className="space-y-1">
                {dayEvents.map(event => (
                  <div
                    key={event.id}
                    className={`text-xs p-1 rounded border ${getEventTypeColor(
                      event.type
                    )} cursor-pointer`}
                    draggable
                    onDragStart={e => handleDragStart(e, event)}
                    onDragEnd={handleDragEnd}
                    title={`${event.client.name} - ${event.type}`}
                  >
                    <div className="flex items-center gap-1">
                      {getStatusIcon(event.status)}
                      <span className="truncate">{event.client.name}</span>
                    </div>
                    <div className="text-xs opacity-70">{event.type}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    // Get all days in the current week
    const startOfWeekDate = startOfWeek(currentDate);
    const days = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeekDate);
      day.setDate(day.getDate() + i);
      return day;
    });

    return (
      <div className="grid grid-cols-7 gap-4">
        {days.map(day => {
          const dayEvents = getEventsForDate(day);
          const holiday = getHolidayForDate(day);

          return (
            <div key={day.toISOString()} className="space-y-2">
              <div className="text-center">
                <div className="font-medium">{format(day, "EEE")}</div>
                <div className="text-2xl">{format(day, "d")}</div>
              </div>

              <div
                className={`min-h-[200px] border rounded-lg p-2 ${
                  holiday ? "bg-red-50 border-red-200" : "bg-white"
                }`}
              >
                {holiday && (
                  <div className="text-xs text-red-600 mb-2">
                    {holiday.local_name}
                  </div>
                )}

                <div className="space-y-2">
                  {dayEvents.map(event => (
                    <div
                      key={event.id}
                      className={`text-xs p-2 rounded border ${getEventTypeColor(
                        event.type
                      )} cursor-pointer`}
                      draggable
                      onDragStart={e => handleDragStart(e, event)}
                      onDragEnd={handleDragEnd}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        {getStatusIcon(event.status)}
                        <span className="font-medium">{event.client.name}</span>
                      </div>
                      <div className="text-xs opacity-70">{event.type}</div>
                      <div className="text-xs opacity-70">
                        {event.consultant.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Handle loading and error states
  if (loading && !payrollsData && !holidaysData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading payroll schedule...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️ Error loading schedule</div>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Payroll Schedule
            </h1>
            <p className="text-gray-600">
              Enhanced calendar view with drag-and-drop functionality
            </p>
          </div>
        </div>

        {/* Controls */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center gap-4">
              {/* View Selection */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">View:</span>
                <Tabs
                  value={currentView}
                  onValueChange={(value: string) =>
                    setCurrentView(value as CalendarView)
                  }
                >
                  <TabsList>
                    <TabsTrigger value="month">Month</TabsTrigger>
                    <TabsTrigger value="week">Week</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <Select value={clientFilter} onValueChange={setClientFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={staffFilter} onValueChange={setStaffFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {consultants.map(consultant => (
                      <SelectItem key={consultant.id} value={consultant.id}>
                        {consultant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={payrollFilter}
                  onValueChange={(value: string) =>
                    setPayrollFilter(value as EventFilter)
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="eft">EFT</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="submission">Submission</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={navigatePrevious}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <h2 className="text-xl font-semibold">
            {currentView === "month"
              ? formatMonth(currentDate)
              : formatWeek(currentDate)}
          </h2>

          <Button variant="outline" onClick={navigateNext}>
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Calendar View */}
        <Card>
          <CardContent className="p-6">
            {currentView === "month" ? renderMonthView() : renderWeekView()}
          </CardContent>
        </Card>

        {/* Legend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div key="processing" className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div>
                <span className="text-sm">Processing</span>
              </div>
              <div key="eft" className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
                <span className="text-sm">EFT</span>
              </div>
              <div key="review" className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-purple-100 border border-purple-200 rounded"></div>
                <span className="text-sm">Review</span>
              </div>
              <div key="submission" className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-orange-100 border border-orange-200 rounded"></div>
                <span className="text-sm">Submission</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
