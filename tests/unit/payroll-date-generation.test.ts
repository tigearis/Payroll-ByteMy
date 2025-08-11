/**
 * 📅 PAYROLL DATE GENERATION PATTERN TESTS
 * 
 * Tests the complex date generation algorithms that mirror the database
 * PostgreSQL function `generate_payroll_dates`. Critical for ensuring
 * accurate payroll schedules across all Australian business patterns.
 * 
 * ALGORITHM COVERAGE:
 * ✅ Weekly payrolls (52 dates per year)
 * ✅ Fortnightly payrolls (26 dates per year, Week A/B patterns)  
 * ✅ Bi-monthly payrolls (24 dates per year, SOM/EOM variations)
 * ✅ Monthly payrolls (12 dates per year, fixed dates)
 * ✅ Quarterly payrolls (4 dates per year)
 * ✅ Date adjustment rules (business day compliance)
 * ✅ Edge cases (leap years, month boundaries, February special handling)
 * 
 * BUSINESS CRITICAL:
 * - Employee payment schedule accuracy
 * - Banking EFT processing compliance  
 * - Australian employment law adherence
 * - Payroll department operational reliability
 */

import { addDays, addWeeks, addMonths, addQuarters, format, startOfMonth, endOfMonth, getDaysInMonth, isLeapYear } from 'date-fns';

// Types that mirror the database structure
interface PayrollConfig {
  cycle: 'weekly' | 'fortnightly' | 'bi_monthly' | 'monthly' | 'quarterly';
  dateType?: 'dow' | 'som' | 'eom' | 'fixed_date' | 'week_a' | 'week_b';
  dateValue?: number; // DOW (1-7) or fixed date (1-31)
  processingDaysBeforeEft?: number;
  adjustmentRule?: 'previous' | 'next';
}

interface GeneratedPayrollDate {
  originalDate: Date;
  adjustedDate: Date;
  processingDate: Date;
  notes?: string;
  cycle: string;
  pattern?: string;
}

// Mock the core date generation logic from the database function
function generatePayrollDatesPattern(
  config: PayrollConfig,
  startDate: Date,
  endDate: Date,
  maxDates: number = 52
): GeneratedPayrollDate[] {
  const dates: GeneratedPayrollDate[] = [];
  let currentDate = new Date(startDate);
  let datesGenerated = 0;
  
  while (currentDate <= endDate && datesGenerated < maxDates) {
    let originalEftDate: Date;
    
    switch (config.cycle) {
      case 'weekly':
        originalEftDate = generateWeeklyDate(currentDate, config.dateValue || 5);
        currentDate = addWeeks(currentDate, 1);
        break;
        
      case 'fortnightly':
        originalEftDate = generateFortnightlyDate(currentDate, config);
        currentDate = addWeeks(currentDate, 2);
        break;
        
      case 'bi_monthly':
        const biMonthlyResult = generateBiMonthlyDate(currentDate, config);
        originalEftDate = biMonthlyResult.date;
        currentDate = biMonthlyResult.nextDate;
        break;
        
      case 'monthly':
        originalEftDate = generateMonthlyDate(currentDate, config);
        currentDate = addMonths(currentDate, 1);
        break;
        
      case 'quarterly':
        originalEftDate = generateQuarterlyDate(currentDate, config);
        currentDate = addQuarters(currentDate, 1);
        break;
        
      default:
        throw new Error(`Unsupported cycle: ${config.cycle}`);
    }
    
    // Apply business day adjustment
    const adjustedDate = adjustToBusinessDay(originalEftDate, config.adjustmentRule || 'previous');
    
    // Calculate processing date
    const processingDaysBeforeEft = config.processingDaysBeforeEft || 0;
    const processingDate = addDays(adjustedDate, -processingDaysBeforeEft);
    
    dates.push({
      originalDate: originalEftDate,
      adjustedDate,
      processingDate,
      cycle: config.cycle,
      notes: originalEftDate.getTime() !== adjustedDate.getTime() ? 'Adjusted for business day' : undefined
    });
    
    datesGenerated++;
  }
  
  return dates;
}

