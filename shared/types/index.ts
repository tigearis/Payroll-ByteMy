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
 * Generated: 2025-06-25T21:33:44.046Z
 * Schema Version: Latest from Hasura
 * CodeGen Version: Unified v3.0
 */

// Central export aggregator for GraphQL operations

// Base types (single source of truth)
export * from './base-types';

// Shared operations and hooks
export * from './generated';

// Domain-specific exports available at:
// import { useGetUserQuery } from '../../../domains/users/graphql/generated';
// import { useCreateNoteQuery } from '../../../domains/notes/graphql/generated';

// Re-export commonly used utilities
export { gql } from './generated';
