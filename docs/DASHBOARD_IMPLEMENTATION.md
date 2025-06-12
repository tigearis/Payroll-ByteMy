# Dashboard Implementation with Real Data

## Overview

The dashboard has been updated to use real data from the Hasura GraphQL API instead of hardcoded mock data. This provides live statistics and information about your payroll operations.

## What's Been Implemented

### 1. GraphQL Queries

**Location**: `graphql/queries/dashboard/`

- **getDashboardStats.ts**: Contains queries for dashboard statistics

  - `GET_DASHBOARD_STATS`: Fetches client counts, payroll counts, and processing queue
  - `GET_UPCOMING_PAYROLLS`: Fetches upcoming payrolls with dates and assignments
  - `GET_RECENT_ACTIVITY`: Fetches recent payroll and client activity

- **getAlerts.ts**: Contains queries for urgent alerts
  - `GET_URGENT_ALERTS`: Identifies various business issues that need attention:
    - Payrolls missing scheduled dates
    - Overdue payrolls (past due date but not processed)
    - Clients missing contact information
    - Payrolls without assigned consultants

### 2. Updated Components

**UpcomingPayrolls Component** (`components/upcoming-payrolls.tsx`)

- Now fetches real payroll data with dates, clients, and consultant assignments
- Shows loading states with skeleton components
- Displays proper error handling
- Includes status badges and formatted dates

**UrgentAlerts Component** (`components/urgent-alerts.tsx`)

- Fetches real business logic alerts from the database
- Categorizes alerts by severity (errors vs warnings)
- Shows different alert styles based on type
- Provides meaningful descriptions for each issue

**Dashboard Page** (`app/(dashboard)/dashboard/page.tsx`)

- Uses Apollo Client to fetch real statistics
- Shows loading states for all metrics
- Displays actual counts for clients, payrolls, and processing queue
- Shows next upcoming payroll date

### 3. Real Data Metrics

The dashboard now displays:

- **Total Clients**: Count of active clients
- **Total Payrolls**: Count of all non-superseded payrolls
- **Active Payrolls**: Count of payrolls with status "active", "processing", or "pending"
- **Processing Queue**: Count of payrolls currently being processed
- **Upcoming Payrolls**: Table showing next payrolls due with dates and assignments
- **Urgent Alerts**: Business logic alerts for issues requiring attention

### 4. Error Handling

- Graceful error handling for GraphQL failures
- Loading states with skeleton components
- Fallback displays when no data is available
- Error messages that help with debugging

## Authentication Requirements

The dashboard requires proper authentication through Clerk and Hasura JWT tokens. Users must be signed in to view the dashboard data.

## Testing the Implementation

1. **Start the development server**:

   ```bash
   pnpm dev
   ```

2. **Sign in to the application** at `http://localhost:3000/sign-in`

3. **Navigate to the dashboard** at `http://localhost:3000/dashboard`

4. **Verify the data loads**:
   - Statistics cards should show real numbers (not hardcoded values)
   - Upcoming payrolls table should show actual payroll data
   - Urgent alerts should display real business issues

## Data Dependencies

The dashboard queries depend on the following database tables:

- `clients` - For client statistics and contact information
- `payrolls` - For payroll counts and status information
- `payroll_dates` - For upcoming dates and scheduling
- `users` - For consultant assignments

## Future Enhancements

Potential improvements that could be added:

- Real-time subscriptions for live updates
- More detailed analytics and charts
- Filtering and search capabilities
- Export functionality for reports
- Performance metrics and trends
- Custom alert configurations

## Troubleshooting

If the dashboard shows loading states indefinitely:

1. Check that Hasura is running and accessible
2. Verify JWT tokens are being generated correctly
3. Check browser console for GraphQL errors
4. Ensure database tables have the expected schema
5. Verify user has proper permissions in Hasura

If you see "No data" messages:

1. Check that there is actual data in the database
2. Verify the GraphQL queries match your database schema
3. Check that the user has read permissions for the required tables
