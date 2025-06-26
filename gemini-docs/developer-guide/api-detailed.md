
# API (Detailed Developer Guide)

This document provides a comprehensive technical overview of the application's internal API. It is intended for developers who need to understand, maintain, and extend the API functionality.

## 1. API Structure

The API is built using Next.js API Routes. Each file in the `app/api` directory corresponds to an API endpoint. For example, the file `app/api/staff/create/route.ts` corresponds to the `/api/staff/create` endpoint.

## 2. Authentication and Authorization

API routes are protected using the `withAuth` higher-order function, which is defined in `lib/auth/api-auth.ts`. This function ensures that the user is authenticated and has the necessary permissions to access the route.

## 3. Key Endpoints

### 3.1. `POST /api/staff/create`

This endpoint is used to create a new staff member. It performs the following actions:

1.  **Validates the request body** against the `CreateStaffSchema`.
2.  **Sends an invitation to the new user via Clerk.** This is done using the `clerkClient.invitations.createInvitation` method.
3.  **Creates a new user in the application database.** This is done by calling the `syncUserWithDatabase` function, which creates a new user record and links it to the Clerk user.

### 3.2. `POST /api/webhooks/clerk`

This endpoint is used to receive webhooks from Clerk. It is responsible for keeping the application's user data in sync with Clerk.

The following webhook events are handled:

*   **`user.created`**: When a new user is created in Clerk, this event is sent. The webhook handler then creates a new user in the application database.
*   **`user.updated`**: When a user is updated in Clerk, this event is sent. The webhook handler then updates the corresponding user in the application database.
*   **`user.deleted`**: When a user is deleted in Clerk, this event is sent. The webhook handler then deactivates the corresponding user in the application database.

### 3.3. `GET /api/cron`

This endpoint is used to run cron jobs. The specific cron job to run is determined by the `jobName` query parameter.

The following cron jobs are available:

*   **`activate-payrolls`**: Activates any payrolls that have reached their go-live date.
*   **`sync-users`**: Syncs user data from Clerk to the application database.
*   **`generate-reports`**: Generates reports.

## 4. How to Extend and Modify

### 4.1. Adding a New API Endpoint

1.  Create a new file in the `app/api` directory.
2.  Export a default function that handles the request.
3.  If the endpoint needs to be protected, wrap the handler function with the `withAuth` higher-order function.

### 4.2. Adding a New Cron Job

1.  Add a new entry to the `cronJobs` object in `app/api/cron/route.ts`.
2.  The key should be the name of the cron job, and the value should be an async function that performs the cron job's logic.
