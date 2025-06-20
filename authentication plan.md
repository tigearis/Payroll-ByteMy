# Comprehensive Claude Code Prompt for Clerk Custom Roles & Hasura Integration Analysis

## Executive Summary

This prompt will guide Claude Code through a systematic analysis of your codebase's authentication implementation using Clerk with custom roles stored in `public_metadata` and Hasura GraphQL integration. The analysis focuses on ensuring proper role hierarchy implementation, SOC 2 compliance, eliminating code duplication, and optimizing the Hasura JWT integration.

## The Claude Code Prompt

````markdown
# Authentication System Deep-Dive: Clerk Custom Roles with Hasura Integration Analysis

## Context

I need to perform a comprehensive analysis of this codebase's authentication implementation, which uses Clerk with custom roles stored in `public_metadata` and integrates with Hasura GraphQL. The system uses a specific role hierarchy and JWT template for Hasura claims.

## Target Architecture Overview

The system should implement:

- **Custom Role Hierarchy**: developer → org_admin → manager → consultant → viewer
- **Hasura Integration**: Using JWT claims with specific template
- **Role Storage**: Roles stored in Clerk's `public_metadata`
- **Database Integration**: Using `databaseId` from `public_metadata`

## Expected JWT Template

```json
{
  "https://hasura.io/jwt/claims": {
    "metadata": "{{user.public_metadata}}",
    "x-hasura-role": "{{user.public_metadata.role}}",
    "x-hasura-user-id": "{{user.public_metadata.databaseId}}",
    "x-hasura-default-role": "viewer",
    "x-hasura-allowed-roles": [
      "developer",
      "org_admin",
      "manager",
      "consultant",
      "viewer"
    ],
    "x-hasura-clerk-user-id": "{{user.id}}"
  }
}
```
````

## Phase 1: Current Implementation Analysis

### 1.1 Clerk JWT Template Verification

**Critical Check**: Verify the JWT template is correctly configured:

- Locate Clerk Dashboard JWT template configuration
- Confirm exact match with expected template above
- Check for any custom claims additions or modifications
- Verify Hasura namespace compliance

### 1.2 Role Storage and Management Analysis

**Public Metadata Usage:**

```typescript
// Look for patterns in:
- User role assignment logic
- public_metadata updates (role, databaseId)
- Role validation middleware
- Permission checking functions
- Database synchronization with databaseId
```

**Role Hierarchy Implementation:**

- Verify role precedence: developer > org_admin > manager > consultant > viewer
- Check inheritance logic (higher roles inheriting lower role permissions)
- Validate role assignment restrictions
- Ensure role downgrade/upgrade workflows

### 1.3 Hasura Integration Points

**Frontend Integration:**

```typescript
// Search for:
- Apollo Client setup with Clerk authentication headers
- JWT token extraction and header injection
- GraphQL queries with role-based permissions
- Client-side role checking before GraphQL calls
```

**Backend Integration:**

```typescript
// Check for:
- Clerk webhook handlers for user events
- Database user synchronization logic
- Role change propagation to Hasura
- Session management with Hasura context
```

## Phase 2: Custom Role System Security Audit

### 2.1 Role Assignment Security

**Critical Security Checks:**

```typescript
// Look for vulnerabilities in:
- Who can assign/modify roles (should be org_admin+ only)
- Client-side role modifications (major security risk)
- Missing server-side validation of role changes
- Direct public_metadata manipulation without authorization
- Privilege escalation prevention
```

**Role Validation Patterns:**

```typescript
// Verify proper patterns:
- Server-side role verification on sensitive operations
- Role hierarchy enforcement (manager can't promote to org_admin)
- Audit logging of all role changes
- Rate limiting on role modification attempts
```

### 2.2 Public Metadata Security Analysis

**Metadata Security Issues:**

```typescript
// Check for:
- Sensitive data stored in public_metadata (should only be role, databaseId)
- Missing encryption of metadata at rest
- Overly permissive metadata access patterns
- Inconsistent metadata validation
- Client-side metadata tampering possibilities
```

### 2.3 Hasura Permission Security

**GraphQL Security:**

```typescript
// Analyze:
- Row-level security implementation in Hasura
- Proper role-based query restrictions
- Column permissions per role level
- Mutation permissions and restrictions
- Aggregation query permissions
- Relationship access controls
```

## Phase 3: Role Hierarchy Implementation Audit

### 3.1 Hierarchy Logic Verification

**Role Precedence Checks:**

```typescript
// Verify implementation of:
const roleHierarchy = {
  developer: 5, // Highest access
  org_admin: 4, // Admin privileges
  manager: 3, // Management access
  consultant: 2, // Professional access
  viewer: 1, // Basic read-only
};
```

