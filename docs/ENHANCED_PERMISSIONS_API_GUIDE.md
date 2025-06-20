# Enhanced Permissions API Reference Guide

## 🔐 API Authentication with Enhanced Permissions

This guide provides comprehensive documentation for the Enhanced Permissions System API authentication patterns and usage.

---

## 🎯 **API Route Protection**

### **Enhanced Authentication Wrapper**

#### **Basic Usage**
```typescript
import { withEnhancedAuth } from '@/lib/auth/enhanced-api-auth';
import { NextRequest } from 'next/server';

export const POST = withEnhancedAuth(async (req: NextRequest, context: AuthContext) => {
  // Handler logic with guaranteed authentication
  const { user, userId, userRole } = context;
  
  // Your API logic here
  return Response.json({ success: true });
}, {
  permission: "custom:staff:write" // Required permission
});
```

#### **Authentication Options**

##### **1. Permission-Based Protection**
```typescript
export const POST = withEnhancedAuth(handler, {
  permission: "custom:payroll:write"
});

export const GET = withEnhancedAuth(handler, {
  permission: "custom:reports:read"
});

export const DELETE = withEnhancedAuth(handler, {
  permission: "custom:admin:manage"
});
```

##### **2. Role-Based Protection**
```typescript
export const POST = withEnhancedAuth(handler, {
  minimumRole: "manager" // Manager and above (org_admin, developer)
});

export const GET = withEnhancedAuth(handler, {
  minimumRole: "org_admin" // Admin and above (developer)
});
```

##### **3. Self-Access Patterns**
```typescript
export const GET = withEnhancedAuth(async (req, context) => {
  // Users can access their own data even without general permission
  const { searchParams } = new URL(req.url);
  const targetUserId = searchParams.get('userId');
  
  // Context includes self-access validation
  if (context.isSelfAccess) {
    // User is accessing their own data
    return getUserProfile(targetUserId);
  }
  
  // Regular permission check for accessing other users' data
  return getAllUserProfiles();
}, {
  permission: "custom:staff:read",
  allowSelfAccess: true // Enable self-access checking
});
```

##### **4. Multiple Permission Options**
```typescript
export const POST = withEnhancedAuth(handler, {
  anyPermission: [
    "custom:payroll:write",
    "custom:admin:manage"
  ] // User needs ANY of these permissions
});
```

---

## 📊 **Available Permissions**

### **Permission Categories**

#### **Payroll Permissions**
```typescript
'custom:payroll:read'     // View payroll data
'custom:payroll:write'    // Create/update payrolls
'custom:payroll:delete'   // Delete payrolls
'custom:payroll:assign'   // Assign payrolls to consultants
```

#### **Staff Permissions**
```typescript
'custom:staff:read'       // View staff members
'custom:staff:write'      // Create/update staff
'custom:staff:delete'     // Delete staff members
'custom:staff:invite'     // Send staff invitations
```

#### **Client Permissions**
```typescript
'custom:client:read'      // View client information
'custom:client:write'     // Create/update clients
'custom:client:delete'    // Delete clients
```

#### **Administrative Permissions**
```typescript
'custom:admin:manage'     // Administrative operations
'custom:settings:write'   // Modify system settings
'custom:billing:manage'   // Manage billing and subscriptions
```

#### **Reporting Permissions**
```typescript
'custom:reports:read'     // View reports and analytics
'custom:reports:export'   // Export reports and data
```

#### **Audit Permissions**
```typescript
'custom:audit:read'       // View audit logs
'custom:audit:write'      // Manage audit configuration
```

---

## 🏗️ **Role Hierarchy**

### **Role Levels and Permissions**

#### **Developer (Level 5)** - Full System Access
```typescript
permissions: ALL_PERMISSIONS // All 18 permissions
capabilities: [
  "System administration",
  "Development tools access", 
  "All user management",
  "Complete data access",
  "Security configuration"
]
```

