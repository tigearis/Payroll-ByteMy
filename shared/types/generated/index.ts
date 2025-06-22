/**
 * THIS FILE IS AUTO-GENERATED - DO NOT EDIT MANUALLY
 * 
 * SOC2 Compliant GraphQL Operations
 * Security Classifications Applied:
 * - CRITICAL: Auth, user roles, financial data - Requires admin access + MFA
 * - HIGH: PII, client data, employee info - Requires role-based access
 * - MEDIUM: Internal business data - Requires authentication  
 * - LOW: Public/aggregate data - Basic access control
 * 
 * Compliance Features:
 * ✓ Role-based access control (RBAC)
 * ✓ Audit logging integration
 * ✓ Data classification enforcement
 * ✓ Permission boundary validation
 * ✓ Automatic domain isolation and exports
 * 
 * Generated: 2025-06-22T01:20:21.163Z
 * Schema Version: Latest from Hasura
 * CodeGen Version: Unified v2.0
 */

// Central export aggregator for all GraphQL operations

// Re-export fragment masking utilities
export * from './fragment-masking';

// Re-export gql utilities
export * from './gql';

// Re-export base types and generated operations
export * from './graphql';

// Auto-aggregate domain exports
export * from '../../../domains/auth/graphql/generated';
export * from '../../../domains/audit/graphql/generated';
export * from '../../../domains/permissions/graphql/generated';
export * from '../../../domains/users/graphql/generated';
export * from '../../../domains/clients/graphql/generated';
export * from '../../../domains/billing/graphql/generated';
export * from '../../../domains/payrolls/graphql/generated';
export * from '../../../domains/notes/graphql/generated';
export * from '../../../domains/leave/graphql/generated';
export * from '../../../domains/work-schedule/graphql/generated';
export * from '../../../domains/external-systems/graphql/generated';
// Shared operations exported directly above
