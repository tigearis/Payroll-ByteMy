# Complete System Architecture: Payroll Management with Role Synchronization

## System Overview

This is a comprehensive Next.js payroll management system with authentication, role-based access control, and user management. The system integrates **Clerk** (authentication), **Hasura GraphQL** (data layer), and **PostgreSQL** (database) with sophisticated role synchronization and soft deletion capabilities.

## Core Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │    │   (API Routes)  │    │   (PostgreSQL)  │
│                 │    │                 │    │                 │
│ • Role Guards   │◄──►│ • Auth APIs     │◄──►│ • Users Table   │
│ • Staff Mgmt    │    │ • Sync APIs     │    │ • Roles System  │
│ • Components    │    │ • Webhooks      │    │ • Audit Logs    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐             │
         └─────────────►│     Clerk       │◄────────────┘
                        │ (Authentication)│
                        │                 │
                        │ • JWT Tokens    │
                        │ • User Metadata │
                        │ • OAuth Support │
                        └─────────────────┘
                                 │
                        ┌─────────────────┐
                        │     Hasura      │
                        │   (GraphQL)     │
                        │                 │
                        │ • Auto-generated│
                        │ • Permissions   │
                        │ • Real-time     │
                        └─────────────────┘
```

## 1. Authentication Layer (Clerk)

### JWT Token Structure

```json
{
  "sub": "user_2uNk3caC6G8tlohrgrkpwfzQwYv",
  "iss": "https://harmless-primate-53.clerk.accounts.dev",
  "sessionClaims": {
    "metadata": {
      "role": "admin" // Synced from public_metadata
    }
  },
  "hasura": {
    "x-hasura-user-id": "user_2uNk3caC6G8tlohrgrkpwfzQwYv",
    "x-hasura-default-role": "admin",
    "x-hasura-allowed-roles": ["admin", "viewer"]
  }
}
```

### Clerk Configuration

- **JWT Template**: `{"metadata": "{{user.public_metadata}}"}`
- **Hasura Claims**: Auto-generated from `user.public_metadata.role`
- **OAuth Providers**: Google, GitHub (auto-assigned Developer role)

## 2. Role System

### Role Mapping

```typescript
const ROLE_MAPPING = {
  // Display Name → Database Value → Hasura Role
  "Developer":  "admin"     → "admin",
  "Manager":    "manager"   → "admin",
  "Consultant": "consultant"→ "viewer",
  "Viewer":     "viewer"    → "viewer"
} as const;
```

### Role Hierarchy & Permissions

```sql
-- Database enum
CREATE TYPE user_role AS ENUM ('viewer', 'consultant', 'manager', 'admin', 'org_admin');

-- Permission levels
admin     = Full system access (create, read, update, delete users)
manager   = Team management (read, limited updates)
consultant= Project access (read assigned projects)
viewer    = Read-only access (dashboard viewing)
```

## 3. Database Schema

### Core Users Table

```sql
CREATE TABLE public.users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(255) NOT NULL,
  email           VARCHAR(255) UNIQUE NOT NULL,
  role            user_role NOT NULL DEFAULT 'viewer',
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  username        VARCHAR(255) UNIQUE,
  image           TEXT,
  is_staff        BOOLEAN DEFAULT false,
  manager_id      UUID REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
  clerk_user_id   TEXT UNIQUE,

  -- Soft Deletion Fields
  is_active       BOOLEAN DEFAULT true,
  deactivated_at  TIMESTAMP WITH TIME ZONE,
  deactivated_by  TEXT,

  -- Indexes
  INDEX idx_users_role (role),
  INDEX idx_users_clerk_composite (clerk_user_id, role, is_staff),
  INDEX idx_users_is_active (is_active),
  INDEX idx_users_deactivated_at (deactivated_at) WHERE deactivated_at IS NOT NULL
);
```

### Related Tables

```sql
-- Role-based permissions
TABLE roles (id, name, description, permissions)
TABLE user_roles (user_id, role_id, assigned_at, assigned_by)
TABLE role_permissions (role_id, permission_id)

-- Audit trails
TABLE permission_audit_log (id, user_id, target_user_id, action, timestamp)

-- Business entities
TABLE payrolls (id, manager_user_id, primary_consultant_user_id, ...)
TABLE clients (id, ...)
TABLE leave (id, user_id, ...)
```

## 4. API Architecture

### Authentication Flow

```typescript
// Middleware (authentication only)
export default clerkMiddleware((auth, request) => {
  if (isProtectedRoute(request)) {
    auth().protect(); // Ensure user is authenticated
  }
  // No role checking here - done in components
});
```

### Core API Endpoints

#### `/api/staff/create` - User Creation

```typescript
interface CreateStaffRequest {
  name: string;
  email: string;
  role: "admin" | "manager" | "consultant" | "viewer";
  managerId?: string;
  inviteToClerk?: boolean;
}

interface CreateStaffResponse {
  success: boolean;
  userId: string;
  clerkUserId?: string;
  invitationSent: boolean;
  error?: string;
}
```

**Flow:**

1. Validate admin permissions
2. Check for duplicate emails
3. Create user in Clerk (if requested)
4. Send invitation email via Clerk
5. Create user record in database with Clerk ID
6. Handle rollback if any step fails

#### `/api/staff/update-role` - Role Management

```typescript
interface UpdateRoleRequest {
  staffId: string;
  newRole: "admin" | "manager" | "consultant" | "viewer";
}

interface UpdateRoleResponse {
  success: boolean;
  clerkSynced: boolean;
  message: string;
}
```

**Flow:**

1. Update database role first
2. Sync to Clerk metadata (if user has Clerk account)
3. Return sync status for UI feedback

#### `/api/staff/delete` - Soft Deletion

```typescript
interface DeleteStaffRequest {
  staffId: string;
}

interface DeleteStaffResponse {
  success: boolean;
  deletedFromClerk: boolean;
  deactivatedInDatabase: boolean;
  auditTrail: {
    deactivatedAt: string;
    deactivatedBy: string;
  };
}
```

**Flow:**

1. Delete from Clerk first (immediate access removal)
2. Mark as inactive in database (preserve audit trail)
3. Update `deactivated_at` and `deactivated_by` fields
4. Return comprehensive status

#### `/api/clerk-webhooks` - Bi-directional Sync

```typescript
// Webhook handlers for automatic synchronization
interface WebhookEvents {
  "user.created": OAuthUserHandler; // OAuth → Developer role
  "user.updated": ClerkToDbSyncHandler; // Clerk → Database sync
  "user.deleted": UserCleanupHandler; // Optional cleanup
}
```

**OAuth User Creation Flow:**

```typescript
async function handleUserCreated(event: ClerkUserCreatedEvent) {
  const user = event.data;

  // Auto-assign Developer role to OAuth users
  if (user.external_accounts?.length > 0) {
    await clerk.users.updateMetadata(user.id, {
      publicMetadata: { role: "admin" }, // Developer = admin
    });
  }

  // Create database record
  await createUserInDatabase({
    clerkUserId: user.id,
    email: user.email_addresses[0].email_address,
    name: `${user.first_name} ${user.last_name}`,
    role: "admin",
  });
}
```

## 5. Synchronization System

### Role Sync Scenarios

#### Scenario 1: Staff Management Update

```mermaid
sequenceDiagram
    participant Admin
    participant Frontend
    participant API
    participant Database
    participant Clerk

    Admin->>Frontend: Update role to "Manager"
    Frontend->>API: POST /api/staff/update-role
    API->>Database: UPDATE users SET role = 'manager'
    API->>Clerk: Update public_metadata.role
    Clerk-->>API: Success/Failure
    API->>Frontend: { clerkSynced: true }
    Frontend->>Admin: "Role updated in both systems"
```

#### Scenario 2: Clerk Dashboard Update

```mermaid
sequenceDiagram
    participant Admin
    participant Clerk
    participant Webhook
    participant Database

    Admin->>Clerk: Change role in dashboard
    Clerk->>Webhook: user.updated event
    Webhook->>Database: Sync role change
    Database-->>Webhook: Updated
    Note over Webhook: Both systems now in sync
```

#### Scenario 3: OAuth User Signup

```mermaid
sequenceDiagram
    participant User
    participant Google
    participant Clerk
    participant Webhook
    participant Database

    User->>Google: Sign in with Google
    Google->>Clerk: OAuth callback
    Clerk->>Webhook: user.created event
    Webhook->>Clerk: Set role = 'admin' (Developer)
    Webhook->>Database: Create user record
    Note over User, Database: User ready with Developer permissions
```

## 6. Frontend Integration

### Role-Based Components

```typescript
// Client-side role checking
function AdminPanel() {
  const { sessionClaims } = useAuth();
  const userRole = sessionClaims?.metadata?.role;

  if (userRole !== "admin") {
    return <div>Access denied</div>;
  }

  return <AdminDashboard />;
}

// Role guard wrapper
function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { sessionClaims } = useAuth();
  const userRole = sessionClaims?.metadata?.role;

  return allowedRoles.includes(userRole) ? children : <AccessDenied />;
}
```

### Staff Management Interface

```typescript
function StaffList() {
  const [staff, setStaff] = useState([]);

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    const response = await fetch("/api/staff/update-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ staffId: userId, newRole }),
    });

    const result = await response.json();

    if (result.clerkSynced) {
      toast.success("Role updated in both systems");
    } else {
      toast.warning("Role updated in database only");
    }

    refreshStaffList();
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("This will deactivate the user. Continue?")) return;

    const response = await fetch("/api/staff/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ staffId: userId }),
    });

    const result = await response.json();
    toast.success("User deactivated successfully");
    refreshStaffList();
  };
}
```

## 7. Soft Deletion System

### Design Philosophy

As referenced in best practices for database design, our system implements a hybrid approach:

1. **Immediate Access Removal**: Delete from Clerk authentication system
2. **Data Preservation**: Mark as inactive in database with audit trail
3. **Business Continuity**: Maintain foreign key relationships for historical data

### Implementation

```sql
-- Soft deletion query
UPDATE users
SET
  is_active = false,
  deactivated_at = CURRENT_TIMESTAMP,
  deactivated_by = $1
WHERE id = $2;

-- Active users query (default behavior)
SELECT * FROM users WHERE is_active = true;

-- Include deactivated users (admin/audit view)
SELECT * FROM users; -- All users regardless of status
```

### Benefits

- **Audit Compliance**: Complete trail of user lifecycle
- **Data Integrity**: Historical records remain intact
- **Security**: Immediate access revocation via Clerk deletion
- **Flexibility**: Can reactivate users if needed

## 8. Security Architecture

### Multi-Layer Security

```typescript
// 1. Middleware (Authentication)
export default clerkMiddleware((auth, request) => {
  if (isProtectedRoute(request)) auth().protect();
});

// 2. API Route Protection
export async function POST(request: Request) {
  const { userId, sessionClaims } = await auth();
  if (!userId) return unauthorized();

  const userRole = sessionClaims?.metadata?.role;
  if (!['admin', 'manager'].includes(userRole)) {
    return forbidden();
  }
  // ... API logic
}

// 3. Component-Level Guards
<RoleGuard allowedRoles={['admin']}>
  <AdminFeatures />
</RoleGuard>

// 4. Database-Level Security (via Hasura)
-- Row-level security rules
CREATE POLICY user_access ON users
  FOR SELECT USING (
    clerk_user_id = current_setting('hasura.user.id') OR
    current_setting('hasura.user.role') = 'admin'
  );
```

### Data Protection

- **JWT Encryption**: All tokens encrypted in transit
- **Password Hashing**: Clerk handles secure password storage
- **API Rate Limiting**: Webhook signature verification
- **CORS Configuration**: Restricted to allowed origins
- **Input Validation**: Zod schemas for all API inputs

## 9. Error Handling & Edge Cases

### Sync Failure Scenarios

```typescript
// Graceful degradation
async function updateUserRole(staffId: string, newRole: string) {
  try {
    // Primary operation: Update database
    await updateDatabaseRole(staffId, newRole);

    try {
      // Secondary operation: Sync to Clerk
      await updateClerkMetadata(staffId, newRole);
      return { success: true, clerkSynced: true };
    } catch (clerkError) {
      // Database updated, but Clerk sync failed
      console.error("Clerk sync failed:", clerkError);
      return {
        success: true,
        clerkSynced: false,
        message: "Role updated in database. Clerk sync pending.",
      };
    }
  } catch (dbError) {
    // Primary operation failed
    return { success: false, error: dbError.message };
  }
}
```

### Webhook Reliability

```typescript
// Idempotent webhook handling
async function handleWebhook(event: ClerkEvent) {
  const eventId = event.id;

  // Check if already processed
  const existing = await getProcessedEvent(eventId);
  if (existing) return { success: true, message: "Already processed" };

  try {
    await processEvent(event);
    await markEventProcessed(eventId);
  } catch (error) {
    await markEventFailed(eventId, error);
    throw error;
  }
}
```

## 10. Monitoring & Observability

### Audit Logging

```sql
-- Permission changes audit
INSERT INTO permission_audit_log (
  user_id, target_user_id, action, details, timestamp
) VALUES (
  $1, $2, 'role_updated',
  json_build_object('old_role', $3, 'new_role', $4),
  CURRENT_TIMESTAMP
);
```

### Health Checks

```typescript
// System health endpoint
export async function GET() {
  const health = {
    database: await checkDatabaseConnection(),
    clerk: await checkClerkAPI(),
    hasura: await checkHasuraAPI(),
    timestamp: new Date().toISOString(),
  };

  const isHealthy = Object.values(health).every(Boolean);
  return Response.json(health, {
    status: isHealthy ? 200 : 503,
  });
}
```

## 11. Performance Considerations

### Database Optimization

```sql
-- Efficient active users query
CREATE INDEX CONCURRENTLY idx_users_active_role
ON users(role) WHERE is_active = true;

-- Partial index for deactivated users
CREATE INDEX CONCURRENTLY idx_users_deactivated
ON users(deactivated_at) WHERE is_active = false;
```

### Caching Strategy

```typescript
// Apollo Client cache configuration
const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      User: {
        fields: {
          // Cache active users separately
          activeUsers: {
            merge: false, // Replace, don't merge
          },
        },
      },
    },
  }),
  defaultOptions: {
    query: { fetchPolicy: "cache-and-network" },
  },
});
```

## 12. Development & Testing

### Testing Framework

```typescript
// API endpoint tests
describe("/api/staff/update-role", () => {
  it("should update role and sync to Clerk", async () => {
    const response = await request(app)
      .post("/api/staff/update-role")
      .send({ staffId: "test-id", newRole: "admin" })
      .expect(200);

    expect(response.body.clerkSynced).toBe(true);
  });

  it("should handle Clerk sync failure gracefully", async () => {
    // Mock Clerk API failure
    jest.spyOn(clerk.users, "updateMetadata").mockRejectedValue(new Error());

    const response = await request(app)
      .post("/api/staff/update-role")
      .send({ staffId: "test-id", newRole: "admin" })
      .expect(200);

    expect(response.body.clerkSynced).toBe(false);
  });
});
```

### Development Tools

```typescript
// Developer debugging page
function DeveloperTools() {
  return (
    <div>
      <TokenDebugger />
      <RoleSyncTester />
      <WebhookTester />
      <DatabaseInspector />
    </div>
  );
}
```

## 13. Deployment Architecture

### Environment Configuration

```bash
# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Database
DATABASE_URL=postgres://user:pass@host/db?sslmode=require

# GraphQL
NEXT_PUBLIC_HASURA_GRAPHQL_URL=https://app.hasura.app/v1/graphql
HASURA_ADMIN_SECRET=secret

# Application
NEXT_PUBLIC_APP_URL=https://app.domain.com
```

### Scaling Considerations

- **Database**: Read replicas for reporting queries
- **API**: Horizontal scaling with stateless design
- **Webhooks**: Queue-based processing for high volume
- **Caching**: Redis for session and role data

## 14. Database Design Best Practices

Following established database design principles from industry experts:

### Normalization Standards

- **First Normal Form**: No repeating groups or arrays in single columns
- **Third Normal Form**: All non-key attributes depend on the primary key
- **Proper Relationships**: Clear foreign key relationships with referential integrity

### Naming Conventions

```sql
-- Consistent, descriptive naming
TABLE users          -- Plural nouns for tables
COLUMN created_at     -- Snake_case for columns
INDEX idx_users_role  -- Descriptive index names
CONSTRAINT fk_users_manager_id -- Clear constraint names
```

### Data Integrity

```sql
-- Constraints ensure data quality
ALTER TABLE users ADD CONSTRAINT check_email_format
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE users ADD CONSTRAINT check_role_valid
CHECK (role IN ('viewer', 'consultant', 'manager', 'admin', 'org_admin'));
```

### Testing Strategy

- **Unit Tests**: Individual API endpoints and functions
- **Integration Tests**: Full workflow testing (create → update → delete)
- **Performance Tests**: Load testing with realistic data volumes
- **Security Tests**: Authentication and authorization validation

## Summary

This system provides:

1. **Secure Authentication** via Clerk with JWT tokens
2. **Role-Based Access Control** with database and metadata sync
3. **Comprehensive User Management** with CRUD operations
4. **Soft Deletion** preserving audit trails while removing access
5. **Bi-directional Synchronization** between Clerk and database
6. **Robust Error Handling** with graceful degradation
7. **Real-time Updates** via GraphQL subscriptions
8. **Complete Audit Trail** for compliance and debugging

The architecture ensures data consistency, security, and maintainability while providing a seamless user experience for payroll management operations. The system handles edge cases gracefully and provides comprehensive monitoring and debugging capabilities for production environments.

## References

- [Red Gate Database Design Best Practices](https://www.red-gate.com/simple-talk/databases/sql-server/database-administration-sql-server/ten-common-database-design-mistakes/)
- [GeeksforGeeks Identity Management Database Design](https://www.geeksforgeeks.org/how-to-design-a-database-for-identity-management-systems/)
- [Hasura Metadata Management](https://hasura.io/docs/2.0/hasura-cli/commands/hasura_metadata_reload/)
- [Neon Database Management](https://neon.tech/docs/manage/databases)
