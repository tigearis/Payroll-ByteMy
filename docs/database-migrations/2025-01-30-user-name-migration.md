# User Name Field Migration - 2025-01-30

## Overview

Complete migration from deprecated `name` column to modern user name structure with `firstName`, `lastName`, and computed `computedName` field.

## Migration Details

### Database Schema Changes

#### Before Migration
```sql
-- Old structure (DEPRECATED)
users {
  id: uuid
  name: VARCHAR(255) NOT NULL  -- ❌ DEPRECATED FIELD
  email: VARCHAR(255)
  role: user_role
  -- ... other fields
}
```

#### After Migration
```sql
-- New structure (CURRENT)  
users {
  id: uuid
  first_name: VARCHAR(255) NOT NULL     -- ✅ NEW FIELD
  last_name: VARCHAR(255) NOT NULL      -- ✅ NEW FIELD  
  computed_name: VARCHAR(511) GENERATED -- ✅ COMPUTED FIELD
  email: VARCHAR(255)
  role: user_role
  -- ... other fields
}

-- Generated column definition
computed_name GENERATED ALWAYS AS (
  CASE 
    WHEN first_name IS NOT NULL AND last_name IS NOT NULL AND TRIM(last_name) != '' THEN 
      TRIM(first_name || ' ' || last_name)
    WHEN first_name IS NOT NULL THEN 
      TRIM(first_name)
    ELSE 'Unknown User'
  END
) STORED;
```

### Migration Files Applied

1. **`/database/migrations/remove_name_column_use_computed_name.sql`**
   - Adds `first_name` and `last_name` columns
   - Migrates existing `name` data to new structure  
   - Creates `computed_name` generated column
   - Removes deprecated `name` column
   - Sets NOT NULL constraints

2. **`/database/migrations/recreate_dropped_views.sql`**
   - Recreates `public.staff_billing_performance` view
   - Recreates `public.consultant_capacity_overview` view  
   - Recreates `audit.user_access_summary` view
   - Updates all views to use `computed_name` instead of `name`

### Affected Database Views

#### staff_billing_performance
```sql
-- Updated view definition
CREATE OR REPLACE VIEW public.staff_billing_performance AS
SELECT 
    u.id as staff_user_id,
    u.computed_name as staff_name,  -- ✅ Updated from u.name
    COUNT(DISTINCT p.id) as total_payrolls,
    -- ... rest of view logic
FROM users u
-- ... joins and conditions
GROUP BY u.id, u.computed_name;  -- ✅ Updated from u.name
```

#### consultant_capacity_overview  
```sql
-- Updated view definition
CREATE OR REPLACE VIEW public.consultant_capacity_overview AS
SELECT 
    u.id,
    u.computed_name as name,  -- ✅ Updated from u.name
    u.email,
    -- ... rest of fields
FROM public.users u
LEFT JOIN public.work_schedule ws ON u.id = ws.user_id
WHERE u.is_staff = true;
```

#### audit.user_access_summary
```sql
-- Updated view definition  
CREATE OR REPLACE VIEW audit.user_access_summary AS
SELECT 
    u.id,
    u.computed_name as name,  -- ✅ Updated from u.name
    u.email,
    u.role,
    -- ... rest of fields
FROM public.users u;
```

## GraphQL Schema Updates

### Fragment Updates

All user-related GraphQL fragments updated to use new structure:

```graphql
# ✅ UPDATED - Modern structure
fragment UserMinimal on users {
  id
  firstName
  lastName  
  computedName
  email
}

# ❌ DEPRECATED - Old structure (removed)
fragment UserMinimal on users {
  id
  name  # This field no longer exists
  email
}
```

### Generated Types

TypeScript types regenerated to reflect new schema:

```typescript
// ✅ Generated types now include:
type Users = {
  id: string;
  firstName: string;
  lastName: string; 
  computedName?: string;
  email: string;
  // ... other fields
  // ❌ name field removed from types
}
```

## Code Updates Applied

### UI Components (40+ files updated)

**Standard Pattern Applied Everywhere:**
```typescript
// ✅ STANDARD PATTERN - Used across all components
const displayName = user.computedName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User';

// Applied to:
// - User tables and lists
// - Avatar components  
// - Manager/supervisor displays
// - Invitation management
// - Leave request displays
// - Note author displays
// - Email template creators
// - And 30+ other components
```

### Webhook System Updates

