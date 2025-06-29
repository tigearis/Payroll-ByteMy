# Legacy Permissions System

This folder contains the complex enterprise-grade permission system that was moved during the authentication system rebuild.

## What's in this folder

### Core Permission System
- **Complex RBAC**: 5-tier role hierarchy with 23 granular permissions
- **SOC2 Compliance**: Enterprise audit logging and security monitoring
- **Permission Overrides**: User-specific permission customization
- **Advanced Guards**: Component-level permission enforcement

### Key Components
- `lib/auth/permissions.ts` - Core permission definitions and logic
- `lib/auth/enhanced-auth-context.tsx` - Complex authentication context
- `components/auth/permission-guard.tsx` - Component-level RBAC
- `lib/security/role-monitoring.ts` - Advanced security monitoring

### Why moved to legacy
- **Over-engineering**: System became too complex for current needs
- **Performance**: Multiple permission checks creating overhead
- **Maintenance**: Complex interdependencies making changes difficult
- **Simplification**: Moving to basic role-based access control

## Restoration Guide

If you need to restore the complex permission system:

1. **Copy files back** to their original locations
2. **Update imports** throughout the codebase
3. **Restore database schemas** for permission tables
4. **Re-enable SOC2 compliance** features
5. **Update environment variables** for security monitoring

## Architecture Overview

The legacy system implemented a sophisticated 5-layer security model:
```
Clerk → Middleware → Apollo → Hasura → PostgreSQL
```

With comprehensive features:
- 23 granular permissions across 6 categories
- Role escalation monitoring
- Real-time security alerts
- Component-level protection
- API-level authorization
- Database row-level security

## Documentation

See the docs/ folder for comprehensive documentation on the legacy permission system architecture and implementation details.

---

**Created**: 2025-06-29T16:33:11.804Z
**Reason**: Authentication system simplification
**Status**: Safe for future restoration
