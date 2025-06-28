# Complete GraphQL Operations Rebuild - Systematic Approach

You are tasked with completely rebuilding all GraphQL queries, mutations, subscriptions, and fragments for a Next.js application. This is a fresh start - analyze the existing codebase, understand the requirements, and create the most efficient GraphQL operations possible.

## Phase 1: Comprehensive Analysis and Documentation

### Step 1: Complete Codebase Audit

1. **Scan the entire application structure:**

   - All pages (`/pages` or `/app` directory)
   - All custom hooks (`/hooks` directory)
   - All components that interact with data
   - All context providers and state management
   - All API routes that use GraphQL

2. **For each file that interacts with data, document:**

   - **Purpose**: What does this page/component do?
   - **Data Requirements**: What specific data does it need to display/manipulate?
   - **User Actions**: What operations can users perform (create, read, update, delete)?
   - **State Management**: How does it handle loading, error, and success states?
   - **Data Flow**: How does data flow into and out of this component?

3. **Create a comprehensive data requirements document:**

   ```typescript
   interface ComponentDataRequirements {
     componentName: string;
     filePath: string;
     purpose: string;
     dataNeeds: {
       displayData: string[]; // What fields need to be shown
       inputData: string[]; // What data can be modified
       relationshipData: string[]; // What related data is needed
       computedData: string[]; // What calculations are needed
     };
     operations: {
       queries: string[]; // What data needs to be fetched
       mutations: string[]; // What data can be modified
       subscriptions: string[]; // What data needs real-time updates
     };
     permissions: {
       roles: string[]; // Which roles can access this
       conditions: string[]; // Any conditional access rules
     };
   }
   ```

### Step 2: Hasura Metadata Analysis

1. **Extract and analyze Hasura metadata:**

   - Download current Hasura metadata (`hasura metadata export`)
   - Analyze all tables and their relationships
   - Document all permissions for each role
   - Identify all custom functions and computed fields
   - Map all foreign key relationships

2. **Create a complete schema documentation:**

   ```typescript
   interface HasuraSchemaAnalysis {
     tables: {
       [tableName: string]: {
         columns: Array<{
           name: string;
           type: string;
           nullable: boolean;
           defaultValue?: any;
         }>;
         relationships: Array<{
           name: string;
           type: "object" | "array";
           table: string;
           using: "foreign_key" | "manual";
         }>;
         permissions: {
           [role: string]: {
             select: string[] | boolean;
             insert: string[] | boolean;
             update: string[] | boolean;
             delete: boolean;
             filter?: any;
           };
         };
         computedFields?: Array<{
           name: string;
           function: string;
           returnType: string;
         }>;
       };
     };
     customFunctions: Array<{
       name: string;
       inputTypes: any[];
       returnType: string;
       permissions: string[];
     }>;
   }
   ```

3. **Identify optimization opportunities:**
   - Find tables that are frequently joined
   - Identify common data access patterns
   - Spot potential N+1 query problems
   - Note aggregation and computed field usage

## Phase 2: Requirements Documentation

### Step 3: Create Detailed Data Flow Documentation

For each component/page, create detailed documentation:

```markdown
## Component: StaffManagementPage

**File**: `/pages/staff/index.tsx`
**Purpose**: Display and manage staff members

### Data Requirements Analysis:

**Display Data Needed:**

- Staff list: id, name, email, role, department, status, createdAt
- Manager relationships: manager.id, manager.name
- Department info: department.name, department.code
- User permissions for current user

**Input Data Required:**

- New staff creation: name, email, role, departmentId, managerId
- Staff updates: any of the above fields
- Bulk operations: array of staff IDs

**Real-time Requirements:**

- Staff status changes (online/offline)
- New staff additions
- Staff updates from other users

**Permission Requirements:**

- admin: full access
- manager: access to own department staff
- staff: read-only access to department colleagues

### Optimal GraphQL Strategy:

**Primary Query**: GetStaffList

- Include manager relationship (one level)
- Include department basic info
- Exclude unnecessary computed fields
- Use fragments for staff base info

**Mutations Needed**:

- CreateStaff, UpdateStaff, DeleteStaff
- BulkUpdateStaffStatus

**Subscriptions Needed**:

- StaffStatusUpdates (real-time status changes)

**Fragments to Create**:

- StaffBaseInfo, ManagerInfo, DepartmentInfo
```

