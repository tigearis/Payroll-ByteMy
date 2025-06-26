# Inherited Roles Permission Strategy

## Current Hierarchy (✅ Already Configured)

```
developer (standalone) - Full access, no inheritance needed
    ↑
org_admin ← manager + consultant + viewer
    ↑
manager ← consultant + viewer
    ↑  
consultant ← viewer
    ↑
viewer (base role)
```

## Permission Optimization Strategy

### 1. **Base Role Permissions (viewer)**
- Define minimal read-only permissions
- Focus on basic data access
- All other roles will automatically inherit these

**Example Tables to Define for `viewer`:**
- `select` on public.users (own record only)
- `select` on public.clients (limited fields)
- `select` on basic lookup tables

### 2. **Incremental Role Permissions**

#### **consultant** (inherits viewer + adds)
- Additional `select` permissions on assigned clients
- Basic `insert`/`update` on timesheets
- `select` on payroll data for assigned clients

#### **manager** (inherits consultant + viewer + adds)
- `select` on all clients in their organization
- `insert`/`update` on staff assignments
- `select` on financial reports

#### **org_admin** (inherits manager + consultant + viewer + adds)
- Full `insert`/`update`/`delete` on organizational data
- Admin functions for user management
- Access to security logs and reports

#### **developer** (standalone)
- Full permissions on all tables
- System administration capabilities
- Debugging and maintenance functions

## Benefits of This Structure

### ✅ **Maintenance Efficiency**
- Change viewer permissions → All roles inherit the change
- Add new consultant permission → Managers and org_admins get it automatically
- Reduce permission duplication by ~70%

### ✅ **Security Consistency**
- Impossible to accidentally give higher permissions to lower roles
- Hierarchical consistency is automatically enforced
- Easy to audit permission levels

### ✅ **Performance Benefits**
- Hasura optimizes permission checks with inherited roles
- Faster authorization evaluation
- Better caching of permission results

## Implementation Phases

### Phase 1: Current State ✅
- Inherited roles configured in metadata
- Existing permissions remain unchanged
- Ready for optimization

### Phase 2: Permission Optimization (Recommended Next Steps)
1. Start with `viewer` role - simplify to minimal permissions
2. Remove redundant permissions from higher roles
3. Test thoroughly with each role
4. Document the simplified permission matrix

### Phase 3: New Feature Development
- New permissions only need to be added to the appropriate base role
- Inheritance automatically propagates to higher roles
- Faster development cycles

## Testing Strategy

### Before Making Changes:
1. Export current metadata as backup
2. Test all role functionalities in staging
3. Document current permission matrix

### During Optimization:
1. Start with least privileged role (viewer)
2. Work up the hierarchy one role at a time
3. Test each change in isolation

### Verification:
1. User with `org_admin` role can do everything `manager` can do
2. User with `manager` role can do everything `consultant` can do
3. User with `consultant` role can do everything `viewer` can do

## Hasura Console Verification Commands

```bash
# Apply metadata changes
hasura metadata apply

# Check if inherited roles are active
hasura metadata export

# Test with specific role in GraphQL playground
# Use X-Hasura-Role header to test each role level
```