function generateWeeklyDate(startDate: Date, dayOfWeek: number): Date {
  const date = new Date(startDate);
  const currentDOW = date.getDay() === 0 ? 7 : date.getDay(); // Convert Sunday=0 to 7
  const daysToAdd = (dayOfWeek - currentDOW + 7) % 7;
  return addDays(date, daysToAdd);
}

function generateFortnightlyDate(startDate: Date, config: PayrollConfig): Date {
  // Fortnightly follows Week A/B pattern based on year start
  const dayOfWeek = config.dateValue || 5; // Default Friday
  const weekType = config.dateType === 'week_b' ? 'B' : 'A';
  
  // Calculate which week type this date falls into
  const year = startDate.getFullYear();
  const firstSunday = getFirstSundayOfYear(year);
  const weeksSinceFirstSunday = Math.floor((startDate.getTime() - firstSunday.getTime()) / (7 * 24 * 60 * 60 * 1000));
  const currentWeekType = weeksSinceFirstSunday % 2 === 0 ? 'A' : 'B';
  
  // Generate date for current week if it matches target type
  if (currentWeekType === weekType) {
    return generateWeeklyDate(startDate, dayOfWeek);
  } else {
    // Move to next week
    return generateWeeklyDate(addWeeks(startDate, 1), dayOfWeek);
  }
}

function generateBiMonthlyDate(startDate: Date, config: PayrollConfig): { date: Date; nextDate: Date } {
  const month = startDate.getMonth();
  const year = startDate.getFullYear();
  
  if (config.dateType === 'som') {
    // SOM: 1st and 15th (14th in February)
    const day1 = new Date(year, month, 1);
    const day15 = new Date(year, month, month === 1 ? 14 : 15); // Feb uses 14th
    
    if (startDate <= day1) {
      return { date: day1, nextDate: new Date(year, month, 15) };
    } else if (startDate <= day15) {
      return { date: day15, nextDate: addMonths(new Date(year, month, 1), 1) };
    } else {
      return { date: addMonths(new Date(year, month, 1), 1), nextDate: addMonths(new Date(year, month, 15), 1) };
    }
  } else {
    // EOM: 15th and last day (14th and last day in February)
    const day15 = new Date(year, month, month === 1 ? 14 : 15);
    const lastDay = endOfMonth(new Date(year, month, 1));
    
    if (startDate <= day15) {
      return { date: day15, nextDate: lastDay };
    } else if (startDate <= lastDay) {
      return { date: lastDay, nextDate: addMonths(new Date(year, month, 15), 1) };
    } else {
      return { date: addMonths(day15, 1), nextDate: addMonths(lastDay, 1) };
    }
  }
}

function generateMonthlyDate(startDate: Date, config: PayrollConfig): Date {
  const year = startDate.getFullYear();
  const month = startDate.getMonth();
  
  if (config.dateType === 'som') {
    return startOfMonth(new Date(year, month, 1));
  } else if (config.dateType === 'eom') {
    return endOfMonth(new Date(year, month, 1));
  } else {
    // Fixed date
    const targetDay = config.dateValue || 15;
    const daysInMonth = getDaysInMonth(new Date(year, month, 1));
    const actualDay = Math.min(targetDay, daysInMonth);
    return new Date(year, month, actualDay);
  }
}

function generateQuarterlyDate(startDate: Date, config: PayrollConfig): Date {
  const year = startDate.getFullYear();
  const month = startDate.getMonth();
  const quarterStartMonth = Math.floor(month / 3) * 3;
  
  if (config.dateType === 'som') {
    return new Date(year, quarterStartMonth, 1);
  } else if (config.dateType === 'eom') {
    return endOfMonth(new Date(year, quarterStartMonth + 2, 1));
  } else {
    // Fixed date in the middle month of quarter
    const targetDay = config.dateValue || 15;
    const middleMonth = quarterStartMonth + 1;
    const daysInMonth = getDaysInMonth(new Date(year, middleMonth, 1));
    const actualDay = Math.min(targetDay, daysInMonth);
    return new Date(year, middleMonth, actualDay);
  }
}

function getFirstSundayOfYear(year: number): Date {
  const jan1 = new Date(year, 0, 1);
  const dayOfWeek = jan1.getDay();
  const daysToFirstSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  return addDays(jan1, daysToFirstSunday);
}

