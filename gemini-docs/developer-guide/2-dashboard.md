
# Dashboard (Developer Guide)

This guide provides a technical overview of the dashboard for developers. It covers the key components, data fetching, and how to add new widgets to the dashboard.

## Key Components

*   `app/(dashboard)/layout.tsx`: The layout for the dashboard. This component renders either the `DashboardShell` (header layout) or the `Sidebar` component, depending on the user's layout preference.
*   `app/(dashboard)/dashboard/page.tsx`: The main dashboard page. This component fetches data from the GraphQL API and renders the dashboard widgets.
*   `components/sidebar.tsx`: The sidebar component, which provides navigation to the different sections of the application.
*   `components/main-nav.tsx`: The main navigation component, which is used in the header layout.
*   `components/dashboard-shell.tsx`: A shell component that provides a consistent layout for the dashboard pages.
*   `components/urgent-alerts.tsx`: A component that displays a list of payrolls that require immediate attention.

## Data Fetching

The dashboard page uses Apollo Client's `useQuery` hook to fetch data from the GraphQL API. The following queries are used:

*   `GetClientStatsDocument`: Fetches the total number of clients.
*   `GetPayrollDashboardStatsDocument`: Fetches statistics about the payrolls, such as the total number of payrolls and the number of active payrolls.
*   `GetUpcomingPayrollsDocument`: Fetches a list of upcoming payrolls.

## Adding New Widgets

To add a new widget to the dashboard, you will need to:

1.  **Create a new GraphQL query** to fetch the data for the widget. Add the query to the appropriate file in the `domains` directory.
2.  **Run `npm run codegen`** to generate the necessary TypeScript types and Apollo Client hooks for the new query.
3.  **Create a new component** for the widget in the `components` directory.
4.  **Add the new component** to the `app/(dashboard)/dashboard/page.tsx` file.
5.  **Use the `useQuery` hook** in the new component to fetch the data from the GraphQL API.

## Layout Preferences

The dashboard layout is controlled by the `useLayoutPreferences` hook, which is defined in `lib/preferences/layout-preferences.ts`. This hook uses the `useLocalStorage` hook to store the user's layout preference in their browser's local storage.

## Role-Based Access Control (RBAC)

The `Sidebar` and `MainNav` components use the `useAuthContext` hook to determine which routes to display to the user based on their role and permissions. The `checkAccess` function in each route definition is used to determine if the user has the necessary permissions to view the route.
