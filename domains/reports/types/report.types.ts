import { z } from "zod";

// Core report types
export const ReportFieldSchema = z.object({
  name: z.string(),
  type: z.enum(["string", "number", "boolean", "date", "object"]),
  domain: z.string(),
  description: z.string().optional(),
  sensitive: z.boolean().default(false),
  aggregatable: z.boolean().default(false),
});

export const ReportFilterSchema = z.object({
  field: z.string(),
  operator: z.enum([
    "equals",
    "notEquals",
    "contains",
    "notContains",
    "greaterThan",
    "lessThan",
    "between",
    "in",
    "notIn",
    "isNull",
    "isNotNull",
  ]),
  value: z.any(),
  conjunction: z.enum(["AND", "OR"]).optional(),
});

export const ReportSortSchema = z.object({
  field: z.string(),
  direction: z.enum(["asc", "desc"]),
});

export const ReportTemplateSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional(),
  domains: z.array(z.string()),
  fields: z.record(z.string(), z.array(z.string())),
  filters: z.array(ReportFilterSchema).optional(),
  sorts: z.array(ReportSortSchema).optional(),
  limit: z.number().optional(),
  createdBy: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  isPublic: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
});

export const ReportConfigSchema = z.object({
  template: ReportTemplateSchema.optional(),
  domains: z.array(z.string()),
  fields: z.record(z.string(), z.array(z.string())),
  filters: z.array(ReportFilterSchema).optional(),
  sorts: z.array(ReportSortSchema).optional(),
  limit: z.number().optional(),
  includeRelationships: z.boolean().default(false),
});

export const ReportJobStatusSchema = z.enum([
  "queued",
  "processing",
  "completed",
  "failed",
]);

export const ReportJobSchema = z.object({
  id: z.string(),
  config: ReportConfigSchema,
  status: ReportJobStatusSchema,
  progress: z.number().optional(),
  error: z.string().optional(),
  result: z.any().optional(),
  startedAt: z.date().optional(),
  completedAt: z.date().optional(),
  userId: z.string(),
});

// Export types
export type ReportField = z.infer<typeof ReportFieldSchema>;
export type ReportFilter = z.infer<typeof ReportFilterSchema>;
export type ReportSort = z.infer<typeof ReportSortSchema>;
export type ReportTemplate = z.infer<typeof ReportTemplateSchema>;
export type ReportConfig = z.infer<typeof ReportConfigSchema>;
export type ReportJobStatus = z.infer<typeof ReportJobStatusSchema>;
export type ReportJob = z.infer<typeof ReportJobSchema>;

// Legacy alias for compatibility
export type ReportMetadata = ReportTemplate & {
  availableFields?: Record<string, any[]>;
};
