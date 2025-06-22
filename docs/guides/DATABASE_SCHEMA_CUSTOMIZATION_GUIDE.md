# Database Schema Customization Guide

## Overview

This guide provides comprehensive instructions for customizing and extending the database schema in Payroll ByteMy. The system uses PostgreSQL with Hasura GraphQL Engine, implementing strict naming conventions, row-level security, and comprehensive audit trails.

## 🏗️ Current Schema Architecture

### Database Structure
- **49 Core Tables**: Business entities, audit logs, configuration
- **Naming Convention**: `snake_case` for database, `camelCase` for GraphQL
- **Security**: Row-level security (RLS) on all tables
- **Audit System**: Comprehensive audit trails for compliance

### Key Database Features
- **Single-Tenant Architecture**: Each deployment serves one organization
- **7-Year Data Retention**: SOC2 compliance requirements
- **Comprehensive Indexes**: Optimized for payroll processing queries
- **Foreign Key Constraints**: Data integrity and relationship enforcement

## 📋 Table Categories

### Core Business Tables
```sql
-- Client Management
clients, client_external_systems, client_billing_assignment

-- User Management  
users, user_roles, roles, permissions, role_permissions

-- Payroll Processing
payrolls, payroll_assignments, payroll_cycles, payroll_dates
payroll_version_results, payroll_version_history_results

-- Billing & Invoicing
billing_invoices, billing_invoice_items, billing_plan, billing_event_log

-- Audit & Compliance
permission_audit_log, payroll_assignment_audit
```

### Configuration Tables
```sql
-- System Configuration
app_settings, feature_flags, holidays, adjustment_rules

-- External Systems
external_systems, payroll_date_types, resources
```

## 🔧 Adding New Tables

### Step 1: Create Migration File

```bash
# Create timestamped migration file
cd hasura/migrations/default
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
touch ${TIMESTAMP}_add_custom_table.up.sql
touch ${TIMESTAMP}_add_custom_table.down.sql
```

### Step 2: Define Table Schema

```sql
-- migrations/default/TIMESTAMP_add_custom_table.up.sql
CREATE TABLE public.custom_business_entity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Business fields (snake_case naming)
    entity_name VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    business_category VARCHAR(100),
    
    -- Relationships
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    assigned_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    
    -- Metadata
    custom_data JSONB DEFAULT '{}',
    configuration JSONB DEFAULT '{}',
    
    -- Status tracking
    is_active BOOLEAN DEFAULT true,
    status VARCHAR(50) DEFAULT 'active',
    
    -- Audit fields (required for all tables)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES public.users(id),
    updated_by UUID REFERENCES public.users(id)
);

-- Add indexes for performance
CREATE INDEX idx_custom_business_entity_client_id ON public.custom_business_entity(client_id);
CREATE INDEX idx_custom_business_entity_type ON public.custom_business_entity(entity_type);
CREATE INDEX idx_custom_business_entity_active ON public.custom_business_entity(is_active);
CREATE INDEX idx_custom_business_entity_status ON public.custom_business_entity(status);

-- Add updated_at trigger
CREATE TRIGGER set_custom_business_entity_updated_at
    BEFORE UPDATE ON public.custom_business_entity
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- Add row-level security (RLS)
ALTER TABLE public.custom_business_entity ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view entities from their managed clients"
    ON public.custom_business_entity
    FOR SELECT
    USING (
        client_id IN (
            SELECT id FROM public.clients 
            WHERE manager_id = auth.uid()
        )
        OR 
        assigned_user_id = auth.uid()
    );

CREATE POLICY "Managers can manage entities for their clients"
    ON public.custom_business_entity
    FOR ALL
    USING (
        client_id IN (
            SELECT id FROM public.clients 
            WHERE manager_id = auth.uid()
        )
    );

-- Add comments for documentation
COMMENT ON TABLE public.custom_business_entity IS 'Custom business entities for client-specific requirements';
COMMENT ON COLUMN public.custom_business_entity.custom_data IS 'Flexible JSON data for custom business requirements';
```

### Step 3: Create Down Migration

```sql
-- migrations/default/TIMESTAMP_add_custom_table.down.sql
DROP TABLE IF EXISTS public.custom_business_entity CASCADE;
```

### Step 4: Apply Migration

