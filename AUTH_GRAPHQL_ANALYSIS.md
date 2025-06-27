# Auth Domain GraphQL Operations Analysis Report

## Overview
This report analyzes all GraphQL operations in the auth domain (`domains/auth/graphql/`) for schema conformance, field naming conventions, and type compatibility.

## Analysis Results

### 1. QUERIES (domains/auth/graphql/queries.graphql)

#### GetCurrentUserRoles (Line 7)
- **Status**: ✅ Schema Conformant
- **Fields**: All fields match schema (camelCase)
- **Usage**: Not found in components/hooks

#### GetAllRoles (Line 41)
- **Status**: ✅ Schema Conformant
- **Fields**: All fields match schema
- **Notes**: Uses `orderBy` with DESC on priority field
- **Usage**: Not found in components/hooks

#### GetResourcesAndPermissions (Line 68)
- **Status**: ✅ Schema Conformant
- **Fields**: All fields match schema
- **Usage**: Not found in components/hooks

#### GetUsersWithRoles (Line 83)
- **Status**: ✅ Schema Conformant
- **Variables**: `$limit: Int = 50, $offset: Int = 0`
- **Usage**: Not found in components/hooks

#### GetUserPermissionOverrides (Line 102)
- **Status**: ✅ Schema Conformant
- **Variables**: `$userId: uuid!`
- **Fields**: All match schema
- **Usage**: Not found in components/hooks

#### GetRolePermissionOverrides (Line 117)
- **Status**: ✅ Schema Conformant
- **Variables**: `$roleName: String!`
- **Usage**: Not found in components/hooks

#### SearchUsersByEmail (Line 132)
- **Status**: ✅ Schema Conformant
- **Variables**: `$emailPattern: String!`
- **Uses**: `_ilike` operator for pattern matching
- **Usage**: Not found in components/hooks

#### GetRoleHierarchy (Line 151)
- **Status**: ✅ Schema Conformant
- **Fields**: Uses aggregate fields correctly
- **Usage**: Not found in components/hooks

#### GetPermissionAuditLogs (Line 175)
- **Status**: ✅ Schema Conformant
- **Variables**: All timestamptz types correct
- **Usage**: Not found in components/hooks

#### GetPendingInvitations (Line 205)
- **Status**: ✅ Schema Conformant
- **Uses**: Fragment `UserInvitationDetail`
- **Usage**: Not found in components/hooks

#### GetInvitationByTicket (Line 217)
- **Status**: ✅ Schema Conformant
- **Variables**: `$clerkTicket: String!`
- **Usage**: Not found in components/hooks

#### GetInvitationHistory (Line 224)
- **Status**: ✅ Schema Conformant
- **Fields**: All match schema
- **Usage**: Not found in components/hooks

#### GetInvitationsBySender (Line 252)
- **Status**: ✅ Schema Conformant
- **Variables**: `$invitedBy: uuid!`
- **Usage**: Not found in components/hooks

#### GetExpiredInvitations (Line 275)
- **Status**: ✅ Schema Conformant
- **Complex where clause with `_or` operator
- **Usage**: Not found in components/hooks

#### ValidateInvitationRolePermissions (Line 287)
- **Status**: ✅ Schema Conformant
- **Variables**: Both variables correct types
- **Usage**: Not found in components/hooks

#### GetInvitationById (Line 321)
- **Status**: ✅ Schema Conformant
- **Uses**: `userInvitationById` query
- **Usage**: Not found in components/hooks

#### GetResendableInvitations (Line 328)
- **Status**: ✅ Schema Conformant
- **Uses**: `_in` operator for status filtering
- **Usage**: Not found in components/hooks

### 2. MUTATIONS (domains/auth/graphql/mutations.graphql)

#### AssignRoleToUser (Line 11)
- **Status**: ✅ Schema Conformant
- **Mutation**: `insertUserRole`
- **Variables**: `$userId: uuid!, $roleId: uuid!`
- **Usage**: Not found in components/hooks

#### RemoveRoleFromUser (Line 25)
- **Status**: ✅ Schema Conformant
- **Mutation**: `deleteUserRoleById`
- **Usage**: Not found in components/hooks

