# Vercel Deployment Configuration Guide

## Project Setup

### 1. Vercel Project Configuration

Create these environments in your Vercel dashboard:

- **Production**: `payroll.app.bytemy.com.au`
- **Preview**: For pull requests and feature branches

### 2. Environment Variables Setup

#### Production Environment Variables

Go to your Vercel project → Settings → Environment Variables and add:

```bash
# Application
NEXT_PUBLIC_APP_URL=https://payroll.app.bytemy.com.au
NODE_ENV=production

# Clerk Authentication - PRODUCTION
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_Y2xlcmsucGF5cm9sbC5hcHAuYnl0bWUuY29tLmF1JA
CLERK_SECRET_KEY=sk_live_UKOKO76vgzbJbt8Qy9Zp2o7jHMYRppan0v48XXtQuG
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Hasura GraphQL - PRODUCTION
NEXT_PUBLIC_HASURA_GRAPHQL_URL=https://bytemy.hasura.app/v1/graphql
NEXT_PUBLIC_HASURA_GRAPHQL_WS_URL=wss://bytemy.hasura.app/v1/graphql

# Hasura Action Configuration - PRODUCTION
ACTION_BASE_ENDPOINT=https://payroll.app.bytemy.com.au

# Rate Limiting - PRODUCTION
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=200
```

#### Preview Environment Variables

```bash
# Application
NEXT_PUBLIC_APP_URL=https://payroll-preview.vercel.app
NODE_ENV=preview

# Clerk Authentication - PREVIEW (use your current development keys)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=[your-current-development-publishable-key]
CLERK_SECRET_KEY=[your-current-development-secret-key]
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Hasura GraphQL - PREVIEW
NEXT_PUBLIC_HASURA_GRAPHQL_URL=https://bytemy.hasura.app/v1/graphql
NEXT_PUBLIC_HASURA_GRAPHQL_WS_URL=wss://bytemy.hasura.app/v1/graphql

# Hasura Action Configuration - PREVIEW
ACTION_BASE_ENDPOINT=https://payroll-preview.vercel.app

# Rate Limiting - PREVIEW
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Domain Configuration

#### Production Domain

1. Go to Vercel project → Settings → Domains
2. Add domain: `payroll.app.bytemy.com.au`
3. Configure DNS records as instructed by Vercel

#### Preview Domains

- Vercel will automatically generate preview URLs for pull requests
- Format: `https://your-project-git-branch-name-username.vercel.app`

### 4. Build Configuration

Your `vercel.json` already has good configuration:

```json
{
  "buildCommand": "pnpm run build",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### 5. Deployment Commands

#### Deploy to Production

```bash
# Option 1: Via Git (Recommended)
git push origin main  # Triggers automatic production deployment

# Option 2: Via Vercel CLI
vercel --prod
```

#### Deploy Preview

```bash
# Option 1: Via Git (Recommended)
git push origin feature-branch  # Triggers automatic preview deployment

# Option 2: Via Vercel CLI
vercel  # Deploys to preview environment
```

### 6. Environment-Specific Configuration

#### Update your Next.js config for production optimization:

```javascript
// next.config.js - Add production optimizations
const nextConfig = {
  // ... existing config

  // Production optimizations
  ...(process.env.NODE_ENV === "production" && {
    // Disable source maps in production for security
    productionBrowserSourceMaps: false,

    // Enable compression
    compress: true,

    // Optimize images
    images: {
      domains: ["img.clerk.com", "images.clerk.dev"],
      formats: ["image/avif", "image/webp"],
      minimumCacheTTL: 86400, // 24 hours
    },
  }),
};
```

### 7. Monitoring and Analytics

#### Add performance monitoring:

```bash
# Optional: Vercel Analytics
VERCEL_ANALYTICS=true

# Optional: Vercel Speed Insights
VERCEL_SPEED_INSIGHTS=true
```

### 8. Security Headers (Production)

Your current security headers are good. For production, consider adding:

```javascript
// next.config.js - Enhanced production headers
headers: [
  {
    source: "/(.*)",
    headers: [
      // ... existing headers
      {
        key: "X-Robots-Tag",
        value:
          process.env.NODE_ENV === "production"
            ? "index, follow"
            : "noindex, nofollow",
      },
    ],
  },
];
```

### 9. Deployment Checklist

#### Before Production Deployment:

- [ ] Test all authentication flows with production Clerk keys
- [ ] Verify Hasura JWT configuration works
- [ ] Test API routes and GraphQL queries
- [ ] Check all environment variables are set
- [ ] Test error boundaries and fallbacks
- [ ] Verify CORS settings for production domain
- [ ] Test webhook endpoints (if any)
- [ ] Validate SSL certificate on custom domain

#### After Production Deployment:

- [ ] Test full user flows (signup, login, logout)
- [ ] Verify data loading and mutations work
- [ ] Check performance and load times
- [ ] Test error handling in production
- [ ] Validate analytics and monitoring
- [ ] Test mobile responsiveness

### 10. Rollback Plan

#### If issues occur in production:

```bash
# Option 1: Revert via Vercel dashboard
# Go to Deployments → Find last good deployment → Promote to Production

# Option 2: Revert via Git
git revert HEAD  # Revert last commit
git push origin main  # Triggers new deployment

# Option 3: Redeploy specific commit
vercel --prod --yes # Deploy current state to production
```

### 11. Environment Variable Management

#### Secrets Management:

- Use Vercel's environment variables for sensitive data
- Never commit `.env.production` or `.env.preview` to git
- Use different secrets for production vs preview
- Rotate secrets regularly

#### Required Secrets to Generate:

```bash
# Generate these with: openssl rand -base64 32
CRON_SECRET=[generate-new]
API_SECRET_KEY=[generate-new]
SESSION_SECRET=[generate-new]
CLERK_WEBHOOK_SECRET=[from-clerk-dashboard]
```

This setup will give you a robust production and preview environment with proper security and monitoring.