#### **Org Admin (Level 4)** - Organization Management
```typescript
permissions: [
  'custom:payroll:read', 'custom:payroll:write', 'custom:payroll:assign',
  'custom:staff:read', 'custom:staff:write', 'custom:staff:delete', 'custom:staff:invite',
  'custom:client:read', 'custom:client:write', 'custom:client:delete',
  'custom:admin:manage', 'custom:billing:manage',
  'custom:reports:read', 'custom:reports:export',
  'custom:audit:read'
]
capabilities: [
  "Organization-wide administration",
  "Staff management (all levels)",
  "Client relationship management",
  "Financial oversight",
  "Audit access"
]
```

#### **Manager (Level 3)** - Team and Payroll Management
```typescript
permissions: [
  'custom:payroll:read', 'custom:payroll:write', 'custom:payroll:assign',
  'custom:staff:read', 'custom:staff:write', 'custom:staff:invite',
  'custom:client:read', 'custom:client:write',
  'custom:reports:read'
]
capabilities: [
  "Team management",
  "Payroll processing",
  "Client communication",
  "Report generation",
  "Staff onboarding"
]
```

#### **Consultant (Level 2)** - Limited Operational Access
```typescript
permissions: [
  'custom:payroll:read', 'custom:payroll:write',
  'custom:staff:read',
  'custom:client:read',
  'custom:reports:read'
]
capabilities: [
  "Assigned payroll management",
  "View team information",
  "Client interaction",
  "Basic reporting"
]
```

#### **Viewer (Level 1)** - Read-Only Access
```typescript
permissions: [
  'custom:payroll:read',
  'custom:client:read'
]
capabilities: [
  "View payroll information",
  "View client information",
  "Read-only dashboard access"
]
```

---

## 🔍 **Native Clerk Integration**

### **Direct Permission Checking**
```typescript
import { auth } from '@clerk/nextjs';

export async function POST(req: NextRequest) {
  const { has } = await auth();
  
  // Native Clerk permission checking
  if (!has({ permission: 'custom:staff:write' })) {
    return Response.json(
      { error: 'Insufficient permissions' }, 
      { status: 403 }
    );
  }
  
  // Your API logic here
}
```

### **Context Object Properties**
```typescript
interface AuthContext {
  user: ClerkUser;           // Full Clerk user object
  userId: string;            // Clerk user ID
  userRole: UserRole;        // Validated user role
  permissions: string[];     // User's permissions array
  isSelfAccess: boolean;     // True if accessing own data
  metadata: UserMetadata;    // User's metadata object
}
```

---

## 🛡️ **Error Handling**

### **Authentication Errors**
```typescript
// Automatic error responses from withEnhancedAuth
{
  error: "Authentication required",
  code: "UNAUTHORIZED",
  status: 401
}

{
  error: "Insufficient permissions",
  code: "FORBIDDEN", 
  status: 403,
  required: "custom:staff:write",
  userRole: "viewer"
}

{
  error: "Invalid role assignment",
  code: "FORBIDDEN",
  status: 403,
  details: "Cannot assign higher role than current user"
}
```

### **Custom Error Handling**
```typescript
export const POST = withEnhancedAuth(async (req, context) => {
  try {
    // Your API logic
    return Response.json({ success: true });
  } catch (error) {
    // Enhanced auth provides context for better error handling
    console.error('API Error:', {
      userId: context.userId,
      userRole: context.userRole,
      endpoint: req.url,
      error: error.message
    });
    
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}, {
  permission: "custom:payroll:write"
});
```

---

## 📋 **Migration Examples**

### **Before: Legacy withAuth**
```typescript
// OLD PATTERN - DEPRECATED
import { withAuth } from '@/lib/auth/api-auth';

export const POST = withAuth(async (req, session) => {
  // Manual role checking
  if (!['manager', 'org_admin', 'developer'].includes(session.role)) {
    return forbiddenResponse();
  }
  
  // Handler logic
}, { allowedRoles: ['manager', 'org_admin', 'developer'] });
```

