/**
 * Comprehensive Input Validation Schemas
 * 
 * Zod schemas for validating all API inputs to prevent injection attacks,
 * ensure data integrity, and provide type safety across the application.
 * 
 * Security: Prevents SQL injection, XSS, and malformed data attacks
 * SOC2 Compliance: Input validation is required for data integrity
 */

import { z } from 'zod';

// ============================================================================
// Base Validation Schemas
// ============================================================================

/**
 * UUID validation with security constraints
 */
export const UuidSchema = z.string()
  .uuid('Must be a valid UUID')
  .describe('UUID identifier');

/**
 * Safe string validation - prevents XSS and injection
 */
export const SafeStringSchema = z.string()
  .min(1, 'Cannot be empty')
  .max(1000, 'Too long (max 1000 characters)')
  .regex(/^[^<>'"&]*$/, 'Contains unsafe characters')
  .describe('Safe string without HTML/script content');

/**
 * Email validation with enhanced security
 */
export const EmailSchema = z.string()
  .email('Must be a valid email address')
  .max(320, 'Email too long') // RFC 5321 limit
  .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format')
  .describe('Valid email address');

/**
 * Name validation for user names, company names, etc.
 */
export const NameSchema = z.string()
  .min(1, 'Name is required')
  .max(255, 'Name too long (max 255 characters)')
  .regex(/^[a-zA-Z0-9\s\-_.(),&]+$/, 'Name contains invalid characters')
  .describe('Safe name with allowed special characters');

/**
 * Role validation for user roles
 */
export const RoleSchema = z.enum([
  'developer',
  'org_admin', 
  'manager',
  'consultant',
  'viewer'
], {
  errorMap: () => ({ message: 'Invalid role. Must be developer, org_admin, manager, consultant, or viewer' })
});

/**
 * Date validation
 */
export const DateSchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be in YYYY-MM-DD format')
  .refine((date) => !isNaN(Date.parse(date)), 'Must be a valid date')
  .describe('Date in YYYY-MM-DD format');

/**
 * Pagination validation
 */
export const PaginationSchema = z.object({
  limit: z.number()
    .int('Must be an integer')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .default(20),
  offset: z.number()
    .int('Must be an integer')
    .min(0, 'Offset cannot be negative')
    .default(0)
});

// ============================================================================
// User Management Schemas
// ============================================================================

/**
 * User creation schema
 */
export const CreateUserSchema = z.object({
  name: NameSchema,
  email: EmailSchema,
  role: RoleSchema.default('viewer'),
  isStaff: z.boolean().default(false),
  isActive: z.boolean().default(true),
  managerId: UuidSchema.optional(),
  clerkUserId: SafeStringSchema.optional()
});

/**
 * User update schema
 */
export const UpdateUserSchema = z.object({
  id: UuidSchema,
  name: NameSchema.optional(),
  email: EmailSchema.optional(),
  role: RoleSchema.optional(),
  isStaff: z.boolean().optional(),
  isActive: z.boolean().optional(),
  managerId: UuidSchema.nullable().optional()
});

/**
 * User role update schema
 */
export const UpdateUserRoleSchema = z.object({
  userId: UuidSchema,
  role: RoleSchema,
  updatedBy: UuidSchema.optional()
});

// ============================================================================
// Client Management Schemas  
// ============================================================================

/**
 * Client creation schema
 */
export const CreateClientSchema = z.object({
  name: NameSchema,
  contactPerson: NameSchema.optional(),
  email: EmailSchema.optional(),
  phone: z.string()
    .regex(/^\+?[\d\s\-()]+$/, 'Invalid phone number format')
    .min(10, 'Phone number too short')
    .max(20, 'Phone number too long')
    .optional(),
  address: SafeStringSchema.optional(),
  active: z.boolean().default(true)
});

/**
 * Client update schema
 */
export const UpdateClientSchema = z.object({
  id: UuidSchema,
  name: NameSchema.optional(),
  contactPerson: NameSchema.optional(),
  email: EmailSchema.optional(),
  phone: z.string()
    .regex(/^\+?[\d\s\-()]+$/, 'Invalid phone number format')
    .min(10, 'Phone number too short')
    .max(20, 'Phone number too long')
    .optional(),
  address: SafeStringSchema.optional(),
  active: z.boolean().optional()
});

// ============================================================================
// Payroll Management Schemas
// ============================================================================

/**
 * Payroll status enum
 */
export const PayrollStatusSchema = z.enum([
  'Draft',
  'Active', 
  'Implementation',
  'Inactive',
  'Completed'
], {
  errorMap: () => ({ message: 'Invalid payroll status' })
});

/**
 * Payroll creation schema
 */
export const CreatePayrollSchema = z.object({
  name: NameSchema,
  clientId: UuidSchema,
  employeeCount: z.number()
    .int('Must be an integer')
    .min(1, 'Must have at least 1 employee')
    .max(10000, 'Employee count too high'),
  processingTime: z.number()
    .int('Must be an integer')
    .min(1, 'Processing time must be at least 1 hour')
    .max(168, 'Processing time cannot exceed 168 hours (1 week)'),
  processingDaysBeforeEft: z.number()
    .int('Must be an integer')
    .min(0, 'Cannot be negative')
    .max(30, 'Cannot exceed 30 days'),
  dateValue: z.number()
    .int('Must be an integer')
    .min(1, 'Date value must be between 1-31')
    .max(31, 'Date value must be between 1-31'),
  status: PayrollStatusSchema.default('Draft'),
  primaryConsultantUserId: UuidSchema.optional(),
  backupConsultantUserId: UuidSchema.optional(),
  managerUserId: UuidSchema.optional(),
  payrollCycleId: UuidSchema.optional(),
  payrollDateTypeId: UuidSchema.optional()
});

/**
 * Payroll update schema
 */
export const UpdatePayrollSchema = z.object({
  id: UuidSchema,
  name: NameSchema.optional(),
  employeeCount: z.number()
    .int('Must be an integer')
    .min(1, 'Must have at least 1 employee')
    .max(10000, 'Employee count too high')
    .optional(),
  processingTime: z.number()
    .int('Must be an integer') 
    .min(1, 'Processing time must be at least 1 hour')
    .max(168, 'Processing time cannot exceed 168 hours')
    .optional(),
  processingDaysBeforeEft: z.number()
    .int('Must be an integer')
    .min(0, 'Cannot be negative')
    .max(30, 'Cannot exceed 30 days')
    .optional(),
  dateValue: z.number()
    .int('Must be an integer')
    .min(1, 'Date value must be between 1-31')
    .max(31, 'Date value must be between 1-31')
    .optional(),
  status: PayrollStatusSchema.optional(),
  primaryConsultantUserId: UuidSchema.nullable().optional(),
  backupConsultantUserId: UuidSchema.nullable().optional(),
  managerUserId: UuidSchema.nullable().optional()
});

// ============================================================================
// Search and Filter Schemas
// ============================================================================

/**
 * Search query schema
 */
export const SearchSchema = z.object({
  query: z.string()
    .min(1, 'Search query cannot be empty')
    .max(100, 'Search query too long')
    .regex(/^[a-zA-Z0-9\s\-_.@]+$/, 'Search contains invalid characters'),
  ...PaginationSchema.shape
});

/**
 * Filter schema for lists
 */
export const FilterSchema = z.object({
  status: z.string().optional(),
  role: RoleSchema.optional(),
  active: z.boolean().optional(),
  clientId: UuidSchema.optional(),
  managerId: UuidSchema.optional(),
  ...PaginationSchema.shape
});

// ============================================================================
// Work Schedule Schemas
// ============================================================================

/**
 * Work day enum
 */
export const WorkDaySchema = z.enum([
  'Monday',
  'Tuesday', 
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
]);

/**
 * Work schedule schema
 */
export const WorkScheduleSchema = z.object({
  userId: UuidSchema,
  workDay: WorkDaySchema,
  workHours: z.number()
    .min(0, 'Work hours cannot be negative')
    .max(24, 'Work hours cannot exceed 24'),
  adminTimeHours: z.number()
    .min(0, 'Admin time cannot be negative')
    .max(24, 'Admin time cannot exceed 24'),
  payrollCapacityHours: z.number()
    .min(0, 'Capacity cannot be negative')
    .max(24, 'Capacity cannot exceed 24')
});

// ============================================================================
// Audit and Logging Schemas
// ============================================================================

/**
 * Audit log entry schema
 */
export const AuditLogSchema = z.object({
  userId: UuidSchema,
  action: SafeStringSchema,
  resource: SafeStringSchema,
  resourceId: UuidSchema.optional(),
  details: z.record(z.any()).optional(),
  ipAddress: z.string()
    .ip({ version: 'v4' })
    .or(z.string().ip({ version: 'v6' }))
    .optional(),
  userAgent: SafeStringSchema.optional()
});

// ============================================================================
// API Response Schemas
// ============================================================================

/**
 * Standard API error response
 */
export const ApiErrorSchema = z.object({
  error: z.string(),
  message: z.string(),
  code: z.string().optional(),
  details: z.record(z.any()).optional(),
  timestamp: z.string().datetime()
});

/**
 * Standard API success response
 */
export const ApiSuccessSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  message: z.string().optional(),
  timestamp: z.string().datetime()
});

