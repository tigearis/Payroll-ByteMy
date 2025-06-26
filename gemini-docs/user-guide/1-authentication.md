
# User Authentication

This document explains how to sign in to the application, how authentication works, and how to manage your account.

## Signing In

To sign in to the application, you will need to have an account. If you have not been invited to the application, please contact your administrator.

The sign-in process is handled by Clerk, a secure and reliable authentication service. When you navigate to the sign-in page, you will see a sign-in form provided by Clerk. You can sign in using your email and password, or by using a social sign-on provider like Google or GitHub, if enabled.

## How Authentication Works

The application uses a combination of Clerk and JSON Web Tokens (JWTs) to authenticate users and control access to resources. Here's a high-level overview of the authentication flow:

1.  **Sign-in:** You sign in using the Clerk sign-in form.
2.  **Clerk Verification:** Clerk verifies your credentials and, if successful, creates a session for you.
3.  **JWT Generation:** Clerk generates a JWT that contains information about you, including your user ID and any roles you have been assigned.
4.  **Request to Application:** When you make a request to the application, the JWT is sent in the request headers.
5.  **Middleware Verification:** The application's middleware intercepts the request and uses Clerk's libraries to verify the JWT.
6.  **Hasura Claims:** If the JWT is valid, the middleware adds Hasura claims to the request, which are used to control access to the database.
7.  **Access Granted:** If you have the necessary permissions, you are granted access to the requested resource.

This process ensures that only authenticated and authorized users can access the application's resources.

## Managing Your Account

You can manage your account by navigating to the "Profile" section of the application. From there, you can:

*   Update your profile information
*   Change your password
*   Manage your security settings

