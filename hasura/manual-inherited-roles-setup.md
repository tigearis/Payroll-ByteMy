# Manual Inherited Roles Setup

If the script doesn't work, you can set up inherited roles manually:

## Option 1: Simple Command Line Setup

```bash
# From the hasura directory
cd /Users/nathanharris/Payroll/Payroll-ByteMy/hasura

# Create backup
cp -r metadata metadata-backup-manual-$(date +%Y-%m-%d)

# Apply metadata (this includes inherited_roles.yaml)
hasura metadata apply

# Check if it worked
hasura console
```

## Option 2: Hasura Console Setup (Visual)

1. **Open Hasura Console**:
   ```bash
   hasura console
   ```

2. **Navigate to Inherited Roles**:
   - Go to "Data" tab
   - Select your database
   - Click "Permissions" 
   - Click "Inherited Roles" tab

3. **Create Inherited Roles** (if not already created):

   **Create `consultant` role**:
   - Role name: `consultant`
   - Inherits from: `viewer`

   **Create `manager` role**:
   - Role name: `manager` 
   - Inherits from: `consultant`, `viewer`

   **Create `org_admin` role**:
   - Role name: `org_admin`
   - Inherits from: `manager`, `consultant`, `viewer`

## Option 3: Direct Hasura API

```bash
# Apply inherited roles via API
curl -X POST \
  http://localhost:8080/v1/metadata \
  -H 'Content-Type: application/json' \
  -H 'x-hasura-admin-secret: YOUR_ADMIN_SECRET' \
  -d '{
    "type": "replace_metadata",
    "args": {
      "metadata": {
        "inherited_roles": [
          {
            "role_name": "org_admin",
            "role_set": ["manager", "consultant", "viewer"]
          },
          {
            "role_name": "manager", 
            "role_set": ["consultant", "viewer"]
          },
          {
            "role_name": "consultant",
            "role_set": ["viewer"]
          }
        ]
      }
    }
  }'
```

## Verification

After setup, verify by:

1. **Check Console**: Look for inherited roles in the Permissions tab
2. **Test GraphQL**: Use different role headers to test inheritance
3. **Check Metadata**: Confirm `inherited_roles.yaml` exists and has correct content

## Expected Result

You should see in the console:
- `org_admin` inheriting from `manager`, `consultant`, `viewer`
- `manager` inheriting from `consultant`, `viewer` 
- `consultant` inheriting from `viewer`
- `developer` as standalone role
- `viewer` as base role