# Hasura Documentation

## Overview

This directory contains comprehensive documentation for working with Hasura GraphQL Engine in the Payroll ByteMy system. Hasura provides the GraphQL API layer that connects our Next.js frontend with the PostgreSQL database.

## 📚 Documentation Index

### Core Guides

- **[Naming Conventions](./NAMING_CONVENTIONS.md)** - Complete guide to Hasura and GraphQL naming standards
- **[Development Workflow](./GRAPHQL_DEVELOPMENT_WORKFLOW.md)** - Step-by-step workflow for GraphQL development
- **[Hasura Setup](./hasura_action_setup.md)** - Initial Hasura configuration and actions
- **[Hasura Documentation](./HASURA_DOCUMENTATION.md)** - Comprehensive Hasura implementation details

### Quick Reference

| Topic                | Description                               | Link                                                                           |
| -------------------- | ----------------------------------------- | ------------------------------------------------------------------------------ |
| **Field Naming**     | camelCase for GraphQL, snake_case for DB  | [Naming Guide](./NAMING_CONVENTIONS.md#graphql-field-naming)                   |
| **Creating Tables**  | Step-by-step table creation process       | [Workflow Guide](./GRAPHQL_DEVELOPMENT_WORKFLOW.md#creating-new-tables)        |
| **Writing Queries**  | GraphQL query patterns and best practices | [Workflow Guide](./GRAPHQL_DEVELOPMENT_WORKFLOW.md#writing-graphql-operations) |
| **Domain Structure** | Organizing GraphQL operations by domain   | [Development Guide](./GRAPHQL_DEVELOPMENT_WORKFLOW.md#domain-structure)        |
| **Troubleshooting**  | Common issues and solutions               | [Naming Guide](./NAMING_CONVENTIONS.md#troubleshooting)                        |

## 🚀 Quick Start

### 1. Setting Up a New Table

```bash
# 1. Create database migration
cd database/migrations
touch $(date +%Y%m%d_%H%M%S)_add_new_table.sql

# 2. Apply to Hasura
cd hasura
hasura migrate apply
hasura metadata reload

# 3. Configure metadata with naming conventions
# See: NAMING_CONVENTIONS.md

# 4. Apply metadata
hasura metadata apply
```

### 2. Creating GraphQL Operations

```bash
# 1. Create domain structure
mkdir -p domains/new-domain/graphql
touch domains/new-domain/graphql/{fragments,queries,mutations,subscriptions}.graphql

# 2. Write GraphQL operations
# See: GRAPHQL_DEVELOPMENT_WORKFLOW.md

# 3. Generate types
pnpm codegen
```

## 🎯 Key Concepts

### Naming Consistency

The system uses a dual naming approach:

- **Database**: `snake_case` (e.g., `user_id`, `created_at`)
- **GraphQL**: `camelCase` (e.g., `userId`, `createdAt`)
- **Hasura**: Bridges the gap with custom field names

### Domain-Driven Structure

```
domains/
├── users/
├── payrolls/
├── clients/
└── audit/
    └── graphql/
        ├── fragments.graphql    # Reusable field sets
        ├── queries.graphql      # Data retrieval
        ├── mutations.graphql    # Data modification
        ├── subscriptions.graphql # Real-time updates
        └── generated/           # Auto-generated types
```

### Fragment Hierarchy

```graphql
# Core: Essential fields only
fragment UserCore on users {
  id
  name
  email
}

# Extended: With relationships
fragment UserWithRoles on users {
  ...UserCore
  userRoles { ... }
}

# Detailed: Full relationships
fragment UserWithAllRelations on users {
  ...UserWithRoles
  # All relationships
}
```

## 📋 Standard Patterns

### Table Configuration Template

```yaml
table:
  name: table_name
  schema: public
configuration:
  column_config:
    created_at:
      custom_name: createdAt
    # Add all snake_case -> camelCase mappings
  custom_column_names:
    created_at: createdAt
    # Mirror column_config
  custom_root_fields:
    select: tableNames
    select_by_pk: tableName
    insert_one: insertTableName
    # Standard CRUD operations
```

### Query Pattern

```graphql
query GetEntities(
  $where: entities_bool_exp
  $order_by: [entities_order_by!]
  $limit: Int
  $offset: Int
) {
  entities(where: $where, order_by: $order_by, limit: $limit, offset: $offset) {
    ...EntityCore
  }
  entitiesAggregate(where: $where) {
    aggregate {
      count
    }
  }
}
```

### Mutation Pattern

```graphql
mutation CreateEntity($object: entities_insert_input!) {
  insertEntity(object: $object) {
    ...EntityCore
  }
}
```

## 🔧 Development Tools

### Hasura Console

```bash
cd hasura
hasura console
```

Access at: `http://localhost:9695`

### Code Generation

```bash
# Generate all domain types
pnpm codegen

# Watch mode during development
pnpm codegen --watch
```

### Metadata Management

```bash
# Export current metadata
hasura metadata export

# Apply metadata changes
hasura metadata apply

# Reload metadata
hasura metadata reload
```

## 🐛 Common Issues & Solutions

### Field Name Errors

```
Error: Cannot query field "display_name" on type "roles"
```

**Solution**: Use camelCase custom field name:

```graphql
# ❌ Wrong
displayName: display_name

# ✅ Correct
displayName: displayName
```

### Mutation Name Errors

```
Error: Cannot query field "insert_users_one" on type "mutation_root"
```

**Solution**: Use custom root field name:

```graphql
# ❌ Wrong
insert_users_one(object: $object)

# ✅ Correct
insertUser(object: $object)
```

### Relationship Errors

```
Error: Cannot query field "user_roles" on type "users"
```

**Solution**: Use custom relationship name:

```graphql
# ❌ Wrong
user_roles { ... }

# ✅ Correct
userRoles { ... }
```

## 🎯 Best Practices

1. **Always test in Hasura console first** before adding to code
2. **Follow naming conventions consistently** across all operations
3. **Use hierarchical fragments** for better reusability
4. **Include aggregate queries** for pagination and analytics
5. **Add proper error handling** in all mutations
6. **Document complex operations** with comments
7. **Generate types after every change** to maintain type safety

## 🔗 External Resources

- [Hasura Documentation](https://hasura.io/docs/)
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)

## 📝 Contributing

When adding new documentation:

1. Follow the established patterns
2. Include practical examples
3. Test all code snippets
4. Update the index above
5. Cross-reference related guides

## 🔄 Maintenance

This documentation should be updated when:

- New naming patterns are established
- Hasura configuration changes
- New development patterns emerge
- Common issues are discovered

Last updated: December 2024
