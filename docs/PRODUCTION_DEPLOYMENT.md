# Production Deployment Guide

## Overview

This guide covers deploying the Payroll ByteMy application to production, including CSP configuration, environment setup, and troubleshooting common deployment issues.

## Production Environment

- **Domain**: `payroll.app.bytemy.com.au`
- **Platform**: Vercel
- **Database**: Neon PostgreSQL with Hasura GraphQL Engine
- **Authentication**: Clerk with custom domains

## Pre-Deployment Checklist

### 1. Environment Variables

Ensure these production environment variables are configured:

```bash
# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLERK_WEBHOOK_SECRET=whsec_...

# Database & GraphQL
NEXT_PUBLIC_HASURA_GRAPHQL_URL=https://bytemy.hasura.app/v1/graphql
HASURA_SERVICE_ACCOUNT_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Production URLs
NEXT_PUBLIC_APP_URL=https://payroll.app.bytemy.com.au
VERCEL_URL=payroll.app.bytemy.com.au

# API Security
API_SECRET_KEY=your-production-api-secret

# Feature Flags
FEATURE_MFA_ENABLED=false
```

### 2. Build Configuration

```bash
# Test production build locally
pnpm build

# Check for type errors
pnpm lint

# Verify GraphQL generation
pnpm codegen
```

### 3. Security Headers

The application includes comprehensive security headers configured in `next.config.js`:

- **CSP (Content Security Policy)**: Prevents XSS attacks
- **HSTS**: Forces HTTPS connections
- **X-Frame-Options**: Prevents clickjacking
- **X-Content-Type-Options**: Prevents MIME sniffing

## Content Security Policy (CSP) Configuration

### Current CSP Settings

```javascript
"Content-Security-Policy": [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'strict-dynamic' https://clerk.com https://accounts.bytemy.com.au https://clerk.bytemy.com.au https://*.vercel.app https://*.vercel-insights.com https://*.vercel-analytics.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://api.clerk.com https://clerk.com https://accounts.bytemy.com.au https://clerk.bytemy.com.au wss://accounts.bytemy.com.au wss://clerk.bytemy.com.au https://*.neon.tech wss://*.neon.tech https://bytemy.hasura.app https://payroll.app.bytemy.com.au https://*.vercel.app https://*.vercel-insights.com https://*.vercel-analytics.com",
  "worker-src 'self' blob:",
  "frame-src 'self' https://clerk.com https://accounts.bytemy.com.au https://clerk.bytemy.com.au",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests"
].join("; ")
```

### CSP Troubleshooting

#### Common CSP Errors and Solutions

**1. Script Loading Errors**
```
Refused to load the script because it violates CSP directive "script-src"
```

**Solution**: The CSP now includes `'unsafe-inline'` to allow Next.js inline scripts.

**2. Inline Script Execution Errors**
```
Refused to execute inline script because it violates CSP directive "script-src"
```

**Solution**: Added `'unsafe-inline'` to `script-src` directive for Next.js compatibility.

**3. Font Loading Issues**
```
Refused to load the font because it violates CSP directive "font-src"
```

**Solution**: Ensure `font-src 'self' data:` is included in CSP.

### Adding New Domains

To add new trusted domains to CSP:

1. **For Scripts**: Add to `script-src` directive
2. **For API Calls**: Add to `connect-src` directive
3. **For Fonts**: Add to `font-src` directive
4. **For Images**: Add to `img-src` directive

Example:
```javascript
"script-src 'self' 'unsafe-inline' 'strict-dynamic' https://new-domain.com",
"connect-src 'self' https://api.new-domain.com",
```

## Deployment Process

### 1. Vercel Deployment

The application is automatically deployed via Vercel when pushed to the main branch.

### 2. Build Process

```bash
# Vercel runs these commands automatically:
pnpm install
pnpm build
```

### 3. Post-Deployment Verification

1. **Health Check**: Visit `/api/health` endpoint
2. **Authentication**: Test login flow
3. **GraphQL**: Verify API connections
4. **CSP**: Check browser console for CSP violations

## Common Production Issues

### 1. CSP Violations

**Symptoms**: 
- Scripts not loading
- Console errors about CSP violations
- Authentication not working

**Solution**:
1. Check browser console for specific CSP errors
2. Update `next.config.js` with required domains
3. Redeploy application

### 2. Authentication Issues

**Symptoms**:
- Clerk authentication not working
- Infinite redirect loops
- Token validation errors

**Solution**:
1. Verify Clerk production keys are set
2. Check custom domain configuration in Clerk dashboard
3. Ensure production URLs match in all configurations

### 3. Database Connection Issues

**Symptoms**:
- GraphQL queries failing
- 500 errors on API routes
- Hasura connection timeouts

**Solution**:
1. Verify Hasura service account token
2. Check database connection in Neon dashboard
3. Validate GraphQL endpoint URL

### 4. Environment Variable Issues

**Symptoms**:
- Missing configuration
- API keys not working
- Feature flags not applying

**Solution**:
1. Check Vercel environment variables dashboard
2. Ensure all required variables are set for production
3. Restart deployment after updating variables

## Security Considerations

### 1. SOC2 Compliance

- All API routes include audit logging
- User actions are tracked with security classifications
- Data access is role-based and logged

### 2. HTTPS Enforcement

- HSTS headers force HTTPS connections
- All external resources use HTTPS URLs
- Certificate management handled by Vercel

### 3. Authentication Security

- JWT tokens include Hasura claims
- Role-based access control enforced at GraphQL level
- Session management handled by Clerk

## Monitoring and Logging

### 1. Application Monitoring

- Vercel provides automatic performance monitoring
- Error tracking via Vercel dashboard
- Real-time logs available in Vercel CLI

### 2. Security Monitoring

- CSP violation reports logged to console
- Authentication events tracked in audit logs
- Failed requests monitored via middleware

### 3. Database Monitoring

- Neon provides database performance metrics
- Hasura console shows GraphQL query performance
- Connection pooling monitored automatically

## Rollback Procedures

### 1. Vercel Rollback

```bash
# List recent deployments
vercel --list

# Rollback to previous deployment
vercel rollback [deployment-url]
```

### 2. Configuration Rollback

1. Revert environment variables in Vercel dashboard
2. Push previous configuration to git
3. Verify rollback success with health checks

## Performance Optimization

### 1. Build Optimization

- Next.js automatic code splitting enabled
- Image optimization configured for Clerk domains
- TypeScript strict mode for better tree shaking

### 2. CDN Configuration

- Static assets served via Vercel Edge Network
- Images optimized automatically
- Compression enabled for all text assets

### 3. Database Performance

- Connection pooling via Neon
- Query optimization through Hasura
- Proper indexing on frequently accessed tables

## Support and Troubleshooting

### 1. Deployment Logs

```bash
# View deployment logs
vercel logs

# Follow real-time logs
vercel logs --follow
```

### 2. Health Checks

- **Application**: `GET /api/health`
- **Database**: `GET /api/health/database`
- **Authentication**: `GET /api/auth/status`

### 3. Emergency Contacts

- **Database Issues**: Neon support
- **Authentication Issues**: Clerk support
- **Deployment Issues**: Vercel support

---

**Last Updated**: June 2025  
**Version**: 1.0.0