**Updated User Creation Webhook:**
```typescript
// ✅ UPDATED - app/api/webhooks/clerk/route.ts
const UPSERT_USER = gql`
  mutation UpsertUser(
    $clerkId: String!
    $firstName: String!    # ✅ NEW FIELD
    $lastName: String!     # ✅ NEW FIELD  
    $email: String!
    $role: user_role = "viewer"
    # ... other fields
    # ❌ name field removed
  ) {
    insertUser(
      object: {
        clerkUserId: $clerkId
        firstName: $firstName     # ✅ USES NEW STRUCTURE
        lastName: $lastName       # ✅ USES NEW STRUCTURE
        email: $email
        role: $role
        # ... other fields
      }
      onConflict: {
        constraint: users_clerk_user_id_key
        updateColumns: [firstName, lastName, email, updatedAt]  # ✅ UPDATED
      }
    ) {
      id
      firstName              # ✅ RETURNS NEW FIELDS
      lastName               # ✅ RETURNS NEW FIELDS  
      computedName           # ✅ RETURNS COMPUTED FIELD
      # ... other fields
    }
  }
`;
```

### API Route Updates

Updated all user-related API routes:
- `/api/staff/route.ts` - User search and filtering  
- `/api/users/profile/route.ts` - Profile management
- `/api/staff/create/route.ts` - Staff creation
- And 10+ other API routes

## Verification Steps

### Database Verification
```sql
-- 1. Verify new columns exist
\d+ users;

-- 2. Check data migration  
SELECT first_name, last_name, computed_name 
FROM users 
WHERE computed_name IS NOT NULL
LIMIT 10;

-- 3. Verify old column removed
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'name';
-- Should return 0 rows

-- 4. Check views are working
SELECT * FROM public.staff_billing_performance LIMIT 5;
SELECT * FROM public.consultant_capacity_overview LIMIT 5;  
SELECT * FROM audit.user_access_summary LIMIT 5;
```

### GraphQL Schema Verification
```bash
# 1. Fetch latest schema
pnpm get-schema

# 2. Regenerate types  
pnpm codegen

# 3. Verify build passes
pnpm build --no-lint

# 4. Check TypeScript  
pnpm type-check
```

### UI Testing Verification
```bash
# 1. Test user displays show proper names
# 2. Verify no "undefined undefined" text appears
# 3. Check manager displays show "No manager assigned" when appropriate
# 4. Test invitation system creates users with proper names
# 5. Verify search functionality works with new name structure
```

## Rollback Plan (Emergency Only)

**⚠️ WARNING**: Rollback will cause data loss for first_name/last_name separation.

```sql
-- EMERGENCY ROLLBACK (NOT RECOMMENDED)
BEGIN;

-- 1. Add name column back
ALTER TABLE users ADD COLUMN name VARCHAR(255);

-- 2. Populate from computed_name  
UPDATE users SET name = computed_name WHERE computed_name IS NOT NULL;
UPDATE users SET name = 'Unknown User' WHERE name IS NULL;

-- 3. Set NOT NULL constraint
ALTER TABLE users ALTER COLUMN name SET NOT NULL;

-- 4. Remove new columns (⚠️ DATA LOSS)
ALTER TABLE users DROP COLUMN first_name;
ALTER TABLE users DROP COLUMN last_name;  
ALTER TABLE users DROP COLUMN computed_name;

-- 5. Recreate old views (manual process required)

COMMIT;
```

## Success Metrics

✅ **Migration Completed Successfully:**
- Database schema updated without data loss
- All 3 dependent views recreated successfully  
- 40+ UI components updated to new pattern
- Webhook system processes users correctly
- GraphQL schema and types regenerated
- Production build passes cleanly
- No deprecated field references remain

## Future Considerations

1. **New User Components**: Always use the standard fallback pattern
2. **GraphQL Fragments**: Include `firstName`, `lastName`, `computedName` in user fragments
3. **API Development**: Never reference the deprecated `name` field
4. **Database Changes**: Consider impact on computed_name generation logic
5. **Testing**: Include name display testing in component tests

## Documentation Updates

- ✅ **CLAUDE.md**: Updated user name field standards section
- ✅ **CLAUDE.md**: Added authentication architecture with webhook fixes
- ✅ **CLAUDE.md**: Added comprehensive troubleshooting guide
- ✅ **This file**: Complete migration documentation created

---

**Migration Status**: ✅ **COMPLETE** - All systems modernized to new user name structure.
**Date Completed**: 2025-01-30
**Approved By**: System Migration Process