function adjustToBusinessDay(date: Date, rule: 'previous' | 'next'): Date {
  const dayOfWeek = date.getDay();
  
  // Simple weekend adjustment (no holidays in this test version)
  if (dayOfWeek === 0) { // Sunday
    return rule === 'previous' ? addDays(date, -2) : addDays(date, 1);
  } else if (dayOfWeek === 6) { // Saturday
    return rule === 'previous' ? addDays(date, -1) : addDays(date, 2);
  }
  
  return date;
}

describe('Weekly Payroll Date Generation', () => {
  
  it('should generate correct weekly Friday payroll', () => {
    const config: PayrollConfig = {
      cycle: 'weekly',
      dateType: 'dow',
      dateValue: 5, // Friday
      processingDaysBeforeEft: 2
    };
    
    const startDate = new Date(2024, 0, 1); // Jan 1, 2024
    const endDate = new Date(2024, 2, 31);   // End of March
    
    const dates = generatePayrollDatesPattern(config, startDate, endDate, 13);
    
    // Should generate approximately 13 weeks worth of Fridays
    expect(dates).toHaveLength(13);
    
    // All dates should be Fridays
    dates.forEach(dateRecord => {
      expect(dateRecord.originalDate.getDay()).toBe(5); // Friday
      expect(dateRecord.cycle).toBe('weekly');
    });
    
    // Should be weekly intervals
    for (let i = 1; i < dates.length; i++) {
      const daysDiff = Math.round((dates[i].originalDate.getTime() - dates[i-1].originalDate.getTime()) / (24 * 60 * 60 * 1000));
      expect(daysDiff).toBe(7);
    }
  });
  
  it('should generate correct weekly Monday payroll', () => {
    const config: PayrollConfig = {
      cycle: 'weekly',
      dateType: 'dow',
      dateValue: 1, // Monday
    };
    
    const startDate = new Date(2024, 0, 1);
    const endDate = new Date(2024, 0, 31);
    
    const dates = generatePayrollDatesPattern(config, startDate, endDate, 5);
    
    expect(dates).toHaveLength(5);
    dates.forEach(dateRecord => {
      expect(dateRecord.originalDate.getDay()).toBe(1); // Monday
    });
  });

  it('should handle weekly payroll with weekend adjustment', () => {
    const config: PayrollConfig = {
      cycle: 'weekly',
      dateType: 'dow',
      dateValue: 6, // Saturday (should adjust)
      adjustmentRule: 'previous'
    };
    
    const startDate = new Date(2024, 0, 1);
    const endDate = new Date(2024, 0, 31);
    
    const dates = generatePayrollDatesPattern(config, startDate, endDate, 4);
    
    dates.forEach(dateRecord => {
      expect(dateRecord.originalDate.getDay()).toBe(6); // Original should be Saturday
      expect(dateRecord.adjustedDate.getDay()).toBe(5); // Adjusted should be Friday
      expect(dateRecord.notes).toBe('Adjusted for business day');
    });
  });
});

