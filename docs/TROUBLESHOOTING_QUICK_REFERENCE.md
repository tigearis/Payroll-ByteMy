# Troubleshooting Quick Reference

## Overview

This quick reference guide provides solutions to common issues encountered while developing, deploying, and maintaining the Payroll ByteMy system. Issues are organized by category with immediate solutions and preventive measures.

## 🚨 Authentication & Permission Issues

### Issue: "User not found in database" Error

**Symptoms**: User can log into Clerk but gets database errors
```
Error: User not found in database
GraphQL Error: field "users" not found
```

**Quick Fix**:
```bash
# Sync user to database
curl -X POST http://localhost:3000/api/sync-current-user
# Or use the sync button in the UI
```

**Root Causes & Solutions**:
1. **Webhook not configured**: Set up Clerk webhook for user sync
2. **Database connection issue**: Check `DATABASE_URL` environment variable
3. **Permission issue**: Verify Hasura permissions for user table

**Prevention**:
- Configure Clerk webhooks properly during setup
- Monitor webhook delivery in Clerk dashboard
- Set up automated user sync processes

### Issue: Permission Denied in GraphQL Queries

**Symptoms**: GraphQL queries fail with permission errors
```
Permission denied for field "fieldName" on type "tableName"
```

**Quick Fix**:
```bash
# Fix all permission issues automatically
pnpm fix:permissions

# Or check specific permission
cd hasura && hasura console
# Navigate to Data > [table] > Permissions
```

**Root Causes & Solutions**:
1. **Missing field permissions**: Add field to role's column list
2. **Outdated metadata**: Apply latest metadata changes
3. **Wrong role assignment**: Check user's role in Clerk

**Prevention**:
- Run `pnpm fix:permissions` after schema changes
- Use consistent permission patterns across tables
- Test permissions for each role during development

### Issue: JWT Token Issues

**Symptoms**: Authentication works intermittently or fails
```
JWT verification failed
Invalid or expired token
```

**Quick Fix**:
```typescript
// Clear session and re-authenticate
import { useAuth } from '@clerk/nextjs';

const { signOut, signIn } = useAuth();
await signOut();
await signIn();
```

**Root Causes & Solutions**:
1. **JWT template misconfigured**: Verify Clerk JWT template matches expected format
2. **Token expiry**: Check token refresh logic
3. **Environment variable mismatch**: Verify `CLERK_SECRET_KEY` and `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

**Prevention**:
- Use the exact JWT template from documentation
- Monitor token expiry times
- Set up proper token refresh mechanisms

## 📝 API Response Utilities Issues

### Issue: Import Errors for API Response Utilities

**Symptoms**: Build fails with missing module errors
```
Cannot find module '@/lib/security/error-responses'
Cannot find module '@/lib/shared/responses'
Property 'error' does not exist on type 'NextResponse'
```

**Quick Fix**:
```typescript
// Update import statements
// OLD (deprecated)
import { SecureErrorHandler } from '@/lib/security/error-responses';

// NEW (current)
import { ApiResponses } from '@/lib/api-responses';
```

**Root Causes & Solutions**:
1. **Outdated imports**: Update to use consolidated `/lib/api-responses.ts`
2. **Method name changes**: Use new method names (see below)
3. **Response structure**: Methods now return `NextResponse` objects directly

**Method Migration Guide**:
```typescript
// Authentication errors
SecureErrorHandler.authenticationError() → ApiResponses.authenticationRequired()

// Validation errors  
SecureErrorHandler.validationError("msg") → ApiResponses.badRequest("msg")

// Error sanitization
SecureErrorHandler.sanitizeError(err, "ctx") → ApiResponses.secureError(err, "ctx")

// Permission errors
SecureErrorHandler.authorizationError("role") → ApiResponses.insufficientPermissions(["role"])
```

**Prevention**:
- Use `/lib/api-responses.ts` for all new error handling
- Follow the consolidated error response patterns
- Review TypeScript build errors for import issues

### Issue: API Key Management Errors

**Symptoms**: API key operations fail with method not found
```
Property 'generateKeyPair' does not exist
apiKeyManager.storeKey is not a function
```

**Quick Fix**:
```typescript
// OLD (deprecated)
import { apiKeyManager } from '@/lib/security/api-signing';
const { apiKey, apiSecret } = apiKeyManager.generateKeyPair();