```bash
cd hasura
hasura migrate apply --database-name default
```

## 🎯 Hasura Table Configuration

### Step 1: Track Table in Hasura

```bash
# Add table to Hasura metadata
hasura metadata reload
```

### Step 2: Configure Table Metadata

```yaml
# hasura/metadata/databases/default/tables/public_custom_business_entity.yaml
table:
  name: custom_business_entity
  schema: public
configuration:
  column_config:
    # Map snake_case to camelCase
    entity_name:
      custom_name: entityName
    entity_type:
      custom_name: entityType
    business_category:
      custom_name: businessCategory
    client_id:
      custom_name: clientId
    assigned_user_id:
      custom_name: assignedUserId
    custom_data:
      custom_name: customData
    is_active:
      custom_name: isActive
    created_at:
      custom_name: createdAt
    updated_at:
      custom_name: updatedAt
    created_by:
      custom_name: createdBy
    updated_by:
      custom_name: updatedBy
  custom_column_names:
    # Mirror the column_config for consistency
    entity_name: entityName
    entity_type: entityType
    business_category: businessCategory
    client_id: clientId
    assigned_user_id: assignedUserId
    custom_data: customData
    is_active: isActive
    created_at: createdAt
    updated_at: updatedAt
    created_by: createdBy
    updated_by: updatedBy
  custom_root_fields:
    # Define GraphQL operation names
    select: customBusinessEntities
    select_by_pk: customBusinessEntity
    select_aggregate: customBusinessEntitiesAggregate
    insert: insertCustomBusinessEntity
    insert_one: insertCustomBusinessEntity
    update: updateCustomBusinessEntity
    update_by_pk: updateCustomBusinessEntity
    delete: deleteCustomBusinessEntity
    delete_by_pk: deleteCustomBusinessEntity
```

### Step 3: Configure Relationships

```yaml
# Add to the same metadata file
object_relationships:
  - name: client
    using:
      foreign_key_constraint_on: client_id
  - name: assignedUser
    using:
      foreign_key_constraint_on: assigned_user_id
  - name: createdByUser
    using:
      foreign_key_constraint_on: created_by
  - name: updatedByUser
    using:
      foreign_key_constraint_on: updated_by

array_relationships:
  - name: relatedEntities
    using:
      foreign_key_constraint_on:
        column: parent_entity_id
        table:
          name: related_custom_entities
          schema: public
```

### Step 4: Configure Permissions

```yaml
# Add to the same metadata file
select_permissions:
  - role: developer
    permission:
      columns: '*'
      filter: {}
      
  - role: org_admin
    permission:
      columns: '*'
      filter: {}
      
  - role: manager
    permission:
      columns:
        - id
        - entityName
        - entityType
        - businessCategory
        - clientId
        - assignedUserId
        - customData
        - isActive
        - status
        - createdAt
        - updatedAt
      filter:
        _or:
          - client:
              managerId: { _eq: "X-Hasura-User-Id" }
          - assignedUserId: { _eq: "X-Hasura-User-Id" }
              
  - role: consultant
    permission:
      columns:
        - id
        - entityName
        - entityType
        - businessCategory
        - clientId
        - isActive
        - status
        - createdAt
      filter:
        assignedUserId: { _eq: "X-Hasura-User-Id" }
        
  - role: viewer
    permission:
      columns:
        - id
        - entityName
        - entityType
        - businessCategory
        - isActive
        - status
      filter:
        client:
          _or:
            - managerId: { _eq: "X-Hasura-User-Id" }
            - users:
                id: { _eq: "X-Hasura-User-Id" }

insert_permissions:
  - role: manager
    permission:
      columns:
        - entityName
        - entityType
        - businessCategory
        - clientId
        - assignedUserId
        - customData
        - isActive
        - status
      filter:
        client:
          managerId: { _eq: "X-Hasura-User-Id" }
      set:
        createdBy: "X-Hasura-User-Id"
        
update_permissions:
  - role: manager
    permission:
      columns:
        - entityName
        - entityType
        - businessCategory
        - assignedUserId
        - customData
        - isActive
        - status
      filter:
        client:
          managerId: { _eq: "X-Hasura-User-Id" }
      set:
        updatedBy: "X-Hasura-User-Id"
        
delete_permissions:
  - role: manager
    permission:
      filter:
        client:
          managerId: { _eq: "X-Hasura-User-Id" }
```

