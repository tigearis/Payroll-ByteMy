# GraphQL Fragment Naming Conventions

## Overview
This document establishes standardized naming conventions for GraphQL fragments across all domains in the Payroll Matrix system. Consistent fragment naming improves code maintainability, reduces confusion, and enhances developer productivity.

## Core Naming Principles

### 1. Fragment Name Structure
```
fragment {EntityName}{Purpose} on {graphql_type} {
```

**Components:**
- **EntityName**: PascalCase name of the primary entity (User, Client, Payroll, etc.)
- **Purpose**: Descriptive suffix indicating the fragment's intended use
- **graphql_type**: Exact GraphQL type name from schema (lowercase with underscores)

### 2. Purpose Suffixes (Ordered by Complexity)

#### **Minimal Fragments** (1-3 fields)
- `{Entity}Minimal` - Absolute minimum fields (id, name)
- `{Entity}Core` - Essential fields only (id, name, key identifiers)

#### **Basic Fragments** (4-8 fields)
- `{Entity}Basic` - Standard fields for most operations
- `{Entity}Summary` - Summary view with key metrics
- `{Entity}ListItem` - Optimized for list/table display

#### **Extended Fragments** (9-15 fields)
- `{Entity}Detailed` - Comprehensive single-entity data
- `{Entity}WithRelations` - Includes immediate relationships
- `{Entity}Complete` - Most comprehensive view available

#### **Specialized Fragments** (Variable fields)
- `{Entity}ForAudit` - Audit-specific fields only
- `{Entity}ForAssignment` - Fields needed for assignments
- `{Entity}ForDashboard` - Dashboard display optimization
- `{Entity}TableRow` - Table/grid display format
- `{Entity}Card` - Card component display
- `{Entity}Profile` - User profile specific fields

### 3. Cross-Domain Relationships
- `{Entity}With{RelatedEntity}` - Include specific related entity
- `{Entity}With{Relationship}` - Include specific relationship type

## Domain-Specific Conventions

### Users Domain
```graphql
# Hierarchy: Minimal → Core → Basic → WithRole → Profile → Complete
fragment UserMinimal on users          # id, name, email
fragment UserCore on users             # + role, isActive
fragment UserBasic on users            # + createdAt, updatedAt
fragment UserWithRole on users         # + assignedRoles relationship
fragment UserProfile on users          # + username, image, manager
fragment UserComplete on users         # + all relationships and audit data

# Specialized fragments
fragment UserForAudit on users         # Audit-safe fields only
fragment UserListItem on users         # Optimized for user lists
fragment UserTableRow on users         # Table display format
fragment UserCard on users             # User card component
fragment UserWithManager on users      # Include manager relationship
```

### Clients Domain
```graphql
# Hierarchy: Minimal → Basic → WithConsultant → Detailed → Complete
fragment ClientMinimal on clients      # id, name, active
fragment ClientBasic on clients        # + contact info, dates
fragment ClientWithConsultant on clients # + consultant relationships
fragment ClientDetailed on clients     # + payroll summary stats
fragment ClientComplete on clients     # + all payrolls and notes

# Specialized fragments
fragment ClientListItem on clients     # List display optimization
fragment ClientCard on clients         # Dashboard card format
fragment ClientForAudit on clients     # Audit compliance fields
```

### Payrolls Domain
```graphql
# Hierarchy: Minimal → Basic → Detailed → WithAllRelations → Complete
fragment PayrollMinimal on payrolls    # id, name, status
fragment PayrollBasic on payrolls      # + client, dates, counts
fragment PayrollDetailed on payrolls   # + consultant assignments
fragment PayrollWithAllRelations on payrolls # + all FK relationships
fragment PayrollComplete on payrolls   # + dates, notes, versions

# Specialized fragments
fragment PayrollListItem on payrolls   # List display optimization
fragment PayrollTableRow on payrolls   # Table format
fragment PayrollDashboardCard on payrolls # Dashboard display
fragment PayrollForAssignment on payrolls # Assignment operations
fragment PayrollForAudit on payrolls   # Audit compliance
fragment PayrollWorkload on payrolls   # Consultant workload views
```

## Fragment Organization Rules

### 1. File Structure
```
domains/{domain}/graphql/fragments.graphql
shared/graphql/fragments.graphql
```

### 2. Fragment Ordering in Files
1. **Minimal fragments** (least fields)
2. **Basic fragments** (building up complexity)
3. **Extended fragments** (comprehensive views)
4. **Specialized fragments** (specific use cases)
5. **Cross-domain fragments** (relationships)

### 3. Fragment Dependencies
- Fragments can extend other fragments using spread syntax
- Always extend simpler fragments when appropriate
- Document fragment inheritance in comments

```graphql
# Good: Building up complexity
fragment UserMinimal on users {
  id
  name
  email
}

fragment UserBasic on users {
  ...UserMinimal
  role
  isActive
  createdAt
}

fragment UserProfile on users {
  ...UserBasic
  username
  image
  managerUser {
    ...UserMinimal
  }
}
```

## Naming Examples by Use Case

### List/Table Display
- `{Entity}ListItem` - Optimized for list display
- `{Entity}TableRow` - Table row format
- `{Entity}SearchResult` - Search results format

### Dashboard/Cards
- `{Entity}DashboardCard` - Dashboard card display
- `{Entity}Summary` - Summary widgets
- `{Entity}Stats` - Statistics display

### Forms/Editing
- `{Entity}ForEdit` - Form editing fields
- `{Entity}ForCreate` - Creation form fields
- `{Entity}FormFields` - Generic form fields

### Relationships
- `{Entity}WithManager` - Include manager relationship
- `{Entity}WithTeam` - Include team relationships
- `{Entity}WithPayrolls` - Include payroll relationships

## Deprecated Patterns (Avoid)

❌ **Avoid These Patterns:**
```graphql
# Too generic
fragment Data on users
fragment Info on clients

# Unclear purpose
fragment UserThing on users
fragment ClientStuff on clients

# Inconsistent naming
fragment user_minimal on users  # Use PascalCase
fragment ClientBASIC on clients # Use consistent case
fragment Payroll_Details on payrolls # No underscores in names
```

✅ **Use These Instead:**
```graphql
fragment UserMinimal on users
fragment ClientBasic on clients
fragment PayrollDetailed on payrolls
```

## Migration Strategy

### Phase 1: Document Current Fragments
- Audit all existing fragments
- Categorize by current naming pattern
- Identify inconsistencies

### Phase 2: Establish New Fragments
- Create new fragments following conventions
- Update generated types
- Test in development

### Phase 3: Gradual Migration
- Update operations to use new fragments
- Deprecate old fragments with comments
- Remove deprecated fragments after full migration

## Benefits of Standardized Naming

1. **Predictability** - Developers can guess fragment names
2. **Discoverability** - Easier to find appropriate fragments
3. **Maintainability** - Clear hierarchy and relationships
4. **Performance** - Optimized fragments for specific use cases
5. **Code Reuse** - Consistent fragments promote reusability

## Validation

Fragment names should be validated against these rules:
- PascalCase formatting
- Clear entity + purpose structure
- Appropriate complexity level
- No deprecated patterns
- Consistent with domain conventions

---

*This document is part of the Priority 3 Technical Debt resolution (2025-06-27)*
*Review and update quarterly or when adding new domains*