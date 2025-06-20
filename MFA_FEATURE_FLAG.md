# MFA Feature Flag Documentation

## Overview

Multi-Factor Authentication (MFA) is currently implemented as an optional feature controlled by the `FEATURE_MFA_ENABLED` environment variable. This allows you to enable MFA when your Clerk setup is ready.

## Current Status

- **MFA Feature**: Disabled by default
- **Feature Flag**: `FEATURE_MFA_ENABLED=false`
- **Authentication**: Still uses standard role-based access control
- **API Signing**: Fully functional and independent of MFA

## Enabling MFA

### Prerequisites

1. **Clerk Dashboard Configuration**:
   - Enable MFA in your Clerk dashboard
   - Configure TOTP (Time-based One-Time Password)
   - Set up MFA policies

2. **Environment Setup**:
   ```bash
   FEATURE_MFA_ENABLED=true
   ```

### Steps to Enable

1. **Configure Clerk**:
   ```bash
   # In your Clerk Dashboard:
   # 1. Go to User & Authentication → Multi-factor
   # 2. Enable TOTP (Time-based One-Time Password)
   # 3. Enable SMS (optional)
   # 4. Set MFA requirement policy
   ```

2. **Update Environment Variables**:
   ```bash
   # In your .env.local file
   FEATURE_MFA_ENABLED=true
   ```

3. **Restart Application**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## What Changes When MFA is Enabled

### Routes That Will Require MFA

- `/api/staff/delete` - Staff deletion operations
- `/api/users/update-role` - Role updates  
- `/api/audit/compliance-report` - Audit data access
- `/api/developer` - Developer tools
- `/api/payrolls/schedule` - Payroll scheduling

### User Roles Requiring MFA

- `admin` - System administrators
- `org_admin` - Organization administrators

### Components Affected

- **MFA Setup Component**: Shows setup instructions instead of "feature disabled"
- **Admin Routes**: Will enforce MFA validation
- **Security Logs**: MFA events will be logged for compliance

## API Signing (Already Active)

API request signing is fully functional regardless of MFA status:

- **Signed Routes**: `/api/signed/payroll-operations`
- **API Key Management**: `/api/admin/api-keys`
- **Security**: HMAC-SHA256 signatures with replay protection

## Current Authentication Flow

Even with MFA disabled, the system maintains strong security:

1. **Clerk Authentication**: User login with JWT tokens
2. **Role-Based Access**: Hierarchical permission system
3. **Route Protection**: Admin-only routes protected
4. **API Signing**: Sensitive operations require signed requests
5. **Audit Logging**: All actions logged for SOC2 compliance

## SOC2 Compliance

The system remains SOC2 compliant with or without MFA:

- **Access Control**: Role-based permissions (CC6.1)
- **User Management**: Secure user lifecycle (CC6.2) 
- **Data Access**: Comprehensive audit trails (CC6.3)
- **System Changes**: Configuration changes logged (CC7.1)
- **Security Events**: All security events monitored (CC7.2)

## Testing MFA Implementation

When ready to enable MFA, test the following:

1. **Admin User Setup**:
   ```bash
   # 1. Login as admin user
   # 2. Navigate to MFA setup
   # 3. Set up authenticator app
   # 4. Verify MFA works
   ```

2. **Route Protection**:
   ```bash
   # Test that sensitive routes require MFA
   # when FEATURE_MFA_ENABLED=true
   ```

3. **Audit Logging**:
   ```bash
   # Verify MFA events are logged
   # Check SOC2 compliance reports
   ```

## Migration Path

To enable MFA in production:

1. **Development Testing**:
   - Enable MFA in development environment
   - Test all critical workflows
   - Verify user experience

2. **Staging Deployment**:
   - Deploy with `FEATURE_MFA_ENABLED=true`
   - Train admin users on MFA setup
   - Test backup authentication methods

3. **Production Rollout**:
   - Enable feature flag in production
   - Monitor authentication metrics
   - Support users with setup issues

## Support

When MFA is enabled, users will see:
- Setup instructions in the security settings
- Clear error messages for MFA requirements
- Guidance on authenticator app configuration

The system gracefully handles the transition and provides clear feedback throughout the process.