// ============================================================================
// Validation Helper Functions
// ============================================================================

/**
 * Validate request body with detailed error messages
 */
export function validateRequestBody<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      );
      return { success: false, errors };
    }
    return { success: false, errors: ['Invalid input data'] };
  }
}

/**
 * Validate query parameters
 */
export function validateQueryParams<T>(
  schema: z.ZodSchema<T>, 
  params: Record<string, string | string[] | undefined>
): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    // Convert string values to appropriate types
    const processed = Object.entries(params).reduce((acc, [key, value]) => {
      if (value === undefined) return acc;
      
      if (Array.isArray(value)) {
        acc[key] = value;
      } else if (value === 'true') {
        acc[key] = true;
      } else if (value === 'false') {
        acc[key] = false;
      } else if (!isNaN(Number(value)) && value !== '') {
        acc[key] = Number(value);
      } else {
        acc[key] = value;
      }
      
      return acc;
    }, {} as Record<string, any>);

    const result = schema.parse(processed);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      );
      return { success: false, errors };
    }
    return { success: false, errors: ['Invalid query parameters'] };
  }
}

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>'"&]/g, '') // Remove dangerous characters
    .trim()
    .slice(0, 1000); // Limit length
}

/**
 * Validate and sanitize search input
 */
export function validateSearch(query: string): string {
  const sanitized = sanitizeString(query);
  const validation = SearchSchema.shape.query.safeParse(sanitized);
  
  if (!validation.success) {
    throw new Error('Invalid search query');
  }
  
  return validation.data;
}

// ============================================================================
// All exports are already declared above as individual exports
// ============================================================================