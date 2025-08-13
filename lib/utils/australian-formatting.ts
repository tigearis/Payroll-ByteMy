/**
 * Australian Currency and Date Formatting Utilities
 * 
 * Provides standardized formatting functions for Australian business contexts
 * including currency (AUD), dates, phone numbers, and business identifiers.
 * 
 * Compliance:
 * - Australian Taxation Office (ATO) requirements
 * - Australian Business Number (ABN) formatting
 * - GST calculation and display
 * - Regional date/time standards (AEST/AEDT)
 */

// ===== CURRENCY FORMATTING =====

/**
 * Format currency amount as Australian Dollars
 * @param amount - Numeric amount to format
 * @param options - Formatting options
 * @returns Formatted currency string (e.g., "$1,234.56")
 */
export function formatAUD(
  amount: number,
  options: {
    showCents?: boolean;
    showSymbol?: boolean;
    showCode?: boolean;
    compact?: boolean;
  } = {}
): string {
  const {
    showCents = true,
    showSymbol = true,
    showCode = false,
    compact = false,
  } = options;

  // Handle invalid amounts
  if (typeof amount !== 'number' || isNaN(amount)) {
    return showSymbol ? '$0.00' : '0.00';
  }

  const formatter = new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    currencyDisplay: showCode ? 'code' : 'symbol',
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
    notation: compact ? 'compact' : 'standard',
  });

  let formatted = formatter.format(amount);

  // Remove symbol if requested
  if (!showSymbol && !showCode) {
    formatted = formatted.replace(/[$AUD\s]/g, '');
  }

  return formatted;
}

/**
 * Calculate and format GST component
 * @param amount - Base amount (excluding GST)
 * @param rate - GST rate (default 0.10 for 10%)
 * @returns Object with base, GST, and total amounts
 */
export function calculateGST(
  amount: number,
  rate: number = 0.10
): {
  base: number;
  gst: number;
  total: number;
  baseFormatted: string;
  gstFormatted: string;
  totalFormatted: string;
} {
  if (typeof amount !== 'number' || isNaN(amount)) {
    amount = 0;
  }

  const base = amount;
  const gst = base * rate;
  const total = base + gst;

  return {
    base,
    gst,
    total,
    baseFormatted: formatAUD(base),
    gstFormatted: formatAUD(gst),
    totalFormatted: formatAUD(total),
  };
}

/**
 * Extract GST from GST-inclusive amount
 * @param inclusiveAmount - Amount including GST
 * @param rate - GST rate (default 0.10 for 10%)
 * @returns GST breakdown
 */
export function extractGST(
  inclusiveAmount: number,
  rate: number = 0.10
): {
  base: number;
  gst: number;
  total: number;
  baseFormatted: string;
  gstFormatted: string;
  totalFormatted: string;
} {
  if (typeof inclusiveAmount !== 'number' || isNaN(inclusiveAmount)) {
    inclusiveAmount = 0;
  }

  const total = inclusiveAmount;
  const base = total / (1 + rate);
  const gst = total - base;

  return {
    base,
    gst,
    total,
    baseFormatted: formatAUD(base),
    gstFormatted: formatAUD(gst),
    totalFormatted: formatAUD(total),
  };
}

// ===== DATE FORMATTING =====

/**
 * Format date for Australian business context
 * @param date - Date to format (Date object, string, or timestamp)
 * @param format - Format type
 * @returns Formatted date string
 */
export function formatAustralianDate(
  date: Date | string | number,
  format: 'short' | 'medium' | 'long' | 'full' | 'business' | 'invoice' = 'medium'
): string {
  if (!date) return '';

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Invalid Date';

  const locale = 'en-AU';
  const timezone = 'Australia/Sydney'; // AEST/AEDT

  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString(locale, {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        timeZone: timezone,
      });

    case 'medium':
      return dateObj.toLocaleDateString(locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: timezone,
      });

    case 'long':
      return dateObj.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: timezone,
      });

    case 'full':
      return dateObj.toLocaleDateString(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: timezone,
      });

    case 'business':
      // Business date format: "Mon 15 Jan 2024"
      return dateObj.toLocaleDateString(locale, {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: timezone,
      });

    case 'invoice':
      // Invoice date format: "15 January 2024"
      return dateObj.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: timezone,
      });

    default:
      return dateObj.toLocaleDateString(locale, { timeZone: timezone });
  }
}

/**
 * Format time for Australian business context
 * @param date - Date/time to format
 * @param format - Time format type
 * @returns Formatted time string
 */
export function formatAustralianTime(
  date: Date | string | number,
  format: '12hour' | '24hour' | 'short' | 'full' = '12hour'
): string {
  if (!date) return '';

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Invalid Time';

  const locale = 'en-AU';
  const timezone = 'Australia/Sydney';

  switch (format) {
    case '12hour':
      return dateObj.toLocaleTimeString(locale, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: timezone,
      });

    case '24hour':
      return dateObj.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: timezone,
      });

    case 'short':
      return dateObj.toLocaleTimeString(locale, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: timezone,
      });

    case 'full':
      return dateObj.toLocaleTimeString(locale, {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZoneName: 'short',
        timeZone: timezone,
      });

    default:
      return dateObj.toLocaleTimeString(locale, { timeZone: timezone });
  }
}

/**
 * Format date and time together
 * @param date - Date/time to format
 * @param options - Format options
 * @returns Formatted date-time string
 */