describe('Fortnightly Payroll Date Generation', () => {
  
  it('should generate correct fortnightly Week A pattern', () => {
    const config: PayrollConfig = {
      cycle: 'fortnightly',
      dateType: 'week_a',
      dateValue: 5, // Friday
    };
    
    const startDate = new Date(2024, 0, 1);
    const endDate = new Date(2024, 5, 30); // 6 months
    
    const dates = generatePayrollDatesPattern(config, startDate, endDate, 13);
    
    expect(dates.length).toBeGreaterThanOrEqual(12);
    expect(dates.length).toBeLessThanOrEqual(14);
    
    // All should be Fridays
    dates.forEach(dateRecord => {
      expect(dateRecord.originalDate.getDay()).toBe(5);
      expect(dateRecord.cycle).toBe('fortnightly');
    });
    
    // Should be 14-day intervals
    for (let i = 1; i < dates.length; i++) {
      const daysDiff = Math.round((dates[i].originalDate.getTime() - dates[i-1].originalDate.getTime()) / (24 * 60 * 60 * 1000));
      expect(daysDiff).toBe(14);
    }
  });
  
  it('should generate correct fortnightly Week B pattern', () => {
    const config: PayrollConfig = {
      cycle: 'fortnightly',
      dateType: 'week_b',
      dateValue: 2, // Tuesday
    };
    
    const startDate = new Date(2024, 0, 1);
    const endDate = new Date(2024, 3, 30); // 4 months
    
    const dates = generatePayrollDatesPattern(config, startDate, endDate, 9);
    
    expect(dates.length).toBeGreaterThanOrEqual(7);
    expect(dates.length).toBeLessThanOrEqual(9);
    
    // All should be Tuesdays
    dates.forEach(dateRecord => {
      expect(dateRecord.originalDate.getDay()).toBe(2);
    });
  });

  it('should maintain fortnightly pattern across year boundary', () => {
    const config: PayrollConfig = {
      cycle: 'fortnightly',
      dateType: 'week_a',
      dateValue: 4, // Thursday
    };
    
    const startDate = new Date(2023, 11, 1); // December 2023
    const endDate = new Date(2024, 1, 29);   // February 2024
    
    const dates = generatePayrollDatesPattern(config, startDate, endDate, 7);
    
    // Should maintain 14-day intervals even across year boundary
    for (let i = 1; i < dates.length; i++) {
      const daysDiff = Math.round((dates[i].originalDate.getTime() - dates[i-1].originalDate.getTime()) / (24 * 60 * 60 * 1000));
      expect(daysDiff).toBe(14);
    }
  });
});

describe('Bi-Monthly Payroll Date Generation', () => {
  
  it('should generate correct bi-monthly SOM pattern (1st and 15th)', () => {
    const config: PayrollConfig = {
      cycle: 'bi_monthly',
      dateType: 'som',
    };
    
    const startDate = new Date(2024, 0, 1); // Jan 1, 2024
    const endDate = new Date(2024, 5, 30);  // June 30, 2024
    
    const dates = generatePayrollDatesPattern(config, startDate, endDate, 12);
    
    // Should get 12 dates (2 per month for 6 months)
    expect(dates).toHaveLength(12);
    
    // Check pattern: should alternate between 1st and 15th (except February)
    const expectedDays = [1, 15, 1, 14, 1, 15, 1, 15, 1, 15, 1, 15]; // Feb uses 14th instead of 15th
    
    dates.forEach((dateRecord, index) => {
      const expectedDay = expectedDays[index];
      expect(dateRecord.originalDate.getDate()).toBe(expectedDay);
    });
  });
  
  it('should generate correct bi-monthly EOM pattern (15th and last day)', () => {
    const config: PayrollConfig = {
      cycle: 'bi_monthly',
      dateType: 'eom',
    };
    
    const startDate = new Date(2024, 0, 1); // Jan 1, 2024
    const endDate = new Date(2024, 2, 31);  // March 31, 2024
    
    const dates = generatePayrollDatesPattern(config, startDate, endDate, 6);
    
    expect(dates).toHaveLength(6);
    
    // Should be: Jan 15, Jan 31, Feb 14, Feb 29, Mar 15, Mar 31
    const expectedDays = [15, 31, 14, 29, 15, 31]; // 2024 is leap year
    
    dates.forEach((dateRecord, index) => {
      expect(dateRecord.originalDate.getDate()).toBe(expectedDays[index]);
    });
  });

  it('should handle February correctly in non-leap year', () => {
    const config: PayrollConfig = {
      cycle: 'bi_monthly',
      dateType: 'som',
    };
    
    const startDate = new Date(2023, 1, 1); // Feb 1, 2023 (non-leap year)
    const endDate = new Date(2023, 1, 28);  // Feb 28, 2023
    
    const dates = generatePayrollDatesPattern(config, startDate, endDate, 2);
    
    expect(dates).toHaveLength(2);
    expect(dates[0].originalDate.getDate()).toBe(1);  // Feb 1
    expect(dates[1].originalDate.getDate()).toBe(14); // Feb 14 (not 15)
  });

  it('should handle February correctly in leap year', () => {
    const config: PayrollConfig = {
      cycle: 'bi_monthly',
      dateType: 'eom',
    };
    
    const startDate = new Date(2024, 1, 1); // Feb 1, 2024 (leap year)
    const endDate = new Date(2024, 1, 29);  // Feb 29, 2024
    
    const dates = generatePayrollDatesPattern(config, startDate, endDate, 2);
    
    expect(dates).toHaveLength(2);
    expect(dates[0].originalDate.getDate()).toBe(14); // Feb 14 (not 15)
    expect(dates[1].originalDate.getDate()).toBe(29); // Feb 29 (leap year)
  });
});

