
# Security (Developer Guide)

This guide provides a technical overview of the security features of the application for developers.

## Key Components

*   `app/(dashboard)/security/page.tsx`: The main page for the security section. This component renders the `AuditLogList` component.
*   `domains/audit/components/audit-log-list.tsx`: This component fetches a list of all audit log entries from the GraphQL API and displays them in a table.

## Data Model

The data model for security is designed to be flexible and to support a wide range of use cases. The key tables are:

*   `audit_log`: This table stores a log of all actions that are performed in the system.
*   `roles`: This table stores the roles that can be assigned to users.
*   `permissions`: This table stores the permissions that can be granted to roles.
*   `role_permissions`: This table links roles to permissions.
*   `user_roles`: This table links users to roles.

## Business Logic

The application contains a significant amount of business logic for managing security. This logic is implemented in the following places:

*   **PostgreSQL Functions:** The `database/schema.sql` file contains a number of PostgreSQL functions for managing security, such as `user_can_perform_action` and `get_user_effective_permissions`.
*   **GraphQL Resolvers:** The GraphQL resolvers for the security domain contain the business logic for managing roles and permissions.

## Audit Log

The `audit_log` table is populated by a trigger that is fired whenever a row is inserted, updated, or deleted in a table that is configured to be audited.

## Role-Based Access Control (RBAC)

The `user_can_perform_action` function is used to check if a user has permission to perform an action. This function takes the user ID, the resource, and the action as arguments and returns a boolean value.
