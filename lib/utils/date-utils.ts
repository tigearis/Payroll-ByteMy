/**
 * Safe Date Utilities
 * Provides robust date parsing and formatting functions to prevent runtime errors
 */

import { format, parseISO, isValid } from "date-fns";

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

/**
 * Default export with commonly used functions
 */
const defaultExport = {
  safeParseISO,
  safeFormatDate,
  safeFormatDateTime,
  formatDisplayDate,
  formatISODate,
  formatAustralianDate,
  formatRelativeTime,
  isValidDate,
};
export default defaultExport;
