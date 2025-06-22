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
 * Generated: 2025-06-22T10:26:18.713Z
 * Schema Version: Latest from Hasura
 * CodeGen Version: Unified v2.0
 */


/* 
 * DOMAIN: AUDIT
 * SECURITY LEVEL: CRITICAL
 * ACCESS CONTROLS: Admin + MFA + Full Audit
 * AUTO-EXPORTED: This file is automatically exported from domain index
 */


// Auto-generated domain exports - isolated to prevent conflicts

// Export domain-specific GraphQL operations and types
export * from './graphql/generated/graphql';

// Note: Fragment masking and gql utilities are exported from shared/types/generated
// Import those directly when needed to avoid conflicts
