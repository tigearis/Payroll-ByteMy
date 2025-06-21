"use client";

import { useMutation, useQuery, gql } from "@apollo/client";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CreatePayrollDocument } from "@/domains/payrolls/graphql/generated/graphql";

// Temporary inline queries until GraphQL consolidation
const GET_CLIENTS = gql`
  query GetClients {
    clients {
      id
      name
    }
  }
`;

const GET_ALL_USERS_LIST = gql`
  query GetAllUsersList {
    users {
      id
      name
      email
      role
    }
  }
`;

// GraphQL mutation for generating payroll dates (it's a database function exposed as mutation)
const GENERATE_PAYROLL_DATES_MUTATION = gql`
  mutation GeneratePayrollDates(
    $payrollId: uuid!
    $startDate: date!
    $endDate: date!
  ) {
    generate_payroll_dates(
      p_payroll_id: $payrollId
      p_start_date: $startDate
      p_end_date: $endDate
    ) {
      id
      original_eft_date
      adjusted_eft_date
      processing_date
      notes
    }
  }
`;

// Hardcoded options for cycles and date types (these should ideally come from the database)
const PAYROLL_CYCLES = [
  { id: "weekly", name: "Weekly" },
  { id: "fortnightly", name: "Fortnightly" },
  { id: "bi_monthly", name: "Bi-Monthly" },
  { id: "monthly", name: "Monthly" },
  { id: "quarterly", name: "Quarterly" },
];

const PAYROLL_DATE_TYPES = {
  weekly: [], // No date type dropdown needed - auto DOW
  fortnightly: [], // No date type dropdown needed - auto DOW
  bi_monthly: [
    { id: "SOM", name: "Start of Month" },
    { id: "EOM", name: "End of Month" },
  ],
  monthly: [
    { id: "SOM", name: "Start of Month" },
    { id: "EOM", name: "End of Month" },
    { id: "fixed", name: "Fixed Date" },
  ],
  quarterly: [
    { id: "SOM", name: "Start of Month" },
    { id: "EOM", name: "End of Month" },
    { id: "fixed", name: "Fixed Date" },
  ],
};

const WEEKDAYS = [
  { value: "1", label: "Monday" },
  { value: "2", label: "Tuesday" },
  { value: "3", label: "Wednesday" },
  { value: "4", label: "Thursday" },
  { value: "5", label: "Friday" },
];

const MONTH_DAYS = Array.from({ length: 31 }, (_, i) => ({
  value: (i + 1).toString(),
  label: `${i + 1}${getOrdinalSuffix(i + 1)}`,
}));

function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) {return "st";}
  if (j === 2 && k !== 12) {return "nd";}
  if (j === 3 && k !== 13) {return "rd";}
  return "th";
}

