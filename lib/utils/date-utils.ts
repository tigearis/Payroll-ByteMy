/**
 * Consolidated Date Utilities
 * Combines payroll date calculations and safe date parsing/formatting
 */

import {
  addDays,
  isWeekend,
  isSameDay,
  endOfMonth,
  startOfMonth,
  addMonths,
  addWeeks,
  setDate,
  format,
  parseISO,
  isValid,
} from "date-fns";

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

// Types that match PostgreSQL ENUM types
export type PayrollCycleType =
  | "weekly"
  | "fortnightly"
  | "bi_monthly"
  | "monthly"
  | "quarterly";
export type PayrollDateType =
  | "fixed_date"
  | "eom"
  | "som"
  | "week_a"
  | "week_b"
  | "dow";
export type AdjustmentRule = "previous" | "next" | "nearest";
export type PayrollStatus = "Active" | "Implementation" | "Inactive";

// Interfaces
export interface Holiday {
  id: string;
  date: Date;
  name: string;
  recurring: boolean;
  region: string;
}

export interface PayrollDate {
  originalEftDate: Date;
  adjustedEftDate: Date;
  processingDate: Date;
}

// =============================================================================
// SAFE DATE PARSING AND FORMATTING
// =============================================================================

/**
 * Safely parses an ISO date string with error handling
 * @param dateString - The date string to parse
 * @returns Date object or null if parsing fails
 */
export function safeParseISO(
  dateString: string | null | undefined
): Date | null {
  if (!dateString || typeof dateString !== "string") {
    return null;
  }

  try {
    const parsedDate = parseISO(dateString);
    return isValid(parsedDate) ? parsedDate : null;
  } catch (error) {
    console.warn("Error parsing ISO date:", dateString, error);
    return null;
  }
}

/**
 * Safely formats a date with error handling
 * @param date - The date to format (can be Date, string, or null/undefined)
 * @param formatString - The format string (default: 'MMM d, yyyy')
 * @param fallback - The fallback string if formatting fails (default: 'Unknown date')
 * @returns Formatted date string or fallback
 */
export function safeFormatDate(
  date: Date | string | null | undefined,
  formatString: string = "MMM d, yyyy",
  fallback: string = "Unknown date"
): string {
  if (!date) {
    return fallback;
  }

  try {
    let parsedDate: Date | null = null;

    if (typeof date === "string") {
      parsedDate = safeParseISO(date);
      if (!parsedDate) {
        return fallback;
      }
    } else if (date instanceof Date) {
      parsedDate = date;
    } else {
      return fallback;
    }

    if (!parsedDate || !isValid(parsedDate)) {
      return fallback;
    }

    return format(parsedDate, formatString);
  } catch (error) {
    console.warn("Error formatting date:", date, error);
    return fallback;
  }
}

/**
 * Safely formats a date with time
 * @param date - The date to format
 * @param fallback - The fallback string if formatting fails
 * @returns Formatted date and time string or fallback
 */
export function safeFormatDateTime(
  date: Date | string | null | undefined,
  fallback: string = "Unknown date"
): string {
  return safeFormatDate(date, "MMM d, yyyy h:mm a", fallback);
}

/**
 * Safely formats a date for display in UI components
 * @param date - The date to format
 * @param includeTime - Whether to include time (default: false)
 * @returns Formatted date string
 */
export function formatDisplayDate(
  date: Date | string | null | undefined,
  includeTime: boolean = false
): string {
  if (includeTime) {
    return safeFormatDateTime(date);
  }
  return safeFormatDate(date);
}

/**
 * Safely formats a date for API/database usage (ISO format)
 * @param date - The date to format
 * @returns ISO date string or null if invalid
 */
export function formatISODate(
  date: Date | string | null | undefined
): string | null {
  if (!date) {
    return null;
  }

  try {
    let parsedDate: Date | null = null;

    if (typeof date === "string") {
      parsedDate = safeParseISO(date);
      if (!parsedDate) {
        return null;
      }
    } else if (date instanceof Date) {
      parsedDate = date;
    } else {
      return null;
    }

    if (!parsedDate || !isValid(parsedDate)) {
      return null;
    }

    return parsedDate.toISOString();
  } catch (error) {
    console.warn("Error formatting ISO date:", date, error);
    return null;
  }
}

/**
 * Safely formats a date for Australian locale
 * @param date - The date to format
 * @param fallback - The fallback string if formatting fails
 * @returns Formatted date string in Australian format
 */
export function formatAustralianDate(
  date: Date | string | null | undefined,
  fallback: string = "Unknown date"
): string {
  return safeFormatDate(date, "d/MM/yyyy", fallback);
}

