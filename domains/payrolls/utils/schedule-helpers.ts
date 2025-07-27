import { PayrollCycleType, PayrollDateType } from "@/types/enums";

// Constants imported from enhanced-calendar
export const PAYROLL_CYCLES = [
  { id: PayrollCycleType.Weekly, name: "Weekly" },
  { id: PayrollCycleType.Fortnightly, name: "Fortnightly" },
  { id: PayrollCycleType.BiMonthly, name: "Bi-Monthly" },
  { id: PayrollCycleType.Monthly, name: "Monthly" },
  { id: PayrollCycleType.Quarterly, name: "Quarterly" },
];

export const PAYROLL_DATE_TYPES = {
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

export const WEEKDAYS = [
  { value: "1", label: "Monday" },
  { value: "2", label: "Tuesday" },
  { value: "3", label: "Wednesday" },
  { value: "4", label: "Thursday" },
  { value: "5", label: "Friday" },
];

// Helper function to get ordinal suffix
export function getOrdinalSuffix(num: number): string {
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

// Calculate fortnightly week dates based on current date
export function calculateFortnightlyWeeks() {
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
export function getWeekType(date: Date): "A" | "B" {
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

// Helper function to get cycle name from payroll data
export const getCycleName = (payroll: any) => {
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
export const getDateTypeName = (payroll: any) => {
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
export const getDateValueDisplay = (payroll: any) => {
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
export const getEnhancedScheduleSummary = (payroll: any) => {
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
export const getScheduleSummary = (payroll: any) => {
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

// Helper function to convert JavaScript day (0=Sunday, 1=Monday, etc.) to business weekday (1=Monday, 2=Tuesday, etc.)
export function getBusinessWeekday(jsDay: number): number {
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