// Helper function to convert JavaScript day (0=Sunday, 1=Monday, etc.) to business weekday (1=Monday, 2=Tuesday, etc.)
function getBusinessWeekday(jsDay: number): number {
  // JavaScript: 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday
  // Business: 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday
  if (jsDay === 0) {return 0;} // Sunday - not a business day
  if (jsDay === 6) {return 0;} // Saturday - not a business day
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
  const daysToAdd = dayOfWeek === 0 ? 0 : 7 - dayOfWeek; // If Sunday, add 0; otherwise add days to get to Sunday
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
  const daysFromSunday = currentDay; // Sunday is 0, so days from Sunday is just the day value
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

  // Return week options with actual dates
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

  // Find the first Sunday of the year
  const firstSunday = new Date(firstDayOfYear);
  const dayOfWeek = firstDayOfYear.getDay();
  const daysToAdd = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  firstSunday.setDate(firstDayOfYear.getDate() + daysToAdd);

  // Calculate week number since first Sunday
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

  // Get first day of the month and calculate calendar grid
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Calculate calendar grid start (Sunday = 0)
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

    // Stop if we've covered all days of the month and some of next
    if (days.some((d) => d.date.getMonth() > currentMonth)) {
      break;
    }
  }

  const monthName = now.toLocaleDateString("en-AU", {
    month: "long",
    year: "numeric",
  });

  const handleDayClick = (dayInfo: any) => {
    if (mode === "fortnightly") {
      // For fortnightly, enforce weekdays only (Monday-Friday = 1-5)
      const isWeekday =
        dayInfo.businessWeekday >= 1 && dayInfo.businessWeekday <= 5;
      if (!isWeekday) {
        return; // Don't allow weekend selection
      }

      // Select both week and day
      onWeekSelect?.(dayInfo.weekType);
      onDaySelect(dayInfo.businessWeekday.toString());
    } else {
      // For fixed date, just select the day of month
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

      {/* Legend for fortnightly mode */}
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

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {/* Header */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
          <div key={dayName} className="p-2 font-medium text-gray-500">
            {dayName}
          </div>
        ))}

        {/* Calendar days */}
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
                dayInfo.businessWeekday >= 1 && dayInfo.businessWeekday <= 5; // Monday-Friday

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
              // Fixed date mode
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
                title={
                  mode === "fortnightly" && !isDisabled
                    ? `Week ${dayInfo.weekType} - ${
                        [
                          "Sunday",
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                        ][dayInfo.businessWeekday - 1]
                      }`
                    : mode === "fortnightly" && isDisabled
                    ? "Weekends not allowed for payroll"
                    : undefined
                }
              >
                {dayInfo.day}
              </button>
            );
          })
        )}
      </div>

      {/* Selection info */}
      <div className="mt-3 p-2 bg-white rounded border text-center text-sm">
        {mode === "fortnightly" ? (
          <>
            {selectedWeek && selectedDay ? (
              <div className="space-y-1">
                <div>
                  <span className="font-medium">Week {selectedWeek}</span>
                  {calculateFortnightlyWeeks()
                    .find((w) => w.value === selectedWeek)
                    ?.label.includes("Current") && (
                    <span className="ml-2 text-green-600">(This week)</span>
                  )}
                </div>
                <div>
                  <span className="text-gray-600">
                    {
                      [
                        "Sunday",
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                      ][parseInt(selectedDay) - 1]
                    }
                    s
                  </span>
                  <span className="ml-2 text-green-600 text-xs">✓ Weekday</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <span className="text-gray-500">
                  Click a weekday to select week type and day
                </span>
                <div className="text-xs text-amber-600">
                  Note: Weekends are disabled for payroll processing
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {selectedDay ? (
              <span className="font-medium">
                Selected: {selectedDay}
                {getOrdinalSuffix(parseInt(selectedDay))} of month
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

export default function NewPayrollPage() {
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    clientId: "",
    cycleId: "",
    dateTypeId: "",
    dateValue: "",
    fortnightlyWeek: "", // For fortnightly cycle week A/B selection
    primaryConsultantId: "",
    backupConsultantId: "",
    managerId: "",
    processingDaysBeforeEft: "3",
  });

  const [isLoading, setIsLoading] = useState(false);

  // GraphQL operations
  const { data: clientsData } = useQuery(GET_CLIENTS);
  const { data: usersData } = useQuery(GET_ALL_USERS_LIST);

  const [createPayroll] = useMutation(CreatePayrollDocument);

  // Mutation for generating payroll dates after creation
  const [generatePayrollDates] = useMutation(GENERATE_PAYROLL_DATES_MUTATION, {
    onCompleted: (data) => {
      const count = data?.generate_payroll_dates?.length || 0;
      toast.success(`Successfully generated ${count} payroll dates`);
      setIsLoading(false);
    },
    onError: (error) => {
      toast.error(`Failed to generate dates: ${error.message}`);
      setIsLoading(false);
    },
  });

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Get users filtered by role
  const users = usersData?.users || [];

  // All staff can be consultants (no role restriction)
  const allStaff = users;

  // Primary consultant can be anyone
  const availablePrimaryConsultants = allStaff;

  // Backup consultant can be anyone EXCEPT the primary consultant
  const availableBackupConsultants = allStaff.filter(
    (user: any) => user.id !== formData.primaryConsultantId
  );

  // Managers must have manager role or above
  const availableManagers = users.filter((user: any) =>
    ["manager", "developer", "org_admin"].includes(user.role)
  );

  // Get available date types based on selected cycle
  const availableDateTypes = formData.cycleId
    ? PAYROLL_DATE_TYPES[formData.cycleId as keyof typeof PAYROLL_DATE_TYPES] ||
      []
    : [];

  // Reset date type and value when cycle changes
  const handleCycleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      cycleId: value,
      dateTypeId: value === "weekly" || value === "fortnightly" ? "DOW" : "",
      dateValue: "",
      fortnightlyWeek: "",
    }));
  };

  // Reset date value when date type changes
  const handleDateTypeChange = (value: string) => {
    handleInputChange("dateTypeId", value);
    handleInputChange("dateValue", "");
  };

  // Render appropriate date value input based on cycle and date type
  const renderDateValueInput = () => {
    const { cycleId } = formData;

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
    if (cycleId === "weekly") {
      return (
        <div className="space-y-2">
          <Label htmlFor="weekday">Day of Week</Label>
          <Select
            value={formData.dateValue}
            onValueChange={(value) => handleInputChange("dateValue", value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select day of week..." />
            </SelectTrigger>
            <SelectContent>
              {WEEKDAYS.map((weekday) => (
                <SelectItem key={weekday.value} value={weekday.value}>
                  {weekday.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    // Fortnightly: Calendar selection for week type and day of week
    if (cycleId === "fortnightly") {
      return (
        <div className="space-y-2">
          <Label htmlFor="fortnightly-calendar">Select Week & Day</Label>
          <EnhancedCalendar
            mode="fortnightly"
            selectedWeek={formData.fortnightlyWeek}
            selectedDay={formData.dateValue}
            onWeekSelect={(week) => handleInputChange("fortnightlyWeek", week)}
            onDaySelect={(day) => handleInputChange("dateValue", day)}
          />
        </div>
      );
    }

    // Bi-Monthly: Only SOM/EOM selection (no date value needed)
    if (cycleId === "bi_monthly") {
      return (
        <div className="mt-1">
          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
            {formData.dateTypeId === "SOM" &&
              "1st and 15th of each month (14th in February)"}
            {formData.dateTypeId === "EOM" &&
              "30th and 15th of each month (14th & 28th in February)"}
            {!formData.dateTypeId && "Select date type above"}
          </p>
        </div>
      );
    }

    // Monthly/Quarterly: Handle SOM, EOM, or Fixed Date
    if (cycleId === "monthly" || cycleId === "quarterly") {
      const { dateTypeId } = formData;

      if (dateTypeId === "SOM") {
        return (
          <div className="mt-1">
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              Start of month (1st) with next business day adjustment
            </p>
          </div>
        );
      }

      if (dateTypeId === "EOM") {
        return (
          <div className="mt-1">
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              End of month (last day) with previous business day adjustment
            </p>
          </div>
        );
      }

      if (dateTypeId === "fixed") {
        return (
          <div className="space-y-2">
            <Label htmlFor="fixed-date-calendar">Select Day of Month</Label>
            <EnhancedCalendar
              mode="fixed"
              selectedDay={formData.dateValue}
              onDaySelect={(day) => handleInputChange("dateValue", day)}
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.clientId) {
      return;
    }

    setIsLoading(true);

    try {
      // Prepare mutation variables based on cycle type
      const mutationVariables = {
        clientId: formData.clientId,
        name: formData.name.trim(),
        cycleId: formData.cycleId,
        dateTypeId:
          formData.dateTypeId ||
          (formData.cycleId === "weekly" || formData.cycleId === "fortnightly"
            ? "DOW"
            : null),
        dateValue: formData.dateValue ? parseInt(formData.dateValue) : null,
        primaryConsultantId: formData.primaryConsultantId || null,
        backupConsultantId: formData.backupConsultantId || null,
        managerId: formData.managerId || null,
        processingDaysBeforeEft: parseInt(formData.processingDaysBeforeEft),
        // Add fortnightly week if applicable
        ...(formData.cycleId === "fortnightly" && {
          fortnightlyWeek: formData.fortnightlyWeek,
        }),
      };

      const result = await createPayroll({
        variables: {
          object: mutationVariables,
        },
      });

      const newPayrollId = result.data?.insertPayroll?.id;

      if (newPayrollId) {
        // Show success message for payroll creation
        toast.success("Payroll created successfully!");

        // Automatically generate payroll dates for the new payroll
        toast.info("Generating payroll dates...");

        const startDate = new Date().toISOString().split("T")[0]; // Today's date
        const endDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0]; // 1 year from now

        // Generate dates - this will handle loading state and redirect
        generatePayrollDates({
          variables: {
            payrollId: newPayrollId,
            startDate,
            endDate,
          },
        });

        // Redirect will happen in the onCompleted callback
        setTimeout(() => {
          router.push(`/payrolls/${newPayrollId}`);
        }, 2000); // Small delay to show the generation success message
      } else {
        setIsLoading(false);
        toast.error("Failed to create payroll");
      }
    } catch (error) {
      console.error("Error creating payroll:", error);
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    if (
      !formData.name.trim() ||
      !formData.clientId ||
      !formData.cycleId ||
      !formData.processingDaysBeforeEft
    ) {
      return false;
    }

    // Weekly: needs day of week
    if (formData.cycleId === "weekly") {
      return !!formData.dateValue;
    }

    // Fortnightly: needs week A/B and day of week
    if (formData.cycleId === "fortnightly") {
      return !!(formData.fortnightlyWeek && formData.dateValue);
    }

    // Bi-monthly, monthly, quarterly: need date type
    if (["bi_monthly", "monthly", "quarterly"].includes(formData.cycleId)) {
      if (!formData.dateTypeId) {return false;}

      // If fixed date type selected, need day value
      if (formData.dateTypeId === "fixed") {
        return !!formData.dateValue;
      }

      // SOM and EOM don't need additional date value
      return true;
    }

    return false;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/payrolls">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Payrolls
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create New Payroll
            </h1>
            <p className="text-gray-500">
              Set up a new payroll with schedule and consultant assignments
            </p>
          </div>
        </div>
      </div>

      {/* Create Payroll Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Payroll Configuration</CardTitle>
            <CardDescription>
              Configure the payroll schedule, assignments, and processing
              details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client">Client *</Label>
                <Select
                  value={formData.clientId}
                  onValueChange={(value) =>
                    handleInputChange("clientId", value)
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select client..." />
                  </SelectTrigger>
                  <SelectContent>
                    {clientsData?.clients?.map((client: any) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="payroll-name">Payroll Name *</Label>
                <Input
                  id="payroll-name"
                  placeholder="Enter payroll name..."
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("name", e.target.value)
                  }
                  className="mt-1"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Payroll Schedule Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Schedule Configuration</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cycle-id">Payroll Cycle *</Label>
                  <Select
                    value={formData.cycleId}
                    onValueChange={(value) => handleCycleChange(value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select cycle..." />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYROLL_CYCLES.map((cycle) => (
                        <SelectItem key={cycle.id} value={cycle.id}>
                          {cycle.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Only show date type for cycles that need it */}
                {(formData.cycleId === "bi_monthly" ||
                  formData.cycleId === "monthly" ||
                  formData.cycleId === "quarterly") && (
                  <div>
                    <Label htmlFor="date-type-id">Date Type *</Label>
                    <Select
                      value={formData.dateTypeId}
                      onValueChange={(value) => handleDateTypeChange(value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select date type..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDateTypes.map((dateType) => (
                          <SelectItem key={dateType.id} value={dateType.id}>
                            {dateType.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Show processing days in the second column if no date type needed */}
                {(formData.cycleId === "weekly" ||
                  formData.cycleId === "fortnightly") && (
                  <div>
                    <Label htmlFor="processing-days">
                      Processing Days Before EFT *
                    </Label>
                    <Input
                      id="processing-days"
                      type="number"
                      placeholder="e.g., 3"
                      value={formData.processingDaysBeforeEft}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "processingDaysBeforeEft",
                          e.target.value
                        )
                      }
                      className="mt-1"
                      disabled={isLoading}
                      min="1"
                    />
                  </div>
                )}
              </div>

              {/* Date configuration section */}
              <div>
                <Label htmlFor="date-value">Date Configuration</Label>
                {renderDateValueInput()}
              </div>

              {/* Processing days for cycles that have date type dropdown */}
              {(formData.cycleId === "bi_monthly" ||
                formData.cycleId === "monthly" ||
                formData.cycleId === "quarterly") && (
                <div>
                  <Label htmlFor="processing-days">
                    Processing Days Before EFT *
                  </Label>
                  <Input
                    id="processing-days"
                    type="number"
                    placeholder="e.g., 3"
                    value={formData.processingDaysBeforeEft}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange(
                        "processingDaysBeforeEft",
                        e.target.value
                      )
                    }
                    className="mt-1"
                    disabled={isLoading}
                    min="1"
                  />
                </div>
              )}
            </div>

            {/* Staff Assignments */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Staff Assignments</h3>

              <div>
                <Label htmlFor="primary-consultant">Primary Consultant</Label>
                <Select
                  value={formData.primaryConsultantId}
                  onValueChange={(value) =>
                    handleInputChange("primaryConsultantId", value)
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select primary consultant..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePrimaryConsultants.map((consultant: any) => (
                      <SelectItem key={consultant.id} value={consultant.id}>
                        {consultant.name} ({consultant.email}) -{" "}
                        {consultant.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  Any staff member can be assigned as primary consultant
                </p>
              </div>

              <div>
                <Label htmlFor="backup-consultant">Backup Consultant</Label>
                <Select
                  value={formData.backupConsultantId || "none"}
                  onValueChange={(value) =>
                    handleInputChange(
                      "backupConsultantId",
                      value === "none" ? "" : value
                    )
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select backup consultant..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {availableBackupConsultants.map((consultant: any) => (
                      <SelectItem key={consultant.id} value={consultant.id}>
                        {consultant.name} ({consultant.email}) -{" "}
                        {consultant.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.primaryConsultantId &&
                  availableBackupConsultants.length === 0 && (
                    <p className="text-xs text-amber-600 mt-1">
                      ⚠️ No other staff available - primary consultant cannot be
                      backup
                    </p>
                  )}
                {!formData.primaryConsultantId && (
                  <p className="text-xs text-gray-500 mt-1">
                    Select primary consultant first to see available backup
                    options
                  </p>
                )}
                {formData.primaryConsultantId &&
                  availableBackupConsultants.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Cannot select the same person as primary consultant
                    </p>
                  )}
              </div>

              <div>
                <Label htmlFor="manager">Manager</Label>
                <Select
                  value={formData.managerId}
                  onValueChange={(value) =>
                    handleInputChange("managerId", value)
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select manager..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableManagers.map((manager: any) => (
                      <SelectItem key={manager.id} value={manager.id}>
                        {manager.name} ({manager.email}) - {manager.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  Only users with Manager, Admin, or Org Admin roles can be
                  assigned as managers
                  {availableManagers.length === 0 && (
                    <span className="text-amber-600 block mt-1">
                      ⚠️ No users with manager-level roles available
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Add quarterly note */}
            {formData.cycleId === "quarterly" && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-700">
                  <strong>Quarterly Processing:</strong> Payrolls will be
                  processed in March, June, September, and December.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/payrolls")}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || !isFormValid()}>
            {isLoading ? (
              <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isLoading ? "Creating..." : "Create Payroll"}
          </Button>
        </div>
      </form>
    </div>
  );
}