/**
 * Safely formats a date with relative time (e.g., "2 days ago")
 * @param date - The date to format
 * @param fallback - The fallback string if formatting fails
 * @returns Relative time string or fallback
 */
export function formatRelativeTime(
  date: Date | string | null | undefined,
  fallback: string = "Unknown time"
): string {
  if (!date) {
    return fallback;
  }

  try {
    let parsedDate: Date | null = null;

    if (typeof date === "string") {
      parsedDate = safeParseISO(date);
      if (!parsedDate) {
        return fallback;
      }
    } else if (date instanceof Date) {
      parsedDate = date;
    } else {
      return fallback;
    }

    if (!parsedDate || !isValid(parsedDate)) {
      return fallback;
    }

    const now = new Date();
    const diffInMs = now.getTime() - parsedDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) {
      return "Just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    } else if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
    } else {
      return safeFormatDate(parsedDate, "MMM d, yyyy", fallback);
    }
  } catch (error) {
    console.warn("Error formatting relative time:", date, error);
    return fallback;
  }
}

/**
 * Checks if a date string or Date object is valid
 * @param date - The date to validate
 * @returns Boolean indicating if the date is valid
 */
export function isValidDate(date: Date | string | null | undefined): boolean {
  if (!date) {
    return false;
  }

  try {
    if (typeof date === "string") {
      const parsedDate = safeParseISO(date);
      return parsedDate !== null && isValid(parsedDate);
    } else if (date instanceof Date) {
      return isValid(date);
    }
    return false;
  } catch (error) {
    return false;
  }
}

// =============================================================================
// PAYROLL DATE CALCULATIONS
// =============================================================================

/**
 * Checks if a date falls on a holiday
 */
export function isHoliday(date: Date, holidays: Holiday[]): boolean {
  return holidays.some(holiday => {
    // For non-recurring holidays, check exact match
    if (!holiday.recurring) {
      return isSameDay(new Date(holiday.date), date);
    }

    // For recurring holidays, only check month and day
    const holidayDate = new Date(holiday.date);
    return (
      holidayDate.getMonth() === date.getMonth() &&
      holidayDate.getDate() === date.getDate()
    );
  });
}

/**
 * Adjusts a date based on weekends and holidays
 */
export function adjustDate(
  date: Date,
  rule: AdjustmentRule = "previous",
  holidays: Holiday[] = []
): Date {
  // If date is already a business day, return as is
  if (!isWeekend(date) && !isHoliday(date, holidays)) {
    return date;
  }

  let adjustedDate = new Date(date);

  switch (rule) {
    case "previous":
      // Keep moving backwards until we find a valid business day
      while (isWeekend(adjustedDate) || isHoliday(adjustedDate, holidays)) {
        adjustedDate = addDays(adjustedDate, -1);
      }
      break;

    case "next":
      // Keep moving forward until we find a valid business day
      while (isWeekend(adjustedDate) || isHoliday(adjustedDate, holidays)) {
        adjustedDate = addDays(adjustedDate, 1);
      }
      break;

    case "nearest":
      // Try both directions and take the closest
      let prevDate = new Date(date);
      let nextDate = new Date(date);

      while (isWeekend(prevDate) || isHoliday(prevDate, holidays)) {
        prevDate = addDays(prevDate, -1);
      }

      while (isWeekend(nextDate) || isHoliday(nextDate, holidays)) {
        nextDate = addDays(nextDate, 1);
      }

      // Compare the difference and take the closest
      const diffPrev = date.getTime() - prevDate.getTime();
      const diffNext = nextDate.getTime() - date.getTime();

      adjustedDate = diffPrev <= diffNext ? prevDate : nextDate;
      break;
  }

  return adjustedDate;
}

/**
 * Calculates the next EFT date based on cycle type, date type, and date value
 * @param baseDate The date to calculate from (usually the previous EFT date)
 * @param cycleType The type of payroll cycle
 * @param dateType The type of date calculation
 * @param dateValue Specific date value (e.g., day of month for fixed_date)
 * @returns The next EFT date before any adjustments
 */
