// app/(dashboard)/payrolls/[id]/page.tsx
"use client";

import { useMutation, useQuery, useLazyQuery } from "@apollo/client";

// Import role enums

import {
  ArrowLeft,
  Pencil,
  RefreshCw,
  MoreHorizontal,
  Save,
  Download,
  Upload,
  Copy,
  Eye,
  Clock,
  Users,
  Building2,
  CheckCircle,
  AlertTriangle,
  FileText,
  Calculator,
  UserCheck,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ExportCsv } from "@/components/export-csv";
import { ExportPdf } from "@/components/export-pdf";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PayrollDetailsLoading } from "@/components/ui/loading-states";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { NotesListWithAdd } from "@/domains/notes/components/notes-list";
import { PayrollDatesView } from "@/domains/payrolls/components/payroll-dates-view";
import { PayrollVersionHistory } from "@/domains/payrolls/components/payroll-version-history";
import {
  GetPayrollByIdDocument,
  GetPayrollForEditDocument,
  GetPayrollDatesDocument,
  GetPayrollsDocument,
  UpdatePayrollDocument,
} from "@/domains/payrolls/graphql/generated/graphql";

// Import additional documents separately to avoid potential module resolution issues
import { GetPayrollCyclesDocument } from "@/domains/payrolls/graphql/generated/graphql";
import { GetPayrollDateTypesDocument } from "@/domains/payrolls/graphql/generated/graphql";
import { GetLatestPayrollVersionDocument } from "@/domains/payrolls/graphql/generated/graphql";
import { GeneratePayrollDatesDocument } from "@/domains/payrolls/graphql/generated/graphql";
import { GetAllUsersListDocument } from "@/domains/users/graphql/generated/graphql";
import {
  usePayrollVersioning,
  usePayrollStatusUpdate,
  getVersionReason,
} from "@/hooks/use-payroll-versioning";
import { useFreshQuery } from "@/hooks/use-strategic-query";
import { useAuthContext } from "@/lib/auth";
import { PayrollCycleType, PayrollDateType } from "@/types/enums";

// Add error boundary component for debugging
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error("PayrollPage Error:", error);
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-lg">
        <h2 className="text-red-800 font-semibold">Error in Payroll Page</h2>
        <pre className="text-sm text-red-600 mt-2">{String(error)}</pre>
      </div>
    );
  }
}

// Payroll status configuration
const getStatusConfig = (status: string) => {
  const configs = {
    Implementation: {
      color: "bg-blue-100 text-blue-800",
      icon: Clock,
      progress: 15,
    },
    Active: {
      color: "bg-green-100 text-green-800",
      icon: CheckCircle,
      progress: 100,
    },
    Inactive: {
      color: "bg-gray-100 text-gray-800",
      icon: AlertTriangle,
      progress: 0,
    },
    draft: {
      color: "bg-yellow-100 text-yellow-800",
      icon: FileText,
      progress: 10,
    },
    "data-entry": {
      color: "bg-blue-100 text-blue-800",
      icon: Calculator,
      progress: 30,
    },
    review: { color: "bg-purple-100 text-purple-800", icon: Eye, progress: 50 },
    processing: {
      color: "bg-indigo-100 text-indigo-800",
      icon: RefreshCw,
      progress: 70,
    },
    "manager-review": {
      color: "bg-orange-100 text-orange-800",
      icon: UserCheck,
      progress: 85,
    },
    approved: {
      color: "bg-green-100 text-green-800",
      icon: CheckCircle,
      progress: 95,
    },
    submitted: {
      color: "bg-teal-100 text-teal-800",
      icon: Upload,
      progress: 100,
    },
    paid: {
      color: "bg-emerald-100 text-emerald-800",
      icon: CheckCircle,
      progress: 100,
    },
    "on-hold": {
      color: "bg-amber-100 text-amber-800",
      icon: AlertTriangle,
      progress: 60,
    },
    cancelled: {
      color: "bg-red-100 text-red-800",
      icon: AlertTriangle,
      progress: 0,
    },
  };

  return configs[status as keyof typeof configs] || configs["Implementation"];
};

// Payroll cycle constants (from creation form)
const PAYROLL_CYCLES = [
  { id: PayrollCycleType.Weekly, name: "Weekly" },
  { id: PayrollCycleType.Fortnightly, name: "Fortnightly" },
  { id: PayrollCycleType.BiMonthly, name: "Bi-Monthly" },
  { id: PayrollCycleType.Monthly, name: "Monthly" },
  { id: PayrollCycleType.Quarterly, name: "Quarterly" },
];

const PAYROLL_DATE_TYPES = {
  [PayrollCycleType.Weekly]: [],
  [PayrollCycleType.Fortnightly]: [],
  [PayrollCycleType.BiMonthly]: [
    { id: PayrollDateType.SOM, name: "Start of Month" },
    { id: PayrollDateType.EOM, name: "End of Month" },
  ],
  [PayrollCycleType.Monthly]: [
    { id: PayrollDateType.SOM, name: "Start of Month" },
    { id: PayrollDateType.EOM, name: "End of Month" },
    { id: PayrollDateType.FixedDate, name: "Fixed Date" },
  ],
  [PayrollCycleType.Quarterly]: [
    { id: PayrollDateType.SOM, name: "Start of Month" },
    { id: PayrollDateType.EOM, name: "End of Month" },
    { id: PayrollDateType.FixedDate, name: "Fixed Date" },
  ],
};

const WEEKDAYS = [
  { value: "1", label: "Monday" },
  { value: "2", label: "Tuesday" },
  { value: "3", label: "Wednesday" },
  { value: "4", label: "Thursday" },
  { value: "5", label: "Friday" },
];

// Additional helper functions from creation form
function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) {
    return "st";
  }
  if (j === 2 && k !== 12) {
    return "nd";
  }
  if (j === 3 && k !== 13) {
    return "rd";
  }
  return "th";
}

// Helper function to convert JavaScript day (0=Sunday, 1=Monday, etc.) to business weekday (1=Monday, 2=Tuesday, etc.)
function getBusinessWeekday(jsDay: number): number {
  // JavaScript: 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday
  // Business: 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday
  if (jsDay === 0) {
    return 0;
  } // Sunday - not a business day
  if (jsDay === 6) {
    return 0;
  } // Saturday - not a business day
  return jsDay; // Monday=1, Tuesday=2, etc.
}

// Calculate fortnightly week dates based on current date
function calculateFortnightlyWeeks() {
  const now = new Date();
  const currentYear = now.getFullYear();

  // Get the first day of January
  const firstDayOfYear = new Date(currentYear, 0, 1);

  // Find the first Sunday of the year (Week A starts on first Sunday)
  const firstSunday = new Date(firstDayOfYear);
  const dayOfWeek = firstDayOfYear.getDay();
  const daysToAdd = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  firstSunday.setDate(firstDayOfYear.getDate() + daysToAdd);

  // Calculate current week number since first Sunday
  const timeDiff = now.getTime() - firstSunday.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const weekNumber = Math.floor(daysDiff / 7);

  // Determine current week type (A or B)
  const isCurrentWeekA = weekNumber % 2 === 0;

  // Calculate this week's Sunday and Saturday
  const thisSunday = new Date(now);
  const currentDay = now.getDay();
  const daysFromSunday = currentDay;
  thisSunday.setDate(now.getDate() - daysFromSunday);

  const thisSaturday = new Date(thisSunday);
  thisSaturday.setDate(thisSunday.getDate() + 6);

  // Calculate next week's dates
  const nextSunday = new Date(thisSunday);
  nextSunday.setDate(thisSunday.getDate() + 7);

  const nextSaturday = new Date(nextSunday);
  nextSaturday.setDate(nextSunday.getDate() + 6);

  // Format dates
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
    });
  };

  const currentWeekLabel = `${formatDate(thisSunday)} - ${formatDate(
    thisSaturday
  )}`;
  const nextWeekLabel = `${formatDate(nextSunday)} - ${formatDate(
    nextSaturday
  )}`;

  if (isCurrentWeekA) {
    return [
      {
        value: "A",
        label: `Week A (Current: ${currentWeekLabel})`,
        description: "This week",
      },
      {
        value: "B",
        label: `Week B (Next: ${nextWeekLabel})`,
        description: "Next week",
      },
    ];
  } else {
    return [
      {
        value: "A",
        label: `Week A (Next: ${nextWeekLabel})`,
        description: "Next week",
      },
      {
        value: "B",
        label: `Week B (Current: ${currentWeekLabel})`,
        description: "This week",
      },
    ];
  }
}

