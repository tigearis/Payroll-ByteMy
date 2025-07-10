// Email Domain Types
// Security Classification: HIGH - Email communication data
// SOC2 Compliance: Email tracking and audit requirements

export interface EmailTemplate {
  id: string;
  name: string;
  description?: string;
  category: EmailCategory;
  subjectTemplate: string;
  htmlContent: string;
  textContent?: string;
  availableVariables: string[];
  isActive: boolean;
  isSystemTemplate: boolean;
  requiresApproval: boolean;
  createdByUserId: string;
  approvedByUserId?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type EmailCategory = 
  | 'payroll'
  | 'billing' 
  | 'client'
  | 'leave'
  | 'work_schedule'
  | 'system';

export interface EmailSendLog {
  id: string;
  templateId?: string;
  resendEmailId?: string;
  recipientEmails: string[];
  senderUserId: string;
  subject: string;
  htmlContent?: string;
  textContent?: string;
  businessContext?: Record<string, any>;
  sendStatus: EmailSendStatus;
  resendResponse?: Record<string, any>;
  errorMessage?: string;
  scheduledFor?: string;
  sentAt?: string;
  deliveredAt?: string;
  openedAt?: string;
  clickedAt?: string;
  createdAt: string;
}

export type EmailSendStatus = 
  | 'pending'
  | 'sent'
  | 'delivered'
  | 'failed'
  | 'bounced';

export interface EmailDraft {
  id: string;
  userId: string;
  templateId?: string;
  recipientEmails: string[];
  subject?: string;
  htmlContent?: string;
  textContent?: string;
  variableValues?: Record<string, any>;
  businessContext?: Record<string, any>;
  scheduledFor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserEmailTemplateFavorite {
  id: string;
  userId: string;
  templateId: string;
  createdAt: string;
}

// Email composition types
export interface EmailComposition {
  templateId?: string;
  recipientEmails: string[];
  subject: string;
  htmlContent: string;
  textContent?: string;
  variableValues?: Record<string, any>;
  businessContext?: Record<string, any>;
  scheduledFor?: string;
}

export interface EmailVariable {
  key: string;
  label: string;
  description?: string;
  category: string;
  dataType: 'string' | 'number' | 'date' | 'boolean';
  required: boolean;
  example?: string;
}

// Business context types for different domains
export interface PayrollEmailContext {
  payrollId: string;
  clientId: string;
  payrollName: string;
  employeeCount?: number;
  processingDate?: string;
  goLiveDate?: string;
}

export interface BillingEmailContext {
  invoiceId: string;
  clientId: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  billingPeriod?: string;
}

export interface ClientEmailContext {
  clientId: string;
  clientName: string;
  projectId?: string;
  consultantId?: string;
}

export interface LeaveEmailContext {
  leaveId: string;
  employeeId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  approverId?: string;
}

export interface WorkScheduleEmailContext {
  assignmentId: string;
  consultantId: string;
  clientId: string;
  startDate: string;
  endDate: string;
  hoursPerWeek?: number;
}

// API response types
export interface EmailSendResponse {
  success: boolean;
  emailId?: string;
  resendId?: string;
  message?: string;
  error?: string;
}

export interface EmailTemplateValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  missingVariables: string[];
}

// Email analytics types
export interface EmailAnalytics {
  totalSent: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  topTemplates: Array<{
    templateId: string;
    templateName: string;
    usageCount: number;
  }>;
  recentActivity: EmailSendLog[];
}

// Template editor types
export interface TemplateVariable {
  name: string;
  value: any;
  type: 'text' | 'number' | 'date' | 'boolean';
}

export interface TemplatePreview {
  subject: string;
  htmlContent: string;
  textContent?: string;
  variables: Record<string, any>;
}