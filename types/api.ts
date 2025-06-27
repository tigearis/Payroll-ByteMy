// types/api.types.ts
// API request/response types and GraphQL operation types

import type { ApolloError } from "@apollo/client";

// ===========================
// Generic API Types
// ===========================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata?: {
    timestamp: Timestamptz;
    requestId?: string;
    version?: string;
  };
}

/**
 * API error structure
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  field?: string;
  stackTrace?: string;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

/**
 * Batch operation result
 */
export interface BatchOperationResult {
  succeeded: number;
  failed: number;
  errors?: Array<{
    index: number;
    error: ApiError;
  }>;
}

// ===========================
// GraphQL Types
// ===========================

/**
 * GraphQL query result
 */
export interface GraphQLResult<T> {
  data?: T;
  loading: boolean;
  error?: ApolloError;
  refetch?: () => Promise<any>;
}

/**
 * GraphQL mutation result
 */
export interface GraphQLMutationResult<T> {
  data?: T;
  loading: boolean;
  error?: ApolloError;
  called: boolean;
}

/**
 * GraphQL subscription result
 */
export interface GraphQLSubscriptionResult<T> {
  data?: T;
  loading: boolean;
  error?: ApolloError;
}

// ===========================
// Authentication Types
// ===========================

/**
 * Login request
 */
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Login response
 */
export interface LoginResponse {
  user: {
    id: UUID;
    email: string;
    name: string;
    role: Role;
  };
  token: string;
  refreshToken?: string;
  expiresIn: number;
}

/**
 * Token refresh request
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * Token refresh response
 */
export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

// ===========================
// Hasura Action Types
// ===========================

/**
 * Generate payroll dates action input
 */
export interface GeneratePayrollDatesInput {
  payrollId: UUID;
  startDate: DateString;
  endDate: DateString;
  override?: boolean;
}

/**
 * Generate payroll dates action input (alternative format)
 */
export interface GeneratePayrollDatesArgs {
  payrollIds: UUID[]; // Array of payroll IDs to process
  startDate: DateString; // Start date for generating payroll dates (ISO format)
  endDate: DateString; // End date for generating payroll dates (ISO format)
  maxDates: number; // Maximum number of payroll dates to generate
}

/**
 * Generate payroll dates action output
 */
export interface GeneratePayrollDatesOutput {
  success: boolean;
  generatedCount: number;
  dates?: Array<{
    originalEftDate: DateString;
    adjustedEftDate: DateString;
    processingDate: DateString;
  }>;
  error?: string;
}

/**
 * Bulk assign consultants input
 */
export interface BulkAssignConsultantsInput {
  assignments: Array<{
    payrollDateId: UUID;
    consultantId: UUID;
    assignmentType: "primary" | "backup" | "temporary";
  }>;
}

/**
 * Bulk assign consultants output
 */
export interface BulkAssignConsultantsOutput {
  success: boolean;
  assignedCount: number;
  errors?: Array<{
    payrollDateId: UUID;
    error: string;
  }>;
}

/**
 * Audit event input (for Hasura action)
 */
export interface CreateAuditEventInput {
  userId: UUID;
  action: string;
  resourceType: string;
  resourceId?: UUID;
  metadata?: JSONValue;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Audit event response
 */
export interface CreateAuditEventResponse {
  success: boolean;
  eventId?: UUID;
  message?: string;
}

// ===========================
// REST API Types
// ===========================

/**
 * File upload request
 */
export interface FileUploadRequest {
  file: File;
  entityType: "payroll" | "client" | "user";
  entityId: UUID;
  category?: string;
}

/**
 * File upload response
 */
export interface FileUploadResponse {
  fileId: UUID;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url: string;
}

/**
 * Export request
 */
export interface ExportRequest {
  format: "csv" | "xlsx" | "pdf";
  entityType: "payrolls" | "clients" | "staff" | "audit";
  filters?: Record<string, any>;
  columns?: string[];
}

/**
 * Export response
 */
export interface ExportResponse {
  exportId: UUID;
  status: "pending" | "processing" | "completed" | "failed";
  downloadUrl?: string;
  expiresAt?: Timestamptz;
  error?: string;
}

// ===========================
// Webhook Types
// ===========================

/**
 * Webhook event payload
 */
export interface WebhookEvent {
  id: UUID;
  type: "payroll.created" | "payroll.updated" | "leave.approved" | "user.invited";
  timestamp: Timestamptz;
  data: Record<string, any>;
  signature: string;
}

/**
 * Webhook response
 */
export interface WebhookResponse {
  received: boolean;
  processedAt: Timestamptz;
}

// ===========================
// Analytics Types
// ===========================

/**
 * Dashboard stats query result
 */
export interface DashboardStats {
  totalClients: number;
  activeClients: number;
  totalPayrolls: number;
  activePayrolls: number;
  totalEmployees: number;
  upcomingPayrollDates: number;
}

/**
 * Payroll analytics
 */
export interface PayrollAnalytics {
  payrollId: UUID;
  processingTime: {
    average: number;
    min: number;
    max: number;
  };
  employeeStats: {
    total: number;
    byStatus: Record<string, number>;
  };
  dateStats: {
    onTime: number;
    delayed: number;
    upcoming: number;
  };
}

// ===========================
// Error Handling Types
// ===========================

/**
 * Validation error
 */
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
  params?: Record<string, any>;
}

/**
 * Rate limit error
 */
export interface RateLimitError {
  limit: number;
  remaining: number;
  resetAt: Timestamptz;
  retryAfter: number;
}

// ===========================
// Cache Types
// ===========================

/**
 * Cache entry
 */
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  tags?: string[];
}

/**
 * Cache invalidation request
 */
export interface CacheInvalidationRequest {
  keys?: string[];
  tags?: string[];
  pattern?: string;
}

// ===========================
// Real-time Types
// ===========================

/**
 * Real-time notification
 */
export interface RealtimeNotification {
  type: "payroll_update" | "assignment_change" | "leave_status" | "system_alert";
  payload: Record<string, any>;
  timestamp: Timestamptz;
  userId?: UUID;
  broadcast?: boolean;
}

/**
 * WebSocket message
 */
export interface WebSocketMessage {
  id: string;
  type: "ping" | "pong" | "data" | "error" | "subscribe" | "unsubscribe";
  channel?: string;
  data?: any;
  error?: string;
}