**Permission Inheritance:**

```typescript
// Check for proper inheritance:
- Can developer access all manager/consultant/viewer resources?
- Can org_admin manage users but not system settings?
- Can manager assign consultant/viewer roles but not org_admin?
- Can consultant only view and limited edit?
- Can viewer only read permitted data?
```

### 3.2 Database Synchronization

**User Record Management:**

```typescript
// Verify:
- databaseId consistency between Clerk and database
- User creation workflow (Clerk → Database sync)
- Role change propagation to database
- Orphaned record cleanup processes
- Database constraints matching role permissions
```

## Phase 4: Hasura Integration Deep-Dive

### 4.1 JWT Configuration Audit

**Template Verification:**

- Exact match with provided JWT template
- Proper Hasura namespace (`https://hasura.io/jwt/claims`)
- Correct role extraction from `public_metadata.role`
- Valid `databaseId` mapping to `x-hasura-user-id`
- Complete allowed roles list

### 4.2 GraphQL Security Analysis

**Query Protection:**

```graphql
# Check for proper role-based restrictions:
- developer: Full access to all tables/operations
- org_admin: User management, org-level data access
- manager: Team data, limited user operations
- consultant: Project data, own profile
- viewer: Read-only access to permitted data
```

**Permission Rules Audit:**

```typescript
// Verify Hasura permissions for each role:
- Select permissions (what data can be read)
- Insert permissions (what data can be created)
- Update permissions (what data can be modified)
- Delete permissions (what data can be removed)
- Column permissions (field-level access)
- Row permissions (record-level filtering)
```

### 4.3 Real-time Subscription Security

**Subscription Permissions:**

```typescript
// Check for:
- Role-based subscription filtering
- Live query permissions
- Event trigger security
- Websocket authentication handling
- Data exposure in real-time updates
```

## Phase 5: SOC 2 Compliance for Custom Roles

### 5.1 Access Control Compliance

**Role-Based Access Control (RBAC):**

- Principle of least privilege implementation
- Clear role definitions and responsibilities
- Regular access reviews and role audits
- Automated role provisioning/deprovisioning
- Segregation of duties enforcement

### 5.2 Audit Logging Requirements

**Required Audit Events:**

```typescript
// Must log:
- Role assignments and changes (who, what, when, why)
- Authentication attempts (success/failure)
- Permission escalation attempts
- Sensitive data access (developer/org_admin level)
- Administrative actions
- Database modifications through roles
```

**Log Format Requirements:**

```json
{
  "timestamp": "ISO8601",
  "userId": "clerk_user_id",
  "databaseId": "internal_db_id",
  "action": "role_change",
  "oldRole": "consultant",
  "newRole": "manager",
  "performedBy": "org_admin_user_id",
  "ipAddress": "x.x.x.x",
  "sessionId": "session_identifier",
  "outcome": "success"
}
```

### 5.3 Data Protection Compliance

**Encryption and Security:**

- Role data encryption at rest
- TLS 1.2+ for all authentication traffic
- Secure JWT signing and validation
- Proper session management with timeouts
- MFA enforcement for admin roles (org_admin, developer)

## Phase 6: Code Duplication and Performance Analysis

### 6.1 Role Checking Duplication

**Common Duplication Patterns:**

```typescript
// Look for repeated code:
- Multiple role checking functions
- Duplicate permission validation logic
- Repeated Hasura header setup
- Multiple JWT decoding implementations
- Redundant role hierarchy checks
```

### 6.2 Performance Bottlenecks

**Critical Performance Issues:**

```typescript
// Identify:
- Synchronous role checks on every request
- Missing role/permission caching
- Excessive Clerk API calls for user metadata
- N+1 queries in role-based data fetching
- Inefficient GraphQL query patterns
- Missing database indexes for role-based queries
```

### 6.3 Hasura Query Optimization

**GraphQL Performance:**

```typescript
// Analyze:
- Over-fetching data due to loose permissions
- Missing query complexity limits
- Inefficient subscription patterns
- Redundant permission checks in nested queries
- Missing query caching strategies
```

## Phase 7: Implementation Recommendations

### 7.1 Security Hardening Priority

**Critical (Fix Immediately):**

- Client-side role modifications
- Missing server-side role validation
- Privilege escalation vulnerabilities
- Insecure direct object references
- Missing audit logging

**High Priority (Within 2 weeks):**

- Implement proper role hierarchy enforcement
- Add comprehensive audit logging
- Secure public_metadata handling
- Implement rate limiting on role changes

### 7.2 Performance Optimization

