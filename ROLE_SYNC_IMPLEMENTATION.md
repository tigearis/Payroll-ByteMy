# Role Synchronization System

## Overview

This system ensures that user roles are automatically synchronized between your Hasura database and Clerk authentication service. This provides a seamless experience where role changes in either system are reflected in both places.

## Architecture

### Components

1. **Database** - Stores user roles in the `users` table with a `role` column
   - `is_active` - Boolean flag for soft deletion
   - `deactivated_at` - Timestamp when user was deactivated
   - `deactivated_by` - ID of user who performed deactivation
2. **Clerk Metadata** - Stores user roles in `user.public_metadata.role`
3. **JWT Template** - Exposes roles via `sessionClaims.metadata.role`
4. **Sync APIs** - Keep both systems in sync
5. **Webhooks** - Handle automatic syncing when changes occur

### Role Values

| Display Name | Role Value   | Hasura Role | Description        |
| ------------ | ------------ | ----------- | ------------------ |
| Developer    | `admin`      | `admin`     | Full system access |
| Manager      | `manager`    | `admin`     | Management access  |
| Consultant   | `consultant` | `viewer`    | Limited access     |
| Viewer       | `viewer`     | `viewer`    | Basic access       |

## Implementation

### 1. Clerk Dashboard Configuration

**Sessions → Customize session token:**

```json
{
  "metadata": "{{user.public_metadata}}"
}
```

This makes roles available via `sessionClaims.metadata.role` in your application.

### 2. API Endpoints

#### `/api/staff/create` - Staff Creation

- Creates users in both database and Clerk
- Optionally sends invitation emails through Clerk
- Handles rollback if creation fails in either system
- Gracefully handles cases where only database creation is needed

**Usage:**

```typescript
const response = await fetch("/api/staff/create", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "John Doe",
    email: "john@example.com",
    role: "manager",
    managerId: "uuid-of-manager", // optional
    inviteToClerk: true, // optional, defaults to true
  }),
});
```

#### `/api/staff/update-role` - Staff Role Updates

- Updates both database and Clerk metadata when roles are changed via staff management
- Provides feedback on sync status
- Gracefully handles cases where users don't have Clerk accounts

**Usage:**

```typescript
const response = await fetch("/api/staff/update-role", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    staffId: "user-uuid",
    newRole: "admin",
  }),
});
```

#### `/api/staff/delete` - Staff Soft Deletion

- Marks users as inactive in database (preserving audit trails)
- Deletes users from Clerk (removing access immediately)
- Provides deletion preview via GET endpoint
- Maintains data integrity while ensuring access is revoked

**Usage:**

```typescript
// Get deletion preview
const preview = await fetch("/api/staff/delete?staffId=user-uuid");

// Perform soft deletion
const response = await fetch("/api/staff/delete", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    staffId: "user-uuid",
  }),
});
```

#### `/api/fix-oauth-user` - OAuth User Fix

- Specifically handles OAuth users who may not have proper role metadata
- Updates both Clerk metadata and database
- Removes legacy `hasuraRole` fields

### 3. Webhook Handlers

#### `/api/clerk-webhooks` - Bi-directional Sync

Handles Clerk webhook events:

- **`user.created`** - Automatically assigns roles (OAuth users → Developer, others → Viewer)
- **`user.updated`** - Syncs role changes from Clerk back to database
- **`user.deleted`** - Handles user cleanup (optional)

### 4. Client-Side Implementation

#### Staff Management Page

- Uses the new `/api/staff/update-role` endpoint
- Shows sync status in success messages
- Provides visual feedback when roles are updated

#### Role Checking

```typescript
import { auth } from "@clerk/nextjs/server";

const { sessionClaims } = await auth();
const userRole = sessionClaims?.metadata?.role;
```

## Usage Examples

### Updating a Staff Member's Role

```typescript
// In staff management page
const saveRoleChange = async (userId: string, newRole: string) => {
  const response = await fetch("/api/staff/update-role", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      staffId: userId,
      newRole: newRole,
    }),
  });

  const result = await response.json();

  if (result.clerkSynced) {
    console.log("Role synced to both database and Clerk");
  } else {
    console.log("Role updated in database only");
  }
};
```

### Checking Roles in Components

