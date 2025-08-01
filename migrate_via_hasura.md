# Database Migration via Hasura Console

Since direct PostgreSQL connection is not available, here's how to run the migrations through Hasura:

## Option 1: Hasura Console SQL Interface

1. **Open Hasura Console**:
   ```bash
   cd hasura
   hasura console
   ```

2. **Navigate to Data > SQL** in the Hasura console

3. **Run migrations in this exact order**:

### Step 1: Core Enhancement
Copy and paste the contents of `database/migrations/comprehensive_billing_enhancement.sql` into the SQL editor and execute.

### Step 2: Legacy Cleanup  
Copy and paste the contents of `database/migrations/legacy_billing_cleanup.sql` into the SQL editor and execute.

### Step 3: Automation Setup
Copy and paste the contents of `database/migrations/automated_billing_generation.sql` into the SQL editor and execute.

### Step 4: Master Data Population
Copy and paste the contents of `database/migrations/populate_master_fee_types.sql` into the SQL editor and execute.

## Option 2: Hasura CLI Migrations

1. **Create Hasura migration files**:
   ```bash
   cd hasura
   hasura migrate create "comprehensive_billing_enhancement" --database-name default
   hasura migrate create "legacy_billing_cleanup" --database-name default
   hasura migrate create "automated_billing_generation" --database-name default
   hasura migrate create "populate_master_fee_types" --database-name default
   ```

2. **Copy SQL content** into the generated migration files

3. **Apply migrations**:
   ```bash
   hasura migrate apply --database-name default
   ```

## Option 3: Direct Database Access

If you need direct database access, you may need to:

1. **Configure database firewall** to allow your IP address
2. **Use SSH tunnel** if the database is behind a private network
3. **Use your cloud provider's console** (if using managed PostgreSQL)

## Rollback Plan

If anything goes wrong, use the rollback script:
- Via Hasura Console: Run `database/migrations/rollback_comprehensive_billing.sql`
- Via CLI: Create a rollback migration and apply it

## Verification

After running migrations, verify success by checking:

1. **New tables exist**: quotes, quote_line_items, quote_templates, quote_conversions
2. **Enhanced columns**: time_entries has time_units column
3. **Legacy tables removed**: billing_plan and client_billing_assignment should be gone
4. **Services populated**: Check services table has fee types from your image
5. **Functions created**: Automation functions should be available

## Next Steps After Migration

1. **Update Hasura metadata** to track new tables
2. **Generate TypeScript types** from new GraphQL schema
3. **Test GraphQL operations** with the new schema
4. **Integrate new components** into your app routing

## Troubleshooting

If you encounter errors:
1. Check Hasura logs for detailed error messages
2. Ensure all prerequisite tables exist
3. Run rollback script if needed
4. Contact me with specific error messages for assistance