**Role Caching Strategy:**

```typescript
// Implement:
- Redis caching for user roles and permissions
- JWT caching with proper expiration
- Database query optimization for role-based access
- GraphQL query result caching
- Efficient role hierarchy lookups
```

### 7.3 Code Consolidation Plan

**Create Shared Utilities:**

```typescript
// Consolidate into:
- Central role validation service
- Shared permission checking utilities
- Common Hasura client configuration
- Unified audit logging service
- Reusable role-based React components
```

## Phase 8: Testing and Validation Strategy

### 8.1 Role Security Testing

**Test Scenarios:**

```typescript
// Verify:
- Role escalation prevention
- Cross-role data access restrictions
- JWT tampering detection
- Session security across roles
- Database permission enforcement
```

### 8.2 Hasura Integration Testing

**GraphQL Security Tests:**

```typescript
// Test each role's access:
- Query permissions by role
- Mutation restrictions
- Subscription filtering
- Row-level security
- Column-level permissions
```

## Expected Deliverables

### 1. Security Assessment Report

- Role hierarchy security analysis
- JWT template configuration verification
- Hasura permission audit results
- Critical vulnerability findings with severity ratings

### 2. Performance Analysis Report

- Role checking performance metrics
- GraphQL query optimization recommendations
- Caching strategy implementation plan
- Database optimization suggestions

### 3. SOC 2 Compliance Report

- Audit logging compliance status
- Access control implementation review
- Data protection compliance verification
- Remediation plan for compliance gaps

### 4. Code Quality Report

- Duplication analysis with consolidation recommendations
- Best practices implementation status
- Technical debt assessment
- Refactoring priority matrix

### 5. Implementation Roadmap

- Phased security improvements
- Performance optimization timeline
- Code consolidation plan
- Testing and validation procedures

## Analysis Execution Instructions

1. **Start with JWT Template Verification**: Ensure the Hasura integration is correctly configured
2. **Deep-dive into Role Management**: Analyze how roles are assigned, validated, and enforced
3. **Security-First Approach**: Prioritize finding security vulnerabilities in the custom role system
4. **Performance Analysis**: Identify bottlenecks in role checking and GraphQL operations
5. **Compliance Check**: Verify SOC 2 requirements are met with current implementation

## Critical Questions to Answer

1. **Is the JWT template exactly matching the expected format?**
2. **Are roles properly validated server-side before database operations?**
3. **Is the role hierarchy correctly implemented with proper inheritance?**
4. **Are Hasura permissions properly configured for each role level?**
5. **Is audit logging comprehensive enough for SOC 2 compliance?**
6. **Are there any privilege escalation vulnerabilities?**
7. **Is performance optimized for role-based operations?**
8. **Is the public_metadata usage secure and compliant?**

## Specific Code Patterns to Examine

### Role Assignment Pattern

```typescript
// Look for secure patterns like:
const assignRole = async (
  userId: string,
  newRole: Role,
  assignedBy: string
) => {
  // Verify assignedBy has permission to assign newRole
  // Log the role change
  // Update Clerk public_metadata
  // Sync with database
  // Invalidate caches
};
```

### Permission Checking Pattern

```typescript
// Look for consistent patterns like:
const hasPermission = (userRole: Role, requiredRole: Role): boolean => {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};
```

### Hasura Header Setup Pattern

```typescript
// Verify proper JWT extraction:
const getHasuraHeaders = (clerkToken: string) => {
  return {
    Authorization: `Bearer ${clerkToken}`,
    "X-Hasura-Role": extractRoleFromJWT(clerkToken),
  };
};
```

Please proceed with the analysis, focusing on the custom role implementation, Hasura integration security, and ensuring the system is optimized, secure, and compliant.

```

## Key Differences from Organizations Approach

This updated prompt specifically focuses on:

1. **Custom Role Storage**: Using `public_metadata` instead of Clerk Organizations
2. **Hasura Integration**: Deep analysis of the JWT template and GraphQL permissions
3. **Role Hierarchy**: Specific focus on your 5-tier role system
4. **Database Synchronization**: Analysis of `databaseId` usage and sync patterns
5. **Custom Permission Logic**: Since you're not using Organizations, focuses on custom permission implementations

## Usage with Claude Code

1. Copy this prompt and paste it when running Claude Code in your project directory
2. Claude Code will systematically analyze your authentication implementation
3. It will specifically look for the JWT template configuration and validate it matches your expected format
4. The analysis will focus on custom role security rather than Organization features

This approach respects your architectural decision to use custom roles with Hasura while ensuring you get comprehensive security and performance analysis tailored to your specific implementation.
```
