
# Staff (Detailed Developer Guide)

This document provides a comprehensive technical overview of the staff management feature. It is intended for developers who need to understand, maintain, and extend the staff management functionality.

## 1. Data Model

The `users` table is the central table for this feature. It stores all the information about a user, whether they are a staff member or a client user.

-   **`users`**: The main table for user records.
    -   `id` (uuid, PK): Unique identifier for the user.
    -   `clerk_user_id` (varchar): The user's ID from the Clerk authentication service.
    -   `name` (varchar): The user's full name.
    -   `email` (varchar): The user's email address.
    -   `role` (user_role): The user's role in the system (e.g., `developer`, `org_admin`, `manager`, `consultant`, `viewer`).
    -   `is_staff` (boolean): Whether the user is a staff member.
    -   `is_active` (boolean): Whether the user's account is currently active.
    -   `manager_id` (uuid, FK to `users`): The user's manager.

## 2. Frontend Implementation

The frontend for the staff management feature is built with Next.js, React, and Apollo Client.

### 2.1. Key Components and Hooks

-   **`app/(dashboard)/staff/page.tsx`**: The main entry point for the staff management page. It is responsible for:
    -   Rendering the `StaffManagementContent` component.
    -   Handling the opening and closing of the `CreateUserModal`.

-   **`components/staff-management-content.tsx`**: This component is responsible for rendering the table of staff members. It uses the `useStaffManagement` hook to fetch the list of staff members and provides the UI for searching, filtering, and pagination.

-   **`domains/users/components/create-user-modal.tsx`**: This component provides a form for creating a new user. It uses the `useUserManagement` hook to create the user in the database and send an invitation to the user via Clerk.

-   **`hooks/use-user-management.ts`**: This custom hook encapsulates the logic for managing users. It provides functions for fetching, creating, updating, and deleting users, as well as for checking user permissions.

### 2.2. Data Flow

1.  The `StaffManagementContent` component fetches the list of staff members from the GraphQL API using the `useStaffManagement` hook.
2.  The user interacts with the UI to add, edit, or delete a staff member.
3.  When a user adds a new staff member, the `CreateUserModal` is opened. The user enters the new staff member's information and clicks the **Create User** button.
4.  The `handleSubmit` function in the `CreateUserModal` calls the `/api/staff/create` API route, which creates the user in both Clerk and the application database.
5.  The `useStaffManagement` hook automatically updates the cache, and the UI is updated to reflect the changes.

## 3. How to Extend and Modify

### 3.1. Adding a New Field to the Staff Table

1.  Add the new field to the `users` table in `database/schema.sql`.
2.  Update the `GetUsersDocument` query in the `domains/users/graphql` directory to include the new field.
3.  Run `npm run codegen` to update the generated types and hooks.
4.  Add the new field to the `StaffManagementContent` component.

### 3.2. Adding a New Role

1.  Add the new role to the `user_role` enum in `database/schema.sql`.
2.  Update the `roleOptions` array in the `CreateUserModal` component to include the new role.
3.  Update the `canAssignRole` function in the `useUserManagement` hook to control who can assign the new role.