describe('Monthly Payroll Date Generation', () => {
  
  it('should generate correct monthly fixed date pattern', () => {
    const config: PayrollConfig = {
      cycle: 'monthly',
      dateType: 'fixed_date',
      dateValue: 25,
    };
    
    const startDate = new Date(2024, 0, 1); // Jan 1, 2024
    const endDate = new Date(2024, 11, 31); // Dec 31, 2024
    
    const dates = generatePayrollDatesPattern(config, startDate, endDate, 12);
    
    expect(dates).toHaveLength(12);
    
    // All should be 25th of each month
    dates.forEach(dateRecord => {
      expect(dateRecord.originalDate.getDate()).toBe(25);
      expect(dateRecord.cycle).toBe('monthly');
    });
    
    // Should be monthly intervals
    for (let i = 1; i < dates.length; i++) {
      const monthDiff = dates[i].originalDate.getMonth() - dates[i-1].originalDate.getMonth();
      const yearDiff = dates[i].originalDate.getFullYear() - dates[i-1].originalDate.getFullYear();
      expect(monthDiff + (yearDiff * 12)).toBe(1);
    }
  });
  
  it('should generate correct monthly SOM pattern', () => {
    const config: PayrollConfig = {
      cycle: 'monthly',
      dateType: 'som',
    };
    
    const startDate = new Date(2024, 0, 1);
    const endDate = new Date(2024, 5, 30);
    
    const dates = generatePayrollDatesPattern(config, startDate, endDate, 6);
    
    expect(dates).toHaveLength(6);
    
    // All should be 1st of each month
    dates.forEach(dateRecord => {
      expect(dateRecord.originalDate.getDate()).toBe(1);
    });
  });

  it('should generate correct monthly EOM pattern', () => {
    const config: PayrollConfig = {
      cycle: 'monthly',
      dateType: 'eom',
    };
    
    const startDate = new Date(2024, 0, 1);
    const endDate = new Date(2024, 2, 31);
    
    const dates = generatePayrollDatesPattern(config, startDate, endDate, 3);
    
    expect(dates).toHaveLength(3);
    
    // Should be last day of each month
    const expectedLastDays = [31, 29, 31]; // Jan, Feb (leap year), Mar
    dates.forEach((dateRecord, index) => {
      expect(dateRecord.originalDate.getDate()).toBe(expectedLastDays[index]);
    });
  });

  it('should handle 31st date for months with fewer days', () => {
    const config: PayrollConfig = {
      cycle: 'monthly',
      dateType: 'fixed_date',
      dateValue: 31,
    };
    
    const startDate = new Date(2024, 0, 1); // January (31 days)
    const endDate = new Date(2024, 3, 30);  // Through April
    
    const dates = generatePayrollDatesPattern(config, startDate, endDate, 4);
    
    expect(dates).toHaveLength(4);
    
    // Should adjust to actual month lengths: 31, 29, 31, 30
    const expectedDays = [31, 29, 31, 30]; // Jan, Feb (leap), Mar, Apr
    dates.forEach((dateRecord, index) => {
      expect(dateRecord.originalDate.getDate()).toBe(expectedDays[index]);
    });
  });
});

