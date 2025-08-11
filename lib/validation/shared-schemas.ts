import { z } from "zod";

// Common field validation patterns
export const CommonFieldSchemas = {
  // Basic string validations
  requiredString: z.string().min(1, "This field is required"),
  optionalString: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number").optional(),
  url: z.string().url("Please enter a valid URL").optional(),
  
  // Numeric validations
  positiveNumber: z.number().positive("Must be a positive number"),
  currency: z.number().min(0, "Amount must be non-negative"),
  percentage: z.number().min(0).max(100, "Percentage must be between 0-100"),
  
  // Date validations
  pastDate: z.date().max(new Date(), "Date cannot be in the future"),
  futureDate: z.date().min(new Date(), "Date cannot be in the past"),
  dateRange: z.object({
    start: z.date(),
    end: z.date(),
  }).refine(data => data.start <= data.end, {
    message: "End date must be after start date",
    path: ["end"],
  }),
  
  // UUID validation
  uuid: z.string().uuid("Invalid ID format"),
  
  // Australian-specific validations
  abn: z.string()
    .regex(/^\d{11}$/, "ABN must be 11 digits")
    .refine(abn => {
      // Basic ABN validation algorithm
      const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
      const digits = abn.split('').map(Number);
      digits[0] -= 1; // Subtract 1 from first digit
      const sum = digits.reduce((acc, digit, index) => acc + digit * weights[index], 0);
      return sum % 89 === 0;
    }, "Invalid ABN"),
    
  tfn: z.string()
    .regex(/^\d{9}$/, "TFN must be 9 digits")
    .optional(),
};

// User-related schemas
export const UserSchemas = {
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  firstName: z.string().min(1, "First name is required").max(50, "First name too long"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name too long"),
  
  role: z.enum(["developer", "org_admin", "manager", "consultant", "viewer"], {
    errorMap: () => ({ message: "Please select a valid role" }),
  }),
  
  status: z.enum(["active", "inactive", "locked", "pending"], {
    errorMap: () => ({ message: "Please select a valid status" }),
  }),
  
  createUser: z.object({
    firstName: z.string().min(1, "First name is required").max(50),
    lastName: z.string().min(1, "Last name is required").max(50),
    email: CommonFieldSchemas.email,
    role: z.enum(["developer", "org_admin", "manager", "consultant", "viewer"]),
    managerId: CommonFieldSchemas.uuid.optional(),
  }),
  
  updateUser: z.object({
    firstName: z.string().min(1, "First name is required").max(50).optional(),
    lastName: z.string().min(1, "Last name is required").max(50).optional(),
    email: CommonFieldSchemas.email.optional(),
    role: z.enum(["developer", "org_admin", "manager", "consultant", "viewer"]).optional(),
    managerId: CommonFieldSchemas.uuid.optional(),
    isActive: z.boolean().optional(),
  }),
};

// Client-related schemas
export const ClientSchemas = {
  name: z.string().min(1, "Client name is required").max(200, "Name too long"),
  
  contactInfo: z.object({
    contactPerson: z.string().max(100, "Contact person name too long").optional(),
    contactEmail: CommonFieldSchemas.email.optional(),
    contactPhone: CommonFieldSchemas.phone,
    address: z.string().max(500, "Address too long").optional(),
  }),
  
  businessDetails: z.object({
    abn: CommonFieldSchemas.abn.optional(),
    industry: z.string().max(100, "Industry name too long").optional(),
    website: CommonFieldSchemas.url,
    companySize: z.enum(["1-10", "11-50", "51-200", "201-500", "500+"], {
      errorMap: () => ({ message: "Please select company size" }),
    }).optional(),
  }),
  
  createClient: z.object({
    name: z.string().min(1, "Client name is required").max(200),
    contactPerson: z.string().max(100).optional(),
    contactEmail: CommonFieldSchemas.email.optional(),
    contactPhone: CommonFieldSchemas.phone,
    address: z.string().max(500).optional(),
    abn: CommonFieldSchemas.abn.optional(),
    industry: z.string().max(100).optional(),
    website: CommonFieldSchemas.url,
  }),
  
  updateClient: z.object({
    name: z.string().min(1, "Client name is required").max(200).optional(),
    contactPerson: z.string().max(100).optional(),
    contactEmail: CommonFieldSchemas.email.optional(),
    contactPhone: CommonFieldSchemas.phone,
    address: z.string().max(500).optional(),
    abn: CommonFieldSchemas.abn.optional(),
    industry: z.string().max(100).optional(),
    website: CommonFieldSchemas.url,
    isActive: z.boolean().optional(),
  }),
};

// Billing-related schemas
export const BillingSchemas = {
  amount: z.number().min(0, "Amount must be non-negative").max(1000000, "Amount too large"),
  
  billingItem: z.object({
    description: z.string().min(1, "Description is required").max(500),
    amount: z.number().min(0, "Amount must be non-negative"),
    clientId: CommonFieldSchemas.uuid,
    serviceDate: z.date(),
    category: z.string().max(100, "Category name too long").optional(),
    taxable: z.boolean().default(true),
  }),

  updateBillingItem: z.object({
    description: z.string().min(1, "Description is required").max(500, "Description too long"),
    quantity: z.number().min(0.01, "Quantity must be at least 0.01").max(999, "Quantity too large"),
    unitPrice: z.number().min(0.01, "Unit price must be at least $0.01").max(10000, "Unit price too large"),
    notes: z.string().max(1000, "Notes too long").optional(),
    serviceId: z.string().uuid("Invalid service ID").optional(),
  }),
  
  invoice: z.object({
    clientId: CommonFieldSchemas.uuid,
    invoiceDate: z.date(),
    dueDate: z.date(),
    items: z.array(z.object({
      description: z.string().min(1, "Item description required"),
      quantity: z.number().min(1, "Quantity must be at least 1"),
      unitPrice: z.number().min(0, "Unit price must be non-negative"),
      taxable: z.boolean().default(true),
    })).min(1, "At least one item is required"),
    notes: z.string().max(1000, "Notes too long").optional(),
  }),
  
  timeEntry: z.object({
    clientId: CommonFieldSchemas.uuid,
    date: z.date(),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format"),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format"),
    description: z.string().min(1, "Description is required").max(500),
    billable: z.boolean().default(true),
  }).refine(data => {
    const start = new Date(`1970-01-01 ${data.startTime}`);
    const end = new Date(`1970-01-01 ${data.endTime}`);
    return start < end;
  }, {
    message: "End time must be after start time",
    path: ["endTime"],
  }),
};

