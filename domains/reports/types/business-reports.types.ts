import { z } from "zod";
import { ReportConfig, ReportTemplate } from "./report.types";

// ============================================================================
// BUSINESS REPORT TYPES - User-Friendly Reporting System
// ============================================================================

// Business Categories for Report Organization
export const BusinessReportCategorySchema = z.enum([
  "financial",
  "operational", 
  "compliance",
  "hr_analytics",
  "client_management",
  "performance",
  "forecasting",
  "audit"
]);

export type BusinessReportCategory = z.infer<typeof BusinessReportCategorySchema>;

// Business Field Mapping - Technical to User-Friendly Names
export const BusinessFieldSchema = z.object({
  technicalName: z.string(),
  businessName: z.string(),
  description: z.string(),
  category: z.string(),
  dataType: z.enum(["currency", "percentage", "count", "text", "date", "hours", "rating"]),
  format: z.string().optional(),
  required: z.boolean().default(false),
  sensitive: z.boolean().default(false),
  aggregatable: z.boolean().default(false),
  examples: z.array(z.string()).optional(),
});

export type BusinessField = z.infer<typeof BusinessFieldSchema>;

// Business Report Template - Pre-built Reports
export const BusinessReportTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: BusinessReportCategorySchema,
  targetAudience: z.array(z.enum(["consultant", "manager", "org_admin", "client"])),
  estimatedRuntime: z.string(), // e.g., "< 30 seconds"
  complexity: z.enum(["simple", "intermediate", "advanced"]),
  
  // Visual Configuration
  icon: z.string(),
  color: z.string().optional(),
  tags: z.array(z.string()).optional(),
  
  // Report Configuration
  config: z.object({
    domains: z.array(z.string()),
    fields: z.record(z.string(), z.array(z.string())),
    defaultFilters: z.array(z.any()).optional(),
    defaultSorts: z.array(z.any()).optional(),
    defaultLimit: z.number().optional(),
    chartType: z.enum(["table", "bar", "line", "pie", "area", "mixed"]).optional(),
    groupBy: z.array(z.string()).optional(),
    aggregations: z.array(z.any()).optional(),
  }),
  
  // User Experience
  quickFilters: z.array(z.object({
    field: z.string(),
    label: z.string(),
    type: z.enum(["date_range", "select", "multi_select", "checkbox", "text"]),
    options: z.array(z.string()).optional(),
    defaultValue: z.any().optional(),
  })).optional(),
  
  // Export Options
  defaultExportFormats: z.array(z.enum(["csv", "pdf", "excel"])).optional(),
  whiteLabel: z.boolean().default(false),
  
  // Metadata
  createdBy: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  version: z.string().default("1.0"),
  isActive: z.boolean().default(true),
  usageCount: z.number().default(0),
});

export type BusinessReportTemplate = z.infer<typeof BusinessReportTemplateSchema>;

// Report Wizard Steps - Guided Report Creation
export const ReportWizardStepSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
  component: z.string(), // Component name to render
  validation: z.any().optional(),
  dependencies: z.array(z.string()).optional(), // Which previous steps must be completed
});

export type ReportWizardStep = z.infer<typeof ReportWizardStepSchema>;

// Report Wizard Configuration
export const ReportWizardConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: BusinessReportCategorySchema,
  estimatedTime: z.string(),
  steps: z.array(ReportWizardStepSchema),
  resultTemplate: BusinessReportTemplateSchema.optional(),
});

export type ReportWizardConfig = z.infer<typeof ReportWizardConfigSchema>;

// Report Preview Configuration
export const ReportPreviewConfigSchema = z.object({
  maxRows: z.number().default(10),
  maxColumns: z.number().default(15),
  showSummaryStats: z.boolean().default(true),
  enableInteraction: z.boolean().default(false),
  refreshInterval: z.number().optional(), // seconds
});

export type ReportPreviewConfig = z.infer<typeof ReportPreviewConfigSchema>;

// Report Sharing Configuration
export const ReportSharingConfigSchema = z.object({
  reportId: z.string(),
  sharedBy: z.string(),
  sharedWith: z.array(z.object({
    userId: z.string().optional(),
    email: z.string().optional(),
    role: z.enum(["viewer", "editor", "admin"]),
    expiresAt: z.date().optional(),
  })),
  isPublic: z.boolean().default(false),
  allowDownload: z.boolean().default(true),
  allowEdit: z.boolean().default(false),
  passwordProtected: z.boolean().default(false),
  password: z.string().optional(),
  createdAt: z.date().optional(),
  accessCount: z.number().default(0),
});

export type ReportSharingConfig = z.infer<typeof ReportSharingConfigSchema>;

// Client Portal Report Configuration
export const ClientPortalReportSchema = z.object({
  id: z.string(),
  clientId: z.string(),
  reportTemplateId: z.string(),
  
  // Branding & White-labeling
  branding: z.object({
    logoUrl: z.string().optional(),
    primaryColor: z.string().optional(),
    secondaryColor: z.string().optional(),
    companyName: z.string().optional(),
    customHeader: z.string().optional(),
    customFooter: z.string().optional(),
  }).optional(),
  
  // Access Control
  accessLevel: z.enum(["read_only", "download", "interactive"]),
  allowedFormats: z.array(z.enum(["csv", "pdf", "excel"])).optional(),
  
  // Automation
  autoGenerate: z.boolean().default(false),
  generateFrequency: z.enum(["daily", "weekly", "monthly", "quarterly"]).optional(),
  nextGenerationDate: z.date().optional(),
  emailDelivery: z.boolean().default(false),
  emailRecipients: z.array(z.string()).optional(),
  
  // Metadata
  isActive: z.boolean().default(true),
  lastAccessedAt: z.date().optional(),
  generatedCount: z.number().default(0),
});

export type ClientPortalReport = z.infer<typeof ClientPortalReportSchema>;

// Usage Analytics for Reports
export const ReportUsageAnalyticsSchema = z.object({
  reportId: z.string(),
  userId: z.string(),
  action: z.enum(["view", "generate", "export", "share", "edit", "delete"]),
  duration: z.number().optional(), // seconds
  metadata: z.record(z.any()).optional(),
  timestamp: z.date(),
});

export type ReportUsageAnalytics = z.infer<typeof ReportUsageAnalyticsSchema>;