/**
 * 🏢 AUSTRALIAN BUSINESS DAY CALCULATIONS TEST SUITE
 * 
 * Tests critical business day logic for Australian payroll processing.
 * Ensures accurate EFT processing dates and compliance with banking regulations.
 * 
 * CRITICAL COVERAGE:
 * ✅ Australian public holiday recognition (National + NSW)
 * ✅ Weekend handling (Saturday/Sunday exclusions)
 * ✅ Regional holiday filtering (NSW focus)
 * ✅ Business day adjustment rules (previous/next business day)
 * ✅ Banking processing day calculations
 * ✅ Edge cases (consecutive holidays, long weekends)
 * 
 * BUSINESS IMPACT:
 * - Ensures employees are paid on correct business days
 * - Prevents failed EFT transactions due to bank closures
 * - Maintains compliance with Australian employment law
 * - Supports accurate payroll processing timelines
 */

import { addDays, format, parseISO } from 'date-fns';

// Mock holiday data based on Australian public holidays
const MOCK_AUSTRALIAN_HOLIDAYS_2024 = [
  { date: '2024-01-01', name: 'New Year\'s Day', region: ['National'] },
  { date: '2024-01-26', name: 'Australia Day', region: ['National'] },
  { date: '2024-03-29', name: 'Good Friday', region: ['National'] },
  { date: '2024-04-01', name: 'Easter Monday', region: ['National'] },
  { date: '2024-04-25', name: 'ANZAC Day', region: ['National'] },
  { date: '2024-06-10', name: 'King\'s Birthday', region: ['NSW', 'VIC', 'QLD', 'SA', 'TAS', 'NT', 'ACT'] },
  { date: '2024-10-07', name: 'Labour Day', region: ['NSW', 'ACT', 'SA'] },
  { date: '2024-12-25', name: 'Christmas Day', region: ['National'] },
  { date: '2024-12-26', name: 'Boxing Day', region: ['National'] },
];

const MOCK_AUSTRALIAN_HOLIDAYS_2025 = [
  { date: '2025-01-01', name: 'New Year\'s Day', region: ['National'] },
  { date: '2025-01-26', name: 'Australia Day', region: ['National'] },
  { date: '2025-04-18', name: 'Good Friday', region: ['National'] },
  { date: '2025-04-21', name: 'Easter Monday', region: ['National'] },
  { date: '2025-04-25', name: 'ANZAC Day', region: ['National'] },
  { date: '2025-06-09', name: 'King\'s Birthday', region: ['NSW', 'VIC', 'QLD', 'SA', 'TAS', 'NT', 'ACT'] },
  { date: '2025-10-06', name: 'Labour Day', region: ['NSW', 'ACT', 'SA'] },
  { date: '2025-12-25', name: 'Christmas Day', region: ['National'] },
  { date: '2025-12-26', name: 'Boxing Day', region: ['National'] },
];

// Business day calculation functions that mirror the database logic
function isWeekend(date: Date): boolean {
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6
}

function isNSWOrNationalHoliday(date: Date, holidays: any[]): boolean {
  const dateStr = format(date, 'yyyy-MM-dd');
  return holidays.some(holiday => {
    return holiday.date === dateStr && 
           (holiday.region.includes('National') || holiday.region.includes('NSW'));
  });
}

function isBusinessDay(date: Date, holidays: any[] = []): boolean {
  if (isWeekend(date)) {
    return false;
  }
  
  if (isNSWOrNationalHoliday(date, holidays)) {
    return false;
  }
  
  return true;
}

function adjustDateToPreviousBusinessDay(date: Date, holidays: any[] = []): { adjustedDate: Date; reason?: string } {
  let currentDate = new Date(date);
  let daysAdjusted = 0;
  let reason: string | undefined;
  
  while (!isBusinessDay(currentDate, holidays) && daysAdjusted < 10) {
    if (isWeekend(currentDate)) {
      if (!reason) reason = 'Adjusted from weekend';
    } else if (isNSWOrNationalHoliday(currentDate, holidays)) {
      const holiday = holidays.find(h => h.date === format(currentDate, 'yyyy-MM-dd'));
      if (!reason) reason = `Adjusted from ${holiday.name}`;
    }
    
    currentDate = addDays(currentDate, -1);
    daysAdjusted++;
  }
  
  return { adjustedDate: currentDate, reason };
}