// Get week type (A or B) for a specific date
function getWeekType(date: Date): "A" | "B" {
  const currentYear = date.getFullYear();
  const firstDayOfYear = new Date(currentYear, 0, 1);

  const firstSunday = new Date(firstDayOfYear);
  const dayOfWeek = firstDayOfYear.getDay();
  const daysToAdd = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  firstSunday.setDate(firstDayOfYear.getDate() + daysToAdd);

  const timeDiff = date.getTime() - firstSunday.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const weekNumber = Math.floor(daysDiff / 7);

  return weekNumber % 2 === 0 ? "A" : "B";
}

// Enhanced Calendar component for both fortnightly and fixed date selection
function EnhancedCalendar({
  mode,
  selectedWeek,
  selectedDay,
  onWeekSelect,
  onDaySelect,
}: {
  mode: "fortnightly" | "fixed";
  selectedWeek?: string;
  selectedDay?: string;
  onWeekSelect?: (week: string) => void;
  onDaySelect: (day: string) => void;
}) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const firstDayWeekday = firstDayOfMonth.getDay();

  const calendarStart = new Date(firstDayOfMonth);
  calendarStart.setDate(firstDayOfMonth.getDate() - firstDayWeekday);

  const weeks = [];
  const currentDate = new Date(calendarStart);

  for (let week = 0; week < 6; week++) {
    const days = [];
    for (let day = 0; day < 7; day++) {
      const date = new Date(currentDate);
      const isCurrentMonth = date.getMonth() === currentMonth;
      const isToday = date.toDateString() === now.toDateString();
      const weekType = mode === "fortnightly" ? getWeekType(date) : null;
      const businessWeekday = getBusinessWeekday(date.getDay()); // Convert JS day to business weekday

      days.push({
        date: new Date(date),
        day: date.getDate(),
        businessWeekday, // Use business weekday instead of dayOfWeek
        isCurrentMonth,
        isToday,
        weekType,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }
    weeks.push(days);

    if (days.some(d => d.date.getMonth() > currentMonth)) {
      break;
    }
  }

  const monthName = now.toLocaleDateString("en-AU", {
    month: "long",
    year: "numeric",
  });

  const handleDayClick = (dayInfo: any) => {
    if (mode === "fortnightly") {
      const isWeekday =
        dayInfo.businessWeekday >= 1 && dayInfo.businessWeekday <= 5;
      if (!isWeekday) {
        return;
      }
      onWeekSelect?.(dayInfo.weekType);
      onDaySelect(dayInfo.businessWeekday.toString());
    } else {
      onDaySelect(dayInfo.day.toString());
    }
  };

  return (
    <div className="mt-2 p-4 border rounded-lg bg-gray-50">
      <div className="text-center mb-4">
        <h4 className="font-medium text-gray-900">{monthName}</h4>
        <p className="text-sm text-gray-600">
          {mode === "fortnightly"
            ? "Select Week Type & Day of Week"
            : "Select Day of Month"}
        </p>
      </div>

      {mode === "fortnightly" && (
        <div className="space-y-3">
          <div className="flex justify-center gap-4 mb-3 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
              <span>Week A</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span>Week B</span>
            </div>
          </div>
          <div className="text-center text-sm text-gray-600 bg-amber-50 border border-amber-200 rounded p-2">
            <span className="font-medium">Weekdays Only:</span> Payroll
            processing is restricted to Monday - Friday
          </div>
        </div>
      )}

      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(dayName => (
          <div key={dayName} className="p-2 font-medium text-gray-500">
            {dayName}
          </div>
        ))}

        {weeks.map((week, weekIndex) =>
          week.map((dayInfo, dayIndex) => {
            let isSelected = false;
            let isDisabled = false;
            let buttonClass = "p-2 text-sm rounded transition-all ";

            if (mode === "fortnightly") {
              const isWeekA = dayInfo.weekType === "A";
              const isSelectedWeek = selectedWeek === dayInfo.weekType;
              const isSelectedDay =
                selectedDay === dayInfo.businessWeekday.toString();
              const isWeekday =
                dayInfo.businessWeekday >= 1 && dayInfo.businessWeekday <= 5;

              isSelected = isSelectedWeek && isSelectedDay;
              isDisabled = !isWeekday;

              if (isDisabled) {
                buttonClass +=
                  "text-gray-400 bg-gray-100 cursor-not-allowed opacity-50 ";
              } else {
                buttonClass += `cursor-pointer ${
                  !dayInfo.isCurrentMonth ? "text-gray-300" : "text-gray-900"
                } `;
                buttonClass += `${
                  dayInfo.isToday ? "font-bold ring-2 ring-orange-400" : ""
                } `;
                buttonClass += isWeekA
                  ? isSelected
                    ? "bg-blue-300 border-blue-500 border-2 ring-2 ring-blue-200"
                    : "bg-blue-100 border border-blue-300 hover:bg-blue-150"
                  : isSelected
                    ? "bg-green-300 border-green-500 border-2 ring-2 ring-green-200"
                    : "bg-green-100 border border-green-300 hover:bg-green-150";
              }
            } else {
              isSelected = selectedDay === dayInfo.day.toString();
              isDisabled = !dayInfo.isCurrentMonth;

              buttonClass += `cursor-pointer `;
              buttonClass += `${
                !dayInfo.isCurrentMonth
                  ? "text-gray-300 bg-gray-50"
                  : "text-gray-900 bg-white border hover:bg-gray-50"
              } `;
              buttonClass += `${
                dayInfo.isToday ? "font-bold ring-2 ring-orange-400" : ""
              } `;
              buttonClass += `${
                isSelected
                  ? "bg-blue-200 border-blue-400 border-2 ring-2 ring-blue-200"
                  : ""
              } `;
            }

            return (
              <button
                key={`${weekIndex}-${dayIndex}`}
                type="button"
                onClick={() => handleDayClick(dayInfo)}
                className={buttonClass}
                disabled={isDisabled}
              >
                {dayInfo.day}
              </button>
            );
          })
        )}
      </div>

      <div className="mt-3 p-2 bg-white rounded border text-center text-sm">
        {mode === "fortnightly" ? (
          <>
            {selectedWeek && selectedDay ? (
              <div className="space-y-1">
                <div>
                  <span className="font-medium">Week {selectedWeek}</span>
                </div>
                <div>
                  <span className="text-gray-600">
                    {WEEKDAYS.find(w => w.value === selectedDay)?.label}s
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-gray-500">
                Click a weekday to select week type and day
              </span>
            )}
          </>
        ) : (
          <>
            {selectedDay ? (
              <span className="font-medium">
                Selected: {selectedDay}
                {getOrdinalSuffix(parseInt(selectedDay))} of the Month
              </span>
            ) : (
              <span className="text-gray-500">Click a day to select date</span>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Helper function to get cycle name from payroll data
const getCycleName = (payroll: any) => {
  // Check nested object first - this contains the enum value like 'weekly', 'fortnightly', etc.
  const cycleEnum = payroll?.payrollCycle?.name;
  if (cycleEnum) {
    // Look up the display name in our constants
    const cycle = PAYROLL_CYCLES.find(c => c.id === cycleEnum);
    return cycle ? cycle.name : cycleEnum; // Return display name like 'Weekly' or fallback to enum
  }

  // Fallback to cycleId lookup if nested object not available
  if (payroll?.cycleId) {
    const cycle = PAYROLL_CYCLES.find(c => c.id === payroll.cycleId);
    return cycle ? cycle.name : `${payroll.cycleId} (Unknown)`;
  }

  return "Not set";
};

// Helper function to get date type name
const getDateTypeName = (payroll: any) => {
  // Check nested object first - this contains the enum value like 'dow', 'som', etc.
  const dateTypeName = payroll?.payroll_date_type?.name;
  if (dateTypeName) {
    // Handle enum values from the database
    if (dateTypeName === "dow") {
      return "Day of Week";
    }
    if (dateTypeName === "som") {
      return "Start of Month";
    }
    if (dateTypeName === "eom") {
      return "End of Month";
    }
    if (dateTypeName === "fixed_date") {
      return "Fixed Date";
    }
    if (dateTypeName === "week_a") {
      return "Week A";
    }
    if (dateTypeName === "week_b") {
      return "Week B";
    }

    // If it's already a readable name, return it
    return dateTypeName;
  }

  // For weekly/fortnightly, default to Day of Week if no date type is specified
  const cycleId = payroll.payrollCycle?.id || payroll.cycleId;
  const cycleName = payroll.payrollCycle?.name;
  if (cycleName === "weekly" || cycleName === "fortnightly") {
    return "Day of Week";
  }

  return "Not set";
};

// Helper function to get readable date value display (comprehensive version)
const getDateValueDisplay = (payroll: any) => {
  const cycleId = payroll.payrollCycle?.id || payroll.cycleId;
  const dateValue = payroll.dateValue;

  // If no date value is set, show appropriate message based on cycle
  if (!dateValue && dateValue !== 0) {
    if (cycleId === "weekly") {
      return "Day not selected";
    }
    if (cycleId === "fortnightly") {
      return "Day not selected";
    }
    if (cycleId === "bi_monthly") {
      return "Based on date type";
    }
    if (cycleId === "monthly" || cycleId === "quarterly") {
      const dateTypeId = payroll.payrollDateType?.id || payroll.dateTypeId;
      if (dateTypeId === "SOM" || dateTypeId === "som") {
        return "Start of the Month (1st)";
      }
      if (dateTypeId === "EOM" || dateTypeId === "eom") {
        return "End of the Month (last day)";
      }
      if (dateTypeId === "fixed" || dateTypeId === "fixed_date") {
        return "Day not selected";
      }
      return "Based on date type";
    }
    return "Not configured";
  }

  // For weekly - show weekday name
  if (cycleId === "weekly") {
    const weekday = WEEKDAYS.find(w => w.value === dateValue.toString());
    return weekday ? weekday.label : `Day ${dateValue}`;
  }

  // For fortnightly - show weekday name (Week A/B is calculated dynamically by the database)
  if (cycleId === "fortnightly") {
    const weekday = WEEKDAYS.find(w => w.value === dateValue.toString());
    return weekday
      ? `Every fortnight on ${weekday.label}`
      : `Every fortnight on day ${dateValue}`;
  }

  // For bi-monthly - show based on date type
  if (cycleId === "bi_monthly") {
    const dateTypeId = payroll.payrollDateType?.id || payroll.dateTypeId;
    if (dateTypeId === "SOM" || dateTypeId === "som") {
      return "1st and 15th of month";
    }
    if (dateTypeId === "EOM" || dateTypeId === "eom") {
      return "15th and last day of month";
    }
    return "Based on date type";
  }

  // For monthly/quarterly with fixed dates - show ordinal
  if (cycleId === "monthly" || cycleId === "quarterly") {
    const dateTypeId = payroll.payrollDateType?.id || payroll.dateTypeId;
    if (dateTypeId === "fixed" || dateTypeId === "fixed_date") {
      return `${dateValue}${getOrdinalSuffix(dateValue)} of the Month`;
    }
    if (dateTypeId === "SOM" || dateTypeId === "som") {
      return "Start of the Month (1st)";
    }
    if (dateTypeId === "EOM" || dateTypeId === "eom") {
      return "End of the Month (last day)";
    }
  }

  // For other cases, just show the number
  return dateValue.toString();
};

// Helper function to get enhanced schedule summary with Week A/B for fortnightly
const getEnhancedScheduleSummary = (payroll: any) => {
  const cycleName = getCycleName(payroll);
  const cycleNameLower = payroll.payrollCycle?.name; // This contains enum values like 'weekly'
  const dateValue = payroll.dateValue;

  // If no cycle is set
  if (!cycleName || cycleName === "Not set") {
    return "Schedule not configured";
  }

  if (cycleNameLower === "weekly") {
    if (!dateValue && dateValue !== 0) {
      return `${cycleName} - Day not selected`;
    }
    const weekday = WEEKDAYS.find(w => w.value === dateValue.toString());
    return `${cycleName} - ${weekday ? weekday.label : `Day ${dateValue}`}`;
  }

  if (cycleNameLower === "fortnightly") {
    if (!dateValue && dateValue !== 0) {
      return `${cycleName} - Day not selected`;
    }
    const weekday = WEEKDAYS.find(w => w.value === dateValue.toString());

    // Calculate current week type (A or B) based on current date
    const now = new Date();
    const currentYear = now.getFullYear();
    const firstDayOfYear = new Date(currentYear, 0, 1);
    const firstSunday = new Date(firstDayOfYear);
    const dayOfWeek = firstDayOfYear.getDay();
    const daysToAdd = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
    firstSunday.setDate(firstDayOfYear.getDate() + daysToAdd);

    const timeDiff = now.getTime() - firstSunday.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const weekNumber = Math.floor(daysDiff / 7);
    const isCurrentWeekA = weekNumber % 2 === 0;

    const weekType = isCurrentWeekA ? "A" : "B";
    return `${cycleName} - Week ${weekType} - ${
      weekday ? weekday.label : `Day ${dateValue}`
    }`;
  }

  if (cycleNameLower === "bi_monthly") {
    const dateTypeName = payroll.payrollDateType?.name;
    if (dateTypeName === "som") {
      return `${cycleName} - 1st and 15th of Month`;
    }
    if (dateTypeName === "eom") {
      return `${cycleName} - 15th and last day of Month`;
    }
    return `${cycleName} - ${getDateTypeName(payroll)}`;
  }

  if (cycleNameLower === "monthly" || cycleNameLower === "quarterly") {
    const dateTypeName = payroll.payrollDateType?.name;

    if (dateTypeName === "fixed_date" && dateValue) {
      return `${cycleName} - ${dateValue}${getOrdinalSuffix(
        dateValue
      )} of the Month`;
    }

    if (dateTypeName === "som") {
      return `${cycleName} - Start of the Month`;
    }

    if (dateTypeName === "eom") {
      return `${cycleName} - End of the Month`;
    }

    if (dateTypeName === "fixed_date") {
      return `${cycleName} - Day not selected`;
    }

    return `${cycleName} - ${getDateTypeName(payroll)}`;
  }

  // Fallback
  return `${cycleName} - ${getDateTypeName(payroll)}`;
};

// Helper function to get schedule summary (like creation form)
const getScheduleSummary = (payroll: any) => {
  const cycleName = getCycleName(payroll);
  const cycleNameLower = payroll.payrollCycle?.name; // This contains enum values like 'weekly'
  const dateValue = payroll.dateValue;

  // If no cycle is set
  if (!cycleName || cycleName === "Not set") {
    return "Schedule not configured";
  }

  if (cycleNameLower === "weekly") {
    if (!dateValue && dateValue !== 0) {
      return `${cycleName} - Day not selected`;
    }
    const weekday = WEEKDAYS.find(w => w.value === dateValue.toString());
    return `${cycleName} - ${weekday ? weekday.label : `Day ${dateValue}`}`;
  }

  if (cycleNameLower === "fortnightly") {
    if (!dateValue && dateValue !== 0) {
      return `${cycleName} - Day not selected`;
    }
    const weekday = WEEKDAYS.find(w => w.value === dateValue.toString());
    return `${cycleName} - ${weekday ? weekday.label : `Day ${dateValue}`}`;
  }

  if (cycleNameLower === "bi_monthly") {
    const dateTypeName = payroll.payrollDateType?.name;
    if (dateTypeName === "som") {
      return `${cycleName} - 1st and 15th of the Month`;
    }
    if (dateTypeName === "eom") {
      return `${cycleName} - 15th and last day of the Month`;
    }
    return `${cycleName} - ${getDateTypeName(payroll)}`;
  }

  if (cycleNameLower === "monthly" || cycleNameLower === "quarterly") {
    const dateTypeName = payroll.payrollDateType?.name;

    if (dateTypeName === "fixed_date" && dateValue) {
      return `${cycleName} - ${dateValue}${getOrdinalSuffix(
        dateValue
      )} of the Month`;
    }

    if (dateTypeName === "som") {
      return `${cycleName} - Start of the Month`;
    }

    if (dateTypeName === "eom") {
      return `${cycleName} - End of the Month`;
    }

    if (dateTypeName === "fixed_date") {
      return `${cycleName} - Day not selected`;
    }

    return `${cycleName} - ${getDateTypeName(payroll)}`;
  }

  // Fallback
  return `${cycleName} - ${getDateTypeName(payroll)}`;
};

// Format currency function
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date function
const formatDate = (date: string | Date) => {
  if (!date) {
    return "Not set";
  }
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-AU", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Format date with time
const formatDateTime = (date: string | Date) => {
  if (!date) {
    return "Not set";
  }
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-AU", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Helper function to get user-friendly role display name
const getRoleDisplayName = (role: string) => {
  switch (role) {
    case "developer":
    case "org_admin":
      return "Admin";
    case "manager":
      return "Manager";
    case "consultant":
      return "Consultant";
    case "viewer":
      return "Viewer";
    default:
      return role;
  }
};

export default function PayrollPage() {
  console.log("🚀 PayrollPage component starting...");

  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { hasPermission, userRole } = useAuthContext();

  console.log("📋 Payroll ID:", id);

  // Permission checks
  const canEditPayroll = hasPermission("payroll:write");
  const canDeletePayroll = hasPermission("payroll:delete");
  const canAssignPayroll = hasPermission("payroll:assign");
  const canViewPayroll = hasPermission("payroll:read");

  // Check if user has permission to view payrolls
  if (!canViewPayroll) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 space-y-6">
        <Shield className="w-16 h-16 text-red-500" />
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p className="text-gray-600">
            You don't have permission to view payroll details
          </p>
          <p className="text-sm text-gray-500 mt-2">Current role: {userRole}</p>
          <div className="mt-6">
            <Button onClick={() => router.push("/dashboard")} variant="outline">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const [loadingToastShown, setLoadingToastShown] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showScheduleChangeDialog, setShowScheduleChangeDialog] =
    useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [editedPayroll, setEditedPayroll] = useState<any>({});
  const [scheduleChangeData, setScheduleChangeData] = useState<any>(null);
  const [regenerationStartDate, setRegenerationStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [regenerationNote, setRegenerationNote] = useState("");
  const [versioningGoLiveDate, setVersioningGoLiveDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [versioningNote, setVersioningNote] = useState("");

  console.log("🔧 State initialized");

  // Versioning hook
  const {
    savePayrollEdit,
    currentUserId,
    loading: versioningLoading,
  } = usePayrollVersioning();
  console.log("✅ usePayrollVersioning hook loaded");

  // Status update hook
  const { updatePayrollStatus } = usePayrollStatusUpdate();
  console.log("✅ usePayrollStatusUpdate hook loaded");

  // STEP 1: Always check for the latest version first (regardless of current payroll state)
  // This will find the latest version of this payroll family
  const { data: latestVersionData, loading: latestVersionLoading } =
    useFreshQuery(GetLatestPayrollVersionDocument, {
      variables: { payrollId: id }, // Use the current ID to find the latest in this family
      skip: !id,
      fetchPolicy: "network-only",
    });
  console.log("✅ Latest version query loaded first");

  // STEP 2: Determine if we need to redirect to the latest version
  const latestVersionId = latestVersionData?.payrolls?.[0]?.id;
  const needsRedirect = latestVersionId && latestVersionId !== id;

  // STEP 3: Perform redirect immediately if needed
  useEffect(() => {
    if (needsRedirect && latestVersionId) {
      console.log(
        "🔄 Redirecting from",
        id,
        "to latest version:",
        latestVersionId
      );
      router.push(`/payrolls/${latestVersionId}`);
    }
  }, [needsRedirect, latestVersionId, id, router]);

  // STEP 4: Only load current payroll data if we're not redirecting
  const shouldLoadCurrentPayroll = !latestVersionLoading && !needsRedirect;

  // Get current payroll data for version info (lighter query)
  const { data: versionCheckData, loading: versionCheckLoading } = useQuery(
    GetPayrollByIdDocument,
    {
      variables: { id },
      skip: !id || !shouldLoadCurrentPayroll,
      fetchPolicy: "network-only",
    }
  );
  console.log("✅ Version check query loaded");

  const currentPayroll = versionCheckData?.payrollById as any;

  // Show loading if we're checking versions or about to redirect
  const isVersionCheckingOrRedirecting = latestVersionLoading || needsRedirect;

  // Add debugging for versioning logic
  useEffect(() => {
    console.log("🔍 VERSIONING DEBUG:", {
      id,
      latestVersionLoading,
      versionCheckLoading,
      needsRedirect,
      shouldLoadCurrentPayroll,
      hasVersionCheckData: !!versionCheckData,
      isVersionCheckingOrRedirecting,
      latestVersionId,
      currentPayroll: currentPayroll
        ? {
            id: currentPayroll.id,
            supersededDate: currentPayroll.supersededDate,
            parentPayrollId: currentPayroll.parentPayrollId,
            versionNumber: currentPayroll.versionNumber,
          }
        : null,
      latestVersionData: latestVersionData
        ? {
            hasPayrolls: !!latestVersionData.payrolls,
            payrollsLength: latestVersionData.payrolls?.length,
            firstPayrollId: latestVersionData.payrolls?.[0]?.id,
          }
        : null,
    });
  }, [
    id,
    latestVersionLoading,
    versionCheckLoading,
    needsRedirect,
    shouldLoadCurrentPayroll,
    versionCheckData,
    isVersionCheckingOrRedirecting,
    latestVersionId,
    currentPayroll,
    latestVersionData,
  ]);

  // Get payroll data - use GetPayrollForEdit to get all needed fields including cycleId, dateTypeId, etc.
  // Skip this query if we're still checking versions or about to redirect
  const { data, loading, error, refetch } = useQuery(
    GetPayrollForEditDocument,
    {
      variables: { id },
      skip: !id || isVersionCheckingOrRedirecting,
      notifyOnNetworkStatusChange: true,
    }
  );
  console.log("✅ Main payroll query loaded");

  // Add extensive debugging for this issue
  useEffect(() => {
    if (error) {
      console.error("🔥 PAYROLL FETCH ERROR:", {
        error,
        errorName: error.name,
        errorMessage: error.message,
        graphQLErrors: error.graphQLErrors,
        networkError: error.networkError,
        extraInfo: error.extraInfo,
        clientErrors: error.clientErrors,
        stack: error.stack,
      });

      // Also log the payroll ID and user permissions
      console.log("🆔 Payroll ID being queried:", id);

      // Debug authorization context
      if (typeof window !== "undefined" && (window as any).Clerk?.session) {
        (window as any).Clerk.session
          .getToken({
            template: "hasura",
          })
          .then((token: string | null) => {
            if (token) {
              console.log("✓ Hasura token is available");
              // Don't log the actual token for security reasons
            } else {
              console.warn("⚠️ No Hasura token available");
            }
          })
          .catch((tokenError: Error) => {
            console.error("🔥 Token retrieval error:", tokenError);
          });
      }
    }

    if (data) {
      console.log("📊 Payload received:", {
        hasPayroll: !!data.payrollById,
        responseKeys: data ? Object.keys(data) : [],
      });
    }
  }, [error, data, id]);

  // Query for users (for consultant/manager assignments)
  const { data: usersData } = useQuery(GetAllUsersListDocument, {
    skip: isVersionCheckingOrRedirecting,
  });
  console.log("✅ Users query loaded");

  // Query for lookup tables
  const { data: cyclesData } = useQuery(GetPayrollCyclesDocument, {
    skip: isVersionCheckingOrRedirecting,
  });
  console.log("✅ Cycles query loaded");

  const { data: dateTypesData } = useQuery(GetPayrollDateTypesDocument, {
    skip: isVersionCheckingOrRedirecting,
  });
  console.log("✅ Date types query loaded");

  // Lazy query for regenerating payroll dates
  const [generatePayrollDates] = useLazyQuery(GeneratePayrollDatesDocument, {
    onCompleted: (data: any) => {
      const count = data?.generatePayrollDates?.length || 0;
      toast.success(`Successfully regenerated ${count} payroll dates`);
      refetch(); // Refresh the payroll data to show updated dates
    },
    onError: (error: any) => {
      toast.error(`Failed to regenerate dates: ${error.message}`);
    },
  });
  console.log("✅ Generate dates query loaded");

  const [updatePayroll] = useMutation(UpdatePayrollDocument, {
    refetchQueries: [
      { query: GetPayrollByIdDocument, variables: { id } },
      { query: GetPayrollDatesDocument, variables: { id } },
      { query: GetPayrollDatesDocument, variables: { payrollId: id } },
      GetPayrollsDocument,
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      toast.success("Payroll updated successfully");
      setIsEditing(false);
      refetch();
      // Force a page refresh to ensure all data is completely fresh
      setTimeout(() => {
        window.location.reload();
      }, 1000); // Small delay to let the toast show
    },
    onError: error => {
      toast.error(`Failed to update payroll: ${error.message}`);
    },
  });
  console.log("✅ Update payroll mutation loaded");

  console.log("🎯 All hooks loaded successfully");

  useEffect(() => {
    if (loading && !loadingToastShown) {
      const timer = setTimeout(() => {
        if (loading) {
          toast.info("Loading payroll data...");
          setLoadingToastShown(true);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [loading, loadingToastShown]);

  // Initialize edit state when payroll data loads
  useEffect(() => {
    if (data?.payrollById && !editedPayroll.id) {
      const payroll = data.payrollById;
      setEditedPayroll({
        ...payroll,
        // Ensure field names match the form - use the actual field names from schema
        cycleId: (payroll as any).cycleId || "",
        dateTypeId: (payroll as any).dateTypeId || "",
        dateValue: (payroll as any).dateValue?.toString() || "",
        fortnightlyWeek: "", // Add fortnightly week field
        primaryConsultantUserId: (payroll as any).primaryConsultantUserId || "",
        backupConsultantUserId: (payroll as any).backupConsultantUserId || "",
        managerUserId: (payroll as any).managerUserId || "",
        processingDaysBeforeEft:
          payroll.processingDaysBeforeEft?.toString() || "",
        goLiveDate: (payroll as any).goLiveDate || "",
      });
    }
  }, [data, editedPayroll.id]);

  // Form control functions (enhanced with same logic as creation form)
  const handleInputChange = (field: string, value: string) => {
    setEditedPayroll((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCycleChange = (value: string) => {
    setEditedPayroll((prev: any) => ({
      ...prev,
      cycleId: value,
      dateTypeId:
        value === PayrollCycleType.Weekly ||
        value === PayrollCycleType.Fortnightly
          ? "DOW"
          : "",
      dateValue: "",
      fortnightlyWeek: "", // Reset fortnightly week when cycle changes
    }));
  };

  const handleDateTypeChange = (value: string) => {
    handleInputChange("dateTypeId", value);
    handleInputChange("dateValue", "");
  };

  // Get available date types based on selected cycle (same as creation page)
  const availableDateTypes = editedPayroll.cycleId
    ? PAYROLL_DATE_TYPES[
        editedPayroll.cycleId as keyof typeof PAYROLL_DATE_TYPES
      ] || []
    : [];

  // Get users filtered by role and staff status
  const users = usersData?.users || [];
  const staffUsers = users.filter((user: any) => user.isStaff === true);
  const availablePrimaryConsultants = staffUsers;
  const availableBackupConsultants = staffUsers.filter(
    (user: any) => user.id !== editedPayroll.primaryConsultantUserId
  );
  const availableManagers = staffUsers.filter((user: any) =>
    ["manager", "developer", "orgAdmin"].includes(user.role)
  );

  // Enhanced renderDateValueInput with same logic as creation page
  const renderDateValueInput = () => {
    const { cycleId } = editedPayroll;

    if (!cycleId) {
      return (
        <Input
          id="date-value"
          placeholder="Select cycle first"
          disabled={true}
          className="mt-1"
        />
      );
    }

    // Weekly: Only day of week selection
    if (cycleId === PayrollCycleType.Weekly) {
      return (
        <div className="space-y-2">
          <Label htmlFor="weekday">Day of Week</Label>
          <Select
            value={editedPayroll.dateValue}
            onValueChange={value => handleInputChange("dateValue", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select day of week..." />
            </SelectTrigger>
            <SelectContent>
              {WEEKDAYS.map(weekday => (
                <SelectItem key={weekday.value} value={weekday.value}>
                  {weekday.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    // Fortnightly: Enhanced calendar selection for week type and day of week
    if (cycleId === PayrollCycleType.Fortnightly) {
      return (
        <div className="space-y-2">
          <Label htmlFor="fortnightly-calendar">Select Week & Day</Label>
          <EnhancedCalendar
            mode="fortnightly"
            selectedWeek={editedPayroll.fortnightlyWeek}
            selectedDay={editedPayroll.dateValue}
            onWeekSelect={week => handleInputChange("fortnightlyWeek", week)}
            onDaySelect={day => handleInputChange("dateValue", day)}
          />
        </div>
      );
    }

    // Bi-Monthly: Only SOM/EOM selection (no date value needed)
    if (cycleId === PayrollCycleType.BiMonthly) {
      return (
        <div className="mt-1">
          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
            {editedPayroll.dateTypeId === PayrollDateType.SOM &&
              "1st and 15th of each month (14th in February)"}
            {editedPayroll.dateTypeId === PayrollDateType.EOM &&
              "30th and 15th of each month (14th & 28th in February)"}
            {!editedPayroll.dateTypeId && "Select date type above"}
          </p>
        </div>
      );
    }

    // Monthly/Quarterly: Handle SOM, EOM, or Fixed Date
    if (
      cycleId === PayrollCycleType.Monthly ||
      cycleId === PayrollCycleType.Quarterly
    ) {
      const { dateTypeId } = editedPayroll;

      if (dateTypeId === PayrollDateType.SOM) {
        return (
          <div className="mt-1">
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              Start of month (1st) with next business day adjustment
            </p>
          </div>
        );
      }

      if (dateTypeId === PayrollDateType.EOM) {
        return (
          <div className="mt-1">
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              End of month (last day) with previous business day adjustment
            </p>
          </div>
        );
      }

      if (dateTypeId === PayrollDateType.FixedDate) {
        return (
          <div className="space-y-2">
            <Label htmlFor="fixed-date-calendar">Select Day of Month</Label>
            <EnhancedCalendar
              mode="fixed"
              selectedDay={editedPayroll.dateValue}
              onDaySelect={day => handleInputChange("dateValue", day)}
            />
          </div>
        );
      }

      return (
        <div className="mt-1">
          <p className="text-sm text-gray-500">Select date type above</p>
        </div>
      );
    }

    // Default fallback
    return (
      <Input
        id="date-value"
        placeholder="Select cycle and configure options above"
        disabled={true}
        className="mt-1"
      />
    );
  };

  // Early returns - after all hooks are called
  if (!id) {
    toast.error("Error: Payroll ID is required.");
    return <div>Error: Payroll ID is required.</div>;
  }

  // Show loading state while checking versions or redirecting
  if (isVersionCheckingOrRedirecting) {
    return <PayrollDetailsLoading />;
  }

  // If we're not redirecting, we should have version check data
  if (versionCheckLoading) {
    return <PayrollDetailsLoading />;
  }

  if (!versionCheckData || !versionCheckData.payrollById) {
    // Show detailed error information instead of calling notFound()
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 space-y-6">
        <AlertTriangle className="w-16 h-16 text-red-500" />
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Payroll Data Issue</h2>
          <p className="text-gray-600">
            The payroll with ID "{id}" could not be loaded
          </p>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md text-left max-w-lg mx-auto mt-4">
            <p>No error was reported, but payrollById returned null.</p>
            <p className="text-sm mt-2">
              This usually happens when the record exists but you don't have
              permission to view it, or the record doesn't exist.
            </p>
          </div>

          <div className="mt-6">
            <Button onClick={() => router.push("/payrolls")} variant="outline">
              Back to Payrolls List
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const payroll = data?.payrollById || versionCheckData.payrollById;
  const client = payroll.client;

  // Debug: Log payroll data to see what we're getting
  console.log("Payroll details data:", {
    payroll,
    payrollKeys: payroll ? Object.keys(payroll) : [],
    client,
    clientKeys: client ? Object.keys(client) : [],
  });

  const statusConfig = getStatusConfig(payroll.status || "Implementation");
  const StatusIcon = statusConfig.icon;

  // Calculate totals from payroll dates if available
  const payrollDates = (payroll as any).payrollDates || [];
  const totalEmployees = payroll.employeeCount || 0;

  const handleSave = async () => {
    try {
      console.log("🔍 DEBUG: Save started");
      console.log("📋 editedPayroll:", editedPayroll);

      // Get the original cycle and date type IDs
      const originalCycleId = (payroll as any).cycleId;
      const originalDateTypeId = (payroll as any).dateTypeId;
      const originalDateValue = (payroll as any).dateValue;

      // Only convert to UUIDs if the values have actually changed
      let cycleId = originalCycleId;
      let dateTypeId = originalDateTypeId;

      // Check if cycle changed by comparing IDs
      if (editedPayroll.cycleId !== originalCycleId) {
        const newCycleId = getCycleIdFromName(editedPayroll.cycleId);
        if (!newCycleId) {
          toast.error("Invalid payroll cycle selected");
          return;
        }
        cycleId = newCycleId;
      }

      // Check if date type changed by comparing IDs
      if (editedPayroll.dateTypeId !== originalDateTypeId) {
        const newDateTypeId = getDateTypeIdFromName(editedPayroll.dateTypeId);
        if (!newDateTypeId) {
          toast.error("Invalid date type selected");
          return;
        }
        dateTypeId = newDateTypeId;
      }

      // Validate required fields
      if (!editedPayroll.name?.trim()) {
        toast.error("Payroll name is required");
        return;
      }

      // Check if any schedule-related fields changed
      const cycleChanged = cycleId !== originalCycleId;
      const dateTypeChanged = dateTypeId !== originalDateTypeId;
      const dateValueChanged = editedPayroll.dateValue
        ? parseInt(editedPayroll.dateValue) !== originalDateValue
        : originalDateValue !== null && originalDateValue !== undefined;

      const scheduleChanged =
        cycleChanged || dateTypeChanged || dateValueChanged;

      // Prepare mutation variables with correct parameter names from the mutation
      const mutationVariables = {
        id: payroll.id,
        name: editedPayroll.name.trim(),
        cycleId,
        dateTypeId,
        dateValue: editedPayroll.dateValue
          ? parseInt(editedPayroll.dateValue)
          : null,
        primaryConsultantId: editedPayroll.primaryConsultantUserId || null,
        backupConsultantId: editedPayroll.backupConsultantUserId || null,
        managerId: editedPayroll.managerUserId || null,
        processingDaysBeforeEft: editedPayroll.processingDaysBeforeEft
          ? parseInt(editedPayroll.processingDaysBeforeEft)
          : null,
        status: (payroll as any).status || "Implementation", // Include current status to prevent null error
      };

      console.log("Mutation variables:", mutationVariables);

      if (scheduleChanged) {
        // Store the mutation variables and show the schedule change modal
        setScheduleChangeData(mutationVariables);
        setRegenerationNote("");
        setShowScheduleChangeDialog(true);
      } else {
        // No schedule change, just update the payroll
        const { id, ...setFields } = mutationVariables;
        await updatePayroll({
          variables: {
            id,
            set: setFields,
          },
        });
      }
    } catch (error) {
      console.error("Error updating payroll:", error);
    }
  };

  const handleScheduleChangeConfirm = async () => {
    if (!scheduleChangeData || !versioningGoLiveDate) {
      toast.error("Please select a go-live date for the new version");
      return;
    }

    console.log("🔄 Starting payroll edit with versioning...");
    console.log("📋 Original payroll:", payroll);
    console.log("📋 Changes:", scheduleChangeData);
    console.log("📅 Go-live date:", versioningGoLiveDate);

    try {
      // Prepare edited fields that actually changed
      const editedFields: any = {};

      // Check each field and only include if changed
      if (scheduleChangeData.cycleId !== (payroll as any).cycleId) {
        editedFields.cycleId = scheduleChangeData.cycleId;
      }
      if (scheduleChangeData.dateTypeId !== (payroll as any).dateTypeId) {
        editedFields.dateTypeId = scheduleChangeData.dateTypeId;
      }
      if (scheduleChangeData.dateValue !== (payroll as any).dateValue) {
        editedFields.dateValue = scheduleChangeData.dateValue;
      }
      if (scheduleChangeData.name !== (payroll as any).name) {
        editedFields.name = scheduleChangeData.name;
      }
      if (
        scheduleChangeData.primaryConsultantId !==
        (payroll as any).primaryConsultantUserId
      ) {
        editedFields.primaryConsultantUserId =
          scheduleChangeData.primaryConsultantId;
      }
      if (
        scheduleChangeData.backupConsultantId !==
        (payroll as any).backupConsultantUserId
      ) {
        editedFields.backupConsultantUserId =
          scheduleChangeData.backupConsultantId;
      }
      if (scheduleChangeData.managerId !== (payroll as any).managerUserId) {
        editedFields.managerUserId = scheduleChangeData.managerId;
      }
      if (
        scheduleChangeData.processingDaysBeforeEft !==
        (payroll as any).processingDaysBeforeEft
      ) {
        editedFields.processingDaysBeforeEft =
          scheduleChangeData.processingDaysBeforeEft;
      }

      const versionReason = getVersionReason(editedFields);

      // Use the new savePayrollEdit function
      const result = await savePayrollEdit({
        currentPayroll: payroll,
        editedFields,
        goLiveDate: versioningGoLiveDate,
        versionReason,
        createdByUserId: currentUserId || "", // Use currentUserId from hook
      });

      if (result.success) {
        console.log(`✅ Version ${result.versionNumber} created successfully`);

        // Close the dialog and refresh
        setShowScheduleChangeDialog(false);
        setScheduleChangeData(null);
        setVersioningGoLiveDate(new Date().toISOString().split("T")[0]);
        setVersioningNote("");
        setIsEditing(false);

        toast.success(
          `Payroll version ${result.versionNumber} will go live on ${versioningGoLiveDate}`
        );

        // Force a page refresh to ensure all data is completely fresh
        setTimeout(() => {
          window.location.reload();
        }, 2000); // Longer delay to let the success message show
      } else {
        throw new Error(result.error || "Failed to create payroll version");
      }
    } catch (error: any) {
      console.error("❌ Error creating payroll version:", error);
      toast.error(`Failed to create payroll version: ${error.message}`);
    }
  };

  const handleStatusChange = async () => {
    if (!newStatus || !payroll?.id) {
      return;
    }

    try {
      console.log(
        `🔄 Changing payroll ${payroll.id} status to ${newStatus}...`
      );

      const result = await updatePayrollStatus(payroll.id, newStatus);

      if (result.success) {
        // Show status change note in toast if provided
        if (statusNote.trim()) {
          toast.info(`Status changed to ${newStatus}: ${statusNote.trim()}`);
        } else {
          toast.success(`Status changed to ${newStatus}`);
        }

        setShowStatusDialog(false);
        setNewStatus("");
        setStatusNote("");

        // Refresh the page data instead of full page reload
        refetch();
      } else {
        throw new Error(result.error || "Failed to update status");
      }
    } catch (error: any) {
      console.error("❌ Error updating status:", error);
      toast.error(`Failed to update status: ${error.message}`);
    }
  };

  const possibleStatuses = ["Implementation", "Active", "Inactive"];

  // Helper functions to convert between display names and UUIDs
  const getCycleIdFromName = (cycleName: string) => {
    const cycles = cyclesData?.payrollCycles || [];
    const cycle = cycles.find((c: any) => c.name === cycleName);
    console.log("getCycleIdFromName:", {
      cycleName,
      cycles,
      result: cycle?.id,
    });

    // If no database lookup available, we need to handle the hardcoded values differently
    // The issue is we're using hardcoded enum values but need UUIDs from the database
    if (!cycle?.id && cycleName) {
      console.warn(
        "No UUID found for cycle name:",
        cycleName,
        "Available cycles:",
        cycles
      );
      // For now, we'll just return the cycleName as it might be a UUID already
      return cycleName;
    }

    return cycle?.id || null;
  };

  const getDateTypeIdFromName = (dateTypeName: string) => {
    const dateTypes = dateTypesData?.payrollDateTypes || [];
    const dateType = dateTypes.find((dt: any) => dt.name === dateTypeName);

    if (!dateType?.id && dateTypeName) {
      console.warn(
        "No UUID found for date type name:",
        dateTypeName,
        "Available date types:",
        dateTypes
      );
      // For now, we'll just return the dateTypeName as it might be a UUID already
      return dateTypeName;
    }

    return dateType?.id || null;
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Version Warning Banner */}
        {(currentPayroll as any)?.supersededDate && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="text-amber-800 font-medium">
                    You are viewing an older version of this payroll (v
                    {(currentPayroll as any).versionNumber})
                  </p>
                  <p className="text-amber-700 text-sm">
                    This version was superseded on{" "}
                    {formatDate((currentPayroll as any).supersededDate)}
                  </p>
                </div>
              </div>
              {latestVersionData?.payrolls?.[0]?.id && (
                <Button
                  onClick={() =>
                    router.push(`/payrolls/${latestVersionData.payrolls[0].id}`)
                  }
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  View Latest Version (v
                  {latestVersionData.payrolls[0].versionNumber})
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Enhanced Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/payrolls">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Payrolls
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{(payroll as any).name}</h1>
                <Badge
                  className={`${statusConfig.color} cursor-pointer hover:opacity-80 transition-opacity`}
                  onClick={() => setShowStatusDialog(true)}
                  title="Click to change status"
                >
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {(payroll as any).status || "Implementation"}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  {(client as any).name}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {totalEmployees} employees
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Last updated {formatDate((payroll as any).updatedAt)}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <MoreHorizontal className="w-4 h-4 mr-2" />
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {/* Edit Actions */}
                {isEditing ? (
                  <>
                    <DropdownMenuItem onClick={handleSave}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsEditing(false)}>
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Cancel Changes
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                ) : (
                  <>
                    {canEditPayroll && (
                      <DropdownMenuItem onClick={() => setIsEditing(true)}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit Payroll
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                  </>
                )}

                {/* View & Navigation */}
                <DropdownMenuItem onClick={() => refetch()}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Data
                </DropdownMenuItem>

                {/* Status Management */}
                <DropdownMenuItem onClick={() => setShowStatusDialog(true)}>
                  <Shield className="w-4 h-4 mr-2" />
                  Change Status
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Export Options */}
                <DropdownMenuItem
                  onClick={() => {
                    // Trigger CSV export
                    const csvButton = document.querySelector(
                      '[data-export="csv"]'
                    ) as HTMLButtonElement;
                    csvButton?.click();
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    // Trigger PDF export
                    const pdfButton = document.querySelector(
                      '[data-export="pdf"]'
                    ) as HTMLButtonElement;
                    pdfButton?.click();
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <FileText className="w-4 h-4 mr-2" />
                  Export Summary
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Data Management */}
                <DropdownMenuItem>
                  <Upload className="w-4 h-4 mr-2" />
                  Import Data
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate Payroll
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Danger Zone */}
                {canDeletePayroll && (
                  <DropdownMenuItem className="text-red-600">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Archive Payroll
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Progress Bar */}
        {statusConfig.progress > 0 && statusConfig.progress < 100 && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Payroll Progress</span>
                  <span>{statusConfig.progress}%</span>
                </div>
                <Progress value={statusConfig.progress} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>
                    Manager: {(payroll as any).manager?.name || "Not assigned"}
                  </span>
                  <span>
                    Status: {(payroll as any).status || "Implementation"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-3 bg-indigo-50 shadow-sm rounded-lg">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 hover:bg-indigo-300 transition-all text-gray-900"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="dates"
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 hover:bg-indigo-300 transition-all text-gray-900"
            >
              Payroll Dates
            </TabsTrigger>
            <TabsTrigger
              value="notes"
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 hover:bg-indigo-300 transition-all text-gray-900"
            >
              Notes
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Key Metrics */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="w-5 h-5" />
                      Payroll Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-700">
                          {payroll.employeeCount || totalEmployees || 0}
                        </div>
                        <div className="text-sm text-blue-600">Employees</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-700">
                          {payrollDates.length}
                        </div>
                        <div className="text-sm text-green-600">
                          Pay Periods
                        </div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-lg font-bold text-purple-700">
                          {getCycleName(payroll)}
                        </div>
                        <div className="text-sm text-purple-600">Schedule</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-700">
                          {payroll.processingDaysBeforeEft || 3}
                        </div>
                        <div className="text-sm text-orange-600">
                          Processing Days
                        </div>
                      </div>
                    </div>

                    {/* Schedule card displayed underneath */}
                    <div className="mt-4">
                      <div className="text-center p-4 bg-teal-50 rounded-lg">
                        <div className="text-2xl font-bold text-teal-700 break-words leading-tight">
                          {getEnhancedScheduleSummary(payroll)}
                        </div>
                        <div className="text-sm text-teal-600">Schedule</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Comprehensive Details Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Payroll Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <div className="space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900">
                            Basic Information
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="name">Payroll Name *</Label>
                              <Input
                                id="name"
                                value={editedPayroll.name || ""}
                                onChange={e =>
                                  handleInputChange("name", e.target.value)
                                }
                                placeholder="Enter payroll name..."
                              />
                            </div>
                            <div>
                              <Label htmlFor="go_live_date">Go Live Date</Label>
                              <Input
                                id="go_live_date"
                                type="date"
                                value={editedPayroll.go_live_date || ""}
                                onChange={e =>
                                  handleInputChange(
                                    "go_live_date",
                                    e.target.value
                                  )
                                }
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                The date when this payroll went live in the
                                system
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <Label htmlFor="client">
                                Client (Cannot be changed)
                              </Label>
                              <Input
                                id="client"
                                value={(client as any)?.name || ""}
                                disabled
                                className="bg-gray-50 cursor-not-allowed"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Client association cannot be modified after
                                payroll creation
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Schedule Configuration */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900">
                            Schedule Configuration
                          </h4>
                          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                            <p className="text-sm text-yellow-700">
                              <strong>Warning:</strong> Changing the payroll
                              cycle, date type, or date value will regenerate
                              all future payroll dates. Existing processing
                              workflows may be affected.
                            </p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="cycle-id">Payroll Cycle *</Label>
                              <Select
                                value={editedPayroll.cycleId || ""}
                                onValueChange={value =>
                                  handleCycleChange(value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select cycle..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {PAYROLL_CYCLES.map(cycle => (
                                    <SelectItem key={cycle.id} value={cycle.id}>
                                      {cycle.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Only show date type for cycles that need it */}
                            {(editedPayroll.cycleId === "bi_monthly" ||
                              editedPayroll.cycleId === "monthly" ||
                              editedPayroll.cycleId === "quarterly") && (
                              <div>
                                <Label htmlFor="date-type-id">
                                  Date Type *
                                </Label>
                                <Select
                                  value={editedPayroll.dateTypeId || ""}
                                  onValueChange={value =>
                                    handleDateTypeChange(value)
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select date type..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {availableDateTypes.map(dateType => (
                                      <SelectItem
                                        key={dateType.id}
                                        value={dateType.id}
                                      >
                                        {dateType.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}

                            {/* Show processing days in the second column if no date type needed */}
                            {(editedPayroll.cycleId === "weekly" ||
                              editedPayroll.cycleId === "fortnightly") && (
                              <div>
                                <Label htmlFor="processing-days">
                                  Processing Days Before EFT *
                                </Label>
                                <Input
                                  id="processing-days"
                                  type="number"
                                  placeholder="e.g., 3"
                                  value={
                                    editedPayroll.processingDaysBeforeEft || ""
                                  }
                                  onChange={e =>
                                    handleInputChange(
                                      "processingDaysBeforeEft",
                                      e.target.value
                                    )
                                  }
                                  min="1"
                                />
                              </div>
                            )}
                          </div>

                          {/* Date configuration section */}
                          <div>
                            <Label htmlFor="date-value">
                              Date Configuration
                            </Label>
                            {renderDateValueInput()}
                          </div>

                          {/* Processing days for cycles that have date type dropdown */}
                          {(editedPayroll.cycleId === "bi_monthly" ||
                            editedPayroll.cycleId === "monthly" ||
                            editedPayroll.cycleId === "quarterly") && (
                            <div>
                              <Label htmlFor="processing-days">
                                Processing Days Before EFT *
                              </Label>
                              <Input
                                id="processing-days"
                                type="number"
                                placeholder="e.g., 3"
                                value={
                                  editedPayroll.processingDaysBeforeEft || ""
                                }
                                onChange={e =>
                                  handleInputChange(
                                    "processingDaysBeforeEft",
                                    e.target.value
                                  )
                                }
                                min="1"
                              />
                            </div>
                          )}

                          {/* Add quarterly note */}
                          {editedPayroll.cycleId === "quarterly" && (
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                              <p className="text-sm text-blue-700">
                                <strong>Quarterly Processing:</strong> Payrolls
                                will be processed in March, June, September, and
                                December.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Staff Assignments */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900">
                            Staff Assignments
                          </h4>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="primary-consultant">
                                Primary Consultant
                              </Label>
                              <Select
                                value={
                                  editedPayroll.primaryConsultantUserId ||
                                  "none"
                                }
                                onValueChange={value =>
                                  handleInputChange(
                                    "primaryConsultantUserId",
                                    value === "none" ? "" : value
                                  )
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select primary consultant..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">None</SelectItem>
                                  {availablePrimaryConsultants.map(
                                    (consultant: any) => (
                                      <SelectItem
                                        key={consultant.id}
                                        value={consultant.id}
                                      >
                                        {consultant.name} ({consultant.email}) -{" "}
                                        {getRoleDisplayName(consultant.role)}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                              <p className="text-xs text-gray-500 mt-1">
                                Only staff members can be assigned as primary
                                consultant
                              </p>
                            </div>

                            <div>
                              <Label htmlFor="backup-consultant">
                                Backup Consultant
                              </Label>
                              <Select
                                value={
                                  editedPayroll.backupConsultantUserId || "none"
                                }
                                onValueChange={value =>
                                  handleInputChange(
                                    "backupConsultantUserId",
                                    value === "none" ? "" : value
                                  )
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select backup consultant..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">None</SelectItem>
                                  {availableBackupConsultants.map(
                                    (consultant: any) => (
                                      <SelectItem
                                        key={consultant.id}
                                        value={consultant.id}
                                      >
                                        {consultant.name} ({consultant.email}) -{" "}
                                        {getRoleDisplayName(consultant.role)}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                              {editedPayroll.primaryConsultantUserId &&
                                availableBackupConsultants.length === 0 && (
                                  <p className="text-xs text-amber-600 mt-1">
                                    ⚠️ No other staff members available -
                                    primary consultant cannot be backup
                                  </p>
                                )}
                              {!editedPayroll.primaryConsultantUserId && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Select primary consultant first to see
                                  available backup options
                                </p>
                              )}
                              {editedPayroll.primaryConsultantUserId &&
                                availableBackupConsultants.length > 0 && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Cannot select the same person as primary
                                    consultant
                                  </p>
                                )}
                            </div>

                            <div>
                              <Label htmlFor="manager">Manager</Label>
                              <Select
                                value={editedPayroll.managerUserId || "none"}
                                onValueChange={value =>
                                  handleInputChange(
                                    "managerUserId",
                                    value === "none" ? "" : value
                                  )
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select manager..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">None</SelectItem>
                                  {availableManagers.map((manager: any) => (
                                    <SelectItem
                                      key={manager.id}
                                      value={manager.id}
                                    >
                                      {manager.name} ({manager.email}) -{" "}
                                      {getRoleDisplayName(manager.role)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <p className="text-xs text-gray-500 mt-1">
                                Only staff members with Manager, Admin, or Org
                                Admin roles can be assigned as managers
                                {availableManagers.length === 0 && (
                                  <span className="text-amber-600 block mt-1">
                                    ⚠️ No staff members with manager-level roles
                                    available
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* View Mode */
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900 border-b pb-2">
                            Basic Information
                          </h4>
                          <div className="space-y-3 text-sm">
                            <div>
                              <Label className="text-xs font-medium text-gray-600">
                                Payroll Name
                              </Label>
                              <p className="mt-1">{(payroll as any).name}</p>
                            </div>
                            <div>
                              <Label className="text-xs font-medium text-gray-600">
                                Client
                              </Label>
                              <p className="mt-1">
                                {(client as any)?.name || "No client"}
                              </p>
                            </div>
                            <div>
                              <Label className="text-xs font-medium text-gray-600">
                                Go Live Date
                              </Label>
                              <p className="mt-1">
                                {(payroll as any).goLiveDate
                                  ? formatDate((payroll as any).goLiveDate)
                                  : "Not set"}
                              </p>
                            </div>
                            <div>
                              <Label className="text-xs font-medium text-gray-600">
                                Status
                              </Label>
                              <div className="mt-1">
                                <Badge className={statusConfig.color}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {(payroll as any).status || "Implementation"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Schedule Information */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900 border-b pb-2">
                            Schedule Configuration
                          </h4>
                          <div className="space-y-3 text-sm">
                            <div>
                              <Label className="text-xs font-medium text-gray-600">
                                Payroll Cycle
                              </Label>
                              <p className="mt-1">{getCycleName(payroll)}</p>
                            </div>
                            <div>
                              <Label className="text-xs font-medium text-gray-600">
                                Date Type
                              </Label>
                              <p className="mt-1">{getDateTypeName(payroll)}</p>
                            </div>
                            <div>
                              <Label className="text-xs font-medium text-gray-600">
                                Schedule Summary
                              </Label>
                              <p className="mt-1">
                                {getScheduleSummary(payroll)}
                              </p>
                            </div>
                            <div>
                              <Label className="text-xs font-medium text-gray-600">
                                Processing Days Before EFT
                              </Label>
                              <p className="mt-1">
                                {(payroll as any).processingDaysBeforeEft ||
                                  "Not set"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Assignment Information */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900 border-b pb-2">
                            Staff Assignments
                          </h4>
                          <div className="space-y-3 text-sm">
                            <div>
                              <Label className="text-xs font-medium text-gray-600">
                                Primary Consultant
                              </Label>
                              <p className="mt-1">
                                {(payroll as any).primaryConsultant?.name ||
                                  "Not assigned"}
                              </p>
                            </div>
                            <div>
                              <Label className="text-xs font-medium text-gray-600">
                                Backup Consultant
                              </Label>
                              <p className="mt-1">
                                {(payroll as any).backupConsultant?.name ||
                                  "Not assigned"}
                              </p>
                            </div>
                            <div>
                              <Label className="text-xs font-medium text-gray-600">
                                Manager
                              </Label>
                              <p className="mt-1">
                                {(payroll as any).manager?.name ||
                                  "Not assigned"}
                              </p>
                            </div>
                            <div>
                              <Label className="text-xs font-medium text-gray-600">
                                Created
                              </Label>
                              <p className="mt-1">
                                {formatDateTime((payroll as any).createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Export Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="w-5 h-5" />
                      Export Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 flex-wrap">
                      {/* Hidden export buttons - triggered by dropdown menu */}
                      <div className="hidden">
                        <ExportCsv payrollId={id} />
                        <ExportPdf payrollId={id} />
                      </div>

                      {/* Visible export options not in dropdown */}
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        Export Summary
                      </Button>
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Import Data
                      </Button>
                    </div>

                    <p className="text-sm text-gray-500 mt-2">
                      Additional export options are available in the actions
                      menu above.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Payroll Dates Tab */}
          <TabsContent value="dates">
            <PayrollDatesView payrollId={id} showAllVersions={true} />
          </TabsContent>

          {/* Notes & History Tab */}
          <TabsContent value="notes">
            <div className="space-y-6">
              <NotesListWithAdd
                entityType="payroll"
                entityId={payroll.id}
                title="Payroll Notes"
              />

              {/* Version History */}
              <PayrollVersionHistory payrollId={payroll.id} />
            </div>
          </TabsContent>
        </Tabs>

        {/* Dialog Components (moved from action buttons) */}
        <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Payroll Status</DialogTitle>
              <DialogDescription>
                Update the current status of this payroll.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="status">New Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select new status..." />
                  </SelectTrigger>
                  <SelectContent>
                    {possibleStatuses.map(status => {
                      const config = getStatusConfig(status);
                      const Icon = config.icon;
                      return (
                        <SelectItem key={status} value={status}>
                          <div className="flex items-center">
                            <Icon className="w-4 h-4 mr-2" />
                            {status}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="note">Status Change Note (Optional)</Label>
                <Textarea
                  id="note"
                  placeholder="Add a note about this status change..."
                  value={statusNote}
                  onChange={e => setStatusNote(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowStatusDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleStatusChange} disabled={!newStatus}>
                Update Status
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Schedule Change Dialog */}
        <Dialog
          open={showScheduleChangeDialog}
          onOpenChange={setShowScheduleChangeDialog}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Payroll Version</DialogTitle>
              <DialogDescription>
                Schedule changes require creating a new payroll version. This
                will preserve the current payroll until the go-live date and
                create a new version with your changes.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="go-live-date">Go-Live Date</Label>
                <Input
                  id="go-live-date"
                  type="date"
                  value={versioningGoLiveDate}
                  onChange={e => setVersioningGoLiveDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  The new payroll version will become active on this date.
                  Future dates from the current payroll will be removed from
                  this date forward.
                </p>
              </div>

              <div>
                <Label htmlFor="version-note">Version Note (Optional)</Label>
                <Textarea
                  id="version-note"
                  value={versioningNote}
                  onChange={e => setVersioningNote(e.target.value)}
                  placeholder="Add a note about this version change..."
                  className="mt-1"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-700">
                  <strong>What will happen:</strong>
                </p>
                <ul className="text-sm text-blue-600 mt-1 space-y-1">
                  <li>• New payroll version will be created</li>
                  <li>• Current payroll remains active until go-live date</li>
                  <li>• Future dates from current payroll will be removed</li>
                  <li>• 2 years of dates will be generated for new version</li>
                </ul>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowScheduleChangeDialog(false);
                  setScheduleChangeData(null);
                  setVersioningGoLiveDate(
                    new Date().toISOString().split("T")[0]
                  );
                  setVersioningNote("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleScheduleChangeConfirm}
                disabled={versioningLoading || !versioningGoLiveDate}
              >
                {versioningLoading ? "Creating Version..." : "Create Version"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ErrorBoundary>
  );
}
