// types/index.ts
// Central type exports for the Payroll system
// Updated with optimized export structure (Priority 3 Technical Debt)

// ===========================
// Optimized Core Exports (Tree-shakable)
// ===========================

// Re-export optimized types for most common use cases
export * from "./optimized";

// ===========================
// Specialized Type Exports (Direct imports recommended)
// ===========================

// Core entities - for applications needing all entity types
export type {
  // All core entities
  User,
  Client,
  Payroll,
  Note,
  AuditLog,
  PayrollCycle,
  PayrollDateTypeEntity,
  WorkSchedule,
  LeaveRequest,
  PermissionOverride,
  BillingInvoice,
  BillingInvoiceItem,
  ClientExternalSystem,
  PayrollVersionData,
  AdjustmentRule,
} from "./core/entities";

// Extended relationships - for complex data operations
export type {
  // User relationships
  UserWithManager,
  UserWithTeam,
  UserWithPermissions,
  UserWithSchedule,
  UserWithLeave,
  UserComplete,

  // Client relationships
  ClientWithStats,
  ClientWithConsultants,
  ClientWithPayrolls,
  ClientWithBilling,
  ClientComplete,

  // Payroll relationships
  PayrollWithClient,
  PayrollWithConsultants,
  PayrollWithCycle,
  PayrollWithDates,
  PayrollWithVersions,
  PayrollWithAllRelations,

  // Computed types
  UserWorkload,
  ClientHealth,
  PayrollProcessingStatus,

  // Summary types
  UserSummary,
  ClientSummary,
  PayrollSummary,
  NoteSummary,
} from "./core/relations";

// Component and UI types
export type {
  // Form types
  FormField,
  FormValidation,
  FormState,
  SelectOption,
  PayrollInput,
  PayrollCreationData,
  NoteInput,
  LeaveRequestInput,

  // Notes component types (cross-domain)
  NotesListWithAddProps,
  NoteFromGraphQL,
  NotesModalProps,
  AddNoteProps,
  NoteData,

  // Table types
  TableColumn,
  TableSort,
  TableFilter,
  PaginationState,

  // Modal types
  ModalProps,
  ConfirmationDialogProps,

  // Calendar types
  CalendarEvent,
  CalendarViewConfig,
  DateRange,

  // Dashboard types
  StatCard,
  ChartDataPoint,
  DashboardFilters,

  // Component props
  PayrollFormProps,
  CreateUserModalProps,
  LeaveRequestFormProps,
  PermissionOverrideModalProps,
  PermissionOverrideInput,

  // Notification types
  ToastNotification,
  AppNotification,

  // Search & filter
  SearchConfig,
  FilterChip,

  // Layout types
  BreadcrumbItem,
  NavItem,
  PageHeaderProps,

  // Error & loading
  ErrorFallbackProps,
  SkeletonConfig,
} from "./components";

// API and GraphQL types
export type {
  // Generic API
  ApiResponse,
  ApiError,
  PaginatedResponse,
  BatchOperationResult,

  // GraphQL
  GraphQLResult,
  GraphQLMutationResult,
  GraphQLSubscriptionResult,

  // Authentication
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,

  // Hasura actions
  GeneratePayrollDatesInput,
  GeneratePayrollDatesArgs,
  GeneratePayrollDatesOutput,
  BulkAssignConsultantsInput,
  BulkAssignConsultantsOutput,
  CreateAuditEventInput,
  CreateAuditEventResponse,

  // REST API
  FileUploadRequest,
  FileUploadResponse,
  ExportRequest,
  ExportResponse,

  // Webhooks
  WebhookEvent,
  WebhookResponse,

  // Analytics
  DashboardStats,
  PayrollAnalytics,

  // Error handling
  ValidationError,
  RateLimitError,

  // Cache
  CacheEntry,
  CacheInvalidationRequest,

  // Real-time
  RealtimeNotification,
  WebSocketMessage,
} from "./api";

// ===========================
// Global Types
// ===========================
// Note: Global types like PayrollStatus, UUID, etc. are automatically
// available via global.d.ts and don't need to be explicitly exported

// ===========================
// Legacy Compatibility
// ===========================
// These re-exports maintain compatibility with existing imports
// TODO: Remove these after migration is complete

// ===========================
// Type Guards & Utilities
// ===========================

/**
 * Type guard to check if a value is a valid PayrollStatus
 */
export function isPayrollStatus(value: any): value is PayrollStatus {
  return (
    typeof value === "string" &&
    [
      "Processing",
      "Draft",
      "PendingApproval",
      "Approved",
      "Completed",
      "Failed",
      "PendingReview",
      "Issue",
      "Pending",
    ].includes(value)
  );
}

/**
 * Type guard to check if a value is a valid Role
 */
export function isRole(value: any): value is Role {
  return (
    typeof value === "string" &&
    ["developer", "org_admin", "manager", "consultant", "viewer"].includes(
      value
    )
  );
}

/**
 * Type guard to check if a value is a valid EntityType
 */
export function isEntityType(value: any): value is EntityType {
  return typeof value === "string" && ["payroll", "client"].includes(value);
}

// ===========================
// Development Helpers
// ===========================

if (process.env.NODE_ENV === "development") {
  // Development-only type exports for debugging
  // These help with type inspection during development

  console.log("🔧 Development mode: Type system loaded");
  console.log(
    "📋 Available global types: PayrollStatus, Role, UUID, Timestamp, etc."
  );
  console.log("🏗️  Business types: Payroll, Client, User, Note, etc.");
  console.log("🎨 Component types: FormField, TableColumn, ModalProps, etc.");
  console.log("🌐 API types: ApiResponse, GraphQLResult, etc.");
}