describe('Quarterly Payroll Date Generation', () => {
  
  it('should generate correct quarterly pattern', () => {
    const config: PayrollConfig = {
      cycle: 'quarterly',
      dateType: 'fixed_date',
      dateValue: 15,
    };
    
    const startDate = new Date(2024, 0, 1); // Jan 1, 2024
    const endDate = new Date(2024, 11, 31); // Dec 31, 2024
    
    const dates = generatePayrollDatesPattern(config, startDate, endDate, 4);
    
    expect(dates).toHaveLength(4);
    
    // Should be middle month of each quarter (Feb, May, Aug, Nov)
    const expectedMonths = [1, 4, 7, 10]; // Feb, May, Aug, Nov (0-indexed)
    dates.forEach((dateRecord, index) => {
      expect(dateRecord.originalDate.getMonth()).toBe(expectedMonths[index]);
      expect(dateRecord.originalDate.getDate()).toBe(15);
    });
  });
  
  it('should generate quarterly SOM pattern', () => {
    const config: PayrollConfig = {
      cycle: 'quarterly',
      dateType: 'som',
    };
    
    const startDate = new Date(2024, 0, 1);
    const endDate = new Date(2024, 11, 31);
    
    const dates = generatePayrollDatesPattern(config, startDate, endDate, 4);
    
    // Should be 1st of each quarter start month (Jan, Apr, Jul, Oct)
    const expectedMonths = [0, 3, 6, 9]; // Jan, Apr, Jul, Oct
    dates.forEach((dateRecord, index) => {
      expect(dateRecord.originalDate.getMonth()).toBe(expectedMonths[index]);
      expect(dateRecord.originalDate.getDate()).toBe(1);
    });
  });
});

describe('Edge Cases and Error Handling', () => {
  
  it('should handle leap year February correctly across all patterns', () => {
    const testYear = 2024; // Leap year
    expect(isLeapYear(new Date(testYear, 0, 1))).toBe(true);
    
    // Test bi-monthly in leap year February
    const config: PayrollConfig = {
      cycle: 'bi_monthly',
      dateType: 'eom',
    };
    
    const startDate = new Date(testYear, 1, 1); // Feb 1
    const endDate = new Date(testYear, 1, 29);  // Feb 29
    
    const dates = generatePayrollDatesPattern(config, startDate, endDate, 2);
    
    expect(dates[1].originalDate.getDate()).toBe(29); // Should be Feb 29 in leap year
  });
  
  it('should handle non-leap year February correctly', () => {
    const testYear = 2023; // Non-leap year
    expect(isLeapYear(new Date(testYear, 0, 1))).toBe(false);
    
    const config: PayrollConfig = {
      cycle: 'monthly',
      dateType: 'eom',
    };
    
    const startDate = new Date(testYear, 1, 1); // Feb 1, 2023
    const endDate = new Date(testYear, 1, 28);  // Feb 28, 2023
    
    const dates = generatePayrollDatesPattern(config, startDate, endDate, 1);
    
    expect(dates[0].originalDate.getDate()).toBe(28); // Should be Feb 28 in non-leap year
  });

  it('should handle maximum date generation limits', () => {
    const config: PayrollConfig = {
      cycle: 'weekly',
      dateType: 'dow',
      dateValue: 5,
    };
    
    const startDate = new Date(2024, 0, 1);
    const endDate = new Date(2025, 11, 31); // 2 years
    
    const dates = generatePayrollDatesPattern(config, startDate, endDate, 10); // Limited to 10
    
    expect(dates).toHaveLength(10); // Should respect max limit
  });
  
  it('should handle invalid configurations gracefully', () => {
    expect(() => {
      const config: PayrollConfig = {
        cycle: 'monthly',
        dateType: 'fixed_date',
        dateValue: 0, // Invalid day
      };
      
      generatePayrollDatesPattern(config, new Date(), new Date(), 1);
    }).not.toThrow(); // Should handle gracefully
  });

  it('should generate processing dates correctly', () => {
    const config: PayrollConfig = {
      cycle: 'weekly',
      dateType: 'dow',
      dateValue: 5, // Friday
      processingDaysBeforeEft: 3, // Process on Tuesday
    };
    
    const startDate = new Date(2024, 0, 1);
    const endDate = new Date(2024, 0, 31);
    
    const dates = generatePayrollDatesPattern(config, startDate, endDate, 4);
    
    dates.forEach(dateRecord => {
      const daysDiff = Math.round((dateRecord.adjustedDate.getTime() - dateRecord.processingDate.getTime()) / (24 * 60 * 60 * 1000));
      expect(daysDiff).toBe(3); // Processing should be 3 days before EFT
    });
  });
});