# COMPREHENSIVE SYSTEM GUIDE

This is the primary technical reference for the Payroll ByteMy system as referenced in `CLAUDE.md`.

## 🏗️ System Architecture

### Enhanced Permissions System (Production Ready)
- **Implementation**: Native Clerk `has({ permission })` with custom permissions in `publicMetadata`
- **Granular Control**: 18 specific permissions across 5 hierarchical roles
- **Key Files**:
  - `lib/auth/custom-permissions.ts` - Permission definitions
  - `lib/auth/enhanced-api-auth.ts` - API route wrapper
  - `components/auth/EnhancedPermissionGuard.tsx` - Component guards
  - `hooks/useEnhancedPermissions.tsx` - React hook with property-based access
  - `lib/auth/metadata-manager.server.ts` - Centralized role management

### Permission Structure
```typescript
// 18 permissions across 5 roles
CUSTOM_PERMISSIONS = [
  // Payroll: read, write, delete, assign
  'custom:payroll:read', 'custom:payroll:write', 'custom:payroll:delete', 'custom:payroll:assign',
  
  // Staff: read, write, delete, invite  
  'custom:staff:read', 'custom:staff:write', 'custom:staff:delete', 'custom:staff:invite',
  
  // Client: read, write, delete
  'custom:client:read', 'custom:client:write', 'custom:client:delete',
  
  // Admin: manage, settings, billing
  'custom:admin:manage', 'custom:settings:write', 'custom:billing:manage',
  
  // Reporting: read, audit
  'custom:reports:read', 'custom:audit:read'
];

// Role hierarchy: developer(5) > org_admin(4) > manager(3) > consultant(2) > viewer(1)
```

### Authentication Flow
```
User Request → Enhanced API Auth → Native Clerk Permission Check → MetadataManager → Apollo Client → Hasura
```

## 🔐 Authentication Patterns

### API Routes (REQUIRED)
```typescript
import { withEnhancedAuth } from '@/lib/auth/enhanced-api-auth';

// Permission-based
export const POST = withEnhancedAuth(handler, { 
  permission: "custom:staff:write" 
});

// Role-based
export const GET = withEnhancedAuth(handler, { 
  minimumRole: "manager" 
});

// Self-access
export const PUT = withEnhancedAuth(handler, { 
  permission: "custom:staff:read",
  allowSelf: true 
});
```

### Component Protection (REQUIRED)
```typescript
import { EnhancedPermissionGuard } from '@/components/auth/EnhancedPermissionGuard';

// Permission-based rendering
<EnhancedPermissionGuard permission="custom:staff:write">
  <StaffManagementPanel />
</EnhancedPermissionGuard>

// Self-access patterns
<EnhancedPermissionGuard 
  permission="custom:staff:read" 
  allowSelf={true}
  targetUserId={staffMember.id}
>
  <UserProfile />
</EnhancedPermissionGuard>
```

### Hook Usage (Property-based)
```typescript
const { 
  canManageStaff,     // Property, not function
  navigation,         // Navigation permissions
  hasPermission      // Function for custom checks
} = useEnhancedPermissions();

// Property access (not function calls)
{canManageStaff && <StaffTools />}
{navigation.canAccess.security && <SecurityMenu />}
```

## 📊 GraphQL Architecture

### Domain Structure
```
domains/
├── payrolls/graphql/generated/    # Payroll operations
├── clients/graphql/generated/     # Client management
├── users/graphql/generated/       # User/staff management
├── billing/graphql/generated/     # Billing operations
├── leave/graphql/generated/       # Leave management
├── work-schedule/graphql/generated/ # Scheduling
├── auth/graphql/generated/        # Authentication
├── audit/graphql/generated/       # SOC2 compliance
└── shared/graphql/                # Common types
```

### Legacy Operations
- Hand-written operations in `/graphql/` for API routes
- Used by server-side Apollo client
- Maintains backward compatibility

### Code Generation
```bash
pnpm codegen  # Generate all domain types
pnpm codegen:watch  # Watch mode
```

