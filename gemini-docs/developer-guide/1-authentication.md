
# Authentication Flow (Developer Guide)

This document provides a detailed explanation of the authentication flow for developers. It covers the technologies used, the key files involved, and how to extend and customize the authentication process.

## Technologies Used

*   **Next.js:** The application is built on Next.js, which provides the routing and middleware infrastructure.
*   **Clerk:** Clerk is used for user authentication, session management, and JWT generation.
*   **Hasura:** Hasura is used as a GraphQL layer on top of the PostgreSQL database. It uses JWTs to authorize database access.
*   **TypeScript:** The application is written in TypeScript, which provides type safety and improves code quality.

## Key Files

*   `app/(auth)/layout.tsx`: The layout for the authentication pages.
*   `app/(auth)/page.tsx`: The sign-in page, which renders the Clerk `SignIn` component.
*   `lib/auth/clerk.ts`: Contains helper functions for interacting with the Clerk API, such as updating user metadata.
*   `middleware.ts`: The Next.js middleware, which is responsible for protecting routes and verifying JWTs.
*   `database/schema.sql`: The database schema, which includes the `get_hasura_claims` function for generating Hasura claims from a Clerk user ID.

## Authentication Flow in Detail

1.  **User Navigates to Sign-in Page:** The user navigates to the `/` route, which renders the `app/(auth)/page.tsx` file. This file displays the Clerk `SignIn` component.
2.  **User Submits Credentials:** The user enters their credentials in the Clerk sign-in form and submits it.
3.  **Clerk Handles Authentication:** Clerk handles the authentication process, including verifying the user's credentials and managing the session.
4.  **Middleware Intercepts Requests:** Once the user is authenticated, any subsequent requests to protected routes are intercepted by the `middleware.ts` file.
5.  **JWT Verification:** The middleware uses the `clerkMiddleware` function from `@clerk/nextjs/server` to verify the JWT in the request headers.
6.  **Hasura Claims Generation:** The `get_hasura_claims` function in the database is called with the user's Clerk ID. This function retrieves the user's roles and other information from the database and returns a JSON object with the necessary Hasura claims (`x-hasura-user-id`, `x-hasura-default-role`, `x-hasura-allowed-roles`).
7.  **Hasura Authorization:** The Hasura claims are added to the request headers and sent to Hasura. Hasura uses these claims to authorize access to the database.

## Extending and Customizing

### Adding Custom Claims to the JWT

You can add custom claims to the JWT by creating a new JWT template in your Clerk dashboard. You can then use the `clerkClient.users.updateUserMetadata` function to add custom attributes to the user's public metadata. These attributes will be included in the JWT.

### Customizing the Sign-in Page

You can customize the appearance of the sign-in page by providing custom components to the `SignIn` component. See the Clerk documentation for more information.

### Adding New Authentication Providers

You can add new authentication providers (e.g., social sign-on providers) by enabling them in your Clerk dashboard.