### Step 5: Apply Metadata

```bash
cd hasura
hasura metadata apply
```

## 🔗 Adding New Relationships

### Foreign Key Relationships

```sql
-- Add foreign key constraint
ALTER TABLE public.custom_business_entity 
ADD CONSTRAINT fk_custom_entity_parent
FOREIGN KEY (parent_entity_id) 
REFERENCES public.custom_business_entity(id) 
ON DELETE CASCADE;
```

### Many-to-Many Relationships

```sql
-- Create junction table
CREATE TABLE public.custom_entity_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID NOT NULL REFERENCES public.custom_business_entity(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    
    -- Audit fields
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES public.users(id),
    
    -- Unique constraint
    UNIQUE(entity_id, tag_id)
);

-- Add indexes
CREATE INDEX idx_custom_entity_tags_entity ON public.custom_entity_tags(entity_id);
CREATE INDEX idx_custom_entity_tags_tag ON public.custom_entity_tags(tag_id);
```

### Configure in Hasura

```yaml
# In custom_business_entity metadata
array_relationships:
  - name: entityTags
    using:
      foreign_key_constraint_on:
        column: entity_id
        table:
          name: custom_entity_tags
          schema: public
          
  - name: tags
    using:
      manual_configuration:
        column_mapping:
          id: entity_id
        insertion_order: null
        remote_table:
          name: custom_entity_tags
          schema: public
```

## 🔍 Adding Custom Fields

### JSON/JSONB Fields

```sql
-- Add flexible JSON field
ALTER TABLE public.custom_business_entity 
ADD COLUMN custom_attributes JSONB DEFAULT '{}';

-- Add GIN index for JSON queries
CREATE INDEX idx_custom_business_entity_attributes 
ON public.custom_business_entity 
USING GIN (custom_attributes);

-- Add validation constraint
ALTER TABLE public.custom_business_entity 
ADD CONSTRAINT check_custom_attributes_valid 
CHECK (jsonb_typeof(custom_attributes) = 'object');
```

### Computed Fields

```sql
-- Create computed field function
CREATE OR REPLACE FUNCTION public.custom_entity_full_name(
    entity_row public.custom_business_entity
)
RETURNS TEXT AS $$
BEGIN
    RETURN COALESCE(entity_row.entity_name, '') || ' (' || 
           COALESCE(entity_row.entity_type, '') || ')';
END;
$$ LANGUAGE plpgsql STABLE;

-- Add computed field to Hasura
```

```yaml
# In table metadata
computed_fields:
  - name: fullName
    definition:
      function:
        name: custom_entity_full_name
        schema: public
```

## 🔐 Security Patterns

### Row-Level Security Policies

```sql
-- Manager access to client entities
CREATE POLICY "Managers access client entities"
    ON public.custom_business_entity
    FOR ALL
    USING (
        client_id IN (
            SELECT id FROM public.clients 
            WHERE manager_id = auth.uid()
        )
    );

-- User access to assigned entities
CREATE POLICY "Users access assigned entities"
    ON public.custom_business_entity
    FOR SELECT
    USING (assigned_user_id = auth.uid());

-- Department-based access
CREATE POLICY "Department access"
    ON public.custom_business_entity
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_departments ud
            WHERE ud.user_id = auth.uid()
            AND ud.department = 'finance'
            AND entity_type IN ('billing', 'invoice')
        )
    );
```

### Data Classification

```sql
-- Add data classification column
ALTER TABLE public.custom_business_entity 
ADD COLUMN data_classification VARCHAR(20) DEFAULT 'MEDIUM'
CHECK (data_classification IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW'));

-- Classification-based access policy
CREATE POLICY "Classification access"
    ON public.custom_business_entity
    FOR SELECT
    USING (
        CASE 
            WHEN data_classification = 'CRITICAL' THEN 
                auth.role() IN ('developer', 'org_admin')
            WHEN data_classification = 'HIGH' THEN 
                auth.role() IN ('developer', 'org_admin', 'manager')
            ELSE true
        END
    );
```

## 📊 Audit and Compliance

### Audit Trigger Function

