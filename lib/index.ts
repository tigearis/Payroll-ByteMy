/**
 * DRY Principle Implementation Library
 *
 * Centralized exports for all DRY (Don't Repeat Yourself) utilities
 * to eliminate code duplication across the application.
 */

// API Route Helpers
export * from "./api/route-helpers";

// Validation Schemas
export * from "./validation/shared-schemas";

// Loading & Error Components
export * from "./components/loading-error-boundary";

// Table Column Factories
export * from "./table/column-factories";

// Permission Hooks
export * from "./hooks/use-standardized-permissions";

// Re-export commonly used utilities
export { cn } from "./utils";
export * from "./utils/date-utils";
export * from "./utils/role-utils";

// Design tokens (already available)
export { tokens } from "./design-tokens";

/**
 * Quick Reference Guide:
 *
 * 1. API Routes: Use withErrorHandling(), successResponse(), errorResponse()
 * 2. Validation: Use *Schemas from shared-schemas (UserSchemas, ClientSchemas, etc.)
 * 3. Loading States: Use DataWrapper, PageLoading, LoadingCard, LoadingTable
 * 4. Error Handling: Use ErrorBoundary, ErrorFallback, useAsyncState
 * 5. Tables: Use ColumnFactories.* and CommonColumnSets.*
 * 6. Permissions: Use usePermissions(), PermissionPresets.*
 * 7. GraphQL: Use fragments from shared/graphql/fragments.graphql
 *
 * See lib/dry-implementation-examples.tsx for complete usage examples.
 */

// Type exports for convenience
// Narrow type re-exports to avoid missing module './types'

// Common patterns as ready-to-use utilities
export const DryPatterns = {
  // Standard CRUD page structure
  crudPage: {
    permissions: ["create", "read", "update", "delete"] as const,
    actions: ["view", "edit", "delete"] as const,
  },

  // Common table configurations
  table: {
    essentialColumns: 4,
    maxColumns: 6,
    virtualizationThreshold: 150,
  },

  // Standard form patterns
  form: {
    commonFields: ["name", "email", "phone", "address"] as const,
    requiredValidation: { min: 1, message: "This field is required" },
  },

  // API response patterns
  api: {
    successCodes: [200, 201] as const,
    errorCodes: [400, 401, 403, 404, 500] as const,
  },
} as const;
