# Authentication & Authorization System

This directory contains the consolidated authentication and permission system using Clerk native integration with SOC2 compliance.

## Architecture Overview

The authentication system uses Clerk's native permission system with granular access control:

```flow
User Request → Enhanced API Auth → Native Clerk Permission Check → MetadataManager → Apollo Client → Hasura
```

## 🏗️ Consolidated Structure (Latest)

### Single Source of Truth

**All permissions, roles, and core utilities are now consolidated in:**
- `/types/permissions.ts` - **Primary source** for all auth types, constants, and utility functions

### Core Active Files

1. **`enhanced-api-auth.ts`** - Modern API authentication wrapper with Clerk native integration
2. **`metadata-manager.server.ts`** - Server-side user role/permission management via Clerk
3. **`native-permission-checker.ts`** - Runtime permission validation using Clerk's has() function
4. **`metadata-utils.ts`** - Client-safe metadata utilities for components
5. **`soc2-auth.ts`** - Client-side hooks and role utilities
6. **`soc2-logger.ts`** - Audit logging for SOC2 compliance

### Deprecated Files

The following files are **deprecated** but maintained for backward compatibility:

- ❌ `custom-permissions.ts` - **Use `/types/permissions.ts` instead**
- ❌ `roles.ts` - **Use `/types/permissions.ts` instead**
- ❌ `permissions.ts` - **Fully deprecated** (GraphQL-based approach)
- ❌ `auth-wrappers.ts` - **Use `enhanced-api-auth.ts` instead**

## 🚀 Usage Patterns

### Enhanced API Authentication

The preferred way to protect API routes is through the `withEnhancedAuth` wrapper:

```typescript
import { withEnhancedAuth } from "@/lib/auth/enhanced-api-auth";

export const POST = withEnhancedAuth(
  async (req: NextRequest, context: AuthContext) => {
    // Handler logic with guaranteed authentication and permission validation
  },
  {
    permission: "custom:staff:write", // Required permission
    // OR
    minimumRole: "manager", // Minimum role requirement
    // OR
    allowSelf: true, // Allow users to access their own data
  }
);
```

### Permission Management

Import everything from the consolidated source:

```typescript
// ✅ Correct - Import from consolidated types
import { 
  ROLE_HIERARCHY,
  ROLE_PERMISSIONS,
  CUSTOM_PERMISSIONS,
  hasRoleLevel,
  isValidUserRole,
  sanitizeUserRole,
  type CustomPermission,
  type Role,
  type UserMetadata
} from "@/types/permissions";

// ❌ Deprecated - Don't import from these files
import { ROLE_PERMISSIONS } from "@/lib/auth/custom-permissions";
import { USER_ROLES } from "@/lib/auth/roles";
```

### Client Components

```typescript
import { useRoleHierarchy } from "@/lib/auth/soc2-auth";

const { 
  userRole, 
  canManageStaff, 
  canAccessSecurity 
} = useRoleHierarchy();
```

## 🔄 Migration Guide

### For New Code
- Always import from `/types/permissions.ts`
- Use `withEnhancedAuth` for API route protection
- Use permission-based checks instead of role equality checks

### For Existing Code
1. Replace imports from deprecated files with `/types/permissions.ts`
2. Replace `withAuth` with `withEnhancedAuth`
3. Use `has({ permission })` instead of role equality checks
4. Update role hierarchy checks to use consolidated `hasRoleLevel`

### Breaking Changes Avoided
- All deprecated files re-export from the consolidated types
- Legacy function names maintained for backward compatibility
- Existing import statements continue to work during transition period

## 📁 File Structure

```
lib/auth/
├── enhanced-api-auth.ts        # ✅ Modern API authentication
├── metadata-manager.server.ts  # ✅ Server-side metadata management
├── native-permission-checker.ts # ✅ Runtime permission validation
├── metadata-utils.ts           # ✅ Client-safe utilities
├── soc2-auth.ts               # ✅ Client hooks and utilities
├── soc2-logger.ts             # ✅ Audit logging
├── custom-permissions.ts       # ❌ Deprecated (re-exports)
├── roles.ts                   # ❌ Deprecated (re-exports)
├── permissions.ts             # ❌ Deprecated (GraphQL-based)
├── auth-wrappers.ts           # ❌ Deprecated (legacy patterns)
└── README.md                  # 📚 This documentation
```

## 🔒 Security Features

- **SOC2 Compliance**: Comprehensive audit logging and data protection
- **Permission-Based Access**: Granular 18 permissions across 5 hierarchical roles
- **Clerk Native Integration**: Uses Clerk's built-in `has({ permission })` functionality
- **Rate Limiting**: Built-in protection against abuse
- **Self-Access Patterns**: Users can access their own data with proper validation
