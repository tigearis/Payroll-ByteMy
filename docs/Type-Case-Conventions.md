# Naming Case Conventions Guide

## File & Directory Names

**Use: kebab-case**

```
├── components/
│   ├── auth/
│   │   ├── role-guard.tsx
│   │   ├── permission-checker.tsx
│   │   └── user-profile-card.tsx
│   └── ui/
│       ├── button.tsx
│       └── data-table.tsx
├── hooks/
│   ├── use-auth.ts
│   ├── use-roles.ts
│   └── use-permissions.ts
├── lib/
│   ├── auth-utils.ts
│   ├── role-hierarchy.ts
│   └── hasura-client.ts
├── types/
│   ├── auth-types.ts
│   ├── user-types.ts
│   └── graphql-types.ts
└── graphql/
    ├── queries/
    │   ├── get-user.graphql
    │   └── get-users-by-role.graphql
    └── mutations/
        ├── update-user-role.graphql
        └── create-user.graphql
```

## React Components

**Use: PascalCase**

```typescript
// Component names
export const RoleGuard = () => {};
export const UserProfileCard = () => {};
export const PermissionChecker = () => {};
export const AuthProvider = () => {};

// Component files should match component names
// role-guard.tsx exports RoleGuard
// user-profile-card.tsx exports UserProfileCard
```

## Functions & Variables

**Use: camelCase**

```typescript
// Functions
const checkUserPermissions = () => {};
const assignUserRole = () => {};
const validateRoleHierarchy = () => {};
const getUserFromClerk = () => {};

// Variables
const currentUser = useUser();
const userRole = user?.public_metadata?.role;
const hasPermission = checkPermission(role);
const isAuthenticated = !!user;
```

## Constants

**Use: SCREAMING_SNAKE_CASE**

```typescript
// Role constants
export const ROLES = {
  DEVELOPER: "developer",
  ORG_ADMIN: "org_admin",
  MANAGER: "manager",
  CONSULTANT: "consultant",
  VIEWER: "viewer",
} as const;

// Other constants
export const JWT_TEMPLATE_CONFIG = {
  /* ... */
};
export const HASURA_ENDPOINT = process.env.HASURA_ENDPOINT;
export const CLERK_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
export const MAX_LOGIN_ATTEMPTS = 5;
export const SESSION_TIMEOUT_MINUTES = 30;
```

## Types & Interfaces

**Use: PascalCase**

```typescript
// Types
export type UserRole =
  | "developer"
  | "org_admin"
  | "manager"
  | "consultant"
  | "viewer";
export type AuthState = "loading" | "authenticated" | "unauthenticated";
export type PermissionLevel = "read" | "write" | "admin" | "owner";

// Interfaces
export interface User {
  id: string;
  email: string;
  role: UserRole;
  databaseId: string;
}

export interface AuthContext {
  user: User | null;
  isLoading: boolean;
  signIn: () => void;
  signOut: () => void;
}

export interface RolePermissions {
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
  canManageUsers: boolean;
}
```

## Enums

**Use: PascalCase with SCREAMING_SNAKE_CASE values**

```typescript
export enum UserRole {
  DEVELOPER = "developer",
  ORG_ADMIN = "org_admin",
  MANAGER = "manager",
  CONSULTANT = "consultant",
  VIEWER = "viewer",
}

export enum PermissionType {
  READ_ONLY = "read_only",
  READ_WRITE = "read_write",
  ADMIN = "admin",
  OWNER = "owner",
}
```

## GraphQL Operations

**Use: PascalCase for operations, camelCase for variables**

```graphql
# Queries - PascalCase
query GetUserByRole($role: String!) {
  users(where: { role: { _eq: $role } }) {
    id
    email
    role
    databaseId
  }
}

query GetCurrentUserPermissions($userId: String!) {
  user_permissions(where: { userId: { _eq: $userId } }) {
    permission
    resource
  }
}

# Mutations - PascalCase
mutation UpdateUserRole($userId: String!, $newRole: String!) {
  update_users(where: { id: { _eq: $userId } }, _set: { role: $newRole }) {
    affected_rows
  }
}
```