### Step 4: Identify Common Patterns and Fragments

1. **Analyze data reuse patterns:**

   - Which entity fields are used together frequently?
   - What relationship data is commonly needed?
   - Which computed fields are actually used?

2. **Design efficient fragment strategy:**

   ```graphql
   # Base entity fragments
   fragment UserBase on users {
     id
     email
     name
     role
     createdAt
     updatedAt
   }

   fragment StaffProfile on users {
     ...UserBase
     department {
       id
       name
       code
     }
     manager {
       id
       name
       email
     }
   }

   # Minimal fragments for lists
   fragment UserListItem on users {
     id
     name
     email
     role
     status
   }
   ```

## Phase 3: Efficient GraphQL Operations Creation

### Step 5: Build Optimal Queries

For each component, create the most efficient queries possible:

1. **Query Optimization Principles:**

   - Fetch only required fields for the specific use case
   - Use relationships efficiently (avoid N+1 queries)
   - Implement proper pagination where needed
   - Use fragments to avoid duplication
   - Leverage Hasura's aggregation capabilities when needed
   - Avoid client-side calculations that can be done server-side

2. **Example Optimized Query Creation:**

   ```graphql
   # BEFORE (inefficient)
   query GetAllStaffMembers {
     users {
       id
       email
       name
       role
       createdAt
       updatedAt
       lastLoginAt
       profile
       settings
       department {
         id
         name
         code
         description
         budget
         headCount
         location
       }
       manager {
         id
         email
         name
         role
         department {
           name
         }
       }
       directReports {
         id
         name
         email
         role
       }
     }
   }

   # AFTER (optimized)
   query GetStaffList($limit: Int, $offset: Int, $where: users_bool_exp) {
     users(limit: $limit, offset: $offset, where: $where) {
       ...StaffListItem
     }
     users_aggregate(where: $where) {
       aggregate {
         count
       }
     }
   }

   fragment StaffListItem on users {
     id
     name
     email
     role
     status
     department {
       id
       name
     }
     manager {
       id
       name
     }
   }
   ```

### Step 6: Build Efficient Mutations

1. **Mutation Design Principles:**

   - Return only necessary data after mutations
   - Use input types properly
   - Handle optimistic updates where appropriate
   - Implement proper error handling
   - Use upsert operations where applicable

2. **Example Optimized Mutations:**

   ```graphql
   mutation CreateStaffMember($input: users_insert_input!) {
     insert_users_one(object: $input) {
       ...StaffListItem
     }
   }

   mutation UpdateStaffMember($id: uuid!, $updates: users_set_input!) {
     update_users_by_pk(pk_columns: { id: $id }, _set: $updates) {
       ...StaffListItem
     }
   }

   mutation BulkUpdateStaffStatus($ids: [uuid!]!, $status: String!) {
     update_users(where: { id: { _in: $ids } }, _set: { status: $status }) {
       returning {
         id
         status
       }
     }
   }
   ```

### Step 7: Implement Smart Subscriptions

1. **Subscription Strategy:**

   - Only subscribe to data that truly needs real-time updates
   - Use subscription filters to reduce unnecessary updates
   - Implement proper cleanup
   - Consider using polling for less critical real-time needs

2. **Example Efficient Subscriptions:**

   ```graphql
   subscription StaffStatusUpdates($departmentId: uuid) {
     users(where: { department_id: { _eq: $departmentId } }) {
       id
       status
       lastSeenAt
     }
   }

   subscription NewStaffNotifications($userId: uuid!) {
     notifications(
       where: {
         user_id: { _eq: $userId }
         type: { _eq: "new_staff" }
         read: { _eq: false }
       }
       order_by: { created_at: desc }
       limit: 10
     ) {
       id
       message
       created_at
       metadata
     }
   }
   ```

