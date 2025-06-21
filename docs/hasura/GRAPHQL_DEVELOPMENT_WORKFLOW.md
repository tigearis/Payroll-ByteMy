# GraphQL Development Workflow

## Overview

This guide provides a step-by-step workflow for developing GraphQL operations in the Payroll ByteMy system, from database changes to frontend implementation.

## 🚀 Quick Start Workflow

### 1. Database Schema Changes

When you need to modify the database schema:

```bash
# 1. Create migration file
cd database/migrations
touch $(date +%Y%m%d_%H%M%S)_add_new_feature.sql

# 2. Write your SQL changes
# Example: Adding a new table
```

```sql
-- database/migrations/20241220_120000_add_example_table.sql
CREATE TABLE public.example_entities (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  display_name text,
  entity_type text NOT NULL,
  is_active boolean DEFAULT true,
  user_id uuid REFERENCES public.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add indexes
CREATE INDEX idx_example_entities_user_id ON public.example_entities(user_id);
CREATE INDEX idx_example_entities_entity_type ON public.example_entities(entity_type);
CREATE INDEX idx_example_entities_is_active ON public.example_entities(is_active);
```

### 2. Hasura Configuration

```bash
# 1. Track the new table in Hasura
cd hasura
hasura migrate apply
hasura metadata reload
```

Create the metadata file `hasura/metadata/databases/default/tables/public_example_entities.yaml`:

```yaml
table:
  name: example_entities
  schema: public
configuration:
  column_config:
    created_at:
      custom_name: createdAt
    display_name:
      custom_name: displayName
    entity_type:
      custom_name: entityType
    is_active:
      custom_name: isActive
    updated_at:
      custom_name: updatedAt
    user_id:
      custom_name: userId
  custom_column_names:
    created_at: createdAt
    display_name: displayName
    entity_type: entityType
    is_active: isActive
    updated_at: updatedAt
    user_id: userId
  custom_root_fields:
    delete: deleteExampleEntities
    delete_by_pk: deleteExampleEntity
    insert: insertExampleEntities
    insert_one: insertExampleEntity
    select: exampleEntities
    select_aggregate: exampleEntitiesAggregate
    select_by_pk: exampleEntity
    update: updateExampleEntities
    update_by_pk: updateExampleEntity
object_relationships:
  - name: user
    using:
      foreign_key_constraint_on: user_id
insert_permissions:
  - role: developer
    permission:
      check: {}
      columns: "*"
select_permissions:
  - role: developer
    permission:
      columns: "*"
      filter: {}
      allow_aggregations: true
update_permissions:
  - role: developer
    permission:
      columns: "*"
      filter: {}
      check: {}
delete_permissions:
  - role: developer
    permission:
      filter: {}
```

Apply the metadata:

```bash
hasura metadata apply
```

### 3. Domain Setup

Create the domain structure:

```bash
# Create domain directory
mkdir -p domains/example-entities/{components,graphql,services,types}
touch domains/example-entities/{index.ts,README.md}
touch domains/example-entities/graphql/{fragments,queries,mutations,subscriptions}.graphql
```

### 4. GraphQL Operations

#### Fragments (`domains/example-entities/graphql/fragments.graphql`)

```graphql
# Example Entities Domain Fragments

fragment ExampleEntityCore on example_entities {
  id
  name
  displayName
  entityType
  isActive
  userId
  createdAt
  updatedAt
}

fragment ExampleEntityWithUser on example_entities {
  ...ExampleEntityCore
  user {
    id
    name
    email
    isActive
  }
}

fragment ExampleEntityWithAllRelations on example_entities {
  ...ExampleEntityWithUser
  # Add other relationships as they're created
}
```

#### Queries (`domains/example-entities/graphql/queries.graphql`)

```graphql
# Example Entities Domain Queries

# Basic CRUD queries
query GetExampleEntities(
  $where: example_entities_bool_exp
  $order_by: [example_entities_order_by!]
  $limit: Int
  $offset: Int
) {
  exampleEntities(
    where: $where
    order_by: $order_by
    limit: $limit
    offset: $offset
  ) {
    ...ExampleEntityCore
  }
  exampleEntitiesAggregate(where: $where) {
    aggregate {
      count
    }
  }
}

query GetExampleEntity($id: uuid!) {
  exampleEntity(id: $id) {
    ...ExampleEntityWithAllRelations
  }
}

# Search and filter queries
query SearchExampleEntities($searchTerm: String!) {
  exampleEntities(
    where: {
      _or: [
        { name: { _ilike: $searchTerm } }
        { displayName: { _ilike: $searchTerm } }
      ]
    }
    order_by: { name: asc }
  ) {
    ...ExampleEntityCore
  }
}

query GetExampleEntitiesByType($entityType: String!) {
  exampleEntities(
    where: { entityType: { _eq: $entityType } }
    order_by: { name: asc }
  ) {
    ...ExampleEntityCore
  }
}

query GetExampleEntitiesByUser($userId: uuid!) {
  exampleEntities(
    where: { userId: { _eq: $userId } }
    order_by: { createdAt: desc }
  ) {
    ...ExampleEntityWithUser
  }
}

# Analytics queries
query GetExampleEntityAnalytics(
  $startDate: timestamptz!
  $endDate: timestamptz!
) {
  exampleEntitiesAggregate(
    where: { createdAt: { _gte: $startDate, _lte: $endDate } }
  ) {
    aggregate {
      count
    }
  }

  entitiesByType: exampleEntities(
    where: { createdAt: { _gte: $startDate, _lte: $endDate } }
    distinct_on: entityType
  ) {
    entityType
  }
}
```