```sql
-- Create audit table
CREATE TABLE public.custom_business_entity_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID NOT NULL,
    action VARCHAR(10) NOT NULL, -- INSERT, UPDATE, DELETE
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],
    changed_by UUID REFERENCES public.users(id),
    changed_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Audit metadata
    session_id TEXT,
    ip_address INET,
    user_agent TEXT
);

-- Create audit trigger function
CREATE OR REPLACE FUNCTION public.audit_custom_business_entity()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.custom_business_entity_audit (
        entity_id, action, old_values, new_values, changed_fields, changed_by
    ) VALUES (
        COALESCE(NEW.id, OLD.id),
        TG_OP,
        CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP = 'INSERT' THEN to_jsonb(NEW) ELSE to_jsonb(NEW) END,
        CASE 
            WHEN TG_OP = 'UPDATE' THEN 
                array(SELECT key FROM jsonb_each(to_jsonb(NEW)) 
                      WHERE to_jsonb(NEW) ->> key != to_jsonb(OLD) ->> key)
            ELSE NULL
        END,
        COALESCE(NEW.updated_by, OLD.updated_by, NEW.created_by)
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create audit trigger
CREATE TRIGGER audit_custom_business_entity_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.custom_business_entity
    FOR EACH ROW EXECUTE FUNCTION public.audit_custom_business_entity();
```

### Compliance Features

```sql
-- Add compliance tracking
ALTER TABLE public.custom_business_entity ADD COLUMN compliance_status VARCHAR(50) DEFAULT 'compliant';
ALTER TABLE public.custom_business_entity ADD COLUMN last_compliance_check TIMESTAMPTZ;
ALTER TABLE public.custom_business_entity ADD COLUMN retention_date TIMESTAMPTZ;

-- Retention policy function
CREATE OR REPLACE FUNCTION public.calculate_retention_date()
RETURNS TRIGGER AS $$
BEGIN
    -- Set 7-year retention for SOC2 compliance
    NEW.retention_date := NEW.created_at + INTERVAL '7 years';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_retention_date
    BEFORE INSERT ON public.custom_business_entity
    FOR EACH ROW EXECUTE FUNCTION public.calculate_retention_date();
```

## 🎯 GraphQL Operations

### Create Domain Structure

```bash
# Create domain for new entity
mkdir -p domains/custom-entities/graphql
touch domains/custom-entities/graphql/{fragments,queries,mutations,subscriptions}.graphql
```

### Define Fragments

```graphql
# domains/custom-entities/graphql/fragments.graphql
fragment CustomEntityCore on customBusinessEntities {
  id
  entityName
  entityType
  businessCategory
  isActive
  status
  createdAt
  updatedAt
}

fragment CustomEntityWithClient on customBusinessEntities {
  ...CustomEntityCore
  clientId
  client {
    id
    name
    status
  }
}

fragment CustomEntityDetailed on customBusinessEntities {
  ...CustomEntityWithClient
  assignedUserId
  assignedUser {
    id
    name
    email
  }
  customData
  createdBy
  createdByUser {
    id
    name
  }
  updatedBy
  updatedByUser {
    id
    name
  }
}
```

### Define Operations

```graphql
# domains/custom-entities/graphql/queries.graphql
query GetCustomEntities(
  $where: customBusinessEntities_bool_exp
  $orderBy: [customBusinessEntities_order_by!]
  $limit: Int
  $offset: Int
) {
  customBusinessEntities(
    where: $where
    order_by: $orderBy
    limit: $limit
    offset: $offset
  ) {
    ...CustomEntityWithClient
  }
  customBusinessEntitiesAggregate(where: $where) {
    aggregate {
      count
    }
  }
}

query GetCustomEntity($id: uuid!) {
  customBusinessEntity(id: $id) {
    ...CustomEntityDetailed
  }
}
```

```graphql
# domains/custom-entities/graphql/mutations.graphql
mutation CreateCustomEntity($object: customBusinessEntities_insert_input!) {
  insertCustomBusinessEntity(object: $object) {
    ...CustomEntityWithClient
  }
}

mutation UpdateCustomEntity(
  $id: uuid!
  $updates: customBusinessEntities_set_input!
) {
  updateCustomBusinessEntity(pk_columns: { id: $id }, _set: $updates) {
    ...CustomEntityWithClient
  }
}

mutation DeleteCustomEntity($id: uuid!) {
  deleteCustomBusinessEntity(id: $id) {
    id
    entityName
  }
}
```

