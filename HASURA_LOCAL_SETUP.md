# Hasura Local PostgreSQL Connection Guide

## Current Status
- ✅ PostgreSQL migrated to local server (192.168.1.229:5432)
- ✅ Database: `payroll_local` with 7 users, 66 tables
- ❌ Hasura needs to be connected to local PostgreSQL

## Hasura Configuration Options

### Option 1: Update Existing Hasura Service (Recommended)

If your Hasura is running as a Docker container on the same Unraid server:

#### 1. Access Hasura Container
```bash
# SSH into your Unraid server
ssh user@192.168.1.229

# Find the Hasura container
docker ps | grep hasura

# Access the container environment
docker exec -it <hasura-container-name> /bin/bash
```

#### 2. Update Database Environment Variable
```bash
# Set the new database URL
export PG_DATABASE_URL="postgresql://admin:PostH4rr!51604@localhost:5432/payroll_local?sslmode=disable"

# Or if PostgreSQL is in a different container:
export PG_DATABASE_URL="postgresql://admin:PostH4rr!51604@192.168.1.229:5432/payroll_local?sslmode=disable"
```

#### 3. Restart Hasura Container
```bash
# From Unraid server
docker restart <hasura-container-name>
```

### Option 2: Update Docker Compose (If Using Docker Compose)

If you're using Docker Compose, update your `docker-compose.yml`:

```yaml
services:
  hasura:
    environment:
      HASURA_GRAPHQL_DATABASE_URL: postgresql://admin:PostH4rr!51604@postgres:5432/payroll_local
      # Or if using host networking:
      # HASURA_GRAPHQL_DATABASE_URL: postgresql://admin:PostH4rr!51604@192.168.1.229:5432/payroll_local?sslmode=disable
```

Then restart:
```bash
docker-compose down && docker-compose up -d
```

### Option 3: Hasura Console Method

If you can access the Hasura console:

1. **Open Hasura Console**: https://hasura.bytemy.com.au/console
2. **Go to Data Tab** → **Manage Database**
3. **Edit Connection** 
4. **Update Database URL**: `postgresql://admin:PostH4rr!51604@192.168.1.229:5432/payroll_local?sslmode=disable`
5. **Test and Save**

## Testing the Connection

After updating Hasura's database connection, test it:

### 1. Quick Health Check
```bash
curl -f https://hasura.bytemy.com.au/healthz
```

### 2. GraphQL Test
```bash
curl -X POST https://hasura.bytemy.com.au/v1/graphql \
  -H "Content-Type: application/json" \
  -H "X-Hasura-Admin-Secret: 3w+sHTuq8wQwddK4xyWO5LDeRH+anvJoFVyOMvtq8Lo=" \
  -d '{"query": "{ users(limit: 1) { id email firstName lastName } }"}'
```

Expected response should show user data from your migrated database.

### 3. Use Our Test Script
```bash
./scripts/test-hasura-simple.sh
```

## Database Connection Details

**New Database Configuration:**
- **Host**: `192.168.1.229` (or `localhost` if Hasura is on same server)
- **Port**: `5432`
- **Database**: `payroll_local`
- **User**: `admin`
- **Password**: `PostH4rr!51604`
- **SSL**: `disabled` (appropriate for local network)

**Full Connection String:**
```
postgresql://admin:PostH4rr!51604@192.168.1.229:5432/payroll_local?sslmode=disable
```

## Environment Variables for Hasura

Set these environment variables in your Hasura deployment:

```bash
# Required
HASURA_GRAPHQL_DATABASE_URL=postgresql://admin:PostH4rr!51604@192.168.1.229:5432/payroll_local?sslmode=disable

# Optional (if different from database URL)
PG_DATABASE_URL=postgresql://admin:PostH4rr!51604@192.168.1.229:5432/payroll_local?sslmode=disable

# Keep existing
HASURA_GRAPHQL_ADMIN_SECRET=3w+sHTuq8wQwddK4xyWO5LDeRH+anvJoFVyOMvtq8Lo=
HASURA_GRAPHQL_ENABLE_CONSOLE=true
HASURA_GRAPHQL_DEV_MODE=true
```

## Troubleshooting

### If Hasura Can't Connect to PostgreSQL:

1. **Check PostgreSQL is accepting connections:**
   ```bash
   # From Hasura server
   telnet 192.168.1.229 5432
   ```

2. **Verify PostgreSQL authentication:**
   ```bash
   # Test from Hasura server
   PGPASSWORD='PostH4rr!51604' psql -h 192.168.1.229 -p 5432 -U admin -d payroll_local -c "SELECT 1;"
   ```

3. **Check PostgreSQL logs** for connection attempts and authentication failures

4. **Verify pg_hba.conf** allows connections from Hasura server IP

### If Metadata Issues Occur:

1. **Export current metadata:**
   ```bash
   hasura metadata export
   ```

2. **Clear and reload metadata:**
   ```bash
   hasura metadata clear
   hasura metadata apply
   ```

## Success Criteria

Once connected successfully, you should see:
- ✅ Hasura health check passes
- ✅ GraphQL introspection works
- ✅ Users query returns 7 users
- ✅ All your application's GraphQL operations work

## Next Steps After Connection

1. **Test your application:** `pnpm dev`
2. **Verify all GraphQL operations work**
3. **Test real-time subscriptions**
4. **Check audit logging functionality**
5. **Test critical business workflows**

The migration will be complete once Hasura is successfully connected to your local PostgreSQL database!