// Payroll-related schemas
export const PayrollSchemas = {
  name: z.string().min(1, "Payroll name is required").max(200),
  
  payrollCycle: z.enum(["weekly", "fortnightly", "monthly", "bi_monthly"], {
    errorMap: () => ({ message: "Please select a valid payroll cycle" }),
  }),
  
  createPayroll: z.object({
    name: z.string().min(1, "Payroll name is required").max(200),
    clientId: CommonFieldSchemas.uuid,
    cycleId: CommonFieldSchemas.uuid,
    dateTypeId: CommonFieldSchemas.uuid,
    dateValue: z.number().min(1).max(31, "Date value must be between 1-31"),
    processingDaysBeforeEft: z.number().min(0).max(30, "Processing days must be between 0-30"),
    primaryConsultantUserId: CommonFieldSchemas.uuid,
    backupConsultantUserId: CommonFieldSchemas.uuid.optional(),
    managerUserId: CommonFieldSchemas.uuid.optional(),
  }),
  
  updatePayroll: z.object({
    name: z.string().min(1).max(200).optional(),
    dateValue: z.number().min(1).max(31).optional(),
    processingDaysBeforeEft: z.number().min(0).max(30).optional(),
    primaryConsultantUserId: CommonFieldSchemas.uuid.optional(),
    backupConsultantUserId: CommonFieldSchemas.uuid.optional(),
    managerUserId: CommonFieldSchemas.uuid.optional(),
    status: z.enum(["active", "inactive", "completed", "cancelled"]).optional(),
  }),
};

// File upload schemas
export const FileSchemas = {
  upload: z.object({
    name: z.string().min(1, "Filename is required"),
    type: z.string().min(1, "File type is required"),
    size: z.number().max(10 * 1024 * 1024, "File size must be under 10MB"),
  }),
  
  allowedImageTypes: z.enum([
    "image/jpeg",
    "image/png", 
    "image/gif",
    "image/webp"
  ]),
  
  allowedDocumentTypes: z.enum([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "text/csv",
  ]),
};