// NEW (current)
import { PersistentAPIKeyManager } from '@/lib/security/persistent-api-keys';
const result = await PersistentAPIKeyManager.createAPIKey({
  name: "API Key Name",
  permissions: ["read", "write"],
  createdBy: userId
});
```

**Root Causes & Solutions**:
1. **Deprecated methods**: Migrate to `PersistentAPIKeyManager` for database-backed security
2. **Missing parameters**: New methods require additional parameters like `createdBy`
3. **Async operations**: New methods are all async and return promises

**Prevention**:
- Use `PersistentAPIKeyManager` for all API key operations
- Check method signatures before implementing
- Ensure proper error handling for async operations

## 🔧 Development Environment Issues

### Issue: "pnpm dev" Fails to Start

**Symptoms**: Development server won't start
```
Error: Cannot resolve module
Port already in use
Environment variable not found
```

**Quick Fix**:
```bash
# Kill existing processes
lsof -ti:3000 | xargs kill -9
lsof -ti:8080 | xargs kill -9

# Clear cache and reinstall
rm -rf node_modules .next
pnpm install
pnpm dev
```

**Root Causes & Solutions**:
1. **Port conflicts**: Kill processes using ports 3000, 8080, 9695
2. **Missing dependencies**: Run `pnpm install`
3. **Environment variables**: Copy `.env.example` to `.env.local`
4. **Node.js version**: Use Node.js 18+ (check with `node --version`)

**Prevention**:
- Use unique ports for different projects
- Set up proper environment variable management
- Document required Node.js version

### Issue: GraphQL Code Generation Fails

**Symptoms**: `pnpm codegen` command fails
```
GraphQL schema fetch failed
Type generation error
Invalid GraphQL syntax
```

**Quick Fix**:
```bash
# Download fresh schema
pnpm get-schema

# Fix any GraphQL syntax errors in .graphql files
# Then regenerate types
pnpm codegen
```

**Root Causes & Solutions**:
1. **Hasura not running**: Start Hasura with `cd hasura && hasura console`
2. **Invalid GraphQL syntax**: Check all `.graphql` files for syntax errors
3. **Schema outdated**: Run `pnpm get-schema` to get latest schema
4. **Network issues**: Check `NEXT_PUBLIC_HASURA_GRAPHQL_URL`

**Prevention**:
- Keep Hasura running during development
- Use GraphQL syntax validation in IDE
- Automate schema updates in development workflow

### Issue: Database Connection Problems

**Symptoms**: Cannot connect to database
```
Connection refused
Database does not exist
Authentication failed
```

**Quick Fix**:
```bash
# Test database connection
psql $DATABASE_URL -c "SELECT 1;"

# Check environment variables
echo $DATABASE_URL
echo $HASURA_GRAPHQL_DATABASE_URL
```

**Root Causes & Solutions**:
1. **Incorrect DATABASE_URL**: Verify connection string format
2. **Database server down**: Check Neon/PostgreSQL server status
3. **Network issues**: Verify connectivity to database host
4. **SSL requirements**: Ensure SSL parameters in connection string

**Prevention**:
- Use database connection pooling
- Monitor database server status
- Keep backup connection strings

## 🏗️ Build & Deployment Issues

### Issue: Next.js Build Fails

**Symptoms**: `pnpm build` command fails
```
Type errors in build
Module not found
Memory issues during build
```

**Quick Fix**:
```bash
# Clear build cache
rm -rf .next

# Fix TypeScript errors
pnpm lint --fix

# Build with verbose output
pnpm build --debug
```

**Root Causes & Solutions**:
1. **TypeScript errors**: Fix all type errors shown in output
2. **Missing dependencies**: Ensure all imports are installed
3. **Memory issues**: Increase Node.js memory limit
4. **Environment variables**: Verify all required variables are set

**Prevention**:
- Run builds regularly during development
- Set up TypeScript strict mode
- Monitor build performance and optimize large dependencies

### Issue: Vercel Deployment Failures

**Symptoms**: Deployment fails on Vercel
```
Build failed
Environment variables missing
Function timeout
```

**Quick Fix**:
```bash
# Test build locally first
pnpm build
pnpm start

# Check Vercel environment variables
vercel env ls

# Redeploy with verbose logging
vercel --debug
```

**Root Causes & Solutions**:
1. **Environment variables**: Add all required variables to Vercel dashboard
2. **Build timeout**: Optimize build process or request timeout increase
3. **Function size**: Check serverless function size limits
4. **Dependencies**: Ensure all dependencies are in `package.json`

**Prevention**:
- Automate environment variable synchronization
- Monitor build performance
- Set up staging deployments for testing

### Issue: Hasura Metadata Apply Fails

**Symptoms**: Cannot apply Hasura metadata
```
Metadata apply failed
Inconsistent metadata
Permission errors
```

**Quick Fix**:
```bash
cd hasura

# Export current metadata to see conflicts
hasura metadata export

# Clear metadata and reapply
hasura metadata clear
hasura metadata apply

