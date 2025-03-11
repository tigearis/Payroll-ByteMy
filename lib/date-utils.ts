// lib/date-utils.ts

import { 
    addDays, 
    isWeekend, 
    isSameDay, 
    endOfMonth, 
    startOfMonth, 
    addMonths, 
    addWeeks, 
    setDate,
  } from "date-fns";
  
  // Types that match your PostgreSQL ENUM types
  export type PayrollCycleType = 'weekly' | 'fortnightly' | 'bi_monthly' | 'monthly' | 'quarterly';
  export type PayrollDateType = 'fixed_date' | 'eom' | 'som' | 'week_a' | 'week_b' | 'dow';
  export type AdjustmentRule = 'previous' | 'next' | 'nearest';
  export type PayrollStatus = 'Active' | 'Implementation' | 'Inactive';
  
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
    rule: AdjustmentRule = 'previous',
    holidays: Holiday[] = []
  ): Date {
    // If date is already a business day, return as is
    if (!isWeekend(date) && !isHoliday(date, holidays)) {
      return date;
    }
    
    let adjustedDate = new Date(date);
    
    switch (rule) {
      case 'previous':
        // Keep moving backwards until we find a valid business day
        while (isWeekend(adjustedDate) || isHoliday(adjustedDate, holidays)) {
          adjustedDate = addDays(adjustedDate, -1);
        }
        break;
        
      case 'next':
        // Keep moving forward until we find a valid business day
        while (isWeekend(adjustedDate) || isHoliday(adjustedDate, holidays)) {
          adjustedDate = addDays(adjustedDate, 1);
        }
        break;
        
      case 'nearest':
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
      case 'weekly':
        nextDate = addWeeks(nextDate, 1);
        break;
        
      case 'fortnightly':
        nextDate = addWeeks(nextDate, 2);
        break;
        
      case 'bi_monthly':
        // Twice a month - typically on the 15th and last day
        if (nextDate.getDate() < 15) {
          nextDate = setDate(nextDate, 15);
        } else if (nextDate.getDate() === 15) {
          nextDate = endOfMonth(nextDate);
        } else {
          nextDate = setDate(addMonths(nextDate, 1), 15);
        }
        break;
        
      case 'monthly':
        nextDate = addMonths(nextDate, 1);
        break;
        
      case 'quarterly':
        nextDate = addMonths(nextDate, 3);
        break;
    }
    
    // Then adjust based on date type
    switch (dateType) {
      case 'fixed_date':
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
        
      case 'eom':
        // End of month
        nextDate = endOfMonth(nextDate);
        break;
        
      case 'som':
        // Start of month
        nextDate = startOfMonth(nextDate);
        break;
        
      case 'week_a':
      case 'week_b':
        // These would depend on your specific business rules
        // For now, assuming week_a is the first week of the month
        // and week_b is the third week
        if (dateType === 'week_a') {
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
        
      case 'dow':
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
    adjustmentRule: AdjustmentRule = 'previous',
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
    const processingDate = adjustDate(rawProcessingDate, adjustmentRule, holidays);
    
    return {
      originalEftDate,
      adjustedEftDate,
      processingDate
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
    adjustmentRule: AdjustmentRule = 'previous',
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