#### UpdateUserRoleAssignment (Line 33)
- **Status**: ✅ Schema Conformant
- **Mutation**: `updateUserRoleById`
- **Uses**: `userRolesSetInput` type
- **Usage**: Not found in components/hooks

#### SetUserRoles (Line 43)
- **Status**: ✅ Schema Conformant
- **Uses**: `bulkDeleteUserRoles` and `bulkInsertUserRoles`
- **Variables**: Correctly typed
- **Usage**: Not found in components/hooks

#### CreateUserPermissionOverride (Line 70)
- **Status**: ✅ Schema Conformant
- **Mutation**: `insertPermissionOverride`
- **All fields match schema types
- **Usage**: Not found in components/hooks

#### UpdateUserPermissionOverride (Line 103)
- **Status**: ✅ Schema Conformant
- **Uses**: `permissionOverridesSetInput`
- **Usage**: Not found in components/hooks

#### RemoveUserPermissionOverride (Line 120)
- **Status**: ✅ Schema Conformant
- **Mutation**: `deletePermissionOverrideById`
- **Usage**: Not found in components/hooks

#### CreateUserInvitation (Line 135)
- **Status**: ✅ Schema Conformant
- **All fields match schema types
- **Uses fragment correctly
- **Usage**: Not found in components/hooks

#### CompleteInvitationAcceptance (Line 167)
- **Status**: ✅ Schema Conformant
- **Two mutations: `insertUser` and `updateUserInvitationById`
- **Usage**: Not found in components/hooks

#### AssignInvitationRole (Line 200)
- **Status**: ✅ Schema Conformant
- **Mutation**: `insertUserRole`
- **Usage**: Not found in components/hooks

#### CancelUserInvitation (Line 218)
- **Status**: ✅ Schema Conformant
- **Sets status to "cancelled"
- **Usage**: Not found in components/hooks

#### ResendUserInvitation (Line 228)
- **Status**: ✅ Schema Conformant
- **Updates multiple fields correctly
- **Usage**: Not found in components/hooks

#### MarkExpiredInvitations (Line 249)
- **Status**: ✅ Schema Conformant
- **Bulk operation with correct where clause
- **Usage**: Not found in components/hooks

### 3. SUBSCRIPTIONS (domains/auth/graphql/subscriptions.graphql)

#### UserAuthStatusUpdates (Line 6)
- **Status**: ✅ Schema Conformant
- **Fields**: All match schema including `deactivatedAt`, `deactivatedBy`
- **Usage**: Not found in components/hooks

#### UserSessionUpdates (Line 17)
- **Status**: ✅ Schema Conformant
- **Uses**: `clerkUserId` field correctly
- **Usage**: Not found in components/hooks

#### AuthEventsUpdates (Line 27)
- **Status**: ✅ Schema Conformant
- **All fields match `authEvents` table
- **Usage**: Not found in components/hooks

#### UserRoleUpdates (Line 45)
- **Status**: ✅ Schema Conformant
- **Nested relationships correct
- **Usage**: Not found in components/hooks

#### UserPermissionUpdates (Line 66)
- **Status**: ✅ Schema Conformant
- **Complex nested structure correct
- **Usage**: Not found in components/hooks

#### RolePermissionChanges (Line 94)
- **Status**: ✅ Schema Conformant
- **Table**: `rolePermissions`
- **Usage**: Not found in components/hooks

#### FailedAuthAttemptsUpdates (Line 115)
- **Status**: ✅ Schema Conformant
- **Uses interval syntax correctly
- **Usage**: Not found in components/hooks

#### SuspiciousActivityUpdates (Line 133)
- **Status**: ✅ Schema Conformant
- **Complex `_or` condition correct
- **Usage**: Not found in components/hooks

#### SecurityAlertsUpdates (Line 155)
- **Status**: ✅ Schema Conformant
- **Uses `_in` operator correctly
- **Usage**: Not found in components/hooks