export function formatAustralianDateTime(
  date: Date | string | number,
  options: {
    dateFormat?: 'short' | 'medium' | 'long' | 'business';
    timeFormat?: '12hour' | '24hour' | 'short';
    separator?: string;
  } = {}
): string {
  const {
    dateFormat = 'medium',
    timeFormat = '12hour',
    separator = ' at ',
  } = options;

  const formattedDate = formatAustralianDate(date, dateFormat);
  const formattedTime = formatAustralianTime(date, timeFormat);

  if (!formattedDate || !formattedTime) return '';

  return `${formattedDate}${separator}${formattedTime}`;
}

// ===== BUSINESS IDENTIFIER FORMATTING =====

/**
 * Format Australian Business Number (ABN)
 * @param abn - ABN as string or number
 * @returns Formatted ABN (XX XXX XXX XXX) or empty string if invalid
 */
export function formatABN(abn: string | number): string {
  if (!abn) return '';

  // Convert to string and remove all non-digits
  const digits = abn.toString().replace(/\D/g, '');

  // ABN should be exactly 11 digits
  if (digits.length !== 11) return '';

  // Format as XX XXX XXX XXX
  return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 11)}`;
}

/**
 * Validate Australian Business Number (ABN)
 * @param abn - ABN to validate
 * @returns Boolean indicating if ABN is valid
 */
export function validateABN(abn: string | number): boolean {
  if (!abn) return false;

  // Convert to string and remove all non-digits
  const digits = abn.toString().replace(/\D/g, '');

  // Must be exactly 11 digits
  if (digits.length !== 11) return false;

  // ABN validation algorithm
  const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  const firstDigit = parseInt(digits[0]) - 1;
  let sum = firstDigit * weights[0];

  for (let i = 1; i < 11; i++) {
    sum += parseInt(digits[i]) * weights[i];
  }

  return sum % 89 === 0;
}

/**
 * Format Australian Company Number (ACN)
 * @param acn - ACN as string or number
 * @returns Formatted ACN (XXX XXX XXX) or empty string if invalid
 */
export function formatACN(acn: string | number): string {
  if (!acn) return '';

  // Convert to string and remove all non-digits
  const digits = acn.toString().replace(/\D/g, '');

  // ACN should be exactly 9 digits
  if (digits.length !== 9) return '';

  // Format as XXX XXX XXX
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
}

// ===== PHONE NUMBER FORMATTING =====

/**
 * Format Australian phone number
 * @param phone - Phone number as string
 * @param format - Format type
 * @returns Formatted phone number
 */
export function formatAustralianPhone(
  phone: string,
  format: 'local' | 'national' | 'international' = 'national'
): string {
  if (!phone) return '';

  // Remove all non-digits
  let digits = phone.replace(/\D/g, '');

  // Handle international format (remove country code)
  if (digits.startsWith('61')) {
    digits = digits.slice(2);
  }

  // Add leading 0 if mobile number without it
  if (digits.length === 9 && (digits.startsWith('4') || digits.startsWith('2') || digits.startsWith('3') || digits.startsWith('7') || digits.startsWith('8'))) {
    digits = '0' + digits;
  }

  // Must be 10 digits for Australian numbers
  if (digits.length !== 10) return phone; // Return original if invalid

  const areaCode = digits.slice(0, 2);
  const firstPart = digits.slice(2, 6);
  const secondPart = digits.slice(6, 10);

  switch (format) {
    case 'local':
      // For mobile: XXXX XXXX, for landline: XXXX XXXX
      return `${firstPart} ${secondPart}`;

    case 'national':
      // 0X XXXX XXXX
      return `${areaCode} ${firstPart} ${secondPart}`;

    case 'international':
      // +61 X XXXX XXXX
      return `+61 ${digits.slice(1, 2)} ${firstPart} ${secondPart}`;

    default:
      return `${areaCode} ${firstPart} ${secondPart}`;
  }
}

// ===== PERCENTAGE FORMATTING =====

/**
 * Format percentage for Australian business context
 * @param value - Decimal value (e.g., 0.10 for 10%)
 * @param decimals - Number of decimal places
 * @returns Formatted percentage string
 */
export function formatPercentage(
  value: number,
  decimals: number = 1
): string {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0%';
  }

  return (value * 100).toFixed(decimals) + '%';
}

// ===== CONVENIENCE FUNCTIONS =====

/**
 * Format for invoice display
 * @param amount - Amount to format
 * @param includeGST - Whether to show GST breakdown
 * @returns Formatted invoice amount
 */
export function formatInvoiceAmount(
  amount: number,
  includeGST: boolean = true
): string | { base: string; gst: string; total: string } {
  if (!includeGST) {
    return formatAUD(amount);
  }

  const gstCalc = calculateGST(amount);
  return {
    base: gstCalc.baseFormatted,
    gst: gstCalc.gstFormatted,
    total: gstCalc.totalFormatted,
  };
}

/**
 * Format payroll date for Australian business context
 * @param date - Payroll date
 * @returns Business-formatted date
 */
export function formatPayrollDate(date: Date | string | number): string {
  return formatAustralianDate(date, 'business');
}

/**
 * Format time duration in hours and minutes
 * @param minutes - Duration in minutes
 * @returns Formatted duration (e.g., "2hr 30min")
 */
export function formatDuration(minutes: number): string {
  if (typeof minutes !== 'number' || isNaN(minutes) || minutes < 0) {
    return '0min';
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}min`;
  } else if (remainingMinutes === 0) {
    return `${hours}hr`;
  } else {
    return `${hours}hr ${remainingMinutes}min`;
  }
}

// Export all functions as default object for convenience
export default {
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
};