// Search and filter schemas
export const SearchSchemas = {
  pagination: z.object({
    page: z.number().min(1, "Page must be at least 1").default(1),
    limit: z.number().min(1).max(100, "Limit must be between 1-100").default(20),
  }),
  
  search: z.object({
    query: z.string().max(200, "Search query too long").optional(),
    sortBy: z.string().max(50).optional(),
    sortOrder: z.enum(["asc", "desc"]).default("asc"),
    filters: z.record(z.string()).optional(),
  }),
  
  dateFilter: z.object({
    from: z.date().optional(),
    to: z.date().optional(),
  }).refine(data => {
    if (data.from && data.to) {
      return data.from <= data.to;
    }
    return true;
  }, {
    message: "End date must be after start date",
    path: ["to"],
  }),
};

// Utility functions for common validation patterns
export const ValidationUtils = {
  // Create optional version of any schema
  makeOptional: <T extends z.ZodTypeAny>(schema: T) => schema.optional(),
  
  // Create array version of any schema
  makeArray: <T extends z.ZodTypeAny>(schema: T, minLength?: number, maxLength?: number) => {
    let arraySchema = z.array(schema);
    if (minLength !== undefined) {
      arraySchema = arraySchema.min(minLength, `At least ${minLength} item(s) required`);
    }
    if (maxLength !== undefined) {
      arraySchema = arraySchema.max(maxLength, `Maximum ${maxLength} item(s) allowed`);
    }
    return arraySchema;
  },
  
  // Combine multiple schemas
  merge: <T extends z.ZodRawShape, U extends z.ZodRawShape>(
    schema1: z.ZodObject<T>,
    schema2: z.ZodObject<U>
  ) => schema1.merge(schema2),
  
  // Transform validation errors to user-friendly messages
  formatErrors: (error: z.ZodError) => {
    return error.errors.reduce((acc, curr) => {
      const path = curr.path.join(".");
      acc[path] = curr.message;
      return acc;
    }, {} as Record<string, string>);
  },
  
  // Validate and transform data
  parseWithDefaults: <T>(
    schema: z.ZodSchema<T>,
    data: unknown,
    defaults: Partial<T> = {}
  ): T => {
    const parsed = schema.parse(data);
    return { ...defaults, ...parsed } as T;
  },
};

// Pre-built form schemas for common use cases
export const FormSchemas = {
  // Login forms
  login: z.object({
    email: CommonFieldSchemas.email,
    password: z.string().min(1, "Password is required"),
    rememberMe: z.boolean().optional(),
  }),
  
  // Settings forms
  userPreferences: z.object({
    theme: z.enum(["light", "dark", "system"]).default("system"),
    notifications: z.object({
      email: z.boolean().default(true),
      browser: z.boolean().default(true),
      slack: z.boolean().default(false),
    }).optional(),
    timezone: z.string().default("Australia/Sydney"),
    dateFormat: z.enum(["dd/mm/yyyy", "mm/dd/yyyy", "yyyy-mm-dd"]).default("dd/mm/yyyy"),
  }),
  
  // Contact forms
  contactForm: z.object({
    name: CommonFieldSchemas.requiredString,
    email: CommonFieldSchemas.email,
    subject: z.string().min(1, "Subject is required").max(200),
    message: z.string().min(10, "Message must be at least 10 characters").max(1000),
  }),
};

export type UserCreateInput = z.infer<typeof UserSchemas.createUser>;
export type UserUpdateInput = z.infer<typeof UserSchemas.updateUser>;
export type ClientCreateInput = z.infer<typeof ClientSchemas.createClient>;
export type ClientUpdateInput = z.infer<typeof ClientSchemas.updateClient>;
export type BillingItemInput = z.infer<typeof BillingSchemas.billingItem>;
export type InvoiceInput = z.infer<typeof BillingSchemas.invoice>;
export type PayrollCreateInput = z.infer<typeof PayrollSchemas.createPayroll>;
export type PayrollUpdateInput = z.infer<typeof PayrollSchemas.updatePayroll>;
export type SearchInput = z.infer<typeof SearchSchemas.search>;
export type PaginationInput = z.infer<typeof SearchSchemas.pagination>;