function adjustDateToNextBusinessDay(date: Date, holidays: any[] = []): { adjustedDate: Date; reason?: string } {
  let currentDate = new Date(date);
  let daysAdjusted = 0;
  let reason: string | undefined;
  
  while (!isBusinessDay(currentDate, holidays) && daysAdjusted < 10) {
    if (isWeekend(currentDate)) {
      if (!reason) reason = 'Adjusted from weekend';
    } else if (isNSWOrNationalHoliday(currentDate, holidays)) {
      const holiday = holidays.find(h => h.date === format(currentDate, 'yyyy-MM-dd'));
      if (!reason) reason = `Adjusted from ${holiday.name}`;
    }
    
    currentDate = addDays(currentDate, 1);
    daysAdjusted++;
  }
  
  return { adjustedDate: currentDate, reason };
}

describe('Australian Business Day Recognition', () => {
  
  describe('Weekend Detection', () => {
    it('should correctly identify weekends', () => {
      // Saturday Jan 6, 2024
      const saturday = new Date(2024, 0, 6);
      expect(isWeekend(saturday)).toBe(true);
      
      // Sunday Jan 7, 2024
      const sunday = new Date(2024, 0, 7);
      expect(isWeekend(sunday)).toBe(true);
    });

    it('should correctly identify weekdays', () => {
      // Monday Jan 8, 2024
      const monday = new Date(2024, 0, 8);
      expect(isWeekend(monday)).toBe(false);
      
      // Friday Jan 12, 2024
      const friday = new Date(2024, 0, 12);
      expect(isWeekend(friday)).toBe(false);
    });
  });

  describe('Australian Holiday Recognition', () => {
    it('should recognize National holidays', () => {
      const newYearsDay = new Date(2024, 0, 1);
      expect(isNSWOrNationalHoliday(newYearsDay, MOCK_AUSTRALIAN_HOLIDAYS_2024)).toBe(true);
      
      const australiaDay = new Date(2024, 0, 26);
      expect(isNSWOrNationalHoliday(australiaDay, MOCK_AUSTRALIAN_HOLIDAYS_2024)).toBe(true);
      
      const anzacDay = new Date(2024, 3, 25);
      expect(isNSWOrNationalHoliday(anzacDay, MOCK_AUSTRALIAN_HOLIDAYS_2024)).toBe(true);
      
      const christmasDay = new Date(2024, 11, 25);
      expect(isNSWOrNationalHoliday(christmasDay, MOCK_AUSTRALIAN_HOLIDAYS_2024)).toBe(true);
    });

    it('should recognize NSW-specific holidays', () => {
      // King's Birthday - varies by state
      const kingsBirthday = new Date(2024, 5, 10); // June 10, 2024
      expect(isNSWOrNationalHoliday(kingsBirthday, MOCK_AUSTRALIAN_HOLIDAYS_2024)).toBe(true);
      
      // Labour Day - NSW specific date
      const labourDay = new Date(2024, 9, 7); // Oct 7, 2024
      expect(isNSWOrNationalHoliday(labourDay, MOCK_AUSTRALIAN_HOLIDAYS_2024)).toBe(true);
    });

    it('should NOT recognize non-NSW state holidays', () => {
      // Create a mock WA-only holiday
      const mockWAHoliday = [
        { date: '2024-06-03', name: 'WA Day', region: ['WA'] }
      ];
      
      const waDay = new Date(2024, 5, 3);
      expect(isNSWOrNationalHoliday(waDay, mockWAHoliday)).toBe(false);
    });

    it('should handle regular business days', () => {
      const regularTuesday = new Date(2024, 0, 9); // Jan 9, 2024
      expect(isNSWOrNationalHoliday(regularTuesday, MOCK_AUSTRALIAN_HOLIDAYS_2024)).toBe(false);
    });
  });

  describe('Business Day Calculation', () => {
    it('should identify regular business days correctly', () => {
      const tuesday = new Date(2024, 0, 9); // Jan 9, 2024
      expect(isBusinessDay(tuesday, MOCK_AUSTRALIAN_HOLIDAYS_2024)).toBe(true);
      
      const friday = new Date(2024, 0, 12); // Jan 12, 2024
      expect(isBusinessDay(friday, MOCK_AUSTRALIAN_HOLIDAYS_2024)).toBe(true);
    });

    it('should exclude weekends', () => {
      const saturday = new Date(2024, 0, 6);
      expect(isBusinessDay(saturday, MOCK_AUSTRALIAN_HOLIDAYS_2024)).toBe(false);
      
      const sunday = new Date(2024, 0, 7);
      expect(isBusinessDay(sunday, MOCK_AUSTRALIAN_HOLIDAYS_2024)).toBe(false);
    });

    it('should exclude holidays', () => {
      const newYearsDay = new Date(2024, 0, 1);
      expect(isBusinessDay(newYearsDay, MOCK_AUSTRALIAN_HOLIDAYS_2024)).toBe(false);
      
      const christmasDay = new Date(2024, 11, 25);
      expect(isBusinessDay(christmasDay, MOCK_AUSTRALIAN_HOLIDAYS_2024)).toBe(false);
    });
  });
});