## 🛡️ Security Implementation

### SOC2 Compliance
- **Audit Logging**: All API access logged via middleware
- **Data Classification**: CRITICAL, HIGH, MEDIUM, LOW levels
- **Rate Limiting**: Configurable per-route limits
- **Security Headers**: Comprehensive CSP with Clerk domains

### CSP Configuration
```javascript
// next.config.js
"Content-Security-Policy": [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://clerk.com https://accounts.bytemy.com.au",
  "connect-src 'self' https://clerk.com https://bytemy.hasura.app",
  // ... additional directives
].join("; ")
```

### Database Security
- **Row-Level Security**: Hasura RBAC with JWT claims
- **Service Account Tokens**: No admin secrets in production
- **Encryption**: All sensitive data encrypted at rest

## 🚀 Development Workflow

### Core Commands
```bash
pnpm dev          # Development server with Turbopack
pnpm build        # Production build
pnpm lint         # ESLint validation
pnpm codegen      # Generate GraphQL types
pnpm get-schema   # Download latest Hasura schema
```

### Environment Variables
```bash
# Required
NEXT_PUBLIC_HASURA_GRAPHQL_URL=    # Hasura endpoint
HASURA_SERVICE_ACCOUNT_TOKEN=      # Service JWT (not admin secret)
CLERK_SECRET_KEY=                  # Clerk authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY= # Clerk public key
API_SECRET_KEY=                    # API signing key

# Optional
FEATURE_MFA_ENABLED=false          # MFA functionality
```

### Path Aliases
```typescript
"@/*": ["./*"]                     # Root directory
"@/components/*": ["components/*"] # Components
"@/lib/*": ["lib/*"]              # Library functions  
"@/domains/*": ["domains/*"]      # Domain code
```

## 📁 File Structure Standards

### API Routes
- Use `withEnhancedAuth` wrapper for all protected routes
- Place permission checks in wrapper options
- Use `context.userId` instead of direct auth calls

### Components
- Wrap protected components with `EnhancedPermissionGuard`
- Use `useEnhancedPermissions` hook for conditional rendering
- Access capabilities as properties, not functions

### GraphQL
- Domain-specific operations in `domains/{domain}/graphql/`
- Legacy operations in `/graphql/` for API compatibility
- Generate types with `pnpm codegen`

## 🔧 Migration Checklist

### Converting Legacy API Routes
1. Replace `auth.protect()` with `withEnhancedAuth`
2. Use `context.userId` instead of destructured `userId`
3. Move permission checks to wrapper options
4. Remove manual role checking logic

### Converting Legacy Components
1. Add `EnhancedPermissionGuard` wrappers
2. Replace hook functions with properties
3. Use `navigation.canAccess` for menu items
4. Remove manual permission checking

### Required Updates
- [ ] All API routes use `withEnhancedAuth`
- [ ] All protected components use `EnhancedPermissionGuard`
- [ ] All components use property-based permission access
- [ ] Developer routes use enhanced auth patterns
- [ ] Legacy JWT parsing removed

## 📋 Production Deployment

### Build Configuration
- TypeScript strict mode enabled
- ESLint validation in production
- Security headers enforced
- WIP pages redirect to 404

### Monitoring
- Permission violations logged
- Slow API requests tracked (>1000ms)
- Authentication failures audited
- CSP violations reported

### Performance
- Permission caching implemented
- GraphQL query optimization
- Component lazy loading
- Bundle size optimization

## 🔍 Troubleshooting

### Common Issues
1. **CSP Violations**: Check `next.config.js` for missing domains
2. **Permission Denied**: Verify user has correct role in Clerk metadata
3. **GraphQL Errors**: Check Hasura permissions and JWT tokens
4. **Build Failures**: Ensure all environment variables set

### Debug Tools
- Developer API routes (development only)
- Enhanced auth debug context
- Permission validation utilities
- Audit log inspection

This guide serves as the single source of truth for system architecture and development patterns.