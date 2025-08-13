/**
 * Shared Billing Components Export Index
 * 
 * Centralized exports for all reusable billing components
 * and utilities to ensure consistent usage across the application.
 */

// Core Components
export { BillingPreviewCard } from './BillingPreviewCard';
export { SixMinuteTimeInput } from './SixMinuteTimeInput';

// Time Unit Utilities
export {
  convertUnitsToHours,
  convertHoursToUnits,
  convertUnitsToMinutes,
  convertMinutesToUnits,
  isValidTimeUnits,
  formatTimeUnits,
  calculateBillingAmount,
} from './SixMinuteTimeInput';

// Australian Formatting Utilities
export {
  formatAUD,
  calculateGST,
  extractGST,
  formatAustralianDate,
  formatAustralianTime,
  formatAustralianDateTime,
  formatABN,
  validateABN,
  formatACN,
  formatAustralianPhone,
  formatPercentage,
  formatInvoiceAmount,
  formatPayrollDate,
  formatDuration,
} from '@/lib/utils/australian-formatting';

// Type Definitions for Billing Components
export interface BillingItem {
  id?: string;
  serviceId: string;
  serviceName: string;
  unitType: string;
  quantity: number;
  displayQuantity: string;
  unitPrice: number;
  totalAmount: number;
  description: string;
  notes?: string;
}

export interface TimeEntry {
  serviceId: string;
  timeUnits: number; // 6-minute units (10 units = 1 hour)
  description: string;
  notes: string;
}

export interface QuantityEntry {
  serviceId: string;
  quantity: number;
  notes: string;
}

export interface ServiceConfirmation {
  serviceId: string;
  confirmed: boolean;
  notes: string;
}

// Billing Constants
export const BILLING_CONSTANTS = {
  TIME_UNIT_MINUTES: 6,
  UNITS_PER_HOUR: 10,
  GST_RATE: 0.10,
  CURRENCY_CODE: 'AUD',
  TIMEZONE: 'Australia/Sydney',
} as const;

// Unit Type Configuration
export const UNIT_TYPE_CONFIG = {
  time: {
    icon: '⏱️',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    requiresQuantityInput: false,
    defaultSource: 'time_tracking',
  },
  fixed: {
    icon: '📋',
    color: 'bg-green-50 text-green-700 border-green-200',
    requiresQuantityInput: false,
    defaultSource: 'service_agreement',
  },
  per_employee: {
    icon: '👥',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    requiresQuantityInput: true,
    defaultSource: 'payroll_employees',
  },
  per_payslip: {
    icon: '📄',
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    requiresQuantityInput: true,
    defaultSource: 'payroll_payslips',
  },
  custom: {
    icon: '📊',
    color: 'bg-gray-50 text-gray-700 border-gray-200',
    requiresQuantityInput: true,
    defaultSource: 'manual_entry',
  },
} as const;

// Helper Functions
export const getUnitTypeIcon = (unitType: string): string => {
  return UNIT_TYPE_CONFIG[unitType as keyof typeof UNIT_TYPE_CONFIG]?.icon || '📊';
};

export const getUnitTypeColor = (unitType: string): string => {
  return UNIT_TYPE_CONFIG[unitType as keyof typeof UNIT_TYPE_CONFIG]?.color || 'bg-gray-50 text-gray-700 border-gray-200';
};

export const calculateTimeBasedBilling = (
  timeUnits: number, 
  hourlyRate: number
): { hours: number; amount: number; formattedAmount: string } => {
  const hours = convertUnitsToHours(timeUnits);
  const amount = hours * hourlyRate;
  const formattedAmount = formatAUD(amount);
  
  return { hours, amount, formattedAmount };
};

export const calculateQuantityBasedBilling = (
  quantity: number,
  unitRate: number
): { amount: number; formattedAmount: string } => {
  const amount = quantity * unitRate;
  const formattedAmount = formatAUD(amount);
  
  return { amount, formattedAmount };
};

// Validation Helpers
export const validateBillingItem = (item: Partial<BillingItem>): string[] => {
  const errors: string[] = [];
  
  if (!item.serviceId) errors.push('Service ID is required');
  if (!item.serviceName) errors.push('Service name is required');
  if (!item.unitType) errors.push('Unit type is required');
  if (typeof item.quantity !== 'number' || item.quantity < 0) {
    errors.push('Quantity must be a non-negative number');
  }
  if (typeof item.unitPrice !== 'number' || item.unitPrice < 0) {
    errors.push('Unit price must be a non-negative number');
  }
  
  return errors;
};

export const validateTimeEntry = (entry: Partial<TimeEntry>): string[] => {
  const errors: string[] = [];
  
  if (!entry.serviceId) errors.push('Service ID is required');
  if (!isValidTimeUnits(entry.timeUnits)) {
    errors.push('Time units must be a non-negative number');
  }
  if (!entry.description?.trim()) {
    errors.push('Description is required');
  }
  
  return errors;
};

// Summary Calculation Helpers
export const calculateBillingSummary = (items: BillingItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.totalAmount, 0);
  const gstCalc = calculateGST(subtotal);
  
  const breakdown = items.reduce((acc, item) => {
    if (!acc[item.unitType]) {
      acc[item.unitType] = {
        count: 0,
        total: 0,
      };
    }
    acc[item.unitType].count += 1;
    acc[item.unitType].total += item.totalAmount;
    return acc;
  }, {} as Record<string, { count: number; total: number }>);
  
  return {
    itemCount: items.length,
    subtotal,
    gst: gstCalc.gst,
    total: gstCalc.total,
    breakdown,
    formattedSubtotal: formatAUD(subtotal),
    formattedGst: formatAUD(gstCalc.gst),
    formattedTotal: formatAUD(gstCalc.total),
  };
};

// Default Configurations
export const DEFAULT_TIME_PRESETS = [
  { label: "15min", units: 2.5, display: "2.5 units" },
  { label: "30min", units: 5, display: "5 units" },
  { label: "45min", units: 7.5, display: "7.5 units" },
  { label: "1hr", units: 10, display: "10 units" },
  { label: "1.5hr", units: 15, display: "15 units" },
  { label: "2hr", units: 20, display: "20 units" },
  { label: "3hr", units: 30, display: "30 units" },
  { label: "4hr", units: 40, display: "40 units" },
];