describe('Business Day Adjustment Logic', () => {
  
  describe('Previous Business Day Adjustment', () => {
    it('should adjust Saturday to Friday', () => {
      const saturday = new Date(2024, 0, 6); // Jan 6, 2024 (Saturday)
      const expected = new Date(2024, 0, 5); // Jan 5, 2024 (Friday)
      
      const result = adjustDateToPreviousBusinessDay(saturday, MOCK_AUSTRALIAN_HOLIDAYS_2024);
      
      expect(result.adjustedDate.getTime()).toBe(expected.getTime());
      expect(result.reason).toBe('Adjusted from weekend');
    });

    it('should adjust Sunday to Friday', () => {
      const sunday = new Date(2024, 0, 7); // Jan 7, 2024 (Sunday)
      const expected = new Date(2024, 0, 5); // Jan 5, 2024 (Friday)
      
      const result = adjustDateToPreviousBusinessDay(sunday, MOCK_AUSTRALIAN_HOLIDAYS_2024);
      
      expect(result.adjustedDate.getTime()).toBe(expected.getTime());
      expect(result.reason).toBe('Adjusted from weekend');
    });

    it('should adjust New Year\'s Day to previous business day', () => {
      const newYearsDay = new Date(2024, 0, 1); // Jan 1, 2024 (Monday, Holiday)
      const expected = new Date(2023, 11, 29); // Dec 29, 2023 (Friday)
      
      const result = adjustDateToPreviousBusinessDay(newYearsDay, MOCK_AUSTRALIAN_HOLIDAYS_2024);
      
      expect(result.adjustedDate.getTime()).toBe(expected.getTime());
      expect(result.reason).toBe('Adjusted from New Year\'s Day');
    });

    it('should handle consecutive holidays correctly', () => {
      // Christmas Day 2024 is Wednesday, Boxing Day is Thursday
      const christmasDay = new Date(2024, 11, 25); // Dec 25, 2024
      const expected = new Date(2024, 11, 24); // Dec 24, 2024 (Tuesday)
      
      const result = adjustDateToPreviousBusinessDay(christmasDay, MOCK_AUSTRALIAN_HOLIDAYS_2024);
      
      expect(result.adjustedDate.getTime()).toBe(expected.getTime());
      expect(result.reason).toBe('Adjusted from Christmas Day');
    });

    it('should not adjust business days', () => {
      const tuesday = new Date(2024, 0, 9); // Jan 9, 2024 (Tuesday)
      
      const result = adjustDateToPreviousBusinessDay(tuesday, MOCK_AUSTRALIAN_HOLIDAYS_2024);
      
      expect(result.adjustedDate.getTime()).toBe(tuesday.getTime());
      expect(result.reason).toBeUndefined();
    });
  });

  describe('Next Business Day Adjustment', () => {
    it('should adjust Saturday to Monday', () => {
      const saturday = new Date(2024, 0, 6); // Jan 6, 2024 (Saturday)
      const expected = new Date(2024, 0, 8); // Jan 8, 2024 (Monday)
      
      const result = adjustDateToNextBusinessDay(saturday, MOCK_AUSTRALIAN_HOLIDAYS_2024);
      
      expect(result.adjustedDate.getTime()).toBe(expected.getTime());
      expect(result.reason).toBe('Adjusted from weekend');
    });

    it('should adjust Sunday to Monday', () => {
      const sunday = new Date(2024, 0, 7); // Jan 7, 2024 (Sunday)
      const expected = new Date(2024, 0, 8); // Jan 8, 2024 (Monday)
      
      const result = adjustDateToNextBusinessDay(sunday, MOCK_AUSTRALIAN_HOLIDAYS_2024);
      
      expect(result.adjustedDate.getTime()).toBe(expected.getTime());
      expect(result.reason).toBe('Adjusted from weekend');
    });

    it('should adjust holidays to next business day', () => {
      const newYearsDay = new Date(2024, 0, 1); // Jan 1, 2024 (Monday, Holiday)
      const expected = new Date(2024, 0, 2); // Jan 2, 2024 (Tuesday)
      
      const result = adjustDateToNextBusinessDay(newYearsDay, MOCK_AUSTRALIAN_HOLIDAYS_2024);
      
      expect(result.adjustedDate.getTime()).toBe(expected.getTime());
      expect(result.reason).toBe('Adjusted from New Year\'s Day');
    });

    it('should handle weekend followed by holiday', () => {
      // If Australia Day (Jan 26) falls on weekend, find next business day
      // In 2025, Australia Day is a Sunday
      const australiaDay2025 = new Date(2025, 0, 26); // Jan 26, 2025 (Sunday)
      const expected = new Date(2025, 0, 27); // Jan 27, 2025 (Monday)
      
      const result = adjustDateToNextBusinessDay(australiaDay2025, MOCK_AUSTRALIAN_HOLIDAYS_2025);
      
      expect(result.adjustedDate.getTime()).toBe(expected.getTime());
    });
  });
});

