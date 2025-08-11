import { z } from 'zod';

// Common validation schemas
export const uuidSchema = z.string().uuid();
export const emailSchema = z.string().email();
export const phoneSchema = z.string().optional();
export const nameSchema = z.string().min(1).max(255);

// Client schemas
export const clientCreateSchema = z.object({
  name: nameSchema,
  email: emailSchema.optional(),
  phone: phoneSchema,
  address: z.string().optional(),
  notes: z.string().optional(),
});

export const clientUpdateSchema = clientCreateSchema.partial();

// User schemas
export const userCreateSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  role: z.enum(['viewer', 'consultant', 'manager', 'org_admin', 'developer']),
  isActive: z.boolean().default(true),
});

export const userUpdateSchema = userCreateSchema.partial();

// Payroll schemas
export const payrollCreateSchema = z.object({
  name: nameSchema,
  clientId: uuidSchema,
  employeeCount: z.number().int().min(0),
  status: z.string().optional(),
});

export const payrollUpdateSchema = payrollCreateSchema.partial();

// Bulk upload schemas
export const bulkClientSchema = z.array(clientCreateSchema);
export const bulkUserSchema = z.array(userCreateSchema);
export const bulkPayrollSchema = z.array(payrollCreateSchema);

export type ClientCreate = z.infer<typeof clientCreateSchema>;
export type ClientUpdate = z.infer<typeof clientUpdateSchema>;
export type UserCreate = z.infer<typeof userCreateSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;
export type PayrollCreate = z.infer<typeof payrollCreateSchema>;
export type PayrollUpdate = z.infer<typeof payrollUpdateSchema>;