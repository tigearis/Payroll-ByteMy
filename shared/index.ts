/**
 * Shared Types and Operations Index
 *
 * Central export point for cross-domain types and operations
 * Auto-managed by codegen - exports are automatically updated
 */

// Export core shared utilities
export * from "./common";
export * from "./error-handling";
export * from "./validation";

// Export generated types (auto-managed by codegen)
export * from "./types/generated";

// Dashboard operations - imported from domain GraphQL files
export {
  GET_DASHBOARD_STATS,
  GET_UPCOMING_PAYROLLS,
  GET_ALERTS,
  GET_SYSTEM_HEALTH,
  GET_SECURITY_OVERVIEW,
  GET_COMPLIANCE_REPORT,
} from "./graphql/queries.graphql";