#### PermissionChangesUpdates (Line 178)
- **Status**: ✅ Schema Conformant
- **Table**: `permissionAuditLogs`
- **Usage**: Not found in components/hooks

#### RoleAssignmentUpdates (Line 199)
- **Status**: ✅ Schema Conformant
- **Relationships correct
- **Usage**: Not found in components/hooks

#### AuthSystemHealthUpdates (Line 221)
- **Status**: ✅ Schema Conformant
- **Usage**: Not found in components/hooks

#### ActiveSessionsUpdates (Line 239)
- **Status**: ✅ Schema Conformant
- **Usage**: Not found in components/hooks

#### UserSecurityStatusUpdates (Line 255)
- **Status**: ✅ Schema Conformant
- **Usage**: Not found in components/hooks

#### MFAEventsUpdates (Line 264)
- **Status**: ✅ Schema Conformant
- **Uses `_like` operator for pattern matching
- **Usage**: Not found in components/hooks

#### UserDeactivationUpdates (Line 283)
- **Status**: ✅ Schema Conformant
- **Note**: Comment mentions `deactivatedBy` is UUID, not relationship
- **Usage**: Not found in components/hooks

#### PrivilegeChangesUpdates (Line 301)
- **Status**: ✅ Schema Conformant
- **Uses role enum values correctly
- **Usage**: Not found in components/hooks

#### ComplianceEventsUpdates (Line 324)
- **Status**: ✅ Schema Conformant
- **All action values match schema
- **Usage**: Not found in components/hooks

#### DataAccessMonitoring (Line 354)
- **Status**: ✅ Schema Conformant
- **Table**: `dataAccessLogs`
- **Usage**: Not found in components/hooks

#### SecurityIncidentsUpdates (Line 376)
- **Status**: ✅ Schema Conformant
- **All event types valid
- **Usage**: Not found in components/hooks

#### EmergencyAuthUpdates (Line 399)
- **Status**: ✅ Schema Conformant
- **Usage**: Not found in components/hooks

### 4. FRAGMENTS (domains/auth/graphql/fragments.graphql)

All fragments are properly defined and use correct field names:
- ✅ AuthUserCore
- ✅ AuthUserWithRoles
- ✅ AuthRoleCore
- ✅ AuthPermissionCore
- ✅ AuthUserRoleWithDetails
- ✅ PermissionOverrideCore
- ✅ UserInvitationCore
- ✅ UserInvitationWithDetails
- ✅ UserInvitationDetail (defined in queries.graphql)

## Key Findings

### ✅ Positive Findings
1. **100% Schema Conformance**: All GraphQL operations are fully compliant with the schema
2. **Correct Field Naming**: All fields use camelCase as required
3. **Proper Type Usage**: All variables and return types match schema exactly
4. **Correct Scalar Usage**: uuid, timestamptz, jsonb, numeric all used correctly
5. **Proper Enum Usage**: user_role scalar type used correctly (not an enum in schema)
6. **Fragment Reusability**: Good use of fragments for common field sets

### ⚠️ Areas of Concern
1. **No Component Usage Found**: None of the generated hooks are being used in components
2. **user_role Type**: The schema defines `user_role` as a scalar, not an enum
3. **Limited Code Reuse**: Many queries could benefit from more fragment usage

### 📝 Recommendations
1. **Implement Hook Usage**: Start using the generated hooks in components
2. **Add Type Safety**: Ensure all components use the generated TypeScript types
3. **Fragment Optimization**: Create more shared fragments for common patterns
4. **Error Handling**: Add error handling fragments for mutations
5. **Documentation**: Add JSDoc comments to queries for better IDE support

## Schema Conformance Summary
- **Total Operations**: 50
- **Conformant**: 50 (100%)
- **Non-Conformant**: 0 (0%)
- **Queries**: 17 (all conformant)
- **Mutations**: 13 (all conformant)
- **Subscriptions**: 20 (all conformant)
- **Fragments**: 9 (all conformant)

## Conclusion
The auth domain GraphQL operations are fully compliant with the Hasura schema. All field names, types, and structures match the expected schema definitions. The main opportunity for improvement is in actually using these operations in the application components.