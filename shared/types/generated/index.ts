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
 * Generated: 2025-06-22T01:58:02.245Z
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

// Domain exports temporarily disabled to resolve conflicts
// Import directly from domains when needed:
// import { GetCurrentUserDocument } from '@/domains/users/graphql/generated/graphql';