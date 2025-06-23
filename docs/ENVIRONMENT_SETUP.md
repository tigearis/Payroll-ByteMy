# Environment Variables Configuration

This document describes the environment variable setup for the Payroll Matrix application.

## 🚨 Important Issues Fixed

### 1. **Infinite Loop Issues Resolved**
- ❌ Removed `NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL`
- ❌ Removed `NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL`
- ✅ These were causing React error #185 (Maximum update depth exceeded)

### 2. **Environment Separation**
- ✅ Development uses test Clerk instance (`pk_test_*`, `sk_test_*`)
- ✅ Production uses live Clerk instance (`pk_live_*`, `sk_live_*`)
- ✅ Proper URL configuration for each environment

### 3. **Cleaned Up Variables**
- ✅ Removed trailing newlines from URLs
- ✅ Removed duplicate variable definitions
- ✅ Standardized naming conventions
- ✅ Added proper documentation

## 📁 File Structure

```
.env                    → Local development (test Clerk)
.env.development.local  → Full development config  
.env.production        → Production config (live Clerk)
.env.example          → Template for new developers
.env.test             → Test environment
```

## 🔧 Key Variables by Category

### Application
```bash
NEXT_PUBLIC_APP_URL="http://localhost:3000"           # Dev
NEXT_PUBLIC_APP_URL="https://payroll.app.bytemy.com.au"  # Prod
ACTION_BASE_ENDPOINT="http://localhost:3000"         # Dev
ACTION_BASE_ENDPOINT="https://bytemy.hasura.app/v1/graphql"  # Prod
```

### Clerk Authentication
```bash
# Development (Test Instance)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_aGFybWxlc3MtcHJpbWF0ZS01My5jbGVyay5hY2NvdW50cy5kZXYk"
CLERK_SECRET_KEY="sk_test_Vmcx7vTwGJWmXtwVc5hWUxKGIF7BiwA2GevfPUNCVv"
CLERK_ISSUER_URL="https://harmless-primate-53.clerk.accounts.dev"

# Production (Live Instance)  
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_Y2xlcmsuYnl0ZW15LmNvbS5hdSQ"
CLERK_SECRET_KEY="sk_live_UKOKO76vgzbJbt8Qy9Zp2o7jHMYRppan0v48XXtQuG"
CLERK_ISSUER_URL="https://clerk.bytemy.com.au"
```

### Clerk URLs (No Force Redirects)
```bash
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL="/"
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL="/dashboard"
```

### Hasura GraphQL
```bash
NEXT_PUBLIC_HASURA_GRAPHQL_URL="https://bytemy.hasura.app/v1/graphql"
HASURA_GRAPHQL_ADMIN_SECRET="3w+sHTuq8wQwddK4xyWO5LDeRH+anvJoFVyOMvtq8Lo="

# Service operations use admin secret for direct access
# Admin secret provides unrestricted superuser access to all Hasura operations
```

### Database (Neon)
```bash
DATABASE_URL="postgres://neondb_owner:npg_WavFRZ1lEx4U@ep-black-sunset-a7wbc0zq-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require"
```

## 🚀 Deployment

### Vercel Environment Variables
Production environment variables are managed through Vercel dashboard:
1. Go to project settings → Environment Variables
2. Set production values for all required variables
3. Ensure `HASURA_GRAPHQL_ADMIN_SECRET` is properly configured

### Service Authentication
The system uses Hasura's admin secret for service operations (webhooks, cron jobs, admin functions). This provides direct, unrestricted access without JWT complexity.

## 🔒 Security Notes

1. **Never commit .env files** - They're properly gitignored
2. **Use admin secrets for service operations**, JWT tokens for user operations
3. **Separate test/live Clerk instances** for proper environment isolation
4. **No force redirect URLs** to prevent infinite loops

## 🛠️ Local Development Setup

1. Copy `.env.example` to `.env.local`
2. Fill in your actual values
3. Use test Clerk instance for development
4. Ensure database connection works

## ✅ Verification

After setup, verify:
- [ ] No infinite redirect loops on page refresh
- [ ] Authentication works in both environments
- [ ] GraphQL queries succeed
- [ ] Database connections work
- [ ] No force redirect URLs present

## 📖 Related Documentation

- [Clerk Core 2 Migration](../docs/CLERK_CORE_2_MIGRATION.md)
- [Authentication Setup](../docs/AUTHENTICATION.md)
- [Hasura Configuration](../docs/HASURA_SETUP.md)