# Or reload if metadata is corrupted
hasura metadata reload
```

**Root Causes & Solutions**:
1. **Conflicting metadata**: Resolve conflicts in YAML files
2. **Permission errors**: Verify Hasura admin secret
3. **Database schema mismatch**: Ensure database matches metadata
4. **Network issues**: Check connection to Hasura endpoint

**Prevention**:
- Version control metadata changes
- Test metadata changes in development
- Use consistent metadata format

## 📊 Performance Issues

### Issue: Slow GraphQL Queries

**Symptoms**: Queries take too long to execute
```
Query timeout
Slow response times
High database CPU usage
```

**Quick Fix**:
```sql
-- Check query performance
EXPLAIN ANALYZE SELECT * FROM table_name WHERE condition;

-- Add missing indexes
CREATE INDEX idx_table_field ON table_name(field);

-- Optimize query
-- Use specific fields instead of *
-- Add proper WHERE clauses
-- Use pagination
```

**Root Causes & Solutions**:
1. **Missing indexes**: Add indexes on commonly queried fields
2. **N+1 queries**: Use fragments to fetch related data efficiently
3. **Large result sets**: Implement pagination
4. **Complex queries**: Optimize with proper joins and filters

**Prevention**:
- Monitor query performance regularly
- Use query analysis tools
- Implement proper pagination from start

### Issue: High Memory Usage

**Symptoms**: Application uses too much memory
```
Out of memory errors
Slow page loads
Server crashes
```

**Quick Fix**:
```typescript
// Implement proper cleanup
useEffect(() => {
  const subscription = subscribe();
  return () => subscription.unsubscribe();
}, []);

// Use memo for expensive calculations
const expensiveValue = useMemo(() => 
  heavyCalculation(data), [data]
);
```

**Root Causes & Solutions**:
1. **Memory leaks**: Ensure proper cleanup of subscriptions and event listeners
2. **Large data sets**: Implement virtualization for large lists
3. **Unused dependencies**: Remove unused npm packages
4. **Inefficient state management**: Optimize React state and context usage

**Prevention**:
- Regular memory profiling
- Code review for memory leaks
- Implement performance monitoring

## 🔐 Security Issues

### Issue: CORS Errors

**Symptoms**: API requests fail with CORS errors
```
CORS policy blocked request
Access-Control-Allow-Origin missing
Preflight request failed
```

**Quick Fix**:
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};
```

**Root Causes & Solutions**:
1. **Missing CORS headers**: Configure proper CORS in Next.js config
2. **Hasura CORS**: Configure CORS in Hasura environment variables
3. **Clerk CORS**: Add domains to Clerk allowed origins

**Prevention**:
- Configure CORS properly during initial setup
- Use environment-specific CORS settings
- Test CORS in different environments

### Issue: Environment Variable Exposure

**Symptoms**: Sensitive data exposed in client
```
API keys visible in browser
Database URLs in client bundle
```

**Quick Fix**:
```bash
# Check for exposed variables
pnpm build
# Look for warnings about environment variables

# Prefix client variables with NEXT_PUBLIC_
# Keep server variables without prefix
```

**Root Causes & Solutions**:
1. **Incorrect naming**: Use `NEXT_PUBLIC_` prefix only for client variables
2. **Bundle analysis**: Check what's included in client bundle
3. **Secret management**: Use proper secret management services

**Prevention**:
- Environment variable naming conventions
- Regular security audits
- Use secret scanning tools

## 🔄 Data Issues

### Issue: Data Sync Problems

**Symptoms**: Data inconsistency between Clerk and database
```
User exists in Clerk but not database
Role changes not reflected
Metadata out of sync
```

**Quick Fix**:
```bash
# Sync current user
curl -X POST /api/sync-current-user

# Bulk sync all users (admin only)
curl -X POST /api/admin/sync-all-users
```

**Root Causes & Solutions**:
1. **Webhook failures**: Check Clerk webhook delivery logs
2. **Database constraints**: Verify foreign key constraints don't block inserts
3. **Permission issues**: Ensure sync operations have proper permissions

**Prevention**:
- Monitor webhook delivery success rates
- Set up automated sync verification
- Implement proper error handling and retry logic

### Issue: Migration Failures

**Symptoms**: Database migrations fail to apply
```
Migration already applied
Constraint violation
Column already exists
```

**Quick Fix**:
```bash
cd hasura

# Check migration status
hasura migrate status

# Manually mark migration as applied (if safe)
hasura migrate apply --skip-execution --version XXXXXXXXXXXXXX

# Or rollback and fix
hasura migrate apply --down 1
# Fix migration file
hasura migrate apply
```

**Root Causes & Solutions**:
1. **Duplicate migrations**: Check for conflicting migration files
2. **Manual schema changes**: Avoid manual changes to tracked database
3. **Incomplete rollback**: Ensure down migrations are complete

**Prevention**:
- Always use migrations for schema changes
- Test migrations in development first
- Keep migration files in version control

## 📱 UI/UX Issues

### Issue: Components Not Rendering

**Symptoms**: Pages show blank or components missing
```
Component is not defined
Hook can only be used inside provider
Hydration mismatch
```

**Quick Fix**:
```typescript
// Check for missing imports
import { Component } from '@/components/component';

// Ensure providers are set up
// Check for client/server rendering issues
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!mounted) return null;
```

**Root Causes & Solutions**:
1. **Missing imports**: Verify all components are properly imported
2. **Provider issues**: Ensure all required providers wrap components
3. **SSR issues**: Handle client-only components properly

**Prevention**:
- Use TypeScript for import validation
- Set up proper provider hierarchy
- Test both SSR and client rendering

### Issue: Infinite Loading States

**Symptoms**: Loading indicators never disappear
```
Loading state stuck
Queries never complete
Infinite loading spinner
```

**Quick Fix**:
```typescript
// Check query states
const { data, loading, error } = useQuery(QUERY);

console.log({ data, loading, error });

// Ensure proper error handling
if (error) return <ErrorComponent error={error} />;
if (loading) return <LoadingComponent />;
return <DataComponent data={data} />;
```

**Root Causes & Solutions**:
1. **Query errors**: Check for GraphQL query errors
2. **Permission issues**: Verify user has access to data
3. **Network issues**: Check network connectivity

**Prevention**:
- Implement proper error boundaries
- Set query timeouts
- Add offline state handling

## 🛠️ Quick Diagnostic Commands

### System Health Check
```bash
# Check all services
pnpm health-check

# Check environment
node --version
npm --version
pnpm --version

# Check ports
lsof -i :3000
lsof -i :8080
lsof -i :9695
```

### Database Health Check
```bash
# Test database connection
psql $DATABASE_URL -c "SELECT version();"

# Check Hasura status
curl -X POST $HASURA_GRAPHQL_URL \
  -H "X-Hasura-Admin-Secret: $HASURA_ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"query":"query{__type(name:\"Query\"){name}}"}'
```

### Authentication Health Check
```bash
# Test Clerk webhooks
curl -X POST $CLERK_WEBHOOK_URL/test

# Verify JWT template
# Check in Clerk dashboard -> JWT Templates
```

### GraphQL Health Check
```bash
# Download schema
pnpm get-schema

# Validate GraphQL files
npx graphql-schema-linter "**/*.graphql"

# Generate types
pnpm codegen --dry-run
```

## 📞 Getting Help

### Error Code Quick Reference

| Error Code | Category | Quick Fix |
|------------|----------|-----------|
| `EADDRINUSE` | Port conflict | `lsof -ti:3000 | xargs kill -9` |
| `MODULE_NOT_FOUND` | Dependencies | `pnpm install` |
| `JWT_VERIFICATION_FAILED` | Authentication | Check Clerk configuration |
| `PERMISSION_DENIED` | Authorization | `pnpm fix:permissions` |
| `CONNECTION_REFUSED` | Database | Check database connection |
| `METADATA_INCONSISTENT` | Hasura | `hasura metadata reload` |

### Log Analysis Commands

```bash
# Next.js logs
npm run dev 2>&1 | grep -i error

# Hasura logs
hasura logs --database-name default

# System logs (Linux/Mac)
tail -f /var/log/system.log | grep -i payroll
```

### Support Resources

1. **Documentation**: Check relevant guide in `/docs`
2. **GitHub Issues**: Search existing issues or create new one
3. **Hasura Console**: Use GraphiQL for GraphQL debugging
4. **Clerk Dashboard**: Check user and webhook status
5. **Database Console**: Use database admin tools for data issues

## 🎯 Prevention Strategies

### Development Best Practices

1. **Regular Updates**: Keep dependencies updated
2. **Testing**: Write tests for critical functionality
3. **Monitoring**: Set up error tracking and performance monitoring
4. **Documentation**: Keep documentation current with changes
5. **Code Review**: Review changes for potential issues

### Deployment Best Practices

1. **Staging Environment**: Test in staging before production
2. **Rollback Plan**: Always have a rollback strategy
3. **Health Checks**: Implement comprehensive health checks
4. **Monitoring**: Set up alerts for critical issues
5. **Backup**: Regular backups of database and configuration

---

This troubleshooting guide should resolve most common issues. For complex problems, refer to the specific documentation sections or seek additional support.