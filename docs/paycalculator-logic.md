# PayCalculator Logic Documentation

This document outlines the pay calculation logic implemented in the Payroll-ByteMy system, including Australian tax calculations, superannuation, and payroll tax calculations.

## Table of Contents

- [Overview](#overview)
- [Australian Income Tax Calculation](#australian-income-tax-calculation)
- [Superannuation Calculation](#superannuation-calculation)
- [State Payroll Tax Calculation](#state-payroll-tax-calculation)
- [Net Pay Calculation](#net-pay-calculation)
- [Implementation Details](#implementation-details)
- [Future Enhancements](#future-enhancements)

## Overview

The PayCalculator system handles complex Australian payroll calculations including:

- **Income Tax**: Based on Australian Tax Office (ATO) tax brackets
- **Superannuation**: Mandatory employer contributions
- **State Payroll Tax**: State-specific payroll taxes for businesses
- **Net Pay**: Final take-home pay after all deductions

## Australian Income Tax Calculation

### Tax Brackets (2023-2024)

The system implements the current Australian tax brackets:

```typescript
export function calculateIncomeTax(annualIncome: number): number {
  // 2023-2024 Australian Tax Brackets
  if (annualIncome <= 18200) {
    return 0; // Tax-free threshold
  } else if (annualIncome <= 45000) {
    return (annualIncome - 18200) * 0.19; // 19% on income over $18,200
  } else if (annualIncome <= 120000) {
    return 5092 + (annualIncome - 45000) * 0.325; // 32.5% on income over $45,000
  } else if (annualIncome <= 180000) {
    return 29467 + (annualIncome - 120000) * 0.37; // 37% on income over $120,000
  } else {
    return 51667 + (annualIncome - 180000) * 0.45; // 45% on income over $180,000
  }
}
```

### Tax Calculation Examples

| Annual Income | Tax Calculation                       | Total Tax |
| ------------- | ------------------------------------- | --------- |
| $18,000       | $0 (tax-free threshold)               | $0        |
| $30,000       | ($30,000 - $18,200) × 19%             | $2,242    |
| $90,000       | $5,092 + ($90,000 - $45,000) × 32.5%  | $19,717   |
| $150,000      | $29,467 + ($150,000 - $120,000) × 37% | $40,567   |
| $200,000      | $51,667 + ($200,000 - $180,000) × 45% | $60,667   |

## Superannuation Calculation

### Current Rate (2023-2024)

```typescript
export function calculateSuperannuation(salary: number): number {
  return salary * 0.11; // 11% superannuation guarantee
}
```

### Superannuation Details

- **Rate**: 11% of ordinary time earnings (as of 2023-2024)
- **Minimum Threshold**: $450 per month
- **Maximum Contribution Base**: $64,270 per quarter (2023-2024)
- **Payment Frequency**: Quarterly (due 28 days after quarter end)

## State Payroll Tax Calculation

### State Rates and Thresholds

```typescript
const statePayrollTaxRates: Record<string, number> = {
  NSW: 0.0545, // 5.45%
  VIC: 0.0485, // 4.85%
  QLD: 0.0475, // 4.75%
  SA: 0.05, // 5.0%
  WA: 0.06, // 6.0%
  TAS: 0.045, // 4.5%
  NT: 0.055, // 5.5%
  ACT: 0.065, // 6.5%
};

const payrollTaxThresholds: Record<string, number> = {
  NSW: 1200000, // $1.2M
  VIC: 700000, // $700K
  QLD: 1300000, // $1.3M
  SA: 1500000, // $1.5M
  WA: 1000000, // $1M
  TAS: 1250000, // $1.25M
  NT: 1500000, // $1.5M
  ACT: 2000000, // $2M
};
```

### Payroll Tax Calculation Logic

```typescript
function calculatePayrollTax(annualPayroll: number, state: string): number {
  const threshold = payrollTaxThresholds[state] ?? 0;
  const taxRate = statePayrollTaxRates[state] ?? 0;
  const taxableAmount = Math.max(0, annualPayroll - threshold);
  return taxableAmount * taxRate;
}
```

### Example Calculations

**NSW Example**: Annual payroll of $1,500,000

- Threshold: $1,200,000
- Taxable amount: $1,500,000 - $1,200,000 = $300,000
- Tax: $300,000 × 5.45% = $16,350

**VIC Example**: Annual payroll of $900,000

- Threshold: $700,000
- Taxable amount: $900,000 - $700,000 = $200,000
- Tax: $200,000 × 4.85% = $9,700

## Net Pay Calculation

### Complete Net Pay Formula

```typescript
export function calculateNetPay(
  grossPay: number,
  deductionRate: number = 0
): number {
  if (grossPay <= 0) return 0;

  const tax = calculateIncomeTax(grossPay);
  const deductions = Math.max(0, grossPay * Math.max(0, deductionRate));
  const netPay = grossPay - tax - deductions;

  return Math.max(0, netPay);
}
```

### Net Pay Components

1. **Gross Pay**: Base salary or wages
2. **Income Tax**: Calculated using ATO tax brackets
3. **Other Deductions**: Configurable percentage (union fees, salary sacrifice, etc.)
4. **Net Pay**: Final amount after all deductions

### Example Net Pay Calculation

**Employee earning $80,000 annually with 10% deductions:**

```typescript
const grossPay = 80000;
const deductionRate = 0.1;

// Calculate tax
const tax = calculateIncomeTax(80000); // $16,467

// Calculate deductions
const deductions = 80000 * 0.1; // $8,000

// Calculate net pay
const netPay = 80000 - 16467 - 8000; // $55,533
```

## Implementation Details

### File Locations

- **Tax Utilities**: `src/lib/utils/utils.ts`
- **Tax Calculator Component**: `src/components/business/payroll/australian-tax-calculator.tsx`
- **Payroll Service Tests**: `src/lib/services/payroll/payroll-service.test.ts`
- **Tax Calculator Page**: `src/app/(dashboard)/tax-calculator/page.tsx`

### Test Coverage

The system includes comprehensive tests for:

```typescript
describe("Payroll Service", () => {
  describe("calculateTax", () => {
    test("calculates tax correctly for various income levels", () => {
      expect(calculateTax(18000)).toBeCloseTo(0);
      expect(calculateTax(30000)).toBeCloseTo(2242);
      expect(calculateTax(90000)).toBeCloseTo(19822);
      expect(calculateTax(150000)).toBeCloseTo(43267);
      expect(calculateTax(200000)).toBeCloseTo(63267);
    });

    test("handles edge cases for tax calculation", () => {
      expect(calculateTax(-5000)).toBe(0);
      expect(calculateTax(0)).toBe(0);
      expect(calculateTax(1000000)).toBeGreaterThan(0);
    });
  });

  describe("calculateNetPay", () => {
    test("calculates net pay correctly", () => {
      expect(calculateNetPay(100000, 0.1)).toBeCloseTo(67178);
      expect(calculateNetPay(50000, 0)).toBeCloseTo(41592);
      expect(calculateNetPay(80000, 0.25)).toBeCloseTo(45633);
    });
  });
});
```

### Error Handling

The system handles various edge cases:

- **Negative Income**: Returns $0 tax
- **Zero Income**: Returns $0 tax and net pay
- **Excessive Deductions**: Ensures net pay never goes below $0
- **Invalid State Codes**: Falls back to default rates
- **Missing Thresholds**: Uses $0 threshold as fallback

## Future Enhancements

### Planned Improvements

1. **Multi-Year Tax Brackets**

   - Support for historical tax rates
   - Automatic updates for new financial years
   - Tax bracket versioning system

2. **Advanced Deductions**

   - Salary sacrifice calculations
   - HECS/HELP debt repayments
   - Medicare levy and surcharge
   - Private health insurance rebates

3. **Payroll Tax Enhancements**

   - Interstate employer calculations
   - Grouping provisions for related entities
   - Apprentice and trainee exemptions
   - Regional payroll tax variations

4. **Superannuation Improvements**

   - Contribution caps and excess calculations
   - Concessional vs non-concessional contributions
   - Government co-contributions
   - Self-managed super fund (SMSF) support

5. **Leave Calculations**

   - Annual leave loading
   - Long service leave calculations
   - Sick leave accruals
   - Public holiday payments

6. **Award and Enterprise Agreement Support**

   - Industry-specific rates
   - Overtime calculations
   - Penalty rates
   - Allowances and loadings

7. **Reporting and Compliance**
   - Single Touch Payroll (STP) integration
   - PAYG withholding summaries
   - Fringe benefits tax calculations
   - Workers' compensation calculations

### Implementation Roadmap

#### Phase 1: Core Enhancements (Q1 2024)

- [ ] Multi-year tax bracket support
- [ ] Enhanced error handling and validation
- [ ] Performance optimizations for bulk calculations

#### Phase 2: Advanced Features (Q2 2024)

- [ ] HECS/HELP debt calculations
- [ ] Medicare levy and surcharge
- [ ] Advanced superannuation features

#### Phase 3: Compliance Features (Q3 2024)

- [ ] STP integration preparation
- [ ] Award rate calculations
- [ ] Leave entitlement calculations

#### Phase 4: Enterprise Features (Q4 2024)

- [ ] Multi-entity payroll tax grouping
- [ ] Advanced reporting capabilities
- [ ] API for external integrations

### Configuration Management

Future enhancements will include:

```typescript
interface PayrollConfig {
  financialYear: string;
  taxBrackets: TaxBracket[];
  superannuationRate: number;
  stateRates: StatePayrollTaxConfig[];
  medicareLevy: number;
  medicareSurcharge: MedicareSurchargeConfig;
}

interface TaxBracket {
  minIncome: number;
  maxIncome: number;
  rate: number;
  baseAmount: number;
}
```

### API Enhancements

Planned API improvements:

```typescript
// Enhanced calculation endpoint
POST /api/payroll/calculate
{
  "employee": {
    "annualSalary": 80000,
    "taxFileNumber": "123456789",
    "residencyStatus": "resident",
    "stateOfEmployment": "NSW"
  },
  "deductions": {
    "salaryPackaging": 5000,
    "unionFees": 500,
    "hecsDebt": true
  },
  "payPeriod": {
    "startDate": "2024-01-01",
    "endDate": "2024-01-31",
    "frequency": "monthly"
  }
}
```

---

**Note**: This documentation reflects the current implementation and planned enhancements. Tax rates and thresholds are subject to change based on Australian Tax Office updates and should be verified against current ATO guidelines.

**Last Updated**: December 2024  
**Version**: 1.0  
**Next Review**: March 2024 (Financial Year Update)