### Generate Types

```bash
# Generate TypeScript types
pnpm codegen
```

## 🧪 Testing Database Changes

### Migration Testing

```bash
# Test migration up
hasura migrate apply --database-name default

# Test migration down
hasura migrate apply --database-name default --down 1

# Re-apply migration
hasura migrate apply --database-name default
```

### Data Validation

```sql
-- Test data integrity
SELECT 
    COUNT(*) as total_records,
    COUNT(DISTINCT client_id) as unique_clients,
    COUNT(CASE WHEN is_active THEN 1 END) as active_records
FROM public.custom_business_entity;

-- Test relationships
SELECT 
    ce.entity_name,
    c.name as client_name,
    u.name as assigned_user
FROM public.custom_business_entity ce
LEFT JOIN public.clients c ON ce.client_id = c.id
LEFT JOIN public.users u ON ce.assigned_user_id = u.id
LIMIT 10;
```

### Permission Testing

```sql
-- Test RLS policies
SET ROLE 'manager';
SET session.jwt.claims.x-hasura-user-id = 'test-manager-uuid';

SELECT id, entity_name FROM public.custom_business_entity;
-- Should only return entities for managed clients

RESET ROLE;
```

## 🚨 Common Issues & Solutions

### Issue 1: Migration Conflicts

**Problem**: Migration fails due to conflicts

**Solution**: 
```bash
# Check migration status
hasura migrate status --database-name default

# Resolve conflicts manually
# Edit migration files to resolve conflicts
# Re-apply migrations
hasura migrate apply --database-name default
```

### Issue 2: RLS Policies Too Restrictive

**Problem**: Users can't access data they should be able to

**Solution**:
```sql
-- Debug RLS policies
SELECT * FROM pg_policies WHERE tablename = 'custom_business_entity';

-- Test policy logic
SELECT policy_name, qual FROM pg_policies 
WHERE tablename = 'custom_business_entity' 
AND roles @> '{manager}';
```

### Issue 3: GraphQL Field Errors

**Problem**: GraphQL operations fail with field errors

**Solution**:
```bash
# Verify Hasura metadata
hasura metadata export
# Check field names in metadata file

# Regenerate types
pnpm codegen

# Test in Hasura console
hasura console
```

## 🎯 Best Practices

### 1. Naming Conventions

```sql
-- Database: snake_case
custom_business_entity
entity_name
client_id

-- GraphQL: camelCase (via Hasura config)
customBusinessEntity
entityName
clientId
```

### 2. Required Fields

```sql
-- Every table should have:
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
created_at TIMESTAMPTZ DEFAULT NOW()
updated_at TIMESTAMPTZ DEFAULT NOW()
created_by UUID REFERENCES public.users(id)
updated_by UUID REFERENCES public.users(id)
```

### 3. Security First

- Enable RLS on all tables
- Create appropriate policies for each role
- Use audit triggers for sensitive data
- Implement data classification

### 4. Performance Optimization

```sql
-- Add indexes for common queries
CREATE INDEX idx_table_commonly_queried_field ON table(field);

-- Add partial indexes for filtered queries
CREATE INDEX idx_table_active_records ON table(id) WHERE is_active = true;
```

## 📚 Related Documentation

- [Hasura Documentation](./hasura/README.md)
- [GraphQL Development Workflow](./hasura/GRAPHQL_DEVELOPMENT_WORKFLOW.md)
- [Permission System Guide](./PERMISSION_SYSTEM_EXTENSION_GUIDE.md)
- [Security Implementation](./SECURITY_IMPROVEMENT_REPORT.md)

## 🎯 Next Steps

After customizing the database schema:

1. **Test Thoroughly**: Verify all operations work correctly
2. **Update Documentation**: Document new tables and fields
3. **Generate Types**: Run code generation for TypeScript types
4. **Test Permissions**: Verify RLS policies work as expected
5. **Performance Testing**: Ensure queries perform well with data
6. **Backup Strategy**: Update backup procedures for new tables

---

This guide provides comprehensive instructions for database schema customization. Always test changes in development before applying to production.