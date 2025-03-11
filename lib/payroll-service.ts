// lib/payroll-service.ts
import { db } from "./db";
import { payrolls, clients, staff } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { 
  addDays, 
  addWeeks, 
  addMonths, 
  addQuarters,
  lastDayOfMonth, 
  setDate 
} from "date-fns";
import { adjustDate, calculatePayrollDates, type Holiday } from "./date-utils";

// Define payroll cycle types
export const CYCLE_TYPES = {
  WEEKLY: 1,
  FORTNIGHTLY: 2,
  MONTHLY_SPECIFIC_DAY: 3,
  MONTHLY_LAST_DAY: 4,
  QUARTERLY: 5,
};

// Define date types
export const DATE_TYPES = {
  SPECIFIC_DAY: 1,
  LAST_DAY: 2,
  DAY_OF_WEEK: 3,
};

export async function getPayrollById(id: number) {
  return db.query.payrolls.findFirst({
    where: eq(payrolls.id, id),
    with: {
      client: true,
      primaryConsultant: true,
      backupConsultant: true,
      manager: true,
    },
  });
}

/**
 * Get holidays for a specific date range
 */
export async function getHolidays(startDate: Date, endDate: Date): Promise<Holiday[]> {
  // In a real implementation, you would fetch holidays from your database
  // For now, return a sample list
  return [
    { date: new Date(2025, 0, 1), name: "New Year's Day", isPublic: true },
    { date: new Date(2025, 0, 26), name: "Australia Day", isPublic: true },
    { date: new Date(2025, 3, 18), name: "Good Friday", isPublic: true },
    { date: new Date(2025, 3, 21), name: "Easter Monday", isPublic: true },
    { date: new Date(2025, 4, 25), name: "ANZAC Day", isPublic: true },
    { date: new Date(2025, 11, 25), name: "Christmas Day", isPublic: true },
    { date: new Date(2025, 11, 26), name: "Boxing Day", isPublic: true },
  ];
}

/**
 * Generate payroll schedule for the next several periods
 */
export async function generatePayrollSchedule(
  payrollId: number,
  startDate: Date,
  periodsToGenerate: number = 12
) {
  const payroll = await getPayrollById(payrollId);
  if (!payroll) throw new Error("Payroll not found");
  
  const results = [];
  const holidays = await getHolidays(startDate, addMonths(startDate, 12));
  
  let currentDate = new Date(startDate);
  
  for (let i = 0; i < periodsToGenerate; i++) {
    // Calculate the next date based on cycle type
    if (i > 0) {
      switch (payroll.cycle_id) {
        case CYCLE_TYPES.WEEKLY:
          currentDate = addWeeks(currentDate, 1);
          break;
        case CYCLE_TYPES.FORTNIGHTLY:
          currentDate = addWeeks(currentDate, 2);
          break;
        case CYCLE_TYPES.MONTHLY_SPECIFIC_DAY:
        case CYCLE_TYPES.MONTHLY_LAST_DAY:
          currentDate = addMonths(currentDate, 1);
          break;
        case CYCLE_TYPES.QUARTERLY:
          currentDate = addQuarters(currentDate, 1);
          break;
      }

      // Handle special date types
      if (payroll.date_type_id === DATE_TYPES.LAST_DAY) {
        currentDate = lastDayOfMonth(currentDate);
      } else if (payroll.date_type_id === DATE_TYPES.SPECIFIC_DAY && payroll.date_value) {
        // Set to a specific day of month, e.g., "15" for 15th
        const dayOfMonth = parseInt(payroll.date_value);
        currentDate = setDate(currentDate, dayOfMonth);
      }
    }
    
    // Calculate processing and EFT dates
    const { eftDate, processingDate } = calculatePayrollDates(
      currentDate,
      payroll.cycle_id.toString(),
      payroll.processing_days_before_eft,
      "previous", // Default rule
      holidays
    );
    
    results.push({
      payrollId: payroll.id,
      payrollName: payroll.name,
      clientName: payroll.client.name,
      periodNumber: i + 1,
      baseDate: new Date(currentDate),
      processingDate,
      eftDate,
    });
  }
  
  return results;
}