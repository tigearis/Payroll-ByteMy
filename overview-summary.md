# Payroll-ByteMy: System Overview & Business Logic

## 1. Purpose and Business Goals

**Payroll-ByteMy** is an enterprise-grade payroll management system designed to automate, streamline, and secure the payroll process for businesses of all sizes. Its primary goals are:
- **Accurate Payroll Processing:** Handle complex payroll cycles, calculations, and compliance requirements.
- **Business Day & Holiday Awareness:** Ensure payroll dates and payments are always compliant with business rules and public holidays.
- **Role-Based Security:** Provide granular access control for different user roles (e.g., admin, payroll officer, client manager, staff).
- **Real-Time Data:** Keep all users and systems in sync with live updates and reporting.
- **Compliance:** Support Australian tax, superannuation, and payroll tax rules, with audit trails and GDPR features.

---

## 2. High-Level Architecture

- **Frontend:** Next.js (React 19, TypeScript, Tailwind CSS, shadcn/ui)
- **Backend:** Next.js API routes, Hasura GraphQL Engine, Clerk for authentication
- **Database:** PostgreSQL (Neon), managed via Hasura and Drizzle ORM
- **DevOps:** pnpm, Jest, ESLint, Prettier, CI/CD, Vercel hosting

**Three-tier structure:**
- **Presentation Layer:** UI, forms, dashboards, and reporting
- **Application Layer:** API routes, business logic, GraphQL, authentication
- **Data Layer:** Relational database, real-time subscriptions, migrations

---

## 3. Core Business Logic

### A. Payroll Processing

#### Supported Payroll Frequencies
- **Weekly:** Every week on a specified day (e.g., every Friday)
- **Fortnightly:** Every two weeks, with week assignment (A/B)
- **Bi-Monthly:** Twice a month (e.g., 1st & 15th, with February exceptions)
- **Monthly/Quarterly:** End-of-month or custom rules

#### Date Calculation & Business Day Adjustments
- **Business Day Rules:** If a pay date falls on a weekend or holiday, it is adjusted to the previous or next business day, based on configuration.
- **Holiday Awareness:** Integrates with holiday calendars (automatic sync and custom holidays).
- **EFT Lead Times:** Payroll dates are adjusted to ensure electronic funds transfers are processed in time, considering bank cutoffs and holidays.

#### Payroll Lifecycle
- **Schedule Generation:** Automatically generates payroll schedules for the year, considering all business rules.
- **Approval Workflow:** Tracks changes, approvals, and provides an audit trail.
- **EFT Processing:** Handles the timing and batching of electronic payments.

### B. Pay Calculation Logic

#### Australian Tax Compliance
- **Income Tax:** Uses current ATO tax brackets for PAYG withholding.
- **Superannuation:** Calculates employer contributions (e.g., 11% of ordinary time earnings, with thresholds and caps).
- **State Payroll Tax:** Calculates state-specific payroll taxes based on thresholds and rates.
- **Net Pay:** Computes take-home pay after all deductions (tax, super, other deductions).

#### Calculation Example
For an employee:
- **Gross Pay:** $80,000
- **Tax:** Calculated per ATO brackets
- **Superannuation:** 11% of salary
- **Payroll Tax:** If employer exceeds state threshold
- **Net Pay:** Gross - Tax - Deductions

### C. Employee & Client Management

- **Staff Profiles:** Store and manage employee data, pay rates, roles, departments.
- **Client Management:** Multi-client support, each with their own payroll configuration and hierarchy.
- **Role-Based Access Control:** Permissions for admins, payroll officers, client managers, and staff.

### D. Reporting & Analytics

- **Real-Time Reports:** Payroll summaries, historical data, compliance reports.
- **Export:** PDF, Excel, and custom report generation.
- **Audit Logging:** Tracks all changes for compliance and troubleshooting.

---

## 4. Security and Compliance

- **Authentication:** Clerk (SSO, JWT, user lifecycle management)
- **Authorization:** Route-level, component-level, API-level, and database-level (row-level security in Hasura)
- **Data Protection:** Encryption at rest and in transit, input validation, SQL injection prevention, XSS protection
- **Audit Trail:** All payroll changes and approvals are logged for compliance

---

## 5. Technical and Business Design Patterns

- **Feature-Based Architecture:** Code is organized by business domain (payroll, clients, staff, auth).
- **Service Layer:** Business logic is encapsulated in service classes (e.g., PayrollService).
- **Repository Pattern:** Data access is abstracted for maintainability and testability.
- **Component-Driven UI:** Reusable, accessible UI components for consistency and speed.

---

## 6. Real-Time and Automation Features

- **GraphQL Subscriptions:** Live updates for payroll data and reports.
- **Automated Holiday Sync:** Keeps holiday calendars up to date.
- **Automated Payroll Generation:** Schedules and calculations are generated and updated automatically.

---

## 7. Scalability and Performance

- **Stateless Architecture:** Easy to scale horizontally.
- **Optimized Queries:** Efficient data access and caching.
- **Monitoring:** Performance metrics, error tracking, and analytics.

---

## Summary Table: Key Business Logic

| Area                | Logic/Feature                                                                 |
|---------------------|-------------------------------------------------------------------------------|
| Payroll Scheduling  | Multi-frequency, business day/holiday aware, EFT lead times                   |
| Pay Calculation     | ATO tax brackets, superannuation, state payroll tax, net pay                  |
| Employee Management | Staff profiles, pay rates, roles, departments                                 |
| Client Management   | Multi-client, custom payroll configs, hierarchy                               |
| Security            | RBAC, audit logging, encryption, SSO                                          |
| Reporting           | Real-time, exportable, historical, compliance                                 |
| Automation          | Holiday sync, schedule generation, real-time updates                          |

---

## What Payroll-ByteMy Aims to Achieve

- **Reduce Payroll Errors:** By automating complex calculations and date adjustments.
- **Ensure Compliance:** With Australian tax, super, and payroll tax laws.
- **Increase Efficiency:** Through automation, real-time updates, and easy reporting.
- **Enhance Security:** With robust authentication, authorization, and audit trails.
- **Support Growth:** Scalable architecture for businesses of any size.

---

## How a Payroll Run is Calculated

1. **Payroll Schedule Generation:**
   - The system generates pay dates for the year based on the selected frequency (weekly, fortnightly, bi-monthly, etc.), business day rules, and holiday calendars.
   - Each pay date is adjusted to avoid weekends and holidays, using either the previous or next business day as configured.
   - EFT lead times are considered to ensure payments are processed on time.

2. **Gross Pay Calculation:**
   - For each employee, the system determines the pay period and calculates gross pay based on their pay rate, hours worked, and any allowances or bonuses.

3. **Tax and Deductions:**
   - **Income Tax:** Calculated using the latest ATO tax brackets.
   - **Superannuation:** Employer contributions are calculated (e.g., 11% of ordinary time earnings, subject to thresholds).
   - **Payroll Tax:** If the employer's total payroll exceeds the state threshold, payroll tax is calculated at the applicable rate.
   - **Other Deductions:** Union fees, salary sacrifice, or other custom deductions are applied.

4. **Net Pay Calculation:**
   - Net pay is computed as: `Gross Pay - Income Tax - Superannuation - Other Deductions`.

5. **EFT Processing:**
   - The system batches payments and schedules them for electronic funds transfer, ensuring all payments are made on or before the adjusted pay date.

6. **Audit and Reporting:**
   - All calculations, changes, and approvals are logged for compliance and reporting.

---

## How Roles and Permissions are Enforced

1. **Authentication:**
   - Users authenticate via Clerk, supporting SSO and JWT tokens.

2. **Authorization Layers:**
   - **Route-Level:** Middleware protects sensitive routes, allowing only authorized roles.
   - **Component-Level:** UI components render conditionally based on user roles and permissions.
   - **API-Level:** Hasura's permission system restricts GraphQL operations by role.
   - **Database-Level:** Row-level security in Hasura ensures users can only access data they are permitted to see.

3. **Role Definitions:**
   - Roles include Admin, Payroll Officer, Client Manager, and Staff, each with specific permissions (e.g., only Admins can manage users, Payroll Officers can process payroll, etc.).

4. **Audit Logging:**
   - All access and changes are logged, providing a full audit trail for compliance and security. 