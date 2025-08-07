# Deployment Guide

This guide provides comprehensive instructions for deploying the Payroll-ByteMy application to production and preview environments on Vercel.

## 1. Environment Setup

### 1.1. Core Environment Variables

The following environment variables must be configured in your Vercel project settings for **Production, Preview, and Development** environments.

- **`NODE_ENV`**: Set to `production` for production deployments.
- **`FEATURE_MFA_ENABLED`**: `true` or `false` depending on whether you want to enforce Multi-Factor Authentication.

- **`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`**: Your Clerk publishable key.
- **`CLERK_SECRET_KEY`**: Your Clerk secret key.
- **`NEXT_PUBLIC_CLERK_SIGN_IN_URL`**: `/sign-in`
- **`NEXT_PUBLIC_CLERK_SIGN_UP_URL`**: `/sign-up`
- **`NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`**: `/`
- **`NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`**: `/`

- **`NEXT_PUBLIC_HASURA_GRAPHQL_URL`**: The endpoint for your Hasura GraphQL API.
- **`HASURA_ADMIN_SECRET`**: The admin secret for your Hasura instance (used for migrations/metadata only).

### 1.2. Secure Secrets

The following secrets must be generated securely and added to Vercel. Use `openssl rand -base64 32` to generate strong secrets.

- **`CRON_SECRET`**: **CRITICAL**. Protects all cron job endpoints from unauthorized execution.
- **`WEBHOOK_SECRET`**: The signing secret from your Clerk webhook configuration.
- **`API_SECRET_KEY`**: A general-purpose secret for securing internal API communications.
- **`SESSION_SECRET`**: Used for session management.

**Example `CRON_SECRET` (You MUST use your own generated secret):**
`CRON_SECRET=[REDACTED_CRON_SECRET]`

## 2. Hasura JWT Configuration

Hasura must be configured to use JWTs issued by Clerk for authentication. The configuration is different for production and preview environments.

### 2.1. Production JWT Secret

Set this as the `HASURA_GRAPHQL_JWT_SECRET` environment variable in your **production** Hasura instance.

```json
{
  "type": "RS256",
  "jwks_uri": "https://clerk.payroll.app.bytemy.com.au/.well-known/jwks.json",
  "claims_format": "json",
  "audience": "https://payroll.app.bytemy.com.au",
  "issuer": "https://clerk.payroll.app.bytemy.com.au",
  "claims_map": {
    "x-hasura-allowed-roles": { "path": "$.metadata.roles" },
    "x-hasura-default-role": { "path": "$.metadata.default_role" },
    "x-hasura-user-id": { "path": "$.sub" }
  }
}
```

### 2.2. Preview/Development JWT Secret

Set this as the `HASURA_GRAPHQL_JWT_SECRET` environment variable in your **preview/development** Hasura instance.

```json
{
  "type": "RS256",
  "jwks_uri": "https://harmless-primate-53.clerk.accounts.dev/.well-known/jwks.json",
  "claims_format": "json",
  "audience": "https://payroll-preview.vercel.app",
  "issuer": "https://harmless-primate-53.clerk.accounts.dev",
  "claims_map": {
    "x-hasura-allowed-roles": { "path": "$.metadata.roles" },
    "x-hasura-default-role": { "path": "$.metadata.default_role" },
    "x-hasura-user-id": { "path": "$.sub" }
  }
}
```

## 3. Securing Cron Jobs

All cron jobs are protected and require the `CRON_SECRET` to be passed in the `x-cron-secret` header.

### 3.1. `vercel.json` Configuration

Your `vercel.json` file must be updated to include the secret header in the cron definitions.

```json
{
  "crons": [
    {
      "path": "/api/cron/compliance-check",
      "schedule": "0 2 * * *",
      "headers": {
        "x-cron-secret": "$CRON_SECRET"
      }
    },
    {
      "path": "/api/cron/sync-holidays",
      "schedule": "0 3 1 * *",
      "headers": {
        "x-cron-secret": "$CRON_SECRET"
      }
    }
  ]
}
```

This configuration ensures that when Vercel triggers the cron job, it includes the secret from your environment variables.

## 4. Pre-Deployment Checklist

Before deploying to production, complete the following steps:

1.  **Run Automated Tests**:

    ```bash
    node scripts/test-auth-fixes.js
    ```

    Ensure all tests pass with 100% success rate.

2.  **Verify Environment Variables**: Confirm that all secrets and configuration variables listed above are set correctly in the Vercel project settings for the appropriate environment (Production/Preview).

3.  **Manual Security Tests**:

    - Log in as an `admin` user and verify access to admin-only API routes (e.g., `/api/staff/create`).
    - Log in as a `viewer` user and verify they are blocked from admin routes with a 403 Forbidden error.
    - Verify that debug routes (e.g., `/api/simple-test`) are disabled in production and return a 401 Unauthorized error.

4.  **Confirm Monitoring is Active**: Check that your monitoring solution (e.g., Datadog, Sentry) is receiving logs and that security events are being captured.

## 5. Deployment & Post-Deployment Monitoring

### 5.1. Deployment Process

1.  **Deploy to Preview**: Push your feature branch to trigger a preview deployment. Thoroughly test all functionality.
2.  **Deploy to Production**: Merge your changes into the `main` branch to trigger a production deployment.

### 5.2. Post-Deployment Checks (First 24 Hours)

- **Monitor Health**: Check the `/api/health` endpoint and monitor for any new exceptions or error spikes in your monitoring dashboard.
- **Review Logs**: Watch the logs for authentication errors, unusual access patterns, or failed cron jobs.
- **Verify Cron Jobs**: Check the execution logs in Vercel to ensure cron jobs are running successfully on schedule.
- **Confirm Authentication**: Perform a final test of the login and sign-up flows in the live production environment.

---

**Document Status**: Consolidated & Live
**Last Updated**: Current Date

---