export function calculateNextEftDate(
  baseDate: Date,
  cycleType: PayrollCycleType,
  dateType: PayrollDateType,
  dateValue?: number
): Date {
  let nextDate = new Date(baseDate);

  // First calculate based on cycle type
  switch (cycleType) {
    case "weekly":
      nextDate = addWeeks(nextDate, 1);
      break;

    case "fortnightly":
      nextDate = addWeeks(nextDate, 2);
      break;

    case "bi_monthly":
      // Twice a month - typically on the 15th and last day
      if (nextDate.getDate() < 15) {
        nextDate = setDate(nextDate, 15);
      } else if (nextDate.getDate() === 15) {
        nextDate = endOfMonth(nextDate);
      } else {
        nextDate = setDate(addMonths(nextDate, 1), 15);
      }
      break;

    case "monthly":
      nextDate = addMonths(nextDate, 1);
      break;

    case "quarterly":
      nextDate = addMonths(nextDate, 3);
      break;
  }

  // Then adjust based on date type
  switch (dateType) {
    case "fixed_date":
      if (dateValue && dateValue > 0 && dateValue <= 31) {
        // Adjust to the specified day of month, or the last day if it exceeds
        const lastDayOfMonth = new Date(
          nextDate.getFullYear(),
          nextDate.getMonth() + 1,
          0
        ).getDate();
        const day = Math.min(dateValue, lastDayOfMonth);
        nextDate = setDate(nextDate, day);
      }
      break;

    case "eom":
      // End of month
      nextDate = endOfMonth(nextDate);
      break;

    case "som":
      // Start of month
      nextDate = startOfMonth(nextDate);
      break;

    case "week_a":
    case "week_b":
      // These would depend on your specific business rules
      // For now, assuming week_a is the first week of the month
      // and week_b is the third week
      if (dateType === "week_a") {
        nextDate = startOfMonth(nextDate);
        // Find the first specific weekday of the month
        if (dateValue && dateValue >= 0 && dateValue <= 6) {
          while (nextDate.getDay() !== dateValue) {
            nextDate = addDays(nextDate, 1);
          }
        }
      } else {
        // week_b - third week
        nextDate = startOfMonth(nextDate);
        nextDate = addWeeks(nextDate, 2); // Move to 3rd week
        // Find the specific weekday in that week
        if (dateValue && dateValue >= 0 && dateValue <= 6) {
          while (nextDate.getDay() !== dateValue) {
            nextDate = addDays(nextDate, 1);
          }
        }
      }
      break;

    case "dow":
      // Specific day of week
      // If dateValue is provided (0-6, where 0 is Sunday)
      if (dateValue !== undefined && dateValue >= 0 && dateValue <= 6) {
        // Find the next occurrence of that day of week
        while (nextDate.getDay() !== dateValue) {
          nextDate = addDays(nextDate, 1);
        }
      }
      break;
  }

  return nextDate;
}

/**
 * Calculates payroll dates based on payroll configuration
 */
export function calculatePayrollDates(
  baseDate: Date,
  cycleType: PayrollCycleType,
  dateType: PayrollDateType,
  dateValue: number | undefined,
  processingDaysBeforeEft: number,
  adjustmentRule: AdjustmentRule = "previous",
  holidays: Holiday[] = []
): PayrollDate {
  // Calculate the original EFT date
  const originalEftDate = calculateNextEftDate(
    baseDate,
    cycleType,
    dateType,
    dateValue
  );

  // Adjust EFT date if it falls on weekend or holiday
  const adjustedEftDate = adjustDate(originalEftDate, adjustmentRule, holidays);

  // Calculate processing date by subtracting days from adjusted EFT date
  const rawProcessingDate = addDays(adjustedEftDate, -processingDaysBeforeEft);

  // Adjust processing date if it falls on weekend or holiday
  const processingDate = adjustDate(
    rawProcessingDate,
    adjustmentRule,
    holidays
  );

  return {
    originalEftDate,
    adjustedEftDate,
    processingDate,
  };
}

/**
 * Generates a series of payroll dates for a given configuration
 */
export function generatePayrollSchedule(
  startDate: Date,
  cycleType: PayrollCycleType,
  dateType: PayrollDateType,
  dateValue: number | undefined,
  processingDaysBeforeEft: number,
  adjustmentRule: AdjustmentRule = "previous",
  holidays: Holiday[] = [],
  periodsToGenerate: number = 12
): PayrollDate[] {
  const schedule: PayrollDate[] = [];
  let currentDate = new Date(startDate);

  for (let i = 0; i < periodsToGenerate; i++) {
    const dates = calculatePayrollDates(
      currentDate,
      cycleType,
      dateType,
      dateValue,
      processingDaysBeforeEft,
      adjustmentRule,
      holidays
    );

    schedule.push(dates);

    // Use adjusted EFT date as the base for the next calculation
    currentDate = dates.adjustedEftDate;
  }

  return schedule;
}

// =============================================================================
// DEFAULT EXPORT
// =============================================================================

/**
 * Default export with commonly used functions
 */
const defaultExport = {
  // Safe date utilities
  safeParseISO,
  safeFormatDate,
  safeFormatDateTime,
  formatDisplayDate,
  formatISODate,
  formatAustralianDate,
  formatRelativeTime,
  isValidDate,
  // Payroll date utilities
  isHoliday,
  adjustDate,
  calculateNextEftDate,
  calculatePayrollDates,
  generatePayrollSchedule,
};

export default defaultExport;