#### Mutations (`domains/example-entities/graphql/mutations.graphql`)

```graphql
# Example Entities Domain Mutations

# Create operations
mutation CreateExampleEntity($object: example_entities_insert_input!) {
  insertExampleEntity(object: $object) {
    ...ExampleEntityCore
  }
}

mutation CreateExampleEntities($objects: [example_entities_insert_input!]!) {
  insertExampleEntities(objects: $objects) {
    returning {
      ...ExampleEntityCore
    }
    affected_rows
  }
}

# Update operations
mutation UpdateExampleEntity($id: uuid!, $set: example_entities_set_input!) {
  updateExampleEntity(pk_columns: { id: $id }, _set: $set) {
    ...ExampleEntityCore
  }
}

mutation UpdateExampleEntities(
  $where: example_entities_bool_exp!
  $set: example_entities_set_input!
) {
  updateExampleEntities(where: $where, _set: $set) {
    returning {
      ...ExampleEntityCore
    }
    affected_rows
  }
}

# Delete operations
mutation DeleteExampleEntity($id: uuid!) {
  deleteExampleEntity(id: $id) {
    id
    name
  }
}

mutation DeleteExampleEntities($where: example_entities_bool_exp!) {
  deleteExampleEntities(where: $where) {
    returning {
      id
      name
    }
    affected_rows
  }
}

# Soft delete operations
mutation SoftDeleteExampleEntity($id: uuid!) {
  updateExampleEntity(
    pk_columns: { id: $id }
    _set: { isActive: false, updatedAt: "now()" }
  ) {
    ...ExampleEntityCore
  }
}

# Business logic mutations
mutation ActivateExampleEntity($id: uuid!) {
  updateExampleEntity(
    pk_columns: { id: $id }
    _set: { isActive: true, updatedAt: "now()" }
  ) {
    ...ExampleEntityCore
  }
}

mutation BulkUpdateEntityType($entityIds: [uuid!]!, $newType: String!) {
  updateExampleEntities(
    where: { id: { _in: $entityIds } }
    _set: { entityType: $newType, updatedAt: "now()" }
  ) {
    returning {
      ...ExampleEntityCore
    }
    affected_rows
  }
}
```

#### Subscriptions (`domains/example-entities/graphql/subscriptions.graphql`)

```graphql
# Example Entities Domain Subscriptions

# Real-time updates
subscription ExampleEntitiesUpdated {
  exampleEntities(order_by: { updatedAt: desc }, limit: 10) {
    ...ExampleEntityCore
  }
}

# User-specific subscriptions
subscription ExampleEntitiesByUserUpdated($userId: uuid!) {
  exampleEntities(
    where: { userId: { _eq: $userId } }
    order_by: { updatedAt: desc }
  ) {
    ...ExampleEntityCore
  }
}

# Type-specific subscriptions
subscription ExampleEntitiesByTypeUpdated($entityType: String!) {
  exampleEntities(
    where: { entityType: { _eq: $entityType } }
    order_by: { updatedAt: desc }
  ) {
    ...ExampleEntityCore
  }
}

# Active entities only
subscription ActiveExampleEntitiesUpdated {
  exampleEntities(where: { isActive: { _eq: true } }, order_by: { name: asc }) {
    ...ExampleEntityCore
  }
}
```

### 5. Code Generation

Add the domain to the codegen configuration in `config/codegen.ts`:

```typescript
// Add this to the outputs object
[`./domains/example-entities/graphql/generated/`]: {
  preset: 'client',
  documents: [`./domains/example-entities/graphql/**/*.graphql`],
  plugins: [],
  presetConfig: {
    gqlTagName: 'gql',
  },
},
```

Generate the types:

```bash
pnpm codegen
```

### 6. Domain Index File

Create `domains/example-entities/index.ts`:

```typescript
// Export generated types and operations
export * from "./graphql/generated";

// Export components
export * from "./components";

// Export services
export * from "./services";

// Export types
export * from "./types";
```

### 7. Testing GraphQL Operations

Use the Hasura console to test your operations:

```bash
cd hasura
hasura console
```

Test your queries in the GraphiQL interface before using them in code.

## 🔄 Development Workflow Steps

### Daily Development Workflow

1. **Start Development Environment**

   ```bash
   # Terminal 1: Start Next.js
   pnpm dev

   # Terminal 2: Hasura Console (if needed)
   cd hasura && hasura console
   ```

2. **Make Database Changes**

   - Create migration files for schema changes
   - Apply migrations: `hasura migrate apply`
   - Update metadata: `hasura metadata apply`

3. **Update GraphQL Operations**

   - Modify `.graphql` files in domain directories
   - Follow naming conventions
   - Test in Hasura console first

4. **Generate Types**

   ```bash
   pnpm codegen
   ```

5. **Implement Frontend Changes**

   - Use generated types and hooks
   - Follow component patterns
   - Add proper error handling

6. **Test and Validate**
   - Test GraphQL operations
   - Verify type safety
   - Check console for errors

### Code Review Checklist

Before submitting a PR, ensure:

- [ ] **Database migrations** are properly written and tested
- [ ] **Hasura metadata** follows naming conventions
- [ ] **GraphQL operations** use correct field names
- [ ] **Fragments** are properly structured (Core → Extended → Detailed)
- [ ] **Mutations** include proper error handling
- [ ] **Code generation** runs without errors
- [ ] **Types** are properly exported from domain index
- [ ] **Components** use generated hooks
- [ ] **Documentation** is updated if needed

## 🛠️ Common Development Tasks

### Adding a New Field to Existing Table

1. **Create Migration**

   ```sql
   -- Add new field
   ALTER TABLE public.users ADD COLUMN phone_number text;

   -- Add index if needed
   CREATE INDEX idx_users_phone_number ON public.users(phone_number);
   ```

2. **Update Hasura Metadata**

   ```yaml
   # Add to column_config and custom_column_names
   phone_number:
     custom_name: phoneNumber
   ```

3. **Update GraphQL Fragments**

   ```graphql
   fragment UserCore on users {
     id
     name
     email
     phoneNumber # Add new field
     # ... other fields
   }
   ```

4. **Regenerate Types**
   ```bash
   pnpm codegen
   ```

### Adding a New Relationship

1. **Create Foreign Key** (if needed)

   ```sql
   ALTER TABLE public.example_entities
   ADD COLUMN category_id uuid REFERENCES public.categories(id);
   ```

2. **Update Hasura Metadata**

   ```yaml
   # Add to relationships
   object_relationships:
     - name: category
       using:
         foreign_key_constraint_on: category_id
   ```

3. **Update GraphQL Operations**
   ```graphql
   fragment ExampleEntityWithCategory on example_entities {
     ...ExampleEntityCore
     category {
       id
       name
       displayName
     }
   }
   ```

### Creating a New Domain

1. **Follow the domain structure** outlined above
2. **Add to codegen configuration**
3. **Create comprehensive GraphQL operations**
4. **Export from domain index**
5. **Add to main domains export** if needed

## 🐛 Troubleshooting Common Issues

### GraphQL Validation Errors

```bash
# Run codegen to see specific errors
pnpm codegen

# Common fixes:
# 1. Check field names match Hasura custom names
# 2. Verify mutation names match custom root fields
# 3. Ensure relationship names are correct
# 4. Check variable types match schema
```

### Hasura Metadata Issues

```bash
# Reload metadata
cd hasura
hasura metadata reload

# Check metadata consistency
hasura metadata ic list

# Apply metadata changes
hasura metadata apply
```

### Type Generation Issues

```bash
# Clear generated files
rm -rf domains/*/graphql/generated/*
rm -rf shared/types/generated/*

# Regenerate
pnpm codegen
```

## 📚 Best Practices Summary

1. **Always test GraphQL operations** in Hasura console first
2. **Follow naming conventions** consistently
3. **Use hierarchical fragments** (Core → Extended → Detailed)
4. **Include proper error handling** in mutations
5. **Add analytics queries** for business insights
6. **Use subscriptions** for real-time features
7. **Generate types** after every GraphQL change
8. **Document complex operations** with comments
9. **Test with realistic data** volumes
10. **Consider performance** implications of deep queries

## 🔗 Related Documentation

- [Naming Conventions Guide](./NAMING_CONVENTIONS.md)
- [Hasura Documentation](./README.md)
- [Domain Structure Guide](../domains/README.md)
- [Component Development Guide](../components/README.md)
