# Hasura Naming Conventions & GraphQL Development Guide

## Overview

This document outlines the standardized naming conventions for Hasura metadata and GraphQL operations in the Payroll ByteMy system. Following these conventions ensures consistency, maintainability, and optimal developer experience.

## 🎯 Core Principles

1. **Consistency**: All naming follows predictable patterns
2. **CamelCase for GraphQL**: Client-facing fields use camelCase
3. **Snake_case for Database**: Database fields remain snake_case
4. **Custom Field Mapping**: Hasura bridges the naming gap
5. **Semantic Clarity**: Names clearly indicate their purpose

## 📋 Table of Contents

- [Hasura Metadata Naming](#hasura-metadata-naming)
- [GraphQL Field Naming](#graphql-field-naming)
- [Creating New Tables](#creating-new-tables)
- [Writing GraphQL Operations](#writing-graphql-operations)
- [Domain Structure](#domain-structure)
- [Best Practices](#best-practices)
- [Common Patterns](#common-patterns)
- [Troubleshooting](#troubleshooting)

## 🏗️ Hasura Metadata Naming

### Table Configuration Structure

Every table in Hasura should follow this metadata structure:

```yaml
table:
  name: table_name
  schema: public
configuration:
  column_config:
    created_at:
      custom_name: createdAt
    updated_at:
      custom_name: updatedAt
    display_name:
      custom_name: displayName
    # Add all snake_case fields that should be camelCase
  custom_column_names:
    created_at: createdAt
    updated_at: updatedAt
    display_name: displayName
    # Mirror the column_config section
  custom_root_fields:
    delete: deleteTableNames
    delete_by_pk: deleteTableName
    insert: insertTableNames
    insert_one: insertTableName
    select: tableNames
    select_aggregate: tableNamesAggregate
    select_by_pk: tableName
    update: updateTableNames
    update_by_pk: updateTableName
```

### Field Naming Patterns

| Database Field  | GraphQL Field  | Rule                 |
| --------------- | -------------- | -------------------- |
| `created_at`    | `createdAt`    | Timestamp fields     |
| `updated_at`    | `updatedAt`    | Timestamp fields     |
| `user_id`       | `userId`       | Foreign key fields   |
| `display_name`  | `displayName`  | Descriptive fields   |
| `is_active`     | `isActive`     | Boolean fields       |
| `resource_type` | `resourceType` | Type/category fields |

### Relationship Naming

```yaml
array_relationships:
  - name: rolePermissions # camelCase
    using:
      foreign_key_constraint_on:
        column: role_id
        table:
          name: role_permissions # database table name
          schema: public

object_relationships:
  - name: user # singular, camelCase
    using:
      foreign_key_constraint_on: user_id
```

### Root Field Naming Patterns

| Operation       | Pattern                | Example                            |
| --------------- | ---------------------- | ---------------------------------- |
| **Select Many** | `tableName` (plural)   | `users`, `roles`, `permissions`    |
| **Select One**  | `tableName` (singular) | `user`, `role`, `permission`       |
| **Insert Many** | `insertTableNames`     | `insertUsers`, `insertRoles`       |
| **Insert One**  | `insertTableName`      | `insertUser`, `insertRole`         |
| **Update Many** | `updateTableNames`     | `updateUsers`, `updateRoles`       |
| **Update One**  | `updateTableName`      | `updateUser`, `updateRole`         |
| **Delete Many** | `deleteTableNames`     | `deleteUsers`, `deleteRoles`       |
| **Delete One**  | `deleteTableName`      | `deleteUser`, `deleteRole`         |
| **Aggregate**   | `tableNamesAggregate`  | `usersAggregate`, `rolesAggregate` |

## 📝 GraphQL Field Naming

### Fragment Naming

```graphql
# Core fragments - basic fields only
fragment UserCore on users {
  id
  name
  email
  isActive
  createdAt
  updatedAt
}

# Extended fragments - with relationships
fragment UserWithRoles on users {
  ...UserCore
  userRoles {
    role {
      ...RoleCore
    }
  }
}

# Detailed fragments - with nested relationships
fragment UserWithAllRelations on users {
  ...UserWithRoles
  teamMembers {
    ...UserCore
  }
  workSchedules {
    ...WorkScheduleCore
  }
}
```

### Query Naming

```graphql
# Get operations - retrieving data
query GetUsers($where: users_bool_exp, $limit: Int) {
  users(where: $where, limit: $limit) {
    ...UserCore
  }
}

# Search operations - filtering/searching
query SearchUsersByEmail($emailPattern: String!) {
  users(where: { email: { _ilike: $emailPattern } }) {
    ...UserCore
  }
}

# Analytics operations - aggregations
query GetUserAnalytics($startDate: timestamptz!) {
  usersAggregate(where: { createdAt: { _gte: $startDate } }) {
    aggregate {
      count
    }
  }
}
```

### Mutation Naming

```graphql
# Create operations
mutation CreateUser($object: users_insert_input!) {
  insertUser(object: $object) {
    ...UserCore
  }
}

# Update operations
mutation UpdateUser($id: uuid!, $set: users_set_input!) {
  updateUser(pk_columns: { id: $id }, _set: $set) {
    ...UserCore
  }
}

# Delete operations
mutation DeleteUser($id: uuid!) {
  deleteUser(id: $id) {
    id
  }
}

# Business logic operations
mutation AssignUserRole($userId: uuid!, $roleId: uuid!) {
  insertUserRole(object: { userId: $userId, roleId: $roleId }) {
    ...UserRoleWithDetails
  }
}
```

### Subscription Naming

```graphql
# Real-time updates
subscription UsersUpdated {
  users(order_by: { updatedAt: desc }, limit: 10) {
    ...UserCore
  }
}

# Filtered subscriptions
subscription UserRolesUpdated($userId: uuid!) {
  userRoles(where: { userId: { _eq: $userId } }) {
    ...UserRoleWithDetails
  }
}
```

## 🆕 Creating New Tables

### Step 1: Create Database Table

```sql
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
```

### Step 2: Track Table in Hasura

```bash
cd hasura
hasura metadata apply
```

### Step 3: Create Metadata Configuration

Create `hasura/metadata/databases/default/tables/public_example_entities.yaml`:

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
# Add permissions as needed
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
```

### Step 4: Apply Metadata

```bash
cd hasura
hasura metadata apply
```

## 📁 Domain Structure

### Creating a New Domain

1. **Create domain directory structure**:

```
domains/
└── new-domain/
    ├── components/
    │   └── index.ts
    ├── graphql/
    │   ├── fragments.graphql
    │   ├── mutations.graphql
    │   ├── queries.graphql
    │   ├── subscriptions.graphql
    │   └── generated/
    ├── services/
    ├── types/
    ├── index.ts
    └── README.md
```

2. **Add to codegen configuration** (`config/codegen.ts`):

```typescript
{
  [`./domains/new-domain/graphql/generated/`]: {
    preset: 'client',
    documents: [`./domains/new-domain/graphql/**/*.graphql`],
    plugins: [],
    presetConfig: {
      gqlTagName: 'gql',
    },
  },
}
```

## ✍️ Writing GraphQL Operations

### Fragment Guidelines

```graphql
# domains/new-domain/graphql/fragments.graphql

# 1. Core fragment - essential fields only
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

# 2. Extended fragment - with direct relationships
fragment ExampleEntityWithUser on example_entities {
  ...ExampleEntityCore
  user {
    id
    name
    email
  }
}

# 3. Detailed fragment - with nested relationships
fragment ExampleEntityWithAllRelations on example_entities {
  ...ExampleEntityWithUser
  # Add other relationships as needed
}
```

### Query Guidelines

```graphql
# domains/new-domain/graphql/queries.graphql

# Basic queries
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

# Single entity query
query GetExampleEntity($id: uuid!) {
  exampleEntity(id: $id) {
    ...ExampleEntityWithAllRelations
  }
}

# Search queries
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
    nodes {
      entityType
    }
  }
}
```

### Mutation Guidelines

```graphql
# domains/new-domain/graphql/mutations.graphql

# Create operations
mutation CreateExampleEntity($object: example_entities_insert_input!) {
  insertExampleEntity(object: $object) {
    ...ExampleEntityCore
  }
}

# Bulk create
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

# Conditional update
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

# Soft delete (if using isActive pattern)
mutation SoftDeleteExampleEntity($id: uuid!) {
  updateExampleEntity(pk_columns: { id: $id }, _set: { isActive: false }) {
    ...ExampleEntityCore
  }
}
```

### Subscription Guidelines

```graphql
# domains/new-domain/graphql/subscriptions.graphql

# Real-time updates
subscription ExampleEntitiesUpdated {
  exampleEntities(order_by: { updatedAt: desc }, limit: 10) {
    ...ExampleEntityCore
  }
}

# Filtered subscriptions
subscription ExampleEntitiesByUser($userId: uuid!) {
  exampleEntities(
    where: { userId: { _eq: $userId } }
    order_by: { updatedAt: desc }
  ) {
    ...ExampleEntityCore
  }
}

# Status-based subscriptions
subscription ActiveExampleEntities {
  exampleEntities(where: { isActive: { _eq: true } }, order_by: { name: asc }) {
    ...ExampleEntityCore
  }
}
```

## 🎯 Best Practices

### 1. Field Naming Consistency

```graphql
# ✅ DO: Use consistent camelCase for GraphQL
fragment UserCore on users {
  id
  firstName # camelCase
  lastName # camelCase
  isActive # boolean prefix
  createdAt # timestamp suffix
  updatedAt # timestamp suffix
}

# ❌ DON'T: Mix naming conventions
fragment UserCore on users {
  id
  first_name # snake_case in GraphQL
  LastName # PascalCase
  active # missing boolean prefix
  created # incomplete timestamp name
}
```

### 2. Fragment Organization

```graphql
# ✅ DO: Hierarchical fragment structure
fragment UserCore on users {
  # Essential fields only
}

fragment UserWithProfile on users {
  ...UserCore
  # Profile-specific fields
}

fragment UserWithRoles on users {
  ...UserCore
  # Role relationships
}

# ❌ DON'T: Monolithic fragments
fragment UserEverything on users {
  # All fields and relationships mixed together
}
```

### 3. Query Optimization

```graphql
# ✅ DO: Use specific fragments for different use cases
query GetUsersForList {
  users {
    ...UserCore # Only essential fields for lists
  }
}

query GetUserDetails($id: uuid!) {
  user(id: $id) {
    ...UserWithAllRelations # Full details for single view
  }
}

# ❌ DON'T: Over-fetch data
query GetUsersForList {
  users {
    ...UserWithAllRelations # Too much data for a list
  }
}
```

### 4. Variable Naming

```graphql
# ✅ DO: Descriptive variable names
query SearchUsers(
  $searchTerm: String!
  $isActive: Boolean
  $limit: Int = 20
  $offset: Int = 0
) {
  # Query implementation
}

# ❌ DON'T: Generic variable names
query SearchUsers(
  $term: String!
  $active: Boolean
  $l: Int = 20
  $o: Int = 0
) {
  # Query implementation
}
```

## 🔧 Common Patterns

### 1. Pagination Pattern

```graphql
query GetPaginatedUsers(
  $limit: Int = 20
  $offset: Int = 0
  $where: users_bool_exp
  $order_by: [users_order_by!] = [{ createdAt: desc }]
) {
  users(limit: $limit, offset: $offset, where: $where, order_by: $order_by) {
    ...UserCore
  }
  usersAggregate(where: $where) {
    aggregate {
      count
    }
  }
}
```

### 2. Search Pattern

```graphql
query SearchEntities($searchTerm: String!) {
  entities(
    where: {
      _or: [
        { name: { _ilike: $searchTerm } }
        { displayName: { _ilike: $searchTerm } }
        { description: { _ilike: $searchTerm } }
      ]
    }
    order_by: { name: asc }
  ) {
    ...EntityCore
  }
}
```

### 3. Audit Pattern

```graphql
mutation UpdateEntityWithAudit(
  $id: uuid!
  $set: entities_set_input!
  $auditLog: audit_audit_log_insert_input!
) {
  updateEntity(pk_columns: { id: $id }, _set: $set) {
    ...EntityCore
  }
  insertAuditLog(object: $auditLog) {
    id
  }
}
```

### 4. Soft Delete Pattern

```graphql
mutation SoftDeleteEntity($id: uuid!) {
  updateEntity(
    pk_columns: { id: $id }
    _set: { isActive: false, updatedAt: "now()" }
  ) {
    ...EntityCore
  }
}
```

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. Field Name Mismatch

**Error**: `Cannot query field "display_name" on type "roles". Did you mean "displayName"?`

**Solution**: Update the GraphQL query to use the custom field name:

```graphql
# ❌ Wrong
fragment RoleCore on roles {
  display_name
}

# ✅ Correct
fragment RoleCore on roles {
  displayName
}
```

#### 2. Mutation Name Mismatch

**Error**: `Cannot query field "insert_users_one" on type "mutation_root"`

**Solution**: Use the custom root field name:

```graphql
# ❌ Wrong
mutation CreateUser($object: users_insert_input!) {
  insert_users_one(object: $object) {
    ...UserCore
  }
}

# ✅ Correct
mutation CreateUser($object: users_insert_input!) {
  insertUser(object: $object) {
    ...UserCore
  }
}
```

#### 3. Relationship Name Mismatch

**Error**: `Cannot query field "user_roles" on type "users"`

**Solution**: Use the custom relationship name:

```graphql
# ❌ Wrong
fragment UserWithRoles on users {
  user_roles {
    role {
      name
    }
  }
}

# ✅ Correct
fragment UserWithRoles on users {
  userRoles {
    role {
      name
    }
  }
}
```

#### 4. Aggregate Field Mismatch

**Error**: `Cannot query field "user_roles_aggregate" on type "roles"`

**Solution**: Use the relationship-based aggregate name:

```graphql
# ❌ Wrong
fragment RoleWithStats on roles {
  user_roles_aggregate {
    aggregate {
      count
    }
  }
}

# ✅ Correct
fragment RoleWithStats on roles {
  userRoles_aggregate {
    aggregate {
      count
    }
  }
}
```

### Debugging Steps

1. **Check Hasura Console**: Verify the actual field names in the GraphQL explorer
2. **Review Metadata**: Ensure custom field names are properly configured
3. **Validate Schema**: Run `pnpm codegen` to check for validation errors
4. **Test Queries**: Use the Hasura console to test queries before adding to code

## 📚 Additional Resources

- [Hasura Custom Field Names Documentation](https://hasura.io/docs/latest/schema/postgres/custom-field-names/)
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)
- [Domain-Driven Design with GraphQL](https://www.apollographql.com/docs/apollo-server/schema/schema-design/)

## 🔄 Updating This Guide

This guide should be updated whenever:

- New naming patterns are established
- Hasura configuration changes
- Domain structure evolves
- Common issues are discovered

Last updated: [Current Date]
