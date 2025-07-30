# GraphQL Mutation Fix - User Roles

## Issue Description
Apollo GraphQL errors were occurring when trying to manage user role assignments:

```
[Apollo Error in RemoveExistingRoleAssignments]: {
  type: 'unknown',
  message: "field 'deleteUserRoles' not found in type: 'mutation_root'",
}

[Apollo Error in InsertUserRoleAssignment]: {
  type: 'unknown',
  message: "field 'insertUserRolesOne' not found in type: 'mutation_root'",
}
```

## Root Cause
The GraphQL mutations were using incorrect field names that didn't match the Hasura schema configuration.

## Analysis
Checked the Hasura metadata for the `user_roles` table in:
`/hasura/metadata/databases/default/tables/public_user_roles.yaml`

Found the correct custom root fields:
```yaml
custom_root_fields:
  delete: bulkDeleteUserRoles          # ❌ Code was using: deleteUserRoles
  delete_by_pk: deleteUserRoleById
  insert: bulkInsertUserRoles
  insert_one: insertUserRole           # ❌ Code was using: insertUserRolesOne
  select: userRoles
  select_aggregate: userRolesAggregate
  select_by_pk: userRoleById
  update: bulkUpdateUserRoles
  update_by_pk: updateUserRoleById
```

## Fix Applied

### 1. Fixed hierarchical-permissions.ts
**Before:**
```typescript
mutation RemoveExistingRoleAssignments($userId: uuid!) {
  deleteUserRoles(where: { userId: { _eq: $userId } }) {
    affectedRows
  }
}

mutation InsertUserRoleAssignment($userId: uuid!, $roleId: uuid!) {
  insertUserRolesOne(object: { userId: $userId, roleId: $roleId }) {
    id
    userId
    roleId
  }
}
```

**After:**
```typescript
mutation RemoveExistingRoleAssignments($userId: uuid!) {
  bulkDeleteUserRoles(where: { userId: { _eq: $userId } }) {
    affectedRows
  }
}

mutation InsertUserRoleAssignment($userId: uuid!, $roleId: uuid!) {
  insertUserRole(object: { userId: $userId, roleId: $roleId }) {
    id
    userId
    roleId
  }
}
```

### 2. Fixed database-permissions.ts
Applied the same corrections to the database permissions file.

## Changes Made
- `deleteUserRoles` → `bulkDeleteUserRoles`
- `insertUserRolesOne` → `insertUserRole`

## Files Modified
- `/lib/permissions/hierarchical-permissions.ts`
- `/lib/permissions/database-permissions.ts`

## Testing
1. ✅ Verified Hasura schema configuration
2. ✅ Updated all occurrences in both permission files
3. ✅ Confirmed no other files use the incorrect mutations

## Expected Result
User role assignment operations should now work correctly without Apollo GraphQL errors.

## Related Systems
This fix affects:
- User role assignment functionality
- Permission management system
- Role hierarchy operations
- Staff management role changes