```typescript
import { useAuth } from "@clerk/nextjs";

const { sessionClaims } = useAuth();
const userRole = sessionClaims?.metadata?.role;

if (userRole === "admin") {
  // Show admin features
}
```

### Server-Side Role Checks

```typescript
import { auth } from "@clerk/nextjs/server";

export default async function AdminPage() {
  const { sessionClaims } = await auth();
  const isAdmin = sessionClaims?.metadata?.role === "admin";

  if (!isAdmin) {
    redirect("/");
  }

  return <AdminDashboard />;
}
```

## Sync Scenarios

### 1. New Staff Member Creation

1. Admin fills out staff creation form
2. `/api/staff/create` is called
3. User is created in Clerk first (if requested)
4. Invitation email is sent via Clerk
5. User is created in database with Clerk ID
6. If any step fails, appropriate rollback occurs
7. Success message shows creation and invitation status

### 2. Role Updated via Staff Management

1. User clicks "Edit" on staff member
2. Selects new role and clicks "Save"
3. `/api/staff/update-role` is called
4. Database is updated first
5. Clerk metadata is updated second
6. Success message shows sync status
7. Staff list is refreshed

### 3. Staff Member Deactivation

1. Admin clicks delete button on staff member
2. Confirmation dialog shows deactivation details
3. `/api/staff/delete` is called
4. User is deleted from Clerk first (immediate access removal)
5. User is marked as inactive in database (audit trail preserved)
6. Success message shows deactivation status
7. Staff list is refreshed (inactive users filtered out)

### 4. Role Updated in Clerk Dashboard

1. Admin changes user role in Clerk Dashboard
2. Clerk sends `user.updated` webhook
3. Webhook handler detects role change
4. Database is updated to match
5. Both systems are now in sync

### 5. New OAuth User Signs Up

1. User signs up with Google/OAuth
2. Clerk sends `user.created` webhook
3. Webhook automatically assigns "Developer" role
4. Both Clerk and database have matching roles

### 6. Manual Role Fix

1. Developer notices role inconsistency
2. Uses "Fix This User's Role" button on `/developer` page
3. `/api/fix-oauth-user` handles the sync
4. Old inconsistent fields are cleaned up

## Testing

### Via Developer Page

- Visit `/developer` page
- Use "Check OAuth Status" to see current role
- Use "Fix This User's Role" to force sync
- Use "Test Staff Sync API" to verify role update endpoint
- Use "Test Staff Create API" to verify user creation endpoint
- Use "Test Delete Preview" to test deletion preview endpoint
- Use "Test Staff Delete API" to verify deletion endpoint

### Via Staff Management

- Visit `/staff` page
- **Create new staff:** Click "Create Staff Member" and fill out form
- **Edit a user's role:** Click "Edit" and change role
- **Delete a user:** Click delete button and confirm deactivation
- **Observe sync status messages** for all operations
- **Verify changes** in both database and Clerk dashboard

### Via Webhooks

- Change role in Clerk Dashboard
- Check server logs for webhook processing
- Verify database was updated

## Troubleshooting

### Common Issues

1. **Role not appearing in JWT**

   - Check JWT template configuration in Clerk Dashboard
   - Ensure it includes: `{"metadata": "{{user.public_metadata}}"}`

2. **Database not updating from Clerk**

   - Verify webhook endpoint is configured
   - Check webhook secret is set correctly
   - Review server logs for webhook errors

3. **Clerk not updating from staff changes**
   - Check network requests to `/api/staff/update-role`
   - Verify Clerk API credentials are correct
   - Look for error messages in browser console

### Debug Commands

```bash
# Check webhook configuration
curl -X POST http://localhost:3000/api/clerk-webhooks \
  -H "Content-Type: application/json" \
  -d '{"type": "test"}'

# Test staff role update
curl -X POST http://localhost:3000/api/staff/update-role \
  -H "Content-Type: application/json" \
  -d '{"staffId": "test", "newRole": "admin"}'
```

## Security Considerations

- Only authenticated admins can update roles
- Webhook signatures are verified
- Role changes are logged with timestamps
- Database constraints prevent invalid roles
- Graceful degradation when sync fails

## Future Enhancements

- Real-time role change notifications
- Audit log for all role changes
- Bulk role update operations
- Role change approval workflow
- Integration with external HR systems
