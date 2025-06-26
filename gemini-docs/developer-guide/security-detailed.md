
# Security (Detailed Developer Guide)

This document provides a comprehensive technical overview of the security features of the application. It is intended for developers who need to understand, maintain, and extend the security functionality.

## 1. Data Model

The `audit` schema contains the tables that are used to store security-related information.

-   **`audit_log`**: This table stores a log of all actions that are performed in the system.
-   **`auth_events`**: This table stores a log of all authentication events, such as successful and failed sign-in attempts.
-   **`data_access_log`**: This table stores a log of all access to sensitive data.
-   **`permission_changes`**: This table stores a log of all changes to user permissions.

## 2. Frontend Implementation

The frontend for the security feature is built with Next.js, React, and Apollo Client.

### 2.1. Key Components and Hooks

-   **`app/(dashboard)/security/page.tsx`**: The main entry point for the security dashboard. It is responsible for:
    -   Fetching security-related data using the `useStrategicQuery` and `useSecureSubscription` hooks.
    -   Displaying a high-level overview of the system's security health.
    -   Providing links to more detailed security information.

-   **`hooks/use-enhanced-permissions.ts`**: This custom hook provides a more detailed and robust way to check user permissions. It returns a `PermissionResult` object that includes not only whether the permission is granted, but also the reason for the denial and suggestions for how to resolve it.

-   **`hooks/use-subscription-permissions.ts`**: This custom hook provides a way to securely subscribe to GraphQL subscriptions. It checks that the user has the necessary permissions before subscribing, and it automatically unsubscribes if the user's permissions change.

### 2.2. Data Flow

1.  The `SecurityDashboard` component fetches an initial snapshot of the security data using the `useStrategicQuery` hook.
2.  The component then subscribes to several GraphQL subscriptions to receive real-time updates to the security data.
3.  The `useSecureSubscription` hook is used to ensure that the user has the necessary permissions to subscribe to each subscription.
4.  If the WebSocket connection is lost, the component falls back to polling for updates using the `useStrategicQuery` hook.

## 3. How to Extend and Modify

### 3.1. Adding a New Audited Action

1.  Add a trigger to the relevant table in `database/schema.sql` that calls the `log_changes` function.
2.  The `log_changes` function will automatically log the action to the `audit_log` table.

### 3.2. Adding a New Permission

1.  Add the new permission to the `permissions` table in `database/schema.sql`.
2.  Add the new permission to the `role_permissions` table to grant it to the appropriate roles.
3.  Update the `roleHasPermission` function in `lib/auth/permissions.ts` to include the new permission.
