# Clerk JWT Template Configuration

## Required JWT Template

In your Clerk Dashboard → JWT Templates, create a new template called "hasura" with the following configuration:

```json
{
    "https://hasura.io/jwt/claims": {
        "metadata": "{{user.public_metadata}}",
        "x-hasura-user-id": "{{user.public_metadata.databaseId}}",
        "x-hasura-default-role": "{{user.public_metadata.role || 'viewer'}}",
        "x-hasura-allowed-roles": "{{user.public_metadata.allowedRoles}}",
        "x-hasura-clerk-user-id": "{{user.id}}",
        "permissions": "{{user.public_metadata.permissions}}"
    }
}
```

## What This Enables

This JWT template ensures that:

1. **`x-hasura-user-id`** - Maps to the database UUID for row-level security
2. **`x-hasura-default-role`** - Uses the user's role from public metadata with fallback to 'viewer'
3. **`x-hasura-allowed-roles`** - Dynamic role list based on user's hierarchy level
4. **`x-hasura-clerk-user-id`** - Original Clerk user ID for lookups
5. **`permissions`** - Array of granular permissions (e.g., "clients.read", "payrolls.create")
6. **`metadata`** - Full public metadata for additional context

## Public Metadata Structure

After running the sync script, users will have this structure in their `publicMetadata`:

```json
{
  "role": "manager",
  "databaseId": "550e8400-e29b-41d4-a716-446655440003",
  "isStaff": true,
  "managerId": null,
  "permissions": [
    "dashboard.read",
    "dashboard.list",
    "clients.read",
    "clients.create",
    "clients.update",
    "clients.list",
    "payrolls.read",
    "payrolls.create",
    "payrolls.update",
    "payrolls.delete",
    "payrolls.approve",
    "payrolls.list",
    "payrolls.manage"
  ],
  "allowedRoles": [
    "viewer",
    "consultant", 
    "manager",
    "ai_assistant"
  ],
  "permissionsUpdatedAt": "2025-01-05T12:00:00.000Z",
  "permissionsVersion": "1.0",
  "lastSyncAt": "2025-01-05T12:00:00.000Z"
}
```

## How to Apply

1. Go to Clerk Dashboard → JWT Templates
2. Create a new template named "hasura" 
3. Paste the JSON template above
4. Save the template
5. Update your environment variables to use this template:
   ```
   CLERK_JWT_TEMPLATE_NAME=hasura
   ```
6. Run the sync script to populate all users:
   ```bash
   node scripts/sync-all-user-permissions.js
   ```

## Testing

After applying the template and syncing users, JWT tokens will include all the necessary claims for:
- Hasura row-level security
- Client-side permission checking  
- Role-based access control
- Granular permission enforcement