## Phase 4: Implementation Strategy

### Step 8: File Organization and Structure

1. **Create organized GraphQL file structure:**

   ```
   /graphql/
   ├── fragments/
   │   ├── user.fragments.ts
   │   ├── staff.fragments.ts
   │   ├── department.fragments.ts
   │   └── index.ts
   ├── queries/
   │   ├── user.queries.ts
   │   ├── staff.queries.ts
   │   ├── department.queries.ts
   │   └── index.ts
   ├── mutations/
   │   ├── user.mutations.ts
   │   ├── staff.mutations.ts
   │   ├── department.mutations.ts
   │   └── index.ts
   ├── subscriptions/
   │   ├── user.subscriptions.ts
   │   ├── staff.subscriptions.ts
   │   └── index.ts
   └── types/
       ├── generated.ts
       └── custom.ts
   ```

2. **Generate TypeScript types:**

   ```bash
   # Use GraphQL Code Generator
   pnpm add -D @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations @graphql-codegen/typescript-react-apollo
   ```

### Step 9: Hook Implementation

1. **Create efficient custom hooks:**

   ```typescript
   // useStaffManagement.ts
   export function useStaffManagement(filters?: StaffFilters) {
     const { data, loading, error, refetch } = useQuery(GET_STAFF_LIST, {
       variables: { where: buildWhereClause(filters) },
       fetchPolicy: "cache-and-network",
     });

     const [createStaff] = useMutation(CREATE_STAFF, {
       update: (cache, { data }) => {
         // Efficient cache update
         cache.modify({
           fields: {
             users(existingUsers = []) {
               const newUserRef = cache.writeFragment({
                 data: data.insert_users_one,
                 fragment: STAFF_LIST_ITEM_FRAGMENT,
               });
               return [...existingUsers, newUserRef];
             },
           },
         });
       },
     });

     return {
       staff: data?.users || [],
       loading,
       error,
       createStaff,
       refetch,
     };
   }
   ```

## Phase 5: Testing and Optimization

### Step 10: Performance Testing

1. **Test each operation:**

   - Measure query execution time
   - Check for N+1 queries
   - Validate proper caching behavior
   - Test with large datasets

2. **Optimization validation:**

   ```bash
   # Test query performance
   pnpm run graphql:test-performance

   # Validate generated types
   pnpm run type-check

   # Test all operations against all roles
   pnpm run test:graphql-roles
   ```

## Implementation Checklist

- [ ] **Complete codebase audit** with data requirements documentation
- [ ] **Hasura metadata analysis** and schema documentation
- [ ] **Data flow documentation** for every component/page
- [ ] **Fragment design** for maximum reusability
- [ ] **Optimized queries** - no over-fetching
- [ ] **Efficient mutations** with proper returns
- [ ] **Smart subscriptions** - only where needed
- [ ] **Organized file structure** for maintainability
- [ ] **TypeScript integration** with generated types
- [ ] **Custom hooks** for clean component integration
- [ ] **Performance testing** and validation
- [ ] **Role-based testing** for all operations

## Success Criteria

After completion:

- [ ] All GraphQL operations are optimized and efficient
- [ ] No over-fetching of data
- [ ] No N+1 query problems
- [ ] Proper caching strategy implemented
- [ ] All operations work correctly for all user roles
- [ ] Type safety throughout the application
- [ ] Clean, maintainable code structure
- [ ] Comprehensive documentation for future development

## Notes for Implementation

- **Start with the most critical pages** (authentication, main dashboard)
- **Test each operation** as you build it
- **Document decisions** and optimization reasoning
- **Use pnpm** for all package management
- **Ensure production environment variables** are used
- **Validate against Hasura permissions** for each role
- **Consider implementing query complexity limits** if needed