describe('Payroll-specific Business Day Scenarios', () => {
  
  describe('EFT Processing Rules', () => {
    it('should handle payroll dates falling on Good Friday', () => {
      // Good Friday 2024: March 29
      const goodFriday = new Date(2024, 2, 29);
      
      // For most payroll types, adjust to previous business day
      const prevResult = adjustDateToPreviousBusinessDay(goodFriday, MOCK_AUSTRALIAN_HOLIDAYS_2024);
      expect(prevResult.adjustedDate.getTime()).toBe(new Date(2024, 2, 28).getTime()); // Thursday
      expect(prevResult.reason).toBe('Adjusted from Good Friday');
      
      // For SOM (Start of Month) types, adjust to next business day
      const nextResult = adjustDateToNextBusinessDay(goodFriday, MOCK_AUSTRALIAN_HOLIDAYS_2024);
      expect(nextResult.adjustedDate.getTime()).toBe(new Date(2024, 3, 2).getTime()); // Tuesday (after Easter Monday)
    });

    it('should handle ANZAC Day processing', () => {
      // ANZAC Day 2024: April 25 (Thursday)
      const anzacDay = new Date(2024, 3, 25);
      
      const result = adjustDateToPreviousBusinessDay(anzacDay, MOCK_AUSTRALIAN_HOLIDAYS_2024);
      expect(result.adjustedDate.getTime()).toBe(new Date(2024, 3, 24).getTime()); // Wednesday
      expect(result.reason).toBe('Adjusted from ANZAC Day');
    });

    it('should handle King\'s Birthday variations', () => {
      // King's Birthday NSW 2024: June 10 (Monday)
      const kingsBirthday = new Date(2024, 5, 10);
      
      const result = adjustDateToPreviousBusinessDay(kingsBirthday, MOCK_AUSTRALIAN_HOLIDAYS_2024);
      expect(result.adjustedDate.getTime()).toBe(new Date(2024, 5, 7).getTime()); // Friday
      expect(result.reason).toBe('Adjusted from King\'s Birthday');
    });

    it('should handle Christmas/Boxing Day period', () => {
      // Christmas Day 2024: December 25 (Wednesday)
      const christmasDay = new Date(2024, 11, 25);
      const boxingDay = new Date(2024, 11, 26); // Thursday
      
      // Christmas adjustment
      const christmasResult = adjustDateToPreviousBusinessDay(christmasDay, MOCK_AUSTRALIAN_HOLIDAYS_2024);
      expect(christmasResult.adjustedDate.getTime()).toBe(new Date(2024, 11, 24).getTime()); // Tuesday
      
      // Boxing Day adjustment
      const boxingResult = adjustDateToPreviousBusinessDay(boxingDay, MOCK_AUSTRALIAN_HOLIDAYS_2024);
      expect(boxingResult.adjustedDate.getTime()).toBe(new Date(2024, 11, 24).getTime()); // Tuesday
    });
  });

  describe('Long Weekend Scenarios', () => {
    it('should handle Easter long weekend', () => {
      // Easter 2024: Good Friday (29 Mar), Easter Monday (1 Apr)
      const goodFriday = new Date(2024, 2, 29);
      const easterMonday = new Date(2024, 3, 1);
      
      // Any date in this period should adjust properly
      const fridayResult = adjustDateToNextBusinessDay(goodFriday, MOCK_AUSTRALIAN_HOLIDAYS_2024);
      expect(fridayResult.adjustedDate.getTime()).toBe(new Date(2024, 3, 2).getTime()); // Tuesday
      
      const mondayResult = adjustDateToNextBusinessDay(easterMonday, MOCK_AUSTRALIAN_HOLIDAYS_2024);
      expect(mondayResult.adjustedDate.getTime()).toBe(new Date(2024, 3, 2).getTime()); // Tuesday
    });

    it('should handle Queen\'s/King\'s Birthday long weekends', () => {
      // King's Birthday 2024 NSW: June 10 (Monday)
      // This creates a 3-day weekend (Sat-Sun-Mon)
      const kingsBirthday = new Date(2024, 5, 10);
      const saturday = new Date(2024, 5, 8);
      const sunday = new Date(2024, 5, 9);
      
      // All should adjust to either Friday (previous) or Tuesday (next)
      const satResult = adjustDateToPreviousBusinessDay(saturday, MOCK_AUSTRALIAN_HOLIDAYS_2024);
      expect(satResult.adjustedDate.getTime()).toBe(new Date(2024, 5, 7).getTime()); // Friday
      
      const mondayResult = adjustDateToNextBusinessDay(kingsBirthday, MOCK_AUSTRALIAN_HOLIDAYS_2024);
      expect(mondayResult.adjustedDate.getTime()).toBe(new Date(2024, 5, 11).getTime()); // Tuesday
    });
  });

  describe('Year Boundary Processing', () => {
    it('should handle New Year period correctly', () => {
      // Dec 31, 2023 (Sunday) -> Jan 1, 2024 (Monday, Holiday)
      const newYearEve = new Date(2023, 11, 31); // Sunday
      const newYearDay = new Date(2024, 0, 1);   // Monday Holiday
      
      // New Year's Eve (Sunday) should go to Friday
      const eveResult = adjustDateToPreviousBusinessDay(newYearEve, MOCK_AUSTRALIAN_HOLIDAYS_2024);
      expect(eveResult.adjustedDate.getTime()).toBe(new Date(2023, 11, 29).getTime()); // Friday Dec 29
      
      // New Year's Day should go to Tuesday
      const dayResult = adjustDateToNextBusinessDay(newYearDay, MOCK_AUSTRALIAN_HOLIDAYS_2024);
      expect(dayResult.adjustedDate.getTime()).toBe(new Date(2024, 0, 2).getTime()); // Tuesday Jan 2
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should prevent infinite loops in adjustment', () => {
      // Test with a date and ensure we don't loop forever
      const testDate = new Date(2024, 0, 6); // Saturday
      const result = adjustDateToPreviousBusinessDay(testDate, MOCK_AUSTRALIAN_HOLIDAYS_2024);
      
      // Should find Friday within reasonable iterations
      expect(result.adjustedDate).toBeDefined();
      expect(isBusinessDay(result.adjustedDate, MOCK_AUSTRALIAN_HOLIDAYS_2024)).toBe(true);
    });

    it('should handle empty holiday arrays gracefully', () => {
      const saturday = new Date(2024, 0, 6);
      
      const result = adjustDateToPreviousBusinessDay(saturday, []);
      expect(result.adjustedDate.getTime()).toBe(new Date(2024, 0, 5).getTime()); // Friday
      expect(result.reason).toBe('Adjusted from weekend');
    });

    it('should work with business days that need no adjustment', () => {
      const tuesday = new Date(2024, 0, 9);
      
      const prevResult = adjustDateToPreviousBusinessDay(tuesday, MOCK_AUSTRALIAN_HOLIDAYS_2024);
      expect(prevResult.adjustedDate.getTime()).toBe(tuesday.getTime());
      expect(prevResult.reason).toBeUndefined();
      
      const nextResult = adjustDateToNextBusinessDay(tuesday, MOCK_AUSTRALIAN_HOLIDAYS_2024);
      expect(nextResult.adjustedDate.getTime()).toBe(tuesday.getTime());
      expect(nextResult.reason).toBeUndefined();
    });
  });
});