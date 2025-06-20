# Permission System Alignment

This document outlines how the permission system in the application aligns with the architecture described in CLAUDE.md.

## Overview

The application uses a permission-based access control system that follows the principles outlined in CLAUDE.md. The system is based on:

1. A hierarchical role system with 5 roles: developer > org_admin > manager > consultant > viewer
2. 18 specific permissions that are assigned to each role
3. Permission-based UI guards that restrict access to components and pages
4. Type-safe permission checking through TypeScript interfaces

## Recent Changes

### Removal of "editor" Role

We've identified that the codebase was using an `EditorGuard` component that checked for a non-existent "editor" role. This was causing inconsistency between the permission system implementation and the documentation.

Instead of adding an "editor" role to the hierarchy, we've replaced the role-based check with a permission-based check. The `EditorGuard` has been replaced with `CanEditPayrolls`, which checks for the `custom:payroll:write` permission.

This change aligns better with the permission-based approach described in CLAUDE.md, where access should be controlled by specific permissions rather than roles whenever possible.

### Migration Script

A migration script (`scripts/migrate-legacy-permissions.js`) has been created to help identify and replace legacy permission system usage with the enhanced permission system. This script:

1. Scans the codebase for legacy permission patterns
2. Provides guidance on how to replace them
3. Can perform automatic replacements with confirmation

## Remaining Legacy Permission System Usage

The migration script identified approximately 92 instances of legacy permission system usage across the codebase. These include:

1. **useRoleHierarchy** (5 instances) - Should be replaced with useEnhancedPermissions
2. **useUserRole** (12 instances) - Should be replaced with useEnhancedPermissions
3. **PermissionGuard** - Should be replaced with EnhancedPermissionGuard
4. **Various role-based guards** - Should be replaced with their EnhancedPermissionGuard equivalents

These legacy components and hooks should be systematically replaced to ensure full alignment with the architecture described in CLAUDE.md.

## Permission System Components

### 1. Role Hierarchy

The role hierarchy is defined in `lib/auth/custom-permissions.ts` and includes:

- developer (level 50)
- org_admin (level 40)
- manager (level 30)
- consultant (level 20)
- viewer (level 10)

### 2. Permission Definitions

The 18 specific permissions are defined in `types/permissions.ts` and implemented in `lib/auth/custom-permissions.ts`.

### 3. Permission Guards

The `EnhancedPermissionGuard` component in `components/auth/EnhancedPermissionGuard.tsx` provides:

- Permission-based guards (`permission` prop)
- Role-based guards (`minimumRole` prop)
- Preset guards for common operations (e.g., `CanManageStaff`, `AdminGuard`)
- Self-access checks (`allowSelfAccess` prop)

### 4. Permission Hooks

The `useEnhancedPermissions` hook in `hooks/useEnhancedPermissions.tsx` provides:

- Permission checking functions
- Role hierarchy checking
- Type-safe permission validation

## JWT Structure

The JWT structure in `types/globals.d.ts` has been updated to align with the Hasura JWT template structure described in CLAUDE.md. This ensures that the JWT claims used for authorization are consistent with the permission system.

## Best Practices

1. **Use Permission-Based Checks**: Prefer permission-based checks over role-based checks whenever possible
2. **Use Preset Guards**: Use the preset guards provided by `EnhancedPermissionGuard` for common operations
3. **Type Safety**: Leverage TypeScript to ensure type safety when working with permissions
4. **Consistent JWT Structure**: Ensure that the JWT structure is consistent with the permission system

## Next Steps

1. Run the migration script with automatic replacements to update all legacy permission system usage
2. Test the application thoroughly to ensure that all permission checks are working correctly
3. Update any documentation that references the legacy permission system
4. Consider adding additional permission-based guards for other common operations
