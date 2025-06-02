# Payroll Processing Documentation

This document provides comprehensive information about the payroll processing system, business rules, and calculation logic in Payroll-ByteMy.

## Table of Contents

- [Overview](#overview)
- [Payroll Frequencies](#payroll-frequencies)
- [Date Calculation Rules](#date-calculation-rules)
- [Business Day Adjustments](business-day-adjustments)
- [EFT Processing](#eft-processing)
- [Payroll Lifecycle](#payroll-lifecycle)
- [Calculation Engine](#calculation-engine)
- [Holiday Management](#holiday-management)
- [Error Handling](#error-handling)

## Overview

The Payroll-ByteMy system handles complex payroll processing with support for multiple frequencies, intelligent date calculations, and business day adjustments. The system is designed to accommodate various business requirements while maintaining accuracy and compliance.

### Key Features

- **Multiple Payroll Frequencies**: Weekly, fortnightly, bi-monthly, monthly, and quarterly
- **Intelligent Date Calculations**: Automatic business day adjustments
- **Holiday Awareness**: Integration with holiday calendars
- **EFT Processing**: Electronic funds transfer with configurable lead times
- **Audit Trail**: Complete tracking of payroll changes and approvals

## Payroll Frequencies

### 1. Weekly Payroll

Weekly payrolls are processed on a specific day of the week.

**Configuration:**

- **Frequency**: `weekly`
- **Date Type**: Day of Week (DOW)
- **Date Value**: 1-7 (Sunday=1, Monday=2, ..., Saturday=7)
- **Business Day Rule**: Previous Business Day

**Example:**

```typescript
const weeklyConfig = {
  frequency: "weekly",
  dateType: "DOW",
  dateValue: 5, // Friday
  businessDayRule: "previous",
};
```

**Calculation Logic:**

```typescript
function calculateWeeklyPayDates(
  config: WeeklyConfig,
  year: number
): PayDate[] {
  const payDates: PayDate[] = [];
  const startDate = new Date(year, 0, 1);

  // Find first occurrence of the target day
  let currentDate = findNextDayOfWeek(startDate, config.dateValue);

  while (currentDate.getFullYear() === year) {
    const adjustedDate = adjustForBusinessDay(
      currentDate,
      config.businessDayRule
    );
    payDates.push({
      payDate: adjustedDate,
      payPeriodStart: subDays(adjustedDate, 6),
      payPeriodEnd: adjustedDate,
    });

    currentDate = addWeeks(currentDate, 1);
  }

  return payDates;
}
```

### 2. Fortnightly Payroll

Fortnightly payrolls are processed every two weeks on a specific day.

**Configuration:**

- **Frequency**: `fortnightly`
- **Date Type**: Day of Week (DOW)
- **Date Value**: 1-7 (Sunday-Saturday)
- **Week Assignment**: Week A or Week B (based on first week of January)
- **Business Day Rule**: Previous Business Day

**Example:**

```typescript
const fortnightlyConfig = {
  frequency: "fortnightly",
  dateType: "DOW",
  dateValue: 5, // Friday
  weekAssignment: "A", // or 'B'
  businessDayRule: "previous",
};
```

**Calculation Logic:**

```typescript
function calculateFortnightlyPayDates(
  config: FortnightlyConfig,
  year: number
): PayDate[] {
  const payDates: PayDate[] = [];
  const startDate = new Date(year, 0, 1);

  // Determine if first week is Week A or Week B
  const firstWeekType = getWeekType(startDate);
  let currentDate = findNextDayOfWeek(startDate, config.dateValue);

  // Adjust to correct week assignment
  if (firstWeekType !== config.weekAssignment) {
    currentDate = addWeeks(currentDate, 1);
  }

  while (currentDate.getFullYear() === year) {
    const adjustedDate = adjustForBusinessDay(
      currentDate,
      config.businessDayRule
    );
    payDates.push({
      payDate: adjustedDate,
      payPeriodStart: subDays(adjustedDate, 13),
      payPeriodEnd: adjustedDate,
    });

    currentDate = addWeeks(currentDate, 2);
  }

  return payDates;
}
```

### 3. Bi-Monthly Payroll

Bi-monthly payrolls are processed twice per month with specific date rules.

**Configuration:**

- **Frequency**: `bi_monthly`
- **Date Types**:
  - Start of Month (SOM): 1st and 15th with Next Business Day rule
  - End of Month (EOM): 30th and 15th with Previous Business Day rule
- **February Exception**: Use 14th instead of 15th

**Example:**

```typescript
const biMonthlyConfig = {
  frequency: "bi_monthly",
  dateType: "SOM", // or 'EOM'
  businessDayRule: "next", // for SOM, 'previous' for EOM
};
```

**Calculation Logic:**

```typescript
function calculateBiMonthlyPayDates(
  config: BiMonthlyConfig,
  year: number
): PayDate[] {
  const payDates: PayDate[] = [];

  for (let month = 0; month < 12; month++) {
    if (config.dateType === "SOM") {
      // 1st and 15th (or 14th for February)
      const firstDate = new Date(year, month, 1);
      const fifteenthDate = new Date(year, month, month === 1 ? 14 : 15);

      payDates.push({
        payDate: adjustForBusinessDay(firstDate, "next"),
        payPeriodStart: subDays(firstDate, 15),
        payPeriodEnd: subDays(firstDate, 1),
      });

      payDates.push({
        payDate: adjustForBusinessDay(fifteenthDate, "next"),
        payPeriodStart: firstDate,
        payPeriodEnd: subDays(fifteenthDate, 1),
      });
    } else {
      // EOM: 30th and 15th with previous business day
      const fifteenthDate = new Date(year, month, month === 1 ? 14 : 15);
      const thirtiethDate = new Date(year, month, 30);

      payDates.push({
        payDate: adjustForBusinessDay(fifteenthDate, "previous"),
        payPeriodStart: new Date(year, month, 1),
        payPeriodEnd: fifteenthDate,
      });

      payDates.push({
        payDate: adjustForBusinessDay(thirtiethDate, "previous"),
        payPeriodStart: addDays(fifteenthDate, 1),
        payPeriodEnd: endOfMonth(new Date(year, month, 1)),
      });
    }
  }

  return payDates.sort((a, b) => a.payDate.getTime() - b.payDate.getTime());
}
```

### 4. Monthly Payroll

Monthly payrolls are processed once per month with flexible date options.

**Configuration:**

- **Frequency**: `monthly`
- **Date Types**:
  - Start of Month (SOM): Uses Next Business Day rule
  - End of Month (EOM): Uses Previous Business Day rule
  - Fixed Date: Uses Previous Business Day rule
- **Date Value**: Day of month for Fixed Date type

**Example:**

```typescript
const monthlyConfig = {
  frequency: "monthly",
  dateType: "fixed", // 'SOM', 'EOM', or 'fixed'
  dateValue: 15, // Only used for fixed date
  businessDayRule: "previous",
};
```

### 5. Quarterly Payroll

Quarterly payrolls are processed four times per year (March, June, September, December).

**Configuration:**

- **Frequency**: `quarterly`
- **Date Types**: Same as Monthly Payroll
- **Months**: March (2), June (5), September (8), December (11)

## Date Calculation Rules

### Business Day Adjustment Rules

#### Previous Business Day

If the calculated pay date falls on a weekend or holiday, move to the previous business day.

```typescript
function adjustToPreviousBusinessDay(date: Date): Date {
  let adjustedDate = new Date(date);

  while (isWeekend(adjustedDate) || isHoliday(adjustedDate)) {
    adjustedDate = subDays(adjustedDate, 1);
  }

  return adjustedDate;
}
```

#### Next Business Day

If the calculated pay date falls on a weekend or holiday, move to the next business day.

```typescript
function adjustToNextBusinessDay(date: Date): Date {
  let adjustedDate = new Date(date);

  while (isWeekend(adjustedDate) || isHoliday(adjustedDate)) {
    adjustedDate = addDays(adjustedDate, 1);
  }

  return adjustedDate;
}
```

### Holiday Considerations

The system integrates with holiday calendars to ensure accurate business day calculations:

```typescript
function isHoliday(
  date: Date,
  country: string = "AU",
  state?: string
): boolean {
  const holidays = getHolidaysForDate(date, country, state);
  return holidays.some(
    (holiday) => isSameDay(holiday.date, date) && holiday.isObserved
  );
}
```

## EFT Processing

### Processing Lead Time

EFT (Electronic Funds Transfer) processing requires advance notice to financial institutions.

**Configuration:**

- `processing_days_before_eft`: Number of days before EFT date that processing must occur
- Default: 2 business days

**Calculation Logic:**

```typescript
function calculateEFTDate(payDate: Date, processingDays: number = 2): Date {
  let eftDate = new Date(payDate);

  // Add processing days
  for (let i = 0; i < processingDays; i++) {
    eftDate = addDays(eftDate, 1);

    // Skip weekends and holidays
    while (isWeekend(eftDate) || isHoliday(eftDate)) {
      eftDate = addDays(eftDate, 1);
    }
  }

  return eftDate;
}

function calculateProcessingDate(
  eftDate: Date,
  processingDays: number = 2
): Date {
  let processingDate = new Date(eftDate);

  // Subtract processing days
  for (let i = 0; i < processingDays; i++) {
    processingDate = subDays(processingDate, 1);

    // Skip weekends and holidays (move to previous business day)
    while (isWeekend(processingDate) || isHoliday(processingDate)) {
      processingDate = subDays(processingDate, 1);
    }
  }

  return processingDate;
}
```

### EFT Date Adjustment

When EFT dates are changed, processing dates must be recalculated:

```typescript
function adjustPayrollForEFTChange(
  payroll: Payroll,
  newEFTDate: Date
): Payroll {
  const newProcessingDate = calculateProcessingDate(
    newEFTDate,
    payroll.client.processingDaysBeforeEFT
  );

  return {
    ...payroll,
    eftDate: newEFTDate,
    processingDate: newProcessingDate,
    updatedAt: new Date(),
  };
}
```

## Payroll Lifecycle

### Payroll States

```typescript
enum PayrollStatus {
  DRAFT = "draft",
  PENDING = "pending",
  PROCESSING = "processing",
  PROCESSED = "processed",
  APPROVED = "approved",
  PAID = "paid",
  CANCELLED = "cancelled",
}
```

### State Transitions

```typescript
const allowedTransitions: Record<PayrollStatus, PayrollStatus[]> = {
  [PayrollStatus.DRAFT]: [PayrollStatus.PENDING, PayrollStatus.CANCELLED],
  [PayrollStatus.PENDING]: [
    PayrollStatus.PROCESSING,
    PayrollStatus.DRAFT,
    PayrollStatus.CANCELLED,
  ],
  [PayrollStatus.PROCESSING]: [PayrollStatus.PROCESSED, PayrollStatus.PENDING],
  [PayrollStatus.PROCESSED]: [PayrollStatus.APPROVED, PayrollStatus.PROCESSING],
  [PayrollStatus.APPROVED]: [PayrollStatus.PAID, PayrollStatus.PROCESSED],
  [PayrollStatus.PAID]: [], // Terminal state
  [PayrollStatus.CANCELLED]: [PayrollStatus.DRAFT], // Can be reactivated
};
```

### Workflow Implementation

```typescript
class PayrollWorkflow {
  async transitionTo(
    payroll: Payroll,
    newStatus: PayrollStatus,
    userId: string
  ): Promise<Payroll> {
    // Validate transition
    if (!this.canTransition(payroll.status, newStatus)) {
      throw new Error(
        `Cannot transition from ${payroll.status} to ${newStatus}`
      );
    }

    // Perform status-specific actions
    switch (newStatus) {
      case PayrollStatus.PROCESSING:
        await this.startProcessing(payroll);
        break;
      case PayrollStatus.APPROVED:
        await this.approvePayroll(payroll, userId);
        break;
      case PayrollStatus.PAID:
        await this.markAsPaid(payroll);
        break;
    }

    // Update payroll status
    return await this.updatePayrollStatus(payroll.id, newStatus, userId);
  }

  private canTransition(
    currentStatus: PayrollStatus,
    newStatus: PayrollStatus
  ): boolean {
    return allowedTransitions[currentStatus].includes(newStatus);
  }
}
```

## Calculation Engine

### Pay Calculation

```typescript
interface PayCalculation {
  grossPay: number;
  taxAmount: number;
  superannuation: number;
  otherDeductions: number;
  netPay: number;
}

class PayCalculator {
  calculatePay(
    staff: Staff,
    hours: number,
    overtimeHours: number = 0
  ): PayCalculation {
    const grossPay = this.calculateGrossPay(staff, hours, overtimeHours);
    const taxAmount = this.calculateTax(grossPay, staff.taxFileNumber);
    const superannuation = this.calculateSuperannuation(grossPay);
    const otherDeductions = this.calculateOtherDeductions(staff, grossPay);
    const netPay = grossPay - taxAmount - otherDeductions;

    return {
      grossPay,
      taxAmount,
      superannuation,
      otherDeductions,
      netPay,
    };
  }

  private calculateGrossPay(
    staff: Staff,
    hours: number,
    overtimeHours: number
  ): number {
    const regularPay = hours * staff.payRate;
    const overtimePay = overtimeHours * staff.payRate * 1.5; // 1.5x for overtime

    return regularPay + overtimePay;
  }

  private calculateTax(grossPay: number, tfn?: string): number {
    if (!tfn) {
      // No TFN - highest tax rate
      return grossPay * 0.47;
    }

    // Australian tax brackets (simplified)
    if (grossPay <= 18200) return 0;
    if (grossPay <= 45000) return (grossPay - 18200) * 0.19;
    if (grossPay <= 120000) return 5092 + (grossPay - 45000) * 0.325;
    if (grossPay <= 180000) return 29467 + (grossPay - 120000) * 0.37;

    return 51667 + (grossPay - 180000) * 0.45;
  }

  private calculateSuperannuation(grossPay: number): number {
    return grossPay * 0.105; // 10.5% superannuation guarantee
  }
}
```

### Batch Processing

```typescript
class BatchPayrollProcessor {
  async processBatch(payrollId: string): Promise<ProcessingResult> {
    const payroll = await this.getPayroll(payrollId);
    const staff = await this.getPayrollStaff(payrollId);
    const results: PayrollItem[] = [];

    for (const employee of staff) {
      try {
        const calculation = this.payCalculator.calculatePay(
          employee,
          employee.hoursWorked,
          employee.overtimeHours
        );

        const payrollItem = await this.createPayrollItem(
          payroll.id,
          employee.id,
          calculation
        );
        results.push(payrollItem);
      } catch (error) {
        console.error(
          `Error processing pay for employee ${employee.id}:`,
          error
        );
        // Continue processing other employees
      }
    }

    // Update payroll totals
    await this.updatePayrollTotals(payroll.id, results);

    return {
      success: true,
      processedCount: results.length,
      totalAmount: results.reduce((sum, item) => sum + item.netPay, 0),
    };
  }
}
```

## Holiday Management

### Holiday Integration

```typescript
interface Holiday {
  date: Date;
  name: string;
  country: string;
  state?: string;
  type: "public" | "bank" | "regional" | "custom";
  isObserved: boolean;
}

class HolidayService {
  async syncHolidays(year: number, country: string = "AU"): Promise<void> {
    const holidays = await this.fetchHolidaysFromAPI(year, country);

    for (const holiday of holidays) {
      await this.upsertHoliday(holiday);
    }
  }

  async getHolidaysForPeriod(
    startDate: Date,
    endDate: Date,
    country: string = "AU"
  ): Promise<Holiday[]> {
    return await this.holidayRepository.findByDateRange(
      startDate,
      endDate,
      country
    );
  }

  isBusinessDay(date: Date, country: string = "AU", state?: string): boolean {
    if (isWeekend(date)) return false;

    const holidays = this.getHolidaysForDate(date, country, state);
    return !holidays.some((holiday) => holiday.isObserved);
  }
}
```

## Error Handling

### Validation Rules

```typescript
class PayrollValidator {
  validatePayrollDates(payroll: Payroll): ValidationResult {
    const errors: string[] = [];

    // Pay period validation
    if (payroll.payPeriodStart >= payroll.payPeriodEnd) {
      errors.push("Pay period start must be before pay period end");
    }

    // Pay date validation
    if (payroll.payDate < payroll.payPeriodEnd) {
      errors.push("Pay date must be after pay period end");
    }

    // EFT date validation
    if (payroll.eftDate && payroll.eftDate < payroll.payDate) {
      errors.push("EFT date must be after pay date");
    }

    // Business day validation
    if (!this.holidayService.isBusinessDay(payroll.payDate)) {
      errors.push("Pay date must be a business day");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
```

### Error Recovery

```typescript
class PayrollErrorHandler {
  async handleProcessingError(payrollId: string, error: Error): Promise<void> {
    // Log error
    await this.logError(payrollId, error);

    // Revert payroll to previous state
    await this.revertPayrollStatus(payrollId, PayrollStatus.PENDING);

    // Notify administrators
    await this.notifyAdministrators(payrollId, error);

    // Create error report
    await this.createErrorReport(payrollId, error);
  }
}
```

---

For more information, see:

- [Date Calculations Documentation](./date-calculations.md)
- [Holiday Management Documentation](./holiday-management.md)
- [API Documentation](../../src/app/api/README.md)
- [Database Schema](../../hasura/README.md)