## Custom Hooks

**Use: camelCase starting with 'use'**

```typescript
export const useAuth = () => {};
export const useUserRole = () => {};
export const usePermissions = () => {};
export const useRoleHierarchy = () => {};
export const useHasuraClient = () => {};
```

## Utility Functions

**Use: camelCase**

```typescript
// Auth utilities
export const validateUserRole = (role: string) => {};
export const checkRoleHierarchy = (
  userRole: UserRole,
  requiredRole: UserRole
) => {};
export const extractRoleFromJWT = (token: string) => {};
export const syncUserWithDatabase = (clerkUser: User) => {};

// Permission utilities
export const hasPermission = (userRole: UserRole, permission: string) => {};
export const canAccessResource = (userRole: UserRole, resource: string) => {};
export const getRolePermissions = (role: UserRole) => {};
```

## Environment Variables

**Use: SCREAMING_SNAKE_CASE**

```bash
# Clerk configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Hasura configuration
HASURA_GRAPHQL_ENDPOINT=https://...
HASURA_GRAPHQL_ADMIN_SECRET=...
HASURA_JWT_SECRET=...

# Database configuration
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# App configuration
NODE_ENV=development
APP_NAME=your-app-name
LOG_LEVEL=debug
```

## CSS Classes & IDs

**Use: kebab-case**

```css
/* Class names */
.auth-container {
}
.user-profile-card {
}
.role-badge {
}
.permission-guard {
}

/* IDs */
#login-form {
}
#user-dropdown {
}
#role-selector {
}
```

## Database Fields

**Use: snake_case (following SQL conventions)**

```sql
-- Table names
users
user_roles
role_permissions
audit_logs

-- Column names
user_id
database_id
clerk_user_id
created_at
updated_at
role_name
permission_type
```

## Event Handlers

**Use: camelCase with 'handle' or 'on' prefix**

```typescript
const handleSignIn = () => {};
const handleRoleChange = () => {};
const onUserUpdate = () => {};
const onPermissionChange = () => {};
```

## API Routes (Next.js)

**Use: kebab-case for files, camelCase for handlers**

```
├── pages/api/
│   ├── auth/
│   │   ├── sign-in.ts
│   │   ├── sign-out.ts
│   │   └── validate-token.ts
│   ├── users/
│   │   ├── [id].ts
│   │   ├── assign-role.ts
│   │   └── get-permissions.ts
│   └── roles/
│       ├── hierarchy.ts
│       └── validate.ts
```

## Test Files

**Use: Same as source file with .test or .spec suffix**

```
src/
├── components/
│   ├── auth/
│   │   ├── role-guard.tsx
│   │   ├── role-guard.test.tsx
│   │   ├── permission-checker.tsx
│   │   └── permission-checker.test.tsx
└── lib/
    ├── auth-utils.ts
    ├── auth-utils.test.ts
    ├── role-hierarchy.ts
    └── role-hierarchy.test.ts
```

## Configuration Files

**Use: kebab-case or specific conventions**

```
├── .eslintrc.js
├── prettier.config.js
├── tailwind.config.js
├── next.config.js
├── tsconfig.json
├── jest.config.js
└── docker-compose.yml
```

## Summary by Category

| Category              | Case Type              | Example             |
| --------------------- | ---------------------- | ------------------- |
| Files/Directories     | kebab-case             | `auth-provider.tsx` |
| Components            | PascalCase             | `RoleGuard`         |
| Functions/Variables   | camelCase              | `getUserRole`       |
| Constants             | SCREAMING_SNAKE_CASE   | `DEFAULT_ROLE`      |
| Types/Interfaces      | PascalCase             | `UserRole`          |
| GraphQL Operations    | PascalCase             | `GetUserByRole`     |
| Hooks                 | camelCase (use prefix) | `useAuth`           |
| CSS Classes           | kebab-case             | `.auth-container`   |
| Database Fields       | snake_case             | `user_id`           |
| Environment Variables | SCREAMING_SNAKE_CASE   | `CLERK_SECRET_KEY`  |
