// app/(dashboard)/clients/new/page.tsx
"use client";

import { useMutation, useQuery } from "@apollo/client";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CREATE_CLIENT, GET_CLIENTS } from "@/domains/clients/services/client.service";
import { CREATE_PAYROLL } from "@/domains/payrolls/services/payroll.service";

import { GET_ALL_USERS_LIST } from "@/domains/staff/graphql/generated";

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

const BI_MONTHLY_SOM_INFO =
  "1st and 15th (14th in February) with Next Business Day rule";
const BI_MONTHLY_EOM_INFO =
  "30th and 15th (14th in February) with Previous Business Day rule";

export default function NewClientPage() {
  const router = useRouter();

  // Form state
  const [activeTab, setActiveTab] = useState("details");
  const [formData, setFormData] = useState({
    name: "",
    contact_person: "",
    contact_email: "",
    contact_phone: "",
    active: true,
  });

  // Payroll form state
  const [payrollData, setPayrollData] = useState({
    name: "",
    cycleId: "",
    dateTypeId: "",
    dateValue: "",
    fortnightlyWeek: "", // For fortnightly cycle week A/B selection
    primaryConsultantId: "",
    backupConsultantId: "",
    managerId: "",
    processingDaysBeforeEft: "3",
  });

  const [createPayroll, setCreatePayroll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // GraphQL operations
  const { data: usersData } = useQuery(GET_ALL_USERS_LIST);

  const [createClient] = useMutation(CREATE_CLIENT, {
    refetchQueries: [{ query: GET_CLIENTS }],
  });

  const [createPayrollMutation] = useMutation(CREATE_PAYROLL);

  // Handle input changes
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePayrollInputChange = (field: string, value: string) => {
    setPayrollData((prev) => ({
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
    (user: any) => user.id !== payrollData.primaryConsultantId
  );

  // Managers must have manager role or above
  const availableManagers = users.filter((user: any) =>
    ["manager", "developer", "org_admin"].includes(user.role)
  );

  // Get available date types based on selected cycle
  const availableDateTypes = payrollData.cycleId
    ? PAYROLL_DATE_TYPES[
        payrollData.cycleId as keyof typeof PAYROLL_DATE_TYPES
      ] || []
    : [];

  // Reset date type and value when cycle changes
  const handleCycleChange = (value: string) => {
    setPayrollData((prev) => ({
      ...prev,
      cycleId: value,
      dateTypeId: value === "weekly" || value === "fortnightly" ? "DOW" : "",
      dateValue: "",
      fortnightlyWeek: "",
    }));
  };

  // Reset date value when date type changes
  const handleDateTypeChange = (value: string) => {
    handlePayrollInputChange("dateTypeId", value);
    handlePayrollInputChange("dateValue", "");
  };

  // Render appropriate date value input based on cycle and date type
  const renderDateValueInput = () => {
    const { cycleId } = payrollData;

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
            value={payrollData.dateValue}
            onValueChange={(value) =>
              handlePayrollInputChange("dateValue", value)
            }
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
            selectedWeek={payrollData.fortnightlyWeek}
            selectedDay={payrollData.dateValue}
            onWeekSelect={(week) =>
              handlePayrollInputChange("fortnightlyWeek", week)
            }
            onDaySelect={(day) => handlePayrollInputChange("dateValue", day)}
          />
        </div>
      );
    }

    // Bi-Monthly: Only SOM/EOM selection (no date value needed)
    if (cycleId === "bi_monthly") {
      return (
        <div className="mt-1">
          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
            {payrollData.dateTypeId === "SOM" &&
              "1st and 15th of each month (14th in February)"}
            {payrollData.dateTypeId === "EOM" &&
              "30th and 15th of each month (14th & 28th in February)"}
            {!payrollData.dateTypeId && "Select date type above"}
          </p>
        </div>
      );
    }

    // Monthly/Quarterly: Handle SOM, EOM, or Fixed Date
    if (cycleId === "monthly" || cycleId === "quarterly") {
      const { dateTypeId } = payrollData;

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
              selectedDay={payrollData.dateValue}
              onDaySelect={(day) => handlePayrollInputChange("dateValue", day)}
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

    if (!formData.name.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      // Create client first
      const clientResult = await createClient({
        variables: {
          name: formData.name.trim(),
          contactPerson: formData.contact_person.trim() || null,
          contactEmail: formData.contact_email.trim() || null,
          contactPhone: formData.contact_phone.trim() || null,
        },
      });

      const newClientId = clientResult.data?.insert_clients_one?.id;

      // Create payroll if requested and form is valid
      if (createPayroll && newClientId && payrollData.name.trim()) {
        // Prepare mutation variables based on cycle type
        const mutationVariables = {
          clientId: newClientId,
          name: payrollData.name.trim(),
          cycleId: payrollData.cycleId,
          dateTypeId:
            payrollData.dateTypeId ||
            (payrollData.cycleId === "weekly" ||
            payrollData.cycleId === "fortnightly"
              ? "DOW"
              : null),
          dateValue: payrollData.dateValue
            ? parseInt(payrollData.dateValue)
            : null,
          primaryConsultantId: payrollData.primaryConsultantId || null,
          backupConsultantId: payrollData.backupConsultantId || null,
          managerId: payrollData.managerId || null,
          processingDaysBeforeEft: parseInt(
            payrollData.processingDaysBeforeEft
          ),
          // Add fortnightly week if applicable
          ...(payrollData.cycleId === "fortnightly" && {
            fortnightlyWeek: payrollData.fortnightlyWeek,
          }),
        };

        await createPayrollMutation({
          variables: mutationVariables,
        });
      }

      // Redirect to the newly created client's detail page
      router.push(`/clients/${newClientId}`);
    } catch (error) {
      console.error("Error creating client/payroll:", error);
      setIsLoading(false);
    }
  };

  const isPayrollFormValid = () => {
    if (
      !payrollData.name.trim() ||
      !payrollData.cycleId ||
      !payrollData.processingDaysBeforeEft
    ) {
      return false;
    }

    // Weekly: needs day of week
    if (payrollData.cycleId === "weekly") {
      return !!payrollData.dateValue;
    }

    // Fortnightly: needs week A/B and day of week
    if (payrollData.cycleId === "fortnightly") {
      return !!(payrollData.fortnightlyWeek && payrollData.dateValue);
    }

    // Bi-monthly, monthly, quarterly: need date type
    if (["bi_monthly", "monthly", "quarterly"].includes(payrollData.cycleId)) {
      if (!payrollData.dateTypeId) {return false;}

      // If fixed date type selected, need day value
      if (payrollData.dateTypeId === "fixed") {
        return !!payrollData.dateValue;
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
          <Link href="/clients">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Clients
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Client</h1>
            <p className="text-gray-500">
              Create a new client and optionally set up their payroll
            </p>
          </div>
        </div>
      </div>

      {/* Create Client Form with Tabs */}
      <form onSubmit={handleSubmit}>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Client Details</TabsTrigger>
            <TabsTrigger value="payroll">Payroll Setup</TabsTrigger>
          </TabsList>

          {/* Client Details Tab */}
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
                <CardDescription>
                  Enter the basic information about the client.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="client-name">Client Name *</Label>
                  <Input
                    id="client-name"
                    placeholder="Enter client name..."
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange("name", e.target.value)
                    }
                    className="mt-1"
                    disabled={isLoading}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="contact-person">Contact Person</Label>
                  <Input
                    id="contact-person"
                    placeholder="Enter contact person name..."
                    value={formData.contact_person}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange("contact_person", e.target.value)
                    }
                    className="mt-1"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="Enter contact email..."
                    value={formData.contact_email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange("contact_email", e.target.value)
                    }
                    className="mt-1"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="contact-phone">Contact Phone</Label>
                  <Input
                    id="contact-phone"
                    placeholder="Enter contact phone..."
                    value={formData.contact_phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange("contact_phone", e.target.value)
                    }
                    className="mt-1"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked: boolean) =>
                      handleInputChange("active", checked)
                    }
                    disabled={isLoading}
                  />
                  <Label
                    htmlFor="active"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Active client
                  </Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payroll Setup Tab */}
          <TabsContent value="payroll">
            <Card>
              <CardHeader>
                <CardTitle>Payroll Setup (Optional)</CardTitle>
                <CardDescription>
                  Optionally create a payroll for this client. Choose from
                  weekly, fortnightly, bi-monthly, monthly, or quarterly cycles
                  with automatic business day adjustments.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Switch
                    id="create-payroll"
                    checked={createPayroll}
                    onCheckedChange={setCreatePayroll}
                    disabled={isLoading}
                  />
                  <Label
                    htmlFor="create-payroll"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Create payroll for this client
                  </Label>
                </div>

                {createPayroll && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="payroll-name">Payroll Name *</Label>
                      <Input
                        id="payroll-name"
                        placeholder="Enter payroll name..."
                        value={payrollData.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handlePayrollInputChange("name", e.target.value)
                        }
                        className="mt-1"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cycle-id">Payroll Cycle *</Label>
                        <Select
                          value={payrollData.cycleId}
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
                      {(payrollData.cycleId === "bi_monthly" ||
                        payrollData.cycleId === "monthly" ||
                        payrollData.cycleId === "quarterly") && (
                        <div>
                          <Label htmlFor="date-type-id">Date Type *</Label>
                          <Select
                            value={payrollData.dateTypeId}
                            onValueChange={(value) =>
                              handleDateTypeChange(value)
                            }
                            disabled={isLoading}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select date type..." />
                            </SelectTrigger>
                            <SelectContent>
                              {availableDateTypes.map((dateType) => (
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
                      {(payrollData.cycleId === "weekly" ||
                        payrollData.cycleId === "fortnightly") && (
                        <div>
                          <Label htmlFor="processing-days">
                            Processing Days Before EFT *
                          </Label>
                          <Input
                            id="processing-days"
                            type="number"
                            placeholder="e.g., 3"
                            value={payrollData.processingDaysBeforeEft}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                              handlePayrollInputChange(
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
                    {(payrollData.cycleId === "bi_monthly" ||
                      payrollData.cycleId === "monthly" ||
                      payrollData.cycleId === "quarterly") && (
                      <div>
                        <Label htmlFor="processing-days">
                          Processing Days Before EFT *
                        </Label>
                        <Input
                          id="processing-days"
                          type="number"
                          placeholder="e.g., 3"
                          value={payrollData.processingDaysBeforeEft}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handlePayrollInputChange(
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

                    <div>
                      <Label htmlFor="primary-consultant">
                        Primary Consultant
                      </Label>
                      <Select
                        value={payrollData.primaryConsultantId}
                        onValueChange={(value) =>
                          handlePayrollInputChange("primaryConsultantId", value)
                        }
                        disabled={isLoading}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select primary consultant..." />
                        </SelectTrigger>
                        <SelectContent>
                          {availablePrimaryConsultants.map(
                            (consultant: any) => (
                              <SelectItem
                                key={consultant.id}
                                value={consultant.id}
                              >
                                {consultant.name} ({consultant.email}) -{" "}
                                {consultant.role}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500 mt-1">
                        Any staff member can be assigned as primary consultant
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="backup-consultant">
                        Backup Consultant
                      </Label>
                      <Select
                        value={payrollData.backupConsultantId || "none"}
                        onValueChange={(value) =>
                          handlePayrollInputChange(
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
                            <SelectItem
                              key={consultant.id}
                              value={consultant.id}
                            >
                              {consultant.name} ({consultant.email}) -{" "}
                              {consultant.role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {payrollData.primaryConsultantId &&
                        availableBackupConsultants.length === 0 && (
                          <p className="text-xs text-amber-600 mt-1">
                            ⚠️ No other staff available - primary consultant
                            cannot be backup
                          </p>
                        )}
                      {!payrollData.primaryConsultantId && (
                        <p className="text-xs text-gray-500 mt-1">
                          Select primary consultant first to see available
                          backup options
                        </p>
                      )}
                      {payrollData.primaryConsultantId &&
                        availableBackupConsultants.length > 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            Cannot select the same person as primary consultant
                          </p>
                        )}
                    </div>

                    <div>
                      <Label htmlFor="manager">Manager</Label>
                      <Select
                        value={payrollData.managerId}
                        onValueChange={(value) =>
                          handlePayrollInputChange("managerId", value)
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
                        Only users with Manager, Admin, or Org Admin roles can
                        be assigned as managers
                        {availableManagers.length === 0 && (
                          <span className="text-amber-600 block mt-1">
                            ⚠️ No users with manager-level roles available
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Add quarterly note */}
                    {payrollData.cycleId === "quarterly" && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <p className="text-sm text-blue-700">
                          <strong>Quarterly Processing:</strong> Payrolls will
                          be processed in March, June, September, and December.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Form Actions */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/clients")}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading ||
                !formData.name.trim() ||
                (createPayroll && !isPayrollFormValid())
              }
            >
              {isLoading ? (
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isLoading
                ? "Creating..."
                : createPayroll
                ? "Create Client & Payroll"
                : "Create Client"}
            </Button>
          </div>
        </Tabs>
      </form>
    </div>
  );
}
