
# Payrolls (Detailed Developer Guide)

This document provides a comprehensive technical overview of the payrolls feature. It is intended for developers who need to understand, maintain, and extend the payroll functionality.

## 1. Data Model and Database-Level Logic

The foundation of the payrolls feature is its robust data model in the PostgreSQL database. The schema is designed to handle complex payroll schedules, versioning, and automated date calculations.

### 1.1. Key Tables

-   **`payrolls`**: The central table for payroll records. It stores the current, active configuration for a given payroll.
    -   `id` (uuid, PK): Unique identifier for a specific payroll version.
    -   `name` (varchar): The display name of the payroll.
    -   `client_id` (uuid, FK to `clients`): The client this payroll belongs to.
    -   `cycle_id` (uuid, FK to `payroll_cycles`): The frequency of the payroll (e.g., weekly, monthly).
    -   `date_type_id` (uuid, FK to `payroll_date_types`): The rule for determining the pay date (e.g., fixed date, end of month).
    -   `date_value` (integer): A value associated with the `date_type_id` (e.g., the day of the month for a fixed date).
    -   `status` (payroll_status): The current status of the payroll (e.g., `Active`, `Implementation`).
    -   `version_number` (integer): The version number of the payroll.
    -   `parent_payroll_id` (uuid): A self-referencing key that links all versions of a payroll together. The `parent_payroll_id` of the first version is its own `id`.
    -   `go_live_date` (date): The date when this version of the payroll becomes active.
    -   `superseded_date` (date): The date when this version of the payroll was replaced by a new version. A `NULL` value indicates that this is the current, active version.
    -   `created_by_user_id` (uuid, FK to `users`): The user who created this payroll version.

-   **`payroll_dates`**: Stores the calculated pay dates for each payroll.
    -   `id` (uuid, PK): Unique identifier for a specific pay date.
    -   `payroll_id` (uuid, FK to `payrolls`): The payroll this date belongs to.
    -   `original_eft_date` (date): The calculated pay date before any adjustments for weekends or holidays.
    -   `adjusted_eft_date` (date): The final pay date after all adjustments.
    -   `processing_date` (date): The deadline for processing the payroll.

-   **`payroll_cycles`**, **`payroll_date_types`**: Lookup tables for payroll schedule configurations.

### 1.2. Stored Functions and Triggers (Business Logic)

A significant amount of the business logic is implemented directly in the database using PostgreSQL functions and triggers. This ensures data integrity and consistency, regardless of how the data is accessed.

-   **`create_payroll_version(...)`**: This is the cornerstone of the versioning system. It performs the following actions:
    1.  Retrieves the original payroll record.
    2.  Determines the new version number.
    3.  **Crucially, it updates the `superseded_date` of the original payroll, marking it as inactive.**
    4.  Inserts a new record into the `payrolls` table with the updated information and a new `id`.
    5.  Deletes any future-dated entries from the `payroll_dates` table that belong to the original payroll.

-   **`generate_payroll_dates(...)`**: This function calculates the pay dates for a given payroll for the next two years. It takes into account the payroll's cycle, date type, and date value, and it uses the `adjust_for_non_business_day` function to ensure that all pay dates fall on a business day.

-   **`auto_generate_dates_on_payroll_insert()`**: This trigger automatically calls the `generate_payroll_dates` function whenever a new payroll version is inserted into the `payrolls` table.

-   **`auto_regenerate_dates_on_schedule_change()`**: This trigger automatically regenerates the pay dates for a payroll if its schedule is changed.

-   **`adjust_for_non_business_day(...)`**: This function takes a date and adjusts it to the nearest business day, taking into account weekends and holidays.

## 2. Frontend Implementation

The frontend for the payrolls feature is built with Next.js, React, and Apollo Client.

### 2.1. Key Components and Hooks

-   **`app/(dashboard)/payrolls/page.tsx`**: The main entry point for the payrolls page. It is responsible for:
    -   Fetching the list of payrolls using the `useCachedQuery` hook with the `GetPayrollsDocument`.
    -   Managing the state of the page, including search terms, filters, and sorting.
    -   Rendering the `PayrollsTable` component.
    -   Providing the UI for adding, editing, and deleting payrolls.

-   **`domains/payrolls/components/payrolls-table.tsx`**: This component is responsible for rendering the table of payrolls. It receives the list of payrolls as a prop and provides the UI for sorting, filtering, and pagination.

-   **`hooks/use-payroll-creation.ts`**: This custom hook encapsulates the logic for creating a new payroll. It uses the `useMutation` hook from Apollo Client to call the `CreatePayrollDocument` mutation, and the `useLazyQuery` hook to call the `GeneratePayrollDatesDocument` query.

-   **`hooks/use-payroll-versioning.ts`**: This hook is the frontend counterpart to the `create_payroll_version` database function. It provides the `savePayrollEdit` function, which:
    1.  Calls the `UpdatePayrollDocument` mutation to supersede the current payroll version.
    2.  Calls the `CreatePayrollDocument` mutation to insert the new payroll version.
    3.  The database triggers then handle the rest of the versioning process automatically.

### 2.2. Data Flow

1.  The `PayrollsPage` component fetches the list of payrolls from the GraphQL API.
2.  The user interacts with the UI to add, edit, or delete a payroll.
3.  When a user edits a payroll, the `usePayrollVersioning` hook is used to create a new version of the payroll.
4.  The `savePayrollEdit` function in the hook calls the necessary GraphQL mutations to update the database.
5.  The database triggers fire, updating the `superseded_date` of the old version and generating new pay dates for the new version.
6.  The `PayrollsPage` component re-fetches the list of payrolls, and the UI is updated to show the new version.

## 3. How to Extend and Modify

### 3.1. Adding a New Field to the Payrolls Table

1.  Add the new field to the `payrolls` table in `database/schema.sql`.
2.  Update the `GetPayrollsDocument` query in the `domains/payrolls/graphql` directory to include the new field.
3.  Run `npm run codegen` to update the generated types and hooks.
4.  Add the new field to the `PayrollsTable` component.

### 3.2. Adding a New Payroll Status

1.  Add the new status to the `payroll_status` enum in `database/schema.sql`.
2.  Update the `getStatusConfig` function in `app/(dashboard)/payrolls/page.tsx` to include the new status.

### 3.3. Modifying the Date Calculation Logic

1.  Modify the `generate_payroll_dates` or `adjust_for_non_business_day` functions in `database/schema.sql`.
2.  Since this is a database change, you will need to apply the changes to your database.

This detailed guide should provide a solid foundation for understanding and working with the payrolls feature. The combination of a well-designed data model, database-level business logic, and a reactive frontend makes for a powerful and maintainable system.
