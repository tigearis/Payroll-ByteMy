# Cleanup Commands for INVITATION Test User and All Invitations

## Option 1: Direct SQL Commands (Recommended)

Run these commands in your database console or pgAdmin:

### 1. Preview what will be deleted (SAFE - just shows data):

```sql
-- Show users matching "INVITATION Test"
SELECT 
    id,
    first_name,
    last_name,
    computed_name,
    email,
    clerk_user_id,
    role,
    is_active,
    created_at
FROM users 
WHERE 
    first_name ILIKE '%INVITATION%' 
    OR last_name ILIKE '%Test%' 
    OR computed_name ILIKE '%INVITATION%Test%'
    OR email ILIKE '%invitation%'
    OR email ILIKE '%test%';

-- Show all invitations
SELECT 
    id,
    email,
    first_name,
    last_name,
    invited_role,
    invitation_status,
    invited_at,
    expires_at,
    clerk_invitation_id
FROM user_invitations
ORDER BY invited_at DESC;

-- Show summary counts
SELECT 
    'Users matching criteria' as type,
    COUNT(*) as count
FROM users 
WHERE 
    first_name ILIKE '%INVITATION%' 
    OR last_name ILIKE '%Test%' 
    OR computed_name ILIKE '%INVITATION%Test%'
    OR email ILIKE '%invitation%'
    OR email ILIKE '%test%'
UNION ALL
SELECT 
    'Total invitations' as type,
    COUNT(*) as count
FROM user_invitations;
```

### 2. If you confirm you want to delete, run these commands:

⚠️ **WARNING: These commands will permanently delete data! Make sure you've reviewed the preview above.**

```sql
-- Delete all invitations first
DELETE FROM user_invitations;

-- Delete users matching INVITATION Test criteria
DELETE FROM users 
WHERE 
    first_name ILIKE '%INVITATION%' 
    OR last_name ILIKE '%Test%' 
    OR computed_name ILIKE '%INVITATION%Test%'
    OR email ILIKE '%invitation%'
    OR email ILIKE '%test%';

-- Verify cleanup
SELECT 'Remaining users' as type, COUNT(*) as count FROM users
UNION ALL
SELECT 'Remaining invitations' as type, COUNT(*) as count FROM user_invitations;
```

## Option 2: Using the API (if Next.js server is running)

### 1. Preview what will be deleted:
```bash
node scripts/test-cleanup.js
```

### 2. Actually delete (after confirming preview):
```bash
node scripts/test-cleanup.js --delete
```

## Option 3: Using Hasura Console

1. Open Hasura Console: `http://localhost:8080`
2. Go to the "Data" tab
3. Click on "user_invitations" table
4. Click "Browse Rows" and delete all invitations
5. Click on "users" table  
6. Click "Browse Rows" and search/filter for users with names containing "INVITATION" or "Test"
7. Delete the matching users

## Notes

- The SQL approach is the most direct and reliable
- Always run the preview queries first to see what will be deleted
- The database connection string is: `postgresql://admin:PostH4rr!51604@192.168.1.229:5432/payroll_local`
- These operations cannot be undone, so please double-check before executing the DELETE commands