### **After: Enhanced withEnhancedAuth**
```typescript
// NEW PATTERN - CURRENT
import { withEnhancedAuth } from '@/lib/auth/enhanced-api-auth';

export const POST = withEnhancedAuth(async (req, context) => {
  // No manual checking needed - guaranteed authorized
  const { user, userId, userRole } = context;
  
  // Handler logic with enhanced context
}, { 
  permission: "custom:staff:write" // Granular permission
  // OR
  minimumRole: "manager" // Role-based requirement
});
```

---

## 🔄 **Webhook Integration**

### **Enhanced Clerk Webhooks**
```typescript
// app/api/clerk-webhooks/route.ts
import { MetadataManager } from '@/lib/auth/metadata-manager';

export async function POST(req: NextRequest) {
  const event = await req.json();
  
  switch (event.type) {
    case 'user.created':
      // Automatically assign default role and permissions
      await MetadataManager.updateUserRole(
        event.data.id, 
        'viewer', // Default role
        'system' // Assigned by system
      );
      break;
      
    case 'user.updated':
      // Sync permissions if role changed in metadata
      if (event.data.public_metadata.role) {
        await MetadataManager.syncUserPermissions(event.data.id);
      }
      break;
  }
  
  return Response.json({ received: true });
}
```

---

## 📈 **Performance Optimizations**

### **Permission Caching**
```typescript
// Enhanced permissions hook includes automatic caching
const { hasPermission, canManageStaff } = useEnhancedPermissions();

// Properties are cached and only re-computed when user context changes
const showStaffButton = canManageStaff; // Cached boolean property
const canEdit = hasPermission('custom:payroll:write'); // Cached function result
```

### **Efficient Navigation**
```typescript
// Navigation permissions are pre-computed and cached
const { navigation } = useEnhancedPermissions();

// Efficient conditional rendering
{navigation.canAccess.staff && <StaffMenuItem />}
{navigation.canAccess.security && <SecurityMenuItem />}
{navigation.canAccess.developer && <DeveloperMenuItem />}
```

---

## 🧪 **Testing API Endpoints**

### **Testing with Different Roles**
```bash
# Test with viewer token (should succeed for reads)
curl -X GET "https://your-domain/api/payrolls" \
  -H "Authorization: Bearer VIEWER_TOKEN"

# Test with viewer token (should fail for writes) 
curl -X POST "https://your-domain/api/payrolls" \
  -H "Authorization: Bearer VIEWER_TOKEN"

# Test with manager token (should succeed for management operations)
curl -X POST "https://your-domain/api/staff/update-role" \
  -H "Authorization: Bearer MANAGER_TOKEN" \
  -d '{"userId":"test","newRole":"consultant"}'

# Test self-access (user accessing their own data)
curl -X GET "https://your-domain/api/users/profile?userId=USER_ID" \
  -H "Authorization: Bearer USER_TOKEN"
```

---

## 🔗 **Related Documentation**

- **[Enhanced Permissions Deployment Guide](/docs/ENHANCED_PERMISSIONS_DEPLOYMENT_GUIDE.md)**
- **[Comprehensive System Guide](/app/COMPREHENSIVE_SYSTEM_GUIDE.md)**
- **[CLAUDE.md Project Instructions](/app/CLAUDE.md)**

---

## 📞 **Support & Troubleshooting**

### **Common Issues**

#### **Permission Denied Errors**
1. **Check user role**: Verify user has required role level
2. **Verify permissions**: Ensure user's role includes required permission
3. **Check metadata**: Confirm permissions are synced in user metadata

#### **Self-Access Not Working**
1. **Verify allowSelfAccess**: Ensure option is enabled in route protection
2. **Check user ID**: Verify self-access logic correctly identifies user
3. **Review context**: Check `context.isSelfAccess` value in handler

#### **Role Assignment Issues**
1. **Validate hierarchy**: Cannot assign higher role than current user
2. **Check permissions**: Ensure user has `custom:admin:manage` permission
3. **Verify metadata sync**: Role changes trigger automatic permission sync

**The Enhanced Permissions API provides enterprise-grade security with comprehensive granular access control! 🚀**