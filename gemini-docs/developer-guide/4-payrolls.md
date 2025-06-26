
# Payrolls (Developer Guide)

This guide provides a technical overview of the payrolls section for developers.

## Key Components

*   `app/(dashboard)/payrolls/page.tsx`: The main page for the payrolls section. This component renders the `PayrollList` component.
*   `domains/payrolls/components/payroll-list.tsx`: This component fetches a list of all payrolls from the GraphQL API and displays them in a table.
*   `domains/payrolls/components/payroll-form.tsx`: This component provides a form for adding and editing payrolls.

## Data Model

The data model for payrolls is designed to be flexible and to support a wide range of use cases. The key tables are:

*   `payrolls`: This table stores the main information about each payroll, including its name, the client it belongs to, and its current status.
*   `payroll_versions`: This table stores the version history of each payroll. Every time a payroll is edited, a new row is added to this table.
*   `payroll_dates`: This table stores the calculated EFT and processing dates for each payroll.

## Business Logic

The application contains a significant amount of business logic for managing payrolls. This logic is implemented in the following places:

*   **PostgreSQL Functions:** The `database/schema.sql` file contains a number of PostgreSQL functions for managing payrolls, such as `generate_payroll_dates` and `create_payroll_version`.
*   **GraphQL Resolvers:** The GraphQL resolvers for the payrolls domain contain the business logic for adding, editing, and deleting payrolls.

## Payroll Versioning

The `create_payroll_version` function is used to create a new version of a payroll. This function takes the ID of the original payroll as an argument and returns the ID of the new payroll. The new payroll is an exact copy of the original payroll, but with a new version number.

## Payroll Date Calculation

The `generate_payroll_dates` function is used to calculate the EFT and processing dates for a payroll. This function takes the ID of the payroll as an argument and generates